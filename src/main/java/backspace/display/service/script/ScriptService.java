package backspace.display.service.script;

import backspace.display.api.rest.scripts.ScriptCreationRequestDto;
import backspace.display.field.display.Display;
import backspace.display.script.Script;
import backspace.display.script.ScriptRunnerDisplay;
import backspace.display.service.repo.Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ScriptService {
    private final Display currentDisplay;
    private final ScriptRunnerDisplay scriptRunnerDisplay;

    private final Repository<Script> scriptRepository;

    public void runScript(String scriptId) {
        Script script = scriptRepository.getById(scriptId);
        setScript(script);
    }

    public Script createScript(ScriptCreationRequest scriptCreationRequest) {
        String scriptId = UUID.randomUUID().toString();
        Script script = new Script(scriptId, scriptCreationRequest.getName(), scriptCreationRequest.getDescription(),
                scriptCreationRequest.getScript(), scriptCreationRequest.getRunIntervalMs(),
                scriptCreationRequest.getParameters());
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





    private void setScript (Script script) {
        scriptRunnerDisplay.activate();
        scriptRunnerDisplay.setScript(script);
    }
}
