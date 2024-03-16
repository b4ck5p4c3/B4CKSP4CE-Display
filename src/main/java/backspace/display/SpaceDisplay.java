package backspace.display;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SpaceDisplay {

    public static void main(String[] args) {
        SpringApplication.run(SpaceDisplay.class, args);
    }

}
