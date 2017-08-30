/**
 * Created by Matt on 6/16/2017.
 */


function Game() {

    var canvas = $("#canvas");
    var turtle = document.getElementById("canvas").getContext("2d");
    var defaultVertexNumber = 7;
    var vertexArray = [];
    var vLayer = 1;
    var lastPoint;
    var intervalId;
    var canvasWidth = canvas.css("width").slice(0,-2);
    var canvasHeight = canvas.css("height").slice(0,-2);
    var jumpRatio = 0.5;
    var speed = 25;
    var size = 10;
    var switchChance = 20;


    var drawSquare = function(x, y, width) {
        var h = width/2;

        turtle.beginPath();
        turtle.moveTo(x - h, y - h);
        turtle.lineTo(x + h, y - h);
        turtle.lineTo(x + h, y + h);
        turtle.lineTo(x - h, y + h);
        turtle.lineTo(x - h, y - h);
        turtle.stroke();
    };

    var drawPolygon = function(x, y, sideNum, width) {

        var innerAngle = 180 - (360/sideNum);
        var array = [];

        if (sideNum % 2 == 0) {
            var radius = width/2;
            for(var i = 1; i < sideNum + 1; i++) {
                var coords = [];
                coords.push(x + radius * Math.sin(2*Math.PI*(i/sideNum)));
                coords.push(y + radius * Math.cos(2*Math.PI*(i/sideNum)));
                array.push(coords);
            }
        } else {
            var apothem = (width*Math.abs(Math.sin(innerAngle/2))/(1+Math.abs(Math.sin(innerAngle/2))));
            var radius = width - apothem;
            for(var i = 1; i < sideNum + 1; i++) {
                var coords = [];
                coords.push(x - radius * Math.sin(2*Math.PI*(i/sideNum)));
                coords.push(y - radius * Math.cos(2*Math.PI*(i/sideNum)));
                array.push(coords);
            }
        }

        turtle.beginPath();
        turtle.moveTo(array[0][0], array[0][1]);
        for(var i = 0; i < array.length; i++) {
            turtle.lineTo(array[i][0],array[i][1]);
        }
        turtle.lineTo(array[0][0], array[0][1]);
        turtle.stroke();
    };

    var drawNextPoint = function() {
        if(!lastPoint) {
            lastPoint = [500,500];
        }

        // Split array into both layers
        var layer1 = [];
        var layer2 = [];
        for(var i = 0; i < vertexArray.length; i++) {
            if (vertexArray[i][2] == 1) {
                layer1.push(vertexArray[i]);
            } else {
                layer2.push(vertexArray[i]);
            }
        };

        // Choose between arrays
        if(vLayer == 1) {chosenLayer = layer1;}
        if(vLayer == 2) {chosenLayer = layer2;}
        if(layer2.length > 0) {
            if((Math.random() * 100) < switchChance) {
                if(vLayer == 1) {chosenLayer = layer2; vLayer = 2;}
                if(vLayer == 2) {chosenLayer = layer1; vLayer = 1;}
            }
        }

        // Randomly choose between vertices
        var target = chosenLayer[Math.floor(Math.random() * chosenLayer.length)];

        // Find distance between points
        var distance = Math.sqrt(Math.pow((lastPoint[0]-target[0]),2) + Math.pow((lastPoint[1]-target[1]),2));
        var x = lastPoint[0] + (jumpRatio) * (target[0] - lastPoint[0]);
        var y = lastPoint[1] + (jumpRatio) * (target[1] - lastPoint[1]);
        drawPolygon(x, y, vertexArray.length, size);
        lastPoint = [x,y];
    };

    this.clickedCanvas = function(clickX, clickY) {

        if(vertexArray.length < defaultVertexNumber) {
            vertexArray.push([clickX,clickY, vLayer]);
            drawPolygon(clickX, clickY, 4, 20);
        } else {
            console.log("Too many vertices");
        }
        console.log(vertexArray);
    };

    this.switchVertices = function() {
        if(vertexArray.length == 0) {return;}
        if(vLayer == 1) {
            vLayer = 2;
        }  else {
            vLayer = 1;
        }
    };

    this.start = function() {
        if(!intervalId){
            this.draw();
        }
    };

    this.draw = function() {
        intervalId = setInterval(function() {
            drawNextPoint();
        }, 1000/speed)
    };

    this.reset = function() {

        if(intervalId) {
            clearInterval(intervalId);
            intervalId = false;
        }
        turtle.clearRect(0,0,canvasWidth,canvasHeight);
        vertexArray = [];
    };

    this.clear = function() {
        turtle.clearRect(0,0,canvasWidth, canvasHeight);
        for(var i = 0; i < vertexArray.length; i++) {
            drawPolygon(vertexArray[i][0], vertexArray[i][1], 4, 20);
        }
    };

    this.updateSpeed = function(newSpeed) {
        speed = newSpeed;
        if(intervalId) {
            clearInterval(intervalId);
            this.draw();
        }
    };

    this.updateSize = function(newSize) {
        size = newSize;
    };

    this.updateDistance = function(newDist) {
        jumpRatio = newDist/100;
    };

}