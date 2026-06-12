export const MidnightTheme = {
    Background: "#080b16",

    Grid: {
        Minor: "#12182b",
        Major: "#1d2745",
    },

    Node: {
        Background: "#11172b",
        Border: "#39477f",
        Text: "#e6ebff",

        HoverBackground: "#18203a",
        HoverBorder: "#9ba8ff",

        SelectedBackground: "#202b4d",
        SelectedBorder: "#b5beff",
    },

    Selection: {
        Border: "#8fa0ff",
        Fill: "#8fa0ff22",

        Callback: function (selectedNode: unknown) {
            console.log(
                "Midnight theme node selected:",
                selectedNode
            );
        }
    },

    Accent: {
        Primary: "#8fa0ff",
        Secondary: "#5668c9",
    },

    Connection: {
        Line: "#6f7fcf",
        Hovered: "#b5beff",
        Selected: "#d4dbff"
    },
};