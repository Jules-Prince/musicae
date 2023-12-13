grammar Musicae

entry Music:
    'music' name=ID '{'
        tempo=INT
        tracks+=Track*

        '}';

Track:
    'track' id=INT '{'
        instrument=Instrument
        parts+=TrackPart*
    '}';

Note:
    'note' id=INT '{'
        duration=INT
        value=INT
    '}';

TrackPart:
    (time_sign=INT '/' INT)?
    notes+=Note*;

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
