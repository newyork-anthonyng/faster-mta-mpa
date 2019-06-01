module.exports=function(e){var n={};function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=e,o.c=n,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)o.d(t,r,function(n){return e[n]}.bind(null,r));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="",o(o.s=0)}([function(e,n,o){const t=o(1)(),{headPartial:r,footPartial:a,subwayLinesPartial:l}=o(2),i=new Map([["index","/"]]);t.get(i.get("index"),(e,n)=>{n.write(r),n.write(l),n.write(a),n.end()});const c=t.listen(process.env.HOST||3e3,()=>{console.log(`Server listening on ${c.address().port}`)});e.exports=t},function(e,n){e.exports=require("express")},function(e,n,o){const t=o(3);e.exports={headPartial:'\n<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>MTA - Real-time Subway</title>\n    <meta name="Description" content="Get real time MTA subway times">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <meta name="theme-color" content="#223266">\n  </head>\n  <body>\n    <h1>MTA Subway Time</h1>\n',footPartial:'\n<script>\n  console.log("Foot partial loaded at", Date.now());\n<\/script>\n</body>\n</html>\n',subwayLinesPartial:t}},function(e,n){const o=[{name:1,color:"#d65345"},{name:2,color:"#d65345"},{name:3,color:"#d65345"},{name:4,color:"#547e51"},{name:5,color:"#547e51"},{name:6,color:"#547e51"},{name:7,color:"#974c90"},{name:"A",color:"#397ebf"},{name:"C",color:"#397ebf"},{name:"E",color:"#397ebf"},{name:"G",color:"#a4bf22"},{name:"B",color:"#e38f46"},{name:"D",color:"#e38f46"},{name:"F",color:"#e38f46"},{name:"M",color:"#e38f46"},{name:"J",color:"#9f632e"},{name:"Z",color:"#9f632e"},{name:"L",color:"#999999"},{name:"S",color:"#999999"},{name:"N",color:"#fbdb48"},{name:"R",color:"#fbdb48"},{name:"Q",color:"#fbdb48"}].reduce((e,n)=>e+`\n  <li>\n    <div style="width: 20px; height: 20px; display: inline-block; background-color: ${n.color}"></div>\n    <a href="/subway/${n.name}">${n.name}</a>\n  </li>\n  `,"");e.exports=o}]);