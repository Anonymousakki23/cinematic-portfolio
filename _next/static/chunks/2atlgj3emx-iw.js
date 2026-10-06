(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,5779,e=>{"use strict";var o,t,i,r,n=e.i(43476),s=e.i(75056),a=e.i(72074),l=e.i(53190);function c(){return(c=Object.assign.bind()).apply(null,arguments)}var f=e.i(71645),u=e.i(90072),d=e.i(94931),d=d,p=u;let m=parseInt(u.REVISION.replace(/\D+/g,"")),h=(o={cellSize:.5,sectionSize:1,fadeDistance:100,fadeStrength:1,fadeFrom:1,cellThickness:.5,sectionThickness:1,cellColor:new u.Color,sectionColor:new u.Color,infiniteGrid:!1,followCamera:!1,worldCamProjPosition:new u.Vector3,worldPlanePosition:new u.Vector3},t=`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform vec3 worldPlanePosition;
    uniform float fadeDistance;
    uniform bool infiniteGrid;
    uniform bool followCamera;

    void main() {
      localPosition = position.xzy;
      if (infiniteGrid) localPosition *= 1.0 + fadeDistance;
      
      worldPosition = modelMatrix * vec4(localPosition, 1.0);
      if (followCamera) {
        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
        localPosition = (inverse(modelMatrix) * worldPosition).xyz;
      }

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,i=`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform float cellSize;
    uniform float sectionSize;
    uniform vec3 cellColor;
    uniform vec3 sectionColor;
    uniform float fadeDistance;
    uniform float fadeStrength;
    uniform float fadeFrom;
    uniform float cellThickness;
    uniform float sectionThickness;

    float getGrid(float size, float thickness) {
      vec2 r = localPosition.xz / size;
      vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
      float line = min(grid.x, grid.y) + 1.0 - thickness;
      return 1.0 - min(line, 1.0);
    }

    void main() {
      float g1 = getGrid(cellSize, cellThickness);
      float g2 = getGrid(sectionSize, sectionThickness);

      vec3 from = worldCamProjPosition*vec3(fadeFrom);
      float dist = distance(from, worldPosition.xyz);
      float d = 1.0 - min(dist / fadeDistance, 1.0);
      vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

      gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
      gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
      if (gl_FragColor.a <= 0.0) discard;

      #include <tonemapping_fragment>
      #include <${m>=154?"colorspace_fragment":"encodings_fragment"}>
    }
  `,(r=class extends p.ShaderMaterial{constructor(e){for(const r in super({vertexShader:t,fragmentShader:i,...e}),o)this.uniforms[r]=new p.Uniform(o[r]),Object.defineProperty(this,r,{get(){return this.uniforms[r].value},set(e){this.uniforms[r].value=e}});this.uniforms=p.UniformsUtils.clone(this.uniforms)}}).key=p.MathUtils.generateUUID(),r),g=f.forwardRef(({args:e,cellColor:o="#000000",sectionColor:t="#2080ff",cellSize:i=.5,sectionSize:r=1,followCamera:n=!1,infiniteGrid:s=!1,fadeDistance:l=100,fadeStrength:p=1,fadeFrom:m=1,cellThickness:g=.5,sectionThickness:x=1,side:j=u.BackSide,...y},w)=>{(0,d.e)({GridMaterial:h});let P=f.useRef(null);f.useImperativeHandle(w,()=>P.current,[]);let v=new u.Plane,M=new u.Vector3(0,1,0),C=new u.Vector3(0,0,0);return(0,a.useFrame)(e=>{v.setFromNormalAndCoplanarPoint(M,C).applyMatrix4(P.current.matrixWorld);let o=P.current.material,t=o.uniforms.worldCamProjPosition,i=o.uniforms.worldPlanePosition;v.projectPoint(e.camera.position,t.value),i.value.set(0,0,0).applyMatrix4(P.current.matrixWorld)}),f.createElement("mesh",c({ref:P,frustumCulled:!1},y),f.createElement("gridMaterial",c({transparent:!0,"extensions-derivatives":!0,side:j},{cellSize:i,sectionSize:r,cellColor:o,sectionColor:t,cellThickness:g,sectionThickness:x},{fadeDistance:l,fadeStrength:p,fadeFrom:m,infiniteGrid:s,followCamera:n})),f.createElement("planeGeometry",{args:e}))});var x=d,j=d;let y=e=>e===Object(e)&&!Array.isArray(e)&&"function"!=typeof e;function w(e,o){let t=(0,x.D)(e=>e.gl),i=(0,j.H)(u.TextureLoader,y(e)?Object.values(e):e);return(0,f.useLayoutEffect)(()=>{null==o||o(i)},[o]),(0,f.useEffect)(()=>{if("initTexture"in t){let e=[];Array.isArray(i)?e=i:i instanceof u.Texture?e=[i]:y(i)&&(e=Object.values(i)),e.forEach(e=>{e instanceof u.Texture&&t.initTexture(e)})}},[t,i]),(0,f.useMemo)(()=>{if(!y(e))return i;{let o={},t=0;for(let r in e)o[r]=i[t++];return o}},[e,i])}w.preload=e=>j.H.preload(u.TextureLoader,e),w.clear=e=>j.H.clear(u.TextureLoader,e);let P="#00FFFF",v="#7B61FF",M="#FF00FF";function C({rig:e}){return(0,a.useFrame)((o,t)=>{let i=u.MathUtils.clamp(e.current.progress,0,1),r=u.MathUtils.lerp(26,-152,i),n=2.4*Math.sin(i*Math.PI*2.2)+3.2*e.current.pointerX,s=2.4+1.4*Math.sin(i*Math.PI)+1.6*e.current.pointerY,a=o.camera;a.position.x=u.MathUtils.damp(a.position.x,n,2.6,t),a.position.y=u.MathUtils.damp(a.position.y,s,2.6,t),a.position.z=u.MathUtils.damp(a.position.z,r,2.6,t),a.lookAt(.35*a.position.x,1.1,a.position.z-30)}),null}function F({count:e}){let o=(0,f.useRef)(null),{positions:t,colors:i}=(0,f.useMemo)(()=>{let o=new Float32Array(3*e),t=new Float32Array(3*e),i=[new u.Color(P),new u.Color(v),new u.Color(M)];for(let r=0;r<e;r++){o[3*r]=(Math.random()-.5)*70,o[3*r+1]=26*Math.random()-6,o[3*r+2]=30-210*Math.random();let e=i[Math.floor(Math.random()*i.length)],n=.35+.65*Math.random();t[3*r]=e.r*n,t[3*r+1]=e.g*n,t[3*r+2]=e.b*n}return{positions:o,colors:t}},[e]);return(0,a.useFrame)((e,t)=>{o.current&&(o.current.rotation.y=.008*e.clock.elapsedTime,o.current.position.y=.6*Math.sin(.12*e.clock.elapsedTime))}),(0,n.jsxs)("points",{ref:o,children:[(0,n.jsxs)("bufferGeometry",{children:[(0,n.jsx)("bufferAttribute",{attach:"attributes-position",args:[t,3]}),(0,n.jsx)("bufferAttribute",{attach:"attributes-color",args:[i,3]})]}),(0,n.jsx)("pointsMaterial",{size:.32,vertexColors:!0,transparent:!0,opacity:.85,sizeAttenuation:!0,depthWrite:!1})]})}function b({position:e,color:o,scale:t=1}){let i=(0,f.useRef)(null),r=(0,f.useRef)(null);return(0,a.useFrame)((e,o)=>{if(i.current&&(i.current.rotation.y+=.28*o,i.current.rotation.x+=.12*o),r.current){r.current.rotation.y-=.5*o;let t=1+.08*Math.sin(2.2*e.clock.elapsedTime);r.current.scale.setScalar(t)}}),(0,n.jsxs)("group",{position:e,scale:t,children:[(0,n.jsxs)("mesh",{ref:i,children:[(0,n.jsx)("icosahedronGeometry",{args:[3.2,1]}),(0,n.jsx)("meshBasicMaterial",{color:o,wireframe:!0,transparent:!0,opacity:.55})]}),(0,n.jsxs)("mesh",{ref:r,children:[(0,n.jsx)("icosahedronGeometry",{args:[1.5,0]}),(0,n.jsx)("meshBasicMaterial",{color:o,wireframe:!0,transparent:!0,opacity:.9})]}),(0,n.jsx)("pointLight",{color:o,intensity:60,distance:42,decay:1.8})]})}function T({src:e,position:o,rotationY:t=0,accent:i}){let r=w(e);return(0,f.useMemo)(()=>{r.colorSpace=u.SRGBColorSpace},[r]),(0,n.jsx)(l.Float,{speed:2.2,floatIntensity:.7,rotationIntensity:.12,children:(0,n.jsxs)("group",{position:o,rotation:[0,t,0],children:[(0,n.jsxs)("mesh",{position:[0,0,-.03],children:[(0,n.jsx)("planeGeometry",{args:[4.7,3.35]}),(0,n.jsx)("meshBasicMaterial",{color:i,transparent:!0,opacity:.32})]}),(0,n.jsxs)("mesh",{position:[0,0,-.015],children:[(0,n.jsx)("planeGeometry",{args:[4.7,3.35]}),(0,n.jsx)("meshBasicMaterial",{color:"#04060f"})]}),(0,n.jsxs)("mesh",{children:[(0,n.jsx)("planeGeometry",{args:[4.4,3.05]}),(0,n.jsx)("meshBasicMaterial",{map:r,toneMapped:!1})]}),(0,n.jsx)("pointLight",{color:i,intensity:14,distance:16,decay:1.8,position:[0,0,2]})]})})}function z(){let e=(0,f.useRef)(null);return(0,a.useFrame)(o=>{e.current&&(e.current.rotation.z=.05*o.clock.elapsedTime)}),(0,n.jsxs)("group",{position:[0,9,-178],children:[(0,n.jsxs)("mesh",{ref:e,children:[(0,n.jsx)("torusGeometry",{args:[11,.35,24,128]}),(0,n.jsx)("meshBasicMaterial",{color:P,transparent:!0,opacity:.85})]}),(0,n.jsxs)("mesh",{children:[(0,n.jsx)("torusGeometry",{args:[11,1.6,24,128]}),(0,n.jsx)("meshBasicMaterial",{color:P,transparent:!0,opacity:.08})]}),(0,n.jsxs)("mesh",{children:[(0,n.jsx)("circleGeometry",{args:[8.4,64]}),(0,n.jsx)("meshBasicMaterial",{color:v,transparent:!0,opacity:.14})]}),(0,n.jsx)("pointLight",{color:P,intensity:120,distance:90,decay:1.6})]})}e.s(["default",0,function({rig:e}){let o=(0,f.useMemo)(()=>window.innerWidth<768?420:900,[]);return(0,n.jsx)("div",{className:"pointer-events-none fixed inset-0 z-0","aria-hidden":!0,children:(0,n.jsxs)(s.Canvas,{dpr:[1,1.75],camera:{position:[0,2.4,26],fov:55,near:.1,far:460},gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},style:{width:"100%",height:"100%"},children:[(0,n.jsx)("color",{attach:"background",args:["#04040c"]}),(0,n.jsx)("fogExp2",{attach:"fog",args:["#04040c",.011]}),(0,n.jsx)("ambientLight",{intensity:.35}),(0,n.jsx)("directionalLight",{position:[6,12,8],intensity:.5,color:P}),(0,n.jsxs)(f.Suspense,{fallback:null,children:[(0,n.jsx)(F,{count:o}),(0,n.jsx)(g,{position:[0,-4.2,-60],args:[300,300],cellSize:3,cellThickness:.7,cellColor:"#0a3a44",sectionSize:15,sectionThickness:1.2,sectionColor:"#00ffff",fadeDistance:190,fadeStrength:2.2,infiniteGrid:!0}),(0,n.jsx)(b,{position:[-7.5,2.2,-30],color:P}),(0,n.jsx)(b,{position:[7.5,1.4,-70],color:v,scale:1.25}),(0,n.jsx)(b,{position:[-7.5,2.6,-132],color:M,scale:.9}),(0,n.jsx)(T,{src:"/photography/ig-lightning.jpg",position:[-6.4,2.6,-102],rotationY:.32,accent:M}),(0,n.jsx)(T,{src:"/photography/ig-kingfisher.jpg",position:[6.6,1.6,-110],rotationY:-.3,accent:P}),(0,n.jsx)(T,{src:"/photography/ig-bee.webp",position:[.4,4.6,-118],rotationY:.06,accent:v}),(0,n.jsx)(T,{src:"/photography/ig-glowshroom.jpg",position:[-5.8,.6,-124],rotationY:.28,accent:P}),(0,n.jsx)(T,{src:"/photography/ig-prague.jpg",position:[6.2,4.2,-128],rotationY:-.34,accent:M}),(0,n.jsx)(T,{src:"/photography/ig-butterfly.jpg",position:[0,2.2,-136],rotationY:0,accent:v}),(0,n.jsx)(z,{}),(0,n.jsx)(C,{rig:e})]})]})})}],5779)},11115,function(e){e.n(e.i(5779))}]);