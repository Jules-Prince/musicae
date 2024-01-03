import pygame.midi
from midiutil import MIDIFile
from pynput import keyboard
import time

# Initialize pygame.midi
pygame.midi.init()
midi_output = pygame.midi.Output(0)  # Open the first MIDI port

# MIDI file setup
tempo = 118  # beats per minute
midi_file = MIDIFile(1)  # One track
track = 0
midi_file.addTrackName(track, 0, "Track")
midi_file.addTempo(track, 0, tempo)

# Define a mapping from keyboard keys to MIDI notes
key_to_note = {
    'a': 60,  # C4
    's': 62,  # D4
    'd': 64,  # E4
    # Add more mappings as needed
}

# Track which keys are currently pressed and their start times
keys_pressed = {}
start_time = time.time()

def on_press(key):
    try:
        if key.char in key_to_note and key.char not in keys_pressed:
            note = key_to_note[key.char]
            print(f"Playing note: {note}")
            midi_output.note_on(note, 100)  # Note on with velocity 100
            keys_pressed[key.char] = time.time()  # Record the start time of the note
    except AttributeError:
        pass

def on_release(key):
    try:
        if key.char in key_to_note and key.char in keys_pressed:
            note = key_to_note[key.char]
            midi_output.note_off(note, 100)  # Note off with velocity 100
            start_note_time = keys_pressed.pop(key.char)
            note_duration_sec = time.time() - start_note_time  # Duration in seconds
            # Convert duration from seconds to beats
            beats_per_second = tempo / 60.0
            note_duration_beats = note_duration_sec * beats_per_second
            midi_file.addNote(track, 0, note, start_note_time - start_time, note_duration_beats, 100)
    except AttributeError:
        pass
    if key == keyboard.Key.esc:
        # Save the MIDI file and exit program when Esc key is pressed
        with open("output.mid", "wb") as output_file:
            midi_file.writeFile(output_file)
        midi_output.close()
        pygame.midi.quit()
        return False

# Collect keyboard events
listener = keyboard.Listener(
    on_press=on_press,
    on_release=on_release
)
listener.start()
listener.join()
