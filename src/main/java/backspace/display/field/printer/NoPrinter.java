package backspace.display.field.printer;

import backspace.display.field.Frame;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@ConditionalOnProperty(name = "display.printer", havingValue = "none")
@Component
public class NoPrinter implements FieldPrinter {
    @Override
    public void printField(Frame frame) {
    }
}
