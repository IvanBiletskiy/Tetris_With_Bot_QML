function FigureState(rotation, xCoord, rating, area) { //положение фигуры в поле, нужно для вычисления наилучшего
    this.rotation = rotation;
    this.xCoord = xCoord;
    this.rating = rating; //критерий "хорошести" выбранного положения
    this.area = area;
}

function AI(currentFigure, area) {

    var virtualArea; //бот примеряет виртуальные фигуры, рассчитывает какими будут поля после примерки, определяет куда и как лучше притулить фигуру
    var virtualFigure;
    var potentialFigureStates;
    var bestFigureState;


    this.runAI = function () { //рассчет того, куда и как притулить выпавшую фигуру
        potentialFigureStates = []; //возможные состояния фигурок
        var figureStatesCount;
        //создаем виртуальные клоны игрового поля и фигуры
        virtualArea = area.clone();
        virtualArea.virtual=true;
        virtualFigure = currentFigure.clone(virtualArea);
        virtualFigure.virtual = true;

        for (var rotation = 0; rotation < 4; rotation++) { //для всех четырех положений
            rotateToRotation(virtualFigure, rotation); //вращаем до нужного положения
            figureStatesCount = virtualArea.cells.length-figureWidth(virtualFigure)+1; //вычисляем количесвто возможных положений
            for (var x = 0; x < figureStatesCount; x++) { //для каждой ориентации
                moveFigureToXCoord(virtualFigure, x); //сдвигаем по горизонтали
                while (virtualFigure._canMoveDown()) { //опускаем вниз до упора
                    virtualFigure.moveDown();
                }
                virtualFigure.moveDown(); //попытаться сдвинуть фигуру вниз, чтобы она закрепилась

                var potentialfigureState = new FigureState(rotation, x, getStateRating(), virtualArea) //вычисляем критерий "хорошести" выбранного положения, запоминаем положение фигуры
                potentialFigureStates.push(potentialfigureState);

                //заздаем новые копии оригинальных фигурки и поля
                virtualArea = area.clone();
                virtualArea.virtual=true;
                virtualFigure = currentFigure.clone(virtualArea);
                virtualFigure.virtual = true;
                virtualFigure.moveDown();// чтобы любая фигура могла повернуться
                rotateToRotation(virtualFigure, rotation); //вращаем до нужного положения
            }
        }
        //вычисляем лучшее возможное положение
        bestFigureState = potentialFigureStates[0];
        for (var i = 1; i < potentialFigureStates.length; i++) {
            if (potentialFigureStates[i].rating > bestFigureState.rating){
                bestFigureState = potentialFigureStates[i];
            }
        }
        //выставляем такое положение у оригинальной фигуры
        realizeFigureStateAnimated(bestFigureState);
    }

    //сдвиг фигуры в нужное положение по оси Х
    function moveFigureToXCoord(figure, xCoord) {
        var stepsCount = leftmostPoint(figure) - xCoord;
        if (stepsCount>0)
        {
            for (var i = 0; i < stepsCount; i++)
                figure.moveLeft();
        }
        else {
            for (var i = 0; i < -stepsCount; i++)
                figure.moveRight();
        }
    }

    //вращение фигуры до нужной ориентации
    function rotateToRotation(figure, rotation) {
        var countOfRotates;
        if (figure.rotation > rotation)
            countOfRotates = 4 - (figure.rotation - rotation);
        else
            countOfRotates =  rotation-figure.rotation;

        for (var i = 0; i < countOfRotates; i++) {
            figure.rotate();
        }
    }

    //вычисление самой левой точки фигуры по Х
    function leftmostPoint(figure){
        var leftmostPoint = Infinity;
        for (var i = 0; i < figure.blocks.length; i++) {
            if (figure.blocks[i].x < leftmostPoint)
                leftmostPoint = figure.blocks[i].x;
        }
        return leftmostPoint;
    }

    //вычисление самой правой точки фигуры по Х
    function rightmostPoint(figure){
        var rightmostPoint = 0;
        for (var i = 0; i < figure.blocks.length; i++) {
            if (figure.blocks[i].x > rightmostPoint)
                rightmostPoint = figure.blocks[i].x;
        }
        return rightmostPoint;
    }

    //рассчет ширины фигуры
    function figureWidth(figure){
        var length = rightmostPoint(figure)-leftmostPoint(figure) + 1;
        return length;
    }

    //рассчет рейтинга положения фигуры
    function getStateRating() {
        //коефициенты для выбраных критериев
        var const1 = -0.510066;
        var const2 = 0.760666;
        var const3 = -0.35663;
        var const4 = -0.184483;
        return (const1*getAggregateHeight()) + (const2*getCompliteLines()) + (const3*getHoles()) + (const4*getBumpiness());
    }

    //суммарная высота всех столбиков
    function getAggregateHeight() {
        var aggregateHeight=0;
        var columnHeight=0;
        for (var i = 0; i < virtualArea.cells.length; i++) {
            columnHeight = 0;
            for (var j = 0; j < virtualArea.cells[i].length; j++) {
                if (!virtualArea.cells[i][j].isFree) {
                    columnHeight = virtualArea.cells[i].length-j;
                    break;
                }
            }
            aggregateHeight += columnHeight;

        }
        return aggregateHeight;
    }

    //неравномерность столбиков, "выбоистость"
    function getBumpiness() {
        var bumpiness = 0;
        var previousColumnHeight;
        var columnHeight;
        for (var i = 0; i < virtualArea.cells.length; i++) {
            columnHeight = 0;
            for (var j = 0; j < virtualArea.cells[i].length; j++) {
                if (!virtualArea.cells[i][j].isFree) {
                    columnHeight = virtualArea.cells[i].length-j;
                    break;
                }
            }
            if(previousColumnHeight !== undefined){
                bumpiness += Math.abs(columnHeight-previousColumnHeight);
            }
            previousColumnHeight = columnHeight;
        }
        return bumpiness;
    }

    //дырки
    function getHoles() {
        var holes = 0;
        var isColumnBegun = false;
        for (var i = 0; i < virtualArea.cells.length; i++) {
            for (var j = 0; j < virtualArea.cells[i].length; j++) {
                if (virtualArea.cells[i][j].isFree && !isColumnBegun) { //если ячейка свободна, но столбец еще не начался - пропускаем
                    continue;
                }
                else if (virtualArea.cells[i][j].isFree && isColumnBegun) { //если ячейка свободна и столбец уже начался - значит это дырка
                    holes++;
                }
                else { //если ячейка не свободна, то столбец уже начался
                    isColumnBegun=true;
                }
            }
            isColumnBegun = false;
        }
        return holes;
    }

    //количество завершенных линий
    function getCompliteLines() {
        var compliteLines = virtualArea.checkRows();
        return compliteLines;
    }

    //функция, которая выясняет как нужно двигать фигуру, чтобы достичь выбранного положения и записывает комманды для ГУИ-аниматора
    function realizeFigureStateAnimated(figureState) {
        //создаем еще одну виртуальную пару фигура-поле:
        virtualArea = area.clone();
        virtualArea.virtual=true;
        virtualFigure = currentFigure.clone(virtualArea);
        virtualFigure.virtual = true;

        //ставим ее на то место, где она должна стоять:
        rotateToRotationAnimated(virtualFigure, figureState.rotation);
        moveFigureToXCoordAnimated(virtualFigure, figureState.xCoord);
        while (virtualFigure._canMoveDown()) {
            virtualFigure.moveDown();
            commandsArray.push(function(){canvas.down();}); //с каждым движением заносим в массив команд анонимную функцию - команду ГУИ-аниматору
        }
        virtualFigure.moveDown();
        commandsArray.push(function(){canvas.down();}); //попытаться сдвинуть фигуру вниз чтобы она закрепилась
    }

    //вращение виртуальной фигуры с "протоколированием" всех действий
    function rotateToRotationAnimated(figure, rotation) {
        var countOfRotates;
        if (figure.rotation > rotation)
            countOfRotates = 4 - (figure.rotation - rotation);
        else
            countOfRotates =  rotation-figure.rotation;

        for (var i = 0; i < countOfRotates; i++) {
            figure.rotate();
            commandsArray.push(function(){canvas.rotate();});
        }
    }

    //смещение по оси Х виртуальной фигуры с "протоколированием" всех действий
    function moveFigureToXCoordAnimated(figure, xCoord) {
        var stepsCount = leftmostPoint(figure) - xCoord;
        if (stepsCount>0)
        {
            for (var i = 0; i < stepsCount; i++) {
                figure.moveLeft();
                commandsArray.push(function(){canvas.left();});
            }
        }
        else {
            for (var i = 0; i < -stepsCount; i++) {
                figure.moveRight();
                commandsArray.push( function(){canvas.right();});
            }
        }
    }

    //Дебаг-метод. Выводит получившийся массив команд в консоль
    function printCommandArrayToLOG(){
        console.log("COMMANDS ARRAY: ");

        console.log("---------------------------------,");
        for (var i = 0; i < commandsArray.length; i++) {
            console.log(commandsArray[i]);
        }
        console.log("----------------------------------'");

    }


    //обновление инфы о текущей фигуре на игровом поле
    this.updateBotInformation = function(newCurrentFigure) {
        currentFigure = newCurrentFigure;
    }
}
