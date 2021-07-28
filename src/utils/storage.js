export function setItem(key, value) {
    localStorage.setItem(key, value);
}

export function getItem(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

export function removeItem(key) {
    localStorage.removeItem(key);
}
