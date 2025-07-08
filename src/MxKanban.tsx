import { ReactElement, createElement } from "react";
import { MxKanbanContainerProps } from "../typings/MxKanbanProps";
import "./ui/MxKanban.css";
import { KanbanBoard } from "./components/KanbanBoard";
import { MultiBoardKanban } from "./components/MultiBoardKanban";
import { LoadingSpinner } from "./components/shared";
import { ValueStatus } from "mendix";

// Helper function to check if all important props are available
function arePropsReady(props: MxKanbanContainerProps): boolean {
    if (props.typeOfBoard === "single") {
        return (
            (!props.s_data_columns || props.s_data_columns.status === ValueStatus.Available) &&
            (!props.s_data_cards || props.s_data_cards.status === ValueStatus.Available) &&
            (!!props.s_card_id && !!props.s_card_parent && !!props.s_column_id && !!props.s_content) &&
            (!!props.s_column_sortAttr && !!props.s_card_sortAttr)
        );
    } else {
        return (
            (!props.m_data_boards || props.m_data_boards.status === ValueStatus.Available) &&
            (!props.m_data_columns || props.m_data_columns.status === ValueStatus.Available) &&
            (!props.m_data_cards || props.m_data_cards.status === ValueStatus.Available) &&
            (!!props.m_board_id && !!props.m_column_id && !!props.m_column_parent && !!props.m_card_id && !!props.m_card_parent && !!props.m_content) &&
            (!!props.m_board_sortAttr && !!props.m_column_sortAttr && !!props.m_card_sortAttr)
        );
    }
}

export function MxKanban(props: MxKanbanContainerProps): ReactElement {
    // Wait for all important props to be ready before rendering
    if (!arePropsReady(props)) {
        // Check if custom loading is enabled
        if (props.useCustomLoading && props.loading_content) {
            return <div className="mx-kanban-custom-loading">{props.loading_content}</div>;
        }
        
        // Use default loading spinner
        const loadingMessage = props.typeOfBoard === "single" 
            ? "Loading Kanban Board..." 
            : "Loading Multi-Board Kanban...";
        
        return (
            <LoadingSpinner 
                message={loadingMessage}
                size="large"
                variant="kanban"
            />
        );
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
