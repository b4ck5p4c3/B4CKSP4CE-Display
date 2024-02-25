package backspace.display.service.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;


@Configuration
@Data
public class DisplayConfig {

    @Value("${display.width}")
    private int width;

    @Value("${display.height}")
    private int height;

}
