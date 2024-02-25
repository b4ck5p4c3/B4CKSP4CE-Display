package backspace.display.script;

import backspace.display.field.Identifiable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.python.core.PyObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class Script implements Identifiable {
    private String id;
    private String name;
    private String description;
    private String script;
    private int runIntervalMs;
    private Map<String, Object> parameters = new HashMap<>();


    private transient PyObject environment;

}
