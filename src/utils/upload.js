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


export function getDate() {
    var date = new Date(new Date().getTime() - 1000 * 60 * 60 * 48);

// 获取当前月份
    var nowMonth = date.getMonth() + 1;

// 获取当前是几号
    var strDate = date.getDate();

// 添加分隔符“-”
    var seperator = "-";

// 对月份进行处理，1-9月在前面添加一个“0”
    if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
    }

// 对月份进行处理，1-9号在前面添加一个“0”
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

// 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
    return date.getFullYear() + seperator + nowMonth + seperator + strDate;
}
