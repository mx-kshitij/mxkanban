import { ReactElement, createElement } from "react";
import { MxKanbanPreviewProps } from "../typings/MxKanbanProps";
import { LoadingSpinner } from "./components/shared";

export function preview(props: MxKanbanPreviewProps): ReactElement {
    // Show custom loading if enabled
    if (props.useCustomLoading && props.loading_content) {
        return (
            <div className="mx-kanban-custom-loading">
                <props.loading_content.renderer caption="Custom Loading Content">
                    <div>Custom Loading Preview</div>
                </props.loading_content.renderer>
            </div>
        );
    }
    
    // Show default loading spinner
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

export function getPreviewCss(): string {
    return require("./ui/MxKanban.css") + require("./ui/LoadingSpinner.css");
}
