package backspace.display.video;

import backspace.display.field.Frame;
import backspace.display.field.display.Display;
import backspace.display.field.printer.FieldPrinter;
import backspace.display.service.config.DisplayConfig;
import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

@Log4j2
@Component
@Qualifier("videoDisplay")
public class VideoRunnerDisplay extends Display {

    @Getter
    private final VideoWriter fieldWriter;
    private ScheduledExecutorService executor = new ScheduledThreadPoolExecutor(1);

    private volatile Display previousDisplay;
    private final AtomicBoolean reverting = new AtomicBoolean(false);

    public VideoRunnerDisplay(VideoWriter fieldWriter, FieldPrinter fieldPrinter, DisplayConfig displayConfig) {
        super(new Frame(displayConfig.getHeight(), displayConfig.getWidth()), fieldWriter, fieldPrinter, displayConfig);
        this.fieldWriter = fieldWriter;
    }

    public void setVideo(Video video, Path binFile, Display previous) {
        fieldWriter.setVideo(video, binFile);
        if (previous != null && previous != this) {
            this.previousDisplay = previous;
        }
        reverting.set(false);
        if (isRunning.get()) {
            runScheduler(video);
        }
    }

    @Override
    public void start() {
        super.start();
        if (fieldWriter.hasVideo()) {
            runScheduler(fieldWriter.getVideo());
        }
    }

    @Override
    public void stop() {
        super.stop();
        executor.shutdownNow();
    }

    private void runScheduler(Video video) {
        try {
            executor.shutdownNow();
            executor.awaitTermination(3, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        executor = new ScheduledThreadPoolExecutor(1);
        long intervalMs = Math.max(1, 1000L / Math.max(1, video.getFps()));
        executor.scheduleAtFixedRate(this::videoTick, 0, intervalMs, TimeUnit.MILLISECONDS);
    }

    private void videoTick() {
        if (!isRunning.get() || reverting.get()) return;
        try {
            super.tick();
        } catch (Exception e) {
            log.error("Video tick failed", e);
        }
        if (fieldWriter.isEnded() && reverting.compareAndSet(false, true)) {
            Thread t = new Thread(this::revertToPrevious, "video-revert");
            t.setDaemon(true);
            t.start();
        }
    }

    private void revertToPrevious() {
        Display prev = previousDisplay;
        previousDisplay = null;
        try {
            if (isRunning.get()) {
                stop();
            }
        } catch (IllegalStateException ignored) {
        }
        reverting.set(false);
        if (prev != null && prev != this) {
            try {
                prev.activate();
                log.info("Video ended (ONCE) — reverted to {}", prev.getClass().getSimpleName());
            } catch (Exception e) {
                log.warn("Failed to revert to previous display: {}", e.getMessage());
            }
        }
    }
}
