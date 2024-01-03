import pygame.midi
from pynput import keyboard
import time

# Initialize pygame.midi
pygame.midi.init()
midi_output = pygame.midi.Output(0)  # Open the first MIDI port
instrument = 16
midi_output.set_instrument(instrument)

# MIDI file setup
tempo = 118  # beats per minute
track = 0

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
            keys_pressed.pop(key.char)
    except AttributeError:
        pass
    if key == keyboard.Key.esc:
        # Save the MIDI file and exit program when Esc key is pressed
        pygame.midi.quit()
        return False


# Collect keyboard events
listener = keyboard.Listener(
    on_press=on_press,
    on_release=on_release
)
listener.start()
listener.join()
