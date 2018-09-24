var synth = new Tone.PluckSynth().toMaster()
var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();

//this function is called right before the scheduled time
function triggerSynth(time){
	//the time is the sample-accurate time of the event
	polySynth.triggerAttackRelease(['C4', 'E4', 'G4', 'B4'], '4n', time)
}

function triggerSynth3(time){
	//the time is the sample-accurate time of the event
	polySynth.triggerAttackRelease(['D4', 'F4', 'A4', 'C5'], '4n', time)
}

function triggerSynth2(time){
	//the time is the sample-accurate time of the event
	synth.triggerAttackRelease('C1', '4n', time)
}

//schedule a few notes
Tone.Transport.schedule(triggerSynth, '0:1')
Tone.Transport.schedule(triggerSynth3, '0:3')
Tone.Transport.schedule(triggerSynth, '1:1')
Tone.Transport.schedule(triggerSynth3, '1:3')
Tone.Transport.schedule(triggerSynth, '2:1')
Tone.Transport.schedule(triggerSynth3, '2:3')
Tone.Transport.schedule(triggerSynth, '3:1')
Tone.Transport.schedule(triggerSynth3, '3:3')

Tone.Transport.schedule(triggerSynth2, '0:1')
Tone.Transport.schedule(triggerSynth2, '0:3')
Tone.Transport.schedule(triggerSynth2, '1:1')
Tone.Transport.schedule(triggerSynth2, '1:3')
Tone.Transport.schedule(triggerSynth2, '2:1')
Tone.Transport.schedule(triggerSynth2, '2:3')

Tone.Transport.schedule(triggerSynth2, '3:0:2')
Tone.Transport.schedule(triggerSynth2, '3:1:2')
Tone.Transport.schedule(triggerSynth2, '3:2:2')
Tone.Transport.schedule(triggerSynth2, '3:3:2')

//set the transport to repeat
Tone.Transport.loopEnd = '4m'
Tone.Transport.loop = true

//start/stop the transport
document.querySelector('.playToggle').addEventListener('change', function(e){
	if (e.target.checked){
		Tone.Transport.start('+0.1')
	} else {
		Tone.Transport.stop()
	}
})

var diameter; 
var angle = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
  	diameter = height - 10;
  	noStroke();
  	fill(255, 204, 0);
}

function draw() {
	var input = Tone.Transport.position;
	var values = input.split(':');
	var beatValue = values[2];
	var beatNumber = values[1];
	var timeInput = Tone.now();

	background(255);

	var d1 = 10 + (sin(angle) * diameter/2) + diameter/2;
  	var d2 = 10 + (sin(angle + PI/2) * diameter/2) + diameter/2;
  	var d3 = 10 + (sin(angle + PI) * diameter/2) + diameter/2;

  	ellipse(0, height/2, (d1*beatValue), (d1*beatValue));
  	ellipse(width, height/2, (d3*beatValue), (d3*beatValue));

  	// noStroke();
  	// fill(255, 204, 0);

	console.log("Beat: "+beatValue);
}