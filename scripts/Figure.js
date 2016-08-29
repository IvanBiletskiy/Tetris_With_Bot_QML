

//конструктор класса Block (блок фигуры)
function Block(x, y){
    this.x = x;
    this.y = y;
    this.clone = function() { //клонирует блок фигуры
        return new Block(this.x, this.y)
    }
}

//конструктор класса Figure, принимает цвет фигуры и координаты центра
function Figure(centerX, centerY, blockColor, area) {
    this.blocks = [];
    this.blockColor = blockColor;
    this._futureBlocks = [];
    this.rotation = 0;
    this._area = area;
    this.figureType = 0;
    this.virtual = false;
    this.centerX = centerX;
    this.centerY = centerY;
    // необходимо заполнить this.blocks в дочернем классе

    //позволяет клонировать фигуру
    this.clone = function (newArea) {
        var cloneFigure;
        switch (this.figureType) {
        case 1:
            cloneFigure = new Line(centerX,centerY,blockColor,newArea)
            break;
        case 2:
            cloneFigure = new Right_L(centerX,centerY,blockColor,newArea)
            break;
        case 3:
            cloneFigure = new Left_L(centerX,centerY,blockColor,newArea)
            break;
        case 4:
            cloneFigure = new Square(centerX,centerY,blockColor,newArea)
            break;
        case 5:
            cloneFigure = new Letter_T(centerX,centerY,blockColor,newArea)
            break;
        case 6:
            cloneFigure = new Letter_Z(centerX,centerY,blockColor,newArea)
            break;
        case 7:
            cloneFigure = new Anti_Z(centerX,centerY,blockColor,newArea)
            break;
        }
        for (var i = 0; i < 4; i++) {
            cloneFigure.blocks[i] = this.blocks[i].clone();
        }
        return cloneFigure;

    }
    //возвращает расположение фигуры после вращения
    this._getBlocksAfterRotate =  function (){ //необходимо переопределить в дочернем классе, если фигура может вращаться
        return this.blocks;
    }

    //возвращает расположение фигуры после смещения вниз
    this._getBlocksAfterMovingDown = function (){
        var blocksAfterMovingDown = [];
        for (var i = 0; i < 4; i++) {
            blocksAfterMovingDown.push(new Block(this.blocks[i].x, this.blocks[i].y+1));
        }
        return blocksAfterMovingDown;
    }

    //возвращает расположение фигуры после смещения влево
    this._getBlocksAfterMovingLeft = function (){
        var blocksAfterMovingLeft = [];
        for (var i = 0; i < 4; i++) {
            blocksAfterMovingLeft.push(new Block(this.blocks[i].x-1, this.blocks[i].y));
        }
        return blocksAfterMovingLeft;
    }

    //возвращает расположение фигуры после смещения вправо
    this._getBlocksAfterMovingRight = function (){
        var blocksAfterMovingRight = [];
        for (var i = 0; i < 4; i++) {
            blocksAfterMovingRight.push(new Block(this.blocks[i].x+1, this.blocks[i].y));
        }
        return blocksAfterMovingRight;
    }

    //узнает, может ли фигура сместиться вниз
    this._canMoveDown = function () {
        this._futureBlocks = this._getBlocksAfterMovingDown();
        if (this._area.isNoColisions(this._futureBlocks))
            return true;
        else
            return false;
    }

    //Постараться сместить фигуру вниз
    this.moveDown = function() {
        if (this._canMoveDown()) {
            this.hide();
            this.blocks = this._futureBlocks;
            this.show();
            return true;
        }
        else {
            this._area.fixFigure(this);
            return false;
        }
    }

    //узнает, может ли фигура сместиться вправо
    this._canMoveRight = function () {
        this._futureBlocks = this._getBlocksAfterMovingRight();
        if (this._area.isNoColisions(this._futureBlocks))
            return true;
        else
            return false;
    }

    //Постараться сместить фигуру вправо
    this.moveRight = function () {
        if (this._canMoveRight()) {
            this.hide();
            this.blocks = this._futureBlocks;
            this.show();
            return true;
        }
        else
            return false;
    }

    //узнает, может ли фигура сместиться влево
    this._canMoveLeft = function () {
        this._futureBlocks = this._getBlocksAfterMovingLeft();
        if (this._area.isNoColisions(this._futureBlocks))
            return true;
        else
            return false;
    }

    //Постараться сместить фигуру влево
    this.moveLeft = function () {
        if (this._canMoveLeft()) {
            this.hide();
            this.blocks = this._futureBlocks;
            this.show();
            return true;
        }
        else
            return false;
    }
    // Проверка возможности повернуть фигуру
    this._canRotate = function () {
        this._futureBlocks = this._getBlocksAfterRotate();
        if (this._area.isNoColisions(this._futureBlocks))
            return true;
        else
            return false;
    }

    // Постараться повернуть фигуру
    this.rotate = function() {
        if (this._canRotate()) {
            this.hide();
            this.blocks = this._futureBlocks;
            this.rotation++;
            if (this.rotation === 4) this.rotation = 0;
            this.show();
            return true;
        }
        else
            return false;
    }

    //Вывести на GUI расположение фигуры
    this.show = function () {
        if (!this.virtual) {
            for (var i = 0; i < this.blocks.length; i++) {
                cellsGUI[this.blocks[i].x][this.blocks[i].y].type = this.blockColor;
            }
        }
    }

    //Убрать с GUI предыдущее расположение фигуры
    this.hide = function () {
        if (!this.virtual){
            for (var i = 0; i < this.blocks.length; i++) {
                cellsGUI[this.blocks[i].x][this.blocks[i].y].type = 0;
            }
        }
    }

    //Дебаг-метод. Выводит координаты фигуры в консоль
    this.printFigureToLOG = function() {
        if (!this.virtual){
            var figureString = "";
            for (var i = 0; i < this.blocks.length; i++)
                figureString += "["+this.blocks[i].x+","+this.blocks[i].y+"] - ";
            console.log("Figure "+this.figureType+": "+figureString);
        }
    }

    //Дебаг-метод. Выводит координаты каких-либо блоков в консоль
    this.printBlocksToLOG = function(blocks, blocksName) {
        if (!this.virtual){
            var figureString = "";
            for (var i = 0; i < blocks.length; i++)
                figureString += "["+blocks[i].x+","+blocks[i].y+"] - ";
            console.log(blocksName+": "+figureString);
        }
    }
}

// линия
//----------------
//  0000
//----------------
function Line(centerX, centerY, blockColor, area) {
    Figure.apply(this, arguments); //наследуемся от Figure
    this.blocks[0] = new Block(centerX-1, centerY);
    this.blocks[1] = new Block(centerX, centerY);
    this.blocks[2] = new Block(centerX+1, centerY);
    this.blocks[3] = new Block(centerX+2, centerY);
    this.figureType = 1;

    this._getBlocksAfterRotate = function (){ //переопределяем метод родительского класса
        var blocksAfterRotate = [];

        switch (this.rotation){
        case 0:
            blocksAfterRotate[0]=new Block(this.blocks[0].x+2, this.blocks[0].y+2);
            blocksAfterRotate[1]=new Block(this.blocks[1].x+1, this.blocks[1].y+1);
            blocksAfterRotate[2]=new Block(this.blocks[2].x, this.blocks[2].y);
            blocksAfterRotate[3]=new Block(this.blocks[3].x-1, this.blocks[3].y-1);
            break;
        case 1:
            blocksAfterRotate[0]=new Block(this.blocks[0].x+1, this.blocks[0].y-1);
            blocksAfterRotate[1]=new Block(this.blocks[1].x, this.blocks[1].y);
            blocksAfterRotate[2]=new Block(this.blocks[2].x-1, this.blocks[2].y+1);
            blocksAfterRotate[3]=new Block(this.blocks[3].x-2, this.blocks[3].y+2);
            break;
        case 2:
            blocksAfterRotate[0]=new Block(this.blocks[0].x-2, this.blocks[0].y-2);
            blocksAfterRotate[1]=new Block(this.blocks[1].x-1, this.blocks[1].y-1);
            blocksAfterRotate[2]=new Block(this.blocks[2].x, this.blocks[2].y);
            blocksAfterRotate[3]=new Block(this.blocks[3].x+1, this.blocks[3].y+1);
            break;
        case 3:
            blocksAfterRotate[0]=new Block(this.blocks[0].x-1, this.blocks[0].y+1);
            blocksAfterRotate[1]=new Block(this.blocks[1].x, this.blocks[1].y);
            blocksAfterRotate[2]=new Block(this.blocks[2].x+1, this.blocks[2].y-1);
            blocksAfterRotate[3]=new Block(this.blocks[3].x+2, this.blocks[3].y-2);
            break;
        }
        return blocksAfterRotate;
    }
}

// правая L
//----------------
// 0
// 0
// 0 0
//----------------

function Right_L(centerX, centerY, blockColor, area){
    Figure.apply(this, arguments); //наследуемся от Figure
    this.blocks[0] = new Block(centerX-1, centerY+1);
    this.blocks[1] = new Block(centerX, centerY+1);
    this.blocks[2] = new Block(centerX+1, centerY+1);
    this.blocks[3] = new Block(centerX+1, centerY);
    this.figureType = 2;
    this._getBlocksAfterRotate = function (){
        var blocksAfterRotate = [];

        switch (this.rotation){
        case 0:
            blocksAfterRotate[0]=new Block(this.blocks[0].x, this.blocks[0].y-1);
            blocksAfterRotate[1]=new Block(this.blocks[1].x-1, this.blocks[1].y);
            blocksAfterRotate[2]=new Block(this.blocks[2].x-2, this.blocks[2].y+1);
            blocksAfterRotate[3]=new Block(this.blocks[3].x-1, this.blocks[3].y+2);
            break;
        case 1:
            blocksAfterRotate[0]=new Block(this.blocks[0].x+2, this.blocks[0].y);
            blocksAfterRotate[1]=new Block(this.blocks[1].x+1, this.blocks[1].y-1);
            blocksAfterRotate[2]=new Block(this.blocks[2].x, this.blocks[2].y-2);
            blocksAfterRotate[3]=new Block(this.blocks[3].x-1, this.blocks[3].y-1);
            break;
        case 2:
            blocksAfterRotate[0]=new Block(this.blocks[0].x-1, this.blocks[0].y+2);
            blocksAfterRotate[1]=new Block(this.blocks[1].x, this.blocks[1].y+1);
            blocksAfterRotate[2]=new Block(this.blocks[2].x+1, this.blocks[2].y);
            blocksAfterRotate[3]=new Block(this.blocks[3].x, this.blocks[3].y-1);
            break;
        case 3:
            blocksAfterRotate[0]=new Block(this.blocks[0].x-1, this.blocks[0].y-1);
            blocksAfterRotate[1]=new Block(this.blocks[1].x, this.blocks[1].y);
            blocksAfterRotate[2]=new Block(this.blocks[2].x+1, this.blocks[2].y+1);
            blocksAfterRotate[3]=new Block(this.blocks[3].x+2, this.blocks[3].y);
            break;
        }
        return blocksAfterRotate;
    }
}
// левая L
//----------------
//   0
//   0
// 0 0
//----------------
function Left_L(centerX, centerY, blockColor, area){
    Figure.apply(this, arguments); //наследуемся от Figure
    this.blocks[0] = new Block(centerX+1, centerY+1);
    this.blocks[1] = new Block(centerX, centerY+1);
    this.blocks[2] = new Block(centerX-1, centerY+1);
    this.blocks[3] = new Block(centerX-1, centerY);

    this.figureType = 3;
    this._getBlocksAfterRotate = function (){
        var blocksAfterRotate = [];
        switch (this.rotation){
        case 0:
            blocksAfterRotate[0]=new Block(this.blocks[0].x-2, this.blocks[0].y+1);
            blocksAfterRotate[1]=new Block(this.blocks[1].x-1, this.blocks[1].y);
            blocksAfterRotate[2]=new Block(this.blocks[2].x, this.blocks[2].y-1);
            blocksAfterRotate[3]=new Block(this.blocks[3].x+1, this.blocks[3].y);
            break;
        case 1:
            blocksAfterRotate[0]=new Block(this.blocks[0].x, this.blocks[0].y-2);
            blocksAfterRotate[1]=new Block(this.blocks[1].x+1, this.blocks[1].y-1);
            blocksAfterRotate[2]=new Block(this.blocks[2].x+2, this.blocks[2].y);
            blocksAfterRotate[3]=new Block(this.blocks[3].x+1, this.blocks[3].y+1);
            break;
        case 2:
            blocksAfterRotate[0]=new Block(this.blocks[0].x+1, this.blocks[0].y);
            blocksAfterRotate[1]=new Block(this.blocks[1].x, this.blocks[1].y+1);
            blocksAfterRotate[2]=new Block(this.blocks[2].x-1, this.blocks[2].y+2);
            blocksAfterRotate[3]=new Block(this.blocks[3].x-2, this.blocks[3].y+1);
            break;
        case 3:
            blocksAfterRotate[0]=new Block(this.blocks[0].x+1, this.blocks[0].y+1);
            blocksAfterRotate[1]=new Block(this.blocks[1].x, this.blocks[1].y);
            blocksAfterRotate[2]=new Block(this.blocks[2].x-1, this.blocks[2].y-1);
            blocksAfterRotate[3]=new Block(this.blocks[3].x, this.blocks[3].y-2);
            break;
        }
        return blocksAfterRotate;
    }
}
// квадрат
//----------------
// 0 0
// 0 0
//----------------
function Square(centerX, centerY, blockColor, area){
    Figure.apply(this, arguments); //наследуемся от Figure
    this.blocks[0] = new Block(centerX, centerY);
    this.blocks[1] = new Block(centerX+1, centerY);
    this.blocks[2] = new Block(centerX+1, centerY+1);
    this.blocks[3] = new Block(centerX, centerY+1);
    this.figureType = 4;
    //  фигура не вращается - не переопределяем this._getBlocksAfterRotate(), используем родительский метод
}

// буква Т
//----------------
// 0 0 0
//   0
//----------------
function Letter_T(centerX, centerY, blockColor, area){
    Figure.apply(this, arguments); //наследуемся от Figure
    this.blocks[0] = new Block(centerX-1, centerY+1);
    this.blocks[1] = new Block(centerX, centerY);
    this.blocks[2] = new Block(centerX, centerY+1);
    this.blocks[3] = new Block(centerX+1, centerY+1);
    this.figureType = 5;


    this._getBlocksAfterRotate = function (){
        var blocksAfterRotate = [];
        switch (this.rotation){
        case 0:
            blocksAfterRotate[0]=new Block(this.blocks[0].x, this.blocks[0].y-1);
            blocksAfterRotate[1]=new Block(this.blocks[1].x, this.blocks[1].y+1);
            blocksAfterRotate[2]=new Block(this.blocks[2].x-1, this.blocks[2].y);
            blocksAfterRotate[3]=new Block(this.blocks[3].x-2, this.blocks[3].y+1);
            break;
        case 1:
            blocksAfterRotate[0]=new Block(this.blocks[0].x+2, this.blocks[0].y);
            blocksAfterRotate[1]=new Block(this.blocks[1].x, this.blocks[1].y);
            blocksAfterRotate[2]=new Block(this.blocks[2].x+1, this.blocks[2].y-1);
            blocksAfterRotate[3]=new Block(this.blocks[3].x, this.blocks[3].y-2);
            break;
        case 2:
            blocksAfterRotate[0]=new Block(this.blocks[0].x-1, this.blocks[0].y+2);
            blocksAfterRotate[1]=new Block(this.blocks[1].x-1, this.blocks[1].y);
            blocksAfterRotate[2]=new Block(this.blocks[2].x, this.blocks[2].y+1);
            blocksAfterRotate[3]=new Block(this.blocks[3].x+1, this.blocks[3].y);
            break;
        case 3:
            blocksAfterRotate[0]=new Block(this.blocks[0].x-1, this.blocks[0].y-1);
            blocksAfterRotate[1]=new Block(this.blocks[1].x+1, this.blocks[1].y-1);
            blocksAfterRotate[2]=new Block(this.blocks[2].x, this.blocks[2].y);
            blocksAfterRotate[3]=new Block(this.blocks[3].x+1, this.blocks[3].y+1);
            break;
        }
        return blocksAfterRotate;
    }
}

// буква Z
//----------------
// 0 0
//   0 0
//----------------
function Letter_Z(centerX, centerY, blockColor, area){
    Figure.apply(this, arguments); //наследуемся от Figure
    this.blocks[0] = new Block(centerX-1, centerY);
    this.blocks[1] = new Block(centerX, centerY);
    this.blocks[2] = new Block(centerX, centerY+1);
    this.blocks[3] = new Block(centerX+1, centerY+1);
    this.figureType = 6;

    this._getBlocksAfterRotate = function (){
        var blocksAfterRotate = [];
        switch (this.rotation){
        case 0:
        case 2:
            blocksAfterRotate[0]=new Block(this.blocks[0].x+2, this.blocks[0].y);
            blocksAfterRotate[1]=new Block(this.blocks[1].x+1, this.blocks[1].y+1);
            blocksAfterRotate[2]=new Block(this.blocks[2].x, this.blocks[2].y);
            blocksAfterRotate[3]=new Block(this.blocks[3].x-1, this.blocks[3].y+1);
            break;
        case 1:
        case 3:
            blocksAfterRotate[0]=new Block(this.blocks[0].x-2, this.blocks[0].y);
            blocksAfterRotate[1]=new Block(this.blocks[1].x-1, this.blocks[1].y-1);
            blocksAfterRotate[2]=new Block(this.blocks[2].x, this.blocks[2].y);
            blocksAfterRotate[3]=new Block(this.blocks[3].x+1, this.blocks[3].y-1);
            break;
        }
        return blocksAfterRotate;
    }
}

// обратная Z
//----------------
//   0 0
// 0 0
//----------------
function Anti_Z(centerX, centerY, blockColor, area){
    Figure.apply(this, arguments); //наследуемся от Figure
    this.blocks[0] = new Block(centerX-1, centerY+1);
    this.blocks[1] = new Block(centerX, centerY+1);
    this.blocks[2] = new Block(centerX, centerY);
    this.blocks[3] = new Block(centerX+1, centerY);
    this.figureType = 7;

    this._getBlocksAfterRotate = function (){
        var blocksAfterRotate = [];
        switch (this.rotation){
        case 0:
        case 2:
            blocksAfterRotate[0]=new Block(this.blocks[0].x+1, this.blocks[0].y+1);
            blocksAfterRotate[1]=new Block(this.blocks[1].x, this.blocks[1].y);
            blocksAfterRotate[2]=new Block(this.blocks[2].x-1, this.blocks[2].y+1);
            blocksAfterRotate[3]=new Block(this.blocks[3].x-2, this.blocks[3].y);
            break;
        case 1:
        case 3:
            blocksAfterRotate[0]=new Block(this.blocks[0].x-1, this.blocks[0].y-1);
            blocksAfterRotate[1]=new Block(this.blocks[1].x, this.blocks[1].y);
            blocksAfterRotate[2]=new Block(this.blocks[2].x+1, this.blocks[2].y-1);
            blocksAfterRotate[3]=new Block(this.blocks[3].x+2, this.blocks[3].y);
            break;
        }
        return blocksAfterRotate;

    }
}
