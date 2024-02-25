package backspace.display.api.rest.scripts;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ScriptDto {
    private String id;
    private String name;
    private String description;
    private List<String> parameters;
    private String script;
    private int runIntervalMs;
}
