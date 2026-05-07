package backspace.display.service.video;

import backspace.display.service.repo.JsonRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class JsonVideoRepository extends JsonRepository<VideoDbDto> {

    public JsonVideoRepository(@Value("${data.path}") String dataPath) {
        super(dataPath + "/videos", VideoDbDto.class);
    }
}
