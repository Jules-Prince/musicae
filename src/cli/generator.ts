import type {Music,Note,Track, TrackSet, TrackPart, TimeSignature} from '../language/generated/ast.js';
import * as fs from 'node:fs';
import { CompositeGeneratorNode, toString } from 'langium';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';

export function generateMusicFile(music: Music,filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

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



    for (const track_set of music.trackSet) {
        compileTrackSet(track_set, music.tempo, track_set.time_signature , fileNode);
    }

    generateMidiFile(music.tracks, fileNode, music.name);
}

function compileTrackSet(track_set: TrackSet, tempo: any, time_signature: TimeSignature, fileNode: CompositeGeneratorNode) {

    for(let i = 0; i < track_set.track.length; i++){
        fileNode.append(
            `midi_${i} = MIDIFile(${i})\n`
        );
        fileNode.append(
            `midi_${i}.addTempo(0, 0, ${tempo})\n`
        );
        fileNode.append(
            `time_signature = ( ${time_signature.numerator} ,  ${time_signature.denominator} )\n`
        );
        fileNode.append(
            `midi_${i}.addTimeSignature(0, 0, *time_signature, 24)\n`
        );
    }
}

function compileTrack(track: Track, tempo:number,  fileNode: CompositeGeneratorNode): void {
    fileNode.append(
        `const track${track.id} = new MidiWriter.Track();\n`
    );
    const codeOfInstrument : string  = compileInstrument(track, fileNode);
    fileNode.append(
        `track${track.id}.addEvent(${codeOfInstrument});\n`
    );
    // set tempo
    fileNode.append(
        `track${track.id}.setTempo(${tempo});\n`
    );

    for (const trackPart of track.parts){
        fileNode.append(
            `track${track.id}.setTimeSignature(${trackPart.time_sign?.numerator},${trackPart.time_sign?.denominator});\n`
        );
        for (const bar of trackPart.bars) {
            for (let i = 0; i < bar.repeat; i++) {
                compileBar(bar, i, track, fileNode);
            }
        }
    }
}


function compileInstrument(track : Track, fileNode : CompositeGeneratorNode ) {
    switch (track.instrument.name.toUpperCase()) {
        case 'PIANO':
            return "new MidiWriter.ProgramChangeEvent({ channel: 0 })";
        
        case 'GUITAR':
            return "new MidiWriter.ProgramChangeEvent({ channel: 6 })"; 
        
        case 'DRUM':
            return "new MidiWriter.ProgramChangeEvent({ channel: 9 })"; 
        
        default:
            return ''; // Handle other instrument cases or return an empty string if none matches
    }
}



function compileBar(bar: Bar, i:number, track : Track, fileNode: CompositeGeneratorNode): void {
    for (let j = 0; j < bar.beats.length; j++) {
        compileBeat(bar.beats[j], j, track, fileNode);
    }
}

function compileBeat(beat: Beat, i:number, track : Track, fileNode: CompositeGeneratorNode): void {
    for (let j = 0; j < beat.notes.length; j++) {
        compileNote(beat.notes[j], j, track, fileNode);
    }
}


function compileNote(note: Note, i:number, track : Track, fileNode: CompositeGeneratorNode): void {
    // create an array res to store the notes
    let res : string[] = [];
    for (const pitch of note.pitch.values) {
        // add quotes to every pitch
        res.push(`'${pitch}'`);
    }
    

    fileNode.append(
        `track${track.id}.addEvent(new MidiWriter.NoteEvent({pitch: [${res}], duration: '${note.duration}'}));\n`
    );

}

function generateMidiFile(tracks:Track[], fileNode:CompositeGeneratorNode, musicName:String) {
    const trackParams = tracks.map((track) => `track${track.id}`).join(',');
    
    fileNode.append(`const writer = new MidiWriter.Writer([${trackParams}]);\n`);
    fileNode.append(`\n`);
    fileNode.append(`// Build the MIDI file\n`);
    fileNode.append(`const builtMidi = writer.buildFile();\n`);
    fileNode.append(`\n`);
    fileNode.append(`// Output the MIDI file\n`);
    fileNode.append(`console.log(builtMidi);\n`);



    // Spécifiez le chemin du fichier .mid que vous souhaitez créer
    fileNode.append(`const filePath = \'output/output_${musicName}.mid\';\n`)
    fileNode.append('const midiData = new Uint8Array(builtMidi);\n')
    // Écrivez les données dans le fichier
    fileNode.append('writeFileSync(filePath, Buffer.from(midiData));\n')
    fileNode.append('console.log(`Le fichier MIDI a été généré avec succès à l\'emplacement : ${filePath}`);\n')
    // Output the MIDI file
    fileNode.append('console.log(builtMidi);\n')
}




