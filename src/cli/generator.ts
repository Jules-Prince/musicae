
import {type Music,type Note,type Track, type TrackSet, type TimeSignature, isNoteWithError,Setup, Key} from '../language/generated/ast.js';
import * as fs from 'node:fs';
import { CompositeGeneratorNode, toString } from 'langium';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';

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
    'rc': 51   // Ride Cymbal
};

const instrumentsMap : { [key: string]: number } = {
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
    'DRUM': 9 ,
    'PIANO':0
}



export function generateMusicFile(music: Music,filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.py`;

    const fileNode = new CompositeGeneratorNode();
    compile(music, fileNode)


    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, {recursive: true});
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}


function compile(music: Music, fileNode: CompositeGeneratorNode): void {
    fileNode.append(
        'from midiutil import MIDIFile\n'
    );
    if (music.setup !== undefined) {
        fileNode.append(
            'import pygame.midi\n' +
            'from pynput import keyboard\n' +
            'import time\n'
        );
    }

    if (music.tempo === undefined) { // set default tempo to 120
        music.tempo = 120;
    }

    for (const track_set of music.trackSet) {
        compileTrackSet(track_set, music.tempo, track_set.time_signature , fileNode);
    }
    if (music.trackSet.length > 0) {
        generateMidiFile(music.name, fileNode);
    }

    if (music.setup !== undefined) {
        compileSetup(music.setup, fileNode);
    }

    // TODO : Est ce encore utile ?
    //generateMidiFile(music.tracks, fileNode, music.name);
}

function compileTrackSet(track_set: TrackSet, tempo: any, time_signature: TimeSignature, fileNode: CompositeGeneratorNode) {

    const number_of_tracks = track_set.track.length;
    fileNode.append(
        `midi = MIDIFile(${number_of_tracks})\n`
    );

    for(let i = 0; i < track_set.track.length; i++){
       
        fileNode.append(
            `midi.addTempo(0, 0, ${tempo})\n`
        );
        fileNode.append(
            `time_signature = ( ${time_signature.numerator} ,  ${time_signature.denominator} )\n`
        );
        fileNode.append(
            `midi.addTimeSignature(0, 0, *time_signature, 24)\n`
        );

        
        compileTrack(track_set.track[i], time_signature.numerator, i,track_set.track[i].human_error.valueOf(), fileNode);
        

    }
}

function compileSetup(setup: Setup, fileNode: CompositeGeneratorNode) {
    const instrumentNumber = getInstrument(setup.instrument.name.toUpperCase());

    fileNode.append(
        "\n\nprint('click esc to stop')\n" +
        "# Initialize pygame.midi\n" +
        "pygame.midi.init()\n" +
        "midi_output = pygame.midi.Output(0)  # Open the first MIDI port\n" +
        `instrument = ${instrumentNumber}\n` +
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

function compileTrack(track: Track, time_sign : number, trackNumber: any, human_error:boolean, fileNode: CompositeGeneratorNode): void {
    const instrumentNumber = getInstrument(track.instrument.name.toUpperCase());

    fileNode.append(
        `midi.addProgramChange(${trackNumber}, ${trackNumber}, 0, ${instrumentNumber})\n`
    );

    for (let trackPart of track.parts) {

        const trackPartOld = trackPart

        if(trackPart.reuse){
            trackPart = track.parts.find(t => t.id === trackPart.reuse)!
            trackPart.start = trackPartOld.start
        }


        const repeatCount = trackPart.repeat || 1;
        const start = trackPart.start
        const startFloat = parseFloat(String(start.n1) + "." + String(start.n2))

        // random error 
        const randomError = Math.random() * 0.5;


        for (let i = 0; i < repeatCount; i++) {

            if (track.instrument.name.toUpperCase() === 'DRUM') {
                if(human_error){
                    compileDrumNote(trackPart.notes, instrumentNumber, trackNumber, startFloat + i * time_sign + randomError, fileNode);
                }
                compileDrumNote(trackPart.notes, instrumentNumber, trackNumber, startFloat + i * time_sign, fileNode);
            } else {
                if(human_error){
                    compileNote(trackPart.notes, instrumentNumber, trackNumber, startFloat + i * time_sign + randomError, fileNode);
                }
                compileNote(trackPart.notes, instrumentNumber, trackNumber, startFloat + i * time_sign, fileNode);
            }
        }
    }
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
}

function compileCommonSetupFunctions(fileNode: CompositeGeneratorNode) {
    fileNode.append(
`\ndef on_press(key):
    try:
        if key.char in key_to_note and key.char not in keys_pressed:
            note = key_to_note[key.char]
            print(f"Playing note: {note}")
            channel=instrument if instrument < 16 else 0
            midi_output.note_on(note, 100, channel=channel)  # Note on with velocity 100
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
`
    )
}

function getInstrument(instrument:String ) : number {
    const instrumentNumber =instrumentsMap[instrument.toUpperCase()]
    if (instrumentNumber === undefined) {
        throw new Error(`Unknown instrument ${instrument}`);
    }
    return instrumentNumber
}



function compileNote(notes: Note[],instrument_number:number, track_number : any, i:number, fileNode: CompositeGeneratorNode): void {
    for(const note of notes){
        const pitchValue = noteMap[note.pitch.toUpperCase()];''
        if (pitchValue === undefined) {
            throw new Error(`Unknown pitch ${note.pitch}`);
        }

        else{

            let  decimal = parseFloat(String(note.position.n1))+i;
            let time = parseFloat(String(note.position.n1) + "." + String(note.position.n2)) + i
            if (isNoteWithError(note)) {
                const randomNumber = Math.random() * 0.2;
                const integerPart = Math.floor(randomNumber);
                decimal += integerPart; // Adding the integer part to decimal

                const decimalPart = (randomNumber - integerPart).toFixed(15); // Get decimal part
                const volume = note.volume + generateRandomVelocityError();

                fileNode.append(
                    `midi.addNote(${track_number}, ${instrument_number}, ${pitchValue}, ${decimal}.${note.position.n2}${decimalPart.slice(2)} , ${note.duration}, ${volume}, true)\n`
                );
            }

            else{
                fileNode.append(
                `midi.addNote(${track_number}, ${instrument_number}, ${pitchValue},${time} ,${note.duration}, ${note.volume})\n`);
            }

        }
        
    }
}



function compileDrumNote(notes: Note[],instrument_number:number, track_number : any, i:number, fileNode: CompositeGeneratorNode): void {
    for(const note of notes){
        const pitchValue = drumMap[note.pitch];
        console.log(note.pitch.toUpperCase())
        if (pitchValue === undefined) {
            throw new Error(`Unknown pitch ${note.pitch}`);
        }

        else{

            let  decimal = parseFloat(String(note.position.n1))+i;
            let time = parseFloat(String(note.position.n1) + "." + String(note.position.n2)) + i
            if (isNoteWithError(note)) {
                const randomNumber = Math.random() * 0.2;
                const integerPart = Math.floor(randomNumber);
                decimal += integerPart; // Adding the integer part to decimal
                const decimalPart = (randomNumber - integerPart).toFixed(15); // Get decimal part
                const volume = note.volume + generateRandomVelocityError();
                fileNode.append(
                    `midi.addNote(${track_number}, ${instrument_number}, ${pitchValue}, ${decimal}.${note.position.n2}${decimalPart.slice(2)} , ${note.duration}, ${volume})\n`
                );
            }

            else{


                fileNode.append(
                `midi.addNote(${track_number}, ${instrument_number}, ${pitchValue},${time} ,${note.duration}, ${note.volume})\n`);
            }
        }

    }
}

function generateRandomVelocityError() {

    const volumeError = Math.floor(Math.random() * 11) - 5; // Nombres entre -5 et 5 inclus
    return volumeError;

}

function generateMidiFile(name:String, fileNode:CompositeGeneratorNode) {
    fileNode.append(
        `with open("./output/${name}.mid", "wb") as output_file:\n`
    );
    fileNode.append(
        `   midi.writeFile(output_file)\n`
    );
}




