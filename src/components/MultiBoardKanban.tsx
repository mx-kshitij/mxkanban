import { ReactElement, createElement, useMemo, memo, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useMultiKanbanBoard } from "../hooks/useKanbanBoard";
import { Board } from "./shared";
import "../ui/KanbanBoard.css";
import { MxKanbanContainerProps } from "typings/MxKanbanProps";
import { transformMultiBoardData } from "../utils/dataTransformers";
import { CardDropDetails, MultiBoard } from "src/types/kanban";

function MultiBoardKanbanComponent(props: MxKanbanContainerProps): ReactElement {
    // Store initial boards data
    const initialBoardsRef = useRef(transformMultiBoardData(props));
    const isInitialMount = useRef(true);
    
    // Only update initial data on mount or when explicitly needed for rollback
    const boardsData = useMemo(() => {
        // On initial mount, always use the fresh data
        if (isInitialMount.current) {
            isInitialMount.current = false;
            const freshData = transformMultiBoardData(props);
            initialBoardsRef.current = freshData;
            return freshData;
        }
        
        // Update initial data only on failure for rollback
        if (props.changeSuccess?.value === false) {
            const freshData = transformMultiBoardData(props);
            initialBoardsRef.current = freshData;
            return freshData;
        }
        
        // Otherwise, use the stored initial data (prevents snap-back on successful operations)
        return initialBoardsRef.current;
    }, [props.changeSuccess?.value]); // Only depend on changeSuccess, not the data props

    // Handle card drop details
    const handleDropDetails = (details: CardDropDetails, updatedBoards: MultiBoard[]) => {
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

            // Create newCardOrderJSON for the destination column using the UPDATED boards state
            let destinationColumn = null;
            for (const multiBoard of updatedBoards) {
                const column = multiBoard.board.columns.find(col => col.id === details.newParentColumnId);
                if (column) {
                    destinationColumn = column;
                    break;
                }
            }
            
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
                console.warn('Multi Board - onChangeEvent action cannot be executed (canExecute is false)');
            }
        } catch (error) {
            console.error('Error handling drop details:', error);
            // Re-throw error so the hook can handle rollback
            throw error;
        }
    };

    const { boards, onDragEnd } = useMultiKanbanBoard(boardsData, handleDropDetails, props.changeSuccess);
    
    // Create a unique key that changes when boards change to force re-render
    const dragContextKey = useMemo(() => {
        return JSON.stringify(boards.map(b => b.board.columns.map(c => c.cards.map(card => card.id))));
    }, [boards]);

    return (
        <DragDropContext key={dragContextKey} onDragEnd={onDragEnd}>
            <div className={`multi-kanban-boards ${props.class || ""}`} tabIndex={props.tabIndex}>
                {boards.map((multiBoard) => (
                    <Board
                        key={multiBoard.id}
                        board={multiBoard.board}
                        title={multiBoard.title}
                        customHeaderContent={multiBoard.customHeaderContent}
                        wrapWithDragContext={false}
                        collapsible={true}
                    />
                ))}
            </div>
        </DragDropContext>
    );
}

// Memoize the component to prevent unnecessary re-renders
export const MultiBoardKanban = memo(MultiBoardKanbanComponent, (prevProps, nextProps) => {
    // Only re-render if essential props changed
    const essentialPropsChanged = (
        prevProps.m_data_boards !== nextProps.m_data_boards ||
        prevProps.m_data_columns !== nextProps.m_data_columns ||
        prevProps.m_data_cards !== nextProps.m_data_cards ||
        prevProps.m_board_id !== nextProps.m_board_id ||
        prevProps.m_column_id !== nextProps.m_column_id ||
        prevProps.m_column_parent !== nextProps.m_column_parent ||
        prevProps.m_card_id !== nextProps.m_card_id ||
        prevProps.m_card_parent !== nextProps.m_card_parent ||
        prevProps.m_content !== nextProps.m_content ||
        prevProps.m_board_sortAttr !== nextProps.m_board_sortAttr ||
        prevProps.m_column_sortAttr !== nextProps.m_column_sortAttr ||
        prevProps.m_card_sortAttr !== nextProps.m_card_sortAttr ||
        prevProps.changeSuccess?.value !== nextProps.changeSuccess?.value ||
        prevProps.class !== nextProps.class ||
        prevProps.tabIndex !== nextProps.tabIndex
    );
    
    // Return true if props are equal (don't re-render), false if they changed (re-render)
    return !essentialPropsChanged;
});
