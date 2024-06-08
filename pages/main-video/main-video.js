import { getTopMVList } from "../../services/handleRequest/rideo"

Page({
    data: {
        videoList: [],
        offset: 0,
        hasMore: true
    },

    onLoad(options) {
        this.fetchTopMV()
    },

    onReachBottom() {
        this.fetchTopMV()
    },

    async onPullDownRefresh() {
        this.setData({
            videoList: [],
            offset: 0,
            hasMore: true
        })

        await this.fetchTopMV()

        wx.stopPullDownRefresh()
    },

    async fetchTopMV() {
        if (!this.data.hasMore) return

        const res = await getTopMVList(this.data.offset)
        const newVideos = [...this.data.videoList, ...res.data]

        this.setData({ videoList: newVideos, hasMore: res.hasMore })
        this.data.offset = this.data.videoList.length
    },



})