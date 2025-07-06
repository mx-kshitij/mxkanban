import { ReactElement, createElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";
import { MxKanbanPreviewProps } from "../typings/MxKanbanProps";

export function preview({  }: MxKanbanPreviewProps): ReactElement {
    return <HelloWorldSample />;
}

export function getPreviewCss(): string {
    return require("./ui/MxKanban.css");
}
