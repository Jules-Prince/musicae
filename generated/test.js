import MidiWriter from 'midi-writer-js;'
const track1 = new MidiWriter.Track();
track1.setTempo(120);
track1.setTimeSignature(4,4);
const track1_note1 = new MidiWriter.NoteEvent({pitch: ['C4'], duration: '4'});
track1.addEvent(track1_note1);
const track1_note2 = new MidiWriter.NoteEvent({pitch: ['E4','G2'], duration: '2'});
track1.addEvent(track1_note2);
const track2 = new MidiWriter.Track();
track2.setTempo(120);
track2.setTimeSignature(4,4);
const track2_note1 = new MidiWriter.NoteEvent({pitch: ['A2'], duration: '2'});
track2.addEvent(track2_note1);
