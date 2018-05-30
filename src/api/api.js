import axios from 'axios';
import qs from 'qs';

// NetWork FormData
// axios.defaults.transformRequest = [function(data) {
//     return qs.stringify(data)
// }];

let instance = axios.create({
    headers: {
        // 'content-type': 'application/x-www-form-urlencoded'
        'Content-Type': 'application/json;charset=UTF-8'
    },
    withCredentials: true
})
let base = '';

// 时间戳转换时间
export const formDate = function (data) {
    var date = new Date(data);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}

// 数据导出excel
export const downloadFile = function (res) {
    console.log(res.data)
    var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
    var downloadElement = document.createElement('a');
    var href = window.URL.createObjectURL(blob); //创建下载的链接
    downloadElement.href = href;
    downloadElement.download = 'order_' + (new Date()).valueOf() + '.xlsx'; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(href); //释放掉blob对象
}

// this.axios.post(this.HostUrl + 'order/download', params, {
//     responseType: 'blob'
// }).then((data) => {
//     this.downloadLoading = false
//     return data
// }).then(this.downloadFile);

// 数据导出axios
export const dataExport = params => {
    return instance.post(`/api/exportlist.do`, params, {
        responseType: 'blob'
    }).then(downloadFile);
}

// 获取列表信息axios
export const getUserListPage = params => {
    return instance.post(`/api/viewlist.do`, params);
};
// 新增axios
export const addUser = params => {
    return instance.post(`/api/addAudiphone.do`, params);
};

// 删除axios
export const removeUser = params => {
    return instance.post(`/api/removeAudiphone.do`, params);
};

//编辑axios
export const editUser = params => {
    return instance.post(`/api/updateAudiphone.do`, params);
};
//获取select分类数据
export const getSelect = params => {
    return instance.post(`/mock/tableSel.json`, params);
};

export const batchRemoveUser = params => {
    return axios.get(`${base}/user/batchremove`, {
        params: params
    });
};

export const requestLogin = params => {
    return axios.post(`${base}/login`, params).then(res => res.data);
};

// 获取用户信息axios
export const getUserList = params => {
    return axios.get(`${base}/user/list`, {
        params: params
    });
};