package backspace.display.field.display;

import backspace.display.field.Frame;
import backspace.display.field.printer.FieldPrinter;
import backspace.display.field.writer.FieldWriter;
import backspace.display.service.config.DisplayConfig;
import lombok.extern.log4j.Log4j2;

import java.time.Duration;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;


@Log4j2
public class IntervalRefreshDisplay extends Display {

    private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
    private final Duration interval;

    public IntervalRefreshDisplay(Duration interval, Frame frame, FieldWriter fieldWriter, FieldPrinter fieldPrinter, DisplayConfig displayConfig) {
        super(frame, fieldWriter, fieldPrinter, displayConfig);
        this.interval = interval;
    }


    public void start() {
        executor.scheduleAtFixedRate(this::tick, 0, interval.toMillis(), java.util.concurrent.TimeUnit.MILLISECONDS);
    }


    public void stop() {
        executor.shutdown();
    }
}
