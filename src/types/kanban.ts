import { Big } from "big.js";

export interface Card {
    id: string;
    content?: any; // Mendix widget content
    mendixObject?: any; // Original Mendix object
    sortOrder?: Big; // Sort order from Mendix
}

export interface Column {
    id: string;
    title: string;
    cards: Card[];
    sortOrder?: Big; // Sort order from Mendix
    customHeaderContent?: any; // Custom header content for column
}

export interface BoardData {
    columns: Column[];
}

export interface MultiBoard {
    id: string;
    title: string;
    board: BoardData;
    sortOrder?: Big; // Sort order from Mendix
    customHeaderContent?: any; // Custom header content for board
}

export interface KanbanBoardProps {
    className?: string;
    tabIndex?: number;
}

export interface CardDropDetails {
    cardId: string;
    oldParentColumnId: string;
    newParentColumnId: string;
    newSortValue: Big; // Actual sort attribute value from Mendix
    oldSortValue: Big; // Actual sort attribute value from Mendix
}
