import { useEffect, useRef, useState } from "react";
import { Engine } from "./Engine";
import { ThemeService } from "../services/ThemeService";

function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [openMenu, setOpenMenu] = useState<string | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        ThemeService.applyTheme();

        const engine = new Engine(canvas);

        engine.start();
    }, []);

    return (
        <div id="app">

            <div id="menu-bar">

                <div className="menu">

                    <button
                        onClick={() => setOpenMenu(
                            openMenu === "file"
                                ? null
                                : "file"
                        )}
                    >
                        File
                    </button>

                    {openMenu === "file" && (
                        <div className="dropdown" >
                            <button>
                                Workspaces
                            </button>

                            <button>
                                Save
                            </button>

                        </div>
                    )}

                </div>

            </div>

            <canvas
                id="canvas"
                onClick={() => setOpenMenu(null)}
                ref={canvasRef}
            />

        </div>
    );
}

export default App;