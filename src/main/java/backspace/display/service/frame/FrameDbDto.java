package backspace.display.service.frame;

import backspace.display.field.Identifiable;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class FrameDbDto implements Identifiable {
    private String id;
    private String name;
    private String description;
    private List<String> pixelsBrightnesses;
}
