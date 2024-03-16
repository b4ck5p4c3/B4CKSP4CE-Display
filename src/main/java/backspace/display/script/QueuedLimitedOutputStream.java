package backspace.display.script;

import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.LinkedList;
import java.util.List;

public class QueuedLimitedOutputStream extends OutputStream {

    private final LinkedList<Byte> buffer = new LinkedList<>();
    private final long limit;

    public QueuedLimitedOutputStream(long limit) {
        if (limit <= 0) {
            throw new IllegalArgumentException("Limit must be greater than 0");
        }
        this.limit = limit;
    }

    @Override
    public void write(int i) {
        synchronized (buffer) {
            if (buffer.size() >= limit) {
                buffer.removeFirst();
            }
            buffer.add((byte) i);
        }
    }

    @Override
    public void write(byte[] b) {
        this.write(b, 0, b.length);
    }

    @Override
    public void write(byte[] b, int off, int len) {
        synchronized (buffer) {
            for (int i = off; i < off + len; i++) {
                if (buffer.size() >= limit) {
                    buffer.removeFirst();
                }
                buffer.add(b[i]);
            }
        }
    }

    @Override
    public void flush() {
        synchronized (buffer) {
            buffer.clear();
        }
    }

    public synchronized List<String> getLinesAndErase() {
        byte[] line = new byte[8192];
        List<String> lines = new LinkedList<>();
        int offset = 0;
        synchronized (buffer) {
            while (!buffer.isEmpty()) {
                byte b = buffer.removeFirst();
                if (b == '\n' || offset >= line.length) {
                    lines.add(new String(line, 0, offset, StandardCharsets.UTF_8));
                    line = new byte[8192];
                    offset = 0;
                } else {
                    line[offset++] = b;
                }
            }
            for (int i = 0; i < offset; i++) {
                buffer.add(line[i]);
            }
        }
        return lines;
    }
}
