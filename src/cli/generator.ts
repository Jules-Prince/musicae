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

    // TODO : Est ce encore utile ?
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

        compileTrack(track_set.track[i], i, fileNode);
    }


}

function compileTrack(track: Track,  track_number:any, fileNode: CompositeGeneratorNode): void {
    for(const track_part of track.parts){
        // TODO : Pourquoi repeat est considere comme un String .. ?
        for(let i = 0; i < track_part.repeat(); i++){
            let instrument_number = compileInstrument(track_part, track.instrument.name.toUpperCase(), fileNode)
            compileNote(track_part.notes)
        }
    }
}


function compileInstrument(track_part : TrackPart, instrument:String ,fileNode : CompositeGeneratorNode ) {

    // TODO : return number of chanel

    switch (instrument) {
        case 'PIANO':
            return "";
        
        case 'GUITAR':
            return "";
        
        case 'DRUM':
            return "";
        
        default:
            return ''; // Handle other instrument cases or return an empty string if none matches
    }
}


function compileNotes(notes: Note[], i:number, track : Track, fileNode: CompositeGeneratorNode): void {

    // TODO : mettre les notes

}

function generateMidiFile(tracks:Track[], fileNode:CompositeGeneratorNode, musicName:String) {

}




