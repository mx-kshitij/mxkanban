import { ReactElement, createElement } from "react";
import { KanbanBoardProps } from "../types/kanban";
import { singleBoardMockData } from "../data/mockData";
import { useKanbanBoard } from "../hooks/useKanbanBoard";
import { Board } from "./shared";
import "../ui/KanbanBoard.css";

export function KanbanBoard({ className, tabIndex }: KanbanBoardProps): ReactElement {
    const { board, onDragEnd } = useKanbanBoard(singleBoardMockData);

    return (
        <div className={className || ""} tabIndex={tabIndex}>
            <Board
                board={board}
                onDragEnd={onDragEnd}
                showAddButton={false}
                showRemoveButton={false}
                wrapWithDragContext={true}
            />
        </div>
    );
}
