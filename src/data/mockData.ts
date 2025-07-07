import { BoardData, MultiBoard } from "../types/kanban";

export const singleBoardMockData: BoardData = {
    columns: [
        {
            id: "col-1",
            title: "To Do",
            cards: [
                {
                    id: "card-1",
                    title: "Task 1",
                    description: "Description for Task 1"
                },
                {
                    id: "card-2",
                    title: "Task 2",
                    description: "Description for Task 2"
                }
            ]
        },
        {
            id: "col-2",
            title: "In Progress",
            cards: [
                {
                    id: "card-3",
                    title: "Task 3",
                    description: "Description for Task 3"
                }
            ]
        },
        {
            id: "col-3",
            title: "Done",
            cards: [
                {
                    id: "card-4",
                    title: "Task 4",
                    description: "Description for Task 4"
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
                            id: "dev-card-1",
                            title: "Feature A",
                            description: "Implement new feature A"
                        },
                        {
                            id: "dev-card-2",
                            title: "Bug Fix B",
                            description: "Fix critical bug B"
                        }
                    ]
                },
                {
                    id: "board1-col2",
                    title: "In Progress",
                    cards: [
                        {
                            id: "dev-card-3",
                            title: "Feature C",
                            description: "Working on feature C"
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
                            id: "test-card-1",
                            title: "Test Feature D",
                            description: "Test the new feature D"
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
                            id: "test-card-2",
                            title: "Feature E",
                            description: "Feature E is verified"
                        }
                    ]
                }
            ]
        }
    }
];
