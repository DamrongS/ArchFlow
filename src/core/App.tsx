import { useEffect, useRef } from "react";
import { Engine } from "./Engine";

function App() {
    const canvasRef =useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const engine =new Engine(canvas);
        engine.start();
        
    }, []);

    return (
        <canvas
            ref={canvasRef}
        />
    );
}

export default App;