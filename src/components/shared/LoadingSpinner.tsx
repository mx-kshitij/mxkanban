import { ReactElement, createElement } from "react";
import "../../ui/LoadingSpinner.css";

interface LoadingSpinnerProps {
    message?: string;
    size?: "small" | "medium" | "large";
    variant?: "kanban" | "minimal";
}

export function LoadingSpinner({ 
    message = "Loading Kanban Board...", 
    size = "medium",
    variant = "kanban" 
}: LoadingSpinnerProps): ReactElement {
    if (variant === "minimal") {
        return (
            <div className={`loading-container loading-${size}`}>
                <div className="minimal-spinner">
                    <div className="spinner-dot"></div>
                    <div className="spinner-dot"></div>
                    <div className="spinner-dot"></div>
                </div>
                {message && <p className="loading-message">{message}</p>}
            </div>
        );
    }

    return (
        <div className={`loading-container loading-${size}`}>
            <div className="kanban-loading-spinner">
                <div className="spinner-board">
                    <div className="spinner-column">
                        <div className="spinner-column-header"></div>
                        <div className="spinner-card"></div>
                        <div className="spinner-card"></div>
                        <div className="spinner-card loading-shimmer"></div>
                    </div>
                    <div className="spinner-column">
                        <div className="spinner-column-header"></div>
                        <div className="spinner-card"></div>
                        <div className="spinner-card loading-shimmer"></div>
                    </div>
                    <div className="spinner-column">
                        <div className="spinner-column-header"></div>
                        <div className="spinner-card loading-shimmer"></div>
                    </div>
                </div>
            </div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
}
