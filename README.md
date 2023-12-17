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
    Track o-- TrackPart
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

```