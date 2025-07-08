import { useState, useCallback, useEffect } from "react";
import { DropResult } from "react-beautiful-dnd";
import { BoardData, MultiBoard, CardDropDetails } from "../types/kanban";
import { handleSingleBoardDrag, handleMultiBoardDrag } from "../utils/dragUtils";

export const useKanbanBoard = (
    initialBoard: BoardData, 
    onDropDetails?: (details: CardDropDetails, updatedBoard: BoardData) => void,
    changeSuccess?: { value?: boolean; setValue: (value: boolean) => void }
) => {
    const [board, setBoard] = useState<BoardData>(initialBoard);

    // Only sync on initial mount - don't auto-sync on prop changes to prevent snap-back
    useEffect(() => {
        setBoard(initialBoard);
    }, []); // Empty deps = only runs on mount

    // Track changeSuccess and re-render widget on failure
    useEffect(() => {
        if (changeSuccess?.value === false) {
            
            // Re-render widget from current Mendix data (this will restore the original state)
            setBoard(initialBoard);
            
            // Reset the success flag
            changeSuccess.setValue(true);
        }
    }, [changeSuccess?.value, changeSuccess, initialBoard]);

    const onDragEnd = useCallback((result: DropResult) => {
        const dragResult = handleSingleBoardDrag(board, result);
        if (!dragResult) return;
        
        const { updatedBoard, dropDetails } = dragResult;
        
        // Optimistically update the UI
        setBoard(updatedBoard);
        
        // Call the drop details callback if provided
        if (onDropDetails) {
            try {
                onDropDetails(dropDetails, updatedBoard);
            } catch (error) {
                console.error('Error in drop handler:', error);
                // The external action will handle success/failure via changeSuccess prop
            }
        }
    }, [board, onDropDetails]);

    // Function to force refresh from external data (when needed)
    const forceRefresh = useCallback(() => {
        setBoard(initialBoard);
    }, [initialBoard]);

    return {
        board,
        onDragEnd,
        setBoard,
        forceRefresh
    };
};

export const useMultiKanbanBoard = (
    initialBoards: MultiBoard[],
    onDropDetails?: (details: CardDropDetails, updatedBoards: MultiBoard[]) => void,
    changeSuccess?: { value?: boolean; setValue: (value: boolean) => void }
) => {
    const [boards, setBoards] = useState<MultiBoard[]>(initialBoards);

    // Only sync on initial mount - don't auto-sync on prop changes to prevent snap-back
    useEffect(() => {
        setBoards(initialBoards);
    }, []); // Empty deps = only runs on mount

    // Track changeSuccess and re-render widget on failure
    useEffect(() => {
        if (changeSuccess?.value === false) {
            
            // Re-render widget from current Mendix data (this will restore the original state)
            setBoards(initialBoards);
            
            // Reset the success flag
            changeSuccess.setValue(true);
        }
    }, [changeSuccess?.value, changeSuccess, initialBoards]);
    
    const onDragEnd = useCallback((result: DropResult) => {
        const dragResult = handleMultiBoardDrag(boards, result);
        if (!dragResult) return;
        
        const { updatedBoards, dropDetails } = dragResult;
        
        // Optimistically update the UI
        setBoards(updatedBoards);
        
        // Call the drop details callback if provided
        if (onDropDetails) {
            try {
                onDropDetails(dropDetails, updatedBoards);
            } catch (error) {
                console.error('Error in drop handler:', error);
                // The external action will handle success/failure via changeSuccess prop
            }
        }
    }, [boards, onDropDetails]);

    // Function to force refresh from external data (when needed)
    const forceRefresh = useCallback(() => {
        setBoards(initialBoards);
    }, [initialBoards]);

    return {
        boards,
        onDragEnd,
        setBoards,
        forceRefresh
    };
};
