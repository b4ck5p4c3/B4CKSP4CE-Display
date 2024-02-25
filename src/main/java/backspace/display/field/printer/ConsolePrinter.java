package backspace.display.field.printer;

import backspace.display.field.Frame;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.awt.*;

@Component
@ConditionalOnProperty(name = "display.printer", havingValue = "console")
public class ConsolePrinter implements FieldPrinter {

    private static final String WHITE_UNDERLINED = "\033[4;37m";
    private static final String RED = "\033[0;31m";
    private static final String PIXEL = "██";

    @Override
    public void printField(Frame frame) {
        for (int i = 0; i < frame.height(); i++) {
            for (int j = 0; j < frame.width(); j++) {
                Point point = new Point(j, i);
                System.out.print(frame.getPixelBrightness(point) == 0 ? WHITE_UNDERLINED + PIXEL : RED + PIXEL);
            }
            System.out.println();
        }
        System.out.println();
    }
}
