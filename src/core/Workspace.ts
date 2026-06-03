import { Camera } from "./Camera";
import { Renderer } from "./Renderer";
import { Vector2 } from "../services/Vector2";
import { Input } from "./Input";
import { Settings } from "./config/Settings";
import { Node } from "../types/Node";

export class Workspace {
    camera: Camera;
    nodes: Node[] = [];
    private dragStartWorld: Vector2 | null = null;
    private wasDragging = false;

    hoveredNode: Node | null = null;
    selectedNodes: Node[] = [];

    private draggedNodes: Node[] = [];
    private nodeDragStartMouse: Vector2 | null = null;
    private dragStartPositions = new Map<Node, Vector2>();

    private selectionStart: Vector2 | null = null;
    private selectionEnd: Vector2 | null = null;

    private isSelecting = false;

    constructor() {
        this.camera = new Camera();

        this.nodes.push(
            new Node(new Vector2(0, 0), new Vector2(200, 150), "Node"),
            new Node(new Vector2(0, 160), new Vector2(200, 150), "Node")
        );
    }

    worldToScreen(position: Vector2): Vector2 {
        return position.sub(this.camera.position).mult(this.camera.zoom);
    }

    screenToWorld(position: Vector2): Vector2 {
        return position.div(this.camera.zoom).add(this.camera.position);
    }

    get selectedNode(): Node | null {
        if (this.selectedNodes.length === 0) {
            return null;
        }

        return this.selectedNodes[
            this.selectedNodes.length - 1
        ];
    }

    private clearSelection() {
        for (const node of this.selectedNodes) {
            node.deselect();
        }

        this.selectedNodes = [];
    }

    private addToSelection(node: Node) {
        if (this.selectedNodes.includes(node)) {
            return;
        }

        node.select();
        this.selectedNodes.push(node);
    }

    private getMouseScreen(): Vector2 {
        return new Vector2(
            Input.mousePosition.x - window.innerWidth / 2,
            Input.mousePosition.y - window.innerHeight / 2
        );
    }

    private getMouseWorld(): Vector2 {
        return this.screenToWorld(this.getMouseScreen());
    }

    private deleteSelectedNodes(): void {
        if (this.selectedNodes.length === 0) {
            return;
        }

        for (const node of this.selectedNodes) {
            const index = this.nodes.indexOf(node);
            if (index >= 0) {
                this.nodes.splice(
                    index,
                    1
                );
            }
        }

        this.selectedNodes = [];
    }

    updateZoom() {
        const mouseScreen = this.getMouseScreen();
        const mouseWorldBefore = this.screenToWorld(mouseScreen);
        const zoomSpeed = Settings.Camera.ZoomSpeed;
        if (Input.wheelDelta > 0) {
            this.camera.zoom -= zoomSpeed;
        }
        if (Input.wheelDelta < 0) {
            this.camera.zoom += zoomSpeed;
        }

        this.camera.zoom = Math.max(Settings.Camera.MinZoom, Math.min(Settings.Camera.MaxZoom, this.camera.zoom));

        const mouseWorldAfter = this.screenToWorld(mouseScreen);
        this.camera.position = this.camera.position.add(mouseWorldBefore.sub(mouseWorldAfter));
    }

    private updateHover() {
        const mouseWorld = this.getMouseWorld();
        let foundHover = false;

        for (const node of this.nodes) {
            if (!node.containsPoint(mouseWorld)) {
                continue;
            }
            foundHover = true;
            if (this.hoveredNode !== node) {
                this.hoveredNode?.unhover();

                node.hover();
                this.hoveredNode = node;
            }

            break;
        }

        if (!foundHover && this.hoveredNode) {
            this.hoveredNode.unhover();
            this.hoveredNode = null;
        }
    }

    private toggleSelection(node: Node) {
        const index = this.selectedNodes.indexOf(node);

        if (index >= 0) {
            node.deselect();
            this.selectedNodes.splice(
                index,
                1
            );
            return;
        }

        this.addToSelection(node);
    }

    private selectNodesInBox() {
        if (!this.selectionStart || !this.selectionEnd) {
            return;
        }

        this.clearSelection();

        const minX = Math.min(this.selectionStart.x, this.selectionEnd.x);
        const maxX = Math.max(this.selectionStart.x, this.selectionEnd.x);

        const minY = Math.min(this.selectionStart.y, this.selectionEnd.y);
        const maxY = Math.max(this.selectionStart.y, this.selectionEnd.y);

        for (const node of this.nodes) {
            const nodeLeft = node.position.x;
            const nodeRight = node.position.x + node.size.x;

            const nodeTop = node.position.y;
            const nodeBottom = node.position.y + node.size.y;

            const boxLeft = minX;
            const boxRight = maxX;

            const boxTop = minY;
            const boxBottom = maxY;

            const overlapX = Math.min(nodeRight, boxRight) - Math.max(nodeLeft, boxLeft);
            const overlapY = Math.min(nodeBottom, boxBottom) - Math.max(nodeTop, boxTop);

            if (overlapX > 0.1 && overlapY > 0.1) {
                this.addToSelection(node);
            }
        }
    }

    private updateSelection() {
        if (Input.isKeyPressed("Backspace")) {
            this.deleteSelectedNodes();
        }

        if (Input.isMousePressed(0) && !this.hoveredNode) {
            this.isSelecting = true;
            this.selectionStart = this.getMouseWorld();

            this.selectionEnd = this.selectionStart.copy();
            return;
        }

        if (this.isSelecting && Input.isMouseDown(0)) {
            this.selectionEnd = this.getMouseWorld();
        }

        if (this.isSelecting && !Input.isMouseDown(0)) {
            this.selectNodesInBox();

            this.isSelecting = false;

            this.selectionStart = null;
            this.selectionEnd = null;
        }

        if (!Input.isMousePressed(0)) {
            return;
        }

        if (!this.hoveredNode) {
            this.clearSelection();
            return;
        }

        if (Input.isKeyDown("ControlLeft")) {
            this.toggleSelection(this.hoveredNode);
            return;
        }

        if (this.selectedNodes.includes(this.hoveredNode)) {
            return;
        }

        this.clearSelection();
        this.addToSelection(this.hoveredNode);
    }

    private updateNodeDragging() {
        const mouseWorld = this.getMouseWorld();

        if (Input.isMousePressed(0) && this.hoveredNode) {
            this.draggedNodes = [...this.selectedNodes];
            this.nodeDragStartMouse = mouseWorld.copy();
            this.dragStartPositions.clear();

            for (const node of this.draggedNodes) {
                this.dragStartPositions.set(node, node.position.copy());
            }
        }

        if (Input.isMouseDown(0) && this.draggedNodes && this.nodeDragStartMouse && this.dragStartPositions) {
            const delta = mouseWorld.sub(this.nodeDragStartMouse);

            for (const node of this.draggedNodes) {
                const startPos = this.dragStartPositions.get(node);

                if (!startPos) {
                    continue;
                }

                node.move(
                    startPos.add(delta)
                );
            }
        }

        if (!Input.isMouseDown(0)) {
            this.draggedNodes = [];
            this.nodeDragStartMouse = null;
            this.dragStartPositions.clear();
        }
    }

    private drawSelectionBox(renderer: Renderer) {
        if (!this.isSelecting || !this.selectionStart || !this.selectionEnd) {
            return;
        }
        const start = this.worldToScreen(this.selectionStart);
        const end = this.worldToScreen(this.selectionEnd);
        const size = end.sub(start);

        renderer.rect(
            start,
            size,
            Settings.Theme.Selection.Fill,
            Settings.Theme.Selection.Border
        );
    }

    private updateCamera() {
        const mouseScreen = this.getMouseScreen();
        if (!Input.isMouseDown(2)) {
            this.wasDragging = false;
            this.dragStartWorld = null;

            return;
        }

        if (!this.wasDragging) {
            this.dragStartWorld = this.screenToWorld(mouseScreen);

            this.wasDragging = true;
        }

        const currentWorld = this.screenToWorld(mouseScreen);

        this.camera.position = this.camera.position.add(this.dragStartWorld!.sub(currentWorld));
    }

    update(dt: number) {
        this.updateZoom();
        this.updateCamera();

        this.updateHover();
        this.updateSelection();
        this.updateNodeDragging();
    }

    private drawGrid(renderer: Renderer) {
        if (!Settings.Grid.Visible) {
            return;
        }

        const gridSize = Settings.Grid.Size;

        const leftWorld = this.camera.position.x - window.innerWidth / (2 * this.camera.zoom);
        const rightWorld = this.camera.position.x + window.innerWidth / (2 * this.camera.zoom);
        const topWorld = this.camera.position.y - window.innerHeight / (2 * this.camera.zoom);
        const bottomWorld = this.camera.position.y + window.innerHeight / (2 * this.camera.zoom);

        const startX = Math.floor(leftWorld / gridSize) * gridSize;
        const startY = Math.floor(topWorld / gridSize) * gridSize;

        for (let x = startX; x <= rightWorld; x += gridSize) {
            const start = this.worldToScreen(new Vector2(x, topWorld));
            const end = this.worldToScreen(new Vector2(x, bottomWorld));

            if (x % (gridSize * Settings.Grid.MajorLineFrequency) === 0) {
                renderer.line(start, end, Settings.Theme.Grid.Major);
            } else {
                renderer.line(start, end, Settings.Theme.Grid.Minor);
            }
        }

        for (let y = startY; y <= bottomWorld; y += gridSize) {
            const start = this.worldToScreen(new Vector2(leftWorld, y));
            const end = this.worldToScreen(new Vector2(rightWorld, y));

            if (y % (gridSize * Settings.Grid.MajorLineFrequency) === 0) {
                renderer.line(start, end, Settings.Theme.Grid.Major);
            } else {
                renderer.line(start, end, Settings.Theme.Grid.Minor);
            }
        }
    }

    drawNodes(renderer: Renderer) {
        for (const node of this.nodes) {
            const screenPos = this.worldToScreen(node.position);

            node.draw(renderer, screenPos, this.camera.zoom);
        }
    }


    draw(renderer: Renderer) {
        this.drawGrid(renderer);
        this.drawNodes(renderer);

        this.drawSelectionBox(renderer);
    }
}