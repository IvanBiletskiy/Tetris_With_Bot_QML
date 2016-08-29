import QtQuick 1.1

Item {
    id: levelChanger
    property string levelString
    signal leftClicked
    signal rightClicked

    Item {
        id: background
        width: parent.width
        height: width*leftArrow.sourceSize.height/leftArrow.sourceSize.width/5;       
    }

    Image {
        id: leftArrow
        width: background.height/1.7
        height: width
        anchors.left: background.left
        anchors.margins: 15
        anchors.verticalCenter: background.verticalCenter
        source: "images/arrow.png"
        mirror: true
        MouseArea {
            id: mouseAreaLeft
            anchors.fill: parent
            onClicked: leftClicked();
        }
    }

    Image {
        id: rightArrow
        width: background.height/1.7
        height: width
        anchors.right: background.right
        anchors.margins: 15
        anchors.verticalCenter: background.verticalCenter
        source: "images/arrow.png"
        MouseArea {
            id: mouseAreaRight
            anchors.fill: parent
            onClicked: rightClicked();
        }
    }
    Text {
        id: txt
        color: "#ffffff"
        text: parent.levelString
        font.family: "Elephant"
        font.pointSize: 14
        anchors.centerIn: background
    }



}

