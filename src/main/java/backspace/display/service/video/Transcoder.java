package backspace.display.service.video;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Log4j2
@Component
public class Transcoder {

    private final String ffmpegPath;
    private final long timeoutMs;

    public Transcoder(@Value("${display.video.ffmpeg.path:ffmpeg}") String ffmpegPath,
                      @Value("${display.video.transcode.timeoutMs:600000}") long timeoutMs) {
        this.ffmpegPath = ffmpegPath;
        this.timeoutMs = timeoutMs;
        checkFfmpegAvailable();
    }

    public long transcode(Path input, Path output, int width, int height, int fps, int threshold)
            throws IOException, InterruptedException, TranscodeException {
        if (width <= 0 || height <= 0) throw new IllegalArgumentException("size must be positive");
        if (fps <= 0) throw new IllegalArgumentException("fps must be positive");
        if (threshold < 0 || threshold > 255) throw new IllegalArgumentException("threshold must be in [0, 255]");

        String vf = String.format(
                "scale=%d:%d:force_original_aspect_ratio=decrease," +
                "pad=%d:%d:(ow-iw)/2:(oh-ih)/2:black,format=gray," +
                "lut=y='if(gt(val,%d),255,0)'",
                width, height, width, height, threshold);

        List<String> cmd = new ArrayList<>(List.of(
                ffmpegPath,
                "-nostdin", "-hide_banner", "-loglevel", "error",
                "-i", input.toString(),
                "-vf", vf,
                "-r", String.valueOf(fps),
                "-an",
                "-f", "rawvideo", "-pix_fmt", "gray",
                "-y", output.toString()
        ));

        log.info("Starting ffmpeg: {}", String.join(" ", cmd));
        Process process = new ProcessBuilder(cmd)
                .redirectErrorStream(true)
                .start();

        byte[] outputBytes;
        try {
            outputBytes = process.getInputStream().readAllBytes();
        } catch (IOException e) {
            process.destroyForcibly();
            throw e;
        }

        boolean finished = process.waitFor(timeoutMs, TimeUnit.MILLISECONDS);
        if (!finished) {
            process.destroyForcibly();
            throw new TranscodeException("ffmpeg timed out after " + timeoutMs + " ms");
        }

        int exitCode = process.exitValue();
        String stderr = new String(outputBytes);
        if (exitCode != 0) {
            throw new TranscodeException("ffmpeg exit code " + exitCode + ": " + stderr.trim());
        }

        long frameSize = (long) width * height;
        long fileSize = Files.size(output);
        if (frameSize == 0 || fileSize % frameSize != 0) {
            throw new TranscodeException(
                    "unexpected output size: " + fileSize + " bytes, frame size " + frameSize);
        }
        long frameCount = fileSize / frameSize;
        if (frameCount == 0) {
            throw new TranscodeException("no frames produced");
        }
        log.info("Transcode finished: {} frames, {} bytes", frameCount, fileSize);
        return frameCount;
    }

    private void checkFfmpegAvailable() {
        try {
            Process p = new ProcessBuilder(ffmpegPath, "-version")
                    .redirectErrorStream(true)
                    .start();
            boolean done = p.waitFor(5, TimeUnit.SECONDS);
            if (!done || p.exitValue() != 0) {
                log.warn("ffmpeg check at '{}' did not succeed — video transcoding will fail", ffmpegPath);
            } else {
                log.info("ffmpeg available at '{}'", ffmpegPath);
            }
        } catch (IOException | InterruptedException e) {
            log.warn("ffmpeg not found at '{}': {}. Install ffmpeg to enable video transcoding.",
                    ffmpegPath, e.getMessage());
            if (e instanceof InterruptedException) Thread.currentThread().interrupt();
        }
    }

    public static class TranscodeException extends Exception {
        public TranscodeException(String message) {
            super(message);
        }
    }
}
