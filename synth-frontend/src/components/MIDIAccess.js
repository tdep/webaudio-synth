const MIDIAccess = () => {
  
  window.AudioContext = window.AudioContext || window.webkitAudioContext; //define the AudioContext for Chrome and webkit for mozilla
  let ctx; //set global access to context which can change depending on the browse
  const startButton = document.querySelector('button'); //button to permit audio output in Chrome
  startButton.addEventListener('click', () => {
    ctx = new AudioContext(); //start the AudioContext (permit sound to play in the browser)
    // console.log(ctx)
  })
  
  let num = 0
  const oscillators = {} //stores the active oscillators in a global variable
  const waveforms = ['sine', 'square', 'sawtooth', 'triangle']
  let waveform = waveforms[0]


  function midiToFreq(number) { //convert the midi number to Hz
    const a = 440; //reference note
    return (a / 32) * (2 ** ((number - 9) / 12)) //bring the reference note down 6 octaves, change not to C, double frquency divided by 12 steps to equal the correct pitch
  }

  if (navigator.requestMIDIAccess) { //check if this is an object that exists
    navigator.requestMIDIAccess().then(success, failure) //if it exists, then run success, else run failure
  }

  function success(midiAccess) {
    // console.log(midiAccess);
    midiAccess.onstatechange = updateDevices; // check the number of devices (onstatechange is an event listener)
    // midiAccess.addEventListener('statechange', updateDevices) // same as the above
    const inputs = midiAccess.inputs;
    // console.log(inputs)
    inputs.forEach((input) => {//selects the input device
      // console.log(input)
      // input.onmidimessage = handleInput; //onmidimessage is an event listener
      input.addEventListener('midimessage', handleInput)
    })
  }

  function waveformSelect(num) { //sets c10 to change waveform
    console.log(waveform) 
    waveform = waveforms[num]
  }

  function handleInput(input) { //grabs the midi message for tracking all midi events
    // console.log(input)
    const command = input.data[0];
    const channel = input.data[1];
    const velocity = input.data[2]
    // console.log(channel)
    switch (command){
      case 145: //note is on
      if (velocity > 0) {
        noteOn(channel, velocity);//note is on
      } else {
        noteOff(channel)//note is off
      }
      break;
      case 129: //note is off
        noteOff(channel)//note is off
        break;
      case 177:
        if (channel === 32) {
          if (num < 4) { 
            waveformSelect(num)
            num += 1

          } else {
            num = 0
            waveformSelect(num)
          }
        }
    }
  }

  function noteOn(note, velocity) { //handle the note on event
    // console.log(note, velocity)
    const osc = ctx.createOscillator();
    
    const oscGain = ctx.createGain(); //create the gain element for the overall sound
    oscGain.gain.value = 0.33; // set the default gain to be 1/3 of total gain
    
    const velocityGainAmount = (1 / 127) * velocity; // convert the velocity to a number between 0 and 1 to use for gain
    const velocityGain = ctx.createGain(); //create another gain element for velocity
    velocityGain.gain.value = velocityGainAmount // set the velocity gain to the converted number
    
    osc.type = waveform;
    osc.frequency.value = midiToFreq(note);
    
    //CONNECTIONS
    osc.connect(oscGain);
    oscGain.connect(velocityGain)
    velocityGain.connect(ctx.destination);
    
    osc.gain = oscGain // creates a custom property on the osc object grabbing the gainNode
    console.log(osc)
    oscillators[note.toString()] = osc; //logs the target oscillators globally
    // console.log(oscillators)
    osc.start();
    
  }

  function noteOff(note) { //handle the note off event
    // console.log(note) //why does this trigger 5 times?
    const osc = oscillators[note.toString()]; //logs the target oscillators globally
    const oscGain = osc.gain;

    oscGain.gain.setValueAtTime(oscGain.gain.value, ctx.currentTime); //sets the gain value of the osc object at the current time of the ctx
    oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03); //ramps the gain value down rapidly for a duration of time

    setTimeout(() => { //delays the following functions in order to give space to the ramp down
      osc.stop(); //stops the oscillator from running
      osc.disconnect() //gets rid of the oscillator altogether
    }, 20)

    delete oscillators[note.toString()]
    // console.log(oscillators)
  }

  function updateDevices(event) {
    // console.log(event);
    console.log(`Name: ${event.port.name}, Brand: ${event.port.manufacturer}, State: ${event.port.state}, Type: ${event.port.type}`)
  }
  function failure() {
    console.log('Could not connect MIDI')
  }

}

export default MIDIAccess