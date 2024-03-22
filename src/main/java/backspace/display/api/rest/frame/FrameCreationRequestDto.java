package backspace.display.api.rest.frame;

import lombok.Data;

import java.util.List;

@Data
public class FrameCreationRequestDto {
    private String name;
    private String description;
    private List<String> gridBrightnesses;
}
