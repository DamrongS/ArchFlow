export const DarkTheme = {
    Background: "#1e1e1e",

    Grid: {
        Minor: "#2a2a2a",
        Major: "#3a3a3a",
    },

    Node: {
        Background: "#252526",
        Border: "#ffffff",
        Text: "#ffffff",
        HoverBackground: "#333333",
        HoverBorder: "#c1e8ff",
        SelectedBackground: "#252526",
        SelectedBorder: "#4f9fff",
    },

    Selection: {
        Border: "#4f9fff",
        Fill: "#4f9fff22",
        Callback: function(selectedNode: unknown) {
            console.log("Dark theme node selected:", selectedNode);
        }
    },
};