package backspace.display.service.video;

import backspace.display.video.Video;

public class VideoToDbDtoMapper {

    public static VideoDbDto videoToDbDto(Video video) {
        VideoDbDto dto = new VideoDbDto();
        dto.setId(video.getId());
        dto.setName(video.getName());
        dto.setDescription(video.getDescription());
        dto.setWidth(video.getWidth());
        dto.setHeight(video.getHeight());
        dto.setFps(video.getFps());
        dto.setFrameCount(video.getFrameCount());
        dto.setThreshold(video.getThreshold());
        dto.setPlayMode(video.getPlayMode());
        dto.setStatus(video.getStatus());
        dto.setErrorMessage(video.getErrorMessage());
        dto.setOriginalFilename(video.getOriginalFilename());
        dto.setOriginalSizeBytes(video.getOriginalSizeBytes());
        dto.setCreatedAt(video.getCreatedAt());
        return dto;
    }

    public static Video dbDtoToVideo(VideoDbDto dto) {
        Video video = new Video();
        video.setId(dto.getId());
        video.setName(dto.getName());
        video.setDescription(dto.getDescription());
        video.setWidth(dto.getWidth());
        video.setHeight(dto.getHeight());
        video.setFps(dto.getFps());
        video.setFrameCount(dto.getFrameCount());
        video.setThreshold(dto.getThreshold());
        video.setPlayMode(dto.getPlayMode());
        video.setStatus(dto.getStatus());
        video.setErrorMessage(dto.getErrorMessage());
        video.setOriginalFilename(dto.getOriginalFilename());
        video.setOriginalSizeBytes(dto.getOriginalSizeBytes());
        video.setCreatedAt(dto.getCreatedAt());
        return video;
    }
}
