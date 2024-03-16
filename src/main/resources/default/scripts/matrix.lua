-- Инициализация, если требуется
local minLen = 1;
local maxLen = 1;
local maxSpeed = 2;

if GLOBALS.init == nil then
    GLOBALS.init = true
    GLOBALS.raindrops = {}
    GLOBALS.counter = 0;
    for i = 1, 40 do
        GLOBALS.raindrops[i] = {
            position = math.random(-32, 0), -- Начальная позиция капли
            tail = math.random(minLen, maxLen), -- Случайная длина следа для каждой капли
            speed = math.random(1, maxSpeed)
        }
    end
end
GLOBALS.counter = GLOBALS.counter+1;
print(GLOBALS.counter);

-- Функция для обновления поля PIXELS с учетом следа
function updateMatrixWithTrail()
    -- Очистка поля
    for rowId = 1, #PIXELS do
        for colId = 1, #PIXELS[rowId] do
            PIXELS[rowId][colId] = 0
        end
    end

    -- Обновление положения капель и отрисовка следа
    for i, drop in ipairs(GLOBALS.raindrops) do
        -- Обновляем позицию капли
        drop.position = drop.position + drop.speed

        -- Если капля достигла низа, начинаем снова сверху
        if drop.position > #PIXELS + drop.tail then
            drop.position = 1
            drop.speed = math.random(1,maxSpeed)
            local sizeMultipler = 1
            if drop.speed == 1 then
                sizeMultipler = 3
            end
            drop.tail = math.random(minLen*sizeMultipler, maxLen*sizeMultipler)
        end

        -- Отрисовка капли и следа
        for tailOffset = 0, drop.tail - 1 do
            local tailPosition = drop.position - tailOffset
            if tailPosition > 0 and tailPosition <= #PIXELS then
                PIXELS[tailPosition][i] = 127
            end
        end
    end
end

-- Вызов функции обновления
updateMatrixWithTrail()
