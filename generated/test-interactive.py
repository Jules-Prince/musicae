from midiutil import MIDIFile
from pynput import keyboard

midi_file = MIDIFile(1)
track = 0
time = 0
midi_file.addTrackName(track, time, "Track")
midi_file.addTempo(track, time, 120)

# Define a mapping from keyboard keys to MIDI notes
key_to_note = {
    'a': 60,  # C4
    's': 62,  # D4
    'd': 64,  # E4
}

def on_press(key):
    try:
        if key.char in key_to_note:
            note = key_to_note[key.char]
            print(f"Playing note: {note}")
            midi_file.addNote(track, 0, note, time, 1, 100)
    except AttributeError:
        pass

def on_release(key):
    if key == keyboard.Key.esc:
        # Save the MIDI file when Esc key is pressed
        with open("output.mid", "wb") as output_file:
            midi_file.writeFile(output_file)
        return False

# Collect keyboard events
listener = keyboard.Listener(
    on_press=on_press,
    on_release=on_release
)
listener.start()
listener.join()
