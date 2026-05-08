package backspace.display.api.rest.frame;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FrameMetadataUpdateRequest {
    private String name;
    private String description;
}
