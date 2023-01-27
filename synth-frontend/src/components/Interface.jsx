import MIDIAccess from "./MIDIAccess"
import { useState } from "react"

const Interface = () => {
  
  const guiVolume = (e) => {
    console.log(e.target.value)
    return(e.target.value)
  }

  const guiWaveforms = (e) => {
    console.log(e.target.name)
    return(e.target.name)
  
  }

  const guiLoPass = (e) => {
    console.log(e.target.value)
    return(e.target.value)
  }


  return (
    <div id="case">
      <div id="upper-container">
        <div id="visualizer-container">
          <div id="visualizer">
            <canvas id="canvas"></canvas>
            <p id="wave-label">waveform</p>
          </div>
        </div>
      </div>
      <div id="lower-container">
        <div id="left-container">
          <div id="volume-control-container">
            <div className="fader-label">
              <p>Volume</p>
            </div>
            <div className="fader" id="volume-fader" onChange={guiVolume}>
              <input type="range" id="volume" name="volume" min="0" max="127" className="fader" />
              <datalist id="values">
                <option value="100" label="100"></option>
                <option value="50" label="50"></option>
                <option value="0" label="0 db"></option>
              </datalist>
            </div>
          </div>
        </div>
        <div id="center-container">
          <div id="waveform-select-container">
            <div className="fader-label">
              <p>Waveform Select</p>
            </div>
            <div id="buttons">
              <div className="button-container">
                <button className="waveselect" name="sine" onClick={guiWaveforms}>Sine</button>
              </div>
              <div className="button-container">
                <button className="waveselect" name="square" onClick={guiWaveforms}>Square</button>
              </div>
              <div className="button-container">
                <button className="waveselect" name="sawtooth" onClick={guiWaveforms}>Sawtooth</button>
              </div>
              <div className="button-container">
                <button className="waveselect" name="triangle" onClick={guiWaveforms}>Triangle</button>
              </div>
            </div>
          </div>
        </div>
        <div id="right-container">
          <div id="lopass-control-container">
            <div className="fader-label">
              <p>LoPass Filter</p>
            </div>
            <div className="fader" id="lopass-fader">
              <input type="range" id="lopass" name="lopass" min="200" max="15000" className="fader" onChange={guiLoPass}/>
              <datalist id="values">
                <option value="15000" label="15000"></option>
                <option value="7400" label="7400"></option>
                <option value="200" label="200 Hz"></option>
              </datalist>
            </div>
          </div>
        </div>
      </div>
      <MIDIAccess />
    </div>
  )
}

export default Interface