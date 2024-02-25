package backspace.display.field.display;

import backspace.display.field.Frame;
import backspace.display.field.printer.FieldPrinter;
import backspace.display.field.writer.FieldWriter;
import backspace.display.service.config.DisplayConfig;
import lombok.extern.log4j.Log4j2;

import java.util.concurrent.atomic.AtomicLong;

@Log4j2
public abstract class Display {


    protected Frame frame;
    public final FieldPrinter fieldPrinter;

    public final FieldWriter fieldWriter;

    protected final DisplayConfig displayConfig;

    private final AtomicLong lastUpdate = new AtomicLong(0);
    private final AtomicLong successfulUpdates = new AtomicLong(0);
    private final AtomicLong failedUpdates = new AtomicLong(0);


    public Display(Frame frame, FieldWriter fieldWriter, FieldPrinter fieldPrinter, DisplayConfig displayConfig) {
        this.frame = frame.clone();
        this.fieldWriter = fieldWriter;
        this.fieldPrinter = fieldPrinter;
        this.displayConfig = displayConfig;
    }

    public abstract void start();

    public Frame getFrame() {
        return frame.clone();
    }

    public void setFrame(Frame frame) {
        this.frame = frame.clone();
    }


    protected void tick() {

        try {
            fieldWriter.writeToField(frame);
            frame.crop(displayConfig.getWidth(), displayConfig.getHeight());
            fieldPrinter.printField(frame);
            successfulUpdates.incrementAndGet();
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
            log.info("Updates: success {}, failed: {}, loses: {}%, time: {} ms",
                    successfulUpdates.get(),
                    failedUpdates.get(),
                    (float) failedUpdates.get()/(successfulUpdates.get() + failedUpdates.get())*100,
                    diff);
            successfulUpdates.set(0);
            failedUpdates.set(0);
        }
    }



}
