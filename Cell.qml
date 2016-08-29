import QtQuick 1.1
Rectangle {
    width: 30
    height: width
    property int type: 0
    border.color: "black"
    border.width: 3
    visible: false
    Image{
        id: pic
        anchors.fill: parent

    }
    onTypeChanged: {
        switch (type) {
            case 0:
                visible = false;
                break;
            case 1:{
                visible = true;
                pic.source = "images/blueBlock.png"
                break; }
            case 2:{
                visible = true;
                pic.source = "images/greenBlock.png"
                break; }
            case 3:{
                visible = true;
                pic.source = "images/lightBlueBlock.png"
                break; }
            case 4:{
                visible = true;
                pic.source = "images/orangeBlock.png"
                break;
            }
            case 5:{
                visible = true;
                pic.source = "images/pinkBlock.png"
                break;}
            case 6:{
                visible = true;
                pic.source = "images/redBlock.png"
                break;}
            case 7:{
                visible = true;
                pic.source = "images/yellowBlock.png"
                break;}

        }
    }
}
