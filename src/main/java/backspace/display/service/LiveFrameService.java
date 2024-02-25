package backspace.display.service;

import backspace.display.field.Frame;
import backspace.display.field.display.Display;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LiveFrameService {

    private final Display display;

    public void updateFrame(LiveFrameUpdateRequest liveFrameUpdateRequest) {
        Frame frame = new Frame(liveFrameUpdateRequest.getPixelsBrightnesses());
        display.setFrame(frame);
    }

}
