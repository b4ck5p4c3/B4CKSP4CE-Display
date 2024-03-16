package backspace.display.service.frame;

import backspace.display.field.Frame;
import backspace.display.field.display.IntervalRefreshDisplay;
import backspace.display.field.printer.FieldPrinter;
import backspace.display.field.writer.FieldWriter;
import backspace.display.service.config.DisplayConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class FrameDisplayConfig {

    @Bean("frameDisplay")
    public IntervalRefreshDisplay frameDisplay(@Value("${display.frame.interval}") Integer intervalMs, FieldWriter fieldWriter, FieldPrinter fieldPrinter, DisplayConfig displayConfig) {
        return new IntervalRefreshDisplay(Duration.ofMillis(intervalMs), new Frame(displayConfig.getHeight(), displayConfig.getWidth()), fieldWriter, fieldPrinter, displayConfig);
    }
}
