export interface Card {
    id: string;
    title: string;
    description?: string;
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
