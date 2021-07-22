import request from "../utils/request";

export function login(paras) {
    return request.post('/user/login', paras);
}
