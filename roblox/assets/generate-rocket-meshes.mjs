// Generate real glTF 2.0 mesh assets without Blender or npm dependencies.
// Run: node roblox/assets/generate-rocket-meshes.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
function generate(which) {
 const mat={
  titanium:[.59,.66,.74,.83,.31],gunmetal:[.16,.19,.23,.76,.39],
  black:[.055,.065,.09,.24,.78],ceramic:[.21,.24,.3,.12,.69],
  brass:[.67,.46,.19,.76,.3],copper:[.58,.29,.14,.75,.4],
  orange:[.93,.35,.08,.31,.4],blue:[.07,.4,.85,.4,.38],
  yellow:[.93,.7,.15,.31,.47],red:[.78,.12,.08,.3,.52]
 };
 const batches=new Map(),two=Math.PI*2;
 function mesh(n,m){const key=n+"|"+m;if(!batches.has(key))batches.set(key,{name:n,mat:m,p:[],n:[],idx:[]});return batches.get(key)}
 function v(b,p,n){const i=b.p.length/3;b.p.push(...p);b.n.push(...n);return i}
 function tri(b,a,c,d){b.idx.push(a,c,d)}
 const unit=p=>{const L=Math.hypot(...p)||1;return p.map(x=>x/L)};
 function lathe(name,m,profile,cy=0,cz=0,N=40,inside=false){
  const b=mesh(name,m),base=b.p.length/3;
  for(let i=0;i<profile.length;i++){
   const [x,r]=profile[i],a=profile[Math.max(0,i-1)],z=profile[Math.min(i+1,profile.length-1)];
   const slope=(z[1]-a[1])/Math.max(.0001,z[0]-a[0]);
   for(let k=0;k<=N;k++){const t=two*k/N,c=Math.cos(t),s=Math.sin(t);v(b,[x,cy+r*c,cz+r*s],unit([slope*(inside?1:-1),inside?-c:c,inside?-s:s]))}
  }
  for(let i=0;i<profile.length-1;i++)for(let k=0;k<N;k++){
   const a=base+i*(N+1)+k,c=a+N+1;
   if(!inside){tri(b,a,a+1,c);tri(b,a+1,c+1,c)}else{tri(b,a,c,a+1);tri(b,a+1,c,c+1)}
  }
 }
 function ring(name,m,x,y,z,R,r,N=28,S=6){
  const b=mesh(name,m),base=b.p.length/3;
  for(let i=0;i<=N;i++)for(let k=0;k<=S;k++){
   const a=two*i/N,t=two*k/S,ct=Math.cos(t),st=Math.sin(t),ca=Math.cos(a),sa=Math.sin(a);
   v(b,[x+r*st,y+(R+r*ct)*ca,z+(R+r*ct)*sa],[st,ct*ca,ct*sa]);
  }
  for(let i=0;i<N;i++)for(let k=0;k<S;k++){const a=base+i*(S+1)+k,c=a+S+1;tri(b,a,a+1,c);tri(b,a+1,c+1,c)}
 }
 function pipe(name,m,pts,r,S=8){
  const b=mesh(name,m),base=b.p.length/3;
  for(let i=0;i<pts.length;i++){
   const p=pts[i],a=pts[Math.max(0,i-1)],z=pts[Math.min(pts.length-1,i+1)];
   const t=unit(z.map((d,k)=>d-a[k])),up=Math.abs(t[1])>.85?[0,0,1]:[0,1,0];
   const u=unit([t[1]*up[2]-t[2]*up[1],t[2]*up[0]-t[0]*up[2],t[0]*up[1]-t[1]*up[0]]);
   const w=[t[1]*u[2]-t[2]*u[1],t[2]*u[0]-t[0]*u[2],t[0]*u[1]-t[1]*u[0]];
   for(let j=0;j<=S;j++){
    const a=two*j/S,normal=u.map((d,k)=>d*Math.cos(a)+w[k]*Math.sin(a));
    v(b,p.map((d,k)=>d+r*normal[k]),normal);
   }
  }
  for(let i=0;i<pts.length-1;i++)for(let k=0;k<S;k++){
   const a=base+i*(S+1)+k,c=a+S+1;tri(b,a,a+1,c);tri(b,a+1,c+1,c);
  }
 }
 function line(name,m,a,z,r){pipe(name,m,[a,z],r)}
 function bez(a,b,c,d,N=15){const p=[];for(let i=0;i<=N;i++){let t=i/N,u=1-t;p.push(a.map((_,j)=>u*u*u*a[j]+3*u*u*t*b[j]+3*u*t*t*c[j]+t*t*t*d[j]))}return p}
 function box(name,m,p,s){
  const b=mesh(name,m),h=s.map(z=>z/2),[x,y,z]=p;
  for(const [n,pts] of [
   [[1,0,0],[[h[0],-h[1],-h[2]],[h[0],h[1],-h[2]],[h[0],h[1],h[2]],[h[0],-h[1],h[2]]]],
   [[-1,0,0],[[-h[0],-h[1],h[2]],[-h[0],h[1],h[2]],[-h[0],h[1],-h[2]],[-h[0],-h[1],-h[2]]]],
   [[0,1,0],[[-h[0],h[1],-h[2]],[-h[0],h[1],h[2]],[h[0],h[1],h[2]],[h[0],h[1],-h[2]]]],
   [[0,-1,0],[[-h[0],-h[1],h[2]],[-h[0],-h[1],-h[2]],[h[0],-h[1],-h[2]],[h[0],-h[1],h[2]]]],
   [[0,0,1],[[h[0],-h[1],h[2]],[h[0],h[1],h[2]],[-h[0],h[1],h[2]],[-h[0],-h[1],h[2]]]],
   [[0,0,-1],[[-h[0],-h[1],-h[2]],[-h[0],h[1],-h[2]],[h[0],h[1],-h[2]],[h[0],-h[1],-h[2]]]]
  ]){let start=b.p.length/3;for(const q of pts)v(b,[q[0]+x,q[1]+y,q[2]+z],n);tri(b,start,start+1,start+2);tri(b,start,start+2,start+3)}
 }
 if(which==="engine"){
  lathe("turbine_core","titanium",[[-15,2.9],[-13,3.5],[-9,3.85],[-5,3.75],[-1,3.2],[5,3.05]],0,0,48);
  lathe("chamber","titanium",[[5,3],[9,3.05],[13,2.7],[17,2.1],[20,1.9]],0,0,48);
  const bell=[[19.6,1.9],[20.5,1.9],[22,2.3],[24,3],[27,3.9],[30,4.67],[34,5.36],[37.7,5.82],[39,5.9]];
  lathe("bell_shell","gunmetal",bell,0,0,64);
  lathe("bell_inner","ceramic",[[27,3.65],[30,4.35],[34,5.05],[37.7,5.49],[38.8,5.57]],0,0,64,true);
  ring("exit_lip","brass",38.9,0,0,5.85,.26,56,10);
  for(const [x,r] of [[-13,3.3],[-9,3.9],[-6,3.85],[-2,3.4],[5,3.13],[10,3],[18,2.2]]){
   ring("flange_ring","black",x,0,0,r,.23,36,6);
   for(let k=0;k<12;k++){let a=two*k/12,c=Math.cos(a),s=Math.sin(a);line("flange_bolt","brass",[x-.2,(r+.36)*c,(r+.36)*s],[x+.23,(r+.36)*c,(r+.36)*s],.115)}
  }
  for(let j=0;j<28;j++){
   let t=two*j/28;const pts=bell.slice(1).map(([x,r])=>[x,(r+.14)*Math.cos(t),(r+.14)*Math.sin(t)]);
   pipe("cooling_rib",j%7===0?"copper":"titanium",pts,.08,6);
  }
  for(const [x,y,z] of [[-9,4.3,3.1],[-7,-4.1,-3.2],[1,3.6,-3.8]]){
   lathe("turbopump","gunmetal",[[x-2.8,1.3],[x-2,2],[x-.5,2.2],[x+1.9,2],[x+2.5,1.3]],y,z,28);
   for(let q=0;q<6;q++)ring("pump_fins","black",x-1.8+q*.68,y,z,2.08,.12,24,6);
   for(let k=0;k<10;k++){let t=two*k/10;line("pump_bolts","brass",[x+2.2,y+1.65*Math.cos(t),z+1.65*Math.sin(t)],[x+2.55,y+1.65*Math.cos(t),z+1.65*Math.sin(t)],.13)}
  }
  for(const [name,m,a,b,c,d,r] of [
   ["CH4_supply","orange",[-13,5.7,3],[-5,8,5],[8,7,4],[17,2.0,2],.35],
   ["LOX_supply","blue",[-11,-5,-3],[0,-7,-6],[10,-5,-4],[18,-1,-2],.35],
   ["warm_return","copper",[-4,5,5],[4,7,7],[15,4,7],[19,1,3],.25],
   ["sensor_harness","black",[-12,3,-5],[-4,6,-7],[11,7,-5],[27,4,-3],.16],
   ["hydraulic_line","titanium",[-8,-3,6],[0,-5,6],[8,-5,5],[13,-2,3],.22]
  ]) pipe(name,m,bez(a,b,c,d,22),r,10);
  ring("injector_header","brass",6,0,0,3.2,.35,44,8);
  for(let j=0;j<18;j++){let t=two*j/18;line("injectors","copper",[5,3.1*Math.cos(t),3.1*Math.sin(t)],[8,2.9*Math.cos(t),2.9*Math.sin(t)],.1)}
  for(let j=0;j<8;j++){
   const x=-12+j*3;
   for(const z of [-1,1]){
    line("thermocouple","copper",[x,4.4,z*2.3],[x+1,5.4,z*2.6],.12);
    box("mounting_tab","gunmetal",[x,4.4,z*2.3],[1.4,.3,.65]);
   }
  }
 }else{
  for(const z of [-9.5,9.5]){
   for(const x of [-25,-2,18,38]){
    box("frame_column","gunmetal",[x,-4,z],[1.3,11,1.3]);
    line("stiffener","titanium",[x,-7,z],[x+7,-1,z],.28);
    box("footplate","black",[x,-8.4,z],[3.5,.5,3]);
    for(const dx of [-1.1,1.1])for(const dz of [-.9,.9])line("foundation_bolts","brass",[x+dx,-8.5,z+dz],[x+dx,-7.8,z+dz],.13);
   }
   box("I_beam","gunmetal",[7,-4,z],[67,1.8,1.5]);
   box("walkway","titanium",[6,5.4,z],[66,.5,2.9]);
   for(let x=-24;x<40;x+=2.7)box("anti_slip_grid","black",[x,5.75,z],[.56,.12,2.85]);
   for(let x=-23;x<40;x+=6){line("handrail_posts","brass",[x,5.75,z],[x,9.3,z],.17)}
   line("top_rail","brass",[-23,9.3,z],[40,9.3,z],.21);
   line("middle_rail","gunmetal",[-23,7.2,z],[40,7.2,z],.13);
  }
  for(const x of [-12,8,26]){
   box("cross_beam","gunmetal",[x,-5,0],[2,2.2,21]);
   for(const z of [-7,7])box("gusset_plate","titanium",[x,-3.8,z],[2.8,1.8,2.8]);
  }
  for(const x of [-8,13]){
   const pts=[];for(let i=0;i<=18;i++){let a=Math.PI*1.1+Math.PI*.8*i/18;pts.push([x,4.4*Math.sin(a),4.4*Math.cos(a)])}
   pipe("curved_saddle","titanium",pts,.5,10);
   for(const z of [-3,3]){box("saddle_foot","gunmetal",[x,-5,z],[3.2,3,1.8]);line("clamp_stud","brass",[x,-3.4,z],[x,-1.6,z],.18)}
  }
  for(const x of [-7,8,24])for(const z of [-6,6]){
   box("hydraulic_jack","gunmetal",[x,-4.8,z],[2,6,2]);
   line("hydraulic_piston","titanium",[x,-2,z],[x,.2,z],.35,12);
   ring("hydraulic_seal","black",x,-2,z,.67,.12,22,6);
  }
  for(const z of [-11,11]){
   for(let y=-6;y<=6;y+=1.3)line("ladder_rung","yellow",[-28,y,z],[-26,y,z],.14);
   for(const x of [-28,-26])line("ladder_rail","titanium",[x,-7,z],[x,7,z],.24);
  }
  for(const [n,m,z,y] of [["CH4","orange",-7,11],["LOX","blue",0,13],["N2","yellow",7,10]]){
   pipe(n+"feed",m,bez([-28,-6,z],[-23,y-5,z],[-7,y,z],[9,y,z],22),.4,10);
   pipe(n+"drop",m,bez([9,y,z],[12,y,z],[14,7,z],[14,4,z],14),.34,10);
   for(const x of [-18,-8,2,10])ring(n+"clamp","gunmetal",x,y,z,.55,.15,20,6);
  }
  line("deluge_manifold","blue",[-12,14,0],[37,14,0],.46,12);
  for(let x=-10;x<37;x+=5.5){
   line("deluge_drop","blue",[x,14,0],[x,11.3,0],.2);
   ring("sprayer_nozzle","titanium",x,11.1,0,.4,.14,20,6);
  }
  for(const x of [-20,8,24]){
   line("valve_stem","brass",[x,10,-7],[x,12,-7],.23);
   ring("valve_wheel","red",x,12,-7,1.2,.14,24,6);
   for(let k=0;k<4;k++){let a=two*k/4;line("valve_spoke","gunmetal",[x,12,-7],[x,12+1.2*Math.cos(a),-7+1.2*Math.sin(a)],.10)}
  }
  for(let x=-16;x<38;x+=7){
   box("instrument_cabinet","gunmetal",[x,-6.5,12.5],[3.5,3,1.5]);
   box("access_panel","titanium",[x,-6.3,13.35],[2.7,2.3,.12]);
  }
 }
 const materials=Object.entries(mat).map(([name,[r,g,b,metal,rough]])=>({name,doubleSided:true,pbrMetallicRoughness:{baseColorFactor:[r,g,b,1],metallicFactor:metal,roughnessFactor:rough}}));
 const IDs=Object.fromEntries(Object.keys(mat).map((x,i)=>[x,i]));
 const bytes=[],views=[],accessors=[],meshes=[],nodes=[],stats=[];
 function buf(data,format,target){
  while(bytes.length%4)bytes.push(0);const start=bytes.length,arr=new ArrayBuffer(4),dv=new DataView(arr);
  for(const f of data){if(format===5126)dv.setFloat32(0,f,true);else dv.setUint32(0,f,true);bytes.push(...new Uint8Array(arr))}
  const id=views.length;views.push({buffer:0,byteOffset:start,byteLength:bytes.length-start,target});return id
 }
 function acc(data,type,format,target,range){
  const obj={bufferView:buf(data,format,target),componentType:format,count:data.length/(type==="VEC3"?3:1),type};
  if(range){obj.min=range[0];obj.max=range[1]}accessors.push(obj);return accessors.length-1
 }
 for(const b of batches.values()){
  const n=b.p.length/3,tris=b.idx.length/3;if(!tris)continue;if(tris>20000)throw Error(b.name+": "+tris);
  const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<b.p.length;i+=3)for(let j=0;j<3;j++){min[j]=Math.min(min[j],b.p[i+j]);max[j]=Math.max(max[j],b.p[i+j])}
  const ip=acc(b.p,"VEC3",5126,34962,[min,max]),inn=acc(b.n,"VEC3",5126,34962),ii=acc(b.idx,"SCALAR",5125,34963);
  meshes.push({name:b.name,primitives:[{attributes:{POSITION:ip,NORMAL:inn},indices:ii,material:IDs[b.mat]}]});
  nodes.push({name:b.name,mesh:meshes.length-1});stats.push({name:b.name,vertices:n,triangles:tris})
 }
 const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",encoded=[];
 for(let i=0;i<bytes.length;i+=3){
  const a=bytes[i],b=bytes[i+1]||0,c=bytes[i+2]||0;
  encoded.push(chars[a>>2],chars[((a&3)<<4)|(b>>4)],i+1<bytes.length?chars[((b&15)<<2)|(c>>6)]:"=",i+2<bytes.length?chars[c&63]:"=");
 }
 return {gltf:JSON.stringify({asset:{version:"2.0",generator:"Put-It-Out GLTF generator 1.0"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,materials,
  buffers:[{byteLength:bytes.length,uri:"data:application/octet-stream;base64,"+encoded.join("")}],bufferViews:views,accessors}),stats};
}
const output=join(dirname(fileURLToPath(import.meta.url)),'generated');
mkdirSync(output,{recursive:true});
for(const kind of ['engine','stand']){
 const model=generate(kind),file=join(output,kind==='engine'?'rocket-engine.gltf':'rocket-stand.gltf');
 writeFileSync(file,model.gltf,'utf8');
 console.log(file,model.stats.reduce((s,x)=>s+x.triangles,0),'triangles',model.stats.length,'meshes');
}
