from midiutil import MIDIFile
<<<<<<< Updated upstream
midi = MIDIFile(1)
midi.addTempo(0, 0, 118)
time_signature = ( 4 ,  4 )
midi.addTimeSignature(0, 0, *time_signature, 24)
midi.addProgramChange(0, 0, 0, 9)
midi.addNote(0, 9, 42,0.0 ,1, 90)
midi.addNote(0, 9, 42,0.5 ,1, 90)
midi.addNote(0, 9, 36,0.0 ,1, 95)
midi.addNote(0, 9, 38,1.0 ,1, 90)
midi.addNote(0, 9, 42,1.0 ,1, 90)
midi.addNote(0, 9, 42,1.5 ,1, 90)
midi.addNote(0, 9, 36,2.0 ,1, 95)
midi.addNote(0, 9, 42,2.0 ,1, 95)
midi.addNote(0, 9, 42,2.5 ,1, 95)
midi.addNote(0, 9, 38,3.0 ,1, 90)
midi.addNote(0, 9, 42,3.0 ,1, 95)
with open("./output/billiejean.mid", "wb") as output_file:
   midi.writeFile(output_file)
=======

# Constants for the MIDI notes of the drum elements
BASS_DRUM = 36
SNARE_DRUM = 38
HI_HAT_CLOSED = 42

# Create a MIDIFile object with one track
midi_file = MIDIFile(1)
# Set the tempo (beats per minute)
tempo = 118
track = 0
time = 0
midi_file.addTempo(track, time, tempo)

# Function to add a drum note
def add_drum_hit(note, measure, beat, subdivision=0):
    # Calculate the time for the note (4 beats per measure)
    note_time = measure * 4 + beat + subdivision * 0.5
    midi_file.addNote(track, 9, note, note_time, duration=0.5, volume=100)

# Add the drum pattern to the MIDI file
# Assuming the pattern is 4/4 and repeats for 5 measures
for measure in range(5):

    add_drum_hit(BASS_DRUM, measure, 0)
    add_drum_hit(HI_HAT_CLOSED, measure, 0)

    add_drum_hit(HI_HAT_CLOSED, measure, 0.5)

    add_drum_hit(SNARE_DRUM, measure, 1)
    add_drum_hit(HI_HAT_CLOSED, measure, 1)

    add_drum_hit(HI_HAT_CLOSED, measure, 1.5)

    add_drum_hit(BASS_DRUM, measure, 2)
    add_drum_hit(HI_HAT_CLOSED, measure, 2)

    add_drum_hit(HI_HAT_CLOSED, measure, 2.5)

    add_drum_hit(SNARE_DRUM, measure, 3)
    add_drum_hit(HI_HAT_CLOSED, measure, 3)


# Write the MIDI file to disk
with open("drum_pattern.mid", "wb") as output_file:
    midi_file.writeFile(output_file)

>>>>>>> Stashed changes
