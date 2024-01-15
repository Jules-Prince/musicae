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
    TrackPart -- TimeSignature
    TrackPart o-- Bar
    Note o-- Pitch
    Bar o-- Beat
    Beat o-- Note

    class Music{
      +String id
      +int? tempo
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
        +String note
    }
```

# How to use the extension

- `npm i --save-dev esbuild`
- `npm install -g @vscode/vsce`
- Run `vsce package` to package the extension.
Then, a file name musicae-0.0.1.vsix will be create in the root directory. Right click on then and select "Install Extension VSIX"