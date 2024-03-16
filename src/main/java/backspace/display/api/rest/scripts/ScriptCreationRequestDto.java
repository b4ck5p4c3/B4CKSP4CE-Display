package backspace.display.api.rest.scripts;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ScriptCreationRequestDto {
    private String name;
    private String description;
    private String script;
    private int runIntervalMs;
}