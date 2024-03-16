package backspace.display.script;

import backspace.display.field.Identifiable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.luaj.vm2.LuaTable;

import java.util.List;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class Script implements Identifiable {
    @Getter
    @Setter
    private String id;
    @Getter
    @Setter
    private String name;
    @Getter
    @Setter
    private String description;
    @Getter
    @Setter
    private String script;
    @Getter
    @Setter
    private int runIntervalMs;

    @JsonIgnore
    protected transient LuaTable globals;

    public Script(String id, String name, String description, String script, int runIntervalMs) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.script = script;
        this.runIntervalMs = runIntervalMs;
    }


}
