package backspace.display.api.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperBuildConfig {


    @Bean
    public ModelMapper createModelMapper() {

        return new ModelMapper();
    }
}
