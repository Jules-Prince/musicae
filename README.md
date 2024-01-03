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
    Music o-- Track
    Music "1" o-- "1" Setup
    Track o-- TrackPart
    Setup "*" o-- "1" Key
    Key "1" --> "1" Note
    TrackPart -- TimeSignature
    TrackPart o-- Bar
    Note o-- Pitch
    Bar o-- Beat
    Beat o-- Note

    class Music{
      +String id
      +int tempo
    }

    class Track{
      +int id
      +String instrument
    }

    class TrackPart{
    }
    
    class Bar{
        +int counter

    }
    
    class TimeSignature{
        +int numerateur
        +int denominateur
    }

    class Beat{

    }

    class Note{
        +int duration
    }

    class Pitch{
        +String values
    }

    class Setup {
      +int id
      +String instrument
    }

    class Key {
        +String name
    }
```