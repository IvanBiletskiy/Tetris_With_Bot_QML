// Ячейка игрового поля
function Cell(x,y) {
    this.blockColor = 0; //помнит свой цвет
    this.x = x; //... координаты
    this.y = y;
    this.isFree = true; //... и то, занята ли она
    this.setColor = function (blockColor) {
        this.blockColor=blockColor;
    }
    this.clone = function () { //возможность клонировать ячейку
        var cloneCell = new Cell(x,y);
        cloneCell.isFree = this.isFree;
        cloneCell.blockColor = this.blockColor;
        return cloneCell;
    }
}

// Конструктор игрового поля
function Area(width, height, cellsGUI) {

    function createCells () { //создаем ячейки
        var _cells = []
        for (var i = 0; i < width; i++) {
            var _column = [];
            for (var j = 0; j < height; j++) {
                _column.push(new Cell(i,j));
            }
            _cells.push(_column);
        }
        return _cells;
    }

    this.cells = createCells();
    this.virtual = false; //игровое поле может быть как базовым(игровым), так и виртуальным - для вычислений бота


    // Проверка будущего образа фигуры на то, нету ли пересечений с уже заполненными ячейками игрового поля.
    this.isNoColisions = function (blocks) { // должен передаваться массив объектов вида {X,Y}
        for (var i = 0; i < blocks.length; i++) {
            var cellX = blocks[i].x;
            var cellY = blocks[i].y;
            if (this.cells[cellX]===undefined) { return false; } //если выход за пределы поля
            if (this.cells[cellX][cellY]===undefined) { return false; } //если выход за пределы поля
            if (!(this.cells[cellX][cellY].isFree)) { return false; } //если нужные ячейки заняты
        }
        return true;
    }

    // Закрепление фигуры на игровом поле
    this.fixFigure = function (figure) { //должен передаваться объект фигуры с blocks[], blockColor}
        for (var i = 0; i < figure.blocks.length; i++) {
            var cellX = figure.blocks[i].x;
            var cellY = figure.blocks[i].y;
            this.cells[cellX][cellY].isFree = false;
            this.cells[cellX][cellY].setColor(figure.blockColor);
        }
        this.checkRows(); //после закрепления проверяем, собралось ли что-то
        if(!this.virtual){
            addNewFigure(); //запускаем новую фигуру
        }
    }

    //функция проверки строк на то, собралась ли какая-либо из них
    this.checkRows = function (){
        var countOfFullRows = 0;
        for (var j = 0; j < this.cells[0].length; j++) { //по каждой строке
            var countInRow = 0;
            for (var i = 0; i < this.cells.length; i++) { //считаем количество блоков в строке
                if (!this.cells[i][j].isFree)
                    countInRow++;
            }
            if (countInRow === this.cells.length){ //если она полная - удаляем
                if (!this.virtual) this.deleteRow(j); //для виртуальных полей не удаляем, а просто считаем количество
                countOfFullRows++;
            }
        }
        if (!this.virtual) //для виртуальных полей незачем считать очки
            switch (countOfFullRows){ //в зависимости от того, сколько линий игрок собрал за раз - разное количество очков
            case 1:
                score+=100;
                break;
            case 2:
                score+=300;
                break;
            case 3:
                score+=700;
                break;
            case 4:
                score+=1500;
                break;
            }
        return countOfFullRows; //возвращает количество полных строк, нужно для использования виртуального поля ботом
    }


    //удаление собравшейся строки
    this.deleteRow = function(rowNumber) {
        for (var j = rowNumber; j > 0; j--) { //удаляем строку, остальные "падают" на одну вниз
            for (var i = 0; i < this.cells.length; i++) {
                this.cells[i][j]=this.cells[i][j-1];
                cellsGUI[i][j].type = this.cells[i][j].blockColor;
            }
        }
        for (var i = 0; i < this.cells.length; i++) {//зануляем верхнюю строку
            this.cells[i][0]=new Cell(i,0);
        }
    }

    //клонирование игрового поля
    this.clone = function () {
        var _cells = []
        for (var i = 0; i < width; i++) {
            var _column = [];
            for (var j = 0; j < height; j++) {
                _column.push(this.cells[i][j].clone());
            }
            _cells.push(_column);
        }
        var cloneArea = new Area(width, height, cellsGUI);
        cloneArea.cells = _cells;
        return cloneArea;
    }
}
