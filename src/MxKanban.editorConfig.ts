import { MxKanbanPreviewProps } from "../typings/MxKanbanProps";
import { hidePropertyIn } from "@mendix/pluggable-widgets-tools"

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[]; // used for customizing object grids
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[]; // used for customizing object grids
};

export type Problem = {
    property?: string; // key of the property, at which the problem exists
    severity?: "error" | "warning" | "deprecation"; // default = "error"
    message: string; // description of the problem
    studioMessage?: string; // studio-specific message, defaults to message
    url?: string; // link with more information about the problem
    studioUrl?: string; // studio-specific link
};

type BaseProps = {
    type: "Image" | "Container" | "RowLayout" | "Text" | "DropZone" | "Selectable" | "Datasource";
    grow?: number; // optionally sets a growth factor if used in a layout (default = 1)
};

type ImageProps = BaseProps & {
    type: "Image";
    document?: string; // svg image
    data?: string; // base64 image
    property?: object; // widget image property object from Values API
    width?: number; // sets a fixed maximum width
    height?: number; // sets a fixed maximum height
};

type ContainerProps = BaseProps & {
    type: "Container" | "RowLayout";
    children: PreviewProps[]; // any other preview element
    borders?: boolean; // sets borders around the layout to visually group its children
    borderRadius?: number; // integer. Can be used to create rounded borders
    backgroundColor?: string; // HTML color, formatted #RRGGBB
    borderWidth?: number; // sets the border width
    padding?: number; // integer. adds padding around the container
};

type RowLayoutProps = ContainerProps & {
    type: "RowLayout";
    columnSize?: "fixed" | "grow"; // default is fixed
};

type TextProps = BaseProps & {
    type: "Text";
    content: string; // text that should be shown
    fontSize?: number; // sets the font size
    fontColor?: string; // HTML color, formatted #RRGGBB
    bold?: boolean;
    italic?: boolean;
};

type DropZoneProps = BaseProps & {
    type: "DropZone";
    property: object; // widgets property object from Values API
    placeholder: string; // text to be shown inside the dropzone when empty
    showDataSourceHeader?: boolean; // true by default. Toggles whether to show a header containing information about the datasource
};

type SelectableProps = BaseProps & {
    type: "Selectable";
    object: object; // object property instance from the Value API
    child: PreviewProps; // any type of preview property to visualize the object instance
};

type DatasourceProps = BaseProps & {
    type: "Datasource";
    property: object | null; // datasource property object from Values API
    child?: PreviewProps; // any type of preview property component (optional)
};

export type PreviewProps =
    | ImageProps
    | ContainerProps
    | RowLayoutProps
    | TextProps
    | DropZoneProps
    | SelectableProps
    | DatasourceProps;

export function getProperties(
    values: MxKanbanPreviewProps,
    defaultProperties: Properties /* , target: Platform*/
): Properties {
    // Do the values manipulation here to control the visibility of properties in Studio and Studio Pro conditionally.
    
    if (values.typeOfBoard === "single") {
        hidePropertyIn(defaultProperties, values, "m_content");
    }
    else{
        hidePropertyIn(defaultProperties, values, "s_content");
    }

    if(!values.useCustomLoading)
        hidePropertyIn(defaultProperties, values, "loading_content");

    if(!values.s_useCustomColumnHeader)
        hidePropertyIn(defaultProperties, values, "s_column_content");
    
    if(!values.m_useCustomColumnHeader)
        hidePropertyIn(defaultProperties, values, "m_column_content");

    if(!values.m_useCustomBoardHeader)
        hidePropertyIn(defaultProperties, values, "m_board_content");
    
    return defaultProperties;
}

export function check(_values: MxKanbanPreviewProps): Problem[] {
    const errors: Problem[] = [];
    // Add errors to the above array to throw errors in Studio and Studio Pro.

    // Common validations for both single and multi board
    if (!_values.changeJSON) {
        errors.push({
            property: `changeJSON`,
            message: `Change JSON property is required for tracking card movements.`,
            url: ""
        });
    }
    if (!_values.newCardOrderJSON) {
        errors.push({
            property: `newCardOrderJSON`,
            message: `New Card Order JSON property is required for tracking card positions.`,
            url: ""
        });
    }

    // Single Board Validations
    if (_values.typeOfBoard === "single") {
        if (_values.s_data_columns === null) {
            errors.push({
                property: `s_data_columns`,
                message: `The value of 'Columns' can not be null for single board widget.`,
                url: ""
            });
        }
        if (_values.s_data_cards === null) {
            errors.push({
                property: `s_data_cards`,
                message: `The value of 'Cards' can not be null for single board widget.`,
                url: ""
            });
        }
        
        // Single Board Sorting Attribute Validations
        if (!_values.s_column_sortAttr || _values.s_column_sortAttr.trim() === "") {
            errors.push({
                property: `s_column_sortAttr`,
                message: `Column sort attribute is required for single board widget.`,
                url: ""
            });
        }
        if (!_values.s_card_sortAttr || _values.s_card_sortAttr.trim() === "") {
            errors.push({
                property: `s_card_sortAttr`,
                message: `Card sort attribute is required for single board widget.`,
                url: ""
            });
        }
        if (!_values.s_column_id || _values.s_column_id.trim() === "") {
            errors.push({
                property: `s_column_id`,
                message: `Column ID is required for single board widget.`,
                url: ""
            });
        }
        if (!_values.s_card_id || _values.s_card_id.trim() === "") {
            errors.push({
                property: `s_card_id`,
                message: `Card ID is required for single board widget.`,
                url: ""
            });
        }
        if (!_values.s_card_parent || _values.s_card_parent.trim() === "") {
            errors.push({
                property: `s_card_parent`,
                message: `Card Parent is required for single board widget.`,
                url: ""
            });
        }
    }

    // Multi Board Validations
    if (_values.typeOfBoard === "multi") {
        if (_values.m_data_boards === null) {
            errors.push({
                property: `m_data_boards`,
                message: `The value of 'Boards' can not be null for multi board widget.`,
                url: ""
            });
        }
        if (_values.m_data_columns === null) {
            errors.push({
                property: `m_data_columns`,
                message: `The value of 'Columns' can not be null for multi board widget.`,
                url: ""
            });
        }
        if (_values.m_data_cards === null) {
            errors.push({
                property: `m_data_cards`,
                message: `The value of 'Cards' can not be null for multi board widget.`,
                url: ""
            });
        }
        
        // Multi Board Sorting Attribute Validations
        if (!_values.m_board_sortAttr || _values.m_board_sortAttr.trim() === "") {
            errors.push({
                property: `m_board_sortAttr`,
                message: `Board sort attribute is required for multi board widget.`,
                url: ""
            });
        }
        if (!_values.m_column_sortAttr || _values.m_column_sortAttr.trim() === "") {
            errors.push({
                property: `m_column_sortAttr`,
                message: `Column sort attribute is required for multi board widget.`,
                url: ""
            });
        }
        if (!_values.m_card_sortAttr || _values.m_card_sortAttr.trim() === "") {
            errors.push({
                property: `m_card_sortAttr`,
                message: `Card sort attribute is required for multi board widget.`,
                url: ""
            });
        }
        if (!_values.m_board_id || _values.m_board_id.trim() === "") {
            errors.push({
                property: `m_board_id`,
                message: `Board ID is required for multi board widget.`,
                url: ""
            });
        }
        if (!_values.m_column_id || _values.m_column_id.trim() === "") {
            errors.push({
                property: `m_column_id`,
                message: `Column ID is required for multi board widget.`,
                url: ""
            });
        }
        if (!_values.m_column_parent || _values.m_column_parent.trim() === "") {
            errors.push({
                property: `m_column_parent`,
                message: `Column Parent is required for multi board widget.`,
                url: ""
            });
        }
        if (!_values.m_card_id || _values.m_card_id.trim() === "") {
            errors.push({
                property: `m_card_id`,
                message: `Card ID is required for multi board widget.`,
                url: ""
            });
        }
        if (!_values.m_card_parent || _values.m_card_parent.trim() === "") {
            errors.push({
                property: `m_card_parent`,
                message: `Card Parent is required for multi board widget.`,
                url: ""
            });
        }
    }

    return errors;
}

// export function getPreview(values: MxKanbanPreviewProps, isDarkMode: boolean, version: number[]): PreviewProps {
//     // Customize your pluggable widget appearance for Studio Pro.
//     return {
//         type: "Container",
//         children: []
//     }
// }

// export function getCustomCaption(values: MxKanbanPreviewProps, platform: Platform): string {
//     return "MxKanban";
// }
