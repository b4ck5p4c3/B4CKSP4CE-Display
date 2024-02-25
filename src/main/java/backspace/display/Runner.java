package backspace.display;

import backspace.display.field.display.Display;
import backspace.display.service.FrameService;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class Runner {

    private final Display display;
    FrameService frameService;
    ModelMapper modelMapper;

    @PostConstruct
    public void run() {
        display.start();
    }

}
