package backspace.display.service.live;

import backspace.display.field.Frame;
import backspace.display.field.display.Display;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class LiveFrameService {

    private final Display display;
    private Display previousDisplay;

    public LiveFrameService(@Qualifier("liveDisplay") Display display) {
        this.display = display;
    }


    public void updateFrame(LiveFrameUpdateRequest liveFrameUpdateRequest) {
        Frame frame = new Frame(liveFrameUpdateRequest.getPixelsBrightnesses());
        activate();
        display.setFrame(frame);
    }

    private synchronized void activate() {
        if (!display.isRunning()) {
            previousDisplay = Display.getRunning();
        }
        display.activate();
    }

    public synchronized void deactivate() {
        previousDisplay.activate();
    }

}
