// components/song-area-menu/song-area-menu.js
const app = getApp()
Component({

  properties: {
    title:{
        type:String,
        value: "请传递 title 属性"
    },
    menuList:{
        type:Array,
        value:[]
    }
  },


  data: {
    screenWidth:375
  },

  lifetimes:{
      attached(){
          this.setData({ screenWidth: app.globalData.screenWidth })
      }
  },

  methods:{
    onClickMenuMore(){
        wx.navigateTo({
          url: '/pages/detail-menu/detail-menu',
        })
    }
  }
})