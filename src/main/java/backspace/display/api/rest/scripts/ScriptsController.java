package backspace.display.api.rest.scripts;

import backspace.display.script.Script;
import backspace.display.service.script.ScriptCreationRequest;
import backspace.display.service.script.ScriptService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/script")
@RequiredArgsConstructor
public class ScriptsController {

    private final ModelMapper modelMapper;

    private final ScriptService scriptService;


    @PostMapping("{scriptId}/run")
    public void runScript(@PathVariable(name = "scriptId") String scriptId) {
        scriptService.runScript(scriptId);
    }

    @PostMapping
    public ScriptDto createScript(@RequestBody ScriptCreationRequestDto request) {

        Script script = scriptService.createScript(
                modelMapper.map(request, ScriptCreationRequest.class));
        return modelMapper.map(script, ScriptDto.class);
    }

    @DeleteMapping
    public void deleteScript(@RequestParam(name = "script") String scriptId) {
        scriptService.deleteScript(scriptId);
    }

    @GetMapping
    public List<ScriptDto> getAllScripts() {
        return scriptService.getAllScripts().stream()
                .map(script -> modelMapper.map(script, ScriptDto.class))
                .toList();
    }

    @GetMapping("{script}")
    public ScriptDto getScriptById(@PathVariable(name = "script") String scriptId) {
        Script script = scriptService.getScriptById(scriptId);
        return modelMapper.map(script, ScriptDto.class);
    }

}
