import MidiWriter from 'midi-writer-js;'
const track1 = new MidiWriter.Track();
track1.setInstrument(PIANO);
track1.setTempo(120);
track1.setTimeSignature(4,4);
const track2 = new MidiWriter.Track();
track2.setInstrument(GUITAR);
track2.setTempo(120);
track2.setTimeSignature(4,4);
