import { DropResult } from "react-beautiful-dnd";
import { BoardData, Column, MultiBoard } from "../types/kanban";

/**
 * Finds a column within a board by its ID
 */
export const findColumnInBoard = (board: BoardData, columnId: string): Column | undefined => {
    return board.columns.find(col => col.id === columnId);
};

/**
 * Finds a column across multiple boards and returns board and column info
 */
export const findColumnInBoards = (
    boards: MultiBoard[], 
    columnId: string
): { boardIndex: number; columnIndex: number; column: Column } | null => {
    for (let boardIndex = 0; boardIndex < boards.length; boardIndex++) {
        const board = boards[boardIndex];
        for (let columnIndex = 0; columnIndex < board.board.columns.length; columnIndex++) {
            const column = board.board.columns[columnIndex];
            if (column.id === columnId) {
                return { boardIndex, columnIndex, column };
            }
        }
    }
    return null;
};

/**
 * Handles drag and drop within a single board
 */
export const handleSingleBoardDrag = (
    board: BoardData,
    result: DropResult
): BoardData | null => {
    const { source, destination } = result;

    if (!destination) return null;

    if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
    ) {
        return null;
    }

    const newBoard = { ...board };
    const sourceColumn = findColumnInBoard(newBoard, source.droppableId);
    const destColumn = findColumnInBoard(newBoard, destination.droppableId);

    if (!sourceColumn || !destColumn) return null;

    const card = sourceColumn.cards[source.index];
    sourceColumn.cards.splice(source.index, 1);
    destColumn.cards.splice(destination.index, 0, card);

    return newBoard;
};

/**
 * Handles drag and drop across multiple boards
 */
export const handleMultiBoardDrag = (
    boards: MultiBoard[],
    result: DropResult
): MultiBoard[] | null => {
    const { source, destination } = result;

    if (!destination) return null;

    if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
    ) {
        return null;
    }

    const sourceInfo = findColumnInBoards(boards, source.droppableId);
    const destInfo = findColumnInBoards(boards, destination.droppableId);

    if (!sourceInfo || !destInfo) return null;

    const newBoards = [...boards];
    const card = sourceInfo.column.cards[source.index];

    // Remove card from source
    sourceInfo.column.cards.splice(source.index, 1);

    // Add card to destination
    if (source.droppableId === destination.droppableId) {
        // Same column
        sourceInfo.column.cards.splice(destination.index, 0, card);
    } else {
        // Different column
        destInfo.column.cards.splice(destination.index, 0, card);
    }

    return newBoards;
};

/**
 * Generates a unique ID for cards and columns
 */
export const generateUniqueId = (prefix: string = ""): string => {
    return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
