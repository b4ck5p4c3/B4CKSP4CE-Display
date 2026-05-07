package backspace.display.api.rest.video;

import backspace.display.service.video.VideoCreationRequest;
import backspace.display.service.video.VideoService;
import backspace.display.video.Video;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
