package backspace.display.api.rest.scripts;

import backspace.display.script.Script;
import backspace.display.service.script.ScriptCreationRequest;
import backspace.display.service.script.ScriptService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/script")
@RequiredArgsConstructor
public class ScriptsController {

    private final ModelMapper modelMapper;

    private final ScriptService scriptService;


    @PostMapping("{scriptId}/run")
    public ScriptDto runScript(@PathVariable(name = "scriptId") String scriptId) {
        scriptService.runScript(scriptId);
        return modelMapper.map(scriptService.getActiveScript(), ScriptDto.class);
    }

    @PostMapping
    public ScriptDto createScript(@RequestBody ScriptCreationRequestDto request) {

        Script script = scriptService.createScript(
                modelMapper.map(request, ScriptCreationRequest.class));
        return modelMapper.map(script, ScriptDto.class);
    }

    @PutMapping("{scriptId}")
    public ScriptDto updateScript(@RequestBody ScriptCreationRequestDto request, @PathVariable(name = "scriptId") String scriptId) {
        Script script = scriptService.updateScript(scriptId,
                modelMapper.map(request, ScriptCreationRequest.class));
        return modelMapper.map(script, ScriptDto.class);
    }

    @DeleteMapping("{scriptId}")
    public void deleteScript(@PathVariable(name = "scriptId") String scriptId) {
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

    @GetMapping("active")
    public ScriptDto getActiveScript() {
        return modelMapper.map(scriptService.getActiveScript(), ScriptDto.class);
    }


}
