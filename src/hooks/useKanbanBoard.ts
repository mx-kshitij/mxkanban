import { useState, useCallback } from "react";
import { DropResult } from "react-beautiful-dnd";
import { BoardData, MultiBoard } from "../types/kanban";
import { handleSingleBoardDrag, handleMultiBoardDrag } from "../utils/dragUtils";
import { ActionValue } from "mendix";

export const useKanbanBoard = (initialBoard: BoardData, onCardDrop?: ActionValue) => {
    const [board, setBoard] = useState<BoardData>(initialBoard);

    const onDragEnd = useCallback((result: DropResult) => {
        const updatedBoard = handleSingleBoardDrag(board, result);
        if (updatedBoard) {
            setBoard(updatedBoard);
            // Execute Mendix action after successful drag
            if (onCardDrop && onCardDrop.canExecute) {
                onCardDrop.execute();
            }
        }
    }, [board, onCardDrop]);

    return {
        board,
        onDragEnd,
        setBoard
    };
};

export const useMultiKanbanBoard = (initialBoards: MultiBoard[]) => {
    const [boards, setBoards] = useState<MultiBoard[]>(initialBoards);

    const onDragEnd = useCallback((result: DropResult) => {
        const updatedBoards = handleMultiBoardDrag(boards, result);
        if (updatedBoards) {
            setBoards(updatedBoards);
        }
    }, [boards]);

    return {
        boards,
        onDragEnd,
        setBoards
    };
};
