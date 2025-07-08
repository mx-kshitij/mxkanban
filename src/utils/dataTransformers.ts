import { BoardData, Column, Card, MultiBoard } from "../types/kanban";
import { MxKanbanContainerProps } from "../../typings/MxKanbanProps";
import { Big } from "big.js";
// import { attribute, literal, equals } from "mendix/filters/builders";

const DEFAULT_SORT_ORDER = new Big(0);

/**
 * Transforms Mendix single board data to internal BoardData structure
 * Uses working arrays with item removal for optimized performance
 */
export const transformSingleBoardData = (props: MxKanbanContainerProps): BoardData => {
    const columns: Column[] = [];

    // Early return if no data
    if (!props.s_data_columns?.items?.length) {
        return { columns };
    }

    // Create working array of cards that we'll remove items from as we process them
    const remainingCards = props.s_data_cards?.items ? [...props.s_data_cards.items] : [];

    // Build columns from Mendix data
    props.s_data_columns.items.forEach((columnItem) => {
        const columnId = props.s_column_id?.get(columnItem)?.value;
        const columnSortOrder = props.s_column_sortAttr?.get(columnItem)?.value || DEFAULT_SORT_ORDER;

        if (columnId && remainingCards.length > 0) {
            const columnCards: Card[] = [];

            // Process cards in reverse order so we can safely remove items while iterating
            for (let i = remainingCards.length - 1; i >= 0; i--) {
                const cardItem = remainingCards[i];
                const cardId = props.s_card_id?.get(cardItem)?.value;
                const cardParent = props.s_card_parent?.get(cardItem)?.value;
                const cardSortOrder = props.s_card_sortAttr?.get(cardItem)?.value || DEFAULT_SORT_ORDER;

                if (cardId && cardParent === columnId) {
                    columnCards.push({
                        id: cardId,
                        content: props.s_content?.get(cardItem), // Mendix widget content
                        mendixObject: cardItem, // Store original object for updates
                        sortOrder: cardSortOrder
                    });
                    
                    // Remove processed card from remaining cards to reduce future search space
                    remainingCards.splice(i, 1);
                }
            }

            // Sort cards by sortOrder
            columnCards.sort((a, b) => (a.sortOrder || DEFAULT_SORT_ORDER).minus(b.sortOrder || DEFAULT_SORT_ORDER).toNumber());

            columns.push({
                id: columnId,
                title: columnId, // You can enhance this with proper title attribute
                cards: columnCards,
                sortOrder: columnSortOrder,
                customHeaderContent: props.s_useCustomColumnHeader ? props.s_column_content?.get(columnItem) : undefined
            });
        }
    });

    // Sort columns by sortOrder
    columns.sort((a, b) => (a.sortOrder || DEFAULT_SORT_ORDER).minus(b.sortOrder || DEFAULT_SORT_ORDER).toNumber());

    return { columns };
};

/**
 * Transforms Mendix multi board data to internal MultiBoard[] structure
 * Uses working arrays with item removal for optimized performance
 */
export const transformMultiBoardData = (props: MxKanbanContainerProps): MultiBoard[] => {
    const boards: MultiBoard[] = [];
    
    if (!props.m_data_boards?.items?.length) {
        console.error('NO BOARD ITEMS FOUND!');
        return boards;
    }
    
    // Create working arrays that we'll remove items from as we process them
    const remainingColumns = props.m_data_columns?.items ? [...props.m_data_columns.items] : [];
    const remainingCards = props.m_data_cards?.items ? [...props.m_data_cards.items] : [];
    
    props.m_data_boards.items.forEach((boardItem) => {
        const boardId = props.m_board_id?.get(boardItem)?.value;
        const boardSortOrder = props.m_board_sortAttr?.get(boardItem)?.value || DEFAULT_SORT_ORDER;

        if (boardId && props.m_column_parent && remainingColumns.length > 0) {
            const columns: Column[] = [];

            // Process columns in reverse order so we can safely remove items while iterating
            for (let i = remainingColumns.length - 1; i >= 0; i--) {
                const columnItem = remainingColumns[i];
                const columnId = props.m_column_id?.get(columnItem)?.value;
                const columnParent = props.m_column_parent?.get(columnItem)?.value;
                const columnSortOrder = props.m_column_sortAttr?.get(columnItem)?.value || DEFAULT_SORT_ORDER;

                // Only process columns that belong to this board
                if (columnId && columnParent === boardId && props.m_card_parent) {
                    const columnCards: Card[] = [];

                    // Process cards in reverse order so we can safely remove items while iterating
                    for (let j = remainingCards.length - 1; j >= 0; j--) {
                        const cardItem = remainingCards[j];
                        const cardId = props.m_card_id?.get(cardItem)?.value;
                        const cardParent = props.m_card_parent?.get(cardItem)?.value;
                        const cardSortOrder = props.m_card_sortAttr?.get(cardItem)?.value || DEFAULT_SORT_ORDER;

                        // Only add cards that belong to this column
                        if (cardId && cardParent === columnId) {
                            columnCards.push({
                                id: cardId,
                                content: props.m_content?.get(cardItem), // Mendix widget content
                                mendixObject: cardItem, // Store original object for updates
                                sortOrder: cardSortOrder
                            });
                            
                            // Remove processed card from remaining cards to reduce future search space
                            remainingCards.splice(j, 1);
                        }
                    }

                    // Sort cards by sortOrder
                    columnCards.sort((a, b) => (a.sortOrder || DEFAULT_SORT_ORDER).minus(b.sortOrder || DEFAULT_SORT_ORDER).toNumber());

                    columns.push({
                        id: columnId,
                        title: columnId, // You can enhance this with proper title attribute
                        cards: columnCards,
                        sortOrder: columnSortOrder,
                        customHeaderContent: props.m_useCustomColumnHeader ? props.m_column_content?.get(columnItem) : undefined
                    });
                    
                    // Remove processed column from remaining columns to reduce future search space
                    remainingColumns.splice(i, 1);
                }
            }

            // Sort columns by sortOrder
            columns.sort((a, b) => (a.sortOrder || DEFAULT_SORT_ORDER).minus(b.sortOrder || DEFAULT_SORT_ORDER).toNumber());

            boards.push({
                id: boardId,
                title: boardId, // You can enhance this with proper title attribute
                board: { columns },
                sortOrder: boardSortOrder,
                customHeaderContent: props.m_useCustomBoardHeader ? props.m_board_content?.get(boardItem) : undefined
            });
        } else {
            console.warn(`Skipping board ${boardId} - missing data:`, {
                hasBoardId: !!boardId,
                hasColumns: !!props.m_data_columns,
                hasColumnParent: !!props.m_column_parent
            });
        }
    });
    
    // Sort boards by sortOrder
    boards.sort((a, b) => (a.sortOrder || DEFAULT_SORT_ORDER).minus(b.sortOrder || DEFAULT_SORT_ORDER).toNumber());
    
    return boards;
};
