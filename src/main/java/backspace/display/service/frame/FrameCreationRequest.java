package backspace.display.service.frame;


import lombok.Data;

@Data
public class FrameCreationRequest {
    private String name;
    private String description;
    private byte[][] frameBytes;
}
