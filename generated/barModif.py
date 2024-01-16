from midiutil import MIDIFile
midi = MIDIFile(1)
midi.addTempo(0, 0, 110)
time_signature = ( 4 ,  4 )
midi.addTimeSignature(0, 0, *time_signature, 24)
midi.addProgramChange(0, 0, 0, 9)
midi.addNote(0, 9, 38,1 ,4.0, 90)
midi.addNote(0, 9, 38,2 , 1.0, 90)
midi.addNote(0, 9, 36,3 ,4.0, 90)
midi.addNote(0, 9, 49,4 , 1.0, 90)
with open("./output/barModif.mid", "wb") as output_file:
   midi.writeFile(output_file)
