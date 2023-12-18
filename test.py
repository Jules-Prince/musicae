from midiutil import MIDIFile


# Créez un objet MIDIFile
midi = MIDIFile(1)  # 1 piste

# Ajoutez une piste au fichier MIDI
midi.addTempo(0, 0, 120)  # Piste 0, temps 0, tempo 120 BPM

# Spécifiez la signature rythmique
time_signature = (4, 4)  # 4 temps par mesure, chaque temps est un quart de note
# Ajoutez une piste au fichier MIDI avec la signature rythmique
midi.addTimeSignature(0, 0, *time_signature, 24)  # Piste 0, temps 0, signature rythmique



# Ajoutez deux notes en parallèle
track = 0
channel = 0
pitch1 = 60  # Note MIDI (60 est le do central)
pitch2 = 64  # Note MIDI (64 est le mi)
duration1 = 16.0  # Durée de la première note en secondes     / beat_type
duration2 = 0.125  # Durée de la deuxième note en secondes
volume = 100  # Volume (0-127)

# Ajoutez la première note
midi.addNote(track, channel, pitch1, 0, duration1, volume)

# Ajoutez la deuxième note (qui commence en même temps que la première)
midi.addNote(track, channel, pitch2, 0, duration2, volume)


# Ajoutez la deuxième note (qui commence en même temps que la première)
midi.addNote(track, channel, pitch2, 0.25, duration2, volume)

# Ajoutez la deuxième note (qui commence en même temps que la première)
midi.addNote(track, channel, pitch2, 0.5, duration2, volume)

# Ajoutez la deuxième note (qui commence en même temps que la première)
midi.addNote(track, channel, pitch2, 0.75, duration2, volume)

# Enregistrez le fichier MIDI
with open("output.mid", "wb") as midi_file:
    midi.writeFile(midi_file)
