// Initialize a new context
context = new (window.AudioContext || window.webkitAudioContext)();

if (context.state === 'suspended') {
  const overlay = document.getElementById('overlay');
  document.addEventListener('click', () => {
    context.resume().then(() => {
      overlay.className = 'hidden';
    });
  }, {once: true});
}

if (!context.createGain){
  context.createGain = context.createGainNode;
}
if (!context.Delay){
  context.createDelay = context.createDelayNode;
}
if (!context.createScriptProcessor) {
  context.createScriptProcessor = context.createJavaScriptNode;
}

//shim layer with setTimeout fallback (what does this mean???)
window.requestAnimFrame = (function() {
  return(
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    });
})();

function playSound(buffer, time) {
  let source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source[source.start ? 'start' : 'noteOn'](time);
}

function loadSounds(obj, soundMap, callback) {
  //Array-ify
  let names = [];
  let paths = [];
  for (let name in soundMap) {
    let path = soundMap[name];
    names.push(name);
    paths.push(path);
  }
  bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (let i = 0; i < bufferList.length; i++) {
      let buffer = bufferList[i];
      let name = names[i]
      obj[name] = buffer
    }
    if (callback) {
      callback();
    }
  });
  bufferLoader.load();
}

class BufferLoader {
  constructor(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
  }
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  //load buffer asynchronously
  let request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  let loader = this;

  request.onload = function() {
    //Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length){
          loader.onload(loader.bufferList);
        }
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
};

BufferLoader.prototype.load = function() {
  for (let i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};