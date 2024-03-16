for rowId = 1, #PIXELS do
    for colId = 1, #PIXELS[rowId] do
        PIXELS[rowId][colId] = ({0, 127})[math.random(1, 2)]
    end
end