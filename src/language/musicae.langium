grammar Musicae

entry Music:
    'music' name=ID '{'
        ('tempo' tempo=INT)?
        trackSet+=TrackSet*
        (setup=Setup)?
    '}';

TrackSet:
    time_signature=TimeSignature
    track+=Track*;

Setup:
    'setup' '{'
        'instrument' instrument=Instrument
        'keys' '{'
            keys+=Key*
        '}'
    '}';

Track:
    'track' id=INT '{'
        'instrument' instrument=Instrument
        parts+=TrackPart*
    '}';

TrackPart:
    'trackPart' '{'
        'repeat' repeat=INT?
        notes+=Note*
    '}';

Key:
    name=STRING '=>' note=STRING (',')?;


Note : 
    NormalNote | NoteWithError;
NormalNote:
    pitch=STRING ',' position=Float ',' duration=INT ',' volume=INT ;

NoteWithError:
    pitch=STRING ',' position=Float ',' duration=INT ',' volume=INT ','  with_error=STRING;

Float:
    n1=INT '.' n2=INT;

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
terminal FLOAT: /[0-9]+'.'+[0-9]/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;


hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
