class Oscillator {
  constructor() {
    this.isPlaying = false;
    this.canvas = document.querySelector('canvas');
    this.WIDTH = 640;
    this.HEIGHT = 240;
  }
  // sets up the Oscillator class
}

Oscillator.prototype.play = function () {
  // creates the nodes
  this.oscillator = context.createOscillator();
  this.analyzer = context.createAnalyzer();

  // setup the graph
  this.oscillator.connect(this.analyzer);
  this.analyzer.connect(context.destination);

  this.oscillator[this.oscillator.start ? 'start' : 'noteOn'](0);

  requestAnimationFrame(this.visualize.bind(this));
}

Oscillator.prototype.stop = function() {
  this.oscillator.stop(0)
}

Oscillator.prototype.toggle = function() {
  (this.isPlaying ? this.stop() : this.play());
  this.isPlaying = !this.isPlaying;
}

Oscillator.prototype.changeFrequency = function(val) {
  this.oscillator.frequency.value = val;
}

Oscillator.prototype.changeDetune = function(val) {
  this.oscillator.detune.value = val;
}

Oscillator.prototype.changeType = function(type) {
  this.oscillator.type = type;
}

Oscillator.prototype.visualize = function() {
  this.canvas.width = this.WIDTH;
  this.canvas.height = this.HEIGHT;
  let drawContext = this.canvas.getContext('2d');

  let times = new Uint8Array(this.analyzer.frequencyBinCount);
  this.analyzer.getByteTimeDomainData(times);
  for (let i = 0; i < times.length; i++) {
    let value = times[i];
    let percent = value / 256;
    let height = this.HEIGHT * percent;
    let offset = this.HEIGHT - height - 1;
    let barWidth = this.WIDTH/times.length;
    drawContext.fillStyle = 'black';
    drawContext.fillRect(i * barWidth, offset, 1, 1);
  }
  requestAnimationFrame(this.visualize.bind(this));
}