Qt.include("AI.js");
Qt.include("Area.js");
Qt.include("Figure.js");
var area,
    isPause = false,
    isGameOver = false,
    isBotPlaying = false,
    cellsGUI,
    cellSize,
    currentFigure,
    timerID,
    commandsArray = [],
    bot,
    levelArray = ["auto",0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    currentLevelIterator = 0; //номер ячейки в массиве уровней

//первый запуск игры
function startGame() {
    cellsGUI = [];
    cellSize = canvas.width/canvas.xCount; //рассчитываем размер клетки
    area = new Area(canvas.xCount, canvas.yCount, cellsGUI); //создаем игровое поле
    createGUIComponents(); //добавляем ячейки на ГУИ

    addNewFigure(); //запускаем первую фигуру
    bot = new AI(currentFigure, area); //создаем бота на будущее
    timer.start(); //запускаем таймер, двигающий фигуру вниз
}
//перезапуск игры
function restartGame(){
    score = 0; //обнуляем счет
    for (var i=0; i < cellsGUI.length; i++){ //очищаем игровое поле и его графическое представление
        for (var j=0; j < cellsGUI[i].length; j++){
            cellsGUI[i][j].type = 0;
            area.cells[i][j].isFree=true;
            area.cells[i][j].setColor(0);
        }
    }
    menu.visible = false; //выключаем меню    
    isPause=false; //убираем с паузы
    isGameOver=false; //больше не GameOver
    addNewFigure(); //добавляем новую фигуру
    if (isBotPlaying) botTimer.start(); //если играет бот - запускаем его таймер
    else if (levelArray[currentLevelIterator]==="auto") { //если не бот и при этом режим уровней "auto"
        level = 0; //сбрасываем уровень
        //timer.interval = 1000;
        levelTimer.start(); // запускаем таймер увеличения уровня
    }
        timer.start(); //запускаем таймер
}

//вызывается по тику таймера, двигает фигурку вниз
function nextStep() {
    currentFigure.moveDown();
}

//вызывается при проиграше
function gameOver(){
    changePauseMode(); //для вызова меню
    isGameOver=true; //ставим флаг
    menu.gameover(); //сообщаем ГУИ
    timer.stop(); //останавливаем таймер
    levelTimer.stop(); //и таймер счетчика уровней, если он работал
}

//переключаем с режима паузы в игру и наоборот
function changePauseMode(){
    if (!isGameOver) //если не конец игры (при проиграше выйти из меню невозможно)
    {
        if (!isPause) pauseOn();
        else pauseOff();
    }
}

//включение паузы
function pauseOn(){
    menu.visible = true; //врубаем меню
    isPause = true;
    botTimer.running = false; //вырубаем все таймеры
    timer.running = false;
    levelTimer.running = false;
}

//возврат к игре
function pauseOff(){
    menu.visible = false;//вырубаем меню
    isPause = false;
    if (!isBotPlaying) { //врубаем нужные таймеры
        timer.running = true;
        levelTimer.running = true;
    }
    else
        botTimer.running = true;
}

function action(command){
    if (!isPause) //если игра не на паузе
    {
        switch (command){ //совершаем нужное действие с текущей фигурой
        case "down":
            currentFigure.moveDown();
            break;
        case "rotate":
            currentFigure.rotate();
            break;
        case "left":
            currentFigure.moveLeft();
            break;
        case "right":
            currentFigure.moveRight();
            break;
        }
    }
}


function addNewFigure() { //запускаем падать новую фигуру
    var figureType = Math.floor(Math.random()*7)+1, // случайного типа
        currentFigureColor = Math.floor(Math.random()*7)+1; // и случайного цвета
    switch (figureType) {
    case 1:
        currentFigure = new Line(Math.round(canvas.width/2/cellSize)-1, 0, currentFigureColor, area);
        break;
    case 2:
        currentFigure = new Right_L(Math.round(canvas.width/2/cellSize)-1, 0, currentFigureColor, area);
        break;
    case 3:
        currentFigure = new Left_L(Math.round(canvas.width/2/cellSize)-1, 0, currentFigureColor, area);
        break;
    case 4:
        currentFigure = new Square(Math.round(canvas.width/2/cellSize)-1, 0, currentFigureColor, area);
        break;
    case 5:
        currentFigure = new Letter_T(Math.round(canvas.width/2/cellSize)-1, 0, currentFigureColor, area);
        break;
    case 6:
        currentFigure = new Letter_Z(Math.round(canvas.width/2/cellSize)-1, 0, currentFigureColor, area);
        break;
    case 7:
        currentFigure = new Anti_Z(Math.round(canvas.width/2/cellSize)-1, 0, currentFigureColor, area);
        break;
    }

    if (area.isNoColisions(currentFigure.blocks)) //если ее можно поставить сверху
        currentFigure.show(); //ставим
    else
        gameOver(); //иначе конец игры



    if (bot && isBotPlaying) { //если бот создан и играет
        commandsArray = []; //очищаем список команд, если тым еще что-то осталось
        if (figureType===1) action("down"); // если фигура - палка, то опускаем вниз чтобы можно было ее повернуть
        bot.updateBotInformation(currentFigure); //сообщаем инфу о фигуре боту
        bot.runAI(); //говорим боту произвести свои манипуляции до следующей фигуры
    }
}

//включение режима бота
function runAIGame(){
    isBotPlaying = true; //ставим флаг
    timer.running = false; //останавливаем таймеры
    levelTimer.running = false;
    if (isGameOver){ //если решили врубить бота после конца предыдущей игры - перезапускаем ее с ботом
        restartGame();
    }
    else{ //если посреди игры
        bot.updateBotInformation(currentFigure); //сообщаем инфу о текущей фигуре боту
        bot.runAI(); //говорим боту произвести свои манипуляции с этой фигурой
        botTimer.start(); //запускаем таймер, с которым бот двигает фигурки
        pauseOff(); //убираем с паузы
    }
}

//включение режима игрока
function runPlayerGame(){ //аналогично
    isBotPlaying = false;
    if (isGameOver){
        restartGame();
    }
    else {
        timer.running = true;
        botTimer.stop();
        pauseOff();
    }
}

//Динамическое создание компонентов QML
function createGUIComponents(){
    var cellComponent = Qt.createComponent("Cell.qml"),
        newCell;
    while (cellComponent.status !== Component.Ready) {}
    for (var i = 0; i < area.cells.length; i++) {
        var columnGUI = [];
        for (var j = 0; j < area.cells[i].length; j++) {
            newCell = cellComponent.createObject(canvas, {"x": cellSize*i, "y": cellSize*j, "width": cellSize, "type": 0, "anchors.fill": parent});
            columnGUI.push(newCell);
        }
        cellsGUI.push(columnGUI);
    }
}

//Если пользователь хочет изменить уровень
function changeLevel(sign){
    switch (sign) {
        case "+":
            if (currentLevelIterator < levelArray.length-1) {
                currentLevelIterator++;
            }
            break;
        case "-":
            if (currentLevelIterator > 0) {
                currentLevelIterator--;
            }
            break;
    }
    if (levelArray[currentLevelIterator]==="auto") {
        level=0;
        levelTimer.running = true;
    }
    else {
        level = levelArray[currentLevelIterator];
        levelTimer.running = false;
        timer.interval=1000/(Math.pow(1.25, level));
    }

}

//Дебаг-функция, можно посмотреть в консоли текущее состояние area, 0 - пустая ячейка, # - заполненная
function printAreaToLOG(area) {
    var areaRow;
    for (var j = 0; j < area.cells[0].length; j++) {
        areaRow = "";
        for (var i = 0; i < area.cells.length; i++) {
            if (!area.cells[i][j].isFree)
                areaRow+="#";
            else areaRow+="0";
        }
        console.log(areaRow);
    }
}

//Дебаг-функция, можно посмотреть в консоли текущее состояние area вместе с фигурой, 0 - пустая ячейка, # - заполненная
function printFigureWithAreaToLOG(figure, area) {
    var areaRow;
    for (var j = 0; j < area.cells[0].length; j++) {
        areaRow = "";
        for (var i = 0; i < area.cells.length; i++) {
            var block = new Block(i,j);
            if (!area.cells[i][j].isFree)
                areaRow+="#";
            else if ((block.x === figure.blocks[0].x) && (block.y === figure.blocks[0].y))
                areaRow+="#";
            else if ((block.x === figure.blocks[1].x) && (block.y === figure.blocks[1].y))
                areaRow+="#";
            else if ((block.x === figure.blocks[2].x) && (block.y === figure.blocks[2].y))
                areaRow+="#";
            else if ((block.x === figure.blocks[3].x) && (block.y === figure.blocks[3].y))
                areaRow+="#";
            else areaRow+="0";
        }
        console.log(areaRow);
    }
}
