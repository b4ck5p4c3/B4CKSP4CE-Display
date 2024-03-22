

### Quick run 
1. Download & install Java 17 ([link](https://www.oracle.com/java/technologies/downloads/#java17))
2. Download latest release of Space Display
3. `java -jar spaceDisplay.jar --data.path=data --display.printer.serial.port=/dev/serial/by-id/DISPLAY_ID` (replace DISPLAY_ID with your device)


### Available parameters

`--server.port=8080` - API Port

`--data.path=<PATH>` - Path where app files will be stored. **Required**

`--display.printer.serial.port=<PATH>` - Display serial path. If there is only one serial, it will be detected automatically, else **required**

`display.width=40` - Width of display. Data will be truncated to this value

`display.height=32` - Height of display. Like width but height.

`display.printer.serial.baudRate=115200` - BitRate of serial 

`display.printer.serial.dataBits=8` - Data bits

`display.printer.serial.stopBits=1` - Stop bits 

`display.printer.serial.parity=0` - Parity (PARITY_NONE = 0; PARITY_ODD = 1; PARITY_EVEN = 2; PARITY_MARK = 3; PARITY_SPACE = 4;)