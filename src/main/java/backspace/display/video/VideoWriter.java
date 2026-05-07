package backspace.display.video;

import backspace.display.field.Frame;
import backspace.display.field.writer.FieldWriter;
import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Component
@Log4j2
public class VideoWriter implements FieldWriter {

    @Getter
    private volatile Video video;
    private byte[] buffer;
    private int frameSize;
    private long frameIndex;
    private boolean ended;

    public synchronized void setVideo(Video video, Path binFile) {
        if (video == null) {
            this.video = null;
            this.buffer = null;
            this.frameSize = 0;
            this.frameIndex = 0;
            this.ended = false;
            return;
        }
        if (video.getFrameCount() <= 0) {
            throw new IllegalArgumentException("Video has no frames: " + video.getId());
        }
        try {
            byte[] data = Files.readAllBytes(binFile);
            int fs = video.getWidth() * video.getHeight();
            long expected = (long) fs * video.getFrameCount();
            if (data.length != expected) {
                throw new IOException("Bin size mismatch for video " + video.getId()
                        + ": expected " + expected + " bytes, got " + data.length);
            }
            this.buffer = data;
            this.frameSize = fs;
            this.video = video;
            this.frameIndex = 0;
            this.ended = false;
            log.info("Loaded video {} ({} frames, {} bytes)", video.getId(), video.getFrameCount(), data.length);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to load video " + video.getId(), e);
        }
    }

    public synchronized boolean hasVideo() {
        return video != null && buffer != null;
    }

    public synchronized boolean isEnded() {
        return ended;
    }

    @Override
    public synchronized void writeToField(Frame frame) {
        if (buffer == null || video == null) return;
        long frameCount = video.getFrameCount();
        long idx = frameIndex;
        if (idx >= frameCount) {
            return;
        }
        int offset = (int) (idx * frameSize);
        int width = video.getWidth();
        int height = video.getHeight();
        byte[][] pixels = frame.getPixelsBrightnesses();
        if (pixels.length < height || pixels[0].length < width) {
            for (int y = 0; y < height; y++) {
                System.arraycopy(buffer, offset + y * width, pixels[y], 0, Math.min(width, pixels[y].length));
            }
        } else {
            for (int y = 0; y < height; y++) {
                System.arraycopy(buffer, offset + y * width, pixels[y], 0, width);
            }
        }

        long next = idx + 1;
        if (next >= frameCount) {
            if (video.getPlayMode() == VideoPlayMode.ONCE) {
                ended = true;
                frameIndex = frameCount;
            } else {
                frameIndex = 0;
            }
        } else {
            frameIndex = next;
        }
    }
}
