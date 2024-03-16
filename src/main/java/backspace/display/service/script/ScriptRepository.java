package backspace.display.service.script;

import backspace.display.script.Script;
import backspace.display.service.repo.JsonRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


@Component
public class ScriptRepository extends JsonRepository<Script> {


    public ScriptRepository(@Value("${data.path}") String dataPath) {
        super(dataPath + "/scripts", Script.class);
    }
}
