
// Wait for the page to load
window.onload = function() {
    // Get the canvas element
    const canvas = document.getElementById('glCanvas');
    // Initialize the GL context
    const gl = canvas.getContext('webgl');

    // Only continue if WebGL is available and working
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    // Fragment shader program (default color is red)
    let color = [1.0, 0.0, 0.0, 1.0]; // Default color (red)
    const fsSource = () => `
        void main() {
            gl_FragColor = vec4(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]});
        }
    `;

    // Initialize a shader program
    let shaderProgram = initShaderProgram(gl, vsSource, fsSource());
    let vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');

    // Create a buffer for the rectangle's positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Positions for the 2D object (e.g., a rectangle)
    const positions = [
        -0.5,  0.5,
         0.5,  0.5,
        -0.5, -0.5,
         0.5, -0.5,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Function to draw the scene
    function drawScene() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        const numComponents = 2;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set to the next
        const offset = 0;         // how many bytes inside the buffer to start from

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(vertexPosition);

        gl.useProgram(shaderProgram);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // Draw initial scene
    drawScene();

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Button event listeners to change colors
    document.getElementById('color1').onclick = function() {
        color = [1.0, 0.0, 0.0, 1.0]; // Red
        shaderProgram = initShaderProgram(gl, vsSource, fsSource());
        drawScene();
    };

    document.getElementById('color2').onclick = function() {
        color = [0.0, 1.0, 0.0, 1.0]; // Green
        shaderProgram = initShaderProgram(gl, vsSource, fsSource());
        drawScene();
    };

    document.getElementById('color3').onclick = function() {
        color = [0.0, 0.0, 1.0, 1.0]; // Blue
        shaderProgram = initShaderProgram(gl, vsSource, fsSource());
        drawScene();
    };

    document.getElementById('reset').onclick = function() {
        color = [1.0, 1.0, 1.0, 1.0]; // White (default reset color)
        shaderProgram = initShaderProgram(gl, vsSource, fsSource());
        drawScene();
    };

};

// Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
