import QtQuick 1.1
Item {
    property alias menuArea: menuArea
    property bool isGameOver: false
    signal newGame
    signal continueGame
    signal exit
    signal gameover
    signal botOn
    signal botOff
    signal changeLevel(string sign)


    anchors.fill: parent
    onGameover: {
        isGameOver = true;
        gameOverPic.visible = true;
        continueGameButton.visible = false;
    }
    onNewGame: {
        isGameOver = false;
        gameOverPic.visible = false;
        continueGameButton.visible = true;
    }

    Rectangle{
        id: fog
        anchors.fill: parent
        opacity: 0.6
        color: "black"
        z: 2
    }
    Item {
        id: menuArea
        z: 3
        width: parent.width*2/3
        height: parent.height*4/7
        anchors.centerIn: parent
        property string levelString: "Level: auto"

        Image{
            id: gameOverPic
            width: continueGameButton.width
            height: width/sourceSize.width*sourceSize.height
            anchors.top: parent.top
            source: "/images/gameover.png"
            visible: false
        }

        Button{
            id: continueGameButton
            width: parent.width
            height: width/pic.sourceSize.width*pic.sourceSize.height
            anchors.top: parent.top
            anchors.margins: 10
            pic.source: "/images/yellowButton.png"
            text: "CONTINUE"
            onClicked: continueGame();
        }

        Button{
            id: newGameButton
            width: parent.width
            height: width/pic.sourceSize.width*pic.sourceSize.height
            anchors.top: continueGameButton.bottom
            anchors.margins: 10
            pic.source: "/images/greenButton.png"
            text: "NEW GAME"
            onClicked: newGame();
        }
        Button{
            id: runAIButton
            property bool isBotPlaying: false
            width: parent.width
            height: width/pic.sourceSize.width*pic.sourceSize.height
            anchors.top: newGameButton.bottom
            anchors.margins: 10
            pic.source: "/images/blueButton.png"
            text: "RUN AI"
            onClicked: {
                if (isGameOver) newGame();
                if (!isBotPlaying){
                    isBotPlaying = true;
                    text = "MANUAL GAME"
                    botOn();
                }
                else{
                    isBotPlaying = false;
                    text = "RUN AI"
                    botOff();
                }
            }

        }

        Button{
            id: exitButton
            width: parent.width
            height: width/pic.sourceSize.width*pic.sourceSize.height
            anchors.top: runAIButton.bottom
            anchors.margins: 10
            pic.source: "/images/redButton.png"
            text: "EXIT"
            onClicked: exit();
        }

        LevelChanger{
            id: levelChanger
            width: parent.width
            anchors.top: exitButton.bottom
            anchors.topMargin: 40
            onLeftClicked: changeLevel("-");
            onRightClicked: changeLevel("+");
            levelString: parent.levelString
        }
    }
}

