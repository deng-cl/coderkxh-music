// components/ranking-item/ranking-item.js
Component({
    properties: {
        itemData: {
            type:Object,
            value:{}
        },
        rankingMapName:{
           type:String,
           value: ""  
        }
    },

    methods:{
        onRankingTap(){
            wx.navigateTo({
              url: `/pages/detail-song/detail-song?songMenuType=${this.properties.rankingMapName}&songMenuTitle=${this.properties.itemData.name}`,
            })
        }
    }
})