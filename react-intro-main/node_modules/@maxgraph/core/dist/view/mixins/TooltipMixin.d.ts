import CellState from '../cell/CellState';
import Cell from '../cell/Cell';
declare module '../Graph' {
    interface Graph {
        getTooltip: (state: CellState, node: HTMLElement | SVGElement, x: number, y: number) => HTMLElement | string | null;
        getTooltipForCell: (cell: Cell) => HTMLElement | string;
        setTooltips: (enabled: boolean) => void;
    }
}
