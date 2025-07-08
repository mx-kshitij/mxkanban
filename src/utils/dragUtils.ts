import { DropResult } from "react-beautiful-dnd";
import { BoardData, Column, MultiBoard, CardDropDetails } from "../types/kanban";
import { Big } from "big.js";

const DEFAULT_SORT_ORDER = new Big(0);

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
): { updatedBoard: BoardData; dropDetails: CardDropDetails } | null => {
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
    const oldSortValue = card.sortOrder || DEFAULT_SORT_ORDER;

    // Calculate new sort value based on destination position
    let newSortValue: Big;
    const destCards = destColumn.cards;
    
    if (destination.index === 0) {
        // Moving to the beginning - use 1 less than first card, or 0 if empty
        if (destCards.length === 0) {
            newSortValue = new Big(1);
        } else {
            const firstCardSort = destCards[0].sortOrder || new Big(1);
            newSortValue = firstCardSort.gt(1) ? firstCardSort.minus(1) : new Big(0);
        }
    } else {
        // Moving to any other position - use 1 more than the card above
        const prevCard = destCards[destination.index - 1];
        const prevCardSort = prevCard ? (prevCard.sortOrder || new Big(destination.index)) : new Big(destination.index);
        newSortValue = prevCardSort.plus(1);
    }

    // Update the card with new sort value
    const updatedCard = { ...card, sortOrder: newSortValue };
    
    const dropDetails: CardDropDetails = {
        cardId: card.id,
        oldParentColumnId: source.droppableId,
        newParentColumnId: destination.droppableId,
        oldSortValue,
        newSortValue
    };

    sourceColumn.cards.splice(source.index, 1);
    destColumn.cards.splice(destination.index, 0, updatedCard);

    return { updatedBoard: newBoard, dropDetails };
};

/**
 * Handles drag and drop across multiple boards
 */
export const handleMultiBoardDrag = (
    boards: MultiBoard[],
    result: DropResult
): { updatedBoards: MultiBoard[]; dropDetails: CardDropDetails } | null => {
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
    const oldSortValue = card.sortOrder || DEFAULT_SORT_ORDER;

    // Calculate new sort value based on destination position
    let newSortValue: Big;
    const destCards = destInfo.column.cards;
    
    if (destination.index === 0) {
        // Moving to the beginning - use 1 less than first card, or 0 if empty
        if (destCards.length === 0) {
            newSortValue = new Big(1);
        } else {
            const firstCardSort = destCards[0].sortOrder || new Big(1);
            newSortValue = firstCardSort.gt(1) ? firstCardSort.minus(1) : new Big(0);
        }
    } else {
        // Moving to any other position - use 1 more than the card above
        const prevCard = destCards[destination.index - 1];
        const prevCardSort = prevCard ? (prevCard.sortOrder || new Big(destination.index)) : new Big(destination.index);
        newSortValue = prevCardSort.plus(1);
    }

    // Update the card with new sort value
    const updatedCard = { ...card, sortOrder: newSortValue };
    
    const dropDetails: CardDropDetails = {
        cardId: card.id,
        oldParentColumnId: source.droppableId,
        newParentColumnId: destination.droppableId,
        oldSortValue,
        newSortValue
    };

    // Remove card from source
    sourceInfo.column.cards.splice(source.index, 1);

    // Add card to destination
    if (source.droppableId === destination.droppableId) {
        // Same column
        sourceInfo.column.cards.splice(destination.index, 0, updatedCard);
    } else {
        // Different column
        destInfo.column.cards.splice(destination.index, 0, updatedCard);
    }

    return { updatedBoards: newBoards, dropDetails };
};

/**
 * Generates a unique ID for cards and columns
 */
export const generateUniqueId = (prefix: string = ""): string => {
    return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
