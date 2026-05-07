package backspace.display.service.video;

import backspace.display.field.display.Display;
import backspace.display.service.config.DisplayConfig;
import backspace.display.service.repo.Repository;
import backspace.display.video.Video;
import backspace.display.video.VideoPlayMode;
import backspace.display.video.VideoRunnerDisplay;
import backspace.display.video.VideoStatus;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
@Log4j2
public class VideoService {

    private final Repository<VideoDbDto> videoRepository;
    private final VideoFileLayout layout;
    private final Transcoder transcoder;
    private final DisplayConfig displayConfig;
    private final VideoRunnerDisplay videoRunnerDisplay;

    private final ExecutorService transcodeExecutor =
            Executors.newSingleThreadExecutor(r -> {
                Thread t = new Thread(r, "video-transcoder");
                t.setDaemon(true);
                return t;
            });

    public VideoService(Repository<VideoDbDto> videoRepository,
                        VideoFileLayout layout,
                        Transcoder transcoder,
                        DisplayConfig displayConfig,
                        VideoRunnerDisplay videoRunnerDisplay) {
        this.videoRepository = videoRepository;
        this.layout = layout;
        this.transcoder = transcoder;
        this.displayConfig = displayConfig;
        this.videoRunnerDisplay = videoRunnerDisplay;
    }

    @PostConstruct
    void recoverStuckTranscodes() {
        for (VideoDbDto dto : videoRepository.getAll()) {
            if (dto.getStatus() == VideoStatus.TRANSCODING) {
                log.warn("Video {} was TRANSCODING at startup — marking FAILED", dto.getId());
                dto.setStatus(VideoStatus.FAILED);
                dto.setErrorMessage("Transcode interrupted by server restart");
                videoRepository.add(dto);
            }
        }
    }

    @PreDestroy
    void shutdown() {
        transcodeExecutor.shutdown();
        try {
            if (!transcodeExecutor.awaitTermination(5, TimeUnit.SECONDS)) {
                transcodeExecutor.shutdownNow();
            }
        } catch (InterruptedException e) {
            transcodeExecutor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    public Video createVideo(VideoCreationRequest request) {
        Video video = newVideoFromRequest(request);
        video.setStatus(VideoStatus.UPLOADED);
        Video saved = save(video);
        log.info("Created video metadata id={}", saved.getId());
        return saved;
    }

    public Video uploadAndTranscode(MultipartFile file, VideoCreationRequest request) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }
        Video video = newVideoFromRequest(request);
        video.setOriginalFilename(sanitizeFilename(file.getOriginalFilename()));
        video.setOriginalSizeBytes(file.getSize());
        video.setWidth(displayConfig.getWidth());
        video.setHeight(displayConfig.getHeight());
        video.setStatus(VideoStatus.TRANSCODING);

        Path tmp;
        try {
            tmp = Files.createTempFile("video-" + video.getId() + "-", ".upload");
            file.transferTo(tmp.toFile());
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to store upload", e);
        }

        Video saved = save(video);
        Path bin = layout.binFile(saved.getId());
        transcodeExecutor.submit(() -> runTranscode(saved.getId(), tmp, bin));
        return saved;
    }

    private void runTranscode(String videoId, Path tmp, Path bin) {
        try {
            Video v = getVideoById(videoId);
            long frameCount = transcoder.transcode(tmp, bin,
                    v.getWidth(), v.getHeight(), v.getFps(), v.getThreshold());
            v.setFrameCount(frameCount);
            v.setStatus(VideoStatus.READY);
            v.setErrorMessage(null);
            save(v);
            log.info("Video {} READY ({} frames)", videoId, frameCount);
        } catch (Throwable t) {
            log.error("Transcode failed for video {}", videoId, t);
            try {
                Video v = getVideoById(videoId);
                v.setStatus(VideoStatus.FAILED);
                v.setErrorMessage(t.getMessage() != null ? t.getMessage() : t.getClass().getSimpleName());
                save(v);
            } catch (Exception inner) {
                log.error("Failed to record FAILED status for video {}", videoId, inner);
            }
            try { Files.deleteIfExists(bin); } catch (IOException ignored) { }
            if (t instanceof InterruptedException) Thread.currentThread().interrupt();
        } finally {
            try { Files.deleteIfExists(tmp); } catch (IOException ignored) { }
        }
    }

    public Video getVideoById(String videoId) {
        VideoDbDto dto = videoRepository.getById(videoId);
        return VideoToDbDtoMapper.dbDtoToVideo(dto);
    }

    public List<Video> getAllVideos() {
        return videoRepository.getAll().stream()
                .map(VideoToDbDtoMapper::dbDtoToVideo)
                .toList();
    }

    public Video updateVideo(String videoId, VideoCreationRequest request) {
        Objects.requireNonNull(videoId, "Video id cannot be null");
        Objects.requireNonNull(request, "Update request cannot be null");
        Video video = getVideoById(videoId);
        if (request.getName() != null) video.setName(request.getName());
        if (request.getDescription() != null) video.setDescription(request.getDescription());
        if (request.getPlayMode() != null) video.setPlayMode(request.getPlayMode());
        Video saved = save(video);
        log.info("Updated video id={}", saved.getId());
        return saved;
    }

    public void deleteVideo(String videoId) {
        videoRepository.removeById(videoId);
        try {
            Files.deleteIfExists(layout.binFile(videoId));
        } catch (IOException e) {
            log.warn("Failed to delete bin for video {}: {}", videoId, e.getMessage());
        }
        log.info("Deleted video id={}", videoId);
    }

    public synchronized Video runVideo(String videoId) {
        Video video = getVideoById(videoId);
        if (video.getStatus() != VideoStatus.READY) {
            throw new IllegalStateException(
                    "Video " + videoId + " is not READY (status=" + video.getStatus() + ")");
        }
        if (video.getFrameCount() <= 0) {
            throw new IllegalStateException("Video " + videoId + " has no frames");
        }
        if (video.getWidth() != displayConfig.getWidth() || video.getHeight() != displayConfig.getHeight()) {
            log.warn("Video {} was transcoded for {}x{} but display is {}x{}",
                    videoId, video.getWidth(), video.getHeight(),
                    displayConfig.getWidth(), displayConfig.getHeight());
        }
        Display previous = Display.getRunning();
        if (previous == videoRunnerDisplay) {
            previous = null;
        }
        videoRunnerDisplay.setVideo(video, layout.binFile(videoId), previous);
        videoRunnerDisplay.activate();
        log.info("Running video id={}", videoId);
        return video;
    }

    public Video getActiveVideo() {
        if (!videoRunnerDisplay.isRunning()) return null;
        return videoRunnerDisplay.getFieldWriter().getVideo();
    }

    Video save(Video video) {
        if (video.getId() == null) {
            video.setId(UUID.randomUUID().toString());
        }
        VideoDbDto saved = videoRepository.add(VideoToDbDtoMapper.videoToDbDto(video));
        return VideoToDbDtoMapper.dbDtoToVideo(saved);
    }

    private Video newVideoFromRequest(VideoCreationRequest request) {
        Video video = new Video();
        video.setId(UUID.randomUUID().toString());
        video.setName(request.getName());
        video.setDescription(request.getDescription());
        video.setFps(request.getFps() != null ? request.getFps() : 30);
        video.setThreshold(request.getThreshold() != null ? request.getThreshold() : 80);
        video.setPlayMode(request.getPlayMode() != null ? request.getPlayMode() : VideoPlayMode.LOOP);
        video.setCreatedAt(System.currentTimeMillis());
        return video;
    }

    private static String sanitizeFilename(String original) {
        if (original == null || original.isBlank()) return null;
        return Paths.get(original).getFileName().toString();
    }
}
