import QtQuick 1.1
import "scripts/game.js" as Game

Rectangle {
    id: mainWindow
    width: 400
    height: width/canvas.xCount*canvas.yCount
    color: "black"
    property int score: 0
    property int level: 0
    onLevelChanged: {
        if(!Game.isBotPlaying) {
            levelText.text = "Level: " + level;
        }
    }


    Item {
        id: canvas
        anchors.fill: parent
        z: 0
        property int xCount: 10
        property int yCount: 22
        signal right
        signal left
        signal down
        signal rotate
        Component.onCompleted: Game.startGame();

        focus: true
        Keys.onRightPressed: right();
        Keys.onLeftPressed: left();
        Keys.onDownPressed: down();
        Keys.onUpPressed: rotate();
        Keys.onSpacePressed: Game.changePauseMode();
        onRight: Game.action("right");
        onLeft: Game.action("left");
        onDown: Game.action("down");
        onRotate: Game.action("rotate");

        Timer {
            id: timer
            interval: 1000
            running: false
            repeat: true
            onTriggered: Game.nextStep();
        }

        Timer {
            id: levelTimer
            interval: 60000
            running: true
            repeat: true
            onTriggered: {
                level++;
                timer.interval=1000/(Math.pow(1.25, level))
            }
        }

        Timer {
            id: botTimer
            interval: 30
            repeat: true
            triggeredOnStart : true
            onTriggered:     {
                if(Game.commandsArray[0])
                    (Game.commandsArray.shift())();
                else
                    Game.action("down");
            }
        }
    }

    Menu{
        id: menu
        anchors.fill: parent
        visible: false
        onNewGame: Game.restartGame();
        onExit: Qt.quit();
        onContinueGame: Game.changePauseMode();
        onBotOn: {
            levelText.text = "Bot";
            Game.runAIGame();
        }
        onBotOff: {
            levelText.text = "Level: " + level;
            Game.runPlayerGame();
        }
        onChangeLevel: {
            Game.changeLevel(sign);
            menuArea.levelString = "Level: " + String(Game.levelArray[Game.currentLevelIterator]);
        }
    }

    Text {
        id: levelText
        color: "#ffffff"
        z: 5
        text: "Level: " + level
        font.pointSize: 16
    }

    Text {
        id: scoreText
        anchors.top: levelText.bottom
        color: "#ffffff"
        z: 5
        text: "Score: " + score
        font.pointSize: 16
    }
}
