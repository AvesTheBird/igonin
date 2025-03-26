import Rectangle from '../geometry/Rectangle';
declare module '../Graph' {
    interface Graph {
        zoomFactor: number;
        keepSelectionVisibleOnZoom: boolean;
        centerZoom: boolean;
        zoomIn: () => void;
        zoomOut: () => void;
        zoomActual: () => void;
        zoomTo: (scale: number, center?: boolean) => void;
        zoom: (factor: number, center?: boolean) => void;
        zoomToRect: (rect: Rectangle) => void;
    }
}
