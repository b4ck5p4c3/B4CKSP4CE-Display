package backspace.display.api.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebDistributor {

    @GetMapping(value = {"/", "scripts"})
    public String index() {
        return "forward:/index.html";
    }



}
