function getPhoneType(){
    let type = "android"
    wx.getSystemInfo({ // -- 获取设备信息
        success:res => {
            if(res.model.includes("iPhone")) type = "iphone"
            if(res.model.includes("iPad")) type = "ipad"
        }
    })
    return type
}

export default getPhoneType