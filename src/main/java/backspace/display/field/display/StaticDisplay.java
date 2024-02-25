package backspace.display.field.display;

import backspace.display.field.Frame;
import backspace.display.field.printer.FieldPrinter;
import backspace.display.field.writer.FieldWriter;
import backspace.display.service.config.DisplayConfig;

public class StaticDisplay extends Display {

    public StaticDisplay(Frame frame, FieldWriter fieldWriter, FieldPrinter fieldPrinter, DisplayConfig displayConfig) {
        super(frame, fieldWriter, fieldPrinter, displayConfig);
    }


    public void start() {
        this.tick();
    }
}
