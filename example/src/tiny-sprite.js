/*
 * TinySprite module (https://github.com/bitnenfer/tiny-canvas)
 * Developed by Felipe Alfonso -> https://twitter.com/bitnenfer/
 *
 *  ----------------------------------------------------------------------
 *
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                     Version 2, December 2004
 *
 *  Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
 *
 *  Everyone is permitted to copy and distribute verbatim or modified
 *  copies of this license document, and changing it is allowed as long
 *  as the name is changed.
 *
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *   0. You just DO WHAT THE FUCK YOU WANT TO.
 *
 *  ----------------------------------------------------------------------
 *
 */
function CompileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function CreateShaderProgram(gl, vsSource, fsSource) {
  const vShader = CompileShader(gl, vsSource, gl.VERTEX_SHADER);
  const fShader = CompileShader(gl, fsSource, gl.FRAGMENT_SHADER);

  const program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  return program;
}

function CreateBuffer(gl, bufferType, size, usage) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(bufferType, size, usage);
  return buffer;
}

function CreateTexture(gl, image, width, height) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.bindTexture(gl.TEXTURE_2D, null);

  texture.width = width;
  texture.height = height;

  return texture;
}

function TinySprite(canvas) {
  const gl = canvas.getContext('webgl');

  // float + (vec2 * 4) + (char * 4)

  const VERTEX_SIZE = 4 + 4 * 2 * 4 + 4;

  const MAX_BATCH = 10922;
  // floor((2 ^ 16) / 6)

  const VERTEX_DATA_SIZE = VERTEX_SIZE * MAX_BATCH * 4;

  const VERTICES_PER_QUAD = 6;

  const INDEX_DATA_SIZE = MAX_BATCH * (2 * VERTICES_PER_QUAD);

  /*
  const width = canvas.width;

  const height = canvas.height;
  */

  const shader = CreateShaderProgram(
    gl,
    [
      'precision lowp float;',
      'attribute float a;',
      'attribute vec2 b,c,d,e;',
      'attribute vec4 f;',
      'varying vec2 g;',
      'varying vec4 h;',
      'uniform mat4 i;',
      'void main() {',
      'float q=cos(a);',
      'float w=sin(a);',
      'gl_Position=i*vec4(((vec2(d.x*q-d.y*w,d.x*w+d.y*q)*c)+b),1.0,1.0);',
      'g=e;',
      'h=f;',
      '}',
    ].join('\n'),
    [
      'precision lowp float;',
      'varying vec2 g;',
      'varying vec4 h;',
      'uniform sampler2D j;',
      'void main(){',
      'gl_FragColor=texture2D(j,g)*h;',
      '}',
    ].join('\n'),
  );

  const glBufferSubData = gl.bufferSubData.bind(gl);

  const glDrawElements = gl.drawElements.bind(gl);

  const glBindTexture = gl.bindTexture.bind(gl);

  const glClear = gl.clear.bind(gl);

  const glClearColor = gl.clearColor.bind(gl);

  const vertexData = new ArrayBuffer(VERTEX_DATA_SIZE);

  const vPositionData = new Float32Array(vertexData);

  const vColorData = new Uint32Array(vertexData);

  const vIndexData = new Uint16Array(INDEX_DATA_SIZE);

  const IBO = CreateBuffer(gl, 34963, vIndexData.byteLength, 35044);

  const VBO = CreateBuffer(gl, 34962, vertexData.byteLength, 35048);

  let count = 0;

  let currentTexture = null;

  let renderer = null;

  let locRotation;
  let locTranslation;
  let locScale;

  let locPosition;
  let locUV;
  let locColor;

  gl.blendFunc(770, 771);
  gl.enable(3042);
  gl.useProgram(shader);
  gl.bindBuffer(34963, IBO);
  for (
    let indexA = (indexB = 0);
    indexA < MAX_BATCH * VERTICES_PER_QUAD;
    indexA += VERTICES_PER_QUAD, indexB += 4
  ) {
    (vIndexData[indexA + 0] = indexB),
    (vIndexData[indexA + 1] = indexB + 1),
    (vIndexData[indexA + 2] = indexB + 2),
    (vIndexData[indexA + 3] = indexB + 0),
    (vIndexData[indexA + 4] = indexB + 3),
    (vIndexData[indexA + 5] = indexB + 1);
  }

  gl.bufferSubData(34963, 0, vIndexData);
  gl.bindBuffer(34962, VBO);

  locRotation = gl.getAttribLocation(shader, 'a');
  locTranslation = gl.getAttribLocation(shader, 'b');
  locScale = gl.getAttribLocation(shader, 'c');
  locPosition = gl.getAttribLocation(shader, 'd');
  locUV = gl.getAttribLocation(shader, 'e');
  locColor = gl.getAttribLocation(shader, 'f');

  // Rotation
  gl.enableVertexAttribArray(locRotation);
  gl.vertexAttribPointer(locRotation, 1, 5126, 0, VERTEX_SIZE, 0);

  // Translation
  gl.enableVertexAttribArray(locTranslation);
  gl.vertexAttribPointer(locTranslation, 2, 5126, 0, VERTEX_SIZE, 4);

  // Scale
  gl.enableVertexAttribArray(locScale);
  gl.vertexAttribPointer(locScale, 2, 5126, 0, VERTEX_SIZE, 12);

  // Position
  gl.enableVertexAttribArray(locPosition);
  gl.vertexAttribPointer(locPosition, 2, 5126, 0, VERTEX_SIZE, 20);

  // UV
  gl.enableVertexAttribArray(locUV);
  gl.vertexAttribPointer(locUV, 2, 5126, 0, VERTEX_SIZE, 28);

  // Color
  gl.enableVertexAttribArray(locColor);
  gl.vertexAttribPointer(locColor, 4, 5121, 1, VERTEX_SIZE, 36);

  /*
  gl.uniformMatrix4fv(
    gl.getUniformLocation(shader, 'i'),
    0,
    new Float32Array([2 / canvas.clientWidth, 0, 0, 0, 0, -2 / canvas.clientHeight, 0, 0, 0, 0, 1, 1, -1, 1, 0, 0]),
  );
  */

  gl.activeTexture(33984);
  renderer = {
    g: gl,
    c: canvas,
    col: 0xffffffff,
    bkg(r, g, b) {
      gl.clearColor(r, g, b, 1);
    },
    cls() {
      gl.clear(16384);
    },
    resize() {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;

        gl.uniformMatrix4fv(
          gl.getUniformLocation(shader, 'i'),
          0,
         new Float32Array([2 / displayWidth, 0, 0, 0, 0, -2 / displayHeight, 0, 0, 0, 0, 1, 1, -1, 1, 0, 0]),
        );
      
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    },
    img(texture, x, y, w, h, r, tx, ty, sx, sy, u0, v0, u1, v1) {
      const x0 = x;

      const y0 = y;

      const x1 = x + w;

      const y1 = y + h;

      const x2 = x;

      const y2 = y + h;

      const x3 = x + w;

      const y3 = y;

      let offset = 0;

      const argb = renderer.col;

      if (texture != currentTexture || count + 1 >= MAX_BATCH) {
        glBufferSubData(34962, 0, vertexData);
        glDrawElements(4, count * VERTICES_PER_QUAD, 5123, 0);
        count = 0;
        if (texture != currentTexture) {
          currentTexture = texture;
          glBindTexture(3553, currentTexture);
        }
      }

      offset = count * VERTEX_SIZE;
      // Vertex Order:
      // rotation | translation | scale | position | uv | color
      // Vertex 1
      vPositionData[offset++] = r;
      vPositionData[offset++] = tx;
      vPositionData[offset++] = ty;
      vPositionData[offset++] = sx;
      vPositionData[offset++] = sy;
      vPositionData[offset++] = x0;
      vPositionData[offset++] = y0;
      vPositionData[offset++] = u0;
      vPositionData[offset++] = v0;
      vColorData[offset++] = argb;

      // Vertex 2
      vPositionData[offset++] = r;
      vPositionData[offset++] = tx;
      vPositionData[offset++] = ty;
      vPositionData[offset++] = sx;
      vPositionData[offset++] = sy;
      vPositionData[offset++] = x1;
      vPositionData[offset++] = y1;
      vPositionData[offset++] = u1;
      vPositionData[offset++] = v1;
      vColorData[offset++] = argb;

      // Vertex 3
      vPositionData[offset++] = r;
      vPositionData[offset++] = tx;
      vPositionData[offset++] = ty;
      vPositionData[offset++] = sx;
      vPositionData[offset++] = sy;
      vPositionData[offset++] = x2;
      vPositionData[offset++] = y2;
      vPositionData[offset++] = u0;
      vPositionData[offset++] = v1;
      vColorData[offset++] = argb;

      // Vertex 4
      vPositionData[offset++] = r;
      vPositionData[offset++] = tx;
      vPositionData[offset++] = ty;
      vPositionData[offset++] = sx;
      vPositionData[offset++] = sy;
      vPositionData[offset++] = x3;
      vPositionData[offset++] = y3;
      vPositionData[offset++] = u1;
      vPositionData[offset++] = v0;
      vColorData[offset++] = argb;

      if (++count >= MAX_BATCH) {
        glBufferSubData(34962, 0, vertexData);
        glDrawElements(4, count * VERTICES_PER_QUAD, 5123, 0);
        count = 0;
      }
    },
    flush() {
      if (count == 0) return;
      glBufferSubData(34962, 0, vPositionData.subarray(0, count * VERTEX_SIZE));
      glDrawElements(4, count * VERTICES_PER_QUAD, 5123, 0);
      count = 0;
    },
  };
  renderer.resize();
  return renderer;
}

export {
  TinySprite as TS,
  CompileShader as TCShd,
  CreateShaderProgram as TCPrg,
  CreateBuffer as TCBuf,
  CreateTexture as TCTex,
};
