const MIDIAccess = () => {
  let midi = null //global MIDIAccess object

  function onMIDISuccess(midiAccess) {
    console.log("MIDI ready!")
    midi = midiAccess //store the global
  }

  function onMIDIFailure(msg) {
    console.error(`Failed to get MIDI access - ${msg}`);
  }

  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)

  function listInputsAndOutputs(midiAccess) { //grab the i/o info
    for (const entry of midiAccess.inputs) {
      const input = entry[1];
    //   console.log(`Input port [type:'${input.type}']` + 
    //     ` id:'${input.id}'` +
    //     ` manufacturer: '${input.manufacturer}'` + 
    //     ` name: '${input.name}'` +
    //     ` version: '${input.version}'`);
    }

    for (const entry of midiAccess.outputs) { //print the output details
      const output = entry[1];
      // console.log(`Output port [type: '${output.type}'] id: '${output.id}'
        // manufacturer: '${output.manufacturer}' name: '${output.name}' version: '${output.version}'`);
    }
  }

  navigator.requestMIDIAccess().then(listInputsAndOutputs)

  function onMIDIMessage(event) {
    let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]:`;
    for (const character of event.data) {
      str += `0x${character.toString(16)} `;
    }
    // console.log(str)
  }

  function startLoggingMIDIInput(midiAccess, indexOfPort) {
    midiAccess.inputs.forEach((entry) => {entry.onmidimessage = onMIDIMessage;});
  }

  navigator.requestMIDIAccess().then(startLoggingMIDIInput)

}

export default MIDIAccess