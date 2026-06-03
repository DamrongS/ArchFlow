import { Settings } from "../core/config/Settings";

export class ThemeService {
    static applyTheme() {
        document.documentElement.style.setProperty(
            "--menu-background",
            Settings.Theme.Background
        );

        document.documentElement.style.setProperty(
            "--menu-button",
            Settings.Theme.Background
        );

        document.documentElement.style.setProperty(
            "--menu-button-hover",
            Settings.Theme.Node.HoverBackground
        );

        document.documentElement.style.setProperty(
            "--menu-text",
            Settings.Theme.Node.Text
        );

        document.documentElement.style.setProperty(
            "--menu-border",
            Settings.Theme.Background
        );

        document.documentElement.style.setProperty(
            "--menu-button-active",
            Settings.Theme.Node.Background
        );
    }
}