import { ReactElement, createElement, memo } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Column as ColumnType } from "../../types/kanban";
import { Card } from "./Card";

interface ColumnProps {
    column: ColumnType;
}

const ColumnComponent = ({ column }: ColumnProps): ReactElement => {
    return (
        <div className="column-container">
            <div className="column-header">
                <h4>{column.title}</h4>
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
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export const Column = memo(ColumnComponent);
