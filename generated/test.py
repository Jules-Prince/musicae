from midiutil import MIDIFile

# Create MIDI file
midi = MIDIFile(1)
midi.addTempo(0, 0, 110)
time_signature = (4, 4)
midi.addTimeSignature(0, 0, *time_signature, 24)
midi.addProgramChange(0, 0, 0, 9)

# Adding an eighth note (duration of 1/8)
eighth_duration = 0.5
midi.addNote(0, 9, 38, 3.0, 0.5, 90)

# Writing to a MIDI file
with open("./output/loveisAll.mid", "wb") as output_file:
    midi.writeFile(output_file)
