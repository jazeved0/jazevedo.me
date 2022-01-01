/* eslint-disable */

// Note:
// Some modifications have been made;
// minor deobfuscation/de-minification in order to more easily read the code,
// plus a direct way of setting/resetting the colors was added
// in order to more easily create a React wrapper.
// (see <StripeGradient>)

// https://kevinhufnagl.com/wp-content/themes/lightisol/dist/js/min/lightisol-gradient.min.js?ver=1.0
//
// Since the original CodePen https://codepen.io/kevinhufnagl/pen/YzwBemd,
// seems to have been removed by the author I restored this version from
// the article's markup found at
// https://kevinhufnagl.com/how-to-stripe-website-gradient-effect/

function normalizeColor(hexCode) {
  return [
    ((hexCode >> 16) & 255) / 255,
    ((hexCode >> 8) & 255) / 255,
    (255 & hexCode) / 255,
  ];
}

["SCREEN", "LINEAR_LIGHT"].reduce(
  (hexCode, t, n) => Object.assign(hexCode, { [t]: n }),
  {}
);

class MiniGl {
  constructor(canvas, width, height, debug = false) {
    const _miniGl = this;
    const debug_output =
      document.location.search.toLowerCase().indexOf("debug=webgl") !== -1;
    _miniGl.canvas = canvas;
    _miniGl.gl = _miniGl.canvas.getContext("webgl", { antialias: true });
    _miniGl.meshes = [];

    const context = _miniGl.gl;
    width && height && this.setSize(width, height),
      _miniGl.lastDebugMsg,
      (_miniGl.debug =
        debug && debug_output
          ? function (e) {
              const t = new Date();
              t - _miniGl.lastDebugMsg > 1e3 && console.log("---"),
                console.log(
                  t.toLocaleTimeString() +
                    Array(Math.max(0, 32 - e.length)).join(" ") +
                    e +
                    ": ",
                  ...Array.from(arguments).slice(1)
                ),
                (_miniGl.lastDebugMsg = t);
            }
          : () => {}),
      Object.defineProperties(_miniGl, {
        Material: {
          enumerable: false,
          value: class {
            constructor(vertexShaders, fragments, uniforms = {}) {
              const material = this;
              function getShaderByType(type, source) {
                const shader = context.createShader(type);
                return (
                  context.shaderSource(shader, source),
                  context.compileShader(shader),
                  context.getShaderParameter(shader, context.COMPILE_STATUS) ||
                    console.error(context.getShaderInfoLog(shader)),
                  _miniGl.debug("Material.compileShaderSource", {
                    source: source,
                  }),
                  shader
                );
              }
              function getUniformVariableDeclarations(uniforms, type) {
                return Object.entries(uniforms)
                  .map(([uniform, value]) =>
                    value.getDeclaration(uniform, type)
                  )
                  .join("\n");
              }
              (this.uniforms = uniforms), (this.uniformInstances = []);
              const prefix =
                "\n              precision highp float;\n            ";
              (this.vertexSource = `\n              ${prefix}\n              attribute vec4 position;\n              attribute vec2 uv;\n              attribute vec2 uvNorm;\n              ${getUniformVariableDeclarations(
                _miniGl.commonUniforms,
                "vertex"
              )}\n              ${getUniformVariableDeclarations(
                uniforms,
                "vertex"
              )}\n              ${vertexShaders}\n            `),
                (this.Source = `\n              ${prefix}\n              ${getUniformVariableDeclarations(
                  _miniGl.commonUniforms,
                  "fragment"
                )}\n              ${getUniformVariableDeclarations(
                  uniforms,
                  "fragment"
                )}\n              ${fragments}\n            `),
                (this.vertexShader = getShaderByType(
                  context.VERTEX_SHADER,
                  this.vertexSource
                )),
                (this.fragmentShader = getShaderByType(
                  context.FRAGMENT_SHADER,
                  this.Source
                )),
                (this.program = context.createProgram()),
                context.attachShader(this.program, this.vertexShader),
                context.attachShader(this.program, this.fragmentShader),
                context.linkProgram(this.program),
                context.getProgramParameter(
                  this.program,
                  context.LINK_STATUS
                ) || console.error(context.getProgramInfoLog(this.program)),
                context.useProgram(this.program),
                this.attachUniforms(undefined, _miniGl.commonUniforms),
                this.attachUniforms(undefined, this.uniforms);
            }
            attachUniforms(name, uniforms) {
              const material = this;
              undefined === name
                ? Object.entries(uniforms).forEach(([name, uniform]) => {
                    material.attachUniforms(name, uniform);
                  })
                : "array" == uniforms.type
                ? uniforms.value.forEach((uniform, i) =>
                    material.attachUniforms(`${name}[${i}]`, uniform)
                  )
                : "struct" == uniforms.type
                ? Object.entries(uniforms.value).forEach(([uniform, i]) =>
                    material.attachUniforms(`${name}.${uniform}`, i)
                  )
                : (_miniGl.debug("Material.attachUniforms", {
                    name: name,
                    uniform: uniforms,
                  }),
                  material.uniformInstances.push({
                    uniform: uniforms,
                    location: context.getUniformLocation(
                      material.program,
                      name
                    ),
                  }));
            }
          },
        },
        Uniform: {
          enumerable: false,
          value: class {
            constructor(e) {
              (this.type = "float"),
                Object.assign(this, e),
                (this.typeFn =
                  {
                    float: "1f",
                    int: "1i",
                    vec2: "2fv",
                    vec3: "3fv",
                    vec4: "4fv",
                    mat4: "Matrix4fv",
                  }[this.type] || "1f"),
                this.update();
            }
            update(value) {
              undefined !== this.value &&
                context[`uniform${this.typeFn}`](
                  value,
                  0 === this.typeFn.indexOf("Matrix")
                    ? this.transpose
                    : this.value,
                  0 === this.typeFn.indexOf("Matrix") ? this.value : null
                );
            }
            getDeclaration(name, type, length) {
              const uniform = this;
              if (uniform.excludeFrom !== type) {
                if ("array" === uniform.type)
                  return (
                    uniform.value[0].getDeclaration(
                      name,
                      type,
                      uniform.value.length
                    ) + `\nconst int ${name}_length = ${uniform.value.length};`
                  );
                if ("struct" === uniform.type) {
                  let name_no_prefix = name.replace("u_", "");
                  return (
                    (name_no_prefix =
                      name_no_prefix.charAt(0).toUpperCase() +
                      name_no_prefix.slice(1)),
                    `uniform struct ${name_no_prefix} \n                                {\n` +
                      Object.entries(uniform.value)
                        .map(([name, uniform]) =>
                          uniform
                            .getDeclaration(name, type)
                            .replace(/^uniform/, "")
                        )
                        .join("") +
                      `\n} ${name}${length > 0 ? `[${length}]` : ""};`
                  );
                }
                return `uniform ${uniform.type} ${name}${
                  length > 0 ? `[${length}]` : ""
                };`;
              }
            }
          },
        },
        PlaneGeometry: {
          enumerable: false,
          value: class {
            constructor(width, height, n, i, orientation) {
              context.createBuffer(),
                (this.attributes = {
                  position: new _miniGl.Attribute({
                    target: context.ARRAY_BUFFER,
                    size: 3,
                  }),
                  uv: new _miniGl.Attribute({
                    target: context.ARRAY_BUFFER,
                    size: 2,
                  }),
                  uvNorm: new _miniGl.Attribute({
                    target: context.ARRAY_BUFFER,
                    size: 2,
                  }),
                  index: new _miniGl.Attribute({
                    target: context.ELEMENT_ARRAY_BUFFER,
                    size: 3,
                    type: context.UNSIGNED_SHORT,
                  }),
                }),
                this.setTopology(n, i),
                this.setSize(width, height, orientation);
            }
            setTopology(e = 1, t = 1) {
              const n = this;
              (n.xSegCount = e),
                (n.ySegCount = t),
                (n.vertexCount = (n.xSegCount + 1) * (n.ySegCount + 1)),
                (n.quadCount = n.xSegCount * n.ySegCount * 2),
                (n.attributes.uv.values = new Float32Array(2 * n.vertexCount)),
                (n.attributes.uvNorm.values = new Float32Array(
                  2 * n.vertexCount
                )),
                (n.attributes.index.values = new Uint16Array(3 * n.quadCount));
              for (let e = 0; e <= n.ySegCount; e++)
                for (let t = 0; t <= n.xSegCount; t++) {
                  const i = e * (n.xSegCount + 1) + t;
                  if (
                    ((n.attributes.uv.values[2 * i] = t / n.xSegCount),
                    (n.attributes.uv.values[2 * i + 1] = 1 - e / n.ySegCount),
                    (n.attributes.uvNorm.values[2 * i] =
                      (t / n.xSegCount) * 2 - 1),
                    (n.attributes.uvNorm.values[2 * i + 1] =
                      1 - (e / n.ySegCount) * 2),
                    t < n.xSegCount && e < n.ySegCount)
                  ) {
                    const s = e * n.xSegCount + t;
                    (n.attributes.index.values[6 * s] = i),
                      (n.attributes.index.values[6 * s + 1] =
                        i + 1 + n.xSegCount),
                      (n.attributes.index.values[6 * s + 2] = i + 1),
                      (n.attributes.index.values[6 * s + 3] = i + 1),
                      (n.attributes.index.values[6 * s + 4] =
                        i + 1 + n.xSegCount),
                      (n.attributes.index.values[6 * s + 5] =
                        i + 2 + n.xSegCount);
                  }
                }
              n.attributes.uv.update(),
                n.attributes.uvNorm.update(),
                n.attributes.index.update(),
                _miniGl.debug("Geometry.setTopology", {
                  uv: n.attributes.uv,
                  uvNorm: n.attributes.uvNorm,
                  index: n.attributes.index,
                });
            }
            setSize(width = 1, height = 1, orientation = "xz") {
              const geometry = this;
              (geometry.width = width),
                (geometry.height = height),
                (geometry.orientation = orientation),
                (geometry.attributes.position.values &&
                  geometry.attributes.position.values.length ===
                    3 * geometry.vertexCount) ||
                  (geometry.attributes.position.values = new Float32Array(
                    3 * geometry.vertexCount
                  ));
              const o = width / -2,
                r = height / -2,
                segment_width = width / geometry.xSegCount,
                segment_height = height / geometry.ySegCount;
              for (let yIndex = 0; yIndex <= geometry.ySegCount; yIndex++) {
                const t = r + yIndex * segment_height;
                for (let xIndex = 0; xIndex <= geometry.xSegCount; xIndex++) {
                  const r = o + xIndex * segment_width,
                    l = yIndex * (geometry.xSegCount + 1) + xIndex;
                  (geometry.attributes.position.values[
                    3 * l + "xyz".indexOf(orientation[0])
                  ] = r),
                    (geometry.attributes.position.values[
                      3 * l + "xyz".indexOf(orientation[1])
                    ] = -t);
                }
              }
              geometry.attributes.position.update(),
                _miniGl.debug("Geometry.setSize", {
                  position: geometry.attributes.position,
                });
            }
          },
        },
        Mesh: {
          enumerable: false,
          value: class {
            constructor(geometry, material) {
              const mesh = this;
              (mesh.geometry = geometry),
                (mesh.material = material),
                (mesh.wireframe = false),
                (mesh.attributeInstances = []),
                Object.entries(mesh.geometry.attributes).forEach(
                  ([e, attribute]) => {
                    mesh.attributeInstances.push({
                      attribute: attribute,
                      location: attribute.attach(e, mesh.material.program),
                    });
                  }
                ),
                _miniGl.meshes.push(mesh),
                _miniGl.debug("Mesh.constructor", { mesh: mesh });
            }
            draw() {
              context.useProgram(this.material.program),
                this.material.uniformInstances.forEach(
                  ({ uniform: e, location: t }) => e.update(t)
                ),
                this.attributeInstances.forEach(
                  ({ attribute: e, location: t }) => e.use(t)
                ),
                context.drawElements(
                  this.wireframe ? context.LINES : context.TRIANGLES,
                  this.geometry.attributes.index.values.length,
                  context.UNSIGNED_SHORT,
                  0
                );
            }
            remove() {
              _miniGl.meshes = _miniGl.meshes.filter((e) => e != this);
            }
          },
        },
        Attribute: {
          enumerable: false,
          value: class {
            constructor(e) {
              (this.type = context.FLOAT),
                (this.normalized = false),
                (this.buffer = context.createBuffer()),
                Object.assign(this, e),
                this.update();
            }
            update() {
              undefined !== this.values &&
                (context.bindBuffer(this.target, this.buffer),
                context.bufferData(
                  this.target,
                  this.values,
                  context.STATIC_DRAW
                ));
            }
            attach(e, t) {
              const n = context.getAttribLocation(t, e);
              return (
                this.target === context.ARRAY_BUFFER &&
                  (context.enableVertexAttribArray(n),
                  context.vertexAttribPointer(
                    n,
                    this.size,
                    this.type,
                    this.normalized,
                    0,
                    0
                  )),
                n
              );
            }
            use(e) {
              context.bindBuffer(this.target, this.buffer),
                this.target === context.ARRAY_BUFFER &&
                  (context.enableVertexAttribArray(e),
                  context.vertexAttribPointer(
                    e,
                    this.size,
                    this.type,
                    this.normalized,
                    0,
                    0
                  ));
            }
          },
        },
      });
    const a = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    _miniGl.commonUniforms = {
      projectionMatrix: new _miniGl.Uniform({ type: "mat4", value: a }),
      modelViewMatrix: new _miniGl.Uniform({ type: "mat4", value: a }),
      resolution: new _miniGl.Uniform({ type: "vec2", value: [1, 1] }),
      aspectRatio: new _miniGl.Uniform({ type: "float", value: 1 }),
    };
  }
  setSize(e = 640, t = 480) {
    (this.width = e),
      (this.height = t),
      (this.canvas.width = e),
      (this.canvas.height = t),
      this.gl.viewport(0, 0, e, t),
      (this.commonUniforms.resolution.value = [e, t]),
      (this.commonUniforms.aspectRatio.value = e / t),
      this.debug("MiniGL.setSize", { width: e, height: t });
  }
  setOrthographicCamera(e = 0, t = 0, n = 0, i = -2e3, s = 2e3) {
    (this.commonUniforms.projectionMatrix.value = [
      2 / this.width,
      0,
      0,
      0,
      0,
      2 / this.height,
      0,
      0,
      0,
      0,
      2 / (i - s),
      0,
      e,
      t,
      n,
      1,
    ]),
      this.debug(
        "setOrthographicCamera",
        this.commonUniforms.projectionMatrix.value
      );
  }

  render() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clearDepth(1);
    this.meshes.forEach((e) => e.draw());
  }
}

function defineSymbol(object, propertyName, val) {
  return (
    propertyName in object
      ? Object.defineProperty(object, propertyName, {
          value: val,
          enumerable: true,
          configurable: true,
          writable: true,
        })
      : (object[propertyName] = val),
    object
  );
}

export class Gradient {
  el = undefined;
  cssVarRetries = 0;
  maxCssVarRetries = 200;
  angle = 0;
  isLoadedClass = false;
  isScrolling = false;
  scrollingTimeout = undefined;
  scrollingRefreshDelay = 200;
  isIntersecting = false;
  shaderFiles = undefined;
  vertexShader = undefined;
  sectionColors = undefined;
  computedCanvasStyle = undefined;
  conf = undefined;
  uniforms = undefined;
  t = 1253106;
  last = 0;
  width = undefined;
  minWidth = 1111;
  height = 600;
  xSegCount = undefined;
  ySegCount = undefined;
  mesh = undefined;
  material = undefined;
  geometry = undefined;
  minigl = undefined;
  scrollObserver = undefined;
  amp = 320;
  seed = 5;
  freqX = 14e-5;
  freqY = 29e-5;
  freqDelta = 1e-5;
  activeColors = [1, 1, 1, 1];
  isMetaKey = false;
  isGradientLegendVisible = false;
  isMouseDown = false;

  handleScroll = () => {
    clearTimeout(this.scrollingTimeout),
      (this.scrollingTimeout = setTimeout(
        this.handleScrollEnd,
        this.scrollingRefreshDelay
      )),
      this.isGradientLegendVisible && this.hideGradientLegend(),
      this.conf.playing && ((this.isScrolling = true), this.pause());
  };

  handleScrollEnd = () => {
    (this.isScrolling = false), this.isIntersecting && this.play();
  };

  resize = () => {
    (this.width = window.innerWidth),
      this.minigl.setSize(this.width, this.height),
      this.minigl.setOrthographicCamera(),
      (this.xSegCount = Math.ceil(this.width * this.conf.density[0])),
      (this.ySegCount = Math.ceil(this.height * this.conf.density[1])),
      this.mesh.geometry.setTopology(this.xSegCount, this.ySegCount),
      this.mesh.geometry.setSize(this.width, this.height),
      (this.mesh.material.uniforms.u_shadow_power.value =
        this.width < 600 ? 5 : 6);
  };

  handleMouseDown = (e) => {
    this.isGradientLegendVisible &&
      ((this.isMetaKey = e.metaKey),
      (this.isMouseDown = true),
      false === this.conf.playing && requestAnimationFrame(this.animate));
  };

  handleMouseUp = () => {
    this.isMouseDown = false;
  };

  animate = (e) => {
    if (!this.shouldSkipFrame(e) || this.isMouseDown) {
      if (
        ((this.t += Math.min(e - this.last, 1e3 / 15)),
        (this.last = e),
        this.isMouseDown)
      ) {
        let e = 160;
        this.isMetaKey && (e = -160), (this.t += e);
      }
      (this.mesh.material.uniforms.u_time.value = this.t), this.minigl.render();
    }
    if (0 !== this.last && this.isStatic)
      return this.minigl.render(), void this.disconnect();
    (this.conf.playing || this.isMouseDown) &&
      requestAnimationFrame(this.animate);
  };

  addIsLoadedClass = () => {
    !this.isLoadedClass &&
      ((this.isLoadedClass = true),
      this.el.classList.add("isLoaded"),
      setTimeout(() => {
        this.el.parentElement.classList.add("isLoaded");
      }, 3e3));
  };

  pause = () => {
    this.conf.playing = false;
  };

  play = () => {
    requestAnimationFrame(() => this.animate());
    this.conf.playing = true;
  };

  initGradient = (selector) => {
    this.el = document.querySelector(selector);
    this.connect();
  };

  constructor() {}

  async connect() {
    this.shaderFiles = {
      vertex: `
        varying vec3 v_color;

        void main() {
          float time = u_time * u_global.noiseSpeed;

          vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;

          vec2 st = 1. - uvNorm.xy;

          //
          // Tilting the plane
          //

          // Front-to-back tilt
          float tilt = resolution.y / 2.0 * uvNorm.y;

          // Left-to-right angle
          float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;

          // Up-down shift to offset incline
          float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);

          //
          // Vertex noise
          //

          float noise = snoise(vec3(
            noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,
            noiseCoord.y * u_vertDeform.noiseFreq.y,
            time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed
          )) * u_vertDeform.noiseAmp;

          // Fade noise to zero at edges
          noise *= 1.0 - pow(abs(uvNorm.y), 2.0);

          // Clamp to 0
          noise = max(0.0, noise);

          vec3 pos = vec3(
            position.x,
            position.y + tilt + incline + noise - offset,
            position.z
          );

          //
          // Vertex color, to be passed to fragment shader
          //

          if (u_active_colors[0] == 1.) {
            v_color = u_baseColor;
          }

          for (int i = 0; i < u_waveLayers_length; i++) {
            if (u_active_colors[i + 1] == 1.) {
              WaveLayers layer = u_waveLayers[i];

              float noise = smoothstep(
                layer.noiseFloor,
                layer.noiseCeil,
                snoise(vec3(
                  noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,
                  noiseCoord.y * layer.noiseFreq.y,
                  time * layer.noiseSpeed + layer.noiseSeed
                )) / 2.0 + 0.5
              );

              v_color = blendNormal(v_color, layer.color, pow(noise, 4.));
            }
          }

          //
          // Finish
          //

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }`,
      noise: `
        //
        // Description : Array and textureless GLSL 2D/3D/4D simplex
        //               noise functions.
        //      Author : Ian McEwan, Ashima Arts.
        //  Maintainer : stegu
        //     Lastmod : 20110822 (ijm)
        //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
        //               Distributed under the MIT License. See LICENSE file.
        //               https://github.com/ashima/webgl-noise
        //               https://github.com/stegu/webgl-noise
        //

        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
            return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r)
        {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        float snoise(vec3 v)
        {
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        // First corner
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 =   v - i + dot(i, C.xxx) ;

        // Other corners
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );

          //   x0 = x0 - 0.0 + 0.0 * C.xxx;
          //   x1 = x0 - i1  + 1.0 * C.xxx;
          //   x2 = x0 - i2  + 2.0 * C.xxx;
          //   x3 = x0 - 1.0 + 3.0 * C.xxx;
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
          vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

        // Permutations
          i = mod289(i);
          vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
          float n_ = 0.142857142857; // 1.0/7.0
          vec3  ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);

          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );

          //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
          //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));

          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);

        //Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;

        // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                        dot(p2,x2), dot(p3,x3) ) );
        }`,
      blend: `
        //
        // https://github.com/jamieowen/glsl-blend
        //

        // Normal

        vec3 blendNormal(vec3 base, vec3 blend) {
          return blend;
        }

        vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
          return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
        }

        // Screen

        float blendScreen(float base, float blend) {
          return 1.0-((1.0-base)*(1.0-blend));
        }

        vec3 blendScreen(vec3 base, vec3 blend) {
          return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
        }

        vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
          return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
        }

        // Multiply

        vec3 blendMultiply(vec3 base, vec3 blend) {
          return base*blend;
        }

        vec3 blendMultiply(vec3 base, vec3 blend, float opacity) {
          return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));
        }

        // Overlay

        float blendOverlay(float base, float blend) {
          return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
        }

        vec3 blendOverlay(vec3 base, vec3 blend) {
          return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
        }

        vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
          return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
        }

        // Hard light

        vec3 blendHardLight(vec3 base, vec3 blend) {
          return blendOverlay(blend,base);
        }

        vec3 blendHardLight(vec3 base, vec3 blend, float opacity) {
          return (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));
        }

        // Soft light

        float blendSoftLight(float base, float blend) {
          return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
        }

        vec3 blendSoftLight(vec3 base, vec3 blend) {
          return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
        }

        vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
          return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
        }

        // Color dodge

        float blendColorDodge(float base, float blend) {
          return (blend==1.0)?blend:min(base/(1.0-blend),1.0);
        }

        vec3 blendColorDodge(vec3 base, vec3 blend) {
          return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));
        }

        vec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {
          return (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));
        }

        // Color burn

        float blendColorBurn(float base, float blend) {
          return (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);
        }

        vec3 blendColorBurn(vec3 base, vec3 blend) {
          return vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));
        }

        vec3 blendColorBurn(vec3 base, vec3 blend, float opacity) {
          return (blendColorBurn(base, blend) * opacity + base * (1.0 - opacity));
        }

        // Vivid Light

        float blendVividLight(float base, float blend) {
          return (blend<0.5)?blendColorBurn(base,(2.0*blend)):blendColorDodge(base,(2.0*(blend-0.5)));
        }

        vec3 blendVividLight(vec3 base, vec3 blend) {
          return vec3(blendVividLight(base.r,blend.r),blendVividLight(base.g,blend.g),blendVividLight(base.b,blend.b));
        }

        vec3 blendVividLight(vec3 base, vec3 blend, float opacity) {
          return (blendVividLight(base, blend) * opacity + base * (1.0 - opacity));
        }

        // Lighten

        float blendLighten(float base, float blend) {
          return max(blend,base);
        }

        vec3 blendLighten(vec3 base, vec3 blend) {
          return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
        }

        vec3 blendLighten(vec3 base, vec3 blend, float opacity) {
          return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
        }

        // Linear burn

        float blendLinearBurn(float base, float blend) {
          // Note : Same implementation as BlendSubtractf
          return max(base+blend-1.0,0.0);
        }

        vec3 blendLinearBurn(vec3 base, vec3 blend) {
          // Note : Same implementation as BlendSubtract
          return max(base+blend-vec3(1.0),vec3(0.0));
        }

        vec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {
          return (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));
        }

        // Linear dodge

        float blendLinearDodge(float base, float blend) {
          // Note : Same implementation as BlendAddf
          return min(base+blend,1.0);
        }

        vec3 blendLinearDodge(vec3 base, vec3 blend) {
          // Note : Same implementation as BlendAdd
          return min(base+blend,vec3(1.0));
        }

        vec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {
          return (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));
        }

        // Linear light

        float blendLinearLight(float base, float blend) {
          return blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));
        }

        vec3 blendLinearLight(vec3 base, vec3 blend) {
          return vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));
        }

        vec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {
          return (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));
        }`,
      fragment: `
        varying vec3 v_color;

        void main() {
          vec3 color = v_color;
          if (u_darken_top == 1.0) {
            vec2 st = gl_FragCoord.xy/resolution.xy;
            color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;
          }
          gl_FragColor = vec4(color, 1.0);
        }`,
    };

    this.conf = {
      presetName: "",
      wireframe: false,
      density: [0.06, 0.16],
      zoom: 1,
      rotation: 0,
      playing: true,
    };

    if (document.querySelectorAll("canvas").length < 1) {
      console.log("DID NOT LOAD HERO STRIPE CANVAS");
    } else {
      this.minigl = new MiniGl(this.el, null, null, false);

      requestAnimationFrame(() => {
        if (this.el) {
          this.computedCanvasStyle = getComputedStyle(this.el);
          this.waitForCssVars();
        }
      });
    }
  }

  disconnect() {
    this.scrollObserver &&
      (window.removeEventListener("scroll", this.handleScroll),
      window.removeEventListener("mousedown", this.handleMouseDown),
      window.removeEventListener("mouseup", this.handleMouseUp),
      window.removeEventListener("keydown", this.handleKeyDown),
      this.scrollObserver.disconnect()),
      window.removeEventListener("resize", this.resize);
  }

  initMaterial() {
    this.uniforms = {
      u_time: new this.minigl.Uniform({ value: 0 }),
      u_shadow_power: new this.minigl.Uniform({ value: 5 }),
      u_darken_top: new this.minigl.Uniform({
        value: "" === this.el.dataset.jsDarkenTop ? 1 : 0,
      }),
      u_active_colors: new this.minigl.Uniform({
        value: this.activeColors,
        type: "vec4",
      }),
      u_global: new this.minigl.Uniform({
        value: {
          noiseFreq: new this.minigl.Uniform({
            value: [this.freqX, this.freqY],
            type: "vec2",
          }),
          noiseSpeed: new this.minigl.Uniform({ value: 5e-6 }),
        },
        type: "struct",
      }),
      u_vertDeform: new this.minigl.Uniform({
        value: {
          incline: new this.minigl.Uniform({
            value: Math.sin(this.angle) / Math.cos(this.angle),
          }),
          offsetTop: new this.minigl.Uniform({ value: -0.5 }),
          offsetBottom: new this.minigl.Uniform({ value: -0.5 }),
          noiseFreq: new this.minigl.Uniform({ value: [3, 4], type: "vec2" }),
          noiseAmp: new this.minigl.Uniform({ value: this.amp }),
          noiseSpeed: new this.minigl.Uniform({ value: 10 }),
          noiseFlow: new this.minigl.Uniform({ value: 3 }),
          noiseSeed: new this.minigl.Uniform({ value: this.seed }),
        },
        type: "struct",
        excludeFrom: "fragment",
      }),
      u_baseColor: new this.minigl.Uniform({
        value: this.sectionColors[0],
        type: "vec3",
        excludeFrom: "fragment",
      }),
      u_waveLayers: new this.minigl.Uniform({
        value: [],
        excludeFrom: "fragment",
        type: "array",
      }),
    };
    for (let e = 1; e < this.sectionColors.length; e += 1)
      this.uniforms.u_waveLayers.value.push(
        new this.minigl.Uniform({
          value: {
            color: new this.minigl.Uniform({
              value: this.sectionColors[e],
              type: "vec3",
            }),
            noiseFreq: new this.minigl.Uniform({
              value: [
                2 + e / this.sectionColors.length,
                3 + e / this.sectionColors.length,
              ],
              type: "vec2",
            }),
            noiseSpeed: new this.minigl.Uniform({ value: 11 + 0.3 * e }),
            noiseFlow: new this.minigl.Uniform({ value: 6.5 + 0.3 * e }),
            noiseSeed: new this.minigl.Uniform({ value: this.seed + 10 * e }),
            noiseFloor: new this.minigl.Uniform({ value: 0.1 }),
            noiseCeil: new this.minigl.Uniform({ value: 0.63 + 0.07 * e }),
          },
          type: "struct",
        })
      );
    return (
      (this.vertexShader = [
        this.shaderFiles.noise,
        this.shaderFiles.blend,
        this.shaderFiles.vertex,
      ].join("\n\n")),
      new this.minigl.Material(
        this.vertexShader,
        this.shaderFiles.fragment,
        this.uniforms
      )
    );
  }

  initMesh() {
    (this.material = this.initMaterial()),
      (this.geometry = new this.minigl.PlaneGeometry()),
      (this.mesh = new this.minigl.Mesh(this.geometry, this.material));
  }

  shouldSkipFrame(e) {
    return (
      !!window.document.hidden ||
      !this.conf.playing ||
      parseInt(e, 10) % 2 == 0 ||
      undefined
    );
  }

  updateFrequency(e) {
    (this.freqX += e), (this.freqY += e);
  }

  toggleColor(index) {
    this.activeColors[index] = 0 === this.activeColors[index] ? 1 : 0;
  }

  showGradientLegend() {
    this.width > this.minWidth &&
      ((this.isGradientLegendVisible = true),
      document.body.classList.add("isGradientLegendVisible"));
  }

  hideGradientLegend() {
    (this.isGradientLegendVisible = false),
      document.body.classList.remove("isGradientLegendVisible");
  }

  init() {
    this.initMesh();
    this.resize();
    requestAnimationFrame(this.animate);
    window.addEventListener("resize", this.resize);
  }

  waitForCssVars() {
    // only wait for CSS variables if the colors haven't already been given
    if (this.sectionColors && this.sectionColors.length > 0) {
      this.init();
      this.addIsLoadedClass();
    } else if (
      this.computedCanvasStyle &&
      this.computedCanvasStyle.getPropertyValue(colorCssVar(0)).indexOf("#") !==
        -1
    ) {
      this.initGradientColors();
      this.init();
      this.addIsLoadedClass();
    } else {
      // Enqueue another retry
      this.cssVarRetries += 1;
      if (this.cssVarRetries > this.maxCssVarRetries) {
        this.sectionColors = [16711680, 16711680, 16711935, 65280, 255];
        this.init();
      } else {
        requestAnimationFrame(() => this.waitForCssVars());
      }
    }
  }

  initGradientColors() {
    this.setGradientColors(
      [0, 1, 2, 3]
        .map(colorCssVar)
        .map((cssPropertyName) => {
          let hex = this.computedCanvasStyle
            .getPropertyValue(cssPropertyName)
            .trim();
          if (4 === hex.length) {
            const hexTemp = hex
              .substr(1)
              .split("")
              .map((hexTemp) => hexTemp + hexTemp)
              .join("");
            hex = `#${hexTemp}`;
          }
          return hex && hex;
        })
        .filter(Boolean)
    );
  }

  setGradientColors(hexColors) {
    this.sectionColors = hexColors
      .map((hex) => `0x${hex.substr(1)}`)
      .map(normalizeColor);
    // If setting colors after the gradient has already started, init again
    if (this.isLoadedClass) {
      this.initMesh();
      this.resize();
    }
  }
}

export function colorCssVar(i) {
  return `--gradient-color-${i + 1}`;
}
