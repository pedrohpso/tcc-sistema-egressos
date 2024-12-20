import React from 'react';
import './Error.css';

interface ErrorProps {
    name: string;
}

const Error: React.FC<ErrorProps> = ({  name }) => {
    return (
        <div className="error-container">
            <div className="error-message">
                <h1>Erro</h1>
                <p>{name}</p>
            </div>
        </div>
    );
};

export default Error;
