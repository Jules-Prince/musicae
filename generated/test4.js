import MidiWriter from 'midi-writer-js';
import { writeFileSync } from 'fs';
const track1 = new MidiWriter.Track();
track1.addEvent(new MidiWriter.ProgramChangeEvent({ channel: 9 }));
track1.setTempo(120);
track1.setTimeSignature(4,4);
track1.addEvent(new MidiWriter.NoteEvent({pitch: ['C4, E4, G4'], duration: '1'}));
track1.addEvent(new MidiWriter.NoteEvent({pitch: ['A4, B4'], duration: '2'}));
track1.addEvent(new MidiWriter.NoteEvent({pitch: ['F4, D4, A4'], duration: '1'}));
track1.addEvent(new MidiWriter.NoteEvent({pitch: ['F4, D4, A4'], duration: '1'}));
const track2 = new MidiWriter.Track();
track2.addEvent(new MidiWriter.ProgramChangeEvent({ channel: 0 }));
track2.setTempo(120);
track2.setTimeSignature(3,4);
track2.addEvent(new MidiWriter.NoteEvent({pitch: ['C5, E5, G5'], duration: '1'}));
const writer = new MidiWriter.Writer([track1,track2]);

// Build the MIDI file
const builtMidi = writer.buildFile();

// Output the MIDI file
console.log(builtMidi);
const filePath = 'output/output_MySong.mid';
const midiData = new Uint8Array(builtMidi);
writeFileSync(filePath, Buffer.from(midiData));
console.log(`Le fichier MIDI a été généré avec succès à l'emplacement : ${filePath}`);
console.log(builtMidi);
