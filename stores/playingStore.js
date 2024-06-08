import { HYEventStore } from "hy-event-store" 
import { getSongDetail, getSongLyric } from "../services/handleRequest/player";
import { parseLyrics } from "../utils/parse-lyric";

export const audioContext = wx.createInnerAudioContext()

export const playingStore = new HYEventStore({ 
    state:{
        playingList: [],
        playingIndex: 0,
        playMode: "order", 
    
        id: 0,
        currentSong: {}, 
        currentTime: 0, 
        durationTime: 0, 
        lyricInfos: [], 
        currentLyricText: "", 
        currentLyricIndex: -1,  
        isPlaying: false, 
    },
    actions:{
        playMusicWithSongIdActionc(ctx, id){ 
            ctx.isPlaying = true
            getSongDetail(id) 
                .then(res => {
                    ctx.currentSong = res.songs[0]
                    ctx.durationTime = res.songs[0].dt / 1000 
                })
            getSongLyric(id) 
                .then(res => {
                    const lyric = res.lrc.lyric
                    const lyricInfos = parseLyrics(lyric ? lyric : '')
                    ctx.lyricInfos = lyricInfos
                })
     
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3` 
            audioContext.autoplay = true
            audioContext.onTimeUpdate(() => {
                const currentTime = audioContext.currentTime
                ctx.currentTime = currentTime
    
                const len = ctx.lyricInfos.length
                if(!len) return
                let index = len - 1
                for(let i = 0; i < len; i++){
                    const info = ctx.lyricInfos[i]
                    if(info.time > ctx.currentTime * 1000){
                        index = i - 1
                        break
                    }
                }   
                if(index === ctx.currentLyricIndex) return 
                const text = ctx.lyricInfos[index] ? ctx.lyricInfos[index].text : false
                if(text) {
                    ctx.currentLyricText = text
                    ctx.currentLyricIndex = index
                }
            })
        },

        switchMusicStatusAction(ctx){ 
            if(!audioContext.paused){
                audioContext.pause()
                ctx.isPlaying = false
            }else {
                audioContext.play()
                ctx.isPlaying = true
            }
        },

        switchPlayMode(ctx){
            let title = "顺序播放"
            if(ctx.playMode === "order") {
                ctx.playMode = "random"
                title = "随机播放"
            }else if(ctx.playMode === "random") {
                ctx.playMode = "repeat"
                title = "单曲循环"
            }else ctx.playMode = "order"
            wx.showToast({ title,icon:'none' })
        },
        
        switchNewSongPlaying(ctx, isNext = true){ 
            this.dispatch("resetPlayingSongInfo") 
            function getNewSongPlayingIndex() { 
                const LIST_LENGTH = ctx.playingList.length
                if(ctx.playMode === "random"){ 
                    let randomIndex = Math.floor(Math.random() * LIST_LENGTH)
                    while(LIST_LENGTH > 1 && randomIndex === ctx.playingIndex){
                        console.log(randomIndex,ctx.playingIndex);
                        randomIndex = Math.floor(Math.random() * LIST_LENGTH)
                    }
                    ctx.playingIndex = randomIndex
                    return
                }



                if(isNext){ 
                    if(ctx.playingIndex === LIST_LENGTH - 1) ctx.playingIndex = 0  
                    else ctx.playingIndex += 1
                }else{
                    if(ctx.playingIndex === 0) ctx.playingIndex = LIST_LENGTH - 1  
                    else ctx.playingIndex -= 1
                }
            }
            getNewSongPlayingIndex() 
            console.log(ctx.playingList[ctx.playingIndex]);
            console.log("ctx.playingIndex",ctx.playingIndex);
            this.dispatch("playMusicWithSongIdActionc", ctx.playingList[ctx.playingIndex].id) 
        },

        resetPlayingSongInfo(ctx){ 
            ctx.currentSong = {}
            ctx.currentTime = 0
            ctx.durationTime = 0
            ctx.currentLyricIndex = 0
            ctx.currentLyricText = ""
            ctx.lyricInfos = []
        }
    }
}) 


audioContext.onEnded(() => { 
    if(playingStore.playMode === 'repeat') return 
    playingStore.dispatch("switchNewSongPlaying")
})




