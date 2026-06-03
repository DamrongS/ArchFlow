export const BlueprintTheme = {
    Background: "#002082",

    Grid: {
        Minor: "#3057E1",
        Major: "#768cd6",
    },

    Node: {
        Background: "#3057E1",
        Border: "#CED8F7",
        Text: "#CED8F7",
    },

    Selection: {
        Border: "#CED8F7",
        Fill: "#CED8F722",
        Callback: function(selectedNode: unknown) {
            console.log("Blueprint theme node selected:", selectedNode);
        }
    },

    Accent: {
        Primary: "#CED8F7",
        Secondary: "#4A6DE5",
    },
};