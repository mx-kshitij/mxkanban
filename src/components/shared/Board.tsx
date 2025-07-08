import { ReactElement, createElement, memo, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { BoardData } from "../../types/kanban";
import { Column } from "./Column";

interface BoardProps {
    board: BoardData;
    onDragEnd?: (result: DropResult) => void;
    className?: string;
    title?: string;
    customHeaderContent?: any;
    wrapWithDragContext?: boolean;
    collapsible?: boolean;
}

const BoardComponent = ({ 
    board, 
    onDragEnd, 
    className = "",
    title,
    customHeaderContent,
    wrapWithDragContext = true,
    collapsible = false
}: BoardProps): ReactElement => {
    const [isCollapsed, setIsCollapsed] = useState(false); // Always start open

    const toggleCollapse = () => {
        setIsCollapsed(prev => !prev);
    };

    const boardContent = (
        <div className={`kanban-board-custom ${className} ${isCollapsed ? 'hidden' : ''}`}>
            {board.columns.map((column) => (
                <Column
                    key={column.id}
                    column={column}
                />
            ))}
        </div>
    );

    const content = (
        <div className={`board-container ${isCollapsed ? 'collapsed' : ''}`}>
            {customHeaderContent ? (
                <div className="custom-board-header">
                    {customHeaderContent}
                    {collapsible && (
                        <button 
                            className="collapse-toggle-btn"
                            onClick={toggleCollapse}
                            aria-label={isCollapsed ? 'Expand board' : 'Collapse board'}
                        >
                            {isCollapsed ? '▼' : '▲'}
                        </button>
                    )}
                </div>
            ) : (
                <div className="board-header-wrapper">
                    {title && <h3 className="board-title">{title}</h3>}
                    {collapsible && (
                        <button 
                            className="collapse-toggle-btn"
                            onClick={toggleCollapse}
                            aria-label={isCollapsed ? 'Expand board' : 'Collapse board'}
                        >
                            {isCollapsed ? '▼' : '▲'}
                        </button>
                    )}
                </div>
            )}
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
};

export const Board = memo(BoardComponent);
