import { useEffect, useRef, useState } from "react";
import { Engine } from "./Engine";
import { ThemeService } from "../services/ThemeService";
import { AssetManager } from "./AssetManager";

function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [engine, setEngine] = useState<Engine | null>(null);

    useEffect(() => {
        async function initialize() {
            const canvas = canvasRef.current;

            if (!canvas) {
                return;
            }

            await AssetManager.loadImage(
                "nexus",
                "/assets/nexus.png"
            );

            ThemeService.applyTheme();

            const newEngine = new Engine(canvas);
            newEngine.start();

            setEngine(newEngine);
        }

        initialize();
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