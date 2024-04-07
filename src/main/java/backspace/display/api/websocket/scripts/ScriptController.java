package backspace.display.api.websocket.scripts;

import backspace.display.script.Script;
import backspace.display.service.script.ScriptService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Log4j2
public class ScriptController {


    private final SimpMessagingTemplate messagingTemplate;
    private final ScriptService scriptService;
    private SimpUserRegistry simpUserRegistry;

    @Scheduled(fixedRate = 100)
    public void sendStd() {
        if (simpUserRegistry.getUserCount()==0)
            return;
        Script currentScript = scriptService.getActiveScript();
        if (currentScript == null) {
            return;
        }
        StdMessageContainer stdMessageContainer = new StdMessageContainer(scriptService.getStdout());
        messagingTemplate.convertAndSend("/script/%s/stdout".formatted(currentScript.getId()), stdMessageContainer);
    }


}
