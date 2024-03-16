package backspace.display.api.rest.frame;

import backspace.display.field.display.Display;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("api/display")
@AllArgsConstructor
public class DisplayController {

    private final ModelMapper modelMapper;

    @GetMapping("state")
    public FrameDto getState() {
        return modelMapper.map(Display.getRunning().getFrame(), FrameDto.class);
    }
}
