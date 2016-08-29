import QtQuick 1.1

Item {
    id: button
    signal clicked
    property alias pic: buttonPic
    property alias text: text.text
    Image {
        id: buttonPic
        width: parent.width
        height: parent.height
        source: "images/greenButton.png"
    }
    Text {
        id: text
        color: "#000000"
        text: "button"
        font.family: "Elephant"
        //font.bold: true
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        font.pointSize: 14
        anchors.centerIn: parent
    }

     MouseArea {
         id: mouseArea;
         anchors.fill: buttonPic;
         onClicked: button.clicked()
     }
}

