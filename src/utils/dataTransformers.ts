import { BoardData, Column, Card, MultiBoard } from "../types/kanban";
import { MxKanbanContainerProps } from "../../typings/MxKanbanProps";
// import { attribute, literal, equals } from "mendix/filters/builders";

/**
 * Transforms Mendix single board data to internal BoardData structure
 * Uses manual filtering to match cards to their parent columns
 */
export const transformSingleBoardData = (props: MxKanbanContainerProps): BoardData => {
    const columns: Column[] = [];

    // Build columns from Mendix data
    props.s_data_columns?.items?.forEach((columnItem) => {
        const columnId = props.s_column_id?.get(columnItem)?.value;

        if (columnId && props.s_data_cards?.items) {
            const columnCards: Card[] = [];

            // if (props.s_card_parent !== null && props?.s_card_parent?.filterable) {
            //     const cardFilter = equals(attribute(props.s_card_parent.id), literal(columnId));
            //     props.s_data_cards.setFilter(cardFilter);
            // }

            // Manually filter cards that belong to this column
            props.s_data_cards.items.forEach((cardItem) => {
                const cardId = props.s_card_id?.get(cardItem)?.value;
                const cardParent = props.s_card_parent?.get(cardItem)?.value;

                if (cardId && cardParent === columnId) {
                    columnCards.push({
                        id: cardId,
                        content: props.s_content?.get(cardItem), // Mendix widget content
                        mendixObject: cardItem // Store original object for updates
                    });
                }
            });

            columns.push({
                id: columnId,
                title: columnId, // You can enhance this with proper title attribute
                cards: columnCards
            });
        }
    });

    return { columns };
};

/**
 * Transforms Mendix multi board data to internal MultiBoard[] structure
 * Uses manual filtering to match columns to boards and cards to columns
 */
export const transformMultiBoardData = (props: MxKanbanContainerProps): MultiBoard[] => {
    const boards: MultiBoard[] = [];
    
    if (!props.m_data_boards?.items) {
        console.error('NO BOARD ITEMS FOUND!');
        return boards;
    }
    
    props.m_data_boards.items.forEach((boardItem) => {
        const boardId = props.m_board_id?.get(boardItem)?.value;

        if (boardId && props.m_data_columns && props.m_column_parent) {
            const columns: Column[] = [];

            // Filter columns that belong to this board using setFilter (if filterable)
            // Commented out to prevent excessive re-renders
            // if (props.m_column_parent !== null && props?.m_column_parent?.filterable) {
            //     const columnFilter = equals(attribute(props.m_column_parent.id), literal(boardId));
            //     props.m_data_columns.setFilter(columnFilter);
            // }
            
            props.m_data_columns.items?.forEach((columnItem) => {
                const columnId = props.m_column_id?.get(columnItem)?.value;
                const columnParent = props.m_column_parent?.get(columnItem)?.value;

                // Only process columns that belong to this board
                if (columnId && columnParent === boardId && props.m_data_cards && props.m_card_parent) {
                    const columnCards: Card[] = [];

                    // Filter cards that belong to this column using setFilter (if filterable)
                    // Commented out to prevent excessive re-renders
                    // if (props.m_card_parent !== null && props.m_card_parent?.filterable) {
                    //     const cardFilter = equals(attribute(props.m_card_parent.id), literal(columnId));
                    //     props.m_data_cards.setFilter(cardFilter);
                    // }

                    props.m_data_cards.items?.forEach((cardItem) => {
                        const cardId = props.m_card_id?.get(cardItem)?.value;
                        const cardParent = props.m_card_parent?.get(cardItem)?.value;

                        // Only add cards that belong to this column
                        if (cardId && cardParent === columnId) {
                            columnCards.push({
                                id: cardId,
                                content: props.m_content?.get(cardItem), // Mendix widget content
                                mendixObject: cardItem // Store original object for updates
                            });
                        }
                    });

                    columns.push({
                        id: columnId,
                        title: columnId, // You can enhance this with proper title attribute
                        cards: columnCards
                    });
                }
            });

            boards.push({
                id: boardId,
                title: boardId, // You can enhance this with proper title attribute
                board: { columns }
            });
        } else {
            console.warn(`Skipping board ${boardId} - missing data:`, {
                hasBoardId: !!boardId,
                hasColumns: !!props.m_data_columns,
                hasColumnParent: !!props.m_column_parent
            });
        }
    });
    return boards;
};
