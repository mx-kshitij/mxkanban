import { ReactElement, createElement, useMemo } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useMultiKanbanBoard } from "../hooks/useKanbanBoard";
import { Board } from "./shared";
import "../ui/KanbanBoard.css";
import { MxKanbanContainerProps } from "typings/MxKanbanProps";
import { transformMultiBoardData } from "../utils/dataTransformers";

export function MultiBoardKanban(props: MxKanbanContainerProps): ReactElement {
    
    // Transform Mendix data to internal structure
    const boardsData = useMemo(() => {
        const result = transformMultiBoardData(props);
        console.debug('transformMultiBoardData result:', result);
        return result;
    }, [props.m_data_boards, props.m_data_columns, props.m_data_cards, props.m_board_id, props.m_column_id, props.m_column_parent, props.m_card_id, props.m_card_parent, props.m_content]);

    const { boards, onDragEnd } = useMultiKanbanBoard(boardsData);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={`multi-kanban-boards ${props.class || ""}`} tabIndex={props.tabIndex}>
                {boards.map((multiBoard) => (
                    <Board
                        key={multiBoard.id}
                        board={multiBoard.board}
                        title={multiBoard.title}
                        wrapWithDragContext={false}
                    />
                ))}
            </div>
        </DragDropContext>
    );
}
