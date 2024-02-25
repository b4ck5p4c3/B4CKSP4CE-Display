package backspace.display.api.rest.scripts;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
public class ScriptCreationRequestDto {
    private String name;
    private String description;
    private Map<String, Object> parameters;
    private String script;
    private Integer runIntervalMs;
}