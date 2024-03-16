package backspace.display.field.writer;

import backspace.display.field.Frame;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@ConditionalOnProperty(name = "data.source", havingValue = "none")
@Component
@Primary
public class NoFieldWriter implements FieldWriter {
    @Override
    public void writeToField(Frame frame) {

    }
}
