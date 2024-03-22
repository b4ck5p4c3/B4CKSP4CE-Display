import React, { useRef, useEffect, useState } from 'react';

const GridCanvas = ({ grid, cellSize, gapSize, onClick }) => {
    const canvasRef = useRef(null);
    const [isMouseDown, setIsMouseDown] = useState(false);

    const drawGrid = (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                ctx.fillStyle = cell ? '#ff0000' : '#ffffff';
                ctx.fillRect(
                    x * (cellSize + gapSize),
                    y * (cellSize + gapSize),
                    cellSize,
                    cellSize
                );
            });
        });
    };



    // Вычисление координат на сетке и вызов onClick
    const handleAction = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / (cellSize + gapSize));
        const y = Math.floor((event.clientY - rect.top) / (cellSize + gapSize));
        onClick({ x, y });
    };

    // Обработчик клика
    const handleCanvasClick = (event) => {
        handleAction(event);
    };

    // Обработчик начала зажатия кнопки мыши
    const handleMouseDown = (event) => {
        setIsMouseDown(true);
        handleAction(event); // Чтобы обрабатывать клик в момент нажатия
    };

    // Обработчик окончания зажатия кнопки мыши
    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    // Обработчик перемещения мыши
    const handleMouseMove = (event) => {
        if (isMouseDown) {
            handleAction(event);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (grid.length > 0 && grid[0].length > 0) {
            canvas.width = grid[0].length * (cellSize + gapSize) - gapSize;
            canvas.height = grid.length * (cellSize + gapSize) - gapSize;
        }
        drawGrid(ctx);
    }, [grid, cellSize, gapSize]);

    return (
        <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ border: '1px solid black' }}
        />
    );
};

export default GridCanvas;
