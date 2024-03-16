package backspace.display.api.websocket.live;

import backspace.display.service.live.LiveFrameService;
import backspace.display.service.live.LiveFrameUpdateRequest;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class LiveFrameUpdateController {


    private final LiveFrameService liveFrameService;
    private final ModelMapper modelMapper;


    @MessageMapping("/frame/update")
    public void updateField(LiveFrameUpdateRequestBase64 frameUpdateRequestBase64) {
        LiveFrameUpdateRequest liveFrameUpdateRequest = modelMapper.map(frameUpdateRequestBase64, LiveFrameUpdateRequest.class);
        liveFrameService.updateFrame(liveFrameUpdateRequest);
    }

}
