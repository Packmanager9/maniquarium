
window.addEventListener('DOMContentLoaded', (event) => {


    // let pomaoimg = new Image()
    // pomaoimg.src = 'rcpomao.png'

    const squaretable = {} // this section of code is an optimization for use of the hypotenuse function on Line and LineOP objects
    for (let t = 0; t < 10000000; t++) {
        squaretable[`${t}`] = Math.sqrt(t)
        if (t > 999) {
            t += 9
        }
    }
    let video_recorder
    let recording = 0
    function CanvasCaptureToWEBM(canvas, bitrate) {
        // the video_recorder is set to  '= new CanvasCaptureToWEBM(canvas, 4500000);' in the setup, 
        // it uses the same canvas as the rest of the file.
        // to start a recording call .record() on video_recorder
        /*
        for example, 
        if(keysPressed['-'] && recording == 0){
            recording = 1
            video_recorder.record()
        }
        if(keysPressed['='] && recording == 1){
            recording = 0
            video_recorder.stop()
            video_recorder.download('File Name As A String.webm')
        }
        */
        this.record = Record
        this.stop = Stop
        this.download = saveToDownloads
        let blobCaptures = []
        let outputFormat = {}
        let recorder = {}
        let canvasInput = canvas.captureStream()
        if (typeof canvasInput == undefined || !canvasInput) {
            return
        }
        const video = document.createElement('video')
        video.style.display = 'none'

        function Record() {
            let formats = [
                "video/webm\;codecs=h264",
                "video/webm\;codecs=vp8",
                'video/vp8',
                "video/webm",
                'video/webm,codecs=vp9',
                "video/webm\;codecs=daala",
                "video/mpeg"
            ];

            for (let t = 0; t < formats.length; t++) {
                if (MediaRecorder.isTypeSupported(formats[t])) {
                    outputFormat = formats[t]
                    break
                }
            }
            if (typeof outputFormat != "string") {
                return
            } else {
                let videoSettings = {
                    mimeType: outputFormat,
                    videoBitsPerSecond: bitrate || 2000000 // 2Mbps
                };
                blobCaptures = []
                try {
                    recorder = new MediaRecorder(canvasInput, videoSettings)
                } catch (error) {
                    return;
                }
                recorder.onstop = handleStop
                recorder.ondataavailable = handleAvailableData
                recorder.start(100)
            }
        }
        function handleAvailableData(event) {
            if (event.data && event.data.size > 0) {
                blobCaptures.push(event.data)
            }
        }
        function handleStop() {
            const superBuffer = new Blob(blobCaptures, { type: outputFormat })
            video.src = window.URL.createObjectURL(superBuffer)
        }
        function Stop() {
            recorder.stop()
            video.controls = true
        }
        function saveToDownloads(input) { // specifying a file name for the output
            const name = input || 'video_out.webm'
            const blob = new Blob(blobCaptures, { type: outputFormat })
            const url = window.URL.createObjectURL(blob)
            const storageElement = document.createElement('a')
            storageElement.style.display = 'none'
            storageElement.href = url
            storageElement.download = name
            document.body.appendChild(storageElement)
            storageElement.click()
            setTimeout(() => {
                document.body.removeChild(storageElement)
                window.URL.revokeObjectURL(url)
            }, 100)
        }
    }
    const gamepadAPI = {
        controller: {},
        turbo: true,
        connect: function (evt) {
            if (navigator.getGamepads()[0] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[1] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[2] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[3] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            }
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i] === null) {
                    continue;
                }
                if (!gamepads[i].connected) {
                    continue;
                }
            }
        },
        disconnect: function (evt) {
            gamepadAPI.turbo = false;
            delete gamepadAPI.controller;
        },
        update: function () {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.buttonsCache = [];// clear the buttons cache
            for (var k = 0; k < gamepadAPI.buttonsStatus.length; k++) {// move the buttons status from the previous frame to the cache
                gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
            }
            gamepadAPI.buttonsStatus = [];// clear the buttons status
            var c = gamepadAPI.controller || {}; // get the gamepad object
            var pressed = [];
            if (c.buttons) {
                for (var b = 0, t = c.buttons.length; b < t; b++) {// loop through buttons and push the pressed ones to the array
                    if (c.buttons[b].pressed) {
                        pressed.push(gamepadAPI.buttons[b]);
                    }
                }
            }
            var axes = [];
            if (c.axes) {
                for (var a = 0, x = c.axes.length; a < x; a++) {// loop through axes and push their values to the array
                    axes.push(c.axes[a].toFixed(2));
                }
            }
            gamepadAPI.axesStatus = axes;// assign received values
            gamepadAPI.buttonsStatus = pressed;
            // console.log(pressed); // return buttons for debugging purposes
            return pressed;
        },
        buttonPressed: function (button, hold) {
            var newPress = false;
            for (var i = 0, s = gamepadAPI.buttonsStatus.length; i < s; i++) {// loop through pressed buttons
                if (gamepadAPI.buttonsStatus[i] == button) {// if we found the button we're looking for...
                    newPress = true;// set the boolean variable to true
                    if (!hold) {// if we want to check the single press
                        for (var j = 0, p = gamepadAPI.buttonsCache.length; j < p; j++) {// loop through the cached states from the previous frame
                            if (gamepadAPI.buttonsCache[j] == button) { // if the button was already pressed, ignore new press
                                newPress = false;
                            }
                        }
                    }
                }
            }
            return newPress;
        },
        buttons: [
            'A', 'B', 'X', 'Y', 'LB', 'RB', 'Left-Trigger', 'Right-Trigger', 'Back', 'Start', 'Axis-Left', 'Axis-Right', 'DPad-Up', 'DPad-Down', 'DPad-Left', 'DPad-Right', "Power"
        ],
        buttonsCache: [],
        buttonsStatus: [],
        axesStatus: []
    };
    let canvas
    let canvas_context
    let keysPressed = {}
    let FLEX_engine
    let TIP_engine = {}
    let XS_engine
    let YS_engine
    class Point {
        constructor(x, y) {
            this.x = x
            this.y = y
            this.radius = 0
        }
        pointDistance(point) {
            return (new LineOP(this, point, "transparent", 0)).hypotenuse()
        }
    }

    class Vector { // vector math and physics if you prefer this over vector components on circles
        constructor(object = (new Point(0, 0)), xmom = 0, ymom = 0) {
            this.xmom = xmom
            this.ymom = ymom
            this.object = object
        }
        isToward(point) {
            let link = new LineOP(this.object, point)
            let dis1 = link.squareDistance()
            let dummy = new Point(this.object.x + this.xmom, this.object.y + this.ymom)
            let link2 = new LineOP(dummy, point)
            let dis2 = link2.squareDistance()
            if (dis2 < dis1) {
                return true
            } else {
                return false
            }
        }
        rotate(angleGoal) {
            let link = new Line(this.xmom, this.ymom, 0, 0)
            let length = link.hypotenuse()
            let x = (length * Math.cos(angleGoal))
            let y = (length * Math.sin(angleGoal))
            this.xmom = x
            this.ymom = y
        }
        magnitude() {
            return (new Line(this.xmom, this.ymom, 0, 0)).hypotenuse()
        }
        normalize(size = 1) {
            let magnitude = this.magnitude()
            this.xmom /= Math.max(magnitude, .1)
            this.ymom /= Math.max(magnitude, .1)
            this.xmom *= size
            this.ymom *= size
        }
        multiply(vect) {
            let point = new Point(0, 0)
            let end = new Point(this.xmom + vect.xmom, this.ymom + vect.ymom)
            return point.pointDistance(end)
        }
        add(vect) {
            return new Vector(this.object, this.xmom + vect.xmom, this.ymom + vect.ymom)
        }
        subtract(vect) {
            return new Vector(this.object, this.xmom - vect.xmom, this.ymom - vect.ymom)
        }
        divide(vect) {
            return new Vector(this.object, this.xmom / vect.xmom, this.ymom / vect.ymom) //be careful with this, I don't think this is right
        }
        draw() {
            let dummy = new Point(this.object.x + this.xmom, this.object.y + this.ymom)
            let link = new LineOP(this.object, dummy, "#FFFFFF", 1)
            link.draw()
        }
    }
    class Line {
        constructor(x, y, x2, y2, color, width) {
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        angle() {
            return Math.atan2(this.y1 - this.y2, this.x1 - this.x2)
        }
        squareDistance() {
            let xdif = this.x1 - this.x2
            let ydif = this.y1 - this.y2
            let squareDistance = (xdif * xdif) + (ydif * ydif)
            return squareDistance
        }
        hypotenuse() {
            let xdif = this.x1 - this.x2
            let ydif = this.y1 - this.y2
            let hypotenuse = (xdif * xdif) + (ydif * ydif)
            if (hypotenuse < 10000000 - 1) {
                if (hypotenuse > 1000) {
                    return squaretable[`${Math.round(10 * Math.round((hypotenuse * .1)))}`]
                } else {
                    return squaretable[`${Math.round(hypotenuse)}`]
                }
            } else {
                return Math.sqrt(hypotenuse)
            }
        }
        draw() {
            let linewidthstorage = canvas_context.lineWidth
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.x1, this.y1)
            canvas_context.lineTo(this.x2, this.y2)
            canvas_context.stroke()
            canvas_context.lineWidth = linewidthstorage
        }
    }
    class LineOP {
        constructor(object, target, color, width) {
            this.object = object
            this.target = target
            this.color = color
            this.width = width
        }
        squareDistance() {
            let xdif = this.object.x - this.target.x
            let ydif = this.object.y - this.target.y
            let squareDistance = (xdif * xdif) + (ydif * ydif)
            return squareDistance
        }
        hypotenuse() {
            let xdif = this.object.x - this.target.x
            let ydif = this.object.y - this.target.y
            let hypotenuse = (xdif * xdif) + (ydif * ydif)
            if (hypotenuse < 10000000 - 1) {
                if (hypotenuse > 1000) {
                    return squaretable[`${Math.round(10 * Math.round((hypotenuse * .1)))}`]
                } else {
                    return squaretable[`${Math.round(hypotenuse)}`]
                }
            } else {
                return Math.sqrt(hypotenuse)
            }
        }
        angle() {
            return Math.atan2(this.object.y - this.target.y, this.object.x - this.target.x)
        }
        draw() {
            let linewidthstorage = canvas_context.lineWidth
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.object.x, this.object.y)
            canvas_context.lineTo(this.target.x, this.target.y)
            canvas_context.stroke()
            canvas_context.lineWidth = linewidthstorage
        }
    }
    class Triangle {
        constructor(x, y, color, length, fill = 0, strokeWidth = 0, leg1Ratio = 1, leg2Ratio = 1, heightRatio = 1) {
            this.x = x
            this.y = y
            this.color = color
            this.length = length
            this.x1 = this.x + this.length * leg1Ratio
            this.x2 = this.x - this.length * leg2Ratio
            this.tip = this.y - this.length * heightRatio
            this.accept1 = (this.y - this.tip) / (this.x1 - this.x)
            this.accept2 = (this.y - this.tip) / (this.x2 - this.x)
            this.fill = fill
            this.stroke = strokeWidth
        }
        draw() {
            canvas_context.strokeStyle = this.color
            canvas_context.stokeWidth = this.stroke
            canvas_context.beginPath()
            canvas_context.moveTo(this.x, this.y)
            canvas_context.lineTo(this.x1, this.y)
            canvas_context.lineTo(this.x, this.tip)
            canvas_context.lineTo(this.x2, this.y)
            canvas_context.lineTo(this.x, this.y)
            if (this.fill == 1) {
                canvas_context.fill()
            }
            canvas_context.stroke()
            canvas_context.closePath()
        }
        isPointInside(point) {
            if (point.x <= this.x1) {
                if (point.y >= this.tip) {
                    if (point.y <= this.y) {
                        if (point.x >= this.x2) {
                            this.accept1 = (this.y - this.tip) / (this.x1 - this.x)
                            this.accept2 = (this.y - this.tip) / (this.x2 - this.x)
                            this.basey = point.y - this.tip
                            this.basex = point.x - this.x
                            if (this.basex == 0) {
                                return true
                            }
                            this.slope = this.basey / this.basex
                            if (this.slope >= this.accept1) {
                                return true
                            } else if (this.slope <= this.accept2) {
                                return true
                            }
                        }
                    }
                }
            }
            return false
        }
    }
    class Rectangle {
        constructor(x, y, width, height, color, fill = 1, stroke = 0, strokeWidth = 1) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
            this.stroke = stroke
            this.strokeWidth = strokeWidth
            this.fill = fill
        }
        draw() {
            canvas_context.fillStyle = this.color
            canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move() {
            this.x += this.xmom
            this.y += this.ymom
        }
        isPointInside(point) {
            if (point.x >= this.x) {
                if (point.y >= this.y) {
                    if (point.x <= this.x + this.width) {
                        if (point.y <= this.y + this.height) {
                            return true
                        }
                    }
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            if (point.x + point.radius >= this.x) {
                if (point.y + point.radius >= this.y) {
                    if (point.x - point.radius <= this.x + this.width) {
                        if (point.y - point.radius <= this.y + this.height) {
                            return true
                        }
                    }
                }
            }
            return false
        }
    }
    class Circle {
        constructor(x, y, radius, color, xmom = 0, ymom = 0, friction = 1, reflect = 0, strokeWidth = 0, strokeColor = "transparent") {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.friction = friction
            this.reflect = reflect
            this.strokeWidth = strokeWidth
            this.strokeColor = strokeColor
        }
        anchorCheck() {
            if (this.anchored == 1) {
                this.x = this.anchor.x
                this.y = this.anchor.y
                this.anchor.y -= .1
            }
        }
        draw() {
            canvas_context.lineWidth = this.strokeWidth
            canvas_context.strokeStyle = this.color
            canvas_context.beginPath();
            if (this.radius > 0) {
                canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
                canvas_context.fillStyle = this.color
                canvas_context.fill()
                canvas_context.stroke();
            } else {
                console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
            }
        }
        move() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom
        }
        unmove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x -= this.xmom
            this.y -= this.ymom
        }
        frictiveMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom
            this.xmom *= this.friction
            this.ymom *= this.friction
        }
        frictiveunMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.xmom /= this.friction
            this.ymom /= this.friction
            this.x -= this.xmom
            this.y -= this.ymom
        }
        isPointInside(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.radius * this.radius)) {
                return true
            }
            return false
        }
        doesPerimeterTouch(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= ((this.radius + point.radius) * (this.radius + point.radius))) {
                return true
            }
            return false
        }
    } class Polygon {
        constructor(x, y, size, color, sides = 3, xmom = 0, ymom = 0, angle = 0, reflect = 0) {
            if (sides < 2) {
                sides = 2
            }
            this.reflect = reflect
            this.xmom = xmom
            this.ymom = ymom
            this.body = new Circle(x, y, size - (size * .293), "transparent")
            this.nodes = []
            this.angle = angle
            this.size = size
            this.color = color
            this.angleIncrement = (Math.PI * 2) / sides
            this.sides = sides
            for (let t = 0; t < sides; t++) {
                let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                this.nodes.push(node)
                this.angle += this.angleIncrement
            }
        }
        isPointInside(point) { // rough approximation
            this.body.radius = this.size - (this.size * .293)
            if (this.sides <= 2) {
                return false
            }
            this.areaY = point.y - this.body.y
            this.areaX = point.x - this.body.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.body.radius * this.body.radius)) {
                return true
            }
            return false
        }
        move() {
            if (this.reflect == 1) {
                if (this.body.x > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.body.y > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.body.x < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.body.y < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.body.x += this.xmom
            this.body.y += this.ymom
        }
        draw() {
            this.nodes = []
            this.angleIncrement = (Math.PI * 2) / this.sides
            this.body.radius = this.size - (this.size * .293)
            for (let t = 0; t < this.sides; t++) {
                let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                this.nodes.push(node)
                this.angle += this.angleIncrement
            }
            canvas_context.strokeStyle = this.color
            canvas_context.fillStyle = this.color
            canvas_context.lineWidth = 0
            canvas_context.beginPath()
            canvas_context.moveTo(this.nodes[0].x, this.nodes[0].y)
            for (let t = 1; t < this.nodes.length; t++) {
                canvas_context.lineTo(this.nodes[t].x, this.nodes[t].y)
            }
            canvas_context.lineTo(this.nodes[0].x, this.nodes[0].y)
            canvas_context.fill()
            canvas_context.stroke()
            canvas_context.closePath()
        }
    }
    class Shape {
        constructor(shapes) {
            this.shapes = shapes
            this.shape = 1
            this.x = 0
            this.y = 0
            for (let t = 0; t < this.shapes.length; t++) {
                this.x += this.shapes[t].x
                this.y += this.shapes[t].y
            }
            this.x /= this.shapes.length
            this.y /= this.shapes.length
        }
        draw() {
            for (let t = 0; t < this.shapes.length; t++) {
                this.shapes[t].draw()
            }
        }
        isPointInside(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].isPointInside(point)) {
                    return true
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].doesPerimeterTouch(point)) {
                    return true
                }
            }
            return false
        }
        innerShape(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].doesPerimeterTouch(point)) {
                    return this.shapes[t]
                }
            }
            return false
        }
        isInsideOf(box) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (box.isPointInside(this.shapes[t])) {
                    return true
                }
            }
            return false
        }
        adjustByFromDisplacement(x, y, wet = 0) {

            this.x = 0
            this.y = 0
            for (let t = 0; t < this.shapes.length; t++) {
                this.x += this.shapes[t].x
                this.y += this.shapes[t].y
            }
            this.x /= this.shapes.length
            this.y /= this.shapes.length
            for (let t = 0; t < this.shapes.length; t++) {
                if (typeof this.shapes[t].fromRatio == "number") {
                    this.shapes[t].x += x * this.shapes[t].fromRatio
                    if (wet == 1) {
                        if (this.shapes[t].y > tank.waterline) {
                            this.shapes[t].y += (y * this.shapes[t].fromRatio) * .55
                        } else {
                            this.shapes[t].y += (y * this.shapes[t].fromRatio)
                        }
                    } else {
                        this.shapes[t].y += y * this.shapes[t].fromRatio
                    }
                }
            }
        }
        adjustByToDisplacement(x, y, wet = 0) {

            this.x = 0
            this.y = 0
            for (let t = 0; t < this.shapes.length; t++) {
                this.x += this.shapes[t].x
                this.y += this.shapes[t].y
            }
            this.x /= this.shapes.length
            this.y /= this.shapes.length
            for (let t = 0; t < this.shapes.length; t++) {
                if (typeof this.shapes[t].toRatio == "number") {
                    this.shapes[t].x += x * this.shapes[t].toRatio
                    if (wet == 1) {
                        if (this.shapes[t].y > tank.waterline) {
                            this.shapes[t].y += (y * this.shapes[t].toRatio) * .55
                        } else {
                            this.shapes[t].y += y * this.shapes[t].toRatio
                        }
                    } else {
                        this.shapes[t].y += y * this.shapes[t].toRatio
                    }
                }
            }
        }
        mixIn(arr) {
            for (let t = 0; t < arr.length; t++) {
                for (let k = 0; k < arr[t].shapes.length; k++) {
                    this.shapes.push(arr[t].shapes[k])
                }
            }
        }
        push(object) {
            this.shapes.push(object)
        }
    }

    class Spring {
        constructor(x, y, radius, color, body = 0, length = 1, gravity = 0, width = 1) {
            if (body == 0) {
                this.body = new Circle(x, y, radius, color)
                this.anchor = new Circle(x, y, radius, color)
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
                this.length = length
            } else {
                this.body = body
                this.anchor = new Circle(x, y, radius, color)
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
                this.length = length
            }
            this.gravity = gravity
            this.width = width
        }
        balance() {
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
            if (this.beam.hypotenuse() < this.length) {
                this.body.xmom += (this.body.x - this.anchor.x) / this.length
                this.body.ymom += (this.body.y - this.anchor.y) / this.length
                this.anchor.xmom -= (this.body.x - this.anchor.x) / this.length
                this.anchor.ymom -= (this.body.y - this.anchor.y) / this.length
            } else {
                this.body.xmom -= (this.body.x - this.anchor.x) / this.length
                this.body.ymom -= (this.body.y - this.anchor.y) / this.length
                this.anchor.xmom += (this.body.x - this.anchor.x) / this.length
                this.anchor.ymom += (this.body.y - this.anchor.y) / this.length
            }
            let xmomentumaverage = (this.body.xmom + this.anchor.xmom) / 2
            let ymomentumaverage = (this.body.ymom + this.anchor.ymom) / 2
            this.body.xmom = (this.body.xmom + xmomentumaverage) / 2
            this.body.ymom = (this.body.ymom + ymomentumaverage) / 2
            this.anchor.xmom = (this.anchor.xmom + xmomentumaverage) / 2
            this.anchor.ymom = (this.anchor.ymom + ymomentumaverage) / 2
        }
        draw() {
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
            this.beam.draw()
            this.body.draw()
            this.anchor.draw()
        }
        move() {
            this.anchor.ymom += this.gravity
            this.anchor.move()
        }

    }
    class SpringOP {
        constructor(body, anchor, length, width = 3, color = body.color) {
            this.body = body
            this.anchor = anchor
            this.beam = new LineOP(body, anchor, color, width)
            this.length = length
        }
        balance() {
            if (this.beam.hypotenuse() < this.length) {
                this.body.xmom += ((this.body.x - this.anchor.x) / this.length)
                this.body.ymom += ((this.body.y - this.anchor.y) / this.length)
                this.anchor.xmom -= ((this.body.x - this.anchor.x) / this.length)
                this.anchor.ymom -= ((this.body.y - this.anchor.y) / this.length)
            } else if (this.beam.hypotenuse() > this.length) {
                this.body.xmom -= (this.body.x - this.anchor.x) / (this.length)
                this.body.ymom -= (this.body.y - this.anchor.y) / (this.length)
                this.anchor.xmom += (this.body.x - this.anchor.x) / (this.length)
                this.anchor.ymom += (this.body.y - this.anchor.y) / (this.length)
            }

            let xmomentumaverage = (this.body.xmom + this.anchor.xmom) / 2
            let ymomentumaverage = (this.body.ymom + this.anchor.ymom) / 2
            this.body.xmom = (this.body.xmom + xmomentumaverage) / 2
            this.body.ymom = (this.body.ymom + ymomentumaverage) / 2
            this.anchor.xmom = (this.anchor.xmom + xmomentumaverage) / 2
            this.anchor.ymom = (this.anchor.ymom + ymomentumaverage) / 2
        }
        draw() {
            this.beam.draw()
        }
        move() {
            //movement of SpringOP objects should be handled separate from their linkage, to allow for many connections, balance here with this object, move nodes independently
        }
    }

    class Color {
        constructor(baseColor, red = -1, green = -1, blue = -1, alpha = 1) {
            this.hue = baseColor
            if (red != -1 && green != -1 && blue != -1) {
                this.r = red
                this.g = green
                this.b = blue
                if (alpha != 1) {
                    if (alpha < 1) {
                        this.alpha = alpha
                    } else {
                        this.alpha = alpha / 255
                        if (this.alpha > 1) {
                            this.alpha = 1
                        }
                    }
                }
                if (this.r > 255) {
                    this.r = 255
                }
                if (this.g > 255) {
                    this.g = 255
                }
                if (this.b > 255) {
                    this.b = 255
                }
                if (this.r < 0) {
                    this.r = 0
                }
                if (this.g < 0) {
                    this.g = 0
                }
                if (this.b < 0) {
                    this.b = 0
                }
            } else {
                this.r = 0
                this.g = 0
                this.b = 0
            }
        }
        normalize() {
            if (this.r > 255) {
                this.r = 255
            }
            if (this.g > 255) {
                this.g = 255
            }
            if (this.b > 255) {
                this.b = 255
            }
            if (this.r < 0) {
                this.r = 0
            }
            if (this.g < 0) {
                this.g = 0
            }
            if (this.b < 0) {
                this.b = 0
            }
        }
        randomLight() {
            var letters = '0123456789ABCDEF';
            var hash = '#';
            for (var i = 0; i < 6; i++) {
                hash += letters[(Math.floor(Math.random() * 12) + 4)];
            }
            var color = new Color(hash, 55 + Math.random() * 200, 55 + Math.random() * 200, 55 + Math.random() * 200)
            return color;
        }
        randomDark() {
            var letters = '0123456789ABCDEF';
            var hash = '#';
            for (var i = 0; i < 6; i++) {
                hash += letters[(Math.floor(Math.random() * 12))];
            }
            var color = new Color(hash, Math.random() * 200, Math.random() * 200, Math.random() * 200)
            return color;
        }
        random() {
            var letters = '0123456789ABCDEF';
            var hash = '#';
            for (var i = 0; i < 6; i++) {
                hash += letters[(Math.floor(Math.random() * 16))];
            }
            var color = new Color(hash, Math.random() * 255, Math.random() * 255, Math.random() * 255)
            return color;
        }
    }
    class Softbody { //buggy, spins in place
        constructor(x, y, radius, color, members = 10, memberLength = 5, force = 10, gravity = 0) {
            this.springs = []
            this.pin = new Circle(x, y, radius, color)
            this.spring = new Spring(x, y, radius, color, this.pin, memberLength, gravity)
            this.springs.push(this.spring)
            for (let k = 0; k < members; k++) {
                this.spring = new Spring(x, y, radius, color, this.spring.anchor, memberLength, gravity)
                if (k < members - 1) {
                    this.springs.push(this.spring)
                } else {
                    this.spring.anchor = this.pin
                    this.springs.push(this.spring)
                }
            }
            this.forceConstant = force
            this.centroid = new Point(0, 0)
        }
        circularize() {
            this.xpoint = 0
            this.ypoint = 0
            for (let s = 0; s < this.springs.length; s++) {
                this.xpoint += (this.springs[s].anchor.x / this.springs.length)
                this.ypoint += (this.springs[s].anchor.y / this.springs.length)
            }
            this.centroid.x = this.xpoint
            this.centroid.y = this.ypoint
            this.angle = 0
            this.angleIncrement = (Math.PI * 2) / this.springs.length
            for (let t = 0; t < this.springs.length; t++) {
                this.springs[t].body.x = this.centroid.x + (Math.cos(this.angle) * this.forceConstant)
                this.springs[t].body.y = this.centroid.y + (Math.sin(this.angle) * this.forceConstant)
                this.angle += this.angleIncrement
            }
        }
        balance() {
            for (let s = this.springs.length - 1; s >= 0; s--) {
                this.springs[s].balance()
            }
            this.xpoint = 0
            this.ypoint = 0
            for (let s = 0; s < this.springs.length; s++) {
                this.xpoint += (this.springs[s].anchor.x / this.springs.length)
                this.ypoint += (this.springs[s].anchor.y / this.springs.length)
            }
            this.centroid.x = this.xpoint
            this.centroid.y = this.ypoint
            for (let s = 0; s < this.springs.length; s++) {
                this.link = new Line(this.centroid.x, this.centroid.y, this.springs[s].anchor.x, this.springs[s].anchor.y, 0, "transparent")
                if (this.link.hypotenuse() != 0) {
                    this.springs[s].anchor.xmom += (((this.springs[s].anchor.x - this.centroid.x) / (this.link.hypotenuse()))) * this.forceConstant
                    this.springs[s].anchor.ymom += (((this.springs[s].anchor.y - this.centroid.y) / (this.link.hypotenuse()))) * this.forceConstant
                }
            }
            for (let s = 0; s < this.springs.length; s++) {
                this.springs[s].move()
            }
            for (let s = 0; s < this.springs.length; s++) {
                this.springs[s].draw()
            }
        }
    }
    class Observer {
        constructor(x, y, radius, color, range = 100, rays = 10, angle = (Math.PI * .125)) {
            this.body = new Circle(x, y, radius, color)
            this.color = color
            this.ray = []
            this.rayrange = range
            this.globalangle = Math.PI
            this.gapangle = angle
            this.currentangle = 0
            this.obstacles = []
            this.raymake = rays
        }
        beam() {
            this.currentangle = this.gapangle / 2
            for (let k = 0; k < this.raymake; k++) {
                this.currentangle += (this.gapangle / Math.ceil(this.raymake / 2))
                let ray = new Circle(this.body.x, this.body.y, 1, "white", (((Math.cos(this.globalangle + this.currentangle)))), (((Math.sin(this.globalangle + this.currentangle)))))
                ray.collided = 0
                ray.lifespan = this.rayrange - 1
                this.ray.push(ray)
            }
            for (let f = 0; f < this.rayrange; f++) {
                for (let t = 0; t < this.ray.length; t++) {
                    if (this.ray[t].collided < 1) {
                        this.ray[t].move()
                        for (let q = 0; q < this.obstacles.length; q++) {
                            if (this.obstacles[q].isPointInside(this.ray[t])) {
                                this.ray[t].collided = 1
                            }
                        }
                    }
                }
            }
        }
        draw() {
            this.beam()
            this.body.draw()
            canvas_context.lineWidth = 1
            canvas_context.fillStyle = this.color
            canvas_context.strokeStyle = this.color
            canvas_context.beginPath()
            canvas_context.moveTo(this.body.x, this.body.y)
            for (let y = 0; y < this.ray.length; y++) {
                canvas_context.lineTo(this.ray[y].x, this.ray[y].y)
                canvas_context.lineTo(this.body.x, this.body.y)
            }
            canvas_context.stroke()
            canvas_context.fill()
            this.ray = []
        }
    }
    function setUp(canvas_pass, style = "#002222") {
        canvas = canvas_pass
        video_recorder = new CanvasCaptureToWEBM(canvas, 4500000);
        canvas_context = canvas.getContext('2d');
        canvas_context.imageSmoothingEnabled = true
        canvas.style.background = style
        window.setInterval(function () {
            main()
        }, 22)
        document.addEventListener('keydown', (event) => {
            keysPressed[event.key] = true;
            coordi.flagSwap()
        });
        document.addEventListener('keyup', (event) => {
            delete keysPressed[event.key];
        });
        window.addEventListener('pointerdown', e => {
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
            TIP_engine.xold = TIP_engine.x
            TIP_engine.yold = TIP_engine.y
            TIP_engine.x = XS_engine
            TIP_engine.y = YS_engine
            TIP_engine.body = TIP_engine

            coordi.act()

            // tank.animals[0].dirshift = 40
            // example usage: if(object.isPointInside(TIP_engine)){ take action }
            window.addEventListener('pointermove', continued_stimuli);
        });
        window.addEventListener('pointerup', e => {
            window.removeEventListener("pointermove", continued_stimuli);
        })
        function continued_stimuli(e) {
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
            TIP_engine.x = XS_engine
            TIP_engine.y = YS_engine
            TIP_engine.body = TIP_engine
        }
    }
    // function gamepad_control(object, speed = 1) { // basic control for objects using the controler
    //     //         console.log(gamepadAPI.axesStatus[1]*gamepadAPI.axesStatus[0]) //debugging
    //     if (typeof object.body != 'undefined') {
    //         if (typeof (gamepadAPI.axesStatus[1]) != 'undefined') {
    //             if (typeof (gamepadAPI.axesStatus[0]) != 'undefined') {
    //                 object.body.x += (gamepadAPI.axesStatus[0] * speed)
    //                 object.body.y += (gamepadAPI.axesStatus[1] * speed)
    //             }
    //         }
    //     } else if (typeof object != 'undefined') {
    //         if (typeof (gamepadAPI.axesStatus[1]) != 'undefined') {
    //             if (typeof (gamepadAPI.axesStatus[0]) != 'undefined') {
    //                 object.x += (gamepadAPI.axesStatus[0] * speed)
    //                 object.y += (gamepadAPI.axesStatus[1] * speed)
    //             }
    //         }
    //     }
    // }
    function control(object, speed = 1) { // basic control for objects
        if (typeof object.body != 'undefined') {
            if (keysPressed['w']) {
                object.body.y -= speed
            }
            if (keysPressed['d']) {
                object.body.x += speed
            }
            if (keysPressed['s']) {
                object.body.y += speed
            }
            if (keysPressed['a']) {
                object.body.x -= speed
            }
        } else if (typeof object != 'undefined') {
            if (keysPressed['w']) {
                object.y -= speed
            }
            if (keysPressed['d']) {
                object.x += speed
            }
            if (keysPressed['s']) {
                object.y += speed
            }
            if (keysPressed['a']) {
                object.x -= speed
            }
        }
    }
    function getRandomLightColor() { // random color that will be visible on  black background
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 12) + 4)];
        }
        return color;
    }
    function getRandomColor() { // random color
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 16) + 0)];
        }
        return color;
    }
    function getRandomDarkColor() {// color that will be visible on a black background
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 12))];
        }
        return color;
    }
    function castBetween(from, to, granularity = 10, radius = 1, color = "cyan") { //creates a sort of beam hitbox between two points, with a granularity (number of members over distance), with a radius defined as well
        let limit = granularity
        let shape_array = []
        for (let t = 0; t < limit; t++) {
            let circ = new Circle((from.x * (t / limit)) + (to.x * ((limit - t) / limit)), (from.y * (t / limit)) + (to.y * ((limit - t) / limit)), radius, color)
            circ.toRatio = t / limit
            circ.fromRatio = (limit - t) / limit
            shape_array.push(circ)
        }
        return (new Shape(shape_array))
    }

    function castBetweenPoints(from, to, granularity = 10, radius = 1) { //creates a sort of beam hitbox between two points, with a granularity (number of members over distance), with a radius defined as well
        let limit = granularity
        let shape_array = []
        for (let t = 0; t < limit; t++) {
            let circ = new Circle((from.x * (t / limit)) + (to.x * ((limit - t) / limit)), (from.y * (t / limit)) + (to.y * ((limit - t) / limit)), radius, "red")
            circ.toRatio = t / limit
            circ.fromRatio = (limit - t) / limit
            shape_array.push(circ)
        }
        return shape_array
    }

    class Disang {
        constructor(dis, ang) {
            this.dis = dis
            this.angle = ang
        }
    }

    class BezierHitbox {
        constructor(x, y, cx, cy, ex, ey, color = "red") { // this function takes a starting x,y, a control point x,y, and a end point x,y
            this.color = color
            this.x = x
            this.y = y
            this.cx = cx
            this.cy = cy
            this.ex = ex
            this.ey = ey
            this.metapoint = new Circle((x + cx + ex) / 3, (y + cy + ey) / 3, 3, "#FFFFFF")
            this.granularity = 100
            this.body = [...castBetweenPoints((new Point(this.x, this.y)), (new Point(this.ex, this.ey)), this.granularity, 0)]

            let angle = (new Line(this.x, this.y, this.ex, this.ey)).angle()

            this.angles = []
            for (let t = 0; t < this.granularity; t++) {
                this.angles.push(angle)
            }
            for (let t = 0; t <= 1; t += 1 / this.granularity) {
                this.body.push(this.getQuadraticXY(t))
                this.angles.push(this.getQuadraticAngle(t))
            }
            this.hitbox = []
            for (let t = 0; t < this.body.length; t++) {
                let link = new LineOP(this.body[t], this.metapoint)
                let disang = new Disang(link.hypotenuse(), link.angle() + (Math.PI * 2))
                this.hitbox.push(disang)
            }
            this.constructed = 1
        }
        isPointInside(point) {
            let link = new LineOP(point, this.metapoint)
            let angle = (link.angle() + (Math.PI * 2))
            let dis = link.hypotenuse()
            for (let t = 1; t < this.hitbox.length; t++) {
                if (Math.abs(this.hitbox[t].angle - this.hitbox[t - 1].angle) > 1) {
                    continue
                }
                if (angle.between(this.hitbox[t].angle, this.hitbox[t - 1].angle)) {
                    if (dis < (this.hitbox[t].dis + this.hitbox[t - 1].dis) * .5) {
                        return true
                    }
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            let link = new LineOP(point, this.metapoint)
            let angle = (link.angle() + (Math.PI * 2))
            let dis = link.hypotenuse()
            for (let t = 1; t < this.hitbox.length; t++) {
                if (Math.abs(this.hitbox[t].angle - this.hitbox[t - 1].angle) > 1) {
                    continue
                }
                if (angle.between(this.hitbox[t].angle, this.hitbox[t - 1].angle)) {
                    if (dis < ((this.hitbox[t].dis + this.hitbox[t - 1].dis) * .5) + point.radius) {
                        return this.angles[t]
                    }
                }
            }
            return false
        }
        draw() {
            this.metapoint.draw()
            let tline = new Line(this.x, this.y, this.ex, this.ey, this.color, 3)
            tline.draw()
            canvas_context.beginPath()
            this.median = new Point((this.x + this.ex) * .5, (this.y + this.ey) * .5)
            let angle = (new LineOP(this.median, this.metapoint)).angle()
            let dis = (new LineOP(this.median, this.metapoint)).hypotenuse()
            canvas_context.bezierCurveTo(this.x, this.y, this.cx - (Math.cos(angle) * dis * .38), this.cy - (Math.sin(angle) * dis * .38), this.ex, this.ey)

            canvas_context.fillStyle = this.color
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = 3
            canvas_context.stroke()
        }
        getQuadraticXY(t) {
            return new Point((((1 - t) * (1 - t)) * this.x) + (2 * (1 - t) * t * this.cx) + (t * t * this.ex), (((1 - t) * (1 - t)) * this.y) + (2 * (1 - t) * t * this.cy) + (t * t * this.ey))
        }
        getQuadraticAngle(t) {
            var dx = 2 * (1 - t) * (this.cx - this.x) + 2 * t * (this.ex - this.cx);
            var dy = 2 * (1 - t) * (this.cy - this.y) + 2 * t * (this.ey - this.cy);
            return -Math.atan2(dx, dy) + 0.5 * Math.PI;
        }
    }
    Number.prototype.between = function (a, b, inclusive) {
        var min = Math.min(a, b),
            max = Math.max(a, b);
        return inclusive ? this >= min && this <= max : this > min && this < max;
    }

    let setup_canvas = document.getElementById('canvas') //getting canvas from document



    let imageNames = ['anchorfish.png', 'clownfish.png', "clamfly.png", 'hogfish.png', 'eyepeller.png', 'pufftacle.png', 'gulperpuffmouth.png', "froggair.png", "pomanatee.png", "nauti.png", "balloonfisher.png", "scuttlefish.png"]
    let plantImages = ['seaweed.png', "bush.png"]
    let imageNamesInv = ['anchorfishi.png', 'clownfishi.png', "clamflyi.png", 'hogfishi.png', 'eyepelleri.png', 'pufftaclei.png ', 'gulperpuffmouth.png', "froggair.png", "pomanatee.png", "nauti.png", "balloonfisher.png", "scuttlefish.png"]
    let predatorMouths = ['gulperpuffmouth.png', 'gulperpuffmouth.png']
    let predatorMouthsInv = ['gulperpuffmouth.png', 'gulperpuffmouth.png']
    let predatorFull = ['gulperpufffull.png', 'gulperpufffull.png']
    let predatorFullInv = ['gulperpufffull.png', 'gulperpufffull.png']

    let scuttlesmall = new Image()
    scuttlesmall.src = "scuttlefishsmall.png"
    class CoordinateSelection {
        constructor(TIP_engine, keysPressed) {
            this.keys = keysPressed
            this.tip = TIP_engine
            this.type = -1
            this.foodflag = 1
            this.tapped = 0
            this.images = []
            this.plantimages = []
            for(let t =0;t<imageNames.length;t++){
                let img = new Image()
                img.src = imageNames[t]
                this.images.push(img)
            }
            for(let t =0;t<plantImages.length;t++){
                let img = new Image()
                img.src = plantImages[t]
                this.plantimages.push(img)
            }
        }
        draw() {


            if (this.tapped == 0) {

                canvas_context.fillStyle = "white"
                canvas_context.fillText("To buy fish/plants/food, you can cycle your selection in the top corner with Q/W/E, and space!", 200, 200)
                canvas_context.fillText("A functioning ecosystem provides income!", 400, 250)
                canvas_context.fillText("Click to place things!", 500, 300)

            }
            canvas_context.fillStyle = "white"
            canvas_context.fillText("Placing: ", 1100, 20)
            if (this.fishflag == 1) {
                this.tapped = 1
                
                let tyep = Math.min(Math.max(this.type, 0), 11)
                this.type = tyep
               this.image = this.images[tyep]
                if (tyep == 11) {
                    canvas_context.drawImage(scuttlesmall, 0, 0, scuttlesmall.height, scuttlesmall.height, 1280 - 96, 0, 96, 96)
                } else if (tyep != 10) {
                    canvas_context.drawImage(this.image, 0, 0, this.image.height, this.image.height, 1280 - 64, 0, 64, 64)
                } else if (tyep == 10) {
                    canvas_context.drawImage(this.image, 0, 0, 48, 96, 1280 - 64, 0, 64, 128)
                }

                canvas_context.fillStyle = "white"
                canvas_context.fillText("Cost: " + ((tyep * 50) + 50), 1100, 40)
            } else if (this.plantflag == 1) {
                this.tapped = 1

                
                let tyep = Math.min(Math.max(this.type, 0), 1)
                this.type = tyep
                this.image = this.plantimages[tyep]
                if (tyep == 1) {
                    canvas_context.drawImage(this.image, 0, 0, 32, 32, 1280 - 64, 0, 64, 64)
                } else if (tyep == 0) {
                    canvas_context.drawImage(this.image, 0, 0, 32, 64, 1280 - 64, 0, 64, 128)
                }
                canvas_context.fillStyle = "white"
                canvas_context.fillText("Cost: " + ((tyep * 50) + 50), 1100, 40)
            } else if (this.foodflag == 1) {
                let circ = new Circle(1280 - 32, 32, 16, "red")
                circ.draw()
                canvas_context.fillStyle = "white"
                canvas_context.fillText("Cost: " + 5, 1100, 40)
            }
        }
        flagSwap() {
            if (keysPressed['q']) {
                this.clearFlags()
                this.fishflag = 1
                this.type++
                if (this.fishflag == 1) {
                    this.type %= 12
                } else if (this.plantflag == 1) {
                    this.type %= 2
                }
            } else if (keysPressed['w']) {
                this.clearFlags()
                this.plantflag = 1
                this.type++
                if (this.fishflag == 1) {
                    this.type %= 12
                } else if (this.plantflag == 1) {
                    this.type %= 2
                }
            } else if (keysPressed['e']) {
                this.clearFlags()
                this.foodflag = 1
                this.type++
                if (this.fishflag == 1) {
                    this.type %= 12
                } else if (this.plantflag == 1) {
                    this.type %= 2
                }
            }
            if (keysPressed[' '] || keysPressed['m']) {
                this.type++
                if (this.fishflag == 1) {
                    this.type %= 12
                } else if (this.plantflag == 1) {
                    this.type %= 2
                }
            }
            if (keysPressed['x']) {
                this.type--
            }
        }
        clearFlags() {
            this.fishflag = -1
            this.plantflag = -1
            // this.type = -1
            this.foodflag = 1
        }
        act() {
            if (this.fishflag == 1) {
                let tyep = Math.min(Math.max(this.type, 0), 11)
                let p = new Animal(this.tip.x, this.tip.y, tyep)
                let wet = 0
                if (tank.money >= (50 + (tyep * 50))) {
                    wet = 1
                    tank.money -= (50 + (tyep * 50))
                }
                if (wet == 1) {
                    tank.animals.push(p)
                }
            } else if (this.plantflag == 1) {
                let tyep = Math.min(Math.max(this.type, 0), 1)
                let p = new Plant(this.tip.x, this.tip.y, tyep)
                let wet = 0
                if (tyep == 0) {
                    if (tank.money >= 50) {
                        wet = 1
                        tank.money -= 50
                    }
                }
                if (tyep == 1) {
                    if (tank.money >= 100) {
                        if (tank.inFloor(this.tip.x)) {
                            wet = 1
                            tank.money -= 100
                        }
                    }
                }
                if (wet == 1) {
                    tank.plants.push(p)
                }
            } else if (this.foodflag == 1) {
                if (!keysPressed['f']) {
                    if (tank.money >= 5) {
                        tank.money -= 5
                        let food = new Food(TIP_engine)
                    }
                } else {
                    if (TIP_engine.xold > -1) {
                        let food = new SuperFood(TIP_engine, new Point(TIP_engine.xold, TIP_engine.yold))
                    }
                }
            }
            // this.clearFlags()

        }
    }


    class Food {
        constructor(point) {
            this.life = 1150
            this.body = new Circle(point.x, point.y, 3, "red")
            this.link = new LineOP(this.body, this.body)
            this.calories = 100
            this.seed = -1
            if (tank.food.length < 200) {
                tank.food.push(this)
            }
            this.weight = 2
        }
        draw() {
            this.life--
            if (this.life <= 0) {
                this.marked = 1
                this.body.marked = 1
                if (this.seed != -1) {
                    if (Math.random() < this.seedrate) {
                        let plant = new Plant(this.body.x, this.body.y, this.seed)

                        let planttype = 0
                        for (let t = 0; t < tank.plants.length; t++) {
                            if (this.seed == tank.plants[t].type) {
                                planttype++
                            }
                        }


                        if (planttype < 200) {
                            if (this.seed == 0) {
                                tank.plants.push(plant)
                            } else {
                                if (tank.inFloor(plant.body.x)) {
                                    tank.plants.push(plant)
                                }
                            }
                        }


                    }
                }
            }
            this.body.draw()
        }
    }


    class SuperFood {
        constructor(point, point2) {
            this.body = castBetween(point, point2, (new LineOP(point, point2)).hypotenuse() / 18, 4)
            this.link = new LineOP(this.body, this.body)
            this.calories = 120
            if (tank.money >= this.body.shapes.length * 6) {
                tank.food.push(this)
                tank.money -= this.body.shapes.length * 6
            }
            this.weight = 2
            this.body.marked = 1
        }
        draw() {
            if (this.body.shapes.length > 0) {
                this.marked = 0
            } else {
                this.marked = 1
            }
            this.body.draw()
            this.body.adjustByFromDisplacement(0, 2.5, 1)
            this.body.adjustByToDisplacement(0, 2.5, 1)
            for (let t = 0; t < this.body.shapes.length; t++) {
                if (this.body.shapes[t].y > canvas.height) {
                    this.body.shapes.splice(t, 1)
                }
            }
        }
    }

    class Animal {
        constructor(x, y, type, predator = 0) {
            this.flightime = 100
            this.activityburst = 0
            this.pdir = 0
            this.size = .5
            this.bump = 0
            this.scount = 0
            this.body = new Circle(x, y, 16, "transparent")
            this.body.reflect = 1
            this.image = new Image()
            this.imagei = new Image()
            this.image.src = imageNames[type]
            this.imagei.src = imageNamesInv[type]
            this.mouthimage = new Image()
            this.mouthimagei = new Image()
            this.mouthimage.src = predatorMouths[predator]
            this.mouthimagei.src = predatorMouthsInv[predator]
            this.fullimage = new Image()
            this.fullimagei = new Image()
            this.fullimage.src = predatorFull[predator]
            this.fullimagei.src = predatorFull[predator]
            this.type = type
            this.dir = 1
            this.xdir = Math.random() - .5
            this.ydir = Math.random() - .5
            this.dirshift = -1
            this.angle = 0
            this.step = 0
            this.count = 0
            this.link = new LineOP(this.body, this.body)
            this.target = this.body
            this.body.marked = 1
            this.hunger = (Math.random() * 40) + 40
            this.hungerstate = 0
            this.dying = -1
            this.angle = Math.random() * 2 * Math.PI
            this.spindir = (Math.random() - .5) / 10
            this.sdir = Math.random() - .5
            this.reprate = .00022 + (this.type / 50000)
            if (this.type == 6) {
                this.reprate = .0000769 //5 //69
            }
            this.age = 0
            this.growthrate = (1.0005 + (this.type / 10000))
            this.agemax = 12000 - (this.type * 200) ///9000
            if (this.type == 6) {
                this.agemax = 14500 + (this.type * 1000)
                this.growthrate = (1.00025 + (this.type / 1000000))
            }

            if (this.type == 7) {
                this.agemax *= 2.033
                this.reprate *= .5
            }
            if (this.type == 8) {
                this.agemax *= 4.05
                this.reprate *= .25
            }
            if (this.type == 9) {
                this.agemax *= 5
                this.reprate *= .198
            }
            if (this.type == 10) {
                this.agemax *= 3
                this.reprate = .0000769 * .59999999 //6219 //5 //69 ////707
            }
            if (this.type == 11) {
                this.agemax *= 10
                this.reprate = .0000769 * .09 //5 //69 ////707
            }

            this.subbody = new Circle(this.body.x, this.body.y + (this.size * 76), 18, "blue")
        }
        draw() {
            if (this.hunger < 50) {
                this.reprate *= .9999
                if (this.type == 6) {
                    this.reprate *= .9999
                }
            }
            if (this.size < 1) {
                this.size *= this.growthrate
                this.body.radius = 16 * this.size
                if (this.predator == 1 || this.type == 7) {
                    this.body.radius = 24 * this.size
                }
                if (this.type == 8) {
                    this.body.radius = 32 * this.size
                }
                if (this.type == 10) {
                    this.body.radius = 32 * this.size
                }
                if (this.type == 11) {
                    this.body.radius = 48 * this.size
                }
            } else {
                this.age++
                if (this.age > this.agemax) {
                    if (Math.random() < (this.reprate * 10)) {
                        this.hunger = -1000
                    }
                }
                if (Math.random() < this.reprate) {
                    if (tank.animals.length < 120 || (tank.animals.length < 131 && (this.type == 6 || this.type == 10)) || (tank.animals.length < 133 && (this.type == 11)) ) {
                        let wet = 0
                        for (let t = 0; t < tank.animals.length; t++) {
                            if (tank.animals[t] != this) {
                                if (tank.animals[t].type == this.type || this.type == 6) {
                                    if (this.hunger > 50) {
                                        wet = 1
                                        break
                                    }
                                }
                            }
                        }
                        if (wet == 1) {
                            let animal = new Animal(this.body.x, this.body.y, this.type)
                            tank.animals.push(animal)
                        }
                    }
                }
            }
            if (Math.random() < .02) {
                this.sdir = (Math.random() - .5) * 3
            }
            if (this.body.y > 704) {
                this.sdir = -2
            }
            let jbreak = 0
            while (this.body.y > 704) {
                jbreak++
                if (jbreak > 1000) {
                    break
                }
                this.body.y--
            }
            if (tank.food.length == 0) {
                this.target = this.body
            }
            if (this.dying > 0) {

                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(-Math.PI)
                canvas_context.translate(-(this.body.x), -(this.body.y))

                //draw
                // if (this.hunger < 20) {
                //     canvas_context.drawImage(this.imagei, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                // } else {
                if (this.body.radius < 8) {
                    this.marked = 1
                } else {
                    if (this.type == 11) {
                        canvas_context.drawImage(this.image, this.step * 96, 0, 96, 96, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                        if (this.body.radius > 16) {
                            this.body.radius *= .99
                        } else {
                            this.body.radius *= .99995 //997
                        }
                        this.body.xmom *= .9
                        this.body.ymom *= .9
                    } else if (this.type == 10) {
                        canvas_context.drawImage(this.image, this.step * 48, 0, 48, 96, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 4)
                        if (this.body.radius > 16) {
                            this.body.radius *= .99
                        } else {
                            this.body.radius *= .99995 //997
                        }
                        this.body.xmom *= .9
                        this.body.ymom *= .9
                    } else if (this.predator != 1 && this.type != 7 && this.type != 8) {
                        canvas_context.drawImage(this.image, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                        this.body.radius *= .9995 //997
                        this.body.xmom *= .9
                        this.body.ymom *= .9
                    } else if (this.type == 8) {
                        canvas_context.drawImage(this.image, this.step * 48, 0, 48, 48, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                        this.body.radius *= .99975 //997
                        this.body.xmom *= .9
                        this.body.ymom *= .9
                    } else {

                        canvas_context.drawImage(this.image, this.step * 48, 0, 48, 48, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                        this.body.radius *= .9997 //997
                        this.body.xmom *= .9
                        this.body.ymom *= .9
                    }
                }
                // }

                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(Math.PI)
                canvas_context.translate(-(this.body.x), -(this.body.y))

                if (this.type == 2) {
                    if (this.body.y < tank.waterline - 16) {
                        this.body.friction = .9
                        this.body.ymom += .3
                        this.body.frictiveMove()
                    } else {
                        let wet = 0
                        if (tank.inFloor(this.body.x)) {
                            wet = 1
                        }
                        if (wet == 1) {
                            if (this.body.ymom > 0) {
                                this.body.ymom *= -.9
                            }
                            this.body.ymom -= .6
                            this.body.frictiveMove()
                        } else {
                            this.body.friction = .9
                            this.body.ymom += .3
                            this.body.frictiveMove()
                            // this.type = -1 //what the heck is this anyway?
                        }
                    }
                } else {
                    if (this.body.y > tank.waterline + 21) {
                        this.body.friction = .9
                        this.body.ymom -= .1
                        this.body.frictiveMove()
                    } else {
                        if (this.body.ymom < 0) {
                            this.body.ymom *= -.9
                        }
                        this.body.ymom += .7
                        this.body.frictiveMove()

                    }
                }
                return

            }
            if (this.type == 0) {

                if (this.step <= 0) {
                    this.step = 16
                }
                if (this.step >= 37) {
                    this.step = 21
                }
                this.weight = 5
                this.tick = 2
                this.think = 10
                this.count++
                let below = 0
                if (this.body.y < tank.waterline + 10) {
                    this.body.y += 1
                }
                if (this.body.y < tank.waterline + 20) {
                    this.body.y += 1
                }
                if (this.count % this.think == 0) {
                    if (this.hunger < 50) {
                        let min = 99999999

                        for (let t = 0; t < tank.food.length; t++) {
                            if (tank.food[t].body.y > tank.waterline) {
                                below = 1
                            } else {
                                if (below == 1) {
                                    continue
                                }
                            }
                        }
                        for (let t = 0; t < tank.food.length; t++) {
                            if (tank.food[t].body.y > tank.waterline) {
                                below = 1
                            } else {
                                if (below == 1) {
                                    continue
                                }
                            }
                            tank.food[t].link.target = this.body
                            if (tank.food[t].body.doesPerimeterTouch(this.body)) {
                                if (tank.food[t].body.shape == 1) {
                                    this.hunger += tank.food[t].calories
                                    tank.food[t].body.shapes.splice(0, 1)
                                    break
                                }
                            }
                            if (min > tank.food[t].link.hypotenuse()) {
                                min = tank.food[t].link.hypotenuse()
                                this.target = tank.food[t].body
                                if (min < 18) {
                                    tank.food[t].marked = 1
                                    tank.food[t].body.marked = 1
                                    this.hunger += tank.food[t].calories
                                    // tank.food[t].body.shapes.splice(0, 1)
                                    // this.hunger%=100
                                }
                                if (Math.sign(this.body.x - tank.food[t].body.x) != this.dir) {
                                    if (this.dirshift <= -10) {
                                        // this.dirshift = 40
                                    }
                                }
                            }
                        }
                    } else {
                        this.body.y += this.sdir
                    }
                    this.hunger -= 1.051 * .15
                }

                if (this.count % this.think == 0) {
                    if (typeof this.target.x != 'undefined') {
                        if (Math.sign(this.body.x - this.target.x) != this.dir) {
                            if (this.dirshift <= -10) {


                                if (this.target.marked != 1) {
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                    this.dirshift = 30
                                } else {
                                    if (Math.random() < .0001) {
                                        this.dirshift = 30
                                    }
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                }
                            }
                        } else {

                            if (this.dirshift <= -10) {


                                if (this.target.marked != 1) {
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                    // this.dirshift = 30
                                } else {
                                    if (Math.random() < .0001) {
                                        this.dirshift = 30
                                    }
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                }
                            }
                        }
                    } else {

                        if (Math.random() < .0001) {
                            this.dirshift = 30
                        }
                        if (this.body.x < 100 || this.body.x > 1180) {
                            this.dirshift = 30
                        }
                    }
                }
                if (typeof this.target.x != 'undefined') {
                    this.vec = new Vector(this.body, this.target.x - this.body.x, this.target.y - this.body.y)
                    this.vec.normalize(2)
                    if (this.target.y < tank.waterline) {
                        this.vec.ymom *= .1
                    }
                    if (this.vec.ymom > 0 || this.vec.ymom < 0) {
                        if (this.body.y > tank.waterline + 16) {
                            if (isNaN(this.vec.ymom)) {

                            } else {
                                this.body.y += this.vec.ymom
                            }
                        } else if (this.body.y > 704) {
                            this.body.y -= 2.1
                        } else {
                            this.body.y += 2.1
                        }
                    }
                } else {
                    if (this.body.y > tank.waterline + 16) {
                    } else if (this.body.y > 704) {
                        this.body.y -= 2.1
                    } else {
                        this.body.y += 2.1
                    }
                }
                if (this.hunger < 20) {
                    canvas_context.drawImage(this.imagei, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                } else {
                    canvas_context.drawImage(this.image, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                }
                if (this.dirshift == 1) {
                    this.dir *= -1
                    this.dirshift--
                } else {
                    if (this.dirshift <= 0) {
                        if (this.count % this.tick == 0) {
                            this.step++
                            this.body.x -= this.dir
                        }
                        if (this.dir == -1) {
                            this.step -= 21
                            this.step %= 16
                            this.step += 21
                        } else {
                            this.step %= 16
                        }
                        this.dirshift--
                    } else {
                        if (this.dirshift == 16) {
                            if (this.dir == -1) {
                                this.step = 21
                            } else {
                                this.step = 17
                            }
                        }
                        if (this.dirshift % 4 == 0) {
                            this.step += this.dir
                        }
                        this.dirshift--
                    }
                }
            }
            if (this.type == 1) {
                //fish clown
                this.weight = 2
                if (this.step <= 0) {
                    this.step = 21
                }
                if (this.step >= 78) {
                    this.step = 29
                }
                this.tick = 2
                this.think = 10
                this.count++
                let below = 0
                if (this.body.y < tank.waterline + 10) {
                    this.body.y += 1
                }
                if (this.body.y < tank.waterline + 20) {
                    this.body.y += 1
                }
                if (this.count % this.think == 0) {
                    if (this.hunger < 50) {
                        let min = 99999999

                        for (let t = 0; t < tank.food.length; t++) {
                            if (tank.food[t].body.y > tank.waterline) {
                                below = 1
                            } else {
                                if (below == 1) {
                                    continue
                                }
                            }
                        }
                        for (let t = 0; t < tank.food.length; t++) {
                            if (tank.food[t].body.y > tank.waterline) {
                                below = 1
                            } else {
                                if (below == 1) {
                                    continue
                                }
                            }
                            tank.food[t].link.target = this.body
                            if (tank.food[t].body.doesPerimeterTouch(this.body)) {
                                if (tank.food[t].body.shape == 1) {
                                    this.hunger += tank.food[t].calories
                                    tank.food[t].body.shapes.splice(0, 1)
                                    break
                                }
                            }
                            if (min > tank.food[t].link.hypotenuse()) {
                                min = tank.food[t].link.hypotenuse()
                                this.target = tank.food[t].body
                                if (min < 18) {
                                    tank.food[t].marked = 1
                                    this.hunger += tank.food[t].calories
                                    // tank.food[t].body.shapes.splice(0, 1)
                                    // this.hunger%=100
                                }
                            }
                        }
                    } else {
                        this.body.y += this.sdir
                    }
                    this.hunger -= 1.051 * .161
                }

                if (this.count % this.think == 0) {
                    if (typeof this.target.x != 'undefined') {
                        if (Math.sign(this.body.x - this.target.x) != this.dir) {
                            if (this.dirshift <= -10) {


                                if (this.target.marked != 1) {
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                    if (this.hunger < 50) {
                                        this.dirshift = 30
                                    }
                                } else {
                                    if (Math.random() < .00051) {
                                        this.dirshift = 30
                                    }
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                }
                            }
                        } else {
                            if (this.dirshift <= -10) {


                                if (this.target.marked != 1) {
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                    // this.dirshift = 30
                                } else {
                                    if (Math.random() < .00051) {
                                        this.dirshift = 30
                                    }
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if (Math.random() < .00051) {
                            this.dirshift = 30
                        }
                        if (this.body.x < 100 || this.body.x > 1180) {
                            this.dirshift = 30
                        }
                    }
                }
                if (typeof this.target.x != 'undefined') {
                    this.vec = new Vector(this.body, this.target.x - this.body.x, this.target.y - this.body.y)
                    this.vec.normalize(2)
                    if (this.target.y < tank.waterline) {
                        this.vec.ymom *= .1
                    }
                    if (this.vec.ymom > 0 || this.vec.ymom < 0) {
                        if (this.body.y > tank.waterline + 16) {
                            if (isNaN(this.vec.ymom)) {

                            } else {
                                this.body.y += this.vec.ymom
                            }
                        } else if (this.body.y > 704) {
                            this.body.y -= 2.1
                        } else {
                            this.body.y += 2.1
                        }
                    }
                } else {
                    if (this.body.y > tank.waterline + 16) {
                    } else if (this.body.y > 704) {
                        this.body.y -= 2.1
                    } else {
                        this.body.y += 2
                    }
                }
                if (this.hunger < 20) {
                    canvas_context.drawImage(this.imagei, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                } else {
                    canvas_context.drawImage(this.image, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                }
                // console.log(this.step)
                if (this.dirshift == 1) {
                    this.dir *= -1
                    this.dirshift = -3
                } else {
                    if (this.dirshift <= 0) {
                        if (this.count % this.tick == 0) {
                            this.step++
                            this.step %= 78
                            this.body.x -= this.dir * 2
                        }
                        if (this.dir == 1) {
                            this.step -= 78 - 21
                            this.step %= 21
                            this.step += 78 - 21
                        } else {
                            this.step %= 21
                        }
                        this.dirshift--
                    } else {
                        if (this.dirshift == 20) {
                            if (this.dir == -1) {
                                this.step = 23
                            } else {
                                this.step = 29
                            }
                        }
                        if (this.dirshift % 4 == 0) {
                            this.step -= this.dir
                            if (this.step <= 0) {
                                this.step = 23
                            }
                            this.step %= 78
                        }
                        this.dirshift--
                    }
                }
            }
            if (this.type == 2) {
                //clammoth
                this.hunger -= 1.051 * .019 //003 //009
                this.weight = .9
                this.step++
                if (this.hunger > 50) {
                    this.step -= 22
                    this.step %= 14
                    this.step += 22
                } else {
                    if (this.step > 5) {
                        this.step %= 12
                        this.step += 4
                    }
                }

                if (this.hunger < 20) {
                    canvas_context.drawImage(this.imagei, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                } else {
                    canvas_context.drawImage(this.image, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                }


                let below = 0
                // if(this.body.y < tank.waterline+10){
                //     this.body.y+=1
                // }
                // if(this.body.y < tank.waterline+20){
                //     this.body.y+=1
                // }
                let wet = 0
                let h = -1
                for (let k = 0; k < tank.floors.length; k++) {
                    if (tank.floors[k].doesPerimeterTouch(this.body)) {
                        wet = 1
                        h = k
                    }
                }
                if (wet == 0) {
                    if (this.hunger < 50) {
                        if (this.hungerstate == 0) {
                            this.step = 0
                            this.hungerstate = 1
                        }
                        let min = 99999999
                        for (let t = 0; t < tank.food.length; t++) {
                            if (tank.food[t].body.y < tank.waterline) {
                                if (this.body.y > tank.waterline) {
                                    break
                                }
                                below = 1
                            } else {
                                if (below == 1) {
                                    continue
                                }
                            }
                        }
                        for (let t = 0; t < tank.food.length; t++) {
                            if (tank.food[t].body.y < tank.waterline) {
                                if (this.body.y > tank.waterline) {
                                } else {
                                    below = 1
                                }
                            } else {
                                if (below == 1) {
                                    continue
                                }
                            }

                            if (below == 0) {
                                if (this.body.y < tank.waterline) {
                                    if (Math.abs(this.body.xmom) < 5) {
                                        this.body.xmom *= 1.1
                                    }
                                } else {
                                    if (Math.abs(this.body.xmom) < 5) {
                                        this.body.xmom *= 1.001
                                    }
                                }
                            }
                            tank.food[t].link.target = this.body
                            if (tank.food[t].body.doesPerimeterTouch(this.body)) {
                                if (tank.food[t].body.shape == 1) {
                                    this.hunger += tank.food[t].calories
                                    tank.food[t].body.shapes.splice(0, 1)
                                    break
                                }
                            }
                            if (min > tank.food[t].link.hypotenuse()) {
                                min = tank.food[t].link.hypotenuse()
                                this.target = tank.food[t].body

                                if (this.body.y > tank.waterline) {
                                    this.xdir = (tank.food[t].body.x - this.body.x) * 1.5
                                    this.ydir = (tank.food[t].body.y - this.body.y) * 1.5
                                    this.xdir /= tank.food[t].link.hypotenuse()
                                    this.ydir /= tank.food[t].link.hypotenuse()
                                } else {
                                    this.xdir = (tank.food[t].body.x - this.body.x) * 3
                                    this.ydir = (tank.food[t].body.y - this.body.y) * 3
                                    this.xdir /= tank.food[t].link.hypotenuse()
                                    this.ydir /= tank.food[t].link.hypotenuse()
                                }

                                if (min < 18) {
                                    tank.food[t].marked = 1
                                    this.hunger += tank.food[t].calories
                                    // tank.food[t].body.shapes.splice(0, 1)
                                    // this.hunger%=100
                                    this.hungerstate = 0
                                }
                            }
                        }
                    }
                    if (Math.random() < .02) {
                        this.xmom = Math.sign(Math.random() - .5)
                        if (this.body.y < tank.waterline) {
                            this.xdir = Math.random() - .5
                            this.ydir = Math.random() - .5
                        } else {
                            this.xdir = Math.random() - .5
                            if (Math.random() < .5) {
                                this.ydir = Math.abs(Math.random() - .5) * -2
                            } else {
                                this.ydir = Math.random() - .5
                            }

                        }
                    }
                    if (this.body.y < tank.waterline) {
                        this.body.x += this.xdir
                        if (this.body.y < 700) {
                            if (this.body.y > 10) {
                                this.body.y += this.ydir
                            } else {
                                this.body.y += 3
                            }
                        } else {
                            this.body.y -= 3
                        }
                    } else {
                        this.body.x += (this.xdir * .5)
                        if (this.body.y < 700) {
                            if (this.body.y > 10) {
                                this.body.y += (this.ydir * .5)
                            } else {
                                this.body.y += 3
                            }
                        } else {
                            this.body.y -= 3
                        }
                    }




                    if (this.body.x < 1280) {
                        if (this.body.x > 10) {
                            if (this.body.y < tank.waterline) {
                                this.body.x += this.xdir
                            } else {
                                this.body.x += this.xdir * .5
                            }
                        } else {
                            this.body.x += 3
                        }
                    } else {
                        this.body.x -= 3
                    }
                } else {
                    if (this.body.x > (tank.floors[h].x - 8) && this.body.x < (tank.floors[h].x + tank.floors[h].width) + 8) {
                        if (this.body.y > tank.waterline) {
                            let jbreak = 0
                            while (tank.floors[h].doesPerimeterTouch(this.body)) {

                                jbreak++
                                if (jbreak > 1000) {
                                    break
                                }
                                this.body.y += .1
                                this.ydir = Math.abs(this.ydir)
                            }
                        } else {
                            let jbreak = 0
                            while (tank.floors[h].doesPerimeterTouch(this.body)) {

                                jbreak++
                                if (jbreak > 1000) {
                                    break
                                }
                                this.body.y -= .1
                                this.ydir = -Math.abs(this.ydir)
                            }
                        }
                    }

                    if (h == 0) {
                        if (this.body.y > tank.waterline) {
                            this.body.y++
                        } else {
                            this.body.y--
                        }
                        this.body.x += 1
                        this.body.xmom += .05

                        this.body.friction = .95
                    }

                    if (h == 1) {
                        if (this.body.x > (tank.floors[h].x + (tank.floors[h].width * .5))) {

                            if (this.body.y > tank.waterline) {
                                this.body.y++
                            } else {
                                this.body.y--
                            }
                            this.body.x += 1
                            this.body.xmom += .05

                            this.body.friction = .95
                        } else {
                            if (this.body.y > tank.waterline) {
                                this.body.y++
                            } else {
                                this.body.y--
                            }
                            this.body.x -= 1
                            this.body.xmom -= .05

                            this.body.friction = .95

                        }
                    }


                    if (h == 2) {
                        if (this.body.y > tank.waterline) {

                            this.body.y++
                        } else {

                            this.body.y--
                        }
                        this.body.x -= 1
                        this.body.xmom -= .05

                        this.body.friction = .95
                    }
                }
                this.body.frictiveMove()

            }
            if (this.type == 3) {

                this.weight = 3
                if (this.step <= 0) {
                    this.step = 28
                }
                if (this.step >= 64) {
                    this.step = 36
                }
                this.tick = 2
                this.think = 10
                this.count++
                let below = 0

                if (this.body.y < tank.waterline + 10) {
                    this.body.y += 1
                }
                if (this.body.y < tank.waterline + 20) {
                    this.body.y += 1
                }
                if (this.count % this.think == 0) {
                    if (this.hunger < 50) {
                        let min = 99999999

                        for (let t = 0; t < tank.food.length; t++) {
                            if (tank.food[t].body.y > tank.waterline) {
                                below = 1
                            } else {
                                if (below == 1) {
                                    continue
                                }
                            }
                        }
                        for (let t = 0; t < tank.food.length; t++) {
                            if (tank.food[t].body.y > tank.waterline) {
                                below = 1
                            } else {
                                if (below == 1) {
                                    continue
                                }
                            }
                            tank.food[t].link.target = this.body
                            if (tank.food[t].body.doesPerimeterTouch(this.body)) {
                                if (tank.food[t].body.shape == 1) {
                                    this.hunger += tank.food[t].calories
                                    tank.food[t].body.shapes.splice(0, 1)
                                    break
                                }
                            }
                            if (min > tank.food[t].link.hypotenuse()) {
                                min = tank.food[t].link.hypotenuse()
                                this.target = tank.food[t].body
                                if (min < 18) {
                                    tank.food[t].marked = 1
                                    this.hunger += tank.food[t].calories
                                    // tank.food[t].body.shapes.splice(0, 1)
                                    // this.hunger%=100
                                }
                            }
                        }
                    } else {
                        this.body.y += this.sdir
                    }
                    this.hunger -= 1.051 * .105 //07
                }

                if (this.count % this.think == 0) {
                    if (typeof this.target.x != 'undefined') {
                        if (Math.sign(this.body.x - this.target.x) != this.dir) {
                            if (this.dirshift <= -10) {


                                if (this.target.marked != 1) {
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                    this.dirshift = 30
                                } else {
                                    if (Math.random() < .0001) {
                                        this.dirshift = 30
                                    }
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                }
                            }
                        } else {
                            if (this.dirshift <= -10) {


                                if (this.target.marked != 1) {
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                    // this.dirshift = 30
                                } else {
                                    if (Math.random() < .0001) {
                                        this.dirshift = 30
                                    }
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if (Math.random() < .0001) {
                            this.dirshift = 30
                        }
                        if (this.body.x < 100 || this.body.x > 1180) {
                            this.dirshift = 30
                        }
                    }
                }
                if (typeof this.target.x != 'undefined') {
                    this.vec = new Vector(this.body, this.target.x - this.body.x, this.target.y - this.body.y)
                    this.vec.normalize(.8)
                    if (this.target.y < tank.waterline) {
                        this.vec.ymom *= .1
                    }
                    if (this.vec.ymom > 0 || this.vec.ymom < 0) {
                        if (this.body.y > tank.waterline + 16) {
                            if (isNaN(this.vec.ymom)) {

                            } else {
                                this.body.y += this.vec.ymom
                            }
                        } else if (this.body.y > 704) {
                            this.body.y -= 2.1
                        } else {
                            this.body.y += 2.1
                        }
                    }
                } else {
                    if (this.body.y > tank.waterline + 16) {
                    } else {
                        this.body.y += 2
                    }
                }
                if (this.hunger < 20) {
                    canvas_context.drawImage(this.imagei, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                } else {
                    canvas_context.drawImage(this.image, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                }
                // console.log(this.step)
                if (this.dirshift == 1) {
                    this.dir *= -1
                    this.dirshift = -3
                } else {
                    if (this.dirshift <= 0) {
                        if (this.count % this.tick == 0) {
                            this.step++
                            this.step %= 64
                            this.body.x -= this.dir * .7
                        }
                        if (this.dir == 1) {
                            this.step -= 64 - 20
                            this.step %= 20
                            this.step += 64 - 20
                        } else {
                            this.step %= 28
                        }
                        this.dirshift--
                    } else {
                        if (this.dirshift == 20) {
                            if (this.dir == -1) {
                                this.step = 28
                            } else {
                                this.step = 36
                            }
                        }
                        if (this.dirshift % 4 == 0) {
                            this.step -= this.dir
                            if (this.step <= 0) {
                                this.step = 28
                            }
                            this.step %= 64
                        }
                        this.dirshift--
                    }
                }
            }
            if (this.type == 4) {
                this.weight = 1.4
                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))

                this.scount += 1
                if (this.scount >= 4) {
                    this.scount = 0
                    this.step++
                    this.step %= 49
                }
                if (this.hunger < 20) {
                    canvas_context.drawImage(this.imagei, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                } else {
                    canvas_context.drawImage(this.image, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                }

                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(-this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))

                let below = 0
                if (this.body.y < tank.waterline + 10) {
                    this.body.y += 1
                }
                if (this.body.y < tank.waterline + 20) {
                    this.body.y += 1
                }
                if (this.hunger < 50) {
                    let min = 99999999

                    for (let t = 0; t < tank.food.length; t++) {
                        if (tank.food[t].body.y > tank.waterline) {
                            below = 1
                            this.scount += 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                    }
                    for (let t = 0; t < tank.food.length; t++) {
                        if (tank.food[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                        tank.food[t].link.target = this.body
                        if (tank.food[t].body.doesPerimeterTouch(this.body)) {
                            if (tank.food[t].body.shape == 1) {
                                this.hunger += tank.food[t].calories
                                tank.food[t].body.shapes.splice(0, 1)
                                break
                            }
                        }
                        if (min > tank.food[t].link.hypotenuse()) {
                            min = tank.food[t].link.hypotenuse()
                            this.target = tank.food[t].body
                            this.angle = tank.food[t].link.angle() + (Math.PI / 2)
                            // if(this.bump != 0){
                            this.angle += (Math.PI / 2) * this.bump
                            // }
                            if (min < 18) {
                                tank.food[t].marked = 1
                                this.hunger += tank.food[t].calories
                                // tank.food[t].body.shapes.splice(0, 1)
                            }
                        }
                    }
                }



                this.body.x -= Math.cos(this.angle + (Math.PI / 2))
                this.body.y -= Math.sin(this.angle + (Math.PI / 2))
                this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * below
                this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * below
                if (this.body.x < 10) {
                    this.body.x++
                }
                if (this.body.x > 1270) {
                    this.body.x--
                }

                if (this.body.y < tank.waterline + 50) {
                    this.angle += this.spindir
                    if (this.body.y < tank.waterline + 50) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 40) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 30) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 20) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 15) {
                        this.body.y += 1
                    }
                    if (this.body.y < tank.waterline + 10) {
                        this.body.y += 1
                    }
                } else if (this.body.y > 700) {
                    this.angle += this.spindir
                    this.body.y--
                } else {

                    if (Math.random() < .1) {
                        this.angle += this.spindir
                    }

                    if (Math.random() < .07) {
                        this.spindir = (Math.random() - .5) / 10
                    }

                }
                this.hunger -= 1.051 * .02 //01
            }
            if (this.type == 5) {
                this.weight = 1.4


                let below = 0
                if (this.body.y < tank.waterline + 10) {
                    this.body.y += 1
                }
                if (this.body.y < tank.waterline + 20) {
                    this.body.y += 1
                }
                if (this.hunger < 50) {
                    let min = 99999999

                    for (let t = 0; t < tank.food.length; t++) {
                        if (tank.food[t].body.y > tank.waterline) {
                            below = 1
                            this.scount += 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                    }
                    for (let t = 0; t < tank.food.length; t++) {
                        if (tank.food[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                        tank.food[t].link.target = this.body
                        if (tank.food[t].body.doesPerimeterTouch(this.body)) {
                            if (tank.food[t].body.shape == 1) {
                                this.hunger += tank.food[t].calories
                                tank.food[t].body.shapes.splice(0, 1)
                                break
                            }
                        }
                        if (min > tank.food[t].link.hypotenuse()) {
                            min = tank.food[t].link.hypotenuse()
                            this.target = tank.food[t].body
                            this.angle = tank.food[t].link.angle() + (Math.PI / 2)
                            // if(this.bump != 0){
                            this.angle += (Math.PI / 2) * this.bump
                            // }
                            if (min < 18) {
                                tank.food[t].marked = 1
                                this.hunger += tank.food[t].calories
                                // tank.food[t].body.shapes.splice(0, 1)
                            }
                        }
                    }
                }

                this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * below * Math.abs(Math.cos(this.scount / 20) - .1) * 2.5
                this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * below * Math.abs(Math.cos(this.scount / 20) - .1) * 2.5

                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))
                this.scount += 1
                if (below == 1) {
                    this.scount = 0
                    this.step++
                    this.step %= 22
                } else {
                    if (this.scount == 4) {
                        this.scount = 0
                        this.step++
                        this.step %= 22
                    }
                }
                if (this.hunger < 20) {
                    canvas_context.drawImage(this.imagei, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                } else {
                    canvas_context.drawImage(this.image, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                }

                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(-this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))

                this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * .3
                this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * .3
                if (this.body.x < 10) {
                    this.body.x++
                }
                if (this.body.x > 1270) {
                    this.body.x--
                }
                if (this.body.y < tank.waterline + 50) {
                    this.angle += this.spindir
                    if (this.body.y < tank.waterline + 50) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 40) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 30) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 20) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 15) {
                        this.body.y += 1
                    }
                    if (this.body.y < tank.waterline + 10) {
                        this.body.y += 1
                    }
                } else if (this.body.y > 700) {
                    this.angle += this.spindir
                    this.body.y--
                } else {

                    if (Math.random() < .04) {
                        this.angle += this.spindir
                    }

                    if (Math.random() < .04) {
                        this.spindir = (Math.random() - .5) / 2
                    }

                }
                this.hunger -= 1.051 * .005 //002
            }

            if (this.type == 6) {

                if (this.step <= 0) {
                    this.step = 0
                }
                if (Math.random() < .01) {
                    this.pdir = Math.random() - .5
                }

                this.body.y += this.pdir
                // if (this.step >= 37) {
                //     this.step = 9
                // }
                this.weight = 12
                this.predator = 1
                this.tick = 2
                this.think = 10
                this.count++
                let below = 0
                if (this.body.y < tank.waterline + 40) {
                    this.body.y += 1.1
                }
                if (this.body.y < tank.waterline + 50) {
                    this.body.y += 1.1
                }
                if (this.body.y < tank.waterline + 30) {
                    this.body.y += 1.1
                }
                if (this.count % this.think == 0) {
                    if (this.hunger < 50) {
                        if (this.hungerstate == 0) {
                            if (this.dir == 1) {
                                this.mouthdir = 0
                            } else if (this.dir != 1) {
                                this.mouthdir = 22
                            }
                        }
                        this.hungerstate = 1
                        let min = 99999999

                        for (let t = 0; t < tank.animals.length; t++) {
                            if (tank.animals[t].type == 9) {
                                continue
                            }
                            if (this == tank.animals[t] || tank.animals[t].body.radius >= 16) {
                                continue
                            }
                            if (tank.animals[t].body.y > tank.waterline) {
                                below = 1
                            } else {
                                if (below == 1) {
                                    continue
                                }
                            }
                        }
                        let wet = 0
                        for (let t = 0; t < tank.animals.length; t++) {
                            if (this == tank.animals[t] || tank.animals[t].body.radius >= 16) {
                                continue
                            }
                            if (tank.animals[t].body.y > tank.waterline) {
                                below = 1
                            } else {
                                if (below == 1) {
                                    continue
                                }
                            }
                            tank.animals[t].link.target = this.body
                            if (min > tank.animals[t].link.hypotenuse()) {
                                min = tank.animals[t].link.hypotenuse()
                                this.target = tank.animals[t].body
                                this.ypdir = Math.sign(this.target.y - this.body.y) * 2
                                if (min < 42) {
                                    tank.animals[t].dying = 1
                                    tank.animals[t].body.radius = .1
                                    tank.animals[t].hunger = -100
                                    tank.animals[t].body.marked = 1
                                    tank.animals[t].marked = 1
                                    this.hunger += 400//tank.animals[t].calories
                                    // tank.animals[t].body.shapes.splice(0, 1)
                                    // this.hunger%=100
                                }
                            }
                        }
                        if (Math.sign(this.body.x - this.target.x) != this.dir) {
                            if (this.dirshift <= -10) {
                                this.dirshift = 40
                            }
                        }
                    } else {
                        this.body.y += (this.sdir * 1)
                        this.hungerstate = 0
                        this.mouthdir = 0
                    }
                    this.hunger -= 1.051 * .5 //.25
                    // console.log(this.hunger)
                }

                if (this.count % this.think == 0) {
                    if (typeof this.target.x != 'undefined') {
                        if (Math.sign(this.body.x - this.target.x) != this.dir) {
                            if (this.dirshift <= -10) {


                                if (this.target.marked != 1) {
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                    // this.dirshift = 30
                                } else {
                                    if (Math.random() < .0001) {
                                        this.dirshift = 30
                                    }
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                }
                            }
                        } else {

                            if (this.dirshift <= -10) {


                                if (this.target.marked != 1) {
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                    // this.dirshift = 30
                                } else {
                                    if (Math.random() < .0001) {
                                        this.dirshift = 30
                                    }
                                    if (this.body.x < 100 || this.body.x > 1180) {
                                        if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                            this.dirshift = 30
                                        }
                                    }
                                }
                            }
                        }
                    } else {

                        if (Math.random() < .0001) {
                            this.dirshift = 30
                        }
                        if (this.body.x < 100 || this.body.x > 1180) {
                            if ((this.dir == -1 && this.body.x > 1240) || (this.dir == 1 && this.body.x < 40)) {
                                this.dirshift = 30
                            }
                        }
                    }
                }
                if (typeof this.ypdir != 'undefined') {
                    this.body.y += this.ypdir
                    this.ypdir *= .99

                    // this.vec = new Vector(this.body, this.target.x - this.body.x, this.target.y - this.body.y)
                    // this.vec.normalize(3)
                    // // if (this.target.y < tank.waterline) {
                    // //     this.vec.ymom *= .1
                    // // }
                    // if (this.vec.ymom > 0 || this.vec.ymom < 0) {
                    //     if (this.body.y > tank.waterline + 24) {
                    //         if (isNaN(this.vec.ymom)) {
                    //             this.body.y += Math.sign(this.target.y - this.body.y) * 2
                    //         } else {
                    //             // console.log("Dd")
                    //             this.body.y += this.vec.ymom
                    //         }
                    //     } else if (this.body.y > 696) {
                    //         this.body.y -= 2.1
                    //     } else {
                    //         this.body.y += Math.sign(this.target.y - this.body.y) * 2
                    //     }
                    // } else {
                    //     this.body.y += Math.sign(this.target.y - this.body.y) * 2
                    // }
                } else {
                    if (this.body.y > tank.waterline + 24) {
                    } else if (this.body.y > 696) {
                        this.body.y -= 2.1
                    } else {
                        // this.body.y += 2.1
                    }
                }
                if (this.hungerstate == 1) {
                    if (this.dir == -1) {
                        this.mouthdir++
                        if (this.mouthdir > 10) {
                            this.mouthdir = 10
                        }
                    } else {
                        this.mouthdir--
                        if (this.mouthdir < 11) {
                            this.mouthdir = 11
                        }
                    }
                    this.step = this.mouthdir
                    if (this.hunger < 20) {
                        canvas_context.drawImage(this.mouthimagei, this.step * 48, 0, 48, 48, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                    } else {
                        canvas_context.drawImage(this.mouthimage, this.step * 48, 0, 48, 48, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                    }
                } else {
                    if (this.hunger < 220) {
                        if (this.dir == -1) {
                            this.step = 0
                        } else {
                            this.step = 21
                        }
                        if (this.hunger < 20) {
                            canvas_context.drawImage(this.imagei, this.step * 48, 0, 48, 48, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                        } else {
                            canvas_context.drawImage(this.image, this.step * 48, 0, 48, 48, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                        }
                    } else {
                        if (this.dir == -1) {
                            this.step = 0
                        } else {
                            this.step = 1
                        }
                        if (this.hunger < 20) {
                            canvas_context.drawImage(this.fullimage, this.step * 48, 0, 48, 48, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                        } else {
                            canvas_context.drawImage(this.fullimagei, this.step * 48, 0, 48, 48, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                        }

                    }
                }
                if (this.dirshift == 1) {
                    this.dir *= -1
                    this.dirshift--
                } else {
                    if (this.dirshift <= 0) {
                        if (this.count % this.tick == 0) {
                            if (this.hungerstate == 1) {
                                this.step = this.mouthdir
                            } else {
                                this.step = 0
                                // this.step++
                            }
                            this.body.x -= this.dir
                            if (this.hungerstate >= 1) {
                                this.body.x -= this.dir * 3.1
                            }
                        }
                        if (this.dir == 1) {
                            this.step -= 11
                            this.step %= 11
                            this.step += 11
                        } else {
                            this.step %= 11
                        }
                        this.dirshift--
                    } else {
                        this.dirshift--
                    }
                }
            }


            if (this.type == 7) {
                this.weight = 7.4
                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))
                this.think = 10
                this.count++
                if (Math.random() < .005) {
                    this.activityburst = 1
                }



                this.scount += 1
                if (this.scount >= 3) {
                    if (this.hunger < 70) {
                        if (this.hunger < 50) {
                            if (this.scount >= 6) {
                                this.step++
                                this.scount = 0
                            }
                        } else if (this.hunger < 60) {
                            if (this.scount >= 5) {
                                this.step++
                                this.scount = 0
                            }
                        } else if (this.hunger < 70) {
                            if (this.scount >= 4) {
                                this.step++
                                this.scount = 0
                            }
                        }
                    } else {
                        if (this.scount >= 300 || this.activityburst == 1) {
                            this.step++
                            this.scount = 0
                            if (Math.random() < .1) {
                                this.activityburst = 0
                            }
                        }
                    }
                    this.step %= 82
                }
                if (this.hunger < 20) {
                    canvas_context.drawImage(this.imagei, this.step * 48, 0, 48, 48, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                } else {
                    canvas_context.drawImage(this.image, this.step * 48, 0, 48, 48, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                }

                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(-this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))

                let below = 0
                if (this.body.y < tank.waterline + 10) {
                    this.body.y += 1
                }
                if (this.body.y < tank.waterline + 20) {
                    this.body.y += 1
                }


                if (this.hunger < 70 || this.activityburst == 1) {
                    let dif = Math.max(this.hunger - 50, 1)
                    let mag = (20 - dif) / 20
                    if (this.activityburst == 1) {
                        mag = .5
                    }

                    let dry = 0
                    if (this.hunger < 50) {
                        if (!tank.inFloor(this.body.x)) {
                            let wet = 0
                            for (let e = 0; e < tank.animals.length; e++) {
                                if (tank.animals[e].type == 2 && tank.animals[e].body.y < tank.waterline) {
                                    wet = 1
                                    break
                                }
                            }
                            if (wet == 1) {
                                if (below != 1) {
                                    dry = 1
                                }
                                if (this.activityburst == 1) {
                                    dry = 1
                                }
                            }
                        }
                    }

                    if (dry == 1 && this.flightime > 90 || this.body.y < tank.waterline) {
                        let point = new Point(this.body.x + ((Math.random() - .5) * 20), this.body.y - 100)
                        this.angle = (new LineOP(point, this.body)).angle() + (Math.PI / 2)
                        // mag *= 10
                        if (this.body.y < tank.waterline) {
                            this.flightime--
                        }
                        if (this.flightime > 0) {
                            mag = this.flightime / 18
                            this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * mag
                            this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * mag
                            this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * 1 * mag
                            this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * 1 * mag
                        }
                    } else {

                        // if(this.flightime < 50){
                        //     let point = new Point(this.body.x + ((Math.random() - .5) * 20), this.body.y + 100)
                        //     this.angle = (new LineOP(point, this.body)).angle() - (Math.PI / 2)
                        // }
                        this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * mag
                        this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * mag
                        this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * below * mag
                        this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * below * mag
                    }
                }



                // if (this.count % this.think == 0) {
                if (this.hunger < 50) {
                    if (this.hungerstate == 0) {
                        if (this.dir == 1) {
                            this.mouthdir = 0
                        } else if (this.dir != 1) {
                            this.mouthdir = 22
                        }
                    }
                    this.hungerstate = 1
                    let min = 99999999

                    for (let t = 0; t < tank.animals.length; t++) {
                        if (2 != tank.animals[t].type) {
                            continue
                        }
                        if (this == tank.animals[t] || tank.animals[t].body.radius >= 17) {
                            continue
                        }
                        if (tank.animals[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                    }
                    for (let t = 0; t < tank.animals.length; t++) {

                        if (2 != tank.animals[t].type) {
                            continue
                        }
                        if (this == tank.animals[t] || tank.animals[t].body.radius >= 17) {
                            continue
                        }
                        if (tank.animals[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                        tank.animals[t].link.target = this.body
                        if (min > tank.animals[t].link.hypotenuse()) {
                            min = tank.animals[t].link.hypotenuse()
                            this.target = tank.animals[t].body
                            this.ypdir = Math.sign(this.target.y - this.body.y) * 2
                            this.angle = tank.animals[t].link.angle() + (Math.PI / 2)
                            // if(this.bump != 0){
                            this.angle += (Math.PI / 2) * this.bump
                            if (this.body.doesPerimeterTouch(this.target)) {
                                tank.animals[t].dying = 1
                                tank.animals[t].body.radius = .1
                                tank.animals[t].hunger = -100
                                tank.animals[t].body.marked = 1
                                tank.animals[t].marked = 1
                                this.hunger += 200//tank.animals[t].calories
                                // tank.animals[t].body.shapes.splice(0, 1)
                                // this.hunger%=100
                            }
                            if (Math.sign(this.body.x - tank.animals[t].body.x) != this.dir) {
                                if (this.dirshift <= -10) {
                                    this.dirshift = 40
                                }
                            }
                        }
                    }
                } else {
                    this.body.y += (this.sdir * 1)
                    this.hungerstate = 0
                    this.mouthdir = 0
                }


                if (this.hunger < 40) { //25 leads to low reproduction
                    let min = 99999999

                    for (let t = 0; t < tank.food.length; t++) {
                        if (tank.food[t].body.y > tank.waterline) {
                            below = 1
                            this.scount += 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                    }
                    for (let t = 0; t < tank.food.length; t++) {
                        if (tank.food[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                        tank.food[t].link.target = this.body
                        if (tank.food[t].body.doesPerimeterTouch(this.body)) {
                            if (tank.food[t].body.shape == 1) {
                                this.hunger += tank.food[t].calories
                                tank.food[t].body.shapes.splice(0, 1)
                                break
                            }
                        }
                        if (min > tank.food[t].link.hypotenuse()) {
                            min = tank.food[t].link.hypotenuse()
                            this.target = tank.food[t].body
                            this.angle = tank.food[t].link.angle() + (Math.PI / 2)
                            // if(this.bump != 0){
                            this.angle += (Math.PI / 2) * this.bump
                            // }
                            if (min < this.body.radius * 1.25) {
                                tank.food[t].marked = 1
                                this.hunger += tank.food[t].calories
                                // tank.food[t].body.shapes.splice(0, 1)
                            }
                        }
                    }
                }
                // this.hunger -= 1.051*.5 //.25
                // console.log(this.hunger)
                // }




                if (this.body.y > tank.waterline) {
                    this.flightime += 2
                }
                if (this.flightime > 100) {
                    this.flightime = 100
                }
                if (this.body.x < 5) {
                    this.body.x++
                }
                if (this.body.x < 10) {
                    this.body.x++
                }
                if (this.body.x > 1270) {
                    this.body.x--
                }
                if (this.body.x > 1275) {
                    this.body.x--
                }

                if (this.body.y < tank.waterline + 50) {
                    this.angle += this.spindir
                    if (this.body.y < tank.waterline + 50) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 40) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 30) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 20) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 15) {
                        this.body.y += 1
                    }
                    if (this.body.y < tank.waterline + 10) {
                        this.body.y += 1
                    }
                } else if (this.body.y > 700) {
                    this.angle += this.spindir
                    this.body.y--
                } else {

                    if (Math.random() < .1) {
                        this.angle += this.spindir
                    }

                    if (Math.random() < .07) {
                        this.spindir = (Math.random() - .5) / 20
                    }

                }
                this.hunger -= 1.051 * .009 //01
            }
            if (this.type == 8) {
                this.weight = 12.4
                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))
                this.think = 10
                this.count++
                // if (Math.random() < .005) {
                //     this.activityburst = 1
                // }



                this.scount += 1
                if (this.scount >= 3) {
                    if (this.hunger < 70) {
                        if (this.hunger < 50) {
                            if (this.scount >= 6) {
                                this.step++
                                this.scount = 0
                            }
                        } else if (this.hunger < 60) {
                            if (this.scount >= 5) {
                                this.step++
                                this.scount = 0
                            }
                        } else if (this.hunger < 70) {
                            if (this.scount >= 4) {
                                this.step++
                                this.scount = 0
                            }
                        }
                    } else {
                        if (this.scount >= 300 || this.activityburst == 1) {
                            this.step++
                            this.scount = 0
                            if (Math.random() < .1) {
                                this.activityburst = 0
                            }
                        }
                    }
                    if (Math.cos(this.angle + (Math.PI / 2)) < 0) {
                        this.step %= 5
                    } else {

                        this.step -= 5
                        this.step %= 5
                        this.step += 5
                    }
                }
                if (this.hunger < 20) {
                    canvas_context.drawImage(this.imagei, this.step * 48, 0, 48, 48, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                } else {
                    canvas_context.drawImage(this.image, this.step * 48, 0, 48, 48, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                }

                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(-this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))

                let below = 0
                if (this.body.y < tank.waterline + 10) {
                    this.body.y += 1
                }
                if (this.body.y < tank.waterline + 20) {
                    this.body.y += 1
                }
                if (this.hunger < 50) {
                    let min = 99999999

                    for (let t = 0; t < tank.food.length; t++) {
                        if (tank.food[t].body.y > tank.waterline) {
                            below = 1
                            this.scount += 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                    }
                    for (let t = 0; t < tank.food.length; t++) {
                        if (tank.food[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                        tank.food[t].link.target = this.body
                        if (tank.food[t].body.doesPerimeterTouch(this.body)) {
                            if (tank.food[t].body.shape == 1) {
                                this.hunger += (tank.food[t].calories * 2.5)
                                tank.food[t].body.shapes.splice(0, 1)
                                break
                            }
                        }
                        if (min > tank.food[t].link.hypotenuse()) {
                            min = tank.food[t].link.hypotenuse()
                            this.target = tank.food[t].body
                            this.angle = tank.food[t].link.angle() + (Math.PI / 2)
                            // if(this.bump != 0){
                            this.angle += (Math.PI / 2) * this.bump
                            // }
                            if (min < 22) { //18
                                tank.food[t].marked = 1
                                this.hunger += tank.food[t].calories
                                // tank.food[t].body.shapes.splice(0, 1)
                            }
                        }
                    }
                }



                // if (this.count % this.think == 0) {
                if (this.hunger < 20) {
                    if (this.hungerstate == 0) {
                        if (this.dir == 1) {
                            this.mouthdir = 0
                        } else if (this.dir != 1) {
                            this.mouthdir = 22
                        }
                    }
                    this.hungerstate = 1
                    let min = 99999999

                    for (let t = 0; t < tank.plants.length; t++) {
                        if (0 != tank.plants[t].type) {
                            continue
                        }
                        if (this == tank.plants[t] || tank.plants[t].body.radius >= 17) {
                            continue
                        }
                        if (tank.plants[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                    }
                    for (let t = 0; t < tank.plants.length; t++) {

                        if (0 != tank.plants[t].type) {
                            continue
                        }
                        if (this == tank.plants[t] || tank.plants[t].body.radius >= 17) {
                            continue
                        }
                        if (tank.plants[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                        tank.plants[t].link.target = this.body
                        if (min > tank.plants[t].link.hypotenuse()) {
                            min = tank.plants[t].link.hypotenuse()
                            this.target = tank.plants[t].body
                            this.ypdir = Math.sign(this.target.y - this.body.y) * 2
                            this.angle = tank.plants[t].link.angle() + (Math.PI / 2)
                            // if(this.bump != 0){
                            this.angle += (Math.PI / 2) * this.bump
                            if (this.body.doesPerimeterTouch(this.target)) {
                                tank.plants[t].dying = 1
                                tank.plants[t].body.radius = .1
                                tank.plants[t].hunger = -100
                                tank.plants[t].body.marked = 1
                                tank.plants[t].marked = 1
                                this.hunger += 200//tank.plants[t].calories
                                // tank.plants[t].body.shapes.splice(0, 1)
                                // this.hunger%=100
                            }
                            if (Math.sign(this.body.x - tank.plants[t].body.x) != this.dir) {
                                if (this.dirshift <= -10) {
                                    this.dirshift = 40
                                }
                            }
                        }
                    }
                } else {
                    this.body.y += (this.sdir * 1)
                    this.hungerstate = 0
                    this.mouthdir = 0
                }
                // this.hunger -= 1.051*.5 //.25
                // console.log(this.hunger)
                // }




                if (this.hunger < 70 || this.activityburst == 1) {
                    let dif = Math.max(this.hunger - 50, 1)
                    let mag = (20 - dif) / 20
                    if (this.activityburst == 1) {
                        mag = .5
                    }
                    this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * mag
                    this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * mag
                    this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * below * mag
                    this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * below * mag
                }
                if (this.body.x < 15) {
                    this.body.x++
                }
                if (this.body.x < 20) {
                    this.body.x++
                }
                if (this.body.x > 1260) {
                    this.body.x--
                }
                if (this.body.x > 1265) {
                    this.body.x--
                }

                if (this.body.y < tank.waterline + 50) {
                    this.angle += this.spindir
                    if (this.body.y < tank.waterline + 70) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 60) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 50) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 30) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 25) {
                        this.body.y += 1
                    }
                    if (this.body.y < tank.waterline + 20) {
                        this.body.y += 1
                    }
                } else if (this.body.y > 690) {
                    this.angle += this.spindir
                    this.body.y--
                } else {

                    if (Math.random() < .1) {
                        this.angle += this.spindir
                    }

                    if (Math.random() < .07) {
                        this.spindir = (Math.random() - .5) / 20
                    }

                }
                this.hunger -= 1.051 * .009 //01
            }
            if (this.type == 9) {
                this.weight = 4.4
                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))
                this.think = 10
                this.count++
                // if (Math.random() < .005) {
                //     this.activityburst = 1
                // }



                this.scount += 1
                if (this.scount >= 3) {
                    if (this.hunger < 70) {
                        if (this.hunger < 50) {
                            if (this.scount >= 6) {
                                this.step++
                                this.scount = 0
                            }
                        } else if (this.hunger < 60) {
                            if (this.scount >= 5) {
                                this.step++
                                this.scount = 0
                            }
                        } else if (this.hunger < 70) {
                            if (this.scount >= 4) {
                                this.step++
                                this.scount = 0
                            }
                        }
                    } else {
                        if (this.scount >= 7 || this.activityburst == 1) {
                            this.step++
                            this.scount = 0
                            if (Math.random() < .1) {
                                this.activityburst = 0
                            }
                        }
                    }
                    if (Math.cos(this.angle + (Math.PI / 2)) < 0) {
                        this.step %= 4
                    } else {

                        this.step -= 4
                        this.step %= 4
                        this.step += 4
                    }
                }
                if (Math.cos(this.angle + (Math.PI / 2)) < 0) {
                    if (this.hunger < 20) {
                        canvas_context.drawImage(this.imagei, (this.step * 32), 0, 31, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, (this.body.radius * 2) - 1, this.body.radius * 2)
                    } else {
                        canvas_context.drawImage(this.image, (this.step * 32), 0, 31, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, (this.body.radius * 2) - 1, this.body.radius * 2)
                    }
                } else {
                    if (this.hunger < 20) {
                        canvas_context.drawImage(this.imagei, (this.step * 32) + 1, 0, 31, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, (this.body.radius * 2) - 1, this.body.radius * 2)
                    } else {
                        canvas_context.drawImage(this.image, (this.step * 32) + 1, 0, 31, 32, this.body.x - this.body.radius, this.body.y - this.body.radius, (this.body.radius * 2) - 1, this.body.radius * 2)
                    }
                }

                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(-this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))

                let below = 0
                if (this.body.y < tank.waterline + 10) {
                    this.body.y += 1
                }
                if (this.body.y < tank.waterline + 20) {
                    this.body.y += 1
                }
                if (this.hunger < 50) {
                    let min = 99999999

                    for (let t = 0; t < tank.food.length; t++) {
                        if (tank.food[t].body.y > tank.waterline) {
                            below = 1
                            this.scount += 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                    }
                    for (let t = 0; t < tank.food.length; t++) {
                        if (tank.food[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                        tank.food[t].link.target = this.body
                        if (tank.food[t].body.doesPerimeterTouch(this.body)) {
                            if (tank.food[t].body.shape == 1) {
                                this.hunger += (tank.food[t].calories * 2.5)
                                tank.food[t].body.shapes.splice(0, 1)
                                break
                            }
                        }
                        if (min > tank.food[t].link.hypotenuse()) {
                            min = tank.food[t].link.hypotenuse()
                            this.target = tank.food[t].body
                            this.angle = tank.food[t].link.angle() + (Math.PI / 2)
                            // if(this.bump != 0){
                            this.angle += (Math.PI / 2) * this.bump
                            // }
                            if (min < 22) { //18
                                tank.food[t].marked = 1
                                this.hunger += tank.food[t].calories
                                // tank.food[t].body.shapes.splice(0, 1)
                            }
                        }
                    }
                }



                // if (this.count % this.think == 0) {
                if (this.hunger < 20) {
                    if (this.hungerstate == 0) {
                        if (this.dir == 1) {
                            this.mouthdir = 0
                        } else if (this.dir != 1) {
                            this.mouthdir = 22
                        }
                    }
                    this.hungerstate = 1
                    let min = 99999999

                    for (let t = 0; t < tank.plants.length; t++) {
                        if (0 != tank.plants[t].type) {
                            continue
                        }
                        if (this == tank.plants[t] || tank.plants[t].body.radius >= 17) {
                            continue
                        }
                        if (tank.plants[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                    }
                    for (let t = 0; t < tank.plants.length; t++) {

                        if (0 != tank.plants[t].type) {
                            continue
                        }
                        if (this == tank.plants[t] || tank.plants[t].body.radius >= 17) {
                            continue
                        }
                        if (tank.plants[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                        tank.plants[t].link.target = this.body
                        if (min > tank.plants[t].link.hypotenuse()) {
                            min = tank.plants[t].link.hypotenuse()
                            this.target = tank.plants[t].body
                            this.ypdir = Math.sign(this.target.y - this.body.y) * 2
                            this.angle = tank.plants[t].link.angle() + (Math.PI / 2)
                            // if(this.bump != 0){
                            this.angle += (Math.PI / 2) * this.bump
                            if (this.body.doesPerimeterTouch(this.target)) {
                                tank.plants[t].dying = 1
                                tank.plants[t].body.radius = .1
                                tank.plants[t].hunger = -100
                                tank.plants[t].body.marked = 1
                                tank.plants[t].marked = 1
                                this.hunger += 200//tank.plants[t].calories
                                // tank.plants[t].body.shapes.splice(0, 1)
                                // this.hunger%=100
                            }
                            if (Math.sign(this.body.x - tank.plants[t].body.x) != this.dir) {
                                if (this.dirshift <= -10) {
                                    this.dirshift = 40
                                }
                            }
                        }
                    }
                } else {
                    this.body.y += ((this.sdir * 1) * .1)
                    this.hungerstate = 0
                    this.mouthdir = 0
                }
                // this.hunger -= 1.051*.5 //.25
                // console.log(this.hunger)
                // }




                if (this.hunger < 70 || this.activityburst == 1) {
                    let dif = Math.max(this.hunger - 50, 1)
                    let mag = (20 - dif) / 20
                    if (this.activityburst == 1) {
                        mag = .5
                    }
                    this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * mag
                    this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * mag
                    this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * below * mag
                    this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * below * mag
                }
                if (this.body.x < 15) {
                    this.body.x++
                }
                if (this.body.x < 20) {
                    this.body.x++
                }
                if (this.body.x > 1260) {
                    this.body.x--
                }
                if (this.body.x > 1265) {
                    this.body.x--
                }

                if (this.body.y < tank.waterline + 50) {
                    this.angle += this.spindir
                    if (this.body.y < tank.waterline + 70) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 60) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 50) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 30) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 25) {
                        this.body.y += 1
                    }
                    if (this.body.y < tank.waterline + 20) {
                        this.body.y += 1
                    }
                } else if (this.body.y > 690) {
                    this.angle += this.spindir
                    this.body.y--
                } else {

                    if (Math.random() < .1) {
                        this.angle += this.spindir
                    }

                    if (Math.random() < .07) {
                        this.spindir = (Math.random() - .5) / 20
                    }

                }
                this.hunger -= 1.051 * .009 //01
            }
            if (this.type == 10) {
                if (this.body.y + this.body.radius > tank.floors[0].y) {
                    this.body.y--
                }
                if (this.body.y + this.body.radius > (tank.floors[0].y + 2)) {
                    this.body.y--
                }
                this.subbody.x = this.body.x
                if (this.hasAnchor != 1) {
                    this.subbody.y = (this.body.y + (this.size * 76))
                    this.slurp += .1
                } else {
                    this.subbody.y = (this.body.y + (this.size * 76)) - this.slurp
                    this.slurp += .1
                }
                if (this.subbody.y - this.body.y < 7) {
                    this.hasAnchor = 0
                    this.eating.dying = 1
                    this.eating.body.radius = .1
                    this.eating.hunger = -100
                    this.eating.body.marked = 1
                    this.eating.marked = 1
                    this.hunger += 500
                }
                // this.subbody.draw()
                for (let t = 0; t < tank.animals.length; t++) {
                    if (tank.animals[t] == this) {
                        continue
                    }
                    if (tank.animals[t].type == 2) {
                        continue
                    }
                    if (tank.animals[t].type == 9) {
                        continue
                    }
                    if (tank.animals[t].type == 10) {
                        continue
                    }
                    if (tank.animals[t].type == 11) {
                        if(Math.random() <.99){
                            continue
                        }
                    }
                    if (this.subbody.doesPerimeterTouch(tank.animals[t].body)) {
                        if (this.hasAnchor != 1) {
                            if (tank.animals[t].body.anchored != 1) {
                                if (this.hunger < 50) {
                                    tank.animals[t].body.anchored = 1
                                    tank.animals[t].body.anchor = this.subbody
                                    this.hasAnchor = 1
                                    this.eating = tank.animals[t]
                                    this.slurp = 0
                                }
                            }
                        }
                    }
                }
                this.weight = 40
                canvas_context.translate(this.body.x, this.body.y)
                // canvas_context.rotate(this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))
                this.think = 10
                this.count++
                // if (Math.random() < .005) {
                //     this.activityburst = 1
                // }



                this.scount += 1
                if (this.scount >= 3) {
                    if (this.hunger < 70) {
                        if (this.hunger < 50) {
                            if (this.scount >= 6) {
                                this.step++
                                this.scount = 0
                            }
                        } else if (this.hunger < 60) {
                            if (this.scount >= 5) {
                                this.step++
                                this.scount = 0
                            }
                        } else if (this.hunger < 70) {
                            if (this.scount >= 4) {
                                this.step++
                                this.scount = 0
                            }
                        }
                    } else {
                        if (this.scount >= 7 || this.activityburst == 1) {
                            this.step++
                            this.scount = 0
                            if (Math.random() < .1) {
                                this.activityburst = 0
                            }
                        }
                    }
                    this.step %= 10
                }

                if (Math.cos(this.angle + (Math.PI / 2)) < 0) {
                    if (this.hunger < 20) {
                        canvas_context.drawImage(this.imagei, (this.step * 48), 0, 48, 96, this.body.x - this.body.radius, this.body.y - this.body.radius, (this.body.radius * 2) - 1, this.body.radius * 4)
                    } else {
                        canvas_context.drawImage(this.image, (this.step * 48), 0, 48, 96, this.body.x - this.body.radius, this.body.y - this.body.radius, (this.body.radius * 2) - 1, this.body.radius * 4)
                    }
                } else {
                    if (this.hunger < 20) {
                        canvas_context.drawImage(this.imagei, (this.step * 48) + 0, 0, 48, 96, this.body.x - this.body.radius, this.body.y - this.body.radius, (this.body.radius * 2) - 1, this.body.radius * 4)
                    } else {
                        canvas_context.drawImage(this.image, (this.step * 48) + 0, 0, 48, 96, this.body.x - this.body.radius, this.body.y - this.body.radius, (this.body.radius * 2) - 1, this.body.radius * 4)
                    }
                }

                canvas_context.translate(this.body.x, this.body.y)
                // canvas_context.rotate(-this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))

                let below = 0
                // if (this.body.y < tank.waterline + 10) {
                //     this.body.y += 1
                // }
                // if (this.body.y < tank.waterline + 20) {
                //     this.body.y += 1
                // }
                if (this.hunger < 50) {
                    let min = 99999999

                    for (let t = 0; t < tank.food.length; t++) {
                        if (tank.food[t].body.y > tank.waterline) {
                            below = 1
                            this.scount += 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                    }
                    for (let t = 0; t < tank.food.length; t++) {
                        if (tank.food[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                        tank.food[t].link.target = this.body
                        if (tank.food[t].body.doesPerimeterTouch(this.body)) {
                            if (tank.food[t].body.shape == 1) {
                                this.hunger += (tank.food[t].calories * 2.5)
                                tank.food[t].body.shapes.splice(0, 1)
                                break
                            }
                        }
                        if (min > tank.food[t].link.hypotenuse()) {
                            min = tank.food[t].link.hypotenuse()
                            this.target = tank.food[t].body
                            this.angle = tank.food[t].link.angle() + (Math.PI / 2)
                            // if(this.bump != 0){
                            this.angle += (Math.PI / 2) * this.bump
                            // }
                            if (min < 22) { //18
                                tank.food[t].marked = 1
                                this.hunger += tank.food[t].calories
                                // tank.food[t].body.shapes.splice(0, 1)
                            }
                        }
                    }
                }



                // if (this.count % this.think == 0) {
                if (this.hunger < 50) {
                    if (this.hungerstate == 0) {
                        if (this.dir == 1) {
                            this.mouthdir = 0
                        } else if (this.dir != 1) {
                            this.mouthdir = 22
                        }
                    }
                    this.hungerstate = 1
                    let min = 99999999

                    for (let t = 0; t < tank.animals.length; t++) {
                        if (2 != tank.animals[t].type) {
                            continue
                        }
                        if (this == tank.animals[t] || tank.animals[t].body.radius >= 17) {
                            continue
                        }
                        if (tank.animals[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                    }
                    for (let t = 0; t < tank.animals.length; t++) {

                        if (2 != tank.animals[t].type) {
                            continue
                        }
                        if (this == tank.animals[t] || tank.animals[t].body.radius >= 17) {
                            continue
                        }
                        if (tank.animals[t].body.y > tank.waterline) {
                            below = 1
                        } else {
                            if (below == 1) {
                                continue
                            }
                        }
                        tank.animals[t].link.target = this.body
                        if (min > tank.animals[t].link.hypotenuse()) {
                            min = tank.animals[t].link.hypotenuse()
                            this.target = tank.animals[t].body
                            this.link.target = tank.animals[t].body
                            this.ypdir = Math.sign(this.target.y - this.body.y) * 2
                            this.angle = tank.animals[t].link.angle() + (Math.PI / 2)
                            // if(this.bump != 0){
                            this.angle += (Math.PI / 2) * this.bump
                            if (this.body.doesPerimeterTouch(this.target)) {
                                tank.animals[t].dying = 1
                                tank.animals[t].body.radius = .1
                                tank.animals[t].hunger = -100
                                tank.animals[t].body.marked = 1
                                tank.animals[t].marked = 1
                                this.hunger += 200//tank.animals[t].calories
                                // tank.animals[t].body.shapes.splice(0, 1)
                                // this.hunger%=100
                            }
                            if (Math.sign(this.body.x - tank.animals[t].body.x) != this.dir) {
                                if (this.dirshift <= -10) {
                                    this.dirshift = 40
                                }
                            }
                        }
                    }
                } else {
                    // this.body.y += (this.sdir * 1)
                    this.hungerstate = 0
                    this.mouthdir = 0
                }
                // this.hunger -= 1.051*.5 //.25
                // console.log(this.hunger)
                // }
                if (this.hunger < 50) {
                    this.body.x -= Math.cos(this.link.angle()) * .2
                    this.body.y -= Math.sin(this.link.angle()) * .2

                }



                if (this.hunger < 70 || this.activityburst == 1) {
                    let dif = Math.max(this.hunger - 50, 1)
                    let mag = (20 - dif) / 20
                    if (this.activityburst == 1) {
                        mag = .5
                    }
                    this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * mag
                    this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * mag
                    this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * below * mag
                    this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * below * mag
                }
                if (this.body.x < 15) {
                    this.body.x++
                }
                if (this.body.x < 20) {
                    this.body.x++
                }
                if (this.body.x > 1260) {
                    this.body.x--
                }
                if (this.body.x > 1265) {
                    this.body.x--
                }

                if (this.body.y < 70) {
                    this.body.y += .3
                }
                if (this.body.y < 60) {
                    this.body.y += .3
                }
                if (this.body.y < 50) {
                    this.body.y += .3
                }
                if (this.body.y < 30) {
                    this.body.y += .3
                }
                if (this.body.y < 25) {
                    this.body.y += 1
                }
                if (this.body.y < 20) {
                    this.body.y += 1
                }
                if (this.body.y < 10) {
                    this.body.y += 2
                }
                if (this.body.y < 8) {
                    this.body.y += 2
                }
                if (this.body.y < -10) {
                    this.body.y += 5
                }
                if (this.body.y < tank.waterline + 50) {
                    if (Math.random() < .2) {
                        this.angle += this.spindir
                    }
                    if (this.body.y < 70) {
                        this.body.y += .3
                    }
                    if (this.body.y < 60) {
                        this.body.y += .3
                    }
                    if (this.body.y < 50) {
                        this.body.y += .3
                    }
                    if (this.body.y < 30) {
                        this.body.y += .3
                    }
                    if (this.body.y < 25) {
                        this.body.y += 1
                    }
                    if (this.body.y < 20) {
                        this.body.y += 1
                    }
                } else if (this.body.y > 690) {
                    this.angle += this.spindir
                    this.body.y--
                } else {

                    if (Math.random() < .1) {
                        this.angle += this.spindir
                    }

                    if (Math.random() < .07) {
                        this.spindir = (Math.random() - .5) / 20
                    }

                }
                this.hunger -= 1.051 * .005 ///0019
            }

            if (this.type == 11) {
                this.weight = 14
                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))

                this.scount += 1
                if (this.scount >= 4) {
                this.scount = 0
                this.step++
                this.step %= 57
                }
                if (this.hunger < 20) {
                    canvas_context.drawImage(this.imagei, this.step * 96, 0, 96, 96, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                } else {
                    canvas_context.drawImage(this.image, this.step * 96, 0, 96, 96, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
                }

                canvas_context.translate(this.body.x, this.body.y)
                canvas_context.rotate(-this.angle)
                canvas_context.translate(-(this.body.x), -(this.body.y))

                let below = 0
                if (this.body.y < tank.waterline + 10) {
                    this.body.y += 1
                }
                if (this.body.y < tank.waterline + 20) {
                    this.body.y += 1
                }

                this.body.x -= Math.cos(this.angle + (Math.PI / 2))
                this.body.y -= Math.sin(this.angle + (Math.PI / 2))
                this.body.x -= Math.cos(this.angle + (Math.PI / 2)) * below
                this.body.y -= Math.sin(this.angle + (Math.PI / 2)) * below
                if (this.hunger < 50) {
                    if (this.hungerstate == 0) {
                        if (this.dir == 1) {
                            this.mouthdir = 0
                        } else if (this.dir != 1) {
                            this.mouthdir = 22
                        }
                    }
                    this.hungerstate = 1
                    let min = 99999999

                    for (let t = 0; t < tank.animals.length; t++) {
                        if (6 != tank.animals[t].type) {
                            continue
                        }
                        tank.animals[t].link.target = this.body
                        if (min > tank.animals[t].link.hypotenuse()) {
                            min = tank.animals[t].link.hypotenuse()
                            this.target = tank.animals[t].body
                            this.ypdir = Math.sign(this.target.y - this.body.y) * 2
                            this.angle = tank.animals[t].link.angle() + (Math.PI / 2)
                            // if(this.bump != 0){
                            
                            this.angle += (Math.PI / 2) * this.bump
                            if (this.body.doesPerimeterTouch(this.target)) {
                                tank.animals[t].dying = 1
                                tank.animals[t].body.radius = .1
                                tank.animals[t].hunger = -100
                                tank.animals[t].body.marked = 1
                                tank.animals[t].marked = 1
                                this.hunger += 1400//tank.animals[t].calories /1000
                                // tank.animals[t].body.shapes.splice(0, 1)
                                // this.hunger%=100
                            }
                            if (Math.sign(this.body.x - tank.animals[t].body.x) != this.dir) {
                                if (this.dirshift <= -10) {
                                    this.dirshift = 40
                                }
                            }
                        }
                    }
                }


                this.body.x -= (Math.cos(this.angle + (Math.PI / 2)))*.3
                this.body.y -= (Math.sin(this.angle + (Math.PI / 2)))*.3
                this.body.x -= (Math.cos(this.angle + (Math.PI / 2)) * below)*.3
                this.body.y -= (Math.sin(this.angle + (Math.PI / 2)) * below)*.3

                if (this.body.x < 10) {
                    this.body.x++
                }
                if (this.body.x < 8) {
                    this.body.x++
                }
                if (this.body.x < 6) {
                    this.body.x++
                }
                if (this.body.x > 1270) {
                    this.body.x--
                }

                if (this.body.x > 1272) {
                    this.body.x--
                }

                if (this.body.x > 1274) {
                    this.body.x--
                }

                if (this.body.y < tank.waterline + 50) {
                    this.angle += this.spindir
                    if (this.body.y < tank.waterline + 50) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 40) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 30) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 20) {
                        this.body.y += .3
                    }
                    if (this.body.y < tank.waterline + 15) {
                        this.body.y += 1
                    }
                    if (this.body.y < tank.waterline + 10) {
                        this.body.y += 1
                    }
                } else if (this.body.y > 700) {
                    this.angle += this.spindir
                    this.body.y--
                } else {

                    if (Math.random() < .5) {
                        this.angle += this.spindir
                    }

                    if (Math.random() < .2) {
                        this.spindir = (Math.random() - .5) / 5
                    }

                }
                this.hunger -= 1.051 * .0079 //009 //01
            }
        }
    }

    class Plant {
        constructor(x, y, type, predator = 0) {
            this.age = 0
            this.bump = 0
            this.scount = 0
            if (type == 0) {
                this.body = new Circle(x, (canvas.height - 32), 16, "transparent")
            } else {
                this.body = new Circle(x, (canvas.height - (18 + 360)), 16, "transparent")
            }
            this.image = new Image()
            this.imagei = new Image()
            this.image.src = plantImages[type]
            this.imagei.src = plantImages[type]
            this.type = type
            this.dir = 1
            this.xdir = Math.random() - .5
            this.ydir = Math.random() - .5
            this.dirshift = -1
            this.angle = 0
            this.step = 0
            this.count = 0
            this.link = new LineOP(this.body, this.body)
            this.target = this.body
            this.body.marked = 1
            this.hunger = (Math.random() * 50) + 50
            this.hungerstate = 0
            this.dying = -1
            this.angle = Math.random() * 2 * Math.PI
            this.spindir = (Math.random() - .5) / 10
            this.sdir = Math.random() - .5
            this.foodtick = Math.floor(Math.random() * 500)
        }
        draw() {
            let planttype = 0
            for (let t = 0; t < tank.plants.length; t++) {
                if (this.type == tank.plants[t].type) {
                    planttype++
                }
            }
            this.age += (planttype + 150) / 225 //100
            if (this.age > 16000) { //12000
                if (Math.random() < .0004) {
                    this.marked = 1
                }
            }
            if (this.type == 0) {
                this.weight = 5000
                this.tick = 2
                this.think = 100
                this.count++
                canvas_context.drawImage(this.image, (this.step * 32) + 1, 0, 31, 64, this.body.x - this.body.radius, this.body.y - (this.body.radius + 16), 32, 64)
                if (this.count > 5) {
                    this.count = 0
                    this.step++
                    this.step %= 6
                }
                this.foodtick++
                if (this.foodtick % 630 == 0) { //630
                    let planttype = 0
                    for (let t = 0; t < tank.food.length; t++) {
                        if (this.type == tank.food[t].seed) {
                            planttype++
                        }
                    }
                    if (planttype < 150) {
                        let food = new Food(this.body)
                        food.seed = 0
                        food.seedrate = .12 //11 //09 //07 //055
                        food.moving = 1
                        food.body.xmom = (Math.random() - .5) * 10
                        food.body.radius = 1.5
                        food.calories = 20
                        food.body.color = "Yellow"
                        food.body.reflect = 1
                        food.body.ymom = -5
                    } else {
                        this.foodtick--
                    }
                }
            }
            if (this.type == 1) {
                //bush plant
                this.weight = 5000
                this.tick = 2
                this.think = 100
                this.count++
                canvas_context.drawImage(this.image, this.step * 32, 0, 32, 32, this.body.x - this.body.radius, this.body.y - (this.body.radius), 32, 32)
                if (this.count > 5) {
                    this.count = 0
                    this.step++
                    this.step %= 1
                }
                this.foodtick++
                if (this.foodtick % 510 == 0) { //510
                    let planttype = 0
                    for (let t = 0; t < tank.food.length; t++) {
                        if (this.type == tank.food[t].seed) {
                            planttype++
                        }
                    }
                    if (planttype < 150) {
                        let food = new Food(this.body)
                        food.seed = 1
                        food.seedrate = .1 //09 //65 //45 //35
                        food.moving = 1
                        food.life = 1000
                        food.body.xmom = (Math.random() - .5) * 7
                        food.body.radius = 1
                        food.body.color = "orange"
                        food.calories = 25 //15
                        food.body.reflect = 1
                        food.body.ymom = -10 + (Math.random() * 3)
                    } else {
                        this.foodtick--
                    }
                }
            }
        }
    }

    class Tank {
        constructor() {
            this.money = 500
            const f1 = new Rectangle(0, 357, 200, 7, "white")
            const f2 = new Rectangle(1080, 357, 200, 7, "white")
            const f3 = new Rectangle(300, 357, 680, 7, "white")
            this.floors = [f1, f3, f2]
            // this.aninals = [new Animal(500,500,1),   new Animal(700,400,0),   new Animal(200,600,1)]
            this.animals = []
            // for (let t = 0; t < 4; t++) {
            //     this.animals.push(new Animal(1000 + (Math.random() * 200), (400) + (Math.random() * 220), 0))
            //     this.animals.push(new Animal(800 + (Math.random() * 200), (400) + (Math.random() * 220), 1))
            //     this.animals.push(new Animal(600 + (Math.random() * 200), (400) + (Math.random() * 220), 3))
            //     for (let k = 0; k < 5; k++) {
            //         // this.animals.push(new Animal(100+(Math.random()*980), (360)-(Math.random()*300), 2))
            //         this.animals.push(new Animal(100 + (Math.random() * 980), (360) - (Math.random() * 300), 2))
            //     }
            //     // for(let k = 0;k<100;k++){
            //     // this.animals.push(new Animal(400+(Math.random()*200), (360)+(Math.random()*300), 4))
            //     this.animals.push(new Animal(300 + (Math.random() * 200), (390) + (Math.random() * 300), 4))
            //     // }
            //     this.animals.push(new Animal(200 + (Math.random() * 200), (360) + (Math.random() * 300), 5))
            // }
            // this.plants = [new Plant(300, canvas.height - 32, 0), new Plant(900, canvas.height - 32, 0), new Plant(100, canvas.height - 32, 0), new Plant(1100, canvas.height - 32, 0), new Plant(500, canvas.height - 32, 0), new Plant(700, canvas.height - 32, 0), new Plant(800, canvas.height - 32, 1), new Plant(120, canvas.height - 32, 1), new Plant(1140, canvas.height - 32, 1), new Plant(700, canvas.height - 32, 1), new Plant(400, canvas.height - 32, 1), new Plant(900, canvas.height - 32, 1), new Plant(600, canvas.height - 32, 1), new Plant(500, canvas.height - 32, 1)]
            this.plants = []
            this.waterline = 360
            this.food = []
            this.water = new Rectangle(0, 360, 1280, 360, "#0033FF20")
            this.grd = canvas_context.createLinearGradient(0, 0, 1280, 0)

            this.grd.addColorStop(0, "#00660024")
            this.grd.addColorStop(.250, "#000000")
            this.grd.addColorStop(.750, "#000000")
            this.grd.addColorStop(1, "#00660024")


        }
        inFloor(x) {
            for (let t = 0; t < this.floors.length; t++) {
                if (this.floors[t].x < x - 8 && x + 8 < this.floors[t].width + this.floors[t].x) {
                    return true
                }
            }
            return false
        }
        draw() {

            canvas_context.fillStyle = this.grd
            canvas_context.globalAlpha = .5
            canvas_context.fillRect(0, 0, 1280, 720)
            canvas_context.globalAlpha = 1
            for (let t = 0; t < this.animals.length; t++) {
                this.animals[t].dying--
                if (this.animals[t].hunger <= 0) {
                    if (!(this.animals[t].dying > 0)) {
                        this.animals[t].dying = 100
                    } else {
                        if (this.animals[t].dying == 0) {
                            tank.animals.splice(t, 1)
                            return
                        }
                    }
                }
            }


            this.water.draw()
            for (let t = 0; t < this.floors.length; t++) {
                this.floors[t].draw()
            }
            this.money += .015 * this.animals.length
            for (let t = 0; t < this.animals.length; t++) {
                this.animals[t].body.anchorCheck()
            }
            for (let t = 0; t < this.animals.length; t++) {
                this.animals[t].draw()
                // this.animals[t].hunger-=.03
            }
            this.money += .0015 * this.plants.length
            for (let t = 0; t < this.plants.length; t++) {
                this.plants[t].draw()
            }
            for (let t = 0; t < this.animals.length; t++) {
                for (let k = 0; k < this.animals.length; k++) {
                    if (t != k) {
                        this.animals[t].link.target = this.animals[k].body
                        let jbreak = 0
                        while (this.animals[t].link.hypotenuse() < this.animals[t].body.radius + this.animals[k].body.radius) {

                            jbreak++
                            if (jbreak > 1000) {
                                break
                            }
                            let cos = Math.cos(this.animals[t].link.angle())
                            let sin = Math.sin(this.animals[t].link.angle())
                            this.animals[t].body.x += cos / this.animals[t].weight
                            this.animals[t].body.y += sin / this.animals[t].weight
                            this.animals[k].body.x -= cos / this.animals[k].weight
                            this.animals[k].body.y -= sin / this.animals[k].weight
                            if (this.animals[t].predator != 1) {
                                if (Math.random() < .05) {
                                    this.animals[t].dirshift = 30
                                }
                            }
                            if (this.animals[k].predator != 1) {
                                if (Math.random() < .05) {
                                    this.animals[k].dirshift = 30
                                }
                            }
                            this.animals[k].bump = Math.sign(Math.random() - .5) * (Math.random() - .5)
                            this.animals[t].bump = -Math.sign(this.animals[k].bump) * (Math.random() - .5)
                        }
                    }
                }
            }
            for (let t = 0; t < this.food.length; t++) {
                for (let k = 0; k < this.food.length; k++) {
                    if (t != k) {
                        this.food[t].link.target = this.food[k].body
                        let j = 0
                        let jbreak = 0
                        while (this.food[t].link.hypotenuse() < this.food[t].body.radius + this.food[k].body.radius) {
                            jbreak++
                            if (jbreak > 1000) {
                                break
                            }
                            j++
                            if (j > 5) {
                                break
                            }
                            let cos = Math.cos(this.food[t].link.angle()) / 5
                            let sin = Math.sin(this.food[t].link.angle()) / 5
                            this.food[t].body.x += cos / this.food[t].weight
                            this.food[t].body.y += sin / this.food[t].weight
                            this.food[k].body.x -= cos / this.food[k].weight
                            this.food[k].body.y -= sin / this.food[k].weight

                            for (let r = 0; r < 3; r++) {
                                if (this.food[t].body.y >= 717) {
                                    break
                                }
                                if (this.food[t].body.y > this.waterline) {
                                    this.food[t].body.y += .25
                                } else {
                                    let wet = 0
                                    for (let k = 0; k < this.floors.length; k++) {
                                        if (this.floors[k].doesPerimeterTouch(this.food[t].body)) {
                                            wet = 1
                                        }
                                    }
                                    if (wet == 1) {
                                        this.food[t].body.y -= .01
                                    } else {

                                    }
                                }
                            }


                            for (let r = 0; r < 3; r++) {
                                if (this.food[k].body.y >= 717) {
                                    break
                                }
                                if (this.food[k].body.y > this.waterline) {
                                    this.food[k].body.y += .25
                                } else {
                                    let wet = 0
                                    for (let k = 0; k < this.floors.length; k++) {
                                        if (this.floors[k].doesPerimeterTouch(this.food[t].body)) {
                                            wet = 1
                                        }
                                    }
                                    if (wet == 1) {
                                        this.food[k].body.y -= .01
                                    } else {
                                    }
                                }
                            }
                        }
                    }
                }
            }

            for (let t = 0; t < this.food.length; t++) {


                if (this.food[t].body.shape == 1) {

                    for (let k = 0; k < this.floors.length; k++) {
                        for (let y = 0; y < this.food[t].body.shapes.length; y++) {
                            // if (this.floors[k].doesPerimeterTouch(this.food[t].body.shapes[y])) {
                            // this.food[t].body.shapes[y].y -= 2

                            let tempx = this.food[t].body.shapes[y].x
                            let tempy = this.food[t].body.shapes[y].y
                            if (y < this.food[t].body.shapes.length - 1 && y > 0) {
                                this.food[t].body.shapes[y].x = ((((tempx) + (this.food[t].body.shapes[y + 1].x * 3)) * .25) + (((tempx) + (this.food[t].body.shapes[y - 1].x * 3)) * .25)) * .5
                                this.food[t].body.shapes[y].y = ((((tempy) + (this.food[t].body.shapes[y + 1].y * 3)) * .25) + (((tempy) + (this.food[t].body.shapes[y - 1].y * 3)) * .25)) * .5
                            }




                            let nut = 0
                            if (this.floors[k].doesPerimeterTouch(this.food[t].body.shapes[y])) {

                                if (k == 0) {
                                    this.food[t].body.shapes[y].y--
                                    // this.food[t].body.shapes[y].x += 1
                                    this.food[t].body.shapes[y].xmom += .07

                                    this.food[t].body.shapes[y].friction = .9
                                }

                                if (k == 1) {
                                    if (this.food[t].body.x > (tank.floors[k].x + (tank.floors[k].width * .5))) {
                                        // this.food[t].body.shapes[y].y -= .1
                                        // this.food[t].body.shapes[y].x += 1
                                        this.food[t].body.shapes[y].xmom += .05

                                        this.food[t].body.shapes[y].friction = .9
                                    } else {
                                        // this.food[t].body.shapes[y].y -= .1
                                        // this.food[t].body.shapes[y].x -= 1
                                        this.food[t].body.shapes[y].xmom -= .05

                                        this.food[t].body.shapes[y].friction = .9

                                    }
                                }


                                if (k == 2) {
                                    this.food[t].body.shapes[y].y--
                                    // this.food[t].body.shapes[y].x -= 1
                                    this.food[t].body.shapes[y].xmom -= .07

                                    this.food[t].body.shapes[y].friction = .9
                                }
                                this.food[t].body.shapes[y].frictiveMove()
                                nut++
                            }


                            let jbreak = 0
                            while (this.floors[k].doesPerimeterTouch(this.food[t].body.shapes[y])) {

                                jbreak++
                                if (jbreak > 1000) {
                                    break
                                }
                                this.food[t].body.shapes[y].y -= .1
                            }

                            if (y < this.food[t].body.shapes.length - 1 && y > 0) {
                                if (this.floors[k].doesPerimeterTouch(this.food[t].body.shapes[y + 1]) || this.floors[k].doesPerimeterTouch(this.food[t].body.shapes[y - 1])) {
                                    nut++
                                }
                            }

                            if (y < this.food[t].body.shapes.length - 1 && y > 0) {
                                this.food[t].body.shapes[y - 1].y -= nut
                                this.food[t].body.shapes[y + 1].y -= nut
                            }
                            this.food[t].body.shapes[y].y -= nut * 2
                        }
                    }
                }


                for (let r = 0; r < 3; r++) {
                    if (this.food[t].body.y >= 717) {
                        break
                    }
                    if (this.food[t].body.y > this.waterline) {
                        this.food[t].body.y += .25
                    } else {
                        let wet = 0
                        if (this.food[t].body.shape == 1) {

                            for (let k = 0; k < this.floors.length; k++) {
                                for (let y = 0; y < this.food[t].body.shapes.length; y++) {
                                    if (this.floors[k].doesPerimeterTouch(this.food[t].body.shapes[y])) {
                                        wet = 1
                                        this.food[t].body.shapes[y].y -= 1

                                        let tempx = this.food[t].body.shapes[y].x
                                        let tempy = this.food[t].body.shapes[y].y
                                        if (y < this.food[t].body.shapes.length - 1 && y > 0) {
                                            this.food[t].body.shapes[y].x = ((((tempx * 9) + (this.food[t].body.shapes[y + 1].x)) * .1) + (((tempx * 9) + (this.food[t].body.shapes[y - 1].x)) * .1)) * .5
                                            this.food[t].body.shapes[y].y = ((((tempy * 9) + (this.food[t].body.shapes[y + 1].y)) * .1) + (((tempy * 9) + (this.food[t].body.shapes[y - 1].y)) * .1)) * .5
                                        }


                                    }
                                }
                            }
                        } else {
                            for (let k = 0; k < this.floors.length; k++) {
                                if (this.floors[k].doesPerimeterTouch(this.food[t].body)) {
                                    wet = 1
                                    break
                                }
                            }
                        }
                        for (let k = 0; k < this.floors.length; k++) {
                            if (this.floors[k].doesPerimeterTouch(this.food[t].body)) {
                                wet = 1
                                break
                            }
                        }
                        if (wet == 0) {

                            for (let k = 0; k < this.food.length; k++) {
                                if (this.food[k].body.doesPerimeterTouch(this.food[t].body)) {
                                    if (k != t) {

                                        wet = 1
                                        break
                                    }
                                }
                            }
                            if (wet == 0) {
                                this.food[t].body.y += 1
                            } else {
                                this.food[t].body.y += .05
                                this.food[t].body.y -= (Math.random() / 10)
                            }
                        } else {

                            this.food[t].body.y -= .9
                        }
                    }
                }
                if (this.food[t].moving == 1) {
                    this.food[t].body.friction = .99
                    this.food[t].body.frictiveMove()
                }
                this.food[t].draw()
            }
            for (let t = 0; t < this.food.length; t++) {
                if (this.food[t].marked == 1) {
                    this.food.splice(t, 1)
                }
            }
            for (let t = 0; t < this.plants.length; t++) {
                if (this.plants[t].marked == 1) {
                    this.plants.splice(t, 1)
                }
            }
            for (let t = 0; t < this.animals.length; t++) {
                if (this.animals[t].marked == 1) {
                    this.animals.splice(t, 1)
                }
            }

            canvas_context.font = "20px arial"
            canvas_context.fillStyle = 'white'
            canvas_context.fillText('Ұ' + Math.floor(this.money), 20, 20)
            coordi.draw()
        }
    }


    setUp(setup_canvas) // setting up canvas refrences, starting timer. 

    let tank = new Tank()
    let coordi = new CoordinateSelection(TIP_engine, keysPressed)
    // object instantiation and creation happens here 
    function main() {
        canvas_context.clearRect(0, 0, canvas.width, canvas.height)  // refreshes the image
        // // mag_canvas_context.clearRect(0, 0, mag_canvas.width, mag_canvas.height)  // refreshes the image
        // gamepadAPI.update() //checks for button presses/stick movement on the connected controller)
        // // // game code goes here
        tank.draw()

        // canvas_context.drawImage(canvas,0,0)

        if (keysPressed['4'] && recording == 0) {
            recording = 1
            video_recorder.record()
        }
        if (keysPressed['5'] && recording == 1) {
            recording = 0
            video_recorder.stop()
            video_recorder.download('File Name As A String.webm')
        }


    }

})
