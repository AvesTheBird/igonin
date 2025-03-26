import Cell from '../cell/Cell';
import CellState from '../cell/CellState';
import Multiplicity from '../other/Multiplicity';
declare module '../Graph' {
    interface Graph {
        multiplicities: Multiplicity[];
        validationAlert: (message: string) => void;
        isEdgeValid: (edge: Cell | null, source: Cell, target: Cell) => boolean;
        getEdgeValidationError: (edge: Cell | null, source: Cell | null, target: Cell | null) => string | null;
        validateEdge: (edge: Cell, source: Cell, target: Cell) => string | null;
        validateGraph: (cell?: Cell | null, context?: any) => string | null;
        getCellValidationError: (cell: Cell) => string | null;
        validateCell: (cell: Cell, context: CellState) => string | null;
    }
}
