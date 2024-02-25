package backspace.display.api.websocket;

import backspace.display.service.LiveFrameService;
import backspace.display.service.LiveFrameUpdateRequest;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class LiveBroker {


    private final LiveFrameService liveFrameService;
    private final ModelMapper modelMapper;


    @MessageMapping("/frame/update")
    public void updateField(LiveFrameUpdateRequestBase64 frameUpdateRequestBase64) {
        LiveFrameUpdateRequest liveFrameUpdateRequest = modelMapper.map(frameUpdateRequestBase64, LiveFrameUpdateRequest.class);
        liveFrameService.updateFrame(liveFrameUpdateRequest);
    }

}
