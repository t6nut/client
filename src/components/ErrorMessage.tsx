import React from 'react';

interface ErrorMessageProps {
	message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
	return <div style={{ color: 'red' }}>{message}</div>; // Style as needed
};

export default ErrorMessage;
