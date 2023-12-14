import type { Music,Note,Track, TrackPart } from '../language/generated/ast.js';
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
    for (const note of track.parts) {
        compileTrackParts(note, track, fileNode);
    }

    

}

function compileTrackParts(part: TrackPart,  track : Track, fileNode: CompositeGeneratorNode): void {

    // set time signature
    fileNode.append(
        `track${track.id}.setTimeSignature(${part.time_sign?.numerator},${part.time_sign?.denominator});\n`
    );

    for (let i = 0; i < part.notes.length; i++) {
        compileNotes(part.notes[i], i,track, fileNode);
    }


}


function compileNotes(note: Note, i:number, track : Track, fileNode: CompositeGeneratorNode): void {
    // create an array res to store the notes
    let res : string[] = [];
    for (const pitch of note.pitch.values) {
        // add quotes to every pitch
        res.push(`'${pitch}'`);
    }
    
    fileNode.append(
        `const `+`track${track.id}_note`+note.id+` = new MidiWriter.NoteEvent({pitch: [${res}], duration: '${note.duration}'});\n`
    );

    fileNode.append(
        `track${track.id}.addEvent(track${track.id}_note`+note.id+`);\n`
    );

}



