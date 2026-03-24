export const validateEmail = (email) => {
    const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return re.test(email);
};

export const validatePhone = (phone) => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
};

export const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validateUsername = (username) => {
    return username.length >= 3 && username.length <= 50;
};