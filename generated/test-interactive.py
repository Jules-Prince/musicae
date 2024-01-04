from pynput import keyboard
from midiutil import MIDIFile
import mido
from mido import MidiFile as MidoFile
import os

base_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "tmp")


def create_midi_file(note_number, filename, duration=5):
    midi_file = MIDIFile(1)  # One track
    track = 0
    time = 0
    channel = 0
    volume = 100

    midi_file.addTrackName(track, time, "Track")
    midi_file.addTempo(track, time, 120)
    midi_file.addNote(track, channel, note_number, time, duration, volume)

    with open(filename, "wb") as file:
        midi_file.writeFile(file)


# Check if tmp directory exists, if not, create it
if not os.path.exists(base_dir):
    os.makedirs(base_dir)

# Define the mapping from keys to MIDI notes
key_to_note = {
    'c': 60,  # C4
    'd': 62,  # D4
    'e': 64,  # E4
    'f': 65,  # F4
    'g': 67,  # G4
    'a': 69,  # A4
    'b': 71,  # B4
}

# Create a MIDI file for each note
for key, note in key_to_note.items():
    filename = os.path.join(base_dir, f"{key}.mid")
    create_midi_file(note, filename)

# Load the audio files
sounds = {}
for note in key_to_note.keys():
    file_path = os.path.join(base_dir, f"{note}.mid")
    if os.path.exists(file_path):
        sounds[note] = MidoFile(file_path)
    else:
        print(f"File not found: {file_path}")

output = mido.open_output()


# Function to handle key presses
def on_press(key):
    try:
        if key.char in sounds:
            for msg in sounds[key.char].play():
                output.send(msg)
    except AttributeError:
        pass


# Function to handle key releases
def on_release(key):
    try:
        if key.char in sounds:
            sounds[key.char].stop()
    except AttributeError:
        pass
    if key == keyboard.Key.esc:
        # Stop listener
        return False


# Start listening to the keyboard
listener = keyboard.Listener(on_press=on_press, on_release=on_release)
listener.start()
listener.join()
