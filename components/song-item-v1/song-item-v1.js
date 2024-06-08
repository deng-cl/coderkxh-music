// components/song-item-v1/song-item-v1.js
Component({

    properties: {
        itemData:{
            type:Object,
            value:{}
        }
    },

    methods:{
        onPlaySong(){
            wx.navigateTo({
              url: `/packagePlayer/pages/music-player/music-player?id=${this.properties.itemData.id}`,
            })
        }
    }

})