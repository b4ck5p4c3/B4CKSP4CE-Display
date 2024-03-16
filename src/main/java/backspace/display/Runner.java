package backspace.display;

import backspace.display.field.display.Display;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component

public class Runner {


    private final Display display;

    public Runner(@Qualifier("frameDisplay") Display display) {
        this.display = display;
    }

    @PostConstruct
    public void run() {
        display.start();
    }

}
