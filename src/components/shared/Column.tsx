import { ReactElement, createElement } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Column as ColumnType } from "../../types/kanban";
import { Card } from "./Card";

interface ColumnProps {
    column: ColumnType;
    onAddCard?: (columnId: string) => void;
    onRemoveCard?: (columnId: string, cardId: string) => void;
    showAddButton?: boolean;
    showRemoveButton?: boolean;
}

export function Column({ 
    column, 
    onAddCard, 
    onRemoveCard, 
    showAddButton = false, 
    showRemoveButton = false 
}: ColumnProps): ReactElement {
    const handleRemoveCard = (cardId: string) => {
        if (onRemoveCard) {
            onRemoveCard(column.id, cardId);
        }
    };

    return (
        <div className="column-container">
            <div className="column-header">
                <h4>{column.title}</h4>
                {showAddButton && onAddCard && (
                    <button 
                        className="add-card-btn"
                        onClick={() => onAddCard(column.id)}
                        type="button"
                        aria-label={`Add card to ${column.title}`}
                    >
                        + Add Card
                    </button>
                )}
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
                            <Card
                                key={card.id}
                                card={card}
                                index={index}
                                onRemove={showRemoveButton ? handleRemoveCard : undefined}
                                showRemoveButton={showRemoveButton}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
