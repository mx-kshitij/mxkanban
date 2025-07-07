import { useState, useCallback } from "react";
import { DropResult } from "react-beautiful-dnd";
import { BoardData, Card, MultiBoard } from "../types/kanban";
import { handleSingleBoardDrag, handleMultiBoardDrag, generateUniqueId } from "../utils/dragUtils";

export const useKanbanBoard = (initialBoard: BoardData) => {
    const [board, setBoard] = useState<BoardData>(initialBoard);

    const onDragEnd = useCallback((result: DropResult) => {
        const updatedBoard = handleSingleBoardDrag(board, result);
        if (updatedBoard) {
            setBoard(updatedBoard);
        }
    }, [board]);

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

    const addCard = useCallback((boardId: string, columnId: string) => {
        const title = prompt("Enter card title:");
        if (!title) return;

        const description = prompt("Enter card description (optional):") || "";
        
        const newBoards = [...boards];
        const board = newBoards.find(b => b.id === boardId);
        const column = board?.board.columns.find(c => c.id === columnId);
        
        if (column) {
            const newCard: Card = {
                id: generateUniqueId("card-"),
                title,
                description
            };
            column.cards.push(newCard);
            setBoards(newBoards);
        }
    }, [boards]);

    const removeCard = useCallback((boardId: string, columnId: string, cardId: string) => {
        const newBoards = [...boards];
        const board = newBoards.find(b => b.id === boardId);
        const column = board?.board.columns.find(c => c.id === columnId);
        
        if (column) {
            column.cards = column.cards.filter(c => c.id !== cardId);
            setBoards(newBoards);
        }
    }, [boards]);

    return {
        boards,
        onDragEnd,
        addCard,
        removeCard,
        setBoards
    };
};
