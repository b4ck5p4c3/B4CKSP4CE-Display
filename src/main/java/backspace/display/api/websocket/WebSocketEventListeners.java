package backspace.display.api.websocket;

import backspace.display.service.live.LiveFrameService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@AllArgsConstructor
@Log4j2
public class WebSocketEventListeners {

    private LiveFrameService liveFrameService;
    private SimpUserRegistry simpUserRegistry;

    @EventListener
    public void onSocketDisconnected(SessionDisconnectEvent event) {
        if (simpUserRegistry.getUserCount() == 0) {
            log.info("No connected websocket clients left. Turning back previous display");
            liveFrameService.deactivate();
        }
    }


}
