import { ReactElement, createElement } from "react";
import { MxKanbanContainerProps } from "../typings/MxKanbanProps";
import "./ui/MxKanban.css";
import { KanbanBoard } from "./components/KanbanBoard";
import { MultiBoardKanban } from "./components/MultiBoardKanban";

export function MxKanban({ typeOfBoard }: MxKanbanContainerProps): ReactElement {
    return (
        <div>
            {typeOfBoard === "single" ? 
                <KanbanBoard/>
                :
                <MultiBoardKanban/>}
        </div>
    )
}
