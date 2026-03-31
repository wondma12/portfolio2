export const handleApiError = (error, showToast = true) => {
    let message = 'An error occurred. Please try again.';
    
    if (error.response) {
        // Server responded with error
        message = error.response.data?.message || message;
    } else if (error.request) {
        // Request made but no response
        message = 'Unable to connect to server. Please check your internet connection.';
    } else {
        // Something else happened
        message = error.message || message;
    }
    
    if (showToast) {
        // This would be replaced with your toast implementation
        console.error(message);
    }
    
    return message;
};