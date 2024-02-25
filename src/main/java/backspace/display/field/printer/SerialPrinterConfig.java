package backspace.display.field.printer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "display.printer", havingValue = "serial")
public class SerialPrinterConfig {

    @Bean
    @ConditionalOnProperty(name = "display.printer.serial.port")
    public SerialPrinter serialPrinterWithPort(@Value("${display.printer.serial.port}") String portName,
                                               @Value("${display.printer.serial.baudRate}") Integer baudRate,
                                               @Value("${display.printer.serial.dataBits}") Integer dataBits,
                                               @Value("${display.printer.serial.stopBits}") Integer stopBits,
                                               @Value("${display.printer.serial.parity}") Integer parity,
                                               @Value("${display.block.count}") Integer blockCount,
                                               @Value("${display.block.size}") Integer blockSize) {
        return new SerialPrinter(portName, baudRate, dataBits, stopBits, parity, blockCount, blockSize);
    }

    @Bean
    @ConditionalOnProperty(name = "display.printer.serial.port", matchIfMissing = true)
    public SerialPrinter serialPrinterWithoutPort(@Value("${display.printer.serial.baudRate}") Integer baudRate,
                                                  @Value("${display.printer.serial.dataBits}") Integer dataBits,
                                                  @Value("${display.printer.serial.stopBits}") Integer stopBits,
                                                  @Value("${display.printer.serial.parity}") Integer parity,
                                                  @Value("${display.block.count}") Integer blockCount,
                                                  @Value("${display.block.size}") Integer blockSize) {
        return new SerialPrinter(baudRate, dataBits, stopBits, parity, blockCount, blockSize);
    }

}
