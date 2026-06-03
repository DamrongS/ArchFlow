import { DarkTheme } from "./Themes/DarkTheme";
import { LightTheme } from "./Themes/LightTheme";

export const Settings = {
    Theme: DarkTheme,

    Grid: {
        Size: 50,
        Visible: true,
    },

    Camera: {
        MinZoom: 0.25,
        MaxZoom: 4,
        ZoomSpeed: 0.1,
    },
};