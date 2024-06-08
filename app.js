App({
    onLaunch() {},
    globalData: {
        screenWidth: 375,
        screenHeight: 667,
        statusBarHeight: 20,
        contentHeight: 500
    },

    onLaunch() {
        wx.getSystemInfo({ // -- 获取设备宽高
            success:res => {
                this.globalData.screenWidth = res.screenWidth
                this.globalData.screenHeight = res.screenHeight
                this.globalData.statusBarHeight = res.statusBarHeight
                this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 44 // -- 剩余内容高度等于: 屏幕高度 - 状态栏高度 - 导航栏高度（一般都为 44px / 且前面的自定义导航栏 custom-navbar 组件的高度定义的是 44px）
            }
        })
    }

})