import request from "../utils/request";

export function login(paras) {
    return request.post('/user/login', paras);
}

export function addMerchant(para) {
    return request.post('/merchant/addMerchant', para);
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

export function deleteTag(tag_id) {
    return request.post('/merchant/deleteTag', {tag_id})
}

export function getTags() {
    return request.post('/merchant/getTags')
}

export function updateTags(para) {
    return request.post('/merchant/updateTags', para);
}


export function addClass(paras) {
    return request.post('/merchant/addClass', paras);
}

export function updateClass(paras) {
    return request.post('/merchant/updateClass', paras)
}


export function deleteClass(class_id) {
    return request.post('/merchant/deleteClass', {class_id})
}

export function getClasses() {
    return request.post('/merchant/getClass')
}


export function deleteImg(paras) {
    return request.post('/merchant/deleteImg', paras);
}


export function getImages(paras) {
    return request.post('/merchant/getImages', paras);
}
