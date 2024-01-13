from midiutil import MIDIFile
import pygame.midi
from pynput import keyboard
import time


print('click esc to stop')
# Initialize pygame.midi
pygame.midi.init()
midi_output = pygame.midi.Output(0)  # Open the first MIDI port
instrument = 0
instrument_name = 'PIANO'
midi_output.set_instrument(instrument)
key_to_note = {
    'a': 60,
    'z': 62,
    'e': 64,
    'r': 65,
    't': 67,
    'y': 69,
    'u': 71,
    'i': 72,
}
key_to_note_name = {
    'a': 'C4',
    'z': 'D4',
    'e': 'E4',
    'r': 'F4',
    't': 'G4',
    'y': 'A4',
    'u': 'B4',
    'i': 'C5',
}
# Track which keys are currently pressed and their start times
keys_pressed = {}
start_time = time.time()
start_time=time.time()
output_file = ''
def on_press(key):
    try:
        if key.char in key_to_note and key.char not in keys_pressed:
            note = key_to_note[key.char]
            start_time = time.time()  # Record the start time of the note
            channel = instrument if instrument < 16 else 0
            midi_output.note_on(note, 100, channel=channel)  # Note on with velocity 100
            keys_pressed[key.char] = start_time  # Record the start time of the note
    except AttributeError:
        pass


def on_release(key):
    try:
        if key.char in key_to_note and key.char in keys_pressed:
            note = key_to_note[key.char]
            note_name = key_to_note_name[key.char]
            end_time = time.time()
            duration = end_time - keys_pressed[key.char]
            print(f"Releasing note: {note}, Duration: {duration:.2f} seconds")
            
            output_file.write(f"\t\t\t'{note_name}', {keys_pressed[key.char] - start_time:.2f}, {duration:.2f}, 100\n")
            
            midi_output.note_off(note, 100)  # Note off with velocity 100
            del keys_pressed[key.char]
    except AttributeError:
        pass
    if key == keyboard.Key.esc:
        # Save the MIDI file and exit program when Esc key is pressed
        print("Exiting...")
        pygame.midi.quit()
        return False
        
# Collect keyboard events
listener = keyboard.Listener(
    on_press=on_press,
    on_release=on_release
)
with open("./output/interactive.music", "w") as o:
   o.write("music interactive {\n\ttempo 120\n\ttime_signature{4,4}\n\ttrack 1 {\n\t\tinstrument '" + instrument_name + "'\n\t\ttrackPart all {\n\t\t\tstart 0.0\n\t\t\trepeat 1\n" )

output_file = open("./output/interactive.music", "a+")
listener.start()
listener.join()
output_file.write('\n\t\t}\n\t} \n}')
print("write the scenario in output/interactive.music")
