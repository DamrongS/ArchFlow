export const LightTheme = {
    Background: "#ffffff",

    Grid: {
        Minor: "#cccccc",
        Major: "#999999",
    },

    Node: {
        Background: "#ffffff",
        Border: "#3f3f46",
        Text: "#252526",
        HoverBackground: "#0a0c16",
        HoverBorder: "rgb(193, 198, 255)",
        SelectedBackground: "#1e2543",
        SelectedBorder: "#7181dc",
    },

    Selection: {
        Border: "#4f9fff",
        Fill: "#4f9fff22",
        Callback: function(selectedNode: unknown) {
            console.log("Light theme node selected:", selectedNode);
        }
    },

    Connection: {
    Line: "#000000",
    Selected: "#3094ff",
    Hovered: "#a7ccff"
},

};