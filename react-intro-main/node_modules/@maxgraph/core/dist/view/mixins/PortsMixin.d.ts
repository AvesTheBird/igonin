import Cell from '../cell/Cell';
declare module '../Graph' {
    interface Graph {
        portsEnabled: boolean;
        isPort: (cell: Cell | null) => boolean;
        getTerminalForPort: (cell: Cell, source: boolean) => Cell | null;
        isPortsEnabled: () => boolean;
        setPortsEnabled: (value: boolean) => void;
    }
}
