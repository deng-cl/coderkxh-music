class XHRequest { // -- 对 wx.request({}) 二次封装
    constructor(baseURL) {
        this.baseURL = baseURL // -- 实例 baseURL 配置
    }

    request(options) { // -- 请求方法封装
        const { url } = options
        return new Promise((resolve, reject) => {
            wx.request({
                ...options,
                url: this.baseURL + url,
                success: res => {
                    resolve(res.data)
                },
                fail: err => {
                    reject(err)
                }
            })
        })
    }

    get(options) {
        return this.request({
            ...options,
            method: "GET"
        })
    }
    post(options) {
        return this.request({
            ...options,
            method: "POST"
        })
    }
    // ...
}

export default XHRequest