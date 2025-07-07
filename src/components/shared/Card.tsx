import { ReactElement, createElement } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card as CardType } from "../../types/kanban";

interface CardProps {
    card: CardType;
    index: number;
}

export function Card({ card, index }: CardProps): ReactElement {
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
                        {card.content}
                    </div>
                </div>
            )}
        </Draggable>
    );
}
