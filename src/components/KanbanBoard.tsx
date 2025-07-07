import { ReactElement, createElement, useMemo } from "react";
import { useKanbanBoard } from "../hooks/useKanbanBoard";
import { Board } from "./shared";
import "../ui/KanbanBoard.css";
import { MxKanbanContainerProps } from "typings/MxKanbanProps";
import { transformSingleBoardData } from "../utils/dataTransformers";

export function KanbanBoard(props: MxKanbanContainerProps): ReactElement {
    // Transform Mendix data to internal structure
    const boardData = useMemo(() => {
        return transformSingleBoardData(props);
    }, [props.s_data_columns, props.s_data_cards, props.s_column_id, props.s_card_id, props.s_card_parent, props.s_content]);

    const { board, onDragEnd } = useKanbanBoard(boardData, props.onCardDrop);

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
