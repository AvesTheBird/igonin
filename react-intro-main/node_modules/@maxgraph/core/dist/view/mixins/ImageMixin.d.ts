import ImageBundle from '../image/ImageBundle';
declare module '../Graph' {
    interface Graph {
        imageBundles: ImageBundle[];
        addImageBundle: (bundle: ImageBundle) => void;
        removeImageBundle: (bundle: ImageBundle) => void;
        getImageFromBundles: (key: string) => string | null;
    }
}
