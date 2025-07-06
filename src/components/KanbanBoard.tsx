import { ReactElement, createElement, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import "../ui/KanbanBoard.css";

interface KanbanBoardProps {
    className?: string;
    tabIndex?: number;
}

interface Card {
    id: string;
    title: string;
    description?: string;
}

interface Column {
    id: string;
    title: string;
    cards: Card[];
}

interface BoardData {
    columns: Column[];
}

export function KanbanBoard({ className, tabIndex }: KanbanBoardProps): ReactElement {
    const [board, setBoard] = useState<BoardData>({
        columns: [
            {
                id: "1",
                title: "To Do",
                cards: [
                    {
                        id: "1",
                        title: "Task 1",
                        description: "Description for Task 1"
                    },
                    {
                        id: "2",
                        title: "Task 2",
                        description: "Description for Task 2"
                    }
                ]
            },
            {
                id: "2",
                title: "In Progress",
                cards: [
                    {
                        id: "3",
                        title: "Task 3",
                        description: "Description for Task 3"
                    }
                ]
            },
            {
                id: "3",
                title: "Done",
                cards: [
                    {
                        id: "4",
                        title: "Task 4",
                        description: "Description for Task 4"
                    }
                ]
            }
        ]
    });

    const onCardDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;

        const newBoard = { ...board };
        
        const sourceColumn = newBoard.columns.find(col => col.id === source.droppableId);
        const destColumn = newBoard.columns.find(col => col.id === destination.droppableId);

        if (sourceColumn && destColumn) {
            const card = sourceColumn.cards[source.index];
            sourceColumn.cards.splice(source.index, 1);
            destColumn.cards.splice(destination.index, 0, card);
            setBoard(newBoard);
        }
    };


    return (
        <div className={`kanban-board-custom ${className || ""}`} tabIndex={tabIndex}>
            <DragDropContext onDragEnd={onCardDragEnd}>
                {board.columns.map((column) => (
                    <div key={column.id} className="column-container">
                        <div className="column-header">
                            <h4>{column.title}</h4>
                        </div>
                        <Droppable droppableId={column.id.toString()}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="column-content">
                                    {column.cards.map((card, index) => (
                                        <Draggable key={card.id} draggableId={card.id} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="card">
                                                    <div className="card-content">
                                                        <h5 className="card-title">{card.title}</h5>
                                                        {card.description && (
                                                            <p className="card-description">{card.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </DragDropContext>
        </div>
    );
}
