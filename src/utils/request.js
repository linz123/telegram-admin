import axios from "axios";
import {notification} from "antd";
import {message} from "antd";

// 创建 axios 实例
const request = axios.create({
    // API 请求的默认前缀
    // baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
    console.log(error.response);
    if (error.response) {
        const data = error.response.data
        // 从 localstorage 获取 token
        // const token = storage.get(ACCESS_TOKEN)
        if (error.response.status === 403) {
            // notification.error({
            //     message: 'Forbidden',
            //     description: data.message
            // })
        }
        // if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
        if (error.response.status === 401) {
            notification.error({
                message: 'Unauthorized',
                description: 'Authorization verification failed'
            })
            // if (token) {
            //     store.dispatch('Logout').then(() => {
            //         setTimeout(() => {
            //             window.location.reload()
            //         }, 1500)
            //     })
            // }
        }
        notification.error({
            message: 'Error ' + error.response.config.url,
            description: error.response.statusText
        })

    }
    return Promise.reject(error)
}

// Add a request interceptor
request.interceptors.request.use(function (config) {
    // Do something before request is sent
    // console.log('config', config);
    // const token = storage.get(ACCESS_TOKEN)
    // // 如果 token 存在
    // // 让每个请求携带自定义 token 请根据实际情况自行修改
    // if (token) {
    //     config.headers['Access-Token'] = token
    // }
    return config;
}, errorHandler);

// Add a response interceptor
request.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log('response', response);
    const data = response.data;
    if (data.status !== 200) {
        data.msg && message.warn(data.msg);
    }
    return data;
}, errorHandler);


export default request;
