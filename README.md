# ArchFlow

Archflow is a visual digital architecture mapping and workflow editor built from scratch in TypeScript.

The goal is to create an infinite workspace where ideas, systems, projects, concepts, and relationships can be organized visually through nodes and connections.

Unlike traditional note-taking applications, ArchFlow focuses on spatial thinking and visual structure.

If you also hate how mindmaps and flowcharts look and function like i do, then i recommend you give ArchFlow a go.

## Features
### Current
- Infinite workspace
- Camera panning
- Zoom at mouse position
- Infinite grid
- Input system
- Renderer abstraction
- Config system
- Theme system

### Planned
- Nodes
- Connections
- Drag & Drop
- Selection
- Copy / Paste
- Save / Load
- Undo / Redo
- Reference Nodes
- Knowledge Graphs
- Different Workspace Files
- Game-Ready Event Connection/Reference Nodes
## Architecture

ArchFlow is built around a custom engine architecture:
```
Engine
 ├── Renderer
 ├── Input
 ├── Workspace
 ├── Camera
 └── Services
```

The application uses a world-space coordinate system similar to game engines.

## Philosophy
ArchFlow is designed around three principles:

### Infinite Space
The workspace should never impose artificial limits.

### Visual Thinking
Information should be organized spatially rather than linearly.

### Extensibility
Systems should be designed to grow without requiring major rewrites.

## Roadmap
### Phase 1
- Core engine
- Camera
- Grid
- Input

### Phase 2
- Node system
- Selection system
- Connections

### Phase 3
- Saving and loading
- References
- Search

### Phase 4
- Collaboration
- Plugins
- Advanced graph tools

## Author
Christoffer Damrong Blond Schjødt