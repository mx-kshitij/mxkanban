import { ReactElement, createElement } from "react";
import { MxKanbanContainerProps } from "../typings/MxKanbanProps";
import "./ui/MxKanban.css";
import { KanbanBoard } from "./components/KanbanBoard";
import { MultiBoardKanban } from "./components/MultiBoardKanban";
import { ValueStatus } from "mendix";

// Helper function to check if all important props are available
function arePropsReady(props: MxKanbanContainerProps): boolean {
    if (props.typeOfBoard === "single") {
        return (
            (!props.s_data_columns || props.s_data_columns.status === ValueStatus.Available) &&
            (!props.s_data_cards || props.s_data_cards.status === ValueStatus.Available) &&
            (!!props.s_card_id && !!props.s_card_parent && !!props.s_column_id && !!props.s_content)
        );
    } else {
        return (
            (!props.m_data_boards || props.m_data_boards.status === ValueStatus.Available) &&
            (!props.m_data_columns || props.m_data_columns.status === ValueStatus.Available) &&
            (!props.m_data_cards || props.m_data_cards.status === ValueStatus.Available) &&
            (!!props.m_board_id && !!props.m_column_id && !!props.m_column_parent && !!props.m_card_id && !!props.m_card_parent && !!props.m_content)
        );
    }
}

export function MxKanban(props: MxKanbanContainerProps): ReactElement {
    // Wait for all important props to be ready before rendering
    if (!arePropsReady(props)) {
        return <div className="mx-kanban-loading">Loading...</div>;
    }

    return (
        <div id="1">
            {props.typeOfBoard === "single" ? 
                <KanbanBoard {...props} />
                :
                <MultiBoardKanban {...props}/>}
        </div>
    )
}
