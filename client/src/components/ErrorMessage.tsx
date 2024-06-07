import React from 'react';

interface ErrorMessageProps {
  error: string | Error | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <div className="flex justify-center items-center min-h-screen">
    {error && <div>Error: {error instanceof Error ? error.message : error}</div>}
  </div>
);

export default ErrorMessage;
