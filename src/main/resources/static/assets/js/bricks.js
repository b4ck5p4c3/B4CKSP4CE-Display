/**********
 Global Var
 ***********/
// Global
var canvas, canvasContext;

// Bricks
const BRICK_W = 20;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_COLS = 40;
const BRICK_ROWS = 10;
const autoPlayCheckBox = document.getElementById('autoPlayCheckbox');
const TargetFPS = document.getElementById('FPSInput');
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var brickCount = 0;

// Ball
var ballX = 75;
var ballSpeedX = 8;
var ballY = 72;
var ballSpeedY = 8;
var ballPrevX = 75;
var ballPrevY = 72;
const ballRadius = 10;

// Main Paddle
var paddleX = 400;
const PADDLE_THICKNESS = 15;
const PADDLE_WIDTH = 100;
const PADDLE_DIST_FROM_EDGE = 60;


// Mouse
var mouseX = 0;
var mouseY = 0;
var autoModeOffset = 0;

// Screen
const SCREEN_X = 40;
const SCREEN_Y = 32;

// WinScreen
const NOIZE_ROWS = 20;
const NOIZE_FACTOR = 0.6;
const NOIZE_MOVE_INTERVAL = 1000;
const CATGIRL = [
    // 1-5
    Array(40).fill(false),
    Array(40).fill(false),
    Array(40).fill(false).fill(true, 18, 23),
    Array(40).fill(false).fill(true, 17, 24),
    Array(40).fill(false).fill(true, 16, 25),
    // 6-10
    Array(40).fill(false).fill(true, 15, 26),
    Array(40).fill(false).fill(true, 14, 27),
    Array(40).fill(false).fill(true, 13, 28).fill(true, 19, 22),
    Array(40).fill(false).fill(true, 12, 29),
    Array(40).fill(false).fill(true, 11, 30),
    // 11-15
    Array(40).fill(false).fill(true, 10, 31),
    Array(40).fill(false).fill(true, 9, 32),
    Array(40).fill(false).fill(true, 8, 33),
    Array(40).fill(false).fill(true, 7, 34),
    Array(40).fill(false).fill(true, 6, 35),
    // 16-20
    Array(40).fill(false).fill(true, 5, 36),
    Array(40).fill(false).fill(true, 4, 37),
    Array(40).fill(false).fill(true, 3, 38),
    Array(40).fill(false).fill(true, 2, 39),
    Array(40).fill(false).fill(true, 1, 40),
];
var winScreenInit = false;
var currentNoizeRow = 1;
var showWinPicture = false;
/**********
 General GamePlay
 ***********/
window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    updateAll();

    canvas.addEventListener('mousemove', updateMousePos);
    brickReset();
    ballRest();
}

function updateAll() {
    movement();
    playArea();
    sendFieldToDisplay();
    setTimeout(updateAll, 1000 / TargetFPS.value);
}

function ballRest() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 80;

}

function brickReset() {
    brickCount = 0;
    var i;
    for (var i = 0; i < 3 * BRICK_COLS; i++) {
        brickGrid[i] = false;
    }
    for (; i < BRICK_COLS * BRICK_ROWS; i++) {
        if (Math.random() < 0.5) {
            brickGrid[i] = true;
        } else {
            brickGrid[i] = false;
        }
        brickGrid[i] = true;
        brickCount++;
    }
}


function ballMove() {
    ballPrevX = ballX;
    ballPrevY = ballY;
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    // ballY
    if (ballY > canvas.height - 2) {
        ballRest();
        brickReset();
    } else if (ballY < 8 && ballSpeedY != 0.0) {
        ballSpeedY = -ballSpeedY;
    }
    // ballx
    if (ballX > canvas.width && ballSpeedX > 0.0) {
        ballSpeedX = -ballSpeedX;
    } else if (ballX < 0 && ballSpeedX < 0.0) {
        ballSpeedX = -ballSpeedX;
    }
}


function isBrickAtColRow(col, row) {
    if (col >= 0 && col < BRICK_COLS &&
        row >= 0 && row < BRICK_ROWS) {
        var brickIndexUnderCoord = rowColToArrayIndex(col, row);
        return brickGrid[brickIndexUnderCoord];
    } else {
        return false;
    }
}

function ballBrickColl() {
    var ballLeft = ballX - ballRadius;
    var ballRight = ballX + ballRadius;
    var ballTop = ballY - ballRadius;
    var ballBottom = ballY + ballRadius;

    // Дополнительные точки для углов
    var cornerOffsets = [
        {dx: -ballRadius, dy: -ballRadius}, // верхний левый угол
        {dx: ballRadius, dy: -ballRadius},  // верхний правый угол
        {dx: -ballRadius, dy: ballRadius},  // нижний левый угол
        {dx: ballRadius, dy: ballRadius}    // нижний правый угол
    ];

    var collisionDetected = false;

    // Проверка столкновения для всех 8 точек
    [{x: ballLeft, y: ballY},
        {x: ballRight, y: ballY},
        {x: ballX, y: ballTop},
        {x: ballX, y: ballBottom}
    ].concat(cornerOffsets.map(offset => ({x: ballX + offset.dx, y: ballY + offset.dy})))
        .some(point => { // Используем .some для немедленного прерывания после обнаружения первого столкновения
            var brickCol = Math.floor(point.x / BRICK_W);
            var brickRow = Math.floor(point.y / BRICK_H);

            if (brickCol >= 0 && brickCol < BRICK_COLS && brickRow >= 0 && brickRow < BRICK_ROWS) {
                var brickIndex = rowColToArrayIndex(brickCol, brickRow);
                if (isBrickAtColRow(brickCol, brickRow)) {
                    brickGrid[brickIndex] = false;
                    brickCount--;
                    collisionDetected = true;

                    // Определение стороны столкновения должно быть пересмотрено
                    // Предположим, что мяч движется достаточно быстро, чтобы преодолеть расстояние больше, чем один кирпич за кадр.
                    // Это условие проверяет, было ли столкновение с верхней или нижней стороной кирпича.
                    if (ballPrevY < brickRow * BRICK_H || ballPrevY > (brickRow + 1) * BRICK_H) {
                        ballSpeedY = -ballSpeedY;
                    }
                    // Это условие проверяет, было ли столкновение с левой или правой стороной кирпича.
                    if (ballPrevX < brickCol * BRICK_W || ballPrevX > (brickCol + 1) * BRICK_W) {
                        ballSpeedX = -ballSpeedX;
                    }

                    return true; // Возвращаем true, чтобы прервать цикл some
                }
            }
            return false; // Продолжаем цикл, если столкновение не обнаружено
        });

    if (collisionDetected) {
        // Тут можно выполнить дополнительные действия после обработки столкновения
    }
}


function paddleMove() {
    // paddle
    var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleX + PADDLE_WIDTH;
    if (ballY > paddleTopEdgeY && // top of paddle
        ballY < paddleBottomEdgeY && // bottom of paddle
        ballX > paddleLeftEdgeX && // left half of paddle
        ballX < paddleRightEdgeX // right half of paddle
    ) {

        ballSpeedY = -ballSpeedY;
        autoModeOffset = Math.random() * PADDLE_WIDTH / 4;

        var paddleCenterX = paddleX + PADDLE_WIDTH / 2;
        var ballDistFromCenterX = ballX - paddleCenterX;
        ballSpeedX = ballDistFromCenterX * 0.35;

        console.log('BrickCount: ' + brickCount);
        if (brickCount <= 0) {
            winnigScreen();
        }

    }
}

function winnigScreen() {

    brickGrid = getNoizeArray(currentNoizeRow, SCREEN_X, SCREEN_Y);
    if (!winScreenInit) {
        winScreenInit = true;
        setInterval(function () {
            if (currentNoizeRow <= NOIZE_ROWS) {
                currentNoizeRow += 1;
            }
        }, NOIZE_MOVE_INTERVAL);
        //  setTimeout(function (){showWinPicture=true}, NOIZE_MOVE_INTERVAL*(NOIZE_ROWS+1));

    }
    if (showWinPicture) {
        printWinPicture(brickGrid);
    }
    ballSpeedX = 0;
    ballSpeedY = 0;

}

function printWinPicture(array) {
    for (var i = NOIZE_ROWS; i > SCREEN_Y - NOIZE_ROWS * 2; i--) {
        for (var j = 0; j < SCREEN_X; j++) {
            array[i][j] = CATGIRL[i - SCREEN_Y][j];
        }
    }
    for (var y = 0; y < CATGIRL.length; y++) {
        for (var x = 0; x < CATGIRL[y].length; x++) {
            array[y + NOIZE_ROWS][x] = CATGIRL[y][x];
        }
    }
}

function getNoizeArray(noizeSize, xSize, ySize) {

    var noizeArray = new Array(xSize * ySize);
    for (var i = 0; i < xSize * noizeSize; i++) {
        noizeArray[i] = Math.random() > NOIZE_FACTOR;
    }
    for (var i = xSize * ySize; i > xSize * ySize - (xSize * noizeSize); i--) {

        noizeArray[i] = Math.random() > NOIZE_FACTOR;
    }

    return noizeArray;
}


function movement() {
    if (autoPlayCheckBox.checked) {
        paddleAutoMove();
    }
    ballMove();
    ballBrickColl();
    paddleMove();

}

function paddleAutoMove() {
    paddleX = ballX - PADDLE_WIDTH / 2 + autoModeOffset;
}

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    if (!autoPlayCheckBox.checked) {
        paddleX = mouseX - PADDLE_WIDTH / 2;
    }

    //cheat to test ball in any position
    // ballX = mouseX;
    // ballY = mouseY;
    // ballSpeedY = 4;
    // ballSpeedY = -4;
}

/**********
 GamePlay Draw functions
 ***********/
function playArea() {
    // gameCanvas
    colorRect(0, 0, canvas.width, canvas.height, 'white');
    // ball
    colorCircle();
    // paddle
    colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'black');

    drawbricks();
}

function colorRect(leftX, topY, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorText(showWords, textX, textY, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX, textY);
}

function rowColToArrayIndex(col, row) {
    return col + BRICK_COLS * row;
}

function drawbricks() {
    for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
        for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
            if (brickGrid[arrayIndex]) {
                colorRect(BRICK_W * eachCol, BRICK_H * eachRow,
                    BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'green');
            } //   if brick
        }// each brick
    }// each brickrow
}// drawbricks

function colorCircle() {
    canvasContext.fillStyle = 'black';
    canvasContext.beginPath();
    canvasContext.arc(ballX, ballY, ballRadius + 2, 0, Math.PI * 2, true);
    canvasContext.fill();
}

const wsEndpoints = {
    ws: window.location.origin + "/ws",
    update: '/frame/update'
}

const minWsInterval = 1000 / 75;
var lastWsTime = 0;

var socket = new SockJS(wsEndpoints.ws);
import {Stomp} from '@stomp/stompjs';

var stompClient = Stomp.over(socket);

stompClient.connect({}, function (frame) {
    var url = stompClient.ws._transport.url;
    console.log("Your current session is: " + url);
    sendFieldToDisplay();

});

function brickFieldToPixelsBrightnesses() {
    let bytesArr = [];
    for (var eachRow = 0; eachRow < SCREEN_Y; eachRow++) {
        bytesArr[eachRow] = [];
        for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
            if (brickGrid[arrayIndex]) {
                bytesArr[eachRow][eachCol] = 255;
            } else {
                bytesArr[eachRow][eachCol] = 0;
            }
        }
    }
    var ballPos = [Math.floor((ballX / canvas.width) * SCREEN_X), Math.floor((ballY / canvas.height) * SCREEN_Y)];
    var paddleStart = Math.floor((paddleX / canvas.width) * SCREEN_X);
    var paddleWidth = Math.floor((PADDLE_WIDTH / canvas.width) * SCREEN_X);
    for (var i = paddleStart; i < paddleStart + paddleWidth; i++) {
        bytesArr[SCREEN_Y - 2][i] = 255;
    }
    bytesArr[ballPos[1]][ballPos[0]] = 255;
    return bytesArr;
}


function bytesArrayToBase64(bytesArrays) {
    return bytesArrays.map(bytes => btoa(String.fromCharCode.apply(null, bytes)));
}

function sendFieldToDisplay() {
    let fieldBase64 = bytesArrayToBase64(brickFieldToPixelsBrightnesses());
    updateField(fieldBase64);
}

function initField() {

}

function updateField(fieldBase64) {
    if (!stompClient.connected) {
        return false;
    }
    if (Date.now() - lastWsTime < minWsInterval) {
        return false;
    }
    stompClient.send(wsEndpoints.update, {}, JSON.stringify({'pixelsBrightnesses': fieldBase64}));
    lastWsTime = Date.now();
}


document.addEventListener('keydown', function (event) {
    if (event.code === 'KeyA') {

        if (autoPlayCheckBox) {
            autoPlayCheckBox.checked = !autoPlayCheckBox.checked;
        }
    }
});
