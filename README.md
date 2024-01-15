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