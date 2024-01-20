# musicDSL
DSL to create music

npm run langium:generate
npm run build

# Scénario

Les scénarios sont à mettre dans le dossier ./scenarios. L'extention doit être .music

Exemple : my_song.music

# Build un scénario 

Il y a un script qui build les scénarios pour avoir dans le dossier ./output, le fichier .mid correspondant. 

``` bash
./runScenario.sh  NOM_DU_SCENARIO
```

NOM_DU_SCENARIO est le nom du fichier scénario, dans ./scenario.

Exemple : ./runScenario my_song

# Documentation languim 

https://langium.org/tutorials/generation/


# Diagramme de class

```mermaid

classDiagram
    Music *-- "0 . *" TrackSet
    Track *-- "0 . *" TrackPart
    TrackSet *-- "1" TimeSignature
    TrackSet *-- "0 . *" Track
    NormalTrackPart *-- "0 . *" Note
    Note <|-- NormalNote
    Note <|-- NoteWithError
    Music *-- "0 . 1" Setup
    Setup *-- "0 . *" Key
    ReuseTrackPart *-- "0 . 1" ReuseWithReplacement
    ReuseWithReplacement *-- "0 . *" NoteReplacement
    TrackPart <|-- ReuseTrackPart
    TrackPart <-- ReuseTrackPart
    TrackPart <|-- NormalTrackPart
    Duration <|-- NoteDuration
    Duration <|-- FloatDuration
    NormalNote *-- "1" Duration
    NoteWithError *-- "1" Duration

    class NoteDuration{
        <<enumeration>>
        WHOLE
        HALF
        QUARTER
        EIGHTH
        SIXTEENTH
        THIRTYSECOND
    }

    class Music{
      name : ID
      tempo : INT
    }

    class TrackSet{

    }

    class Track{
       instrument :String
       tempo : INT
       human_error : Boolean
    }

    class TrackPart{
        id : ID
        start : INT
        repeat : INT
    }

    class NormalTrackPart{
        
    }

    

    class ReuseTrackPart{
        reuse : String

    }

    class ReuseWithReplacement{


    }

    class NoteReplacement{
        id : INT
        note : String
    }
    
    class TimeSignature{
        numerateur : INT
        denominateur : INT
    }

    class Setup {
       instrument : String
    }

    class Key {
         name : String
         note : String
    }

    class Note {
        pitch : String
        position : Float
        volume : INT

    }

    class NormalNote {
         
    }

    class NoteWithError {
        with_error : Boolean 
    }

    class Duration{

    }

    class FloatDuration{
        duration : Float 
    }


```
