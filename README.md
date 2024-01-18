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
      +String id
      +int? tempo
    }

    class TrackSet{

    }

    class Track{
      +int id
      +String instrument
      +int? tempo
      +boolean? human_error
    }

    class TrackPart{
        +int start
        +int? repeat
    }

    class NormalTrackPart{
        
    }

    

    class ReuseTrackPart{
        + string reuse

    }

    class ReuseWithReplacement{


    }

    class NoteReplacement{
        +int id
        +String note
    }
    
    class TimeSignature{
        +int numerateur
        +int denominateur
    }

    class Setup {
      +int id
      +String instrument
    }

    class Key {
        +String name
        +String note
    }

    class Note {

    }

    class NormalNote {
        +String pitch
        +Float position
        +int volume
    }

    class NoteWithError {
        +String pitch
        +Float position
        +int volume
        +boolean with_error
    }

    class Duration{

    }

    class FloatDuration{
        +Float duration
    }


```
