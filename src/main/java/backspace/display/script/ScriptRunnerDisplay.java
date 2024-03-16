package backspace.display.script;

import backspace.display.field.Frame;
import backspace.display.field.display.Display;
import backspace.display.field.printer.FieldPrinter;
import backspace.display.service.config.DisplayConfig;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;


@Component
@Qualifier("scriptRunnerDisplay")
public class ScriptRunnerDisplay extends Display {
    @Getter
    private final ScriptWriter fieldWriter;
    private ScheduledExecutorService executor = new ScheduledThreadPoolExecutor(1);

    public ScriptRunnerDisplay(ScriptWriter fieldWriter, FieldPrinter fieldPrinter, DisplayConfig displayConfig) {
        super(new Frame(displayConfig.getHeight(), displayConfig.getWidth()), fieldWriter, fieldPrinter, displayConfig);
        this.fieldWriter = fieldWriter;
    }


    public void setScript(Script script) {
        fieldWriter.setScript(script);
        if (isRunning.get()) {
            run(script);
        }
    }


    @Override
    public void start() {
        super.start();
        if (fieldWriter.getScript() != null) {
            run(fieldWriter.getScript());
        }
    }

    @Override
    public void stop() {
        super.stop();
        executor.shutdownNow();
    }

    private void run(Script script) {
        try {
            executor.shutdownNow();
            boolean isSuccessShutdown = executor.awaitTermination(10000, java.util.concurrent.TimeUnit.MILLISECONDS);
            if (!isSuccessShutdown) {
                throw new RuntimeException("Failed to shutdown executor with script %s"
                        .formatted(fieldWriter.getScript().getId()));
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        executor = new ScheduledThreadPoolExecutor(1);
        executor.scheduleAtFixedRate(super::tick, 0, script.getRunIntervalMs(), java.util.concurrent.TimeUnit.MILLISECONDS);
    }

}
