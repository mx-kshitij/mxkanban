import { ReactElement, createElement } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { KanbanBoardProps } from "../types/kanban";
import { multiBoardMockData } from "../data/mockData";
import { useMultiKanbanBoard } from "../hooks/useKanbanBoard";
import { Board } from "./shared";
import "../ui/KanbanBoard.css";

export function MultiBoardKanban({ className, tabIndex }: KanbanBoardProps): ReactElement {
    const { boards, onDragEnd, addCard, removeCard } = useMultiKanbanBoard(multiBoardMockData);

    const handleAddCard = (boardId: string) => (columnId: string) => {
        addCard(boardId, columnId);
    };

    const handleRemoveCard = (boardId: string) => (columnId: string, cardId: string) => {
        removeCard(boardId, columnId, cardId);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={`multi-kanban-boards ${className || ""}`} tabIndex={tabIndex}>
                {boards.map((multiBoard) => (
                    <Board
                        key={multiBoard.id}
                        board={multiBoard.board}
                        title={multiBoard.title}
                        onAddCard={handleAddCard(multiBoard.id)}
                        onRemoveCard={handleRemoveCard(multiBoard.id)}
                        showAddButton={true}
                        showRemoveButton={true}
                        wrapWithDragContext={false}
                    />
                ))}
            </div>
        </DragDropContext>
    );
}
