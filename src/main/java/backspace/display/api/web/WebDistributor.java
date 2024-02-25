package backspace.display.api.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebDistributor {

    @GetMapping
    public String index() {
        return "index";
    }

    @GetMapping("/snake")
    public String snake() {
        return "snake";
    }

    @GetMapping("/bricknballs")
    public String bricknballs() {
        return "bricknballs";
    }


}
