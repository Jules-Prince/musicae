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
        (reuseTrackPart=ReuseTrackPart)?
    '}';

ReuseTrackPart:
    'reuse' reuse=STRING  (reuseWithReplacement=ReuseWithReplacement)?;

ReuseWithReplacement:
        'replace' '{'
            notesreplacement+=NoteReplacement*
        '}';


NoteReplacement:
    'note' id=INT '=>' note=STRING;



Key:
    name=STRING '=>' note=STRING (',')?;


Note : 
    NormalNote | NoteWithError;

NormalNote:
    pitch=STRING ',' position=Float ',' duration=(Float|NoteDuration) ',' volume=INT ;

NoteWithError:
    pitch=STRING ',' position=Float ',' duration=(Float|NoteDuration) ',' volume=INT  'human_error' with_error=BOOLEAN ;

NoteDuration:
    duration= WHOLE | duration= HALF | duration=QUARTER |duration= EIGHTH | duration=SIXTEENTH | duration=THIRTYSECOND;
Float:
    n1=INT '.' n2=INT;

TimeSignature : 
    'time_signature' '{'
        numerator=INT "," denominator=INT
    '}';

Instrument:
    name =STRING;


terminal WHOLE returns string: 'whole';
terminal HALF returns string: 'half';
terminal QUARTER returns string: 'quarter';
terminal EIGHTH returns string: 'eighth';
terminal SIXTEENTH returns string: 'sixteenth';
terminal THIRTYSECOND returns string: 'thirtysecond';

terminal BOOLEAN returns boolean: 'true' | 'false';
hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;



terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;


hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

