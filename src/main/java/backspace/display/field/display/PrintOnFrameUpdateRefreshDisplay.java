package backspace.display.field.display;

import backspace.display.field.Frame;
import backspace.display.field.printer.FieldPrinter;
import backspace.display.field.writer.FieldWriter;
import backspace.display.service.config.DisplayConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class PrintOnFrameUpdateRefreshDisplay extends Display{



    public PrintOnFrameUpdateRefreshDisplay(Frame frame, FieldWriter fieldWriter, FieldPrinter fieldPrinter, DisplayConfig displayConfig) {
        super(frame, fieldWriter, fieldPrinter, displayConfig);
    }

    @Autowired
    public PrintOnFrameUpdateRefreshDisplay(FieldWriter fieldWriter, FieldPrinter fieldPrinter, DisplayConfig displayConfig) {
        super(new Frame(displayConfig.getHeight(), displayConfig.getWidth()), fieldWriter, fieldPrinter, displayConfig);
    }



    @Override
    public void setFrame(Frame frame) {
        super.setFrame(frame);
        if(isRunning.get()){
            tick();
        }
    }


}
