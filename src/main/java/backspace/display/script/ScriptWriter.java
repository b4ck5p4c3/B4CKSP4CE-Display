package backspace.display.script;

import backspace.display.field.Frame;
import backspace.display.field.printer.FieldPrinter;
import backspace.display.field.writer.FieldWriter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.python.core.Py;
import org.python.core.PyObject;
import org.python.util.PythonInterpreter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@NoArgsConstructor
@Data
@Log4j2
@Component
public class ScriptWriter implements FieldWriter {

    private Script script;
    @Override
    public void writeToField(Frame frame) {
        if (script == null) {
            log.warn("No script to execute, skipping.");
            return;
        }
        executeScriptToField(script, frame);
    }

    private void executeScriptToField(Script script, Frame frame) {
;

        try (PythonInterpreter interpreter = new PythonInterpreter()) {
            byte[][] pixelsBrightnesses = frame.getPixelsBrightnesses();
            long startTime = 0;
            if (log.isDebugEnabled())
                startTime = System.currentTimeMillis();
            interpreter.set("PIXELS", pixelsBrightnesses);
            Map<String, Object> environment = new HashMap<>();
            environment.put("Int", 1);
            environment.put("Float", 1.0);
            environment.put("String", "1");

            interpreter.set("ENVIRONMENT", environment);
            interpreter.set("PARAMETERS", script.getParameters());
            interpreter.set("PANEL_WIDTH", frame.width());
            interpreter.set("PANEL_HEIGHT", frame.height());
            interpreter.setOut(System.out);
            interpreter.exec(script.getScript());
            PyObject pythonArray = interpreter.get("PIXELS");
            PyObject pythonEnvironment = interpreter.get("ENVIRONMENT");
            PyObject pythonParameters = interpreter.get("PARAMETERS");
            if (log.isDebugEnabled())
                log.debug("Script execution took %d ms".formatted(System.currentTimeMillis() - startTime));
            pixelsBrightnesses = (byte[][]) pythonArray.__tojava__(byte[][].class);
            frame.setPixelsBrightnesses(pixelsBrightnesses);
        }
    }
}
