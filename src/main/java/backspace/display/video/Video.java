package backspace.display.video;

import backspace.display.field.Identifiable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Video implements Identifiable {
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
