from midiutil import MIDIFile

# Create a new MIDIFile object with one track
midi_file = MIDIFile(1)

# Track, time, and channel settings
track = 0
time = 0
channel = 9

# Add track name and tempo
midi_file.addTrackName(track, time, "0")
midi_file.addTempo(track, time, 118)

notes = [36, 38, 42, 46, 49, 51]

# Duration and volume of each note
duration = 1
volume = 100

# Add notes to the MIDI file
for note in notes:
    midi_file.addNote(track, channel, note, time, duration, volume)
    time += 1

# Write the MIDI file to disk
with open("drum-with-midiutil.mid", "wb") as output_file:
    midi_file.writeFile(output_file)
