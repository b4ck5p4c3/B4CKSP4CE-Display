package backspace.display;

import backspace.display.service.script.ScriptService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

@Configuration
@DependsOn("runner")
public class DefaultScriptActivator {

    ScriptService scriptService;

    @Value("${display.default.scriptId:#{null}}")
    private String defaultScriptId;

    public DefaultScriptActivator(ScriptService scriptService) {
        this.scriptService = scriptService;
    }
    @PostConstruct
    public void run() {
        if (defaultScriptId == null) {
            return;
        }
        scriptService.runScript(defaultScriptId);
    }
}
