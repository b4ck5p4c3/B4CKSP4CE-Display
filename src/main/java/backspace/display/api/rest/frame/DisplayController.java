package backspace.display.api.rest.frame;

import backspace.display.field.display.Display;
import backspace.display.service.FrameService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/display")
@AllArgsConstructor
public class DisplayController {

    private final ModelMapper modelMapper;

    @GetMapping("state")
    public FrameDto getState() {
        return modelMapper.map(Display.getRunning().getFrame(), FrameDto.class);
    }
}
