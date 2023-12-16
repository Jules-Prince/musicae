import type { Bar, Beat, Music,Note,Track } from '../language/generated/ast.js';
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
        'import MidiWriter from \'midi-writer-js;\'\n'
    );

    
    
    for (const track of music.tracks) {
        compileTrack(track, music.tempo, fileNode);
    }

    generateMidiFile(music.tracks, fileNode);


}

function compileTrack(track: Track, tempo:number,  fileNode: CompositeGeneratorNode): void {
    fileNode.append(
        `const track${track.id} = new MidiWriter.Track();\n`
    );

    // set instrument
    //fileNode.append(
      //  `track${track.id}.setInstrument(${track.instrument.name});\n`
    //);

    // set tempo
    fileNode.append(
        `track${track.id}.setTempo(${tempo});\n`
    );

    // add notes
    for (const bar of track.bars) {

        fileNode.append(
            `track${track.id}.setTimeSignature(${bar.time_sign.numerator},${bar.time_sign.denominator});\n`
        );

        for (let i = 0; i < bar.repeat; i++) {
            compileBar(bar, i, track, fileNode);
        }
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

function generateMidiFile(tracks:Track[], fileNode:CompositeGeneratorNode) {
    const trackParams = tracks.map((track) => `track${track.id}`).join(',');
    
    fileNode.append(`const writer = new MidiWriter.Writer(${trackParams});\n`);
    fileNode.append(`\n`);
    fileNode.append(`// Build the MIDI file\n`);
    fileNode.append(`const builtMidi = writer.buildFile();\n`);
    fileNode.append(`\n`);
    fileNode.append(`// Output the MIDI file\n`);
    fileNode.append(`console.log(builtMidi);\n`);
}




