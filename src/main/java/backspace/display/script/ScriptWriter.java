package backspace.display.script;

import backspace.display.field.Frame;
import backspace.display.field.writer.FieldWriter;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.luaj.vm2.Globals;
import org.luaj.vm2.LuaTable;
import org.luaj.vm2.LuaValue;
import org.luaj.vm2.lib.jse.CoerceJavaToLua;
import org.luaj.vm2.lib.jse.CoerceLuaToJava;
import org.luaj.vm2.lib.jse.JsePlatform;
import org.springframework.stereotype.Component;

import java.io.PrintStream;

@Getter
@NoArgsConstructor
@Log4j2
@Component
public class ScriptWriter implements FieldWriter {

    private Script script;

    private static final int MAX_OUT_BUFFER_SIZE = 8192;

    private final QueuedLimitedOutputStream stdout = new QueuedLimitedOutputStream(MAX_OUT_BUFFER_SIZE);


    public ScriptWriter(Script script) {
        this.script = script;
    }

    @Override
    public void writeToField(Frame frame) {
        if (script == null) {
            log.warn("No script to execute, skipping.");
            return;
        }
        executeScriptToField(script, frame);

    }


    private void executeScriptToField(Script script, Frame frame) {
        long start = System.currentTimeMillis();
        Globals globals = JsePlatform.standardGlobals();
        globals.STDOUT = new PrintStream(stdout);
        globals.STDERR = new PrintStream(stdout);
        int[][] field = bytesToInteger(frame.getPixelsBrightnesses());
        globals.set("PIXELS", CoerceJavaToLua.coerce(field));
        globals.set("WIDTH", frame.width());
        globals.set("HEIGHT", frame.height());
        if (script.getGlobals() == null) {
            script.setGlobals(new LuaTable());
        }
        globals.set("GLOBALS", script.getGlobals());
        try {
            LuaValue chunk = globals.load(script.getScript());
            chunk.call();
        } catch (Exception e) {
            stdout.write(e.getMessage().getBytes());
        }
        LuaValue newPixelsLuaValue = globals.get("PIXELS");
        script.setGlobals((LuaTable) globals.get("GLOBALS"));
        if (!newPixelsLuaValue.isnil()) {
            int[][] newPixels = (int[][]) CoerceLuaToJava.coerce(newPixelsLuaValue, int[][].class);
            frame.setPixelsBrightnesses(integerToBytes(newPixels));
        }
        log.debug("Script execution took {} ms", System.currentTimeMillis() - start);
    }


    private int[][] bytesToInteger(byte[][] bytes) {
        int[][] intBytes = new int[bytes.length][bytes[0].length];
        for (int i = 0; i < bytes.length; i++) {
            for (int j = 0; j < bytes[0].length; j++) {
                intBytes[i][j] = bytes[i][j];
            }
        }
        return intBytes;
    }

    private byte[][] integerToBytes(int[][] intBytes) {
        byte[][] bytes = new byte[intBytes.length][intBytes[0].length];
        for (int i = 0; i < intBytes.length; i++) {
            for (int j = 0; j < intBytes[0].length; j++) {
                bytes[i][j] = (byte) intBytes[i][j];
            }
        }
        return bytes;
    }

    @SneakyThrows
    public void setScript(Script script) {
        this.script = script;
        stdout.flush();
    }

    public void clearStd() {
        stdout.flush();
    }
}


