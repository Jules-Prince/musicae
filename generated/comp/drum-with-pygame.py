import pygame.midi
import time

# Initialize Pygame and the MIDI module
pygame.init()
pygame.midi.init()

# Open the default MIDI output port
port = pygame.midi.get_default_output_id()
midi_out = pygame.midi.Output(port)

# Set up the MIDI parameters
tempo = 118  # Beats per minute
beat_duration = 60 / tempo  # Duration of a beat in seconds

# Drum notes in General MIDI standard
notes = [36, 38, 42, 46, 49, 51]  # Corresponding to your midiutil notes

# Play the notes
for note in notes:
    midi_out.note_on(note, velocity=100, channel=9)
    time.sleep(beat_duration)  # Wait for the duration of the beat
    midi_out.note_off(note, velocity=100, channel=9)
    time.sleep(0.05)  # Short pause between notes

# Close the MIDI stream and quit
midi_out.close()
pygame.midi.quit()
