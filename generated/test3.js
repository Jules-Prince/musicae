import MidiWriter from 'midi-writer-js;'
const track1 = new MidiWriter.Track();
track1.setTempo(120);
track1.setTimeSignature(4,4);
track1.addEvent(new MidiWriter.NoteEvent({pitch: ['C4, E4, G4'], duration: '1'}));
track1.addEvent(new MidiWriter.NoteEvent({pitch: ['A4, B4'], duration: '2'}));
track1.addEvent(new MidiWriter.NoteEvent({pitch: ['F4, D4, A4'], duration: '1'}));
track1.addEvent(new MidiWriter.NoteEvent({pitch: ['F4, D4, A4'], duration: '1'}));
const track2 = new MidiWriter.Track();
track2.setTempo(120);
track2.setTimeSignature(3,4);
track2.addEvent(new MidiWriter.NoteEvent({pitch: ['C5, E5, G5'], duration: '1'}));
const writer = new MidiWriter.Writer(track1,track2);

// Build the MIDI file
const builtMidi = writer.buildFile();

// Output the MIDI file
console.log(builtMidi);
