package backspace.display.api.rest.video;

import backspace.display.video.VideoPlayMode;
import backspace.display.video.VideoStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VideoDto {
    private String id;
    private String name;
    private String description;

    private int width;
    private int height;
    private int fps;
    private long frameCount;
    private int threshold;

    private VideoPlayMode playMode;
    private VideoStatus status;
    private String errorMessage;

    private String originalFilename;
    private long originalSizeBytes;
    private long createdAt;
}
