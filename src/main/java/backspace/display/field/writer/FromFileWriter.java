package backspace.display.field.writer;

import backspace.display.field.Frame;
import jakarta.annotation.Nonnull;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;

@ConditionalOnProperty(name = "data.source", havingValue = "from-file")
@Component
@Log4j2
public class FromFileWriter implements FieldWriter {

    private final String filePath;
    private final Charset charset;

    private static final char STATE_ON = 'X';
    private static final char STATE_OFF = '0';

    public FromFileWriter(@Nonnull @Value("${data.file.path}") String filePath,
                          @Nonnull Charset charset) {
        this.filePath = filePath;
        this.charset = charset;
    }

    @Autowired
    public FromFileWriter(@Nonnull @Value("${data.file.path}") String filePath,
                          @Nonnull @Value("${data.file.encoding}") String charset) {
        this(filePath, Charset.forName(charset));
    }


    @Override
    public void writeToField(Frame frame) {
        char[][] newField;
        try {
            newField = readFieldFromFile();
        } catch (IOException e) {
            log.error("Error reading field from file", e);
            throw new UncheckedIOException(e);
        }
        for (int y = 0; y < frame.height(); y++) {
            for (int x = 0; x < frame.width(); x++) {
                char charByte;
                if (y >= newField.length || x >= newField[y].length) {
                    log.warn("No data for pixel: X=%d,Y=%d in file. Replace with 0.".formatted(x, y));
                    charByte = STATE_OFF;
                } else {
                    charByte = newField[y][x];
                }
                if (charByte == STATE_ON) {
                    frame.setPixelBrightness(new Point(x, y), (byte) 255);
                } else if (charByte == STATE_OFF) {
                    frame.setPixelBrightness(new Point(x, y), (byte) 0);
                } else {
                    log.warn("Unknown state of pixel: %c. Replace with 0.".formatted(charByte));
                    frame.setPixelBrightness(new Point(x, y), (byte) 0);
                }
            }
        }
    }

    private char[][] readFieldFromFile() throws IOException {
        String content = Files.readString(Paths.get(filePath), charset);
        String[] lines = content.split("\n");
        char[][] field = new char[lines.length][];
        for (int x = 0; x < lines.length; x++) {
            field[x] = lines[x].toCharArray();
        }
        return field;
    }
}
