from midiutil import MIDIFile
midi = MIDIFile(1)
midi.addTempo(0, 0, 118)
time_signature = ( 4 ,  4 )
midi.addTimeSignature(0, 0, *time_signature, 24)
midi.addProgramChange(0, 0, 0, 9)
midi.addNote(0, 9, 36,0.25 ,1, 95)
midi.addNote(0, 9, 38,0.5 ,1, 90)
midi.addNote(0, 9, 42,0.75 ,1, 90)
with open("output.mid", "wb") as output_file:
    midi.writeFile(output_file)
