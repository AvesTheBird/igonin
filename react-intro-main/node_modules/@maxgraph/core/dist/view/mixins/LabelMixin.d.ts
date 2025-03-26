import Cell from '../cell/Cell';
declare module '../Graph' {
    interface Graph {
        labelsVisible: boolean;
        htmlLabels: boolean;
        getLabel: (cell: Cell) => string | null;
        isHtmlLabel: (cell: Cell) => boolean;
        isLabelsVisible: () => boolean;
        isHtmlLabels: () => boolean;
        setHtmlLabels: (value: boolean) => void;
        isWrapping: (cell: Cell) => boolean;
        isLabelClipped: (cell: Cell) => boolean;
        isLabelMovable: (cell: Cell) => boolean;
    }
}
