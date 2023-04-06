# README
## webaudio-synth


This is a simple oscillator controlled by MIDI intput in the browser using the Webaudio API that I built as a Flatiron School project.

The goal was to be able to use an external MIDI device to control a web application and learn how to use the webaudio api in preperation for my final project for FI. 

In the GIF below I demonstrate the MIDI messages being sent to the browser from the connected device which then controls the oscillator frequency, waveform, gain (volume), and a low pass filter with different MIDI channel inputs and velocities. 

The waveform is then visually represented in real time in the browser using the draw() function from the Webaudio API.

Currently, the GUI does not control anything, the next step was to use the MIDI input to control elements on the page but, alas: time.

To run:
In the CLI from the synth-frontend folder: npm run dev to run - requires a MIDI device to use (currently setup for M-Audio Oxygen25).


![webaudio_demo](https://user-images.githubusercontent.com/75575727/230386415-4e2f3c69-c1c3-43e3-bf06-725614e17259.gif)
