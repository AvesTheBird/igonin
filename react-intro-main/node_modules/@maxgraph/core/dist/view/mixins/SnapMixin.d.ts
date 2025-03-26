import Point from '../geometry/Point';
import Rectangle from '../geometry/Rectangle';
declare module '../Graph' {
    interface Graph {
        snapTolerance: number;
        gridSize: number;
        gridEnabled: boolean;
        getSnapTolerance: () => number;
        snap: (value: number) => number;
        snapDelta: (delta: Point, bounds: Rectangle, ignoreGrid: boolean, ignoreHorizontal: boolean, ignoreVertical: boolean) => Point;
        isGridEnabled: () => boolean;
        setGridEnabled: (value: boolean) => void;
        getGridSize: () => number;
        setGridSize: (value: number) => void;
    }
}
