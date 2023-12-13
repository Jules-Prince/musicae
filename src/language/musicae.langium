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

Note:
    'note' id=INT '{'
        'duration' duration=INT
        'pitch' pitch=Pitch
    '}';

Pitch : 
    (singleValue=STRING | values+=STRING (',' values+=STRING)*);

TrackPart:
    (time_sign=TimeSignature )?
    notes+=Note*;

TimeSignature : 
    'time_signature' '{'
        'numerator' numerator=INT
        'denominator' denominator=INT
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
