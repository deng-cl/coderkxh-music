import {
    recommendStore,
    rankingStore,
    rankingsMap
} from "../../stores/rankingStore" // -- recommend store --> 共享数据仓库

import { getMusicPlayListDetail } from "../../services/handleRequest/index"
import { playingStore } from "../../stores/playingStore"

Page({
    data: {
        songs: {},
        songMenuType: "",
        songMenuTitle: "",
        songMenuID: -1
    },

    onLoad(options) {     
        const { songMenuType,songMenuTitle,songMenuID } = options 
        this.setData({ songMenuType }) // -存储进入该页面的歌单类型
        this.data.songMenuID = songMenuID // --当类型为 songMenu 时，songMenuID 才会有值

        wx.setNavigationBarTitle({ title: this.data.songMenuTitle }) // -- 设置窗口顶部标题

        if(this.data.songMenuType === "songMenu") this.fetchSongMenuInfo() // -- 处理歌单时的数据请求等操作
        else { 
            this.setData({ songMenuTitle }) // -- 存储对应的标题
            
            this.switchSongsChangeBySongMenuType() // -- 🔺 进入页面 --> 监听对应的歌单 songs 状态 <注意: 类型非 songMenu 歌单>  
        }
    },

    onUnload() { 
        if(this.data.songMenuType !== "songMenu") this.switchSongsChangeBySongMenuType("offState") // -- 🔺 离开页面 --> 取消监听对应的歌单 songs 状态 <注意: 类型非 songMenu 歌单>
    },

    // 🔺在进入该页面时，监听对应的状态数据 | 离开该页面时取消监听进入时监听的状态数据 <抽取成一个公共的方法: 类型非 songMenu 歌单>> 【切换状态的监听的开关】
    switchSongsChangeBySongMenuType(event_type = "onState"){ // -- event_type: onState/offState: 🔺根据 event_type 来监听或取消监听对应的 store 状态
        if(this.data.songMenuType === "recommend"){ // -- 热门歌曲/推荐歌曲
            recommendStore[event_type]("recommendList", this.handleRecommendOnState) // -- 页面加载时，获取共享数据仓库 recommendStore 中的 recommendList 数据
        }
        else{ // -- 判断是否是 ranking 巅峰榜 song 数据 <排行榜>
            for(const rankingName in rankingsMap){
                if(this.data.songMenuType === rankingName){ // -- 根据进入类型，进行对应的状态的监听
                    rankingStore[event_type](this.data.songMenuType, this.handleRankingOnState)
                }
            }
        }
    },

    // fetch song menu songs > 歌单类型: 主处理方法
    async fetchSongMenuInfo(){
        const res = await getMusicPlayListDetail(this.data.songMenuID) // -- 获取歌单信息
        this.setData({ songMenuTitle: res.name, songs: res.playlist }) // -- 设置对应的数据
    },

    // -- handle event change > 类型非 songMenu 歌单>
    handleRecommendOnState(value){ // -- recommendStore 仓库的事件监听回调函数
        this.setData({ songs: value })
    },
    handleRankingOnState(value){ // -- rankingStore 仓库的事件监听回调函数
        this.setData({ songs: value })
    },

    // -- event ...
    onPlayMenuSogList(e){
        const index = e.currentTarget.dataset.index
        playingStore.setState("playingList",this.data.songs.tracks)
        playingStore.setState("playingIndex", index)
    }
})


/** ↑ 已抽取
    if(songMenuType === "recommend"){ // -- 热门歌曲/推荐歌曲
        console.log("recommend");
        recommendStore.onState("recommendList", this.handleRecommendOnState) // -- 页面加载时，获取共享数据仓库 recommendStore 中的 recommendList 数据
    }
    else{ // -- 判断是否是 ranking 巅峰榜 song 数据 <排行榜>
        for(const rankingName in rankingsMap){
            if(songMenuType === rankingName){ // -- 根据进入类型，进行对应的状态的监听
                console.log(rankingName);
                rankingStore.onState(songMenuType, value => { 
                    this.setData({ songs: value.tracks })
                })
            }
        }
    }
 */