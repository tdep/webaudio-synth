import React from 'react'
import ReactDOM from 'react-dom/client'
import Interface from './components/Interface'
import MIDIAccess from './components/MIDIAccess'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <div className="synth">
        <Interface />
    </div>

)
