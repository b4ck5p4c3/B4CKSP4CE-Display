package backspace.display.api.rest.scripts;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ScriptMetadataUpdateRequest {
    private String name;
    private String description;
}
