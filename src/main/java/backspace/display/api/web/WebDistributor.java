package backspace.display.api.web;

import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Collectors;

@RestController
public class WebDistributor {

    @Value("${server.baseUrl}")
    private String baseUrl;

    @GetMapping(value = {"/", "/scripts"}, produces = MediaType.TEXT_HTML_VALUE)
    public String index() throws IOException {
        String content = readStaticFile("index.html");
        content = content.replace("%BACKEND_URL%", baseUrl);
        return content;
    }

    @SneakyThrows
    private String readStaticFile(String filename){
        InputStream inputStream = new ClassPathResource("static/"+filename).getInputStream();
        return new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))
                .lines()
                .collect(Collectors.joining("\n"));
    }
}
