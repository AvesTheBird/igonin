import Cell from '../cell/Cell';
import CellOverlay from '../cell/CellOverlay';
import Image from '../image/ImageBox';
declare module '../Graph' {
    interface Graph {
        addCellOverlay: (cell: Cell, overlay: CellOverlay) => CellOverlay;
        getCellOverlays: (cell: Cell) => CellOverlay[];
        removeCellOverlay: (cell: Cell, overlay: CellOverlay | null) => CellOverlay | null;
        removeCellOverlays: (cell: Cell) => CellOverlay[];
        clearCellOverlays: (cell: Cell | null) => void;
        setCellWarning: (cell: Cell, warning: string | null, img?: Image, isSelect?: boolean) => CellOverlay | null;
    }
}
