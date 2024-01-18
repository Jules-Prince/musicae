import pygame.midi
import time

# Initialize pygame and its midi module
pygame.init()
pygame.midi.init()

# Open a MIDI output
port = pygame.midi.get_default_output_id()
midi_out = pygame.midi.Output(port, 0)


# Function to play a MIDI note
def play_midi_note(channel, note, velocity, duration):
    midi_out.note_on(note, velocity, channel)
    time.sleep(duration / 2)
    midi_out.note_off(note, velocity, channel)


# Define the notes and their properties
notes = [
    (0, 60, 100, 1),  # Do (C4)
    (0, 62, 100, 1),  # Re (D4)
    (0, 64, 100, 1),  # Mi (E4)
    (0, 65, 100, 1),  # Fa (F4)
    (0, 67, 100, 1),  # Sol (G4)
    (0, 69, 100, 1),  # La (A4)
    (0, 71, 100, 1),  # Si (B4)
    (0, 72, 100, 1),  # Do (C5)
]

# Play each note
for note in notes:
    play_midi_note(*note)

# Close the MIDI stream and quit
midi_out.close()
pygame.midi.quit()
