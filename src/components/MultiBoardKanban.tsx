import { ReactElement, createElement, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import "../ui/KanbanBoard.css";

interface MultiBoardKanbanProps {
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

interface MultiBoard {
    id: string;
    title: string;
    board: BoardData;
}

export function MultiBoardKanban({ className, tabIndex }: MultiBoardKanbanProps): ReactElement {
    const [boards, setBoards] = useState<MultiBoard[]>([
        {
            id: "board1",
            title: "Development Board",
            board: {
                columns: [
                    {
                        id: "board1-col1",
                        title: "Backlog",
                        cards: [
                            {
                                id: "card1",
                                title: "Feature A",
                                description: "Implement new feature A"
                            },
                            {
                                id: "card2",
                                title: "Bug Fix B",
                                description: "Fix critical bug B"
                            }
                        ]
                    },
                    {
                        id: "board1-col2",
                        title: "In Progress",
                        cards: [
                            {
                                id: "card3",
                                title: "Feature C",
                                description: "Working on feature C"
                            }
                        ]
                    },
                    {
                        id: "board1-col3",
                        title: "Done",
                        cards: []
                    }
                ]
            }
        },
        {
            id: "board2",
            title: "Testing Board",
            board: {
                columns: [
                    {
                        id: "board2-col1",
                        title: "To Test",
                        cards: [
                            {
                                id: "card4",
                                title: "Test Feature D",
                                description: "Test the new feature D"
                            }
                        ]
                    },
                    {
                        id: "board2-col2",
                        title: "Testing",
                        cards: []
                    },
                    {
                        id: "board2-col3",
                        title: "Verified",
                        cards: [
                            {
                                id: "card5",
                                title: "Feature E",
                                description: "Feature E is verified"
                            }
                        ]
                    }
                ]
            }
        }
    ]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newBoards = [...boards];
        
        // Find source board and column
        let sourceColumn = null;
        let sourceColumnIndex = -1;
        let sourceBoardIndex = -1;
        
        for (let boardIndex = 0; boardIndex < newBoards.length; boardIndex++) {
            const board = newBoards[boardIndex];
            for (let colIndex = 0; colIndex < board.board.columns.length; colIndex++) {
                const column = board.board.columns[colIndex];
                if (column.id === source.droppableId) {
                    sourceColumn = column;
                    sourceColumnIndex = colIndex;
                    sourceBoardIndex = boardIndex;
                    break;
                }
            }
            if (sourceColumn) break;
        }

        // Find destination board and column
        let destColumn = null;
        let destColumnIndex = -1;
        let destBoardIndex = -1;
        
        for (let boardIndex = 0; boardIndex < newBoards.length; boardIndex++) {
            const board = newBoards[boardIndex];
            for (let colIndex = 0; colIndex < board.board.columns.length; colIndex++) {
                const column = board.board.columns[colIndex];
                if (column.id === destination.droppableId) {
                    destColumn = column;
                    destColumnIndex = colIndex;
                    destBoardIndex = boardIndex;
                    break;
                }
            }
            if (destColumn) break;
        }

        if (!sourceColumn || !destColumn) {
            return;
        }

        const sourceCards = Array.from(sourceColumn.cards);
        const card = sourceCards.find(c => c.id === draggableId);
        
        if (!card) {
            return;
        }

        // Remove card from source
        sourceCards.splice(source.index, 1);
        newBoards[sourceBoardIndex].board.columns[sourceColumnIndex] = {
            ...sourceColumn,
            cards: sourceCards
        };

        // Add card to destination
        if (source.droppableId === destination.droppableId) {
            // Same column
            sourceCards.splice(destination.index, 0, card);
            newBoards[sourceBoardIndex].board.columns[sourceColumnIndex] = {
                ...sourceColumn,
                cards: sourceCards
            };
        } else {
            // Different column (possibly different board)
            const destCards = Array.from(destColumn.cards);
            destCards.splice(destination.index, 0, card);
            newBoards[destBoardIndex].board.columns[destColumnIndex] = {
                ...destColumn,
                cards: destCards
            };
        }

        setBoards(newBoards);
    };

    const addCard = (boardId: string, columnId: string) => {
        const title = prompt("Enter card title:");
        if (!title) return;

        const description = prompt("Enter card description (optional):") || "";
        
        const newBoards = [...boards];
        const board = newBoards.find(b => b.id === boardId);
        const column = board?.board.columns.find(c => c.id === columnId);
        
        if (column) {
            const newCard: Card = {
                id: `card-${Date.now()}`,
                title,
                description
            };
            column.cards.push(newCard);
            setBoards(newBoards);
        }
    };

    const removeCard = (boardId: string, columnId: string, cardId: string) => {
        const newBoards = [...boards];
        const board = newBoards.find(b => b.id === boardId);
        const column = board?.board.columns.find(c => c.id === columnId);
        
        if (column) {
            column.cards = column.cards.filter(c => c.id !== cardId);
            setBoards(newBoards);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={`multi-kanban-boards ${className || ""}`} tabIndex={tabIndex}>
                {boards.map((multiBoard) => (
                    <div key={multiBoard.id} className="board-container">
                        <h3 className="board-title">{multiBoard.title}</h3>
                        <div className="kanban-board-custom">
                            {multiBoard.board.columns.map((column) => (
                                <div key={column.id} className="column-container">
                                    <div className="column-header">
                                        <h4>{column.title}</h4>
                                        <button 
                                            className="add-card-btn"
                                            onClick={() => addCard(multiBoard.id, column.id)}
                                        >
                                            + Add Card
                                        </button>
                                    </div>
                                    <Droppable droppableId={column.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={`column-content ${
                                                    snapshot.isDraggingOver ? 'dragging-over' : ''
                                                }`}
                                            >
                                                {column.cards.map((card, index) => (
                                                    <Draggable
                                                        key={card.id}
                                                        draggableId={card.id}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`card ${
                                                                    snapshot.isDragging ? 'dragging' : ''
                                                                }`}
                                                            >
                                                                <div className="card-content">
                                                                    <h5 className="card-title">{card.title}</h5>
                                                                    {card.description && (
                                                                        <p className="card-description">
                                                                            {card.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    className="remove-card-btn"
                                                                    onClick={() => removeCard(multiBoard.id, column.id, card.id)}
                                                                >
                                                                    ×
                                                                </button>
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
                        </div>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
}
