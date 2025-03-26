declare module '../Graph' {
    interface Graph {
        horizontalPageBreaks: any[] | null;
        verticalPageBreaks: any[] | null;
        updatePageBreaks: (visible: boolean, width: number, height: number) => void;
    }
}
export {};
