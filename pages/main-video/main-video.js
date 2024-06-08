import { getTopMVList } from "../../services/handleRequest/rideo"

Page({
    data:{
        videoList:[],
        offset:0,
        hasMore: true // -- 记录服务器是否还有更多的数据可以请求
    },

    onLoad(options) {
        this.fetchTopMV() // 请求视频列表数据
    },

    onReachBottom(){ // -- 监听页面滚动到底部
        this.fetchTopMV() // -- 上拉获取更多数据
    },

    async onPullDownRefresh(){ // -- 监听下拉刷新
        this.setData({ // -- 清空之前的数据
            videoList:[],
            offset:0,
            hasMore:true
        })

        await this.fetchTopMV() // -- 刷新: 重新请求数据

        wx.stopPullDownRefresh() // -- ↑ 数据请求成功: 取消下拉操作
    },

    async fetchTopMV(){ // -- 请求视频列表数据方法
        if(!this.data.hasMore) return // -- 数据已全部加载 --> 直接返回，不执行 ↓ 请求操作

        const res = await getTopMVList(this.data.offset) // -- 调用 request/rideo.js 中封装的 getTopMVList 方法
        const newVideos = [...this.data.videoList,...res.data]

        this.setData({ videoList: newVideos, hasMore: res.hasMore }) // -- 给 videoList 赋值对应响应的视频列表数据 
        this.data.offset = this.data.videoList.length
    },

    // -- ↓ 事件监听
  
})