from midiutil import MIDIFile
midi = MIDIFile(1)
midi.addTempo(0, 0, 110)
time_signature = ( 4 ,  4 )
midi.addTimeSignature(0, 0, *time_signature, 24)
midi.addProgramChange(0, 0, 0, 9)
midi.addNote(0, 9, 38,1.5 ,1, 90)
midi.addProgramChange(0, 0, 0, 9)
midi.addNote(0, 9, 46,2.0 ,1, 100)
midi.addNote(0, 9, 46,2.5 ,1, 100)
midi.addNote(0, 9, 46,3.0 ,1, 100)
midi.addNote(0, 9, 46,3.5 ,1, 100)
midi.addNote(0, 9, 46,4.0 ,1, 100)
midi.addNote(0, 9, 46,4.5 ,1, 100)
midi.addNote(0, 9, 46,5.0 ,1, 100)
midi.addNote(0, 9, 46,5.5 ,1, 100)
with open("./output/loveisAll.mid", "wb") as output_file:
   midi.writeFile(output_file)
