// components/song-menu-item/song-menu-item.js
Component({

    properties: {
        itemData: {
            type: Object,
            value: {}
        },
        width: {
            type: Number,
            value: 0
        }
    },

    methods:{
        onSongMenuTap(){ // -- 跳转至对应的歌单详情页
            const songMenuID = this.properties.itemData.id
            wx.navigateTo({
              url: `/pages/detail-song/detail-song?songMenuType=${'songMenu'}&songMenuTitle=${'歌单详情'}&songMenuID=${songMenuID}`,
            })
        }
    }

})