import React from 'react';

const TestPage = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 font-extrabold text-3xl min-h-screen gap-10">
      <p className="mb-24">
        <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 bg-clip-text text-transparent mb-8">
          TEST PAGE
        </span>
      </p>
      <div
        className="w-full"
        dangerouslySetInnerHTML={{
          __html: `<div id="strip-embed-container-0f78ff2a-40a1-4538-be94-6ea3b437582b" style="width: 100%; height: 350px; display: none;"><iframe id="strip-embed-iframe-0f78ff2a-40a1-4538-be94-6ea3b437582b" src="https://pindropstories.com/embed/strip/0f78ff2a-40a1-4538-be94-6ea3b437582b" width="100%" height="100%" frameborder="0"></iframe></div><script>function init(){let e=document.getElementById("strip-embed-container-0f78ff2a-40a1-4538-be94-6ea3b437582b"),t=document.getElementById("strip-embed-iframe-0f78ff2a-40a1-4538-be94-6ea3b437582b"),s={},i=!1,n=!!navigator.share;const urlParams=new URLSearchParams(t.src.split('?')[1]),customBgColor=urlParams.get('bgColor')?"#"+urlParams.get('bgColor'):null;window.addEventListener("message",function(r){if("https://pindropstories.com"===r.origin)try{let o=JSON.parse(r.data);if("handshake"===o.type&&"0f78ff2a-40a1-4538-be94-6ea3b437582b"===o.id)i=!0,r.source.postMessage(JSON.stringify({type:"handshakeAck",id:"0f78ff2a-40a1-4538-be94-6ea3b437582b"}),r.origin);else if(i&&"0f78ff2a-40a1-4538-be94-6ea3b437582b"===o.id)switch(o.type){case"stripReady":e.style.display="block";break;case"openStory":s={width:e.style.width,height:e.style.height,position:e.style.position,zIndex:e.style.zIndex},t.style.opacity="0",setTimeout(()=>{e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100%",e.style.zIndex="9999",t.style.width="100%",t.style.height="100%",t.style.opacity="1"},50);break;case"closeStory":Object.assign(e.style,s);break;case"redirect":window.location.href=o.args.url;break;case"share":n&&navigator.share({title:o.args.title,url:o.args.url});break;case"checkShareCapability":r.source.postMessage(JSON.stringify({type:"shareCapability",id:"0f78ff2a-40a1-4538-be94-6ea3b437582b",args:{canShare:n}}),r.origin);break;case"getBackgroundColor":r.source.postMessage(JSON.stringify({type:"backgroundColor",id:"0f78ff2a-40a1-4538-be94-6ea3b437582b",args:{color:customBgColor||getComputedStyle(document.body).background}}),r.origin);break;default:console.warn("Unknown message type:",o.type)}}catch(a){console.error("Error processing message:",a)}})}init();</script>`,
        }}
      />
    </div>
  );
};

export default TestPage;
