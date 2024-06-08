import { getMusicBanners, getMusicPlayListDetail, getSongMenuList } from "../../services/handleRequest/index"
import { recommendStore, rankingStore } from "../../stores/rankingStore" // -- 共享数据仓库
import { playingStore } from "../../stores/playingStore"

import getPhoneType from "../../utils/getPhoneType"
import querySelect from "../../utils/query-select"
import hythrottle from "../../utils/throttle"

const querySelectThrottle = hythrottle(querySelect) // -- 返回 querySelect 的节流函数

Page({
    data:{
        banners:[],
        bannerHeight: 130,

        recommendList:[],

        hotMenuList:[], // 热门歌单（全部）
        recMenuList:[], // -- 推荐歌单（华语）

        rankingInfos:{}, // 巅峰版数据 <新歌榜,原创榜,飙升榜>

        currentSong:{}, 
        isPlaying: false
    },

    onLoad(){
        this.fetchBannerList()
        this.fetchSongMenuList()

        // -- 从 sotre 中发送请求，监听对应共享数据 
        this.fetchRecommendSongList()
        this.fetchRankingSongList()

        // -- play-bar 播放器: 歌曲播放数据监听
        playingStore.onStates(["currentSong", "isPlaying"], this.getPlayerInfos)
    },

    // -- store props listenning
    getPlayerInfos({currentSong, isPlaying}){ // -- 监听 playingStore 共享数据
        if(currentSong) this.setData({ currentSong })
        if(isPlaying !== undefined) this.setData({ isPlaying })
    },

    onSwitchPlayStatus(){ // -- 播放/暂停
        playingStore.dispatch("switchMusicStatusAction")
    },

    // -- 数据请求
    async fetchBannerList(){
        const phoneTypeName = getPhoneType() // -- 获取手机类型 --> ↓ 获取对应类型的 banner 数据
        const phoneTypeID = ["pc","android","iphone","ipad"].indexOf(phoneTypeName)

        const res = await getMusicBanners(phoneTypeID)
        this.setData({ banners: res.banners })
    },

    fetchSongMenuList(){ 
        // -- 因为这里请求的歌单是同时请求多个的，所以不使用 async/await 使用同时请求多个歌单
        getSongMenuList().then(res => { // -- 热门歌单
            this.setData({ hotMenuList: res.playlists })
        })
        
        getSongMenuList("华语").then(res => { // 推荐歌单
            this.setData({ recMenuList: res.playlists })
        })
    },

    fetchRecommendSongList(){ // -- 监听 recommendStore 推荐歌曲状态（数据）
        recommendStore.dispatch("fetchRecommendSongList") // -- 发射（触发）recommendStore仓库中的 fetchRecommendSongList 方法 --> 请求对应的 recommendList 数据
        recommendStore.onState("recommendList", value => { // -- 监听 recommendStore 仓库中的 recommendList 状态发生改变，并执行对应操作
            if(value.tracks && value.tracks.length !== 0) this.setData({ recommendList: value.tracks.slice(0,6) })
        }) 
    },

    fetchRankingSongList(){ // -- 监听 rankingStore 巅峰榜状态（数据）
        rankingStore.dispatch("fetchRankingsSongList") // -- 巅峰榜数据监听 ↓
        rankingStore.onState("newRanking",this.getRankingHandler("newRanking"))
        rankingStore.onState("originRanking",this.getRankingHandler("originRanking"))
        rankingStore.onState("upRanking",this.getRankingHandler("upRanking"))
    },

    // -- ↓ 事件的监听
    onBannerImageLoad(e){ // -- 监听图片加载完成回调 --> 获取 image 组件的高度，来动态决决定 swiper 的高度
        querySelectThrottle(".banner-image")  // -- 获取 image 组件的基本矩形信息 --> 获取对应的组件高度 <使用 querySelect 的节流函数>
        .then(res => {
            this.setData({ bannerHeight: res[0].height })
        })
    },

    onClickRecommendMore(){ // -- 监听推荐视频 recommend 点击更多事件函数
        wx.navigateTo({
          url: `/pages/detail-song/detail-song?songMenuType=${'recommend'}&songMenuTitle=${'热歌榜'}`,
        })
    },

    onClickHotMenuMore(){ // -- 监听热门歌单 hot-menu 点击更多事件处理函数
        console.log("onClickHotMenuMore");
    },
    
    onClickRecMenuMore(){ // -- 监听推荐歌单 rec-menu 点击更多事件处理函数
        console.log("onClickRecMenuMore");
    },

    onPlayRecSongList(e){
        console.log(e);
        const index = e.currentTarget.dataset.index
        playingStore.setState("playingList", this.data.recommendList)
        playingStore.setState("playingIndex", index)
    },

    onPlayMenuSongList(){
        console.log("coderkxh,onPlayMenuSongList");
    },

    // -- handle
    getRankingHandler(ranking){ // -- 高阶函数: 根据 ranking 返回一个对应的状态监听函数
        return value => {
            const newRankingInfos = { ...this.data.rankingInfos,  /* 动态属性名 */[ranking]:value }
            this.setData({ rankingInfos: newRankingInfos})
        }
    },

    onPlayBarAlbumTap(){ // -- 播放栏歌曲图片: 点击跳转到播放页
        wx.navigateTo({
            url: '/packagePlayer/pages/music-player/music-player',
        })
    },

    // -- other 
    toSearchPage(){ // -- 跳转至搜索页
        wx.navigateTo({
          url: '/pages/detail-search/detail-search',
        })
    }
})