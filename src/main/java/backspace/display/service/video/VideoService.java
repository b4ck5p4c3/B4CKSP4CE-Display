package backspace.display.service.video;

import backspace.display.service.repo.Repository;
import backspace.display.video.Video;
import backspace.display.video.VideoPlayMode;
import backspace.display.video.VideoStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@Log4j2
@RequiredArgsConstructor
public class VideoService {

    private final Repository<VideoDbDto> videoRepository;

    public Video createVideo(VideoCreationRequest request) {
        Video video = new Video();
        video.setId(UUID.randomUUID().toString());
        video.setName(request.getName());
        video.setDescription(request.getDescription());
        video.setFps(request.getFps() != null ? request.getFps() : 30);
        video.setThreshold(request.getThreshold() != null ? request.getThreshold() : 80);
        video.setPlayMode(request.getPlayMode() != null ? request.getPlayMode() : VideoPlayMode.LOOP);
        video.setStatus(VideoStatus.UPLOADED);
        video.setCreatedAt(System.currentTimeMillis());
        Video saved = save(video);
        log.info("Created video with id: {}", saved.getId());
        return saved;
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
        log.info("Updated video with id: {}", saved.getId());
        return saved;
    }

    public void deleteVideo(String videoId) {
        videoRepository.removeById(videoId);
        log.info("Deleted video with id: {}", videoId);
    }

    Video save(Video video) {
        if (video.getId() == null) {
            video.setId(UUID.randomUUID().toString());
        }
        VideoDbDto saved = videoRepository.add(VideoToDbDtoMapper.videoToDbDto(video));
        return VideoToDbDtoMapper.dbDtoToVideo(saved);
    }
}
