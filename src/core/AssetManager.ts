export class AssetManager {
    private static images = new Map<string, HTMLImageElement>();

    static async loadImage(
        id: string,
        path: string
    ): Promise<void> {
        if (this.images.has(id)) {
            return;
        }

        const image = new Image();

        await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();

            image.onerror = () => {
                reject(new Error(`Failed to load image: ${path}`));
            };

            image.src = path;
        });

        this.images.set(id, image);
    }

    static getImage(id: string): HTMLImageElement {
        const image = this.images.get(id);

        if (!image) {
            throw new Error(`Missing image: ${id}`);
        }

        return image;
    }
}