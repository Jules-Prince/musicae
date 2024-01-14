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
        ('human_error' human_error=BOOLEAN)?
        parts+=TrackPart*
    '}';

TrackPart:
    'trackPart' id=ID '{'
        'start' start=INT
        ('repeat' repeat=INT)?
        notes+=Note*
        ('reuse' reuse=STRING)?
        (previous=PreviousTrackPart)?
    '}';

PreviousTrackPart:
    'previous' '{'
        'replace' '{'
            notesreplacement+=NoteReplacement*
        '}'
    '}';

NoteReplacement:
     'note' id=INT '=>' note=STRING;


Key:
    name=STRING '=>' note=STRING (',')?;


Note : 
    NormalNote | NoteWithError;

NormalNote:
    pitch=STRING ',' position=Float ',' duration=Float ',' volume=INT ;

NoteWithError:
    pitch=STRING ',' position=Float ',' duration=Float ',' volume=INT  'human_error' with_error=BOOLEAN ;

Float:
    n1=INT '.' n2=INT;

TimeSignature : 
    'time_signature' '{'
        numerator=INT "," denominator=INT
    '}';

Instrument:
    name =STRING;


terminal BOOLEAN returns boolean: 'true' | 'false';
hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal FLOAT returns number: /[0-9]+\.[0-9]+/; 

terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;


hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
