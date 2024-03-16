package backspace.display.service.live;

import backspace.display.field.display.PrintOnFrameUpdateRefreshDisplay;
import backspace.display.field.printer.FieldPrinter;
import backspace.display.field.writer.FieldWriter;
import backspace.display.service.config.DisplayConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LiveDisplayConfigurator {

    @Bean("liveDisplay")
    public PrintOnFrameUpdateRefreshDisplay liveDisplay(FieldWriter fieldWriter, FieldPrinter fieldPrinter, DisplayConfig displayConfig) {
        return new PrintOnFrameUpdateRefreshDisplay(fieldWriter, fieldPrinter, displayConfig);
    }
}
