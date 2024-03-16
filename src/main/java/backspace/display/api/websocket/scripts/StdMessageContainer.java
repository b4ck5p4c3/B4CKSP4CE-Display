package backspace.display.api.websocket.scripts;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class StdMessageContainer {
    private List<String> lines;
}
