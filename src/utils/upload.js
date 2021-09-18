/**
 * 读取图片
 * @returns {Promise<unknown>}
 */
export function getBase64() {
    return new Promise(((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    }))
}
