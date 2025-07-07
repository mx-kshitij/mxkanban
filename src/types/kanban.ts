export interface Card {
    id: string;
    content?: any; // Mendix widget content
    mendixObject?: any; // Original Mendix object
}

export interface Column {
    id: string;
    title: string;
    cards: Card[];
}

export interface BoardData {
    columns: Column[];
}

export interface MultiBoard {
    id: string;
    title: string;
    board: BoardData;
}

export interface KanbanBoardProps {
    className?: string;
    tabIndex?: number;
}
