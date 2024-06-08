// components/video-item.js
Component({
    properties:{
        itemData:{
            type: Object,
            value: {} 
        }
    },
    methods:{
        onItemTap(){ // -- 监听当前 video-item 组件的点击，跳转至对应的页面之中
            const item = this.properties.itemData
            wx.navigateTo({
                url: `/packageVideo/pages/detail-video/detail-video?id=${item.id}`,
            })
        }
    }
})