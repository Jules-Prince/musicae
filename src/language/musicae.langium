grammar Musicae

entry Music:
    'music' name=ID '{'
        'tempo' tempo=INT
        tracks+=Track*

        '}';

Track:
    'track' id=INT '{'
        'instrument' instrument=Instrument
        parts+=TrackPart*
    '}';

TrackPart:
    'trackPart' '{'
        time_sign=TimeSignature
        bars+=Bar*
    '}';

Note:
    '{'
        duration=INT ',' pitch=Pitch
    '}';

Pitch : 
    (values+=STRING (',' values+=STRING)*);


TimeSignature : 
    'ts' '{'
        numerator=INT "," denominator=INT
    '}';

Instrument:
    name =( DRUM | PIANO | GUITAR | BASS ) ;

Bar:
    'bar' 'counter' repeat=INT '{'
        beats+=Beat*
    '}';

Beat:
    'beat' '{'
        notes+=Note*
    '}';


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
