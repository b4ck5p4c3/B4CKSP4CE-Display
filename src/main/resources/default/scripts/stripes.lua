-- Инициализация, если еще не произведена
local lineLen = 1;
local lineCount = 200;
if GLOBALS.init == nil then
    GLOBALS.init = true
    GLOBALS.stripes = {}
end
print("test")

-- Функция для создания новой полоски
local function createStripe()
    -- Случайное направление: 1 - вверх, 2 - вниз, 3 - влево, 4 - вправо
    local direction = math.random(1, 4)
    local x, y

    -- Выбираем начальную позицию в зависимости от направления
    if direction == 1 or direction == 2 then -- Вверх или вниз
        x = math.random(1, 40)
        y = direction == 1 and 32 or 1
    else -- Влево или вправо
        x = direction == 3 and 40 or 1
        y = math.random(1, 32)
    end

    -- Добавляем полоску в глобальный список
    table.insert(GLOBALS.stripes, {
        x = x,
        y = y,
        direction = direction,
        length = lineLen
    })
end

-- Обновление состояния полосок
local function updateStripes()
    for i = #GLOBALS.stripes, 1, -1 do
        local stripe = GLOBALS.stripes[i]

        -- Перемещение полоски
        if stripe.direction == 1 then -- Вверх
            stripe.y = stripe.y - 1
        elseif stripe.direction == 2 then -- Вниз
            stripe.y = stripe.y + 1
        elseif stripe.direction == 3 then -- Влево
            stripe.x = stripe.x - 1
        elseif stripe.direction == 4 then -- Вправо
            stripe.x = stripe.x + 1
        end

        -- Удаление полоски, если она достигла границы
        if stripe.x < 1 or stripe.x > 40 or stripe.y < 1 or stripe.y > 32 then
            table.remove(GLOBALS.stripes, i)
            createStripe() -- Создаем новую полоску
        end
    end
end

-- Отрисовка полосок
local function drawStripes()
    -- Очищаем поле
    for y = 1, #PIXELS do
        for x = 1, #PIXELS[y] do
            PIXELS[y][x] = 0 -- Предположим, что 0 - это "пустой" цвет
        end
    end

    -- Рисуем каждую полоску
    for _, stripe in ipairs(GLOBALS.stripes) do
        for l = 0, stripe.length - 1 do
            -- Вычисляем позицию каждой части полоски в зависимости от ее направления
            local x = stripe.x
            local y = stripe.y
            if stripe.direction == 1 then y = y + l end
            if stripe.direction == 2 then y = y - l end
            if stripe.direction == 3 then x = x + l end
            if stripe.direction == 4 then x = x - l end

            -- Если часть полоски находится в пределах поля, отрисовываем ее
            if x >= 1 and x <= 40 and y >= 1 and y <= 32 then
                PIXELS[y][x] = 127 -- Предположим, что 127 - это цвет полоски
            end
        end
    end
end

-- Создаем начальные полоски, если их еще нет
if #GLOBALS.stripes == 0 then
    for i = 1, lineCount do
        createStripe()
    end
end

-- Обновляем и рисуем полоски
updateStripes()
drawStripes()
