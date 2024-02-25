package backspace.display.service.script;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Data
@NoArgsConstructor
public class ScriptCreationRequest {
    private String name;
    private String description;
    private Map<String, Object> parameters;
    private String script;
    private Integer runIntervalMs;
}
