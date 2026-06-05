# ArchFlow

ArchFlow is a visual project architecture and workflow editor built from scratch in TypeScript.

The goal is to create an infinite workspace where ideas, systems, projects, concepts, and relationships can be organized visually through nodes and connections.

Unlike traditional note-taking applications, ArchFlow focuses on spatial thinking and visual structure.

If you've ever felt limited by traditional mind maps and flowcharts, ArchFlow aims to provide a more flexible and visually expressive alternative.

## Vision
ArchFlow is designed to become more than a note-taking tool.

The long-term goal is to create a digital workspace where knowledge, systems, software architecture, game design, worldbuilding, and project planning can coexist within a single visual environment.

## Status
ArchFlow is currently in active early development.
The core engine, rendering pipeline, camera system, and infinite workspace have been implemented.
Development is currently focused on the node system and workspace interaction.

## Why ArchFlow?
Most tools specialize in a single domain.

- Mind maps focus on ideas.
- Flowcharts focus on processes.
- Note-taking apps focus on documents.
- Game design tools focus on gameplay systems.

ArchFlow aims to unify these approaches within a single infinite workspace.

## Features
### Current
- Infinite workspace
- Infinite grid rendering
- Camera panning
- Zoom-to-cursor navigation
- Input management system
- Renderer abstraction
- Configuration system
- Theme system
- World-space coordinate system

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
- Game development-oriented node systems
## Architecture

ArchFlow is built around a custom engine architecture:
```
Application
└──Engine
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
### Phase 0 ✅
- Engine architecture ✅
- Rendering system ✅
- Input system ✅
- Camera system ✅
- Infinite workspace ✅
- Infinite grid ✅

### Phase 1 
- Node system ✅
- Selection system ✅
- Node Dragging ✅
- Multi Node Selection ✅
- Connections

### Phase 2
- Drag & Drop
- Copy / Paste
- Undo / Redo
- Workspace files

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






ArchFlow is free to use, modify, and extend.
If you use source code from ArchFlow in a public project, please provide credit.
Mods, plugins, and extensions are encouraged.
Do not claim authorship of work that is not your own.