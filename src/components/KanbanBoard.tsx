import { ReactElement, createElement, useMemo, memo, useRef } from "react";
import { useKanbanBoard } from "../hooks/useKanbanBoard";
import { Board } from "./shared";
import "../ui/KanbanBoard.css";
import { MxKanbanContainerProps } from "typings/MxKanbanProps";
import { transformSingleBoardData } from "../utils/dataTransformers";
import { CardDropDetails, BoardData } from "../types/kanban";

function KanbanBoardComponent(props: MxKanbanContainerProps): ReactElement {
    // Store initial board data
    const initialBoardRef = useRef(transformSingleBoardData(props));
    const isInitialMount = useRef(true);
    
    // Only update initial data on mount or when explicitly needed for rollback
    const boardData = useMemo(() => {
        // On initial mount, always use the fresh data
        if (isInitialMount.current) {
            isInitialMount.current = false;
            const freshData = transformSingleBoardData(props);
            initialBoardRef.current = freshData;
            return freshData;
        }
        
        // Update initial data only on failure for rollback
        if (props.changeSuccess?.value === false) {
            const freshData = transformSingleBoardData(props);
            initialBoardRef.current = freshData;
            return freshData;
        }
        
        // Otherwise, use the stored initial data (prevents snap-back on successful operations)
        return initialBoardRef.current;
    }, [props.changeSuccess?.value]); // Only depend on changeSuccess, not the data props

    // Handle card drop details
    const handleDropDetails = (details: CardDropDetails, updatedBoard: BoardData) => {
        try {
            const dropDetailsJson = {
                cardId: details.cardId,
                oldParentColumnId: details.oldParentColumnId,
                newParentColumnId: details.newParentColumnId,
                oldSortValue: details.oldSortValue.toNumber(),
                newSortValue: details.newSortValue.toNumber(),
                timestamp: new Date().toISOString()
            };
            
            // Set the JSON value to the changeJSON prop
            if (props.changeJSON) {
                props.changeJSON.setValue(JSON.stringify(dropDetailsJson));
            }

            // Create newCardOrderJSON for the destination column using the UPDATED board state
            const destinationColumn = updatedBoard.columns.find(col => col.id === details.newParentColumnId);
            if (destinationColumn && props.newCardOrderJSON) {
                const cardOrderArray = destinationColumn.cards.map((card, index) => ({
                    cardId: card.id,
                    order: index
                }));
                
                props.newCardOrderJSON.setValue(JSON.stringify(cardOrderArray));
            }

            // Execute onChangeEvent action if available
            if (props.onChangeEvent && props.onChangeEvent.canExecute) {
                props.onChangeEvent.execute();
            } else if (props.onChangeEvent) {
                console.warn('Single Board - onChangeEvent action cannot be executed (canExecute is false)');
            }
        } catch (error) {
            console.error('Error handling drop details:', error);
            // Re-throw error so the hook can handle rollback
            throw error;
        }
    };

    const { board, onDragEnd } = useKanbanBoard(boardData, handleDropDetails, props.changeSuccess);

    return (
        <div className={props.class || ""} tabIndex={props.tabIndex}>
            <Board
                board={board}
                onDragEnd={onDragEnd}
                wrapWithDragContext={true}
            />
        </div>
    );
}

// Memoize the component to prevent unnecessary re-renders
export const KanbanBoard = memo(KanbanBoardComponent, (prevProps, nextProps) => {
    // Only re-render if essential props changed
    const essentialPropsChanged = (
        prevProps.s_data_columns !== nextProps.s_data_columns ||
        prevProps.s_data_cards !== nextProps.s_data_cards ||
        prevProps.s_column_id !== nextProps.s_column_id ||
        prevProps.s_card_id !== nextProps.s_card_id ||
        prevProps.s_card_parent !== nextProps.s_card_parent ||
        prevProps.s_content !== nextProps.s_content ||
        prevProps.s_column_sortAttr !== nextProps.s_column_sortAttr ||
        prevProps.s_card_sortAttr !== nextProps.s_card_sortAttr ||
        prevProps.changeSuccess?.value !== nextProps.changeSuccess?.value ||
        prevProps.class !== nextProps.class ||
        prevProps.tabIndex !== nextProps.tabIndex
    );
    
    // Return true if props are equal (don't re-render), false if they changed (re-render)
    return !essentialPropsChanged;
});
