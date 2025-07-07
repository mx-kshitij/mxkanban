import { ReactElement, createElement } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card as CardType } from "../../types/kanban";

interface CardProps {
    card: CardType;
    index: number;
    onRemove?: (cardId: string) => void;
    showRemoveButton?: boolean;
}

export function Card({ card, index, onRemove, showRemoveButton = false }: CardProps): ReactElement {
    return (
        <Draggable key={card.id} draggableId={card.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`card ${snapshot.isDragging ? 'dragging' : ''}`}
                >
                    <div className="card-content">
                        <h5 className="card-title">{card.title}</h5>
                        {card.description && (
                            <p className="card-description">{card.description}</p>
                        )}
                    </div>
                    {showRemoveButton && onRemove && (
                        <button
                            className="remove-card-btn"
                            onClick={() => onRemove(card.id)}
                            type="button"
                            aria-label={`Remove ${card.title}`}
                        >
                            ×
                        </button>
                    )}
                </div>
            )}
        </Draggable>
    );
}
