import request from "../utils/request";

export function login(paras) {
    return request.post('/user/login', paras);
}

export function addMerchant(para) {
    return request.post('/merchant/addMerchant', para);
}

export function editMerchant() {
    return request.post('/merchant/updateMerchant');
}

export function deleteMerchant(tel_id) {
    return request.post('/merchant/deleteMerchant', {tel_id});
}

export function getMerchant(data) {
    return request.post('/merchant/getMerchant', data);
}

export function updateMerchant(data) {
    return request.post('/merchant/updateMerchant', data);
}


export function addTag(paras) {
    return request.post('/merchant/addTag', paras);
}

export function deleteTag() {
    return request.post('/merchant/deleteTag')
}

export function getTags() {
    return request.post('/merchant/getTags')
}


export function addClass(paras) {
    return request.post('/merchant/addClass', paras);
}

export function deleteClass() {
    return request.post('/merchant/deleteClass')
}

export function getClasses() {
    return request.post('/merchant/getClass')
}
