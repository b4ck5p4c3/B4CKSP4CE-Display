package backspace.display.service.video;

import backspace.display.video.VideoPlayMode;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VideoCreationRequest {
    private String name;
    private String description;
    private Integer fps;
    private Integer threshold;
    private VideoPlayMode playMode;
}
