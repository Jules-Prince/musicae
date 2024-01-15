# musicDSL
DSL to create music


# Genere le generator.ts
npm run langium:generate

# Je ne sais pas 
npm run build

# Run un scénario 
./bin/cli.js generate scenarios/test3.music 

# Doc cool 

https://langium.org/tutorials/generation/


# Diagramme de class

```mermaid

classDiagram
    Music "1" o-- "0 . *" TrackSet
    Track "1" o-- "0 . *" TrackPart
    TrackSet "1" o-- "1" TimeSignature
    TrackSet "1" o-- "0 . *" Track
    TrackPart "1" o-- "0 . *" Note
    Note <|-- NormalNote
    Note <|-- NoteWithError
    Music "1" o-- "0 . 1" Setup
    Setup "1" o-- "0 . *" Key

    class Music{
      +String id
      +int? tempo
    }

    class TrackSet{

    }

    class Track{
      +int id
      +String instrument
    }

    class TrackPart{
        +int start
        +int? repeat
        +String? reuse
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
        +Float duration
        +int volume
    }

    class NoteWithError {
        +String pitch
        +Float position
        +Float duration
        +int volume
        +boolean with_error
    }
```