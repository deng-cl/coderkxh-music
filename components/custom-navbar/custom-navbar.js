const app = getApp()
Component({
    options:{
        multipleSlots: true
    },

    properties:{
        title: {
            type: String,
            value: "默认标题"
        }
    },

    data: {
        statusHeight: 20
    },
    lifetimes:{
        attached(){
            const statusHeight = app.globalData.statusBarHeight
            this.setData({ statusHeight })
        }
    },

    methods:{
        onTapBack(){
            wx.navigateBack()
        }
    }
})