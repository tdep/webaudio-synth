import { useState } from "react";

const MIDIAccess = () => {

  const [overlay, setOverlay] = useState('block')
  //
  //Get access to and initialize the AudioContext
  //
  window.AudioContext = window.AudioContext || window.webkitAudioContext; //define the AudioContext for Chrome and webkit for mozilla
  let ctx; //set global access to context which can change depending on the browse
  const startButton = document.getElementById('overlay'); //button to permit audio output in Chrome
  startButton.addEventListener('click', () => {
    startButton.style.display="none"
    ctx = new AudioContext(); //start the AudioContext (permit sound to play in the browser)
    // console.log(ctx)
  })
  
  //
  //Global variables
  //
  let num = 0
  const oscillators = {} //stores the active oscillators in a global variable
  const waveforms = ['sine', 'square', 'sawtooth', 'triangle']
  let waveform = waveforms[0]
  let globalGain = 0.33
  let filterType = "lowpass" 
  let lowPassFreq = 200
  let lfoFreq = 0

  //
  //Translate midi channel to Hz
  //
  function midiToFreq(number) { //convert the midi number to Hz
    const a = 440; //reference note
    return (a / 32) * (2 ** ((number - 9) / 12)) //bring the reference note down 6 octaves, change not to C, double frquency divided by 12 steps to equal the correct pitch
  }

  //
  //Run the synth
  //
  if (navigator.requestMIDIAccess) { //check if this is an object that exists
    navigator.requestMIDIAccess().then(success, failure) //if it exists, then run success, else run failure
  }

  //
  //Grab MIDI events from the browser if we have access
  //
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

  //
  //Select the waveform for the oscillator
  //
  function waveformSelect(num) { //sets c10 to change waveform
    console.log(waveform) 
    waveform = waveforms[num]
  }

  function volumeController(velocity) {
    let velocityToGain = (1 / 127) * velocity // maximum gain is 1/3 of total gain 0.0026
    globalGain = velocityToGain
    console.log(globalGain)
    return velocityToGain
  }

  function lowPassFreqControll(velocity) {
    lowPassFreq = (((velocity / 127) * 15000) + 200).toFixed(4)
  }

  function lfoControl(velocity) {
    lfoFreq = (((velocity / 127) * 20) + 1)
    console.log(lfoFreq)
  }

  //
  //Handle all of the MIDI input messages
  //
  function handleInput(input) { //grabs the midi message for tracking all midi events
    // console.log(input)
    const command = input.data[0];
    const channel = input.data[1];
    const velocity = input.data[2]
    // console.log(channel)
    switch (command){
      case 145: // key press
      if (velocity > 0) {
        noteOn(channel, velocity);//note is on
      } else {
        noteOff(channel)//note is off
      }
      break;
      case 129: // key release
        noteOff(channel)//note is off
        break;
      case 177: //transport / modwheel / function knobs / volume 
        if (channel === 32) { // waveform selector => c10
          if (num < 4) {  // refer to waveforms array
            waveformSelect(num)
            num += 1
          } else {
            num = 0
            waveformSelect(num)
          }
        }
        if (channel === 20) { // volume control
          volumeController(velocity)
        }
        if (channel === 1) ( //lowpass filter
          lowPassFreqControll(velocity)
        )
        if (channel === 72) (
          lfoControl(velocity)
        )
        break
      
    }
  }

  //
  //Setup the oscillator
  //
  function noteOn(note, velocity) { //handle the note on event
    // console.log(note, velocity)
    const osc = ctx.createOscillator();
    // const osc2 = ctx.createOscillator();
    
    const oscGain = ctx.createGain(); //create the gain element for the overall sound
    oscGain.gain.value = globalGain; // set total gain to be equal to global gain variable
    
    const velocityGainAmount = (1 / 127) * velocity; // convert the velocity to a number between 0 and 1 to use for gain
    const velocityGain = ctx.createGain(); //create another gain element for velocity
    velocityGain.gain.value = velocityGainAmount // set the velocity gain to the converted number
    
    const biquadFilter = ctx.createBiquadFilter();
    biquadFilter.type = filterType
    biquadFilter.frequency.value = lowPassFreq

    osc.type = waveform; // set the waveform to the global waveform variable
    osc.frequency.value = midiToFreq(note);

    // osc2.type = 'square'
    // osc.frequency.value = lfoFreq
    
    //CONNECTIONS
    osc.connect(biquadFilter)
    biquadFilter.connect(oscGain);
    oscGain.connect(velocityGain)
    velocityGain.connect(ctx.destination);
    
    osc.gain = oscGain // creates a custom property on the osc object grabbing the gainNode
    console.log(osc)
    oscillators[note.toString()] = osc; //logs the target oscillators globally
    // console.log(oscillators)
    osc.start();
    
  }

  //
  //disengage the oscillator
  //
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

  //
  //list all of the available devices
  //
  function updateDevices(event) {
    // console.log(event);
    console.log(`Name: ${event.port.name}, Brand: ${event.port.manufacturer}, State: ${event.port.state}, Type: ${event.port.type}`)
  }

  //
  //if we do not have access to the MIDI
  //
  function failure() {
   console.log('Could not connect MIDI')
  }
}

export default MIDIAccess