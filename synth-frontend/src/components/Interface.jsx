const Interface = () => {

  return (
    <div id="case">
      <div id="upper-container">
        <div id="visualizer-container">
          <div id="visualizer">
            <p>pretty pictures go here</p>
          </div>
        </div>
      </div>
      <div id="lower-container">
        <div id="left-container">
          <div id="volume-control-container">
            <div className="fader-label">
              <p>Volume</p>
            </div>
            <input type="range" min="0" max="127" value="60" class="slider" id="volume-fader">

            </input>
          </div>
        </div>
        <div id="center-container">
          <p>Waveform Select</p>
          <div id="waveform-select-container">
            <div className="button-container">
              <button>Sine</button>
            </div>
            <div className="button-container">
              <button>Square</button>
            </div>
            <div className="button-container">
              <button>Sawtooth</button>
            </div>
            <div className="triangle">
              <button>Triangle</button>
            </div>
          </div>
        </div>
        <div id="right-container">
          <div id="lopass-control-container">
            <div className="fader-label">
              <p>LoPass Filter</p>
            </div>
            <input type="range" min="0" max="127" value="60" class="slider" id="lopass-fader">

            </input>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Interface