package backspace.display.field.printer;

import backspace.display.field.Frame;
import jssc.SerialPort;
import jssc.SerialPortException;
import jssc.SerialPortList;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.io.File;
import java.nio.file.Files;
import java.util.Random;
import java.util.StringJoiner;


@Log4j2
public class SerialPrinter implements FieldPrinter {

    private SerialPort serialPort;

    private final Integer blockCount;

    private final Integer blockSize;



    private static final int MAX_BUFFER_SIZE = 600;


    public SerialPrinter(@Value("${display.printer.serial.port}") String portName,
                         @Value("${display.printer.serial.baudRate}") Integer baudRate,
                         @Value("${display.printer.serial.dataBits}") Integer dataBits,
                         @Value("${display.printer.serial.stopBits}") Integer stopBits,
                         @Value("${display.printer.serial.parity}") Integer parity,
                         @Value("${display.block.count}") Integer blockCount,
                         @Value("${display.block.size}") Integer blockSize) {
        selectPort(portName, baudRate, dataBits, stopBits, parity);
        this.blockCount = blockCount;
        this.blockSize = blockSize;
        flush();
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


    }

    private static String findPort() {
        File[] portNames = new File("/dev/serial/by-id").listFiles();
        if (portNames!=null && portNames.length == 1) {
            log.info("USB device found: " + portNames[0]);
            return portNames[0].getAbsolutePath();
        } else {
            StringBuilder errorMessage = new StringBuilder();
            if (portNames!=null && portNames.length>1){
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
        if (isBufferQueued()){
            throw new IllegalStateException("Buffer is full");
        }
        byte[][] bits = new byte[blockCount][blockSize];
        for (int width = 0; width < 40; width++) {
            for (int height = 0; height < 32; height++) {
                Point point = new Point(width , height);
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

    public boolean isBufferQueued(){
        try {
            return serialPort.getOutputBufferBytesCount() > MAX_BUFFER_SIZE;
        } catch (SerialPortException e) {
            log.error("Error while checking buffer", e);
            return false;
        }
    }



}
