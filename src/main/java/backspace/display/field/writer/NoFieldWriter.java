package backspace.display.field.writer;

import backspace.display.field.Frame;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@ConditionalOnProperty(name = "data.source", havingValue = "none")
@Component
public class NoFieldWriter implements FieldWriter {
    @Override
    public void writeToField(Frame frame) {

    }
}
