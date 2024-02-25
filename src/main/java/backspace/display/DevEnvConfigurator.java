package backspace.display;

import backspace.display.field.Frame;
import backspace.display.field.display.Display;
import backspace.display.field.display.PrintOnFrameUpdateRefreshDisplay;
import backspace.display.field.printer.FieldPrinter;
import backspace.display.field.writer.FieldWriter;
import backspace.display.service.config.DisplayConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("dev")
public class DevEnvConfigurator {

    Display display;
    DisplayConfig displayConfig;



}
