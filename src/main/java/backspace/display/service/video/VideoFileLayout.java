package backspace.display.service.video;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class VideoFileLayout {

    private final Path videosDir;
    private final Path binDir;

    public VideoFileLayout(@Value("${data.path}") String dataPath) {
        this.videosDir = Paths.get(dataPath, "videos");
        this.binDir = Paths.get(dataPath, "video-frames");
        this.binDir.toFile().mkdirs();
    }

    public Path videosDir() {
        return videosDir;
    }

    public Path binFile(String videoId) {
        return binDir.resolve(videoId + ".bin");
    }
}
