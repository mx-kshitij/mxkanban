import { ReactElement, createElement } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { BoardData } from "../../types/kanban";
import { Column } from "./Column";

interface BoardProps {
    board: BoardData;
    onDragEnd?: (result: DropResult) => void;
    className?: string;
    title?: string;
    wrapWithDragContext?: boolean;
}

export function Board({ 
    board, 
    onDragEnd, 
    className = "",
    title,
    wrapWithDragContext = true
}: BoardProps): ReactElement {
    const boardContent = (
        <div className={`kanban-board-custom ${className}`}>
            {board.columns.map((column) => (
                <Column
                    key={column.id}
                    column={column}
                />
            ))}
        </div>
    );

    const content = (
        <div className="board-container">
            {title && <h3 className="board-title">{title}</h3>}
            {boardContent}
        </div>
    );

    if (wrapWithDragContext && onDragEnd) {
        return (
            <DragDropContext onDragEnd={onDragEnd}>
                {content}
            </DragDropContext>
        );
    }

    return content;
}
