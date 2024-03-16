package backspace.display.service.script;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ScriptCreationRequest {
    private String name;
    private String description;
    private String script;
    private Integer runIntervalMs;
}
