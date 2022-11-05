
window.addEventListener('DOMContentLoaded', (event) => {


    let pomsatan = new Image()
    pomsatan.src = "pomsatan.png"
    let pomsatanl = new Image()
    pomsatanl.src = "pomsatanl2.png"

    let extraegg = new Image()
    extraegg.src = "2xe.png"
    let magnet = new Image()
    magnet.src = "magnet.png"
    let crack = new Image()
    crack.src = "crack.png"
    let puff = new Image()
    puff.src = 'puff.png'
    let charb = new Image()
    charb.src = 'charb.png'
    let beamman = new Image()
    beamman.src = 'lb1.png'
    let blend = new Image()
    blend.src = 'blending.png'
    let hitpoml = new Image()
    hitpoml.src = 'l1p1r.png'
    let hitpom = new Image()
    hitpom.src = 'r1p1r.png'
    let anchor = new Image()
    anchor.src = 'anchor.png'
    let surfumbrella = new Image()
    surfumbrella.src = 'u3.png'
    let surfumbrellal = new Image()
    surfumbrellal.src = 'u3l.png'
    let pomaoimg = new Image()
    pomaoimg.src = 'r1p1.png'
    let pomaoimgl = new Image()
    pomaoimgl.src = 'l1p1.png'
    let invpomaoimg = new Image()
    invpomaoimg.src = 'invpm.png'
    let invpomaoimgl = new Image()
    invpomaoimgl.src = 'invpml.png'
    let targoy = new Image()
    targoy.src = 't1g1.png'
    let targoy2 = new Image()
    targoy2.src = 't2g1.png'
    let eggimg = new Image()
    eggimg.src = 's1e1p1.png'
    let fruits = new Image()
    fruits.src = 'fs19.png'
    let cactusr = new Image()
    cactusr.src = 'cdr.png'
    let cactusl = new Image()
    cactusl.src = 'cdl.png'
    let heart = new Image()
    heart.src = 'h2.png'
    let pomspin = new Image()
    pomspin.src = 'mh1.png'
    let wheel = new Image()
    wheel.src = 'w1.png'
    let baloon = new Image()
    baloon.src = 'b1.png'
    let poteleft = new Image()
    poteleft.src = 'poteleft.png'
    let pote = new Image()
    pote.src = 'pote.png'
    let umbrella = new Image()
    umbrella.src = 'u1.png'
    let pop = new Audio()
    pop.volume = .2
    pop.src = 'pop.mp3'
    let ba = new Audio()
    ba.volume = .1
    ba.src = 'ba.mp3'
    let hop = new Audio()
    hop.volume = .2
    hop.src = 'hop.mp3'
    let sounds = []
    for (let t = 1; t < 20; t++) {
        let sound = new Audio()
        sound.src = `s${t}.mp3`
        sound.volume = .6 - (t * .025)
        sounds.push(sound)
    }

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
            // // console.log(pressed); // return buttons for debugging purposes
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
            this.xmom /= magnitude
            this.ymom /= magnitude
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
        intersects(line) {
            var det, gm, lm;
            det = (this.target.x - this.object.x) * (line.target.y - line.object.y) - (line.target.x - line.object.x) * (this.target.y - this.object.y);
            if (det === 0) {
                return false;
            } else {
                lm = ((line.target.y - line.object.y) * (line.target.x - this.object.x) + (line.object.x - line.target.x) * (line.target.y - this.object.y)) / det;
                gm = ((this.object.y - this.target.y) * (line.target.x - this.object.x) + (this.target.x - this.object.x) * (line.target.y - this.object.y)) / det;
                return (0 <= lm && lm <= 1) && (0 <= gm && gm <= 1);
            }
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
            if (this.flagged == 1) {
                canvas_context.strokeStyle = "magenta"
                canvas_context.lineWidth = 2
                canvas_context.strokeRect(this.x, this.y, this.width, this.height)

            }
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
                // console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
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
        adjustByFromDisplacement(x, y) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (typeof this.shapes[t].fromRatio == "number") {
                    this.shapes[t].x += x * this.shapes[t].fromRatio
                    this.shapes[t].y += y * this.shapes[t].fromRatio
                }
            }
        }
        adjustByToDisplacement(x, y) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (typeof this.shapes[t].toRatio == "number") {
                    this.shapes[t].x += x * this.shapes[t].toRatio
                    this.shapes[t].y += y * this.shapes[t].toRatio
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
    function setUp(canvas_pass, style = "#000000") {
        canvas = canvas_pass
        video_recorder = new CanvasCaptureToWEBM(canvas, 4500000);
        canvas_context = canvas.getContext('2d');
        canvas.style.background = style
        window.setInterval(function () {
            main()
        }, 11)
        document.addEventListener('keydown', (event) => {
            keysPressed[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            delete keysPressed[event.key];
        });
        window.addEventListener('pointerdown', e => {
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
            TIP_engine.x = XS_engine
            TIP_engine.y = YS_engine
            TIP_engine.body = TIP_engine
            if (pomao.started == 0) {
                if (pomao.startmenu.startbutton.isPointInside(TIP_engine)) {
                    pomao.started = 1
                    pomao.startmenu.start1 = 1
                    pomao.startmenu.start2 = 1
                }
                if (pomao.startmenu.seeother.isPointInside(TIP_engine)) {
                    pomao.startmenu.view *= -1
                }
            } else {
                pomao.utap = new Point(TIP_engine.x + ((Math.random() - .5) * .01), TIP_engine.y + ((Math.random() - .5) * .01))
                pomao.shoot()
            }
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
            pomao.utap = new Point(TIP_engine.x + ((Math.random() - .5) * .01), TIP_engine.y + ((Math.random() - .5) * .01))
            // pomao.shoot()
        }
    }
    function gamepad_control(object, speed = 1) { // basic control for objects using the controler
        //         // console.log(gamepadAPI.axesStatus[1]*gamepadAPI.axesStatus[0]) //debugging
        if (typeof object.body != 'undefined') {
            if (typeof (gamepadAPI.axesStatus[1]) != 'undefined') {
                if (typeof (gamepadAPI.axesStatus[0]) != 'undefined') {
                    object.body.x += (gamepadAPI.axesStatus[0] * speed)
                    object.body.y += (gamepadAPI.axesStatus[1] * speed)
                }
            }
        } else if (typeof object != 'undefined') {
            if (typeof (gamepadAPI.axesStatus[1]) != 'undefined') {
                if (typeof (gamepadAPI.axesStatus[0]) != 'undefined') {
                    object.x += (gamepadAPI.axesStatus[0] * speed)
                    object.y += (gamepadAPI.axesStatus[1] * speed)
                }
            }
        }
    }
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
    function castBetween(from, to, granularity = 10, radius = 1) { //creates a sort of beam hitbox between two points, with a granularity (number of members over distance), with a radius defined as well
        let limit = granularity
        let shape_array = []
        for (let t = 0; t < limit; t++) {
            let circ = new Circle((from.x * (t / limit)) + (to.x * ((limit - t) / limit)), (from.y * (t / limit)) + (to.y * ((limit - t) / limit)), radius, "red")
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
    let pomao_canvas = document.getElementById('pomcanvas') //getting canvas from document
    let pomao_canvas_context = pomao_canvas.getContext('2d');
    setUp(setup_canvas) // setting up canvas refrences, starting timer. 
    // recording = 1
    // video_recorder.record()
    pomao_canvas_context.translate(16, 16)

    class WallBeam {
        constructor(x, y) {
            this.angle = -Math.PI / 2//Math.random()*Math.PI*2
            this.marked = 0
            // this.cactus = 1
            this.dir = x
            if (this.dir == 1) {
                this.body = new Circle(pomao.walls[0].x + pomao.walls[0].width + 16 + (Math.random() * 200), y, 16, "red", 0, 0, .98)
            } else {
                this.body = new Circle(pomao.walls[1].x - 16 - (Math.random() * 200), y, 16, "red", 0, 0, .98)
            }
            this.health = 1.5
            this.value = 2
            this.pomlink = new LineOP(this.body, pomao.body, "red", 4)
        }
        animate() {
            // let vec = new Vector(this.body, 100 * (Math.random() - .5), 100 * (Math.random() - .5))
            // vec.normalize(1)
            // this.body.xmom = -Math.sign(this.body.x-pomao.body.x)/5   // (vec.ymom * .7) //+ (Math.random() - .5)
            // this.body.frictiveMove()
        }
        draw() {

            if (this.body.x < 360) {
                this.link = new LineOP(new Point(this.body.x, this.body.y), new Point(pomao.walls[0].x, this.body.y), "purple", 3)
                this.link2 = new LineOP(new Point(this.body.x, this.body.y), new Point(pomao.walls[0].x, this.body.y), "yellow", 5)
            } else {
                this.link = new LineOP(new Point(this.body.x, this.body.y), new Point(pomao.walls[1].x, this.body.y), "purple", 3)
                this.link2 = new LineOP(new Point(this.body.x, this.body.y), new Point(pomao.walls[1].x, this.body.y), "yellow", 5)
            }
            this.link2.draw()
            this.link.draw()
            canvas_context.drawImage(beamman, 0, 0, beamman.width, beamman.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)

        }
    }
    class SWallBeam {
        constructor(x, y) {
            this.angle = -Math.PI / 2//Math.random()*Math.PI*2
            this.marked = 0
            // this.cactus = 1
            this.dir = x
            if (this.dir == 1) {
                this.body = new Circle(pomao.walls[0].x + pomao.walls[0].width + 16 + (Math.random() * 400), y, 16, "red", 0, 0, .98)
            } else {
                this.body = new Circle(pomao.walls[1].x - 16 - (Math.random() * 400), y, 16, "red", 0, 0, .98)
            }
            this.health = 15
            this.value = 0
            this.pomlink = new LineOP(this.body, pomao.body, "red", 4)
        }
        animate() {
            // let vec = new Vector(this.body, 100 * (Math.random() - .5), 100 * (Math.random() - .5))
            // vec.normalize(1)
            // this.body.xmom = -Math.sign(this.body.x-pomao.body.x)/5   // (vec.ymom * .7) //+ (Math.random() - .5)
            // this.body.frictiveMove()
        }
        draw() {
            this.body.y-=3
            if (this.body.x < 360) {
                this.link = new LineOP(new Point(this.body.x, this.body.y), new Point(pomao.walls[0].x, this.body.y), "purple", 3)
                this.link2 = new LineOP(new Point(this.body.x, this.body.y), new Point(pomao.walls[0].x, this.body.y), "yellow", 5)
            } else {
                this.link = new LineOP(new Point(this.body.x, this.body.y), new Point(pomao.walls[1].x, this.body.y), "purple", 3)
                this.link2 = new LineOP(new Point(this.body.x, this.body.y), new Point(pomao.walls[1].x, this.body.y), "yellow", 5)
            }
            this.link2.draw()
            this.link.draw()
            canvas_context.drawImage(beamman, 0, 0, beamman.width, beamman.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)

        }
    }
    class WallGuy {
        constructor(x, y) {
            this.angle = -Math.PI / 2//Math.random()*Math.PI*2
            this.marked = 0
            this.cactus = 1
            this.dir = x
            if (this.dir == 1) {
                this.body = new Circle(pomao.walls[0].x + pomao.walls[0].width + 16, y, 16, "red", 0, 0, .98)
            } else {
                this.body = new Circle(pomao.walls[1].x - 16, y, 16, "red", 0, 0, .98)
            }
            this.health = 3.9
            this.value = 2

            this.pomlink = new LineOP(this.body, pomao.body, "red", 4)
        }
        animate() {
            let vec = new Vector(this.body, 100 * (Math.random() - .5), 100 * (Math.random() - .5))
            vec.normalize(1)
            this.body.ymom = (vec.ymom * .7) + (Math.random() - .5)
            this.body.frictiveMove()
        }
        draw() {
            if (this.dir == 1) {
                canvas_context.drawImage(cactusr, 0, 0, cactusr.width, cactusr.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
            } else {
                canvas_context.drawImage(cactusl, 0, 0, cactusl.width, cactusl.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
            }
        }
    }
    class Scalegoy {
        constructor(x, y) {
            this.body = new Circle(x - 1, y, 16, "red", 0, 0, .98)
            this.body2 = new Circle(x + 1, y, 16, "red", 0, 0, .98)
            this.health = 3
            this.health2 = 3
            this.value = 4
            this.angle = -Math.PI / 2// Math.random()*Math.PI*2
            this.marked = 0
            this.link = new LineOP(this.body, this.body2, "red", 4)
            this.pomlink = new LineOP(this.body, pomao.body, "red", 4)
        }
        animate() {
            let vec = new Vector(this.body, (pomao.body.x - this.body.x), (pomao.body.y - this.body.y))
            vec.normalize(1)
            let vec2 = new Vector(this.body2, (pomao.body.x - this.body2.x), (pomao.body.y - this.body2.y))
            vec2.normalize(1)

            let vec3 = new Vector(this.body, (this.body.x - this.body2.x), (this.body.y - this.body2.y))
            vec3.normalize(.7)

            this.body.xmom = 0
            this.body.ymom = 0
            this.body2.xmom = 0
            this.body2.ymom = 0

            if (this.body.submark != 1) {
                this.body.xmom += vec.xmom + (Math.random() - .5)
                this.body.ymom += (vec.ymom * .7) + (Math.random() - .5)
            }
            if (this.body2.submark != 1) {
                this.body2.xmom += vec2.xmom + (Math.random() - .5)
                this.body2.ymom += (vec2.ymom * .7) + (Math.random() - .5)
            }
            if (this.link.hypotenuse() < 100) {
                if (this.body.submark != 1) {
                    this.body.xmom += vec3.xmom
                    this.body.ymom += (vec3.ymom)
                }
                if (this.body2.submark != 1) {
                    this.body2.xmom -= vec3.xmom
                    this.body2.ymom -= (vec3.ymom)
                }
            } else {
                if (this.body.submark != 1) {
                    this.body.xmom -= vec3.xmom
                    this.body.ymom -= (vec3.ymom)
                }
                if (this.body2.submark != 1) {
                    this.body2.xmom += vec3.xmom
                    this.body2.ymom += (vec3.ymom)
                }
            }
            this.body.frictiveMove()
            this.body2.frictiveMove()
        }
        draw() {
            let angle = this.link.angle()
            let start = this.body
            let spin = 0
            let end = this.body2
            let lines = [new LineOP(this.body2, this.body2, "red", 4)]
            let dis = this.link.hypotenuse() / 15
            let tick = 0
            for (let t = 0; t < 10; t++) {
                if (Math.random() < .1) {
                    tick += (Math.floor(Math.random() * 3))
                }
                let ratio = t / 10
                let subrat = 1 - ratio
                if ((t + tick) % 3 == 0) {
                    spin = Math.PI / 2
                } else if ((t + tick) % 3 == 1) {
                    spin = Math.PI / -2
                } else {
                    spin = 0
                }
                let x = (start.x * ratio) + (end.x * subrat)
                let y = (start.y * ratio) + (end.y * subrat)
                let adjust = new Point(x, y)
                adjust.x += (Math.cos(angle + spin) * dis)
                adjust.y += (Math.sin(angle + spin) * dis)
                let link = new LineOP(lines[t].target, adjust, "red", 4)
                lines.push(link)
            }
            for (let t = 1; t < lines.length; t++) {
                lines[t].draw()
            }
            if (this.body.submark != 1) {
                canvas_context.drawImage(targoy, 0, 0, targoy.width, targoy.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
            } else {
                canvas_context.drawImage(targoy2, 0, 0, targoy2.width, targoy2.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
            }
            if (this.body2.submark != 1) {
                canvas_context.drawImage(targoy, 0, 0, targoy.width, targoy.height, this.body2.x - this.body2.radius, this.body2.y - this.body2.radius, this.body2.radius * 2, this.body2.radius * 2)
            } else {
                canvas_context.drawImage(targoy2, 0, 0, targoy2.width, targoy2.height, this.body2.x - this.body2.radius, this.body2.y - this.body2.radius, this.body2.radius * 2, this.body2.radius * 2)
            }
        }
    }
    class DScalegoy {
        constructor(x, y) {
            this.body = new Circle(x - 1, y, 19, "red", 0, 0, .98)
            this.body2 = new Circle(x + 1, y, 19, "red", 0, 0, .98)
            this.health = 10
            this.health2 = 3
            this.value = 0
            this.angle = -Math.PI / 2// Math.random()*Math.PI*2
            this.marked = 0
            this.link = new LineOP(this.body, this.body2, "red", 4)
            this.pomlink = new LineOP(this.body, pomao.body, "red", 4)
        }
        animate() {
            let vec = new Vector(this.body, (pomao.body.x - this.body.x), (pomao.body.y - this.body.y))
            vec.normalize(1.5)
            let vec2 = new Vector(this.body2, (pomao.body.x - this.body2.x), (pomao.body.y - this.body2.y))
            vec2.normalize(1.5)

            let vec3 = new Vector(this.body, (this.body.x - this.body2.x), (this.body.y - this.body2.y))
            vec3.normalize(1)

            this.body.xmom = 0
            this.body.ymom = 0
            this.body2.xmom = 0
            this.body2.ymom = 0

            if (this.body.submark != 1) {
                this.body.xmom += vec.xmom + (Math.random() - .5)
                this.body.ymom += (vec.ymom * .7) + (Math.random() - .5)
            }
            if (this.body2.submark != 1) {
                this.body2.xmom += vec2.xmom + (Math.random() - .5)
                this.body2.ymom += (vec2.ymom * .7) + (Math.random() - .5)
            }
            if (this.link.hypotenuse() < 300) {
                if (this.body.submark != 1) {
                    this.body.xmom += vec3.xmom
                    this.body.ymom += (vec3.ymom)
                }
                if (this.body2.submark != 1) {
                    this.body2.xmom -= vec3.xmom
                    this.body2.ymom -= (vec3.ymom)
                }
            } else {
                if (this.body.submark != 1) {
                    this.body.xmom -= vec3.xmom
                    this.body.ymom -= (vec3.ymom)
                }
                if (this.body2.submark != 1) {
                    this.body2.xmom += vec3.xmom
                    this.body2.ymom += (vec3.ymom)
                }
            }
            this.body.frictiveMove()
            this.body2.frictiveMove()
        }
        draw() {
            let angle = this.link.angle()
            let start = this.body
            let spin = 0
            let end = this.body2
            let lines = [new LineOP(this.body2, this.body2, "red", 4)]
            let dis = this.link.hypotenuse() / 15
            let tick = 0
            for (let t = 0; t < 10; t++) {
                if (Math.random() < .1) {
                    tick += (Math.floor(Math.random() * 3))
                }
                let ratio = t / 10
                let subrat = 1 - ratio
                if ((t + tick) % 3 == 0) {
                    spin = Math.PI / 2
                } else if ((t + tick) % 3 == 1) {
                    spin = Math.PI / -2
                } else {
                    spin = 0
                }
                let x = (start.x * ratio) + (end.x * subrat)
                let y = (start.y * ratio) + (end.y * subrat)
                let adjust = new Point(x, y)
                adjust.x += (Math.cos(angle + spin) * dis)
                adjust.y += (Math.sin(angle + spin) * dis)
                let link = new LineOP(lines[t].target, adjust, "red", 4)
                lines.push(link)
            }
            for (let t = 1; t < lines.length; t++) {
                lines[t].draw()
            }
            if (this.body.submark != 1) {
                canvas_context.drawImage(targoy, 0, 0, targoy.width, targoy.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
            } else {
                canvas_context.drawImage(targoy2, 0, 0, targoy2.width, targoy2.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
            }
            if (this.body2.submark != 1) {
                canvas_context.drawImage(targoy, 0, 0, targoy.width, targoy.height, this.body2.x - this.body2.radius, this.body2.y - this.body2.radius, this.body2.radius * 2, this.body2.radius * 2)
            } else {
                canvas_context.drawImage(targoy2, 0, 0, targoy2.width, targoy2.height, this.body2.x - this.body2.radius, this.body2.y - this.body2.radius, this.body2.radius * 2, this.body2.radius * 2)
            }
        }
    }
    class Trampoline {
        constructor(x, y) {
            let angle
            if (x < 360) {
                angle = Math.sign(Math.random() - .5) * Math.PI * 2 + .3
            } else {
                angle = Math.sign(Math.random() - .5) * Math.PI * 2 - .3
            }
            this.marked = 0
            this.angle = 0
            this.body = new LineOP(new Point(x, y), new Point(x + (Math.cos(angle) * 60), y + (Math.sin(angle) * 60)), "#FFFF00", 1)
            this.body.x = x
            this.body.y = y
            this.body.radius = 100
            this.body.isPointInside = this.animate
            this.body.doesPerimeterTouch = this.animate
            this.center = new Point((this.body.target.x + this.body.object.x) / 2, (this.body.target.y + this.body.object.y) / 2)
            this.value = 1000
            this.pomlink = new LineOP(this.body, pomao.body, "red", 4)
        }
        animate() {
        }
        draw() {
            if (this.body.intersects(pomao.link)) {
                let link = new LineOP(pomao.body, this.center)
                let diff = this.body.angle()//+Math.PI
                pomao.body.sxmom -= Math.sin(diff) * 10
                pomao.body.symom = Math.cos(diff) * 10
                pomao.body.xmom = 0
                pomao.body.ymom = 0
            }
            this.bodyu = new LineOP(new Point(this.body.object.x, this.body.object.y + 3), new Point(this.body.target.x, this.body.target.y + 3), "#ff0000", 3)
            this.bodyd = new LineOP(new Point(this.body.object.x, this.body.object.y - 3), new Point(this.body.target.x, this.body.target.y - 3), "#00FF00", 3)
            this.bodyu.draw()
            this.bodyd.draw()
            this.body.draw()
        }
    }
    class Targoy {
        constructor(x, y) {
            this.body = new Circle(x, y, 10, "red", 0, 0, .98)
            this.health = 2
            this.value = 1
            this.angle = -Math.PI / 2// Math.random()*Math.PI*2
            this.marked = 0
            this.pomlink = new LineOP(this.body, pomao.body, "red", 4)
        }
        animate() {
            let vec = new Vector(this.body, (pomao.body.x - this.body.x), (pomao.body.y - this.body.y))
            vec.normalize(1)
            this.body.xmom = vec.xmom + (Math.random() - .5)
            this.body.ymom = (vec.ymom * .7) + (Math.random() - .5)
            this.body.frictiveMove()
        }
        draw() {
            canvas_context.drawImage(targoy, 0, 0, targoy.width, targoy.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
        }
    }
    class Puff {
        constructor(x, y) {
            this.body = new Circle(x, y, 18, "red", 0, 0, .98)
            this.health = .1
            this.value = 3
            this.angle = -Math.PI / 2// Math.random()*Math.PI*2
            this.marked = 0
            this.step = 0
            this.rate = 4
            this.count = 1
            this.puff = 1
            this.pomlink = new LineOP(this.body, pomao.body, "red", 4)
        }
        animate() {
            let vec = new Vector(this.body, (pomao.body.x - this.body.x), (pomao.body.y - this.body.y))
            vec.normalize(1)
            this.body.xmom = (vec.xmom + (Math.random() - .5)) * 2
            this.body.ymom = ((vec.ymom * .7) + (Math.random() - .5)) * 1.41
            this.body.frictiveMove()
        }
        draw() {
            this.count++
            if (this.count > this.rate) {
                this.step++
            }
            canvas_context.drawImage(puff, ((puff.width / 4) * (this.step % 4)), 0, (puff.width / 4), puff.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
        }
    }
    class SPuff {
        constructor(x, y) {
            this.body = new Circle(x, y, 18, "red", 0, 0, .98)
            this.health = .1
            this.value = 0
            this.angle = -Math.PI / 2// Math.random()*Math.PI*2
            this.marked = 0
            this.step = 0
            this.rate = 4
            this.count = 1
            this.puff = 1
            this.pomlink = new LineOP(this.body, pomao.body, "red", 4)
        }
        animate() {
        }
        draw() {
            let vec = new Vector(this.body, (pomao.body.x - this.body.x), (pomao.body.y - this.body.y))
            vec.normalize(5)
            this.body.xmom = (vec.xmom + ((Math.random() - .5)*5)) * 2
            this.body.ymom = ((vec.ymom * .7) + (Math.random() - .5)) * 1.41
            this.body.frictiveMove()
            this.count++
            if (this.count > this.rate) {
                this.step++
            }
            canvas_context.drawImage(puff, ((puff.width / 4) * (this.step % 4)), 0, (puff.width / 4), puff.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
        }
    }
    class Egg {
        constructor(x, y) {
            this.body = new Circle(x, y, 8, "transparent", 0, 7 + Math.min(pomao.weaponLevel, 5))
            this.health = 1
            if (pomao.weaponmod == 2) {
                this.health += (pomao.weaponLevel )
            }
            this.decay = .99 + Math.min(((pomao.weaponLevel) / 1000), .005)
        }
        draw() {
            this.body.move()
            this.body.radius *= this.decay
            if (this.body.radius < 2) {
                this.marked = 1
            }
            canvas_context.drawImage(eggimg, 0, 0, eggimg.width, eggimg.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
        }
    }
    class Portal {
        constructor(x, y) {
            this.body = new Circle(x, y, 60, "black")
            this.ring = new Circle(x, y, 63, "magenta")
            this.type = Math.floor(Math.random() * 3)
            if (this.type == 0) {
                this.module = new Circle(x, y, 10, "#00ff00")
            } else if (this.type == 1) {
                this.module = new Circle(x, y, 10, "#FF0000")
            } else if (this.type == 2) {
                this.module = new Circle(x, y, 10, "#0000ff")
            }
            this.wepmod = this.type + 1
            this.moddraw = 1
        }
        mod(pomao) {
            if (pomao.weaponmod == this.wepmod) {
                pomao.weaponLevel += .5
            } else {
                pomao.weaponLevel = 1
                pomao.weaponmod = this.wepmod
            }
            return this.wepmod
        }
        draw() {
            this.ring.draw()
            this.body.draw()
            if (this.moddraw == 1) {
                this.module.draw()
            }
        }
    }
    class MoneyParticle {
        constructor(corpse) {
            this.value = (corpse.value)
            if (corpse.body2) {
                this.body = new Circle((corpse.body.x + corpse.body2.x) * .5, (corpse.body.y + corpse.body2.y) * .5 + 9, 16 + this.value, "transparent", (Math.random() - .5) * 1, 1 - (Math.random()))
            } else {
                this.body = new Circle(corpse.body.x, corpse.body.y + 9, 11 + (this.value * 2), "transparent", (Math.random() - .5) * 1, 1 - (Math.random()))
            }
            this.body.xmom += (Math.cos(corpse.angle + Math.PI)) * 1.8
            this.type = (((Math.floor(corpse.value) - 1) * 20)) + Math.floor(Math.random() * 20)// (90-(Math.floor(corpse.value/5)*10)))
            this.phase = 0
            this.step = fruits.width / 15
            this.buffer = 6
            this.count = 0
            this.x = ((fruits.width / 10) / 15) * (this.type % 10)
            this.y = (fruits.height / 10) * Math.floor(this.type / 10)
            this.width = (fruits.width / 10) / 15
            this.height = fruits.height / 10
            this.gravity = .1 + ((Math.random() - .5) * .03)
            this.maxspeed = 2.5 + ((Math.random() - .5) * .53)
            this.timeout = 0
            this.pomlink = new LineOP(this.body, pomao.body, "red", 4)
        }
        draw() {
            if(this.value == 0){
                this.marked = 1
                return
            }
            if (pomao.suction == 1) {
                if (pomao.aura.isPointInside(this.body)) {
                    this.body.xmom *= .99
                    this.body.ymom *= .99
                    this.body.xmom -= (this.body.x - pomao.body.x) / (this.pomlink.hypotenuse() * 9)
                    this.body.ymom -= (this.body.y - pomao.body.y) / (this.pomlink.hypotenuse() * 59)
                } else {
                    this.body.ymom += this.gravity
                    if (this.body.ymom > this.maxspeed) {
                        this.body.ymom = this.maxspeed
                    }
                }
            } else {
                this.body.ymom += this.gravity
                if (this.body.ymom > this.maxspeed) {
                    this.body.ymom = this.maxspeed
                }
            }
            this.count++
            if (this.buffer < this.count) {
                this.count = 0
                this.phase += this.step
                this.phase %= fruits.width
            }
            if (this.timeout != 0) {
                this.timeout++
            }
            if (this.timeout < 5) {
                if (pomao.ported == 0) {
                    this.body.move()
                }
            }
            if (this.body.doesPerimeterTouch(pomao.body) || this.body.doesPerimeterTouch(pomao.pote.body)) {
                this.marked = 1
                pomao.money += this.value
                this.value = 0
            }
            if (this.body.x - this.body.radius < pomao.walls[0].x + pomao.walls[0].width) {
                this.body.xmom *= -.9
                this.body.x = this.body.radius + pomao.walls[0].x + pomao.walls[0].width
            }
            if (this.body.x + this.body.radius > pomao.walls[1].x) {
                this.body.xmom *= -.9
                this.body.x = pomao.walls[1].x - this.body.radius
            }
            canvas_context.drawImage(fruits, this.x + this.phase, this.y, this.width, this.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
        }
    }
    class ShopItem {
        constructor(shop, pos, scale) {
            this.shop = shop
            this.dis = this.shop.body.width / 5
            this.item = {}
            this.price = 0
            this.tick = 0
            this.tock = 0
            this.type = Math.floor(Math.random() * 10)
            if (this.type == 0 && pomao.balloon < 11 && this.shop.balloon != 1) {
                this.price = 490 + (scale * 5)
                this.shop.balloon = 1
                this.item.interface = 'gravity'
                this.item.name = 'balloon'
                this.item.value = pomao.gravity - .0085
            } else if (this.type == 1) {
                this.price = 520 + (scale * 5)
                this.item.interface = 'movespeed'
                this.item.value = pomao.movespeed += .25
            } else if (this.type == 2) {
                this.price = 400 + (scale * 5)
                this.item.interface = 'maxhealth'
                this.item.value = 1
            } else if (this.type == 3 && pomao.umbrella != 1 && this.shop.umbrella != 1) {
                this.shop.umbrella = 1
                this.price = 570 + (scale * 5)
                this.item.name = 'umbrella'
                this.item.interface = 'maxgrav'
                this.item.value = pomao.maxgrav - 1.5
            } else if (this.type == 4) {
                this.price = 120 + (scale * 5)
                this.item.interface = 'health'
                this.item.value = 1
            } else if (this.type == 8 && pomao.fruitfix == 0 && this.shop.blender != 1) {
                this.shop.blender = 1
                this.price = 350
                this.item.interface = 'fruitfix'
                this.item.value = 1
                this.tick = Math.floor(Math.random() * 60)
            } else if (this.type == 9 && pomao.suction == 0 && this.shop.suction != 1) {
                this.shop.suction = 1
                this.price = 400
                this.item.interface = 'suction'
                this.item.value = 1
                this.tick + Math.floor(Math.random() * 60)
            } else if (this.type == 5 && pomao.poted != 1 && this.shop.pote != 1) {
                this.shop.pote = 1
                this.price = 600 + (scale * 5)
                this.item.interface = 'poted'
                this.item.value = 1
            } else if (this.type == 6 && !(pomao.anvil > 0) && this.shop.anvil != 1) {
                this.shop.anvil = 1
                this.price = 450 + (scale * 5)
                this.item.interface = 'anvil'
                this.item.value = 3
            } else if (this.type == 7 && !(pomao.shotcool <= 10) && this.shop.shotcool != 1) {
                this.shop.shotcool = 1
                this.price = 620 + (scale * 5)
                this.item.interface = 'shotcool'
                this.item.value = 10
            } else {
                if (Math.random() < .5 && pomao.balloon < 11 && this.shop.balloon != 1) {
                    this.type = 0
                    this.price = 490 + (scale * 5)
                    this.shop.balloon = 1
                    this.item.interface = 'gravity'
                    this.item.name = 'balloon'
                    this.item.value = pomao.gravity - .0085
                } else {
                    this.price = 170 + (scale * 10)
                    this.item.interface = 'health'
                    this.item.value = 1
                    this.type = 4
                }
            }
            this.price *= .5
            this.price = Math.floor(this.price)

            let breakwall = new Rectangle(this.shop.body.x + this.dis + (this.dis * pos) + 30, this.shop.body.y + 30, 30, 30, "#FFAADD")
            pomao.breakfloors.push(breakwall)
            pomao.floors.push(breakwall)
            let breakwall2 = new Rectangle(this.shop.body.x + this.dis + (this.dis * pos) + 60, this.shop.body.y + 30, 30, 30, "#FFAADD")
            pomao.breakfloors.push(breakwall2)
            pomao.floors.push(breakwall2)
            this.body = new Rectangle(this.shop.body.x + this.dis + (this.dis * pos) + 30, this.shop.body.y + 60, 60, 60, "transparent")
            this.body.flagged = 1
            pomao.floors.push(this.body)
        }
        draw() {
            this.body.draw()
            this.tock++
            if (this.type == 2) {
                if (this.tock >= 7) {
                    this.tick++
                    this.tock = 0
                }
                canvas_context.drawImage(pomspin, (pomspin.width / 8) * (this.tick % 6), 0, (pomspin.width / 8), heart.height, this.body.x + 16, this.body.y + 2, 28, 28)
            }
            if (this.type == 4) {
                if (this.tock > 3) {
                    this.tick++
                    this.tock = 0
                }
                canvas_context.drawImage(heart, (heart.width / 6) * (this.tick % 6), 0, (heart.width / 6), heart.height, this.body.x + 16, this.body.y + 2, 28, 28)
            }
            if (this.type == 0) {

                if (this.tock > 7) {
                    this.tick++
                    this.tock = 0
                }
                canvas_context.drawImage(baloon, (baloon.width / 11) * (this.tick % 11), 0, (baloon.width / 11), baloon.height, this.body.x + 16, this.body.y + 2, 28, 28)
            }
            if (this.type == 3) {

                if (this.tock > 7) {
                    this.tick++
                    this.tock = 0
                }
                canvas_context.drawImage(umbrella, (umbrella.width / 9) * (this.tick % 9), 0, (umbrella.width / 9), umbrella.height, this.body.x + 16, this.body.y + 2, 28, 28)
            }
            if (this.type == 1) {

                if (this.tock > 3) {
                    this.tick++
                    this.tock = 0
                }
                canvas_context.drawImage(wheel, (wheel.width / 5) * (this.tick % 5), 0, (wheel.width / 5), wheel.height, this.body.x + 16, this.body.y + 2, 28, 28)
            }




            if (this.type == 7) {

                if (this.tock > 7) {
                    this.tick++
                    this.tock = 0
                }
                canvas_context.drawImage(extraegg, (extraegg.width / 6) * (this.tick % 6), 0, (extraegg.width / 6), extraegg.height, this.body.x + 16, this.body.y + 2, 28, 28)
            }

            if (this.type == 5) {

                if (this.tock > 7) {
                    this.tick++
                    this.tock = 0
                }
                canvas_context.drawImage(pote, (pote.width / 4) * (this.tick % 4), 0, (pote.width / 4), pote.height, this.body.x + 16, this.body.y + 2, 28, 28)
            }
            if (this.type == 6) {

                if (this.tock > 7) {
                    this.tick++
                    this.tock = 0
                }
                canvas_context.drawImage(anchor, (anchor.width / 1) * (this.tick % 1), 0, (anchor.width / 1), anchor.height, this.body.x + 16, this.body.y + 2, 28, 28)
            }
            if (this.type == 8) {
                if (this.tock > 1) {
                    this.tick++
                    this.tock = 0
                }
                canvas_context.drawImage(blend, (blend.width / 63) * (this.tick % 63), 0, (blend.width / 63), blend.height, this.body.x + 16, this.body.y + 2, 28, 28)
            }
            if (this.type == 9) {
                if (this.tock > 8) {
                    this.tick++
                    this.tock = 0
                }
                canvas_context.drawImage(magnet, (magnet.width / 8) * (this.tick % 8), 0, (magnet.width / 8), magnet.height, this.body.x + 16, this.body.y + 2, 28, 28)
            }


            canvas_context.fillStyle = "Yellow"
            canvas_context.font = "30px arial"
            let dis = canvas_context.measureText(this.price).width
            canvas_context.fillText(this.price, (this.body.x + (this.body.width * .5)) - dis * .5, this.body.y + (this.body.height - 1))
        }
    }
    class Store {
        constructor(y) {
            this.body = new Rectangle(60, y, 560, 200, "transparent")
            this.body.flagged = 1
            this.inventory = []
            this.gen = 0
        }
        ingen(go) {
            for (let t = 0; t < 3; t++) {
                this.inventory.push(new ShopItem(this, t, go))
            }
            pomao.enegen(go + 1)
            this.gen = 1
        }
        draw() {
            this.body.draw()
            for (let t = 0; t < this.inventory.length; t++) {
                this.inventory[t].draw()
            }
            for (let t = 0; t < this.inventory.length; t++) {
                if (this.inventory[t].marked == 1) {
                    this.inventory[t].body.marked = 1
                    this.inventory.splice(t, 1)
                }
            }
        }
    }
    class Pote {
        constructor(pomao) {
            this.pomao = pomao
            this.body = new Circle(this.pomao.body.x, this.pomao.body.y - 40, 16, "transparent")
            this.body.friction = .98
            this.step = 0
            this.count = 0
            this.rate = 7
            this.link = new LineOP(this.body, this.pomao.body, "white", 1)
        }
        draw() {
            this.body.xmom += -(this.body.x - this.pomao.body.x) / 200
            this.body.ymom += -(this.body.y - this.pomao.body.y) / 200
            this.body.frictiveMove()
            this.link.draw()
            this.count++
            if (this.count > this.rate) {
                this.step++
                this.count = 0
            }
            for (let t = 0; t < this.pomao.enemies.length; t++) {
                if (this.pomao.enemies[t].body.doesPerimeterTouch(this.body)) {

                }
            }
            canvas_context.drawImage(pote, (pote.width / 4) * (this.step % 4), 0, pote.width / 4, pote.height, this.body.x - this.body.radius, this.body.y - this.body.radius, this.body.radius * 2, this.body.radius * 2)
        }
    }
    class Balloon {
        constructor(pomao, y, color) {
            this.pomao = pomao
            this.body = new Circle(this.pomao.body.x, this.pomao.body.y - 40, 16, color)
            this.body.friction = .95
            this.sy = y
            console.log(this.y)
            this.step = 0
            this.count = 0
            this.rate = 7
            this.link = new LineOP(this.body, this.pomao.body, "white", 1)
            this.displacement = 0
        }
        draw() {
            let displacer = ((Math.random() - .5) * 40) + ((pomao.body.x - pomao.link.object.x) * .2)
            this.body.xmom += -(this.body.x - this.pomao.body.x + (displacer - this.displacement)) / 200
            this.displacement += (displacer * .1) - ((pomao.body.x - pomao.link.object.x) * .7)
            this.displacement *= .95
            this.body.ymom += -((this.body.y) - (this.pomao.body.y - (150 + this.sy))) / 10
            this.body.frictiveMove()
            let j = 0
            while (this.body.y - pomao.body.y > -(140 - this.sy)) {
                j++
                if (j > 100000) {
                    break
                }
                this.body.y--
            }
            j = 0
            while (this.body.y - pomao.body.y < -(160 + this.sy)) {
                this.body.y++
                j++
                if (j > 100000) {
                    break
                }
            }
            // this.link.draw()
            this.x = pomao.body.x
            this.y = pomao.body.y
            this.cx = ((pomao.body.x + this.body.x) / 2) + this.displacement
            this.cy = ((pomao.body.y + this.body.y) / 2)
            this.ex = this.body.x
            this.ey = this.body.y
            canvas_context.beginPath()

            canvas_context.bezierCurveTo(this.x, this.y, this.cx, this.cy, this.ex, this.ey)

            canvas_context.fillStyle = "white"
            canvas_context.strokeStyle = "white"
            canvas_context.lineWidth = .5
            canvas_context.stroke()

            this.count++
            if (this.count > this.rate) {
                this.step++
                this.count = 0
            }
            for (let t = 0; t < this.pomao.enemies.length; t++) {
                if (this.pomao.enemies[t].body.doesPerimeterTouch(this.body)) {

                }
            }
            this.body.draw()
            // canvas_context.drawImage(pote, (pote.width / 4) * (this.step % 4), 0, pote.width / 4, pote.height, this.body.x-this.body.radius, this.body.y-this.body.radius , this.body.radius*2, this.body.radius*2)
        }
    }
    class Startmenu {
        constructor(body) {
            this.body = new Rectangle(0, body.y-640, canvas.width, canvas.height, "#090909")
            this.text = []
            this.tocks = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            this.ticks = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            this.type = 0
            this.startbutton = new Rectangle(250, this.body.y+120, 220, 120, "black")
            this.startbutton.flagged = 1
            this.view = -1
            this.seeother = new Rectangle(400, this.body.y+320, 220, 120, "black")
            this.seeother.flagged = 1
            this.start1 = 0
            this.start2 = 0
        }
        draw() {

            this.seeother = new Rectangle(400, this.body.y+320, 220, 120, "black")
            this.startbutton = new Rectangle(250, this.body.y+120, 220, 120, "black")
            this.seeother.flagged = 1
            this.startbutton.flagged = 1
            this.body.draw()
            this.startbutton.draw()
            this.seeother.draw()
            canvas_context.font = "80px arial"
            canvas_context.fillStyle = "yellow"
            canvas_context.fillText("Start", this.startbutton.x + 20, this.startbutton.y + 90)
            canvas_context.font = "30px arial"
            canvas_context.fillStyle = "yellow"
            canvas_context.fillText("WASD and Space to play", 40, 40)
            canvas_context.fillText("Or controller or click/tap", 40, 70)

            if (this.view == -1) {
                canvas_context.font = "80px arial"
                canvas_context.fillStyle = "yellow"
                canvas_context.fillText("Foes", this.seeother.x + 20, this.seeother.y + 90)

                canvas_context.font = "48px arial"
                canvas_context.fillStyle = "yellow"
                canvas_context.fillText("Store Items:", this.body.x + 46, this.body.y + 522.5 + (-100))
                canvas_context.font = "20px arial"
                canvas_context.fillStyle = "yellow"
                for (this.type = 0; this.type < 9; this.type++) {

                    this.tocks[this.type]++
                    if (this.type == 2) {
                        if (this.tocks[this.type] >= 7) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(pomspin, (pomspin.width / 8) * (this.ticks[this.type] % 6), 0, (pomspin.width / 8), heart.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("Max health upgrade", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))
                    }
                    if (this.type == 4) {
                        if (this.tocks[this.type] > 3) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(heart, (heart.width / 6) * (this.ticks[this.type] % 6), 0, (heart.width / 6), heart.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("Restore health", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    }
                    if (this.type == 0) {

                        if (this.tocks[this.type] > 7) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(baloon, (baloon.width / 11) * (this.ticks[this.type] % 11), 0, (baloon.width / 11), baloon.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("A balloon to reduce your acceleration, get 11 to win!", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    }
                    if (this.type == 3) {

                        if (this.tocks[this.type] > 7) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(umbrella, (umbrella.width / 9) * (this.ticks[this.type] % 9), 0, (umbrella.width / 9), umbrella.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("An umbrella to decrease your terminal velocity", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    }
                    if (this.type == 1) {

                        if (this.tocks[this.type] > 3) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(wheel, (wheel.width / 5) * (this.ticks[this.type] % 5), 0, (wheel.width / 5), wheel.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("Wheels to move side to side faster", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))
                    }




                    if (this.type == 7) {

                        if (this.tocks[this.type] > 7) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(extraegg, (extraegg.width / 6) * (this.ticks[this.type] % 6), 0, (extraegg.width / 6), extraegg.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("Increase your shooting by two-fold", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    }

                    if (this.type == 5) {

                        if (this.tocks[this.type] > 7) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(pote, (pote.width / 4) * (this.ticks[this.type] % 4), 0, (pote.width / 4), pote.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("Pote will help you collect more juice and beat guys up for you", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    }
                    if (this.type == 6) {

                        if (this.tocks[this.type] > 7) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(anchor, (anchor.width / 1) * (this.ticks[this.type] % 1), 0, (anchor.width / 1), anchor.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("An anchor, to defend yourself with", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    }
                    if (this.type == 8) {
                        if (this.tocks[this.type] > 1) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(blend, (blend.width / 63) * (this.ticks[this.type] % 63), 0, (blend.width / 63), blend.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("Get more use out of fruits, get one ammo for nine collected", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    }
                    if (this.type == 9) {
                        if (this.tocks[this.type] > 8) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(magnet, (magnet.width / 8) * (this.ticks[this.type] % 8), 0, (magnet.width / 8), magnet.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("Fruit magnet, collect at a distance", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    }
                }

            } else {
                canvas_context.font = "80px arial"
                canvas_context.fillStyle = "yellow"
                canvas_context.fillText("Items", this.seeother.x + 20, this.seeother.y + 90)

                canvas_context.font = "48px arial"
                canvas_context.fillStyle = "yellow"
                canvas_context.fillText("Enemies:", this.body.x + 46, this.body.y + 522.5 + (-100))
                canvas_context.font = "20px arial"
                canvas_context.fillStyle = "yellow"
                for (this.type = 0; this.type < 9; this.type++) {

                    this.tocks[this.type]++
                    if (this.type == 2) {
                        if (this.tocks[this.type] >= 7) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(targoy, (targoy.width / 1) * (this.ticks[this.type] % 1), 0, (targoy.width / 1), targoy.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("Pit-targoy, bounce on these in both of their two forms, 2 or 3 health", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))
                    }
                    if (this.type == 4) {
                        if (this.tocks[this.type] > 3) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(targoy2, (targoy2.width / 1) * (this.ticks[this.type] % 1), 0, (targoy2.width / 1), targoy2.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("Ethereal", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    }
                    if (this.type == 0) {

                        if (this.tocks[this.type] > 7) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(cactusr, (cactusr.width / 1) * (this.ticks[this.type] % 1), 0, (cactusr.width / 1), cactusr.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("Cave Cactus, don't bounce on these, 4 health", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    }
                    if (this.type == 3) {

                        if (this.tocks[this.type] > 7) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(puff, (puff.width / 4) * (this.ticks[this.type] % 4), 0, (puff.width / 4), puff.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("A fearsome cloud that must be shot apart, immune to anchor, 0 health", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    }
                    if (this.type == 1) {

                        if (this.tocks[this.type] > 3) {
                            this.ticks[this.type]++
                            this.tocks[this.type] = 0
                        }
                        canvas_context.drawImage(beamman, (beamman.width / 1) * (this.ticks[this.type] % 1), 0, (beamman.width / 1), beamman.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                        canvas_context.fillText("Don't cross the beam, bounce on the orb instead. 3 health", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))
                    }




                    // if (this.type == 7) {

                    //     if (  this.tocks[this.type]  > 7) {
                    //         this.ticks[this.type]++
                    //         this.tocks[this.type] = 0
                    //     }
                    //     canvas_context.drawImage(extraegg, (extraegg.width / 6) * (this.ticks[this.type] % 6), 0, (extraegg.width / 6), extraegg.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                    //     canvas_context.fillText("Increase your shooting by two-fold", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    // }

                    // if (this.type == 5) {

                    //     if (  this.tocks[this.type]  > 7) {
                    //         this.ticks[this.type]++
                    //         this.tocks[this.type] = 0
                    //     }
                    //     canvas_context.drawImage(pote, (pote.width / 4) * (this.ticks[this.type] % 4), 0, (pote.width / 4), pote.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                    //     canvas_context.fillText("Pote will help you collect more poney and beat guys up for you", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    // }
                    // if (this.type == 6) {

                    //     if (  this.tocks[this.type]  > 7) {
                    //         this.ticks[this.type]++
                    //         this.tocks[this.type] = 0
                    //     }
                    //     canvas_context.drawImage(anchor, (anchor.width / 1) * (this.ticks[this.type] % 1), 0, (anchor.width / 1), anchor.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                    //     canvas_context.fillText("An anchor, to defend yourself with", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    // }
                    // if (this.type == 8) {
                    //     if (  this.tocks[this.type]  > 1) {
                    //         this.ticks[this.type]++
                    //         this.tocks[this.type] = 0
                    //     }
                    //     canvas_context.drawImage(blend, (blend.width / 63) * (this.ticks[this.type] % 63), 0, (blend.width / 63), blend.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                    //     canvas_context.fillText("Get more use out of fruits, get one ammo for nine collected", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    // }
                    // if (this.type == 9) {
                    //     if (  this.tocks[this.type]  > 8) {
                    //         this.ticks[this.type]++
                    //         this.tocks[this.type] = 0
                    //     }
                    //     canvas_context.drawImage(magnet, (magnet.width / 8) * (this.ticks[this.type] % 8), 0, (magnet.width / 8), magnet.height, this.body.x + 16, this.body.y + 480 + (this.type * 80), 56, 56)
                    //     canvas_context.fillText("Fruit magnet, collect at a distance", this.body.x + 86, this.body.y + 522.5 + (this.type * 80))

                    // }
                }






            }

            this.startbutton.y = 120
            this.seeother.y = 320
        }
    }

    class Boss {
        constructor(floors, index) {
            this.floors = floors
            this.floor = this.floors[index]
            this.index = index
            this.body = new Circle(360, this.floors[index].y-270, 100, "red")
            this.trigger = new Rectangle(0, this.body.y - 1700, 720, 9080, "transparent")
            this.trigger2 = new Rectangle(0, this.body.y - 3700, 720, 9080, "transparent")
            this.step = 0
            this.health = 100000
            this.maxhealth = this.health
            this.snaps = 0
        }
        snap(){
            if(this.snaps == 0){
                this.floors[pomao.floors.indexOf(this.floor)-1].x = pomao.walls[0].x+10
                this.floors[pomao.floors.indexOf(this.floor)-1].width = 560
                this.floors[pomao.floors.indexOf(this.floor)-1].y+=30
                this.floors[pomao.floors.indexOf(this.floor)].x = pomao.walls[0].x+10
                this.floors[pomao.floors.indexOf(this.floor)].width = 560
                this.floors[pomao.floors.indexOf(this.floor)].y+=30
                this.snaps = 1
            }
        }
        draw() {
            if(this.trigger2.doesPerimeterTouch(pomao.body)){
                this.snap()
            }else{
                return
            }
            if(this.health < 0){
                return
            }
            if(this.body.isPointInside(pomao.anvilball)){
                this.health-= 400
            }
            // this.floor.x = pomao.walls[0].x+10
            // this.floor.width=560
            // pomao.gravity = .21
            pomao.hit = -1000
            // pomao.echo.x -=3
            pomao.echo.y -=3
            this.healthbar = new Rectangle(pomao.walls[1].x + 30, pomao.body.y - pomao.ydelay + 130 + 50, 50, 200, "#00FFFF")
            this.healthbar2 = new Rectangle(pomao.walls[1].x + 30, pomao.body.y - pomao.ydelay + 130 + 50, 50, 200, "transparent")
            this.healthbar2.flagged = 1
            this.healthbar.y+=(1-(this.health/this.maxhealth))*this.healthbar2.height
            this.healthbar.height-=(1-(this.health/this.maxhealth))*this.healthbar2.height
            this.healthbar2.draw()
            this.healthbar.draw()
            this.step++
            // this.body.draw()
            if (this.trigger.isPointInside(pomao.body)) {
                this.body.x = Math.max(Math.min(pomao.body.x, 450), 230)
                if (this.step % 3 == 0) {
                    let puff = new SPuff(this.body.x, this.body.y - 90)
                    pomao.enemies.push(puff)
                }
                if (Math.random() < .5) {
                    if (this.step % 100 == 0) {
                        let puff = new DScalegoy(this.body.x + 200, this.body.y - 30)
                        pomao.enemies.push(puff)
                    }
                } else {
                    if (this.step % 100 == 0) {
                        let puff = new DScalegoy(this.body.x - 200, this.body.y - 30)
                        pomao.enemies.push(puff)
                    }
                }

                if (this.step % 14 == 0) {
                    let puff = new SWallBeam(Math.sign(Math.random()-.5), this.body.y + 230)
                    pomao.enemies.push(puff)
                }
            }
            if (this.body.x < 360) {
                canvas_context.drawImage(pomsatan, 0, 0, pomsatan.width, pomsatan.height, this.body.x - (this.body.radius * 2), this.body.y - (this.body.radius * 1), this.body.radius * 4, this.body.radius * 4)
            } else {
                canvas_context.drawImage(pomsatanl, 0, 0, pomsatanl.width, pomsatanl.height, this.body.x - (this.body.radius * 2), this.body.y - (this.body.radius * 1), this.body.radius * 4, this.body.radius * 4)
            }

            for(let t = 0;t<pomao.shots.length;t++){
                if(this.body.doesPerimeterTouch(pomao.shots[t].body)){
                    this.health-=pomao.shotstrength
                    pomao.shots[t].marked = 0
                }
            }
        }
    }
    class Pomao {
        constructor() {
            this.started = 0
            this.totalbonks = 0
            this.hit = 0
            this.anvilball = new Circle(0, 0, 0, "transparent")
            this.swing = 0
            this.cycle = 0
            this.anvilangle = 0
            this.echo = {}
            this.echo.x = 360
            this.echo.y = 640
            this.breatheangle = 0
            this.maxgrav = 5
            this.breathe = -1.5
            this.breathecap = 3
            this.kdepth = 0
            this.tap = {}
            this.utap = {}
            this.angle = 0
            this.body = new Circle(360, 640 + (1578*0) , 10, "yellow")//+ (1578*500)
            this.startmenu = new Startmenu(this.body)
            this.body.sxmom = 0
            this.body.symom = 0
            this.body.sfriction = .975
            this.spinspeed = .05
            this.dir = -1
            this.gravity = .17
            this.floors = []
            this.walls = [new Rectangle(50, -1000, 10, 1000000000000, "#0099FF"), new Rectangle(620, -1000, 10, 1000000000000, "#0099FF")]
            this.ydelay = 0
            this.movespeed = 3
            this.enemies = []
            this.wobble = -1
            this.shots = []
            this.shottime = 0
            this.shotcool = 20
            this.ammo = 6
            this.anvil = 0
            this.poted = 0
            this.ammocap = this.ammo
            this.combo = 0
            this.fruitfix = 0
            this.fruitcount = 0
            this.health = 4
            this.maxhealth = this.health
            this.shotstrength = 1
            this.walled = 0
            this.ported = 0
            this.money = 0
            this.moneyparticles = []
            this.shops = []
            this.weaponmod = 0
            this.weaponLevel = 0
            this.inventory = []
            this.pote = new Pote(this)
            this.balloonover = [new Balloon(this, ((Math.random() - .5) * 70), "#ff0000"), new Balloon(this, ((Math.random() - .5) * 70), "#FFaa00"), new Balloon(this, ((Math.random() - .5) * 70), "#FFff00"), new Balloon(this, ((Math.random() - .5) * 70), "#aaFF00"), new Balloon(this, ((Math.random() - .5) * 70), "#00ff00"), new Balloon(this, ((Math.random() - .5) * 70), "#00ffaa"), new Balloon(this, ((Math.random() - .5) * 70), "#00ffff"), new Balloon(this, ((Math.random() - .5) * 70), "#00aaff"), new Balloon(this, ((Math.random() - .5) * 70), "#0000ff"), new Balloon(this, ((Math.random() - .5) * 70), "#aa00ff"), new Balloon(this, ((Math.random() - .5) * 70), "#FF00aa"), new Balloon(this, ((Math.random() - .5) * 70), "#FF00FF")]
            this.suction = 0
            this.aura = new Circle(this.body.x, this.body.y, 170, "#FFFFAA22")
            this.balloon = 0 //11 //this.balloonover.length
            this.umbrella = 0
            // for (let t = 0; t < 10; t++) {
            //     this.balloonover.push(new Balloon(this, ((Math.random() - .5) * 80), getRandomColor() + ''))
            // }
            this.florgen()
        }
        movetap() {
            if (this.utap.y != this.tap.y || this.utap.x != this.tap.x) {
                if (this.walled == 1) {
                    this.walled = 0
                    hop.play()
                    this.body.ymom -= 4
                    if (this.body.x < 640) {
                        this.body.xmom = 5
                    } else {
                        this.body.xmom = -5
                    }
                }
                if (this.grounded == 1) {
                    hop.play()
                    this.body.ymom -= 4
                }
            }
            let disp = canvas_context.getTransform().e
            this.tap = this.utap
            for (let t = 0; t < 1000; t++) {
                this.body.x += (this.movespeed / 1000) * Math.sign(this.utap.x - (this.body.x - disp))
            }
            this.dir = Math.sign(this.utap.x - (this.body.x - disp))
        }
        shoot() {
            if (this.weaponmod == 0) {
                this.shotstrength = 1
                if (this.shottime <= 0 && this.ammo > 0) {
                    let shot = new Egg(this.body.x, this.body.y)
                    if (this.body.ymom <= -((this.shotcool * this.gravity) - 4)) {
                    } else {
                        this.body.ymom -= 3.49
                    }
                    for (let t = 0; t < sounds.length; t++) {
                        if (sounds[t].paused) {
                            sounds[t].playbackRate = Math.min((2 / ((this.ammo + 5) / this.ammocap)), 4)
                            sounds[t].play()
                            break
                        }
                    }
                    this.shots.push(shot)
                    this.shottime = this.shotcool
                    this.ammo--
                }
            } else if (this.weaponmod == 1) {
                this.shotstrength = .95 * this.weaponLevel
                if (this.shottime <= 0 && this.ammo > 0) {
                    this.weaponLevel = ((this.weaponLevel) * 2) + 1

                    for (let k = -((Math.floor((1 + (this.weaponLevel) / 2))) - 1); k < (Math.floor((1 + (this.weaponLevel) / 2))); k++) {
                        let shot = new Egg(this.body.x, this.body.y)
                        shot.body.xmom += (k * .3)
                        if (this.body.ymom <= -((this.shotcool * this.gravity) - (3 - Math.min((this.weaponLevel - 1), 2.9)))) {
                        } else {
                            this.body.ymom -= (3.9 + Math.min(((this.weaponLevel - 1) * .5), 1)) / ((Math.floor((1 + (this.weaponLevel) / 2))) + ((Math.floor((1 + (this.weaponLevel) / 2))) - 1))
                        }
                        for (let t = 0; t < sounds.length; t++) {
                            if (sounds[t].paused) {
                                sounds[t].playbackRate = Math.min((.9 / ((this.ammo + 5) / this.ammocap)), 4)
                                sounds[t].play()
                                break
                            }
                        }
                        this.shots.push(shot)
                    }

                    this.weaponLevel = ((this.weaponLevel - 1) * .5)


                    this.shottime = this.shotcool
                    this.ammo -= this.weaponLevel
                }
            } else if (this.weaponmod == 2) {
                this.shotstrength = 3 *( this.weaponLevel*2)
                if (this.shottime <= 0 && this.ammo > 0) {
                    let shot = new Egg(this.body.x, this.body.y)
                    shot.body.radius *= 2 + ((this.weaponLevel - 1) / 2)
                    if (this.body.ymom <= -((this.shotcool * this.gravity) - (2.5 - Math.min((this.weaponLevel - 1) * .3, -1)))) {
                    } else {
                        this.body.ymom -= (3.8) + Math.min(((this.weaponLevel - 1) * .5), 1)
                    }
                    for (let t = 0; t < sounds.length; t++) {
                        if (sounds[t].paused) {
                            sounds[t].playbackRate = Math.min((.7 / ((this.ammo + 1) / this.ammocap)), 4)
                            sounds[t].play()
                            break
                        }
                    }
                    this.shots.push(shot)
                    this.shottime = this.shotcool
                    this.ammo -= this.weaponLevel
                }
            } else if (this.weaponmod == 3) {
                this.shotstrength = .51 * this.weaponLevel
                let angle = 0
                if (this.shottime <= 0 && this.ammo > 0) {
                    for (let t = 0; t < Math.floor(this.weaponLevel * 5); t++) {
                        angle += (Math.PI * 2) / Math.floor(this.weaponLevel * 5)
                        let shot = new Egg(this.body.x, this.body.y)
                        shot.body.radius *= (.607) + (this.weaponLevel / 5)
                        shot.body.ymom += Math.cos(angle) * (1 + (this.weaponLevel / 5))
                        shot.body.xmom += Math.sin(angle) * (1 + (this.weaponLevel / 5))

                        if (this.body.ymom <= -((this.shotcool * this.gravity) - (3 - Math.min((this.weaponLevel - 1) * .2, 3)))) {
                        } else {
                            this.body.ymom -= .5 + (this.weaponLevel / 200)
                        }
                        for (let t = 0; t < sounds.length; t++) {
                            if (sounds[t].paused) {
                                sounds[t].playbackRate = Math.min(((Math.random() * .5) + .7) / ((this.ammo + 2) / this.ammocap), 4)
                                sounds[t].play()
                                break
                            }
                        }
                        this.shots.push(shot)
                        this.shottime = this.shotcool
                    }
                    this.ammo -= this.weaponLevel
                }
            }
            if (this.ammo <= 0) {
                this.ammo = 0
            }
        }
        storeCheck() {
            let pet = 0
            for (let t = 0; t < this.shops.length; t++) {
                this.shops[t].draw()
                if (this.shops[t].body.isPointInside(this.body)) {
                    if (this.shops[t].gen == 0) {
                        this.shops[t].ingen(t)
                    }
                    pet = 1
                }
                for (let k = 0; k < this.shots.length; k++) {
                    for (let v = 0; v < this.shops[t].inventory.length; v++) {
                        if (this.shops[t].inventory[v].body.doesPerimeterTouch(this.shots[k].body)) {
                            if (this.money >= this.shops[t].inventory[v].price && this.shops[t].inventory[v].marked != 1) {
                                this.shops[t].inventory[v].marked = 1
                                this.inventory.push(this.shops[t].inventory[v].item)
                                this.money -= this.shops[t].inventory[v].price
                            }
                            break
                        }
                    }
                }
            }
            if (this.ported == 0 && pet == 1) {
                this.ported = 1
                this.body.sxmom = 0
                this.body.symom = 0
            } else if (pet == 1) {
                this.ported = 1
            } else {
            }
        }
        enegen(go) {
            this.moneyparticles = []
            this.enemies = []
            for (let k = go; k < go + 1; k++) {
                for (let d = 0; d < 1; d++) {
                    for (let t = 0; t < -7 + (k * 2); t++) {
                        let targoy = new Puff(this.walls[0].x + (Math.random() * 560), 700 + (Math.random() * 15500) + (15500 * k))
                        this.enemies.push(targoy)
                    }
                    for (let t = 0; t < 14 + (k * 1.5); t++) {
                        let targoy = new Targoy(this.walls[0].x + (Math.random() * 560), 700 + (Math.random() * 15500) + (15500 * k))
                        this.enemies.push(targoy)
                    }
                    for (let t = 0; t < 1 + (1.5 * k); t++) {
                        let targoy = new Trampoline(this.walls[0].x + (Math.random() * 560), 700 + (Math.random() * 15500) + (15500 * k))
                        this.enemies.push(targoy)
                    }
                    for (let t = 0; t < 1 + (k * .5); t++) {
                        let targoy = new Scalegoy(this.walls[0].x + (Math.random() * 560), 700 + (Math.random() * 15500) + (15500 * k))
                        this.enemies.push(targoy)
                    }
                    for (let t = 0; t < 2 + (k * .7); t++) {
                        let targoy = new WallGuy(Math.sign(Math.random() - .5), 700 + (Math.random() * 15500) + (15500 * k))
                        this.enemies.push(targoy)
                    }
                    for (let t = 0; t < 2 + (k * .5); t++) {
                        let targoy = new WallBeam(Math.sign(Math.random() - .5), 700 + (Math.random() * 15500) + (15500 * k))
                        this.enemies.push(targoy)
                    }
                }
            }
        }
        florgen() {
            
            this.breakfloors = []
            let x = this.walls[0].x + this.walls[0].width
            let y = 1500
            let width = 260
            let height = 10
            for (let t = 1; t < 1580; t++) {
                let truex = x + Math.floor(Math.random() * (300 / 30)) * 30
                let floor = new Rectangle(truex, y, width, height, "#FF9900")
                floor.port = 0
                if (t % 31 == 0) {
                    let shop = new Store(y - 200)
                    this.shops.push(shop)
                } else {
                    if (t % 7 == 6) {
                        floor.port = 1
                        floor.portal = new Portal(floor.x + (floor.width * .5), floor.y - 58)
                    } else {
                        if (Math.random() < .1 + (t / 1580) && t < 1570 && t > 10) {
                            if (truex <= x + (30 * 4)) {
                                while (truex > x) {
                                    truex -= 30
                                    let breakwall = new Rectangle(truex, floor.y, 30, 30, "#FFAA44")
                                    this.breakfloors.push(breakwall)
                                    this.floors.push(breakwall)
                                }
                            } else if (truex + floor.width < (this.walls[1].x + (30 * 4))) {
                                while (truex + floor.width < (this.walls[1].x)) {
                                    let breakwall = new Rectangle(truex + floor.width, floor.y, 30, 30, "#FFAA44")
                                    truex += 30
                                    this.breakfloors.push(breakwall)
                                    this.floors.push(breakwall)
                                }
                            }
                        } else if (Math.random() < .1 - ((t / 1580) * .05)) {
                        }
                    }
                }
                this.floors.push(floor)
                y += 500
            }

            this.boss = new Boss(this.floors, this.floors.length-2)//this.floors.length-

        }
        enemyCheck() {
            for (let t = 0; t < this.enemies.length; t++) {
                if (Math.abs(this.enemies[t].body.y - this.body.y) < 750 || pomao.boss.trigger2.isPointInside(pomao.body)) {
                    this.enemies[t].draw()
                    if (this.ported == 0) {
                        if (Math.abs(this.enemies[t].body.y - this.body.y) < 400) {
                            this.enemies[t].animate()
                        }
                    }
                    if (this.enemies[t].pomlink.hypotenuse() > 1500) {
                        continue
                    }
                    if (this.enemies[t].puff == 1) {
                        if (this.enemies[t].body.doesPerimeterTouch(this.body)) {
                            this.enemies[t].marked = 1
                            if (this.hit <= 0) {
                                this.health--
                                this.hit = 50
                            }
                            this.body.ymom *= 0
                            this.body.ymom += 4
                        } else if (this.enemies[t].body.doesPerimeterTouch(this.pote.body)) {
                            this.enemies[t].marked = 1
                            this.enemies[t].angle = (new LineOP(this.body, this.enemies[t].body)).angle()
                            this.body.ymom *= 0
                            this.body.ymom -= 4
                            this.ammo = this.ammocap
                            this.combo++
                            this.totalbonks++
                        }

                        for (let k = 0; k < this.shots.length; k++) {
                            if (this.enemies[t].body.submark != 1) {
                                if (typeof this.enemies[t].body.target != 'undefined') {
                                } else {
                                    if (this.shots[k].body.doesPerimeterTouch(this.enemies[t].body)) {
                                        this.shots[k].health--
                                        if (this.shots[k].health <= 0) {
                                            this.shots[k].marked = 1
                                        }
                                        this.enemies[t].body.y += this.shots[k].body.ymom * 4
                                        this.enemies[t].health -= this.shotstrength
                                        if (this.enemies[t].health <= 0) {
                                            this.combo++
                                            this.totalbonks++
                                            if (typeof this.enemies[t].body2 != 'undefined') {
                                                this.enemies[t].body.submark = 1
                                                this.enemies[t].marked += .5
                                            } else {
                                                this.enemies[t].marked = 1
                                            }
                                        }
                                    }
                                }
                            }
                            if (typeof this.enemies[t].body2 != 'undefined') {
                                if (this.enemies[t].body2.submark != 1) {
                                    if (this.shots[k].body.doesPerimeterTouch(this.enemies[t].body2)) {
                                        this.shots[k].health--
                                        if (this.shots[k].health <= 0) {
                                            this.shots[k].marked = 1
                                        }
                                        this.enemies[t].body2.y += this.shots[k].body.ymom * 4
                                        this.enemies[t].health2 -= this.shotstrength
                                        if (this.enemies[t].health2 <= 0) {
                                            this.enemies[t].body2.submark = 1
                                            this.combo++
                                            this.totalbonks++
                                            this.enemies[t].marked += .5
                                        }
                                    }
                                }
                            }
                        }
                        continue
                    }
                    if (typeof this.enemies[t].link != 'undefined') {
                        if (this.enemies[t].link.intersects(this.link)) {
                            this.enemies[t].marked = 1
                            if (this.hit <= 0) {
                                this.health--
                                this.hit = 50
                            }
                            this.body.ymom *= 0
                            this.body.ymom += 4
                        }
                    }
                    if (typeof this.enemies[t].body2 != 'undefined') {
                        if (this.enemies[t].body2.submark != 1) {

                            if (this.enemies[t].body2.doesPerimeterTouch(this.pote.body)) {
                                this.enemies[t].body2.submark = 1
                                this.enemies[t].marked += .5
                                this.enemies[t].angle = (new LineOP(this.body, this.enemies[t].body2)).angle()
                                this.body.ymom *= 0
                                this.body.ymom -= 4
                                this.ammo = this.ammocap
                                this.combo++
                                this.totalbonks++
                            } else if (this.enemies[t].body2.doesPerimeterTouch(this.anvilball)) {
                                this.enemies[t].body2.submark = 1
                                this.enemies[t].marked += .5
                                this.enemies[t].angle = (new LineOP(this.body, this.enemies[t].body2)).angle()
                                // this.body.ymom *= 0
                                // this.body.ymom -= 4
                                // this.ammo = this.ammocap
                                this.combo++
                                this.totalbonks++
                            } else if (this.enemies[t].body2.doesPerimeterTouch(this.body)) {
                                if (this.body.y < this.enemies[t].body2.y + 3 && this.enemies[t].cactus != 1) {  //-
                                    this.enemies[t].body2.submark = 1
                                    this.enemies[t].marked += .5
                                    this.enemies[t].angle = (new LineOP(this.body, this.enemies[t].body2)).angle()
                                    this.body.ymom *= 0
                                    this.body.ymom -= 4
                                    this.ammo = this.ammocap
                                    this.combo++
                                    this.totalbonks++
                                } else {
                                    if (this.enemies[t].cactus == 1) {
                                        this.body.ymom *= 0
                                        this.body.ymom -= 2
                                    } else {
                                        this.body.ymom *= 0
                                        this.body.ymom += 4
                                    }
                                    this.enemies[t].body2.submark = 1
                                    this.enemies[t].marked += .5
                                    if (this.hit <= 0) {
                                        this.health--
                                        this.hit = 50
                                    }
                                }
                            }
                        }
                    }
                    if (this.enemies[t].body.submark != 1) {

                        if (this.enemies[t].body.doesPerimeterTouch(this.pote.body)) {
                            if (typeof this.enemies[t].body2 != 'undefined') {
                                this.enemies[t].body.submark = 1
                                this.enemies[t].marked += .5
                            } else {
                                this.enemies[t].marked = 1
                            }
                            this.enemies[t].angle = (new LineOP(this.body, this.enemies[t].body)).angle()
                            this.body.ymom *= 0
                            this.body.ymom -= 4
                            this.ammo = this.ammocap
                            this.combo++
                            this.totalbonks++
                        } else if (this.enemies[t].body.doesPerimeterTouch(this.anvilball)) {
                            if (typeof this.enemies[t].body2 != 'undefined') {
                                this.enemies[t].body.submark = 1
                                this.enemies[t].marked += .5
                            } else {
                                this.enemies[t].marked = 1
                            }
                            this.enemies[t].angle = (new LineOP(this.body, this.enemies[t].body)).angle()
                            // this.body.ymom *= 0
                            // this.body.ymom -= 4
                            // this.ammo = this.ammocap
                            this.combo++
                            this.totalbonks++
                        } else if (this.enemies[t].body.doesPerimeterTouch(this.body)) {
                            if (this.body.y < this.enemies[t].body.y + 3 && this.enemies[t].cactus != 1) {
                                if (typeof this.enemies[t].body2 != 'undefined') {
                                    this.enemies[t].body.submark = 1
                                    this.enemies[t].marked += .5
                                } else {
                                    this.enemies[t].marked = 1
                                }
                                this.enemies[t].angle = (new LineOP(this.body, this.enemies[t].body)).angle()
                                this.body.ymom *= 0
                                this.body.ymom -= 4
                                this.ammo = this.ammocap
                                this.combo++
                                this.totalbonks++
                            } else {
                                if (this.enemies[t].cactus == 1) {
                                    this.body.ymom *= 0
                                    this.body.ymom -= 2
                                } else {
                                    this.body.ymom *= 0
                                    this.body.ymom += 4
                                }
                                if (typeof this.enemies[t].body2 != 'undefined') {
                                    this.enemies[t].body.submark = 1
                                    this.enemies[t].marked += .5
                                } else {
                                    this.enemies[t].marked = 1
                                }
                                if (this.hit <= 0) {
                                    this.health--
                                    this.hit = 50
                                }
                            }
                        }
                    }
                    for (let k = 0; k < this.shots.length; k++) {
                        if (this.enemies[t].body.submark != 1) {
                            if (typeof this.enemies[t].body.target != 'undefined') {
                            } else {
                                if (this.shots[k].body.doesPerimeterTouch(this.enemies[t].body)) {
                                    this.shots[k].health--
                                    if (this.shots[k].health <= 0) {
                                        this.shots[k].marked = 1
                                    }
                                    this.enemies[t].body.y += this.shots[k].body.ymom * 4
                                    this.enemies[t].health -= this.shotstrength
                                    if (this.enemies[t].health <= 0) {
                                        this.combo++
                                        this.totalbonks++
                                        if (typeof this.enemies[t].body2 != 'undefined') {
                                            this.enemies[t].body.submark = 1
                                            this.enemies[t].marked += .5
                                        } else {
                                            this.enemies[t].marked = 1
                                        }
                                    }
                                }
                            }
                        }
                        if (typeof this.enemies[t].body2 != 'undefined') {
                            if (this.enemies[t].body2.submark != 1) {
                                if (this.shots[k].body.doesPerimeterTouch(this.enemies[t].body2)) {
                                    this.shots[k].health--
                                    if (this.shots[k].health <= 0) {
                                        this.shots[k].marked = 1
                                    }
                                    this.enemies[t].body2.y += this.shots[k].body.ymom * 4
                                    this.enemies[t].health2 -= this.shotstrength
                                    if (this.enemies[t].health2 <= 0) {
                                        this.enemies[t].body2.submark = 1
                                        this.combo++
                                        this.totalbonks++
                                        this.enemies[t].marked += .5
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (let t = 0; t < this.enemies.length; t++) {
                if (this.enemies[t].marked == 1) {
                    this.spinspeed *= 1.001
                    if(this.enemies[t].value != 0){
                        this.moneyparticles.push(new MoneyParticle(this.enemies[t]))
                        this.moneyparticles.push(new MoneyParticle(this.enemies[t]))
                        this.moneyparticles.push(new MoneyParticle(this.enemies[t]))
                        this.moneyparticles.push(new MoneyParticle(this.enemies[t]))
                        this.moneyparticles.push(new MoneyParticle(this.enemies[t]))
                        this.moneyparticles.push(new MoneyParticle(this.enemies[t]))
                        this.moneyparticles.push(new MoneyParticle(this.enemies[t]))
                        this.moneyparticles.push(new MoneyParticle(this.enemies[t]))
                        this.moneyparticles.push(new MoneyParticle(this.enemies[t]))
                    }
                    pop.play()
                    this.enemies.splice(t, 1)
                }
            }
            for (let t = 0; t < this.shots.length; t++) {
                if (this.shots[t].marked == 1) {
                    this.shots.splice(t, 1)
                }
            }
        }
        floorCheck() {
            let pet = 0
            let wet = 0
            let dir = this.angle - (this.spinspeed * this.dir)
            let fet = 0
            for (let t = 0; t < this.walls.length; t++) {
                if (this.walls[t].doesPerimeterTouch(this.body)) {
                    if (t == 0) {
                        fet = 1
                        this.body.xmom = 0
                        this.body.x = this.walls[t].x + this.walls[t].width + this.body.radius
                    } else {
                        fet = 1
                        this.body.xmom = 0
                        this.body.x = this.walls[t].x - this.body.radius
                    }
                }
            }
            if (this.walled == 0 && fet == 1) {
                if (keysPressed['w'] || gamepadAPI.buttonsStatus.includes('A')) {
                    hop.play()
                    this.body.ymom -= 4
                    if (this.body.x < 360) {
                        this.body.xmom = 6
                    } else {
                        this.body.xmom = -6
                    }
                }
            }
            for (let t = 0; t < this.floors.length; t++) {
                if (this.floors[t].marked == 1) {
                    this.floors.splice(t, 1)
                }
            }
            for (let t = 0; t < this.breakfloors.length; t++) {
                // this.breakfloors[t].marked = 1
                for (let k = 0; k < this.shots.length; k++) {
                    if (this.breakfloors[t].doesPerimeterTouch(this.shots[k].body)) {
                        this.breakfloors[t].marked = 1
                        this.shots[k].health--
                        if (this.shots[k].health <= 0) {
                            this.shots[k].marked = 1
                        }
                    }
                }
            }
            for (let t = 0; t < this.breakfloors.length; t++) {
                if (this.breakfloors[t].marked == 1) {
                    this.breakfloors.splice(t, 1)
                }
            }
            for (let t = 0; t < this.floors.length; t++) {
                if (Math.abs(this.floors[t].y - this.body.y) > 800 && (Math.abs(this.floors[t].y - this.body.y) > 700 || this.floors[t].port == 1)) {
                    continue
                } else {
                    for (let k = 0; k < this.moneyparticles.length; k++) {
                        if (this.floors[t].doesPerimeterTouch(this.moneyparticles[k].body)) {
                            if (this.floors[t].y > this.moneyparticles[k].body.y) {
                                this.moneyparticles[k].body.xmom *= .9
                                this.moneyparticles[k].body.ymom *= -.7
                                this.moneyparticles[k].gravity *= .7
                            }
                        }
                    }
                }
                this.floors[t].draw()
                if (this.breakfloors.includes(this.floors[t])) {
                    canvas_context.drawImage(crack, 0, 0, crack.width, crack.height, this.floors[t].x, this.floors[t].y, this.floors[t].height, this.floors[t].width)
                }


                if (this.floors[t].port == 1) {
                    this.floors[t].portal.draw()
                    if (this.floors[t].portal.body.isPointInside(this.body)) {

                        if (this.floors[t].portal.moddraw == 1) {
                            if (this.floors[t].portal.module.doesPerimeterTouch(this.body)) {
                                this.weaponmod = this.floors[t].portal.mod(this)
                                this.floors[t].portal.moddraw = 0
                            }
                        }
                        pet = 1
                    }
                }
                if (this.floors[t].doesPerimeterTouch(this.body) && (pet == 0 || this.ported == 1)) {
                    this.body.y = this.floors[t].y - this.body.radius
                    wet = 1
                    this.ammo = this.ammocap
                    if (this.body.x < this.floors[t].x + 3) {
                        if (this.angle < -.6) {
                            this.wobble = Math.random() * 2
                        } else if (this.angle > 0) {
                            this.wobble = -Math.random() * 2
                        }
                        dir += this.wobble * .025
                    } else if (this.body.x > this.floors[t].x + this.floors[t].width - 4) {
                        if (this.angle > .6) {
                            this.wobble = -Math.random() * 2
                        } else if (this.angle < 0) {
                            this.wobble = Math.random() * 2
                        }
                        dir += this.wobble * .025
                    } else {
                        dir = 0
                    }
                } else {

                }
            }
            if (this.grounded == 0 && wet == 1) {
                this.angle = 0
                this.grounded = 1
                if (this.body.ymom > 0) {
                    this.body.ymom = 0
                }
                if (this.ported == 0) {
                    if (this.combo > 0) {
                        if (this.combo >= 5) {
                            this.money += this.combo
                            this.ammocap++
                            if (this.combo >= 10) {
                                this.money += this.combo
                                this.health++
                                this.ammocap++
                                if (this.combo >= 15) {
                                    this.money += this.combo
                                    this.ammocap++
                                    this.health++
                                    this.maxhealth++
                                    if (this.combo >= 20) {
                                        while (this.combo >= 20) {
                                            this.ammocap++
                                            this.combo -= 5
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (this.health > this.maxhealth) {
                        this.health = this.maxhealth
                    }
                    if (this.ammocap > 999) {
                        this.ammocap = 999
                    }
                    this.combo = 0
                }
            } else if (wet == 1) {
                this.grounded = 1
                if (this.body.ymom > 0) {
                    this.body.ymom = 0
                }
                this.angle = dir
            } else {
                this.grounded = 0
            }
            if (this.ported == 0 && pet == 1) {
                this.ported = 1
                this.grounded = 1
                if (this.body.ymom > 0) {
                    // this.body.ymom = 0
                }
            } else if (pet == 1) {
                this.ported = 1
            } else {
                this.ported = 0
            }
        }
        control() {
            if(this.boss.trigger2.doesPerimeterTouch(this.body)){
                this.gravity = .29 - (this.balloon * .0085)
            }else{
                this.gravity = .17 - (this.balloon * .0085)
            }

            // if (keysPressed['b']) {
            //     this.balloon += 1
            //     this.gravity -= .0085
            // }
            // if (keysPressed['u']) {
            //     this.umbrella = 1
            //     this.maxgrav = 3.5
            // }
            // if (keysPressed['p']) {
            //     this.poted = 1
            //     this.pote.body.y = this.body.y
            // }
            // if (keysPressed['n']) {
            //     this.anvil = 3
            // }

            if (this.grounded == 1) {
                if (keysPressed['w'] || gamepadAPI.buttonsStatus.includes('A')) {
                    hop.play()
                    this.body.ymom -= 4
                }
            }
            if (this.grounded == 0) {
                if (keysPressed[' '] || gamepadAPI.buttonsStatus.includes('A')) {
                    this.shoot()
                }
            }
            if (Math.abs(this.body.xmom) < this.movespeed) {
                if (keysPressed['a']) {
                    this.body.x -= this.movespeed
                    this.body.sxmom = 0
                    this.dir = -1
                } else {
                    if (keysPressed['d']) {
                        this.body.x += this.movespeed
                        this.body.sxmom = 0
                        this.dir = 1
                    } else {
                        if (typeof (gamepadAPI.axesStatus[1]) != 'undefined') {
                            if (typeof (gamepadAPI.axesStatus[0]) != 'undefined') {
                                this.body.x += Math.sign(gamepadAPI.axesStatus[0]) * this.movespeed
                                this.body.sxmom = 0
                                this.dir = Math.sign(parseFloat(gamepadAPI.axesStatus[0]))
                            }
                        }

                    }
                }
            }
        }
        items() {
            for (let t = 0; t < this.inventory.length; t++) {
                if (this.inventory[t].interface == "health") {
                    this[this.inventory[t].interface] += this.inventory[t].value
                    this.inventory[t].value = 0
                } else if (this.inventory[t].interface == "poted") {
                    this[this.inventory[t].interface] = this.inventory[t].value
                    this.pote.body.y = this.body.y
                } else if (this.inventory[t].name == "balloon") {
                    this[this.inventory[t].interface] = this.inventory[t].value
                    if (this.inventory[t].name) {
                        this[this.inventory[t].name]++
                    }
                    this.balloonover[this[this.inventory[t].name]].body.y = this.body.y
                    this.inventory[t].name = "dummy"
                    this.inventory[t].interface = "dummy"

                } else if (this.inventory[t].interface == "maxhealth") {
                    this['health'] += this.inventory[t].value
                    this[this.inventory[t].interface] += this.inventory[t].value
                    this.inventory[t].value = 0
                } else {
                    this[this.inventory[t].interface] = this.inventory[t].value
                    if (this.inventory[t].name) {
                        this[this.inventory[t].name] = 1
                    }

                }
            }
        }
        draw() { //pomdraw
            if ((this.started == 0 && this.startmenu.start1 == 0) || this.startmenu.start2 !== 1) {
                this.startmenu.draw()
                return
            }
            // if(keysPressed['p']){
            //     this.startmenu.start2 = 0
            // }
            if (this.weaponLevel > 5) {
                this.weaponLevel = 5
            }

            this.balloonover = this.balloonover.sort((a) => this.balloonover.indexOf(a) < this.balloon ? (Math.random() < .005 ? (Math.random() > .5 ? 1 : -1) : 0) : 0)
            let grd = canvas_context.createLinearGradient(360, this.body.y - (640), 360, this.body.y + (640))

            let depthhex = ((this.body.y * 2.1) / ((1580*500))) * 255

            grd.addColorStop(0, "#000000")
            grd.addColorStop(.10, "#000000")
            for (let t = .10; t < 1; t += .05) {
                grd.addColorStop(t, `rgb(${(depthhex) * (t * t * t * t * t * t)},${(255 - depthhex) * (t * t * t * t * t * t)}, ${128 * (t * t * t * t * t * t)})`)
            }



            // grd.addColorStop(.9,`rgb(${(depthhex)/2},${(255-depthhex)/2}, 64)`)

            canvas_context.fillStyle = grd
            canvas_context.globalAlpha = .5
            canvas_context.fillRect(0, this.body.y - (640 + this.ydelay), 720, 1280)
            canvas_context.globalAlpha = 1


            this.boss.draw()
            if (this.suction == 1) {
                this.aura.draw()
            }
            // canvas_context.drawImage(charb, 0,0,charb.width, charb.height, 0, this.body.y-(640+this.ydelay), 720, 1280)
            this.hit--
            for (let t = 0; t < this.ammo; t++) {
                let x = this.walls[1].x + 50
                let y = (t * (300 / this.ammocap)) + this.body.y - 600 - this.ydelay
                let egg = new Egg(x, y)
                egg.draw()
            }
            for (let t = 0; t < this.maxhealth; t++) {
                if (t >= this.health) {
                    let x = this.walls[0].x - 50
                    let y = (t * (200 / this.maxhealth)) + this.body.y - 600 - this.ydelay
                    canvas_context.drawImage(hitpoml, 0, 0, pomaoimgl.width, pomaoimgl.height, x, y, 30, 30)
                } else {
                    let x = this.walls[0].x - 50
                    let y = (t * (200 / this.maxhealth)) + this.body.y - 600 - this.ydelay
                    canvas_context.drawImage(pomaoimgl, 0, 0, pomaoimgl.width, pomaoimgl.height, x, y, 30, 30)
                }
            }
            let spelt = 0
            canvas_context.font = "18px arial"
            canvas_context.fillStyle = "yellow"
            canvas_context.fillText(this.ammo + '/' + this.ammocap, this.walls[1].x + 30, this.body.y - this.ydelay - 270)
            canvas_context.fillText("Juice: ", this.walls[1].x + 30, this.body.y - this.ydelay - 220)
            canvas_context.fillText(this.money, this.walls[1].x + 30, this.body.y - this.ydelay - 200)
            canvas_context.fillText("Depth:", this.walls[1].x + 30, this.body.y - this.ydelay - 160)
            canvas_context.fillText(Math.round((this.body.y - 640) / 10), this.walls[1].x + 30, this.body.y - this.ydelay - 140)
            spelt += 10
            canvas_context.fillText("Gravity:", this.walls[1].x + 30, this.body.y - this.ydelay - 120 + spelt)
            canvas_context.fillText(Math.round(this.gravity * 100), this.walls[1].x + 30, this.body.y - this.ydelay - 100 + spelt)
            spelt += 10
            canvas_context.fillText("Speed:", this.walls[1].x + 30, this.body.y - this.ydelay - 80 + spelt)
            canvas_context.fillText(Math.round(this.body.ymom * 100) + '/' + Math.round((this.maxgrav + this.anvil) * 100), this.walls[1].x + 30, this.body.y - this.ydelay - 60 + spelt)
            spelt += 10
            canvas_context.fillText("Bonks:", this.walls[1].x + 30, this.body.y - this.ydelay - 40 + spelt)
            canvas_context.fillText(this.totalbonks, this.walls[1].x + 30, this.body.y - this.ydelay - 20 + spelt)
            spelt += 10
            if (this.weaponmod == 1) {
                canvas_context.fillStyle = "Green"
                canvas_context.fillText("Mod:", this.walls[1].x + 30, this.body.y - this.ydelay - 0 + spelt)
                canvas_context.fillText("Green", this.walls[1].x + 30, this.body.y - this.ydelay + 20 + spelt)
            } else if (this.weaponmod == 2) {
                canvas_context.fillStyle = "Red"
                canvas_context.fillText("Mod:", this.walls[1].x + 30, this.body.y - this.ydelay - 0 + spelt)
                canvas_context.fillText("Red", this.walls[1].x + 30, this.body.y - this.ydelay + 20 + spelt)
            } else if (this.weaponmod == 3) {
                canvas_context.fillStyle = "Blue"
                canvas_context.fillText("Mod:", this.walls[1].x + 30, this.body.y - this.ydelay - 0 + spelt)
                canvas_context.fillText("Blue", this.walls[1].x + 30, this.body.y - this.ydelay + 20 + spelt)
            } else {
                canvas_context.fillText("Mod:", this.walls[1].x + 30, this.body.y - this.ydelay - 0 + spelt)
                canvas_context.fillText("None", this.walls[1].x + 30, this.body.y - this.ydelay + 20 + spelt)
            }

            canvas_context.fillText("Level:", this.walls[1].x + 30, this.body.y - this.ydelay + 40 + spelt)
            if (((this.weaponLevel - 1) * 2) + 1 == 9) {
                canvas_context.fillText(((this.weaponLevel - 1) * 2) + 1 + " (Max)", this.walls[1].x + 30, this.body.y - this.ydelay + 60 + spelt)
            } else {
                canvas_context.fillText(((this.weaponLevel - 1) * 2) + 1, this.walls[1].x + 30, this.body.y - this.ydelay + 60 + spelt)
            }
            spelt += 10
            canvas_context.fillStyle = "yellow"
            canvas_context.fillText("Move:", this.walls[1].x + 30, this.body.y - this.ydelay + 80 + spelt)
            canvas_context.fillText((this.movespeed * 4), this.walls[1].x + 30, this.body.y - this.ydelay + 100 + spelt)
            spelt += 10
            if(this.balloon >= 11 || this.boss.health <= 0){
                canvas_context.fillStyle = "gold"
                canvas_context.fillText("You Won!", this.walls[1].x + 18, this.body.y - this.ydelay + 220 + spelt)
            }


            this.shottime--
            let sto = new Point(this.body.x, this.body.y)
            sto.y -= this.ydelay * .01
            this.ydelay *= .99
            if (typeof this.utap.x == 'number') {
                this.movetap()
                if (keysPressed['a']) {
                    this.utap = {}
                }
                if (keysPressed['s']) {
                    this.utap = {}
                }
                if (keysPressed['d']) {
                    this.utap = {}
                }
                if (keysPressed['w']) {
                    this.utap = {}
                }
                if (keysPressed[' ']) {
                    this.utap = {}
                }
            } else {
                this.control()
            }
            for (let t = 0; t < this.walls.length; t++) {
                this.walls[t].draw()
            }
            if (this.dir == 0) {
                if (this.grounded == 0) {
                    this.angle += this.spinspeed * 1
                }
            } else {

                this.angle += this.spinspeed * this.dir
            }

            this.floorCheck()
            this.storeCheck()
            let echoecho = new Point(this.echo.x, this.echo.y)
            this.link = new LineOP(echoecho, this.body)
            this.echo.x = this.body.x
            this.echo.y = this.body.y
            this.aura = new Circle(this.body.x, this.body.y, 170, "#FFFFAA22")
            this.enemyCheck()
            this.items()
            for (let t = 0; t < this.shots.length; t++) {
                this.shots[t].draw()
            }
            for (let t = 0; t < this.moneyparticles.length; t++) {
                if (Math.abs(this.body.y - this.moneyparticles[t].body.y) < 750) {
                    this.moneyparticles[t].draw()
                }
            }
            for (let t = 0; t < this.moneyparticles.length; t++) {
                if (this.moneyparticles[t].marked == 1) {
                    if (this.fruitfix == 1) {
                        this.fruitcount++
                        if (this.fruitcount >= 9) {
                            this.fruitcount = 0
                            this.ammo++
                            if (this.ammo > this.ammocap) {
                                this.ammo = this.ammocap
                            }
                        }
                    }
                    this.moneyparticles.splice(t, 1)
                }
            }
            this.body.xmom *= .97
            if (this.grounded == 1) {
                if (this.body.ymom > 0) {
                } else {
                    this.body.move()
                    this.body.x += this.body.sxmom
                    this.body.y += this.body.symom
                    this.body.sxmom *= this.body.sfriction
                    this.body.symom *= this.body.sfriction
                }
            } else {
                this.body.ymom += this.gravity
                if (this.body.ymom > this.maxgrav + this.anvil) {
                    this.body.ymom = this.maxgrav + this.anvil
                }
                this.body.move()
                this.body.x += this.body.sxmom
                this.body.y += this.body.symom
                this.body.sxmom *= this.body.sfriction
                this.body.symom *= this.body.sfriction
                if (Math.abs(this.body.symom) < .5) {
                    this.body.symom = 0
                }
            }
            if (true) {
                if (this.poted == 1) {
                    this.pote.draw()
                }
                pomao_canvas_context.clearRect(-100000, -100000, pomao_canvas.width * 10000, pomao_canvas.height * 10000)
                pomao_canvas_context.translate(0, 0)
                pomao_canvas_context.rotate(this.angle)
                pomao_canvas_context.translate(0, 0)
                if (this.grounded == 1) {
                    this.breathe += Math.sin(this.breatheangle) * .09
                    this.breatheangle += .05
                    if (this.breathecap == 3) {
                        if (this.breathe > this.breathecap) {
                            this.breathecap *= -1
                        }
                    } else {
                        if (this.breathe < this.breathecap) {
                            this.breathecap *= -1
                        }
                    }
                    if (this.ported == 0) {
                        if (this.dir == 1) {
                            if (this.hit > 0) {
                                pomao_canvas_context.drawImage(hitpom, 0, 0, hitpom.width, hitpom.height, -15, -15 - this.breathe, 30, 30 + this.breathe)
                            } else {
                                pomao_canvas_context.drawImage(pomaoimg, 0, 0, pomaoimg.width, pomaoimg.height, -15, -15 - this.breathe, 30, 30 + this.breathe)
                            }
                        } else {
                            if (this.hit > 0) {
                                pomao_canvas_context.drawImage(hitpoml, 0, 0, hitpom.width, hitpom.height, -15, -15 - this.breathe, 30, 30 + this.breathe)
                            } else {
                                pomao_canvas_context.drawImage(pomaoimgl, 0, 0, pomaoimgl.width, pomaoimgl.height, -15, -15 - this.breathe, 30, 30 + this.breathe)
                            }
                        }
                    } else {
                        if (this.dir == 1) {
                            pomao_canvas_context.drawImage(invpomaoimg, 0, 0, invpomaoimg.width, invpomaoimg.height, -15, -15 - this.breathe, 30, 30 + this.breathe)
                        } else {
                            pomao_canvas_context.drawImage(invpomaoimgl, 0, 0, invpomaoimgl.width, invpomaoimgl.height, -15, -15 - this.breathe, 30, 30 + this.breathe)
                        }
                    }
                } else {
                    if (this.ported == 0) {
                        if (this.dir == 1) {
                            if (this.hit > 0) {
                                pomao_canvas_context.drawImage(hitpom, 0, 0, hitpom.width, hitpom.height, -15, -15, 30, 30)
                            } else {
                                pomao_canvas_context.drawImage(pomaoimg, 0, 0, pomaoimg.width, pomaoimg.height, -15, -15, 30, 30)
                            }
                        } else {
                            if (this.hit > 0) {
                                pomao_canvas_context.drawImage(hitpoml, 0, 0, hitpom.width, hitpom.height, -15, -15, 30, 30)
                            } else {
                                pomao_canvas_context.drawImage(pomaoimgl, 0, 0, pomaoimgl.width, pomaoimgl.height, -15, -15, 30, 30)
                            }
                        }
                    } else {
                        if (this.dir == 1) {
                            pomao_canvas_context.drawImage(invpomaoimg, 0, 0, invpomaoimg.width, invpomaoimg.height, -15, -15, 30, 30)
                        } else {
                            pomao_canvas_context.drawImage(invpomaoimgl, 0, 0, invpomaoimgl.width, invpomaoimgl.height, -15, -15, 30, 30)
                        }
                    }
                }




                pomao_canvas_context.rotate(-this.angle)
                if (this.anvil >= 1) {
                    let linkl = new Line(this.body.x, this.body.y, this.body.x + this.anvilangle, this.body.y + 107, "brown", 2)
                    let point = new Point(this.body.x + this.anvilangle, this.body.y + 107)
                    this.anvilball = new Circle(point.x, point.y + 20, 16, "gray")
                    for (let t = 0; t < this.floors.length; t++) {
                        if (this.floors[t].isPointInside(point)) {
                            if (this.breakfloors.includes(this.floors[t])) {
                                this.floors[t].marked = 1
                            }
                            this.anvilgrounded = 1
                            this.floorskip = this.floors[t]
                        }
                    }
                    if (this.body.y > this.floorskip) {
                        this.anvilgrounded = 0
                    }

                    if (this.grounded == 1 && this.anvilgrounded == 1) {
                        if ((((this.body.x - this.link.object.x))) != 0) {
                            this.cycle += .1
                            this.anvilangle += this.swing * 2
                            this.anvilangle -= this.body.x - this.link.object.x
                            this.anvilangle *= .85
                            this.swing = Math.cos(this.cycle)
                        } else {
                            this.cycle += .1
                            this.anvilangle += this.swing * .3
                            this.swing = Math.cos(this.cycle)
                            this.anvilangle *= .9
                        }
                        // this.anvilangle += (((this.body.x-this.link.object.x)*.2))
                        linkl = new Line(this.body.x, this.body.y, this.body.x + this.anvilangle, this.body.y + 107, "#DDAA00", 2)
                        linkl.draw()
                        canvas_context.drawImage(anchor, this.body.x - (anchor.width * .5) + this.anvilangle, this.body.y + 107)
                    } else {

                        this.anvilangle *= .7
                        linkl = new Line(this.body.x, this.body.y, this.body.x + this.anvilangle, this.body.y + 107, "#DDAA00", 2)
                        linkl.draw()
                        canvas_context.drawImage(anchor, this.body.x - (anchor.width * .5) + this.anvilangle, this.body.y + 107)
                    }
                    point = new Point(this.body.x + this.anvilangle, this.body.y + 107)
                    this.anvilball = new Circle(point.x, point.y + 20, 16, "gray")
                    // this.anvilball.draw()
                }
                if (this.umbrella == 1) {
                    if (this.dir == 1) {
                        canvas_context.drawImage(surfumbrellal, this.body.x - 15, this.body.y - 57)
                    } else {
                        canvas_context.drawImage(surfumbrellal, this.body.x - 15, this.body.y - 57)
                    }
                }
                if (this.balloon >= 1) {
                    for (let t = 0; t < Math.min(this.balloon, this.balloonover.length); t++) {
                        this.balloonover[t].draw()
                        for (let k = 0; k < this.balloonover.length; k++) {
                            if (t != k) {
                                if (this.balloonover[t].body.doesPerimeterTouch(this.balloonover[k].body)) {
                                    let link = new LineOP(this.balloonover[t].body, this.balloonover[k].body)
                                    let angle = link.angle()
                                    let dis = link.hypotenuse()
                                    this.balloonover[t].body.xmom += Math.cos(angle) / 10
                                    this.balloonover[t].body.ymom += Math.sin(angle) / 10
                                }

                                // if(Math.abs(this.balloonover[t].body.x-this.balloonover[k].body.x) < 10){
                                //     if(Math.abs(this.balloonover[t].y-this.body.y) < Math.abs(this.balloonover[k].y-this.body.y)){
                                //         this.balloonover[t].body.ymom += (this.balloonover[t].body.y-this.balloonover[k].body.y)/10
                                //         this.balloonover[t].body.xmom += (this.balloonover[t].body.x-this.balloonover[k].body.x)/10
                                //     }else{
                                //         this.balloonover[k].body.ymom -= (this.balloonover[k].body.y-this.balloonover[k].body.y)/10
                                //         this.balloonover[k].body.xmom -= (this.balloonover[k].body.x-this.balloonover[k].body.x)/10
                                //     }
                                // }
                            }
                        }
                    }
                }
                canvas_context.drawImage(pomao_canvas, this.body.x - 15, this.body.y - 21)
            }
            if (Math.abs(this.ydelay) < 500) {
                this.ydelay += (sto.y - this.body.y) * .1
                sto.y += (sto.y - this.body.y) * .1
            }
            canvas_context.font = "18px arial"
            canvas_context.fillStyle = "yellow"
            let dis = canvas_context.measureText(this.combo).width
            canvas_context.fillText(this.combo, this.body.x - (dis * .5), this.body.y - 25)
            canvas_context.translate(0, sto.y - this.body.y) //sto.x - this.body.x

        }
    }
 //sto.x - this.body.x
    let pomao = new Pomao()
    canvas_context.translate(0, -(1578*0))

    // pomao.started = 1
    // pomao.startmenu.start1 = 1
    // pomao.startmenu.start2 = 1
    pomao.enegen(0)
    function main() {
        if (keysPressed['0'] && recording == 0) {
            recording = 1
            video_recorder.record()
        }
        if (keysPressed['5'] && recording == 1) {
            recording = 0
            video_recorder.stop()
            video_recorder.download()
        }
        ba.play()
        canvas_context.clearRect(-100000, -100000, canvas.width * 10000, canvas.height * 10000)  // refreshes the image
        gamepadAPI.update()
        pomao.draw()
        if (keysPressed['o']) {
            console.log(pomao)
        }
        if (pomao.health <= 0) {
            canvas_context.resetTransform()
            pomao = new Pomao()
            pomao.enegen(0)
        }
    }
})
