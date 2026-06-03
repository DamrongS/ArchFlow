import { DarkTheme } from "./Themes/DarkTheme";
import { LightTheme } from "./Themes/LightTheme";
import { MidnightTheme } from "./Themes/MidnightTheme";
import { BlueprintTheme } from "./Themes/BlueprintTheme";

export const Settings = {
    Theme: DarkTheme,

    Grid: {
        Size: 50,
        Visible: true,
        MajorLineFrequency: 10,
    },

    Camera: {
        MinZoom: 0.25,
        MaxZoom: 4,
        ZoomSpeed: 0.1,
    },
};