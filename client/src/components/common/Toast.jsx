import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Toast = ({ message, type = 'success', duration = 3000 }) => {
    useEffect(() => {
        const toastId = toast[type](message, {
            duration: duration,
            position: 'top-right'
        });
        
        return () => {
            toast.dismiss(toastId);
        };
    }, [message, type, duration]);
    
    return null;
};

export default Toast;