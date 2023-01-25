const Test = () => {
  console.clear();
  
  navigator.requestMIDIAccess().then(access => {
    const devices = access.inputs.values();
    for (let device of devices) {
      device.onmidimessage = onMidiMessage;
    }
  }).catch(console.error);
  
  function onMidiMessage(message) {
    let [_, input, value] = message.data;
    console.log({ input, value })
  }

  onMidiMessage()
}

export default Test
