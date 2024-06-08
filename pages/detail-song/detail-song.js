import {
    recommendStore,
    rankingStore,
    rankingsMap
} from "../../stores/rankingStore" 

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
        this.setData({ songMenuType }) 
        this.data.songMenuID = songMenuID 
        wx.setNavigationBarTitle({ title: this.data.songMenuTitle })

        if(this.data.songMenuType === "songMenu") this.fetchSongMenuInfo() 
        else { 
            this.setData({ songMenuTitle }) 
            
            this.switchSongsChangeBySongMenuType() 
        }
    },

    onUnload() { 
        if(this.data.songMenuType !== "songMenu") this.switchSongsChangeBySongMenuType("offState") 
    },

    switchSongsChangeBySongMenuType(event_type = "onState"){ 
        if(this.data.songMenuType === "recommend"){ 
            recommendStore[event_type]("recommendList", this.handleRecommendOnState)
        }
        else{ 
            for(const rankingName in rankingsMap){
                if(this.data.songMenuType === rankingName){
                    rankingStore[event_type](this.data.songMenuType, this.handleRankingOnState)
                }
            }
        }
    },

    async fetchSongMenuInfo(){
        const res = await getMusicPlayListDetail(this.data.songMenuID) 
        this.setData({ songMenuTitle: res.name, songs: res.playlist }) 
    },

    handleRecommendOnState(value){ 
        this.setData({ songs: value })
    },
    handleRankingOnState(value){ 
        this.setData({ songs: value })
    },

    onPlayMenuSogList(e){
        const index = e.currentTarget.dataset.index
        playingStore.setState("playingList",this.data.songs.tracks)
        playingStore.setState("playingIndex", index)
    }
})

