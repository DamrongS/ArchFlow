export const MidnightTheme = {
    Background: "#0f1220",

    Grid: {
        Minor: "#1b2038",
        Major: "#2a3157",
    },

    Node: {
        Background: "#181d33",
        Border: "#4d5aa6",
        Text: "#e8ecff",
    },

    Selection: {
        Border: "#7c8cff",
        Fill: "#7c8cff22",
        Callback: function(selectedNode: unknown) {
            console.log("Midnight theme node selected:", selectedNode);
        }
    },

    Accent: {
        Primary: "#7c8cff",
        Secondary: "#4d5aa6",
    },
};