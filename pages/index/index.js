import { getMusicBanners, getMusicPlayListDetail, getSongMenuList } from "../../services/handleRequest/index"
import { recommendStore, rankingStore } from "../../stores/rankingStore" 
import { playingStore } from "../../stores/playingStore"

import getPhoneType from "../../utils/getPhoneType"
import querySelect from "../../utils/query-select"
import hythrottle from "../../utils/throttle"

const querySelectThrottle = hythrottle(querySelect) 

Page({
    data:{
        banners:[],
        bannerHeight: 130,

        recommendList:[],

        hotMenuList:[], 
        recMenuList:[], 

        rankingInfos:{},

        currentSong:{}, 
        isPlaying: false
    },

    onLoad(){
        this.fetchBannerList()
        this.fetchSongMenuList()

        
        this.fetchRecommendSongList()
        this.fetchRankingSongList()

        
        playingStore.onStates(["currentSong", "isPlaying"], this.getPlayerInfos)
    },

    
    getPlayerInfos({currentSong, isPlaying}){ 
        if(currentSong) this.setData({ currentSong })
        if(isPlaying !== undefined) this.setData({ isPlaying })
    },

    onSwitchPlayStatus(){ 
        playingStore.dispatch("switchMusicStatusAction")
    },

    
    async fetchBannerList(){
        const phoneTypeName = getPhoneType() 
        const phoneTypeID = ["pc","android","iphone","ipad"].indexOf(phoneTypeName)

        const res = await getMusicBanners(phoneTypeID)
        this.setData({ banners: res.banners })
    },

    fetchSongMenuList(){ 
        
        getSongMenuList().then(res => { 
            this.setData({ hotMenuList: res.playlists })
        })
        
        getSongMenuList("华语").then(res => { 
            this.setData({ recMenuList: res.playlists })
        })
    },

    fetchRecommendSongList(){ 
        recommendStore.dispatch("fetchRecommendSongList") 
        recommendStore.onState("recommendList", value => { 
            if(value.tracks && value.tracks.length !== 0) this.setData({ recommendList: value.tracks.slice(0,6) })
        }) 
    },

    fetchRankingSongList(){ 
        rankingStore.dispatch("fetchRankingsSongList") 
        rankingStore.onState("newRanking",this.getRankingHandler("newRanking"))
        rankingStore.onState("originRanking",this.getRankingHandler("originRanking"))
        rankingStore.onState("upRanking",this.getRankingHandler("upRanking"))
    },

    
    onBannerImageLoad(e){ 
        querySelectThrottle(".banner-image")  
        .then(res => {
            this.setData({ bannerHeight: res[0].height })
        })
    },

    onClickRecommendMore(){ 
        wx.navigateTo({
          url: `/pages/detail-song/detail-song?songMenuType=${'recommend'}&songMenuTitle=${'热歌榜'}`,
        })
    },

    onClickHotMenuMore(){ 
        console.log("onClickHotMenuMore");
    },
    
    onClickRecMenuMore(){ 
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

    
    getRankingHandler(ranking){ 
        return value => {
            const newRankingInfos = { ...this.data.rankingInfos,  /* 动态属性名 */[ranking]:value }
            this.setData({ rankingInfos: newRankingInfos})
        }
    },

    onPlayBarAlbumTap(){ 
        wx.navigateTo({
            url: '/packagePlayer/pages/music-player/music-player',
        })
    },

    
    toSearchPage(){ 
        wx.navigateTo({
          url: '/pages/detail-search/detail-search',
        })
    }
})