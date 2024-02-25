package backspace.display.service.frame;

import backspace.display.service.repo.JsonRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class JsonFrameRepository extends JsonRepository<FrameDbDto> {

    public JsonFrameRepository(@Value("${data.path}") String dataPath) {
        super(dataPath + "/frames", FrameDbDto.class);
    }


}
