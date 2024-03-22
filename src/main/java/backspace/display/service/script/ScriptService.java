package backspace.display.service.script;

import backspace.display.script.QueuedLimitedOutputStream;
import backspace.display.script.Script;
import backspace.display.script.ScriptRunnerDisplay;
import backspace.display.service.repo.Repository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Log4j2
public class ScriptService {
    private final ScriptRunnerDisplay scriptRunnerDisplay;

    private final Repository<Script> scriptRepository;

    public synchronized void runScript(String scriptId) {
        log.info("Starting script {}", scriptId);
        Script script = scriptRepository.getById(scriptId);
        setScript(script);
    }

    public Script createScript(ScriptCreationRequest scriptCreationRequest) {
        String scriptId = UUID.randomUUID().toString();
        Script script = new Script(scriptId, scriptCreationRequest.getName(), scriptCreationRequest.getDescription(),
                scriptCreationRequest.getScript(), scriptCreationRequest.getRunIntervalMs()
                );
        return scriptRepository.add(script);
    }

    public Script getScriptById(String scriptId) {
        return scriptRepository.getById(scriptId);
    }

    public void deleteScript(String scriptId) {
        scriptRepository.removeById(scriptId);
    }

    public List<Script> getAllScripts() {
        return scriptRepository.getAll();
    }

    public Script updateScript(String scriptId, ScriptCreationRequest scriptCreationRequest) {
        Script script = scriptRepository.getById(scriptId);
        script.setName(scriptCreationRequest.getName());
        script.setDescription(scriptCreationRequest.getDescription());
        script.setScript(scriptCreationRequest.getScript());
        script.setRunIntervalMs(scriptCreationRequest.getRunIntervalMs());
        scriptRepository.update(script, script);
        runScript(scriptId);
        return script;
    }


    private void setScript(Script script) {
        scriptRunnerDisplay.activate();
        scriptRunnerDisplay.getFieldWriter().clearStd();
        scriptRunnerDisplay.setScript(script);
    }

    public List<String> getStdout() {
        QueuedLimitedOutputStream stdout = scriptRunnerDisplay.getFieldWriter().getStdout();
        return stdout.getLinesAndErase();
    }



    public Script getActiveScript() {
        return scriptRunnerDisplay.getFieldWriter().getScript();
    }
}
