var fragmentShaderCode = `
    precision mediump float;
        void main(void) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;

var vertexShaderCode = `
    attribute vec3 aVertexPosition;

    void main(void) {
        gl_Position = vec4(aVertexPosition, 1.0);
    }
`;

var gl;
var shaderProgram;
var canvasSize = 10;

function isAntialiasingSupported() {
    var canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    document.body.appendChild(canvas);

    gl = canvas.getContext('webgl', {
        antialias: true,
    });

    if (!gl || !gl.getContextAttributes().antialias) {
        return false;
    }

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    initShaders();
    initBuffers();
    drawScene();

    var pixelsCountToCheck = 2;
    var pixels = new Uint8Array(4 * pixelsCountToCheck);
    var startToCheckFrom = canvasSize / 2 - pixelsCountToCheck / 2;
    gl.readPixels(startToCheckFrom, startToCheckFrom, pixelsCountToCheck, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    var isAliased = false;

    pixels.forEach((value, index) => {
        if (value !== 255 && value !== 0) {
            isAliased = true;
        }
    });

    return isAliased;
}

if (typeof window !== 'undefined') {
    window.antialiasingSupported = isAntialiasingSupported();
}

function getShader(str, isVertex) {
    var shader;
    if (isVertex) {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else if (!isVertex) {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders() {
    var fragmentShader = getShader(fragmentShaderCode);
    var vertexShader = getShader(vertexShaderCode, true);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function initBuffers() {
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [
        -1.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;
}


function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
}