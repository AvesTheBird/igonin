import Cell from '../cell/Cell';
import Rectangle from '../geometry/Rectangle';
declare module '../Graph' {
    interface Graph {
        shiftPreview1: HTMLElement | null;
        shiftPreview2: HTMLElement | null;
        useScrollbarsForPanning: boolean;
        timerAutoScroll: boolean;
        allowAutoPanning: boolean;
        panDx: number;
        panDy: number;
        isUseScrollbarsForPanning: () => boolean;
        isTimerAutoScroll: () => boolean;
        isAllowAutoPanning: () => boolean;
        getPanDx: () => number;
        setPanDx: (dx: number) => void;
        getPanDy: () => number;
        setPanDy: (dy: number) => void;
        panGraph: (dx: number, dy: number) => void;
        scrollCellToVisible: (cell: Cell, center?: boolean) => void;
        scrollRectToVisible: (rect: Rectangle) => boolean;
        setPanning: (enabled: boolean) => void;
    }
}
