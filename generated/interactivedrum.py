from midiutil import MIDIFile
import pygame.midi
from pynput import keyboard
import time


print('click esc to stop')
# Initialize pygame.midi
pygame.midi.init()
midi_output = pygame.midi.Output(0)  # Open the first MIDI port
instrument = 9
midi_output.set_instrument(instrument)
key_to_note = {
    'a': 36,
    'z': 38,
    'e': 42,
    'r': 46,
    't': 49,
    'y': 51,
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
