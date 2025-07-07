/**
 * This file was generated from MxKanban.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, ListValue, ListAttributeValue, ListWidgetValue } from "mendix";

export type TypeOfBoardEnum = "single" | "multi";

export interface MxKanbanContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    typeOfBoard: TypeOfBoardEnum;
    s_data_columns?: ListValue;
    s_column_id?: ListAttributeValue<string>;
    s_data_cards?: ListValue;
    s_card_id?: ListAttributeValue<string>;
    s_card_parent?: ListAttributeValue<string>;
    s_content?: ListWidgetValue;
    m_data_boards?: ListValue;
    m_board_id?: ListAttributeValue<string>;
    m_data_columns?: ListValue;
    m_column_id?: ListAttributeValue<string>;
    m_column_parent?: ListAttributeValue<string>;
    m_data_cards?: ListValue;
    m_card_id?: ListAttributeValue<string>;
    m_card_parent?: ListAttributeValue<string>;
    m_content?: ListWidgetValue;
    onCardDrop?: ActionValue;
}

export interface MxKanbanPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode?: "design" | "xray" | "structure";
    typeOfBoard: TypeOfBoardEnum;
    s_data_columns: {} | { caption: string } | { type: string } | null;
    s_column_id: string;
    s_data_cards: {} | { caption: string } | { type: string } | null;
    s_card_id: string;
    s_card_parent: string;
    s_content: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    m_data_boards: {} | { caption: string } | { type: string } | null;
    m_board_id: string;
    m_data_columns: {} | { caption: string } | { type: string } | null;
    m_column_id: string;
    m_column_parent: string;
    m_data_cards: {} | { caption: string } | { type: string } | null;
    m_card_id: string;
    m_card_parent: string;
    m_content: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    onCardDrop: {} | null;
}
