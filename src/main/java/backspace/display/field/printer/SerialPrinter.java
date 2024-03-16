package backspace.display.field.printer;

import backspace.display.field.Frame;
import jssc.SerialPort;
import jssc.SerialPortException;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;

import java.awt.*;
import java.io.File;
import java.util.StringJoiner;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.atomic.AtomicBoolean;


@Log4j2
public class SerialPrinter implements FieldPrinter {

    private SerialPort serialPort;

    private final Integer blockCount;

    private final Integer blockSize;
    private final ScheduledExecutorService executorService;

    private final AtomicBoolean isDisconnected = new AtomicBoolean(true);

    private final File portFile;


    private static final int MAX_BUFFER_SIZE = 600;


    public SerialPrinter(@Value("${display.printer.serial.port}") String portName,
                         @Value("${display.printer.serial.baudRate}") Integer baudRate,
                         @Value("${display.printer.serial.dataBits}") Integer dataBits,
                         @Value("${display.printer.serial.stopBits}") Integer stopBits,
                         @Value("${display.printer.serial.parity}") Integer parity,
                         @Value("${display.block.count}") Integer blockCount,
                         @Value("${display.block.size}") Integer blockSize) {
        this.blockCount = blockCount;
        this.blockSize = blockSize;
        portFile = new File(portName);
        this.executorService = Executors.newScheduledThreadPool(1);
        selectPort(portName, baudRate, dataBits, stopBits, parity);

        this.executorService.scheduleAtFixedRate(() -> {
            if (!portFile.exists()) {
                if (!isDisconnected.get()) {
                    log.warn("Device disconnected. Waiting for restore...");
                }
                isDisconnected.set(true);
            } else if (isDisconnected.get()) {
                log.info("Device restored. Reconnecting...");
                selectPort(portName, baudRate, dataBits, stopBits, parity);
            }
        }, 0, 50, java.util.concurrent.TimeUnit.MILLISECONDS);
    }


    public SerialPrinter(
            @Value("${display.printer.serial.baudRate}") Integer baudRate,
            @Value("${display.printer.serial.dataBits}") Integer dataBits,
            @Value("${display.printer.serial.stopBits}") Integer stopBits,
            @Value("${display.printer.serial.parity}") Integer parity,
            @Value("${display.block.count}") Integer blockCount,
            @Value("${display.block.size}") Integer blockSize) {
        this(findPort(), baudRate, dataBits, stopBits, parity, blockCount, blockSize);
    }

    @SneakyThrows
    public void selectPort(String portName, int baudRate, int dataBits, int stopBits, int parity) {
        serialPort = new SerialPort(portName);
        serialPort.openPort();
        serialPort.setParams(baudRate,
                dataBits,
                stopBits,
                parity);
        serialPort.setFlowControlMode(SerialPort.FLOWCONTROL_RTSCTS_IN |
                SerialPort.FLOWCONTROL_RTSCTS_OUT);
        isDisconnected.set(false);
    }


    private static String findPort() {
        File[] portNames = new File("/dev/serial/by-id").listFiles();
        if (portNames != null && portNames.length == 1) {
            log.info("USB device found: " + portNames[0]);
            return portNames[0].getAbsolutePath();
        } else {
            StringBuilder errorMessage = new StringBuilder();
            if (portNames != null && portNames.length > 1) {
                errorMessage.append("Multiple USB devices found: ");
                StringJoiner joiner = new StringJoiner(", ");
                for (File portName : portNames) {
                    joiner.add(portName.getAbsolutePath());
                }
                errorMessage.append(joiner);
            } else {
                errorMessage.append("No USB devices found");
            }
            errorMessage.append(". Please specify it in run args like --display.printer.serial.port=/dev/ttyUSB0");
            throw new IllegalStateException(errorMessage.toString());
        }
    }

    @Override
    public synchronized void printField(Frame frame) {
        if (isBufferQueued()) {
            throw new IllegalStateException("Buffer is full");
        }
        if (isDisconnected.get()) {
            log.trace("Device is disconnected. Skipping frame");
            return;
        }
        byte[][] bits = new byte[blockCount][blockSize];
        for (int width = 0; width < 40; width++) {
            for (int height = 0; height < 32; height++) {
                Point point = new Point(width, height);
                byte brightness = frame.getPixelBrightness(point);
                int x_bit = 7 - width % 8;
                int y_byte = height % 16;
                int block_id = ((height / 16) * 5 + width / 8);
                if (brightness != 0) {
                    bits[block_id][y_byte] |= (byte) (1 << x_bit);
                }
            }
        }
        for (int blockNumber = 1; blockNumber <= blockCount; blockNumber++) {
            setBlock((byte) blockNumber, bits[blockNumber - 1]);
        }
    }

    protected void flush() {
        for (int blockNumber = 0; blockNumber <= blockCount; blockNumber++) {
            byte[] block = new byte[blockSize];
            for (int i = 0; i < blockSize; i++) {
                block[i] = (byte) 0;
            }
            setBlock((byte) blockNumber, block);
        }
    }


    @SneakyThrows
    protected void setBlock(byte address, byte[] data) {
        if (data.length != blockSize) {
            throw new IllegalArgumentException("Data length must be equal to block size");
        }
        serialPort.writeByte(address);
        for (byte b : data) {
            serialPort.writeByte(b);
        }
        serialPort.writeByte((byte) 0x00);
    }

    public boolean isBufferQueued() {
        try {
            return serialPort.getOutputBufferBytesCount() > MAX_BUFFER_SIZE;
        } catch (SerialPortException e) {
            log.error("Error while checking buffer", e);
            return false;
        }
    }


}
