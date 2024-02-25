package backspace.display.field.display;

import backspace.display.field.Frame;
import backspace.display.field.printer.FieldPrinter;
import backspace.display.field.writer.FieldWriter;
import backspace.display.service.config.DisplayConfig;
import lombok.extern.log4j.Log4j2;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

@Log4j2
public abstract class Display {

    private static final AtomicBoolean isAnyRunning = new AtomicBoolean(false);
    private static Display runningDisplay;
    protected final AtomicBoolean isRunning = new AtomicBoolean(false);

    protected Frame frame;
    public final FieldPrinter fieldPrinter;

    public final FieldWriter fieldWriter;

    protected final DisplayConfig displayConfig;

    private final AtomicLong lastUpdate = new AtomicLong(0);
    private final AtomicLong sucessfulUpdates = new AtomicLong(0);
    private final AtomicLong failedUpdates = new AtomicLong(0);


    public Display(Frame frame, FieldWriter fieldWriter, FieldPrinter fieldPrinter, DisplayConfig displayConfig) {
        this.frame = frame.clone();
        this.fieldWriter = fieldWriter;
        this.fieldPrinter = fieldPrinter;
        this.displayConfig = displayConfig;
    }

    public void start(){
        if (!isAnyRunning.compareAndSet(false, true)){
            throw new IllegalStateException("Another display is already running");
        }
        if (!isRunning.compareAndSet(false, true)){
            throw new IllegalStateException("Display is already running");
        }
        runningDisplay = this;
    }

    public void stop(){
        if (!isRunning.compareAndSet(true, false)){
            throw new IllegalStateException("Display is not running");
        }
        if (!isAnyRunning.compareAndSet(true, false)){
            throw new IllegalStateException("Illegal state when stopping display. No display is running");
        }
        runningDisplay = null;
    }

    public void activate(){
        if (runningDisplay == this){
            return;
        }
        if (runningDisplay != null){
            runningDisplay.stop();
        }
        start();
    }

    public boolean isRunning() {
        return isRunning.get();
    }

    public Frame getFrame() {
        return frame.clone();
    }

    public void setFrame(Frame frame) {
        this.frame = frame.clone();
    }


    protected void tick() {
        if (!isRunning.get()) {
            throw new IllegalStateException("Display is not running. Run start() method first");
        }
        try {
            fieldWriter.writeToField(frame);
            frame.crop(displayConfig.getWidth(), displayConfig.getHeight());
            fieldPrinter.printField(frame);
            sucessfulUpdates.incrementAndGet();
        } catch (Exception e) {
            log.error("Error during display refresh", e);
            failedUpdates.incrementAndGet();
        }

        showStats();
    }

    private void showStats(){
        long last = lastUpdate.get();
        long now = System.currentTimeMillis();
        long diff = now - last;
        if (diff > 1000){
            lastUpdate.set(now);
            if (log.isDebugEnabled())
                log.debug("Updates: success {}, failed: {}, loses: {}%, time: {} ms",
                        sucessfulUpdates.get(),
                        failedUpdates.get(),
                        (float) failedUpdates.get()/(sucessfulUpdates.get() + failedUpdates.get())*100,
                        diff);
            sucessfulUpdates.set(0);
            failedUpdates.set(0);
        }
    }


    public static Display getRunning() {
        return runningDisplay;
    }

}
