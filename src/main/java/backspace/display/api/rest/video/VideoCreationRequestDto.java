package backspace.display.api.rest.video;

import backspace.display.video.VideoPlayMode;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VideoCreationRequestDto {
    private String name;
    private String description;
    private Integer fps;
    private Integer threshold;
    private VideoPlayMode playMode;
}
