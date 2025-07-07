import { BoardData, MultiBoard } from "../types/kanban";

export const singleBoardMockData: BoardData = {
    columns: [
        {
            id: "col-1",
            title: "To Do",
            cards: [
                {
                    id: "card-1"
                },
                {
                    id: "card-2"
                }
            ]
        },
        {
            id: "col-2",
            title: "In Progress",
            cards: [
                {
                    id: "card-3"
                }
            ]
        },
        {
            id: "col-3",
            title: "Done",
            cards: [
                {
                    id: "card-4"
                }
            ]
        }
    ]
};

export const multiBoardMockData: MultiBoard[] = [
    {
        id: "board-1",
        title: "Development Board",
        board: {
            columns: [
                {
                    id: "board1-col1",
                    title: "Backlog",
                    cards: [
                        {
                            id: "dev-card-1"
                        },
                        {
                            id: "dev-card-2"
                        }
                    ]
                },
                {
                    id: "board1-col2",
                    title: "In Progress",
                    cards: [
                        {
                            id: "dev-card-3"
                        }
                    ]
                },
                {
                    id: "board1-col3",
                    title: "Done",
                    cards: []
                }
            ]
        }
    },
    {
        id: "board-2",
        title: "Testing Board",
        board: {
            columns: [
                {
                    id: "board2-col1",
                    title: "To Test",
                    cards: [
                        {
                            id: "test-card-1"
                        }
                    ]
                },
                {
                    id: "board2-col2",
                    title: "Testing",
                    cards: []
                },
                {
                    id: "board2-col3",
                    title: "Verified",
                    cards: [
                        {
                            id: "test-card-2"
                        }
                    ]
                }
            ]
        }
    }
];
