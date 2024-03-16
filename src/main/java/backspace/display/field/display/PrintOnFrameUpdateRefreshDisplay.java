package backspace.display.field.display;

import backspace.display.field.Frame;
import backspace.display.field.printer.FieldPrinter;
import backspace.display.field.writer.FieldWriter;
import backspace.display.service.config.DisplayConfig;
import org.springframework.beans.factory.annotation.Autowired;

public class PrintOnFrameUpdateRefreshDisplay extends Display {


    @Autowired
    public PrintOnFrameUpdateRefreshDisplay(FieldWriter fieldWriter, FieldPrinter fieldPrinter, DisplayConfig displayConfig) {
        super(new Frame(displayConfig.getHeight(), displayConfig.getWidth()), fieldWriter, fieldPrinter, displayConfig);
    }


    @Override
    public void setFrame(Frame frame) {
        super.setFrame(frame);
        if (isRunning.get()) {
            tick();
        }
    }


}
