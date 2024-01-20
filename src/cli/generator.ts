
import {type Music,type Note,type Track, type TrackSet, type TimeSignature, isNoteWithError,Setup, Key, TrackPart, NoteReplacement, isNoteDuration, Float, NoteDuration, isReuseTrackPart, isNormalTrackPart} from '../language/generated/ast.js';
import * as fs from 'node:fs';
import { CompositeGeneratorNode, toString } from 'langium';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';
//import { time } from 'node:console';

const noteMap: { [key: string]: number } = {
    'C0': 12, 'C#0': 13, 'D0': 14, 'D#0': 15, 'E0': 16, 'F0': 17, 'F#0': 18, 'G0': 19, 'G#0': 20, 'A0': 21, 'A#0': 22, 'B0': 23,
    'C1': 24, 'C#1': 25, 'D1': 26, 'D#1': 27, 'E1': 28, 'F1': 29, 'F#1': 30, 'G1': 31, 'G#1': 32, 'A1': 33, 'A#1': 34, 'B1': 35,
    'C2': 36, 'C#2': 37, 'D2': 38, 'D#2': 39, 'E2': 40, 'F2': 41, 'F#2': 42, 'G2': 43, 'G#2': 44, 'A2': 45, 'A#2': 46, 'B2': 47,
    'C3': 48, 'C#3': 49, 'D3': 50, 'D#3': 51, 'E3': 52, 'F3': 53, 'F#3': 54, 'G3': 55, 'G#3': 56, 'A3': 57, 'A#3': 58, 'B3': 59,
    'C4': 60, 'C#4': 61, 'D4': 62, 'D#4': 63, 'E4': 64, 'F4': 65, 'F#4': 66, 'G4': 67, 'G#4': 68, 'A4': 69, 'A#4': 70, 'B4': 71,
    'C5': 72, 'C#5': 73, 'D5': 74, 'D#5': 75, 'E5': 76, 'F5': 77, 'F#5': 78, 'G5': 79, 'G#5': 80, 'A5': 81, 'A#5': 82, 'B5': 83,
    'C6': 84, 'C#6': 85, 'D6': 86, 'D#6': 87, 'E6': 88, 'F6': 89, 'F#6': 90, 'G6': 91, 'G#6': 92, 'A6': 93, 'A#6': 94, 'B6': 95,
    'C7': 96, 'C#7': 97, 'D7': 98, 'D#7': 99, 'E7': 100, 'F7': 101, 'F#7': 102, 'G7': 103, 'G#7': 104, 'A7': 105, 'A#7': 106, 'B7': 107,
    'C8': 108, 'C#8': 109, 'D8': 110, 'D#8': 111, 'E8': 112, 'F8': 113, 'F#8': 114, 'G8': 115, 'G#8': 116, 'A8': 117, 'A#8': 118, 'B8': 119,
    'C9': 120, 'C#9': 121, 'D9': 122, 'D#9': 123, 'E9': 124, 'F9': 125, 'F#9': 126, 'G9': 127
};

const drumMap: { [key: string]: number } = {
    'bd': 36,  // Kick Drum ou Bass Drum
    'sd': 38,  // Snare Drum
    'ch': 42,  // Closed Hi-hat
    'oh': 46,  // Opened Hi-hat
    'cc': 49,  // Crash Cymbal
    'rc': 51,   // Ride Cymbal
    'ht': 50,  // High Tom
    'chc': 55,
    'lmt': 47   // Choked Crash
};

const instrumentsMap: { [key: string]: number } = {
    'ACOUSTIC_GRAND_PIANO': 0,
    'BRIGHT_ACOUSTIC_PIANO': 1,
    'ELECTRIC_GRAND_PIANO': 2,
    'HONKY_TONK_PIANO': 3,
    'ELECTRIC_PIANO_1': 4,
    'ELECTRIC_PIANO_2': 5,
    'VIOLIN': 40,
    'VIOLA': 41,
    'CELLO': 42,
    'CONTRABASS': 43,
    'TREMOLO_STRINGS': 44,
    'GUITAR': 25, // Acoustic Guitar (steel)
    'ELECTRIC_GUITAR_CLEAN': 27,
    'ELECTRIC_GUITAR_MUTED': 28,
    'TRUMPET': 56,
    'TROMBONE': 57,
    'TUBA': 58,
    'MUTED_TRUMPET': 59,
    'SOPRANO_SAX': 64,
    'ALTO_SAX': 65,
    'TENOR_SAX': 66,
    'BARITONE_SAX': 67,
    'OBOE': 68,
    'ENGLISH_HORN': 69,
    'BASS': 32,
    'BASSOON': 70,
    'CLARINET': 71,
    'PICCOLO': 72,
    'FLUTE': 73,
    'RECORDER': 74,
    'PAN_FLUTE': 75,
    'BLOWN_BOTTLE': 76,
    'SKAKUHACHI': 77,
    'WHISTLE': 78,
    'OCARINA': 79,
    'SYNTH_LEAD_1_SQUARE': 80,
    'SYNTH_LEAD_2_SAWTOOTH': 81,
    'DRUM': 9,
    'PIANO': 0
}

const classicDurations :{ [key: string]: number } = {
    "whole": 4.0,          // Note blanche (semibreve)
    "half": 2.0,           // Note noire (minim)
    "quarter": 1.0,        // Croche
    "eighth": 0.5,       // Double croche
    "sixteenth": 0.25,   // Triple croche
    "thirtysecond": 0.125        // Quadruple croche
  };





export function generateMusicFile(music: Music, filePath: string, destination: string | undefined, isPlayable: boolean | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.py`;

    const fileNode = new CompositeGeneratorNode();

    compile(music, fileNode, isPlayable)


    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}


function compile(music: Music, fileNode: CompositeGeneratorNode, isPlayable: boolean | undefined): void {
    fileNode.append(
        'from midiutil import MIDIFile\n'
    );
    if (music.setup !== undefined) {
        fileNode.append(
            (!isPlayable ? 'import pygame.midi\n' : 'import pygame\n') +
            'from pynput import keyboard\n' +
            'import time\n\n'
        );
    }

    if (isPlayable) {
        fileNode.append(
            'import pygame\n' +
            'import time\n\n'
        );
        generatePlayMidiFunction(fileNode);
    }


    if (music.tempo === undefined) { // set default tempo to 120
        music.tempo = 120;
    }

    let number_of_tracks=0
    for (const trackSet of music.trackSet) {
        number_of_tracks+=trackSet.track.length
    }
    console.log(number_of_tracks)
    fileNode.append(
        `midi = MIDIFile(${number_of_tracks})\n`
    );

    for (const track_set of music.trackSet) {
        const index = music.trackSet.indexOf(track_set);
        compileTrackSet(track_set, index, music.tempo, track_set.time_signature, fileNode);
    }
    if (music.trackSet.length > 0) {
        generateMidiFile(music.name, fileNode);
    }

    if(isPlayable){
        addPlayMidi(music.name, fileNode)
    }

    if (music.setup !== undefined) {
        compileSetup(music.setup, fileNode);
    }

    // TODO : Est ce encore utile ?
    //generateMidiFile(music.tracks, fileNode, music.name);
}

function compileTrackSet(track_set: TrackSet, trackset_index:number, tempo: any, time_signature: TimeSignature, fileNode: CompositeGeneratorNode) {

    let number_of_tracks=0
    for (const track of track_set.track) {
        number_of_tracks+=1
        number_of_tracks+=track.parts.length
    }
    //const number_of_tracks = track_set.track.length;
    

    for (let i = 0; i < track_set.track.length; i++) {

        if(track_set.track[i].tempo){
            tempo = track_set.track[i].tempo
        }
        compileTempo(i+trackset_index, tempo, fileNode);
        compileTimeSignature(i+trackset_index, time_signature, fileNode);
        compileTrack(track_set.track[i], time_signature.numerator, i, trackset_index, fileNode);
        

    }
}

function compileTempo(track_number: number, tempo: number, fileNode: CompositeGeneratorNode) {
    fileNode.append(
        `midi.addTempo(${track_number}, 0, ${tempo})\n`
    );
}

function compileTimeSignature(track_number: number, time_signature: TimeSignature, fileNode: CompositeGeneratorNode) {
    fileNode.append(
        `time_signature = ( ${time_signature.numerator} ,  ${time_signature.denominator} )\n`
    );
    fileNode.append(
        `midi.addTimeSignature(${track_number}, 0, *time_signature, 24)\n`
    );
}




function compileTrack(track: Track, time_sign: number, trackNumber: any, track_number_offset:number,fileNode: CompositeGeneratorNode): void {

    // Set instrument for the track
    const instrumentNumber = getInstrument(track.instrument.name.toUpperCase());
    
    fileNode.append(
        `midi.addProgramChange(${track_number_offset+trackNumber}, 0, 0, ${instrumentNumber})\n`
    );

    //let previous : TrackPart = track.parts[0]

    for (let trackPart  of track.parts) {
        

        const trackPartOld = trackPart

        if ( isReuseTrackPart(trackPart)) {
            let new_id  = trackPart.reuse
            let replacements = trackPart.reuseWithReplacement
            trackPart = track.parts.find(t => t.id === new_id )!
            trackPart.start = trackPartOld.start
            if(replacements){
                compilePreviousRemplacement(trackPart, replacements.notesreplacement ,  fileNode)


            }

        }


        const repeatCount = trackPart.repeat || 1;
        const start = trackPart.start * 4
        //const startFloat = parseFloat(String(start.n1) + "." + String(start.n2))

        // random error 
        const randomError = Math.random() * 0.5;

        

        for (let i = 0; i < repeatCount; i++) {

            if(isNormalTrackPart(trackPart)){

                if (track.instrument.name.toUpperCase() === 'DRUM') {
                    if (track.human_error) {
                        compileNote(trackPart.notes, instrumentNumber, trackNumber, track_number_offset,start + i * time_sign + randomError, drumMap, fileNode);
                    }
                    else {
                        console.log(start)
                        console.log(i)
                        console.log(time_sign)

                        compileNote(trackPart.notes, instrumentNumber, trackNumber, track_number_offset,start + i * time_sign, drumMap, fileNode);
                    }
                }


                else {
                    if (track.human_error) {
                        compileNote(trackPart.notes, instrumentNumber, trackNumber,track_number_offset, start + i * time_sign + randomError, noteMap, fileNode);
                    }
                    else {

                        compileNote(trackPart.notes, instrumentNumber, trackNumber,track_number_offset, start + i * time_sign, noteMap, fileNode);
                    }
                }
            }

        }

        //previous = trackPartOld



    }
}

function compilePreviousRemplacement(trackPart: TrackPart,  notesremplacements : NoteReplacement[], fileNode: CompositeGeneratorNode) {

    let newNotesMap : { [key: number]: string }= {}
    let oldnotesMap : { [key: number]: string }= {}


    if(notesremplacements.length > 0){
        for (let i=0; i < notesremplacements.length; i++){
            newNotesMap[notesremplacements[i].id] = notesremplacements[i].note
        }

        if(isNormalTrackPart(trackPart)){
    
    
            for (let i=0; i < trackPart.notes.length; i++){
                oldnotesMap[i] =trackPart.notes[i].pitch
            }

            for (let i=0; i < trackPart.notes.length; i++){
                if(newNotesMap[i] !== undefined){
                    trackPart.notes[i].pitch = newNotesMap[i]
                }
            }
        }
            

    }
   
    



}


function getInstrument(instrument: String): number {
    const instrumentNumber = instrumentsMap[instrument.toUpperCase()]
    if (instrumentNumber === undefined) {
        throw new Error(`Unknown instrument ${instrument}`);
    }
    return instrumentNumber
}



function compileNote(notes: Note[], instrument_number: number, track_number: any,track_number_offset:number, i: number, notesMap: any, fileNode: CompositeGeneratorNode): void {
    for (const note of notes) {
        const pitchValue = notesMap[note.pitch]; ''
        if (pitchValue === undefined) {
            throw new Error(`Unknown pitch ${note.pitch}`);
        }

        else {

            let time_start = parseFloat(String(note.position.n1) + "." + String(note.position.n2)) + i
            const channel = find_channel_from_instrument(instrument_number)

            if (isNoteWithError(note)) {
                compileNoteWithError(track_number+track_number_offset, channel, pitchValue, time_start, note.duration,note.volume, fileNode);
            }

            else {



                compileNormalNote(track_number+track_number_offset, channel, pitchValue, time_start, note.duration,note.volume, fileNode);

            }

        }

    }
}



function compileStringNoteDuration(duration: string): number {
    return classicDurations[duration]

}

function compileNoteWithError(track_number: number, channel: number, pitch: any, start_time: number, duration: any, volume:number, fileNode: CompositeGeneratorNode): void {
    const randomNumber = Math.random() * 0.2;
    start_time += randomNumber;
    const volume_with_error = volume + generateRandomVelocityError();

    if(isNoteDuration(duration)){
        const duration_number: number = compileStringNoteDuration(duration.duration!)

        fileNode.append(
            `midi.addNote(${track_number}, ${channel}, ${pitch},${start_time} ,${duration_number}, ${volume_with_error})\n`
        );
    }

    else{
        fileNode.append(
            `midi.addNote(${track_number}, ${channel}, ${pitch},${start_time} , ${duration.n1}.${duration.n2}, ${volume_with_error})\n`
        );

    }
}

function compileNormalNote(track_number: number, channel: number, pitch: any, start_time: number, duration:Float|NoteDuration,  volume:number, fileNode: CompositeGeneratorNode){

    if((isNoteDuration(duration))){

        const duration_number: number = compileStringNoteDuration(duration.duration!)

        fileNode.append(
            `midi.addNote(${track_number}, ${channel}, ${pitch},${start_time} ,${duration_number}, ${volume})\n`
        );
    }

    else{
        fileNode.append(
            `midi.addNote(${track_number}, ${channel}, ${pitch},${start_time} , ${duration.n1}.${duration.n2}, ${volume})\n`
        );

    }

}


function find_channel_from_instrument(instrument_number: number): number {
    if (instrument_number < 16) {
        return instrument_number
    }
    else {
        return 0
    }
}

function generateRandomVelocityError() {

    const volumeError = Math.floor(Math.random() * 11) - 5; // Nombres entre -5 et 5 inclus
    return volumeError;

}

function generateMidiFile(name: String, fileNode: CompositeGeneratorNode) {
    fileNode.append(
        `with open("./output/${name}.mid", "wb") as output_file:\n`
    );
    fileNode.append(
        `   midi.writeFile(output_file)\n`
    );
}

function generatePlayMidiFunction(fileNode: CompositeGeneratorNode) {
    fileNode.append(
        'def play_midi(midi_file_path):\n\t' +
        'pygame.init()\n\t' +
        'pygame.mixer.music.load(midi_file_path)\n\t' +
        'pygame.mixer.music.play()\n\n\t' +
        'while pygame.mixer.music.get_busy():\n\t\t' +
        'time.sleep(1)\n\n'
    )
}

function addPlayMidi(name: String, fileNode: CompositeGeneratorNode) {
    fileNode.append(
        `play_midi("./output/${name}.mid")\n`
    )
}


function compileSetup(setup: Setup, fileNode: CompositeGeneratorNode) {
    const instrumentNumber = getInstrument(setup.instrument.name.toUpperCase());

    fileNode.append(
        "\n\nprint('click esc to stop')\n" +
        "# Initialize pygame.midi\n" +
        "pygame.midi.init()\n" +
        "midi_output = pygame.midi.Output(0)  # Open the first MIDI port\n" +
        `instrument = ${instrumentNumber}\n` +
        `instrument_name = '${setup.instrument.name.toUpperCase()}'\n` +
        "midi_output.set_instrument(instrument)\n"
    );

    compileKeys(setup.keys, fileNode);

    fileNode.append(
        "# Track which keys are currently pressed and their start times\n" +
        "keys_pressed = {}\n" +
        "start_time = time.time()"
    );

    compileCommonSetupFunctions(fileNode);
}

function compileKeys(keys: Array<Key>, fileNode: CompositeGeneratorNode) {
    function toUpperCaseKeys(map: { [key: string]: number }): { [key: string]: number } {
        const upperCaseMap: { [key: string]: number } = {};
        for (const key in map) {
            upperCaseMap[key.toUpperCase()] = map[key];
        }
        return upperCaseMap;
    }

    fileNode.append("key_to_note = {\n")
    const allNotes: { [key: string]: number } = { ...toUpperCaseKeys(noteMap), ...toUpperCaseKeys(drumMap) };
    for (const key of keys) {
        fileNode.append(`    '${key.name.toLowerCase()}': ${allNotes[key.note.toUpperCase()]},\n`)
    }
    fileNode.append("}\n")

    fileNode.append("key_to_note_name = {\n")
    for (const key of keys) {
        fileNode.append(`    '${key.name.toLowerCase()}': '${key.note}',\n`)
    }
    fileNode.append("}\n")
}

function compileCommonSetupFunctions(fileNode: CompositeGeneratorNode) {
    fileNode.append(
        `\nstart_time=time.time()
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
            
            output_file.write(f"\\t\\t\\t'{note_name}', {keys_pressed[key.char] - start_time:.2f}, {duration:.2f}, 100\\n")
            
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
   o.write("music interactive {\\n\\ttempo 120\\n\\ttime_signature{4,4}\\n\\ttrack 1 {\\n\\t\\tinstrument '" + instrument_name + "'\\n\\t\\ttrackPart all {\\n\\t\\t\\tstart 0.0\\n\\t\\t\\trepeat 1\\n" )

output_file = open("./output/interactive.music", "a+")
listener.start()
listener.join()
output_file.write('\\n\\t\\t}\\n\\t} \\n}')
print("write the scenario in output/interactive.music")
`
    )
}