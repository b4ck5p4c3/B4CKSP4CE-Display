package backspace.display.api.rest.video;

import backspace.display.api.rest.frame.FrameDto;
import backspace.display.field.Frame;
import backspace.display.service.video.VideoCreationRequest;
import backspace.display.service.video.VideoService;
import backspace.display.video.Video;
import backspace.display.video.VideoPlayMode;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/video")
@RequiredArgsConstructor
public class VideoController {

    private final ModelMapper modelMapper;
    private final VideoService videoService;

    @PostMapping
    public VideoDto createVideo(@RequestBody VideoCreationRequestDto request) {
        Video video = videoService.createVideo(modelMapper.map(request, VideoCreationRequest.class));
        return modelMapper.map(video, VideoDto.class);
    }

    @PostMapping(path = "upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public VideoDto uploadVideo(@RequestParam("file") MultipartFile file,
                                @RequestParam(value = "name", required = false) String name,
                                @RequestParam(value = "description", required = false) String description,
                                @RequestParam(value = "fps", required = false) Integer fps,
                                @RequestParam(value = "threshold", required = false) Integer threshold,
                                @RequestParam(value = "playMode", required = false) VideoPlayMode playMode) {
        VideoCreationRequest request = new VideoCreationRequest();
        request.setName(name);
        request.setDescription(description);
        request.setFps(fps);
        request.setThreshold(threshold);
        request.setPlayMode(playMode);
        Video video = videoService.uploadAndTranscode(file, request);
        return modelMapper.map(video, VideoDto.class);
    }

    @PostMapping("{videoId}/run")
    public VideoDto runVideo(@PathVariable(name = "videoId") String videoId) {
        Video video = videoService.runVideo(videoId);
        return modelMapper.map(video, VideoDto.class);
    }

    @GetMapping("active")
    public VideoDto getActiveVideo() {
        Video video = videoService.getActiveVideo();
        return video == null ? null : modelMapper.map(video, VideoDto.class);
    }

    @GetMapping("{videoId}/preview/{frameIdx}")
    public FrameDto getPreviewFrame(@PathVariable(name = "videoId") String videoId,
                                    @PathVariable(name = "frameIdx") long frameIdx) {
        Frame frame = videoService.getPreviewFrame(videoId, frameIdx);
        return modelMapper.map(frame, FrameDto.class);
    }

    @GetMapping
    public List<VideoDto> getAllVideos() {
        return videoService.getAllVideos().stream()
                .map(video -> modelMapper.map(video, VideoDto.class))
                .toList();
    }

    @GetMapping("{videoId}")
    public VideoDto getVideoById(@PathVariable(name = "videoId") String videoId) {
        Video video = videoService.getVideoById(videoId);
        return modelMapper.map(video, VideoDto.class);
    }

    @PutMapping("{videoId}")
    public VideoDto updateVideo(@PathVariable(name = "videoId") String videoId,
                                @RequestBody VideoCreationRequestDto request) {
        Video video = videoService.updateVideo(videoId, modelMapper.map(request, VideoCreationRequest.class));
        return modelMapper.map(video, VideoDto.class);
    }

    @DeleteMapping("{videoId}")
    public void deleteVideo(@PathVariable(name = "videoId") String videoId) {
        videoService.deleteVideo(videoId);
    }
}
