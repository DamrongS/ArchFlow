import { Camera } from "./Camera";
import { Renderer } from "./Renderer";
import { Vector2 } from "../services/Vector2";
import { Input } from "./Input";
import { Settings } from "./config/Settings";
import { Node } from "../types/Node";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { Connection } from "../types/Connection"
import { Nexus } from "../types/Nexus";

export class Workspace {
    camera: Camera;
    nodes: Node[] = [];
    nexi: Nexus[] = [];
    workspaceSidebar: WorkspaceSidebar;
    private connections: Connection[] = [];

    private visible = false;
    private dragStartWorld: Vector2 | null = null;
    private wasDragging = false;

    hoveredNode: Node | null = null;
    selectedNodes: Node[] = [];

    private hoveredConnection: Connection | null = null;
    private selectedConnections: Connection[] = [];

    private draggedNodes: Node[] = [];
    private nodeDragStartMouse: Vector2 | null = null;
    private dragStartPositions = new Map<Node, Vector2>();

    private selectionStart: Vector2 | null = null;
    private selectionEnd: Vector2 | null = null;

    private isSelecting = false;
    private returning = false;
    private focusing = false;

    constructor(public name: string) {
        this.camera = new Camera();
        this.workspaceSidebar = new WorkspaceSidebar(this.addNode.bind(this), this.addNexus.bind(this));

        //this.nodes.push(
        // new Node(new Vector2(0, 0), new Vector2(200, 150), "Node"),
        //new Node(new Vector2(0, 160), new Vector2(200, 150), "Node")
        //);

        this.nexi.push(new Nexus(new Vector2(0, 0), 1, "NexusTest"));
    }

    activate() {
        this.visible = true;
    }

    worldToScreen(position: Vector2): Vector2 {
        return position.sub(this.camera.position).mult(this.camera.zoom);
    }

    screenToWorld(position: Vector2): Vector2 {
        return position.div(this.camera.zoom).add(this.camera.position);
    }

    addNode(node: Node) {
        this.nodes.push(node);
    }

    addNexus(nexus: Nexus) {
        this.nexi.push(nexus);
    }

    private addConnectionToSelection(connection: Connection) {
        if (this.selectedConnections.includes(connection)) {
            return;
        }

        connection.select();
        this.selectedConnections.push(connection);
    }

    private removeConnectionFromSelection(connection: Connection) {
        const index = this.selectedConnections.indexOf(connection);

        if (index < 0) {
            return;
        }

        connection.deselect();
        this.selectedConnections.splice(index, 1);
    }

    private clearConnectionSelection() {
        for (const connection of this.selectedConnections) {
            connection.deselect();
        }

        this.selectedConnections = [];
    }

    createConnection(nodes: Node[]) {
        for (let i = 0; i < nodes.length - 1; i++) {
            const from = nodes[i];
            const to = nodes[i + 1];

            const alreadyConnected = this.connections.some(
                connection =>
                    (connection.from === from && connection.to === to) ||
                    (connection.from === to && connection.to === from)
            );

            if (alreadyConnected) {
                continue;
            }

            this.connections.push(
                new Connection(from, to)
            );
        }
    }

    removeConnection(connection: Connection) {
        const index = this.connections.indexOf(connection);

        if (index >= 0) {
            this.connections.splice(index, 1);
        }
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

    private bringToFront(node: Node) {
        const index = this.nodes.indexOf(node);

        if (index < 0) return;

        this.nodes.splice(index, 1);
        this.nodes.push(node);
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

            this.connections = this.connections.filter(
                connection =>
                    connection.from !== node &&
                    connection.to !== node
            );
        }

        this.selectedNodes = [];
    }

    private deleteSelectedConnections() {
        if (this.selectedConnections.length === 0) {
            return;
        }

        for (const connection of this.selectedConnections) {
            const index = this.connections.indexOf(connection);
            if (index >= 0) {
                this.connections.splice(
                    index,
                    1
                );
            }
        }

        this.selectedConnections = [];
    }

    updateZoom() {
        const mouseScreen = this.getMouseScreen();
        const mouseWorldBefore = this.screenToWorld(mouseScreen);
        const zoomSpeed = Settings.Camera.ZoomSpeed * this.camera.zoom;

        if (Input.wheelDelta > 0) {
            this.returning = false;
            this.focusing = false;
            this.camera.zoom -= zoomSpeed;
        }
        if (Input.wheelDelta < 0) {
            this.returning = false;
            this.focusing = false;
            this.camera.zoom += zoomSpeed;
        }

        this.camera.zoom = Math.max(Settings.Camera.MinZoom, Math.min(Settings.Camera.MaxZoom, this.camera.zoom));

        const mouseWorldAfter = this.screenToWorld(mouseScreen);
        this.camera.position = this.camera.position.add(mouseWorldBefore.sub(mouseWorldAfter));
    }

    private updateHover() {
        const mouseWorld = this.getMouseWorld();

        // Nodes
        let foundHover = false;
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            const node = this.nodes[i];
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

        if (this.hoveredNode) {
            this.hoveredConnection?.unhover();
            this.hoveredConnection = null;

            return;
        }

        // Connections
        let foundHoverConnection = false;
        for (let i = this.connections.length - 1; i >= 0; i--) {
            const connection = this.connections[i];
            if (!connection.containsPoint(mouseWorld)) {
                continue;
            }
            foundHoverConnection = true;
            if (this.hoveredConnection !== connection) {
                this.hoveredConnection?.unhover();

                connection.hover();
                this.hoveredConnection = connection;
            }

            break;
        }

        if (!foundHoverConnection && this.hoveredConnection) {
            this.hoveredConnection.unhover();
            this.hoveredConnection = null;
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
        this.clearConnectionSelection();

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

            if (overlapX > 0.01 && overlapY > 0.01) {
                this.addToSelection(node);
            }
        }

        for (const connection of this.connections) {
            const from = connection.from.position.add(
                connection.from.size.div(2)
            );

            const to = connection.to.position.add(
                connection.to.size.div(2)
            );

            const fromInside =
                from.x >= minX &&
                from.x <= maxX &&
                from.y >= minY &&
                from.y <= maxY;

            const toInside =
                to.x >= minX &&
                to.x <= maxX &&
                to.y >= minY &&
                to.y <= maxY;

            if (fromInside && toInside) {
                this.addConnectionToSelection(connection);
            }
        }
    }

    private updateSelection() {
        if (Input.isKeyPressed("Backspace") || Input.isKeyPressed("Delete")) {
            this.deleteSelectedNodes();
            this.deleteSelectedConnections();
        }

        if (
            Input.isMousePressed(0) &&
            !this.hoveredNode &&
            !this.hoveredConnection &&
            !this.workspaceSidebar.isMouseInside()
        ) {
            this.clearSelection();
            this.clearConnectionSelection();

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

        if (!this.hoveredNode && !this.hoveredConnection) {
            this.clearSelection();
            this.clearConnectionSelection();
            return;
        }

        if (this.hoveredConnection) {
            this.clearSelection();
            this.clearConnectionSelection();

            this.addConnectionToSelection(
                this.hoveredConnection
            );

            return;
        }

        if (Input.isKeyDown("ControlLeft")) {
            this.toggleSelection(this.hoveredNode);
            return;
        }

        if (this.selectedNodes.includes(this.hoveredNode)) {
            for (const node of this.selectedNodes) {
                this.bringToFront(node);
            }

            return;
        }


        this.clearSelection();
        this.clearConnectionSelection();

        this.addToSelection(this.hoveredNode);
        this.bringToFront(this.hoveredNode);
    }

    private updateNodeDragging() {
        const mouseWorld = this.getMouseWorld();

        if (Input.isMousePressed(0) && this.hoveredNode) {
            this.draggedNodes = [...this.selectedNodes];
            this.nodeDragStartMouse = mouseWorld.copy();
            this.dragStartPositions.clear();

            for (const node of this.draggedNodes) {
                this.bringToFront(node);
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
        this.returning = false
        this.focusing = false;
    }

    update(dt: number) {
        if (!this.visible) return;

        if (Input.isAllKeybindsPressed(Settings.Keybinds.ResetZoomAndFocus)) {
            this.focusing = true;
            this.returning = true;

            return;
        }

        if (Input.isAllKeybindsPressed(Settings.Keybinds.ResetZoom)) {
            this.focusing = true;

            return;
        }

        if (Input.isKeybindsPressed(Settings.Keybinds.FocusWorkspace)) {
            this.returning = true;

            return;
        }

        if (Input.isAllKeybindsPressed(Settings.Keybinds.CreateConnection)) {
            this.createConnection(this.selectedNodes)

            return;
        }

        if (this.returning) {
            this.camera.position = this.camera.position.lerp(new Vector2(0, 0), 10 * dt);
            if (this.camera.position.distanceTo(Vector2.zero()) < 0.1) {
                this.camera.position = Vector2.zero();
                this.returning = false;
            }
        }

        if (this.focusing) {
            this.camera.zoom = this.camera.zoom + (1 - this.camera.zoom) * 10 * dt;
            if (this.camera.zoom > 0.999 && this.camera.zoom < 1.001) {
                this.camera.zoom = 1;
                this.focusing = false;
            }
        }

        this.updateZoom();
        this.updateCamera();

        this.updateHover();
        this.updateSelection();
        this.updateNodeDragging();

        this.workspaceSidebar.update(dt, this.camera);

        const mouseScreen = this.getMouseScreen();
        if (this.workspaceSidebar.containsPoint(mouseScreen)) {
            this.workspaceSidebar.hover(true)
        } else {
            this.workspaceSidebar.hover(false)
        }
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

    drawNodes(renderer: Renderer, dt: number) {
        for (const node of this.nodes) {
            const screenPos = this.worldToScreen(node.position);

            node.draw(renderer, screenPos, this.camera.zoom, dt);
        }
    }

    drawConnections(renderer: Renderer) {
        for (const connection of this.connections) {
            connection.draw(renderer, this.camera);
        }
    }

    drawNexis(renderer: Renderer, dt: number) {
        for (const nexus of this.nexi) {
            const screenPos = this.worldToScreen(nexus.position);

            nexus.draw(renderer, screenPos, this.camera.zoom, dt);
        }
    }

    draw(renderer: Renderer, dt: number) {
        if (!this.visible) return;

        this.drawGrid(renderer);
        this.drawConnections(renderer);
        this.drawNodes(renderer, dt);
        this.drawNexis(renderer, dt);

        this.drawSelectionBox(renderer);

        const keysDown = Input.getKeysDown();

        const keysDownString = [...keysDown].join(" + ");

        this.workspaceSidebar.draw(renderer);

        renderer.text(
            keysDownString,
            new Vector2(
                -window.innerWidth / 2 + 10,
                window.innerHeight / 2 - 30
            )
        );

        //renderer.image(AssetManager.getImage("nexus"), new Vector2(0, 0), new Vector2(64, 64));
    }
}