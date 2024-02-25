package backspace.display.field.display;

import backspace.display.field.Frame;
import backspace.display.field.printer.FieldPrinter;
import backspace.display.field.writer.FieldWriter;
import backspace.display.service.config.DisplayConfig;

public class PrintOnFrameUpdateRefreshDisplay extends Display {

    private boolean isStarted = false;

    public PrintOnFrameUpdateRefreshDisplay(Frame frame, FieldWriter fieldWriter, FieldPrinter fieldPrinter, DisplayConfig displayConfig) {
        super(frame, fieldWriter, fieldPrinter, displayConfig);
    }

    @Override
    public void start() {
        isStarted = true;
    }


    @Override
    public void setFrame(Frame frame) {
        super.setFrame(frame);
        if (isStarted) {
            tick();
        }
    }


}
