import { useRef, useEffect } from "react";

export function ShaderBackground() {
    const canvasRef =
        useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvasRefCurrent = canvasRef.current;

        if (!canvasRefCurrent) {
            return;
        }

        const canvas: HTMLCanvasElement = canvasRefCurrent;
        const glContext = (
            canvas.getContext('webgl') ??
            canvas.getContext('experimental-webgl')
        ) as WebGLRenderingContext | null;

        if (!glContext) {
            return;
        }

        const gl: WebGLRenderingContext = glContext;

        const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;

      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

        const fragmentShaderSource = `
      precision highp float;

      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      varying vec2 v_texCoord;

      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec2 mod289(vec2 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec3 permute(vec3 x) {
        return mod289(((x * 34.0) + 1.0) * x);
      }

      float snoise(vec2 v) {
        const vec4 C = vec4(
          0.211324865405187,
          0.366025403784439,
          -0.577350269189626,
          0.024390243902439
        );

        vec2 i = floor(
          v + dot(v, C.yy)
        );

        vec2 x0 =
          v - i + dot(i, C.xx);

        vec2 i1 =
          x0.x > x0.y
            ? vec2(1.0, 0.0)
            : vec2(0.0, 1.0);

        vec4 x12 =
          x0.xyxy + C.xxzz;

        x12.xy -= i1;

        i = mod289(i);

        vec3 p = permute(
          permute(
            i.y +
            vec3(0.0, i1.y, 1.0)
          ) +
          i.x +
          vec3(0.0, i1.x, 1.0)
        );

        vec3 m = max(
          0.5 -
          vec3(
            dot(x0, x0),
            dot(x12.xy, x12.xy),
            dot(x12.zw, x12.zw)
          ),
          0.0
        );

        m = m * m;
        m = m * m;

        vec3 x =
          2.0 * fract(p * C.www) - 1.0;

        vec3 h =
          abs(x) - 0.5;

        vec3 ox =
          floor(x + 0.5);

        vec3 a0 =
          x - ox;

        m *=
          1.79284291400159 -
          0.85373472095314 *
          (a0 * a0 + h * h);

        vec3 g;

        g.x =
          a0.x * x0.x +
          h.x * x0.y;

        g.yz =
          a0.yz * x12.xz +
          h.yz * x12.yw;

        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st =
          gl_FragCoord.xy /
          u_resolution.xy;

        st.x *=
          u_resolution.x /
          u_resolution.y;

        float t =
          u_time * 0.18;

        vec2 q = vec2(0.0);

        q.x = snoise(
          st * 1.5 +
          vec2(
            t * 0.2,
            t * 0.15
          )
        );

        q.y = snoise(
          st * 1.5 +
          vec2(
            t * 0.1,
            -t * 0.25
          )
        );

        vec2 r = vec2(0.0);

        r.x = snoise(
          st * 2.5 +
          1.2 * q +
          vec2(1.7, 9.2) +
          0.15 * t
        );

        r.y = snoise(
          st * 2.5 +
          1.2 * q +
          vec2(8.3, 2.8) +
          0.126 * t
        );

        float f =
          snoise(st * 1.8 + r);

        vec3 c1 =
          vec3(0.92, 0.94, 0.98);

        vec3 c2 =
          vec3(0.55, 0.58, 0.92);

        vec3 c3 =
          vec3(0.78, 0.75, 0.95);

        vec3 c4 =
          vec3(0.96, 0.97, 1.0);

        vec3 color = mix(
          c1,
          c2,
          clamp(
            f * 0.8 + 0.2,
            0.0,
            1.0
          )
        );

        color = mix(
          color,
          c3,
          clamp(
            length(q),
            0.0,
            1.0
          ) * 0.5
        );

        color = mix(
          color,
          c4,
          clamp(
            length(r.x),
            0.0,
            1.0
          ) * 0.35
        );

        vec2 uv =
          gl_FragCoord.xy /
          u_resolution.xy;

        float vig =
          uv.x *
          uv.y *
          (1.0 - uv.x) *
          (1.0 - uv.y);

        vig = clamp(
          pow(
            16.0 * vig,
            0.15
          ),
          0.0,
          1.0
        );

        color = mix(
          vec3(
            0.88,
            0.90,
            0.96
          ),
          color,
          vig
        );

        gl_FragColor =
          vec4(color, 1.0);
      }
    `;

        function createShader(
            type: number,
            source: string,
        ) {
            const shader = gl.createShader(type);

            if (!shader) {
                return null;
            }

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            return shader;
        }

        const vertexShader = createShader(
            gl.VERTEX_SHADER,
            vertexShaderSource,
        );

        const fragmentShader = createShader(
            gl.FRAGMENT_SHADER,
            fragmentShaderSource,
        );

        if (
            !vertexShader ||
            !fragmentShader
        ) {
            return;
        }

        const program =
            gl.createProgram();

        if (!program) {
            return;
        }

        gl.attachShader(
            program,
            vertexShader,
        );

        gl.attachShader(
            program,
            fragmentShader,
        );

        gl.linkProgram(program);
        gl.useProgram(program);

        const buffer =
            gl.createBuffer();

        gl.bindBuffer(
            gl.ARRAY_BUFFER,
            buffer,
        );

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1, -1,
                1, -1,
                -1, 1,
                1, 1,
            ]),
            gl.STATIC_DRAW,
        );

        const position =
            gl.getAttribLocation(
                program,
                'a_position',
            );

        gl.enableVertexAttribArray(
            position,
        );

        gl.vertexAttribPointer(
            position,
            2,
            gl.FLOAT,
            false,
            0,
            0,
        );

        const timeLocation =
            gl.getUniformLocation(
                program,
                'u_time',
            );

        const resolutionLocation =
            gl.getUniformLocation(
                program,
                'u_resolution',
            );

        const mouseLocation =
            gl.getUniformLocation(
                program,
                'u_mouse',
            );

        const mouse = {
            x: canvas.width / 2,
            y: canvas.height / 2,
        };

        function resize() {
            const width =
                canvas.clientWidth;

            const height =
                canvas.clientHeight;

            const dpr = Math.min(
                window.devicePixelRatio || 1,
                2,
            );

            canvas.width =
                width * dpr;

            canvas.height =
                height * dpr;
        }

        const resizeObserver =
            new ResizeObserver(resize);

        resizeObserver.observe(canvas);

        resize();

        function handleMouseMove(
            event: MouseEvent,
        ) {
            const rect =
                canvas.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width;

            const y =
                1 -
                (event.clientY - rect.top) /
                rect.height;

            mouse.x = x * canvas.width;
            mouse.y = y * canvas.height;
        }

        window.addEventListener(
            'mousemove',
            handleMouseMove,
        );

        let animationFrame = 0;

        function render(time: number) {
            gl.viewport(
                0,
                0,
                canvas.width,
                canvas.height,
            );

            gl.uniform1f(
                timeLocation,
                time * 0.001,
            );

            gl.uniform2f(
                resolutionLocation,
                canvas.width,
                canvas.height,
            );

            gl.uniform2f(
                mouseLocation,
                mouse.x,
                mouse.y,
            );

            gl.drawArrays(
                gl.TRIANGLE_STRIP,
                0,
                4,
            );

            animationFrame =
                requestAnimationFrame(render);
        }

        animationFrame =
            requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(
                animationFrame,
            );

            resizeObserver.disconnect();

            window.removeEventListener(
                'mousemove',
                handleMouseMove,
            );

            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(buffer);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="bookshelf-auth-shader"
            aria-hidden="true"
        />
    );
}