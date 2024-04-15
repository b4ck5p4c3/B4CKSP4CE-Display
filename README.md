
<div align="center">
<!-- Title: -->
  <h1>Space Display</h1>
  <img src="https://github.com/b4ck5p4c3/B4CKSP4CE-Display/assets/23121394/39313426-e82f-4a4d-959c-629d4c285b75" height="300" alt="Preview"><br>
<!-- Labels: -->
  <!-- First row: -->
  <a href="https://0x08.in">
    <img src="https://img.shields.io/badge/0x08.in-8A2BE2" height="20" alt="Build status">
  </a>
</div>



REST API, Websocket & Lua interpreter for [B4CKSP4CE](https://0x08.in/) hackerspace LED display. Backend written using Spring Framework. Fronted written using React + node.js.

Swagger available at `/swagger-ui/index.html`\
To find the web panel `/`

### Quick run 
1. Download & install Java 17 ([link](https://www.oracle.com/java/technologies/downloads/#java17))
2. Download latest release of Space Display
3. `java -jar spaceDisplay.jar --data.path=data --display.printer.serial.port=/dev/serial/by-id/DISPLAY_ID --server.baseUrl=http://SERVER_URL:8080` (replace DISPLAY_ID with your device)


### Available parameters

`--server.port=8080` - API Port

`--server.baseUrl=<URL>` - Space Display URL where available. Used for frontend configuration. **Required if** you want use frontend

`--display.default.scriptId=<UUID>` - UUID of default script. It starts on app boot 

`--data.path=<PATH>` - Path where app files will be stored. **Required**

`--display.printer.serial.port=<PATH>` - Display serial path. If there is only one serial, it will be detected automatically, else **required**

`display.width=40` - Width of display. Data will be truncated to this value

`display.height=32` - Height of display. Like width but height.

`display.printer.serial.baudRate=115200` - BitRate of serial 

`display.printer.serial.dataBits=8` - Data bits

`display.printer.serial.stopBits=1` - Stop bits 

`display.printer.serial.parity=0` - Parity (PARITY_NONE = 0; PARITY_ODD = 1; PARITY_EVEN = 2; PARITY_MARK = 3; PARITY_SPACE = 4;)

### Frontend

Frontend integrated with .jar, but if you want you can run it separately. See # 

### Contribution
