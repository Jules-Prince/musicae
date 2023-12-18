grammar Musicae

entry Music:
    'music' name=ID '{'
        'tempo' tempo=INT
        trackSet+=TrackSet*
        '}';

TrackSet:
    time_signature=TimeSignature
    track+=Track*;

Track:
    'track' id=INT '{'
        'instrument' instrument=Instrument
        parts+=TrackPart*
    '}';

TrackPart:
    'trackPart' '{'
        ('repeat' repeat=INT)?
        notes+=Note*
    '}';

Note:
    pitch=STRING ',' position=INT ',' duration=INT ',' volume=INT ;


TimeSignature : 
    'time_signature' '{'
        numerator=INT "," denominator=INT
    '}';

Instrument:
    name =( DRUM | PIANO | GUITAR | BASS ) ;


terminal DRUM: 'DRUM';
terminal PIANO: 'PIANO';
terminal GUITAR: 'GUITAR';
terminal BASS: 'BASS';
hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;


hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
