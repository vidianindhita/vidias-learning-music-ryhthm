// Sequencer
var nSteps = 8;
var nTracks = 4;
var cells = [];
var playButton;
var beats = 0;
var currentStep = 0;

// Sound
var kit;
var drumNames = ["bass", "drum", "clap", "ring"];
kit = new Tone.Players(
    { 
      "bass" : "assets/sounds/bass.wav",
      "drum" : "assets/sounds/drum.wav",
      "clap" : "assets/sounds/clap.wav",
      "ring" : "assets/sounds/ring.wav"
    }
);
kit.toMaster();
Tone.Transport.scheduleRepeat(onBeat, 0.5);

// Visuals
var cellWidth, cellHeight;

// Melody
let octave = 4;

const keys = [];
let prevKey = 0;

const Instruments = {
  keyboard: {
    // Lower octave.
    'a': 'Cl',
    'w': 'C#l',
    's': 'Dl',
    'e': 'D#l',
    'd': 'El',
    'f': 'Fl',
    't': 'F#l',
    'g': 'Gl',
    'y': 'G#l',
    'h': 'Al',
    'u': 'A#l',
    'j': 'Bl',
    // Upper octave.
    'k': 'Cu',
    'o': 'C#u',
    'l': 'Du',
    'p': 'D#u',
    ';': 'Eu',
    "'": 'Fu',
    ']': 'F#u',
    '\\': 'Gu',
  },
};

let instrument = Instruments.keyboard;

const keyToNote = key => {
  const note = instrument[ key ];
  if ( !note ) {
    return;
  }

  return Tone.Frequency(
    note
      .replace( 'l', octave )
      .replace( 'u', octave + 1 )
  ).toNote();
};

const onKeyDown = (() => {
  let listener;

  return synth => {
    document.removeEventListener( 'keydown', listener );

    listener = event => {
      const { key } = event;

      // Only trigger once per keydown event.
      if ( !keys[ key ] ) {
        keys[ key ] = true;

        const note = keyToNote( key );
        if ( note ) {
          synth.triggerAttack( note );
          prevKey = key;
        }
      }
    };

    document.addEventListener( 'keydown', listener );
  };
})();

const onKeyUp = (() => {
  let listener;
  let prev;

  return synth => {
    // Clean-up.
    if ( prev ) {
      prev.triggerRelease();
    }

    document.removeEventListener( 'keyup', listener );

    prev = synth;
    listener = event => {
      const { key } = event;
      if ( keys[ key ] ) {
        keys[ key ] = false;

        const note = keyToNote( key );
        if ( synth instanceof Tone.PolySynth ) {
          synth.triggerRelease( note );
        } else if ( note && key === prevKey ) {
          // Trigger release if this is the previous note played.
          synth.triggerRelease();
        }
      }
    };

    document.addEventListener( 'keyup', listener );
  };
})();

function setup() {
  // Initialize all sequencer cells. ON: 1. OFF: -1.
  for(var track = 0; track < nTracks; track++){
    cells[track] = [];
    for(var step = 0; step < nSteps; step++){
        cells[track][step] = -1;
    }
  }
  
  playButton = createButton('Play');
  // playButton.position(630, 445);
  playButton.mouseClicked(togglePlay);
	
  createCanvas(600, 300);
  cellWidth = width / nSteps;
  cellHeight = height / nTracks;
  
}

function onBeat(time){
  for(var track = 0; track < nTracks; track++){
    if(cells[track][currentStep] == 1){
      var drum = kit.get(drumNames[track]);
      drum.start(time);
    }
  }
  beats++;
  currentStep = beats % nSteps;
}

function draw(){
  background(255);
  stroke(0);
  
  // Draw cells that are on
  for(var step = 0; step < nSteps; step++){
    for(var track = 0; track < nTracks; track++){
      if(cells[track][step] == 1){
        fill(150 - track*30);
        rect(step*cellWidth, track*cellHeight, cellWidth, cellHeight);
      }
    }
  }
  
  // Draw horizontal lines
  for(var i = 1; i <= nTracks; i++){
    var y = i*cellHeight;
    line(0, y, width, y);
  }
  
  // Draw vertical lines
  for(var i = 1; i <= nSteps; i++){
    stroke(0);
    line(i*cellWidth, 0, i*cellWidth, height);
  }
  
  // Highlight current step
  var highlight = (beats - 1 )% nSteps;
	fill(200, 60);
	noStroke();
	rect(highlight*cellWidth, 0, cellWidth, height)
	
}

function mousePressed(){
  // If the mouse is within the bounds of the canvas
  if(	0 < mouseX && mouseX < width &&
    	0 < mouseY && mouseY < height){
    
    // Determine which cell the mouse is on
    var i = floor(mouseX / cellWidth);
    var j = floor(mouseY / cellHeight);
    
    // Toggle cell on/off
    cells[j][i] = -cells[j][i];
  }
  
}

function togglePlay(){
  if(Tone.Transport.state == "started"){
  	Tone.Transport.stop();
    playButton.html('Play');
  }
  else{
  	Tone.Transport.start();
    playButton.html('Stop');
  }
	
}

// Octave controls.
document.addEventListener( 'keydown', event => {
  // Decrease octave range (min: 0).
  if ( event.key === 'z' ) { octave = Math.max( octave - 1, 0 ); }
  // Increase octave range (max: 10).
  if ( event.key === 'x' ) { octave = Math.min( octave + 1, 9 ); }
});

// Init.
(() => {
  const synth = new Tone.PolySynth( 10 );
  synth.toMaster();

  onKeyDown( synth );
  onKeyUp( synth );
})();