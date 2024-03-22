package backspace.display.api.rest.frame;

import backspace.display.field.Frame;
import backspace.display.service.frame.FrameCreationRequest;
import backspace.display.service.frame.FrameService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("api/frame")
public class    BaseFrameController {

    private FrameService frameController;
    private final ModelMapper modelMapper;

    @PostMapping
    @Parameter(name = "activate", description = "Activate frame after creation")
    public FrameCreatedResponse createFrame(@RequestBody FrameCreationRequestDto frameCreationRequest,
                                            @RequestParam(value = "activate", required = false, defaultValue = "false") Boolean activate) {
        Frame frame = frameController.createFrame(modelMapper.map(frameCreationRequest, FrameCreationRequest.class), activate);
        return modelMapper.map(frame, FrameCreatedResponse.class);
    }

    @PostMapping("/{frameId}/activate")
    public void setActiveFrame(@PathVariable("frameId") String frameId) {
        frameController.setActiveFrameById(frameId);
    }

    @GetMapping("/{frameId}")
    public FrameDto getFrameById(@PathVariable("frameId") String frameId) {
        return modelMapper.map(frameController.getFrameById(frameId), FrameDto.class);
    }

    @PutMapping("/{frameId}")
    public synchronized FrameDto updateFrame(@PathVariable("frameId") String frameId,
                                             @RequestBody FrameCreationRequestDto frameCreationRequestDto) {
        Frame frame = frameController.updateFrame(frameId, modelMapper.map(frameCreationRequestDto, FrameCreationRequest.class));
        return modelMapper.map(frame, FrameDto.class);
    }

    @DeleteMapping("/{frameId}")
    public void deleteFrame(@PathVariable("frameId") String frameId) {
        frameController.deleteFrame(frameId);
    }

    @GetMapping
    public List<FrameDto> getAllFrames(@RequestParam(value = "offset", required = false, defaultValue = "0") int offset,
                                       @RequestParam(value = "limit", required = false, defaultValue = "10") int limit,
                                       @RequestParam(value = "title", required = false, defaultValue = "") String title) {
        return frameController.getAllFrames()
                .stream()
                .filter(frame -> frame.getName().toLowerCase().contains(title.toLowerCase()))
                .skip(offset)
                .limit(limit)
                .map(frame -> modelMapper.map(frame, FrameDto.class))
                .toList();
    }


}
