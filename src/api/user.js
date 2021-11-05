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

export function getStatistics() {
    return request.post('/merchant/getStatistics');
}

export function getUserList(paras) {
    return request.post('/merchant/getUserList', paras);
}

export function getUserRecord(paras) {
    return request.post('/merchant/getUserRecord', paras);
}

export function findMerchantByName(paras) {
    return request.post('/merchant/findMerchantByName', paras);
}

export function findTagsByName(paras) {
    return request.post('/merchant/findTagByName', paras);
}


export function getUserCount() {
    return request.post('/merchant/userCount');
}

export function getRecordStatics() {
    return request.post('/merchant/recordCount');
}

export function insetTaskList(paras) {
    return request.post('/task/addTask', paras);
}


export function getTaskList(paras) {
    return request.post('/task/getTaskList', paras);
}

export function updateTaskById(paras) {
    return request.post('/task/updateTaskById', paras);
}

export function deleteTaskById(paras) {
    return request.post('/task/deleteTaskById', paras);
}

export function getImageList(paras) {
    return request.post('/task/getImagesList', paras);
}

export function getCommandStatistic() {
    return request.post('/merchant/commandStatistic');
}


export function updateRankById(paras) {
    return request.post('/ad/updateRankById', paras);
}


export function deleteRankById(paras) {
    return request.post('/ad/deleteRankById', paras);
}

export function getRankList(paras) {
    return request.post('/ad/getRankList', paras);
}

export function insertRank(paras) {
    return request.post('/ad/addRank', paras);
}


export function insertAd(paras) {
    return request.post('/ad/addAd', paras);
}

export function getAdList(paras) {
    return request.post('/ad/getAdList', paras);
}


export function updateAdById(paras) {
    return request.post('/ad/updateAdById', paras);
}

export function deleteAdById(paras) {
    return request.post('/ad/deleteAdById', paras);
}
