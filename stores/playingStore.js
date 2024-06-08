import { HYEventStore } from "hy-event-store" 
import { getSongDetail, getSongLyric } from "../services/handleRequest/player";
import { parseLyrics } from "../utils/parse-lyric";

export const audioContext = wx.createInnerAudioContext() // -- 🔺创建内部 audio 播放器

export const playingStore = new HYEventStore({ 
    state:{
        playingList: [],
        playingIndex: 0,
        playMode: "order", // -- 部分顺序: [order:顺序播放] [random:随机播放] [repeat:重复播放]
        // -------------------------
        id: 0,
        currentSong: {}, // -- 歌曲详情
        currentTime: 0, // -- 当前播放进度
        durationTime: 0, // -- 当前歌曲的总时长
        lyricInfos: [], // -- 歌词
        currentLyricText: "", // -- 当前行歌词
        currentLyricIndex: -1, // -- 当前行索引: 用于优化匹配歌词的重复执行...  
        isPlaying: false, // -- 播放状态
    },
    actions:{
        playMusicWithSongIdActionc(ctx, id){ // -- 根据 ID 播放请求对应歌曲信息
            ctx.isPlaying = true
            getSongDetail(id) // -- 获取歌曲详情
                .then(res => {
                    ctx.currentSong = res.songs[0]
                    ctx.durationTime = res.songs[0].dt / 1000 // -- 获取当前歌曲总时长（s）
                })
            getSongLyric(id) // -- 获取歌曲歌词
                .then(res => {
                    const lyric = res.lrc.lyric
                    const lyricInfos = parseLyrics(lyric ? lyric : '') // -- 歌词解析
                    ctx.lyricInfos = lyricInfos
                })
            // -- ↑ 信息获取 -- ↓ 歌曲播放
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3` // -- 播放对应的歌曲
            audioContext.autoplay = true
            audioContext.onTimeUpdate(() => {
                const currentTime = audioContext.currentTime
                ctx.currentTime = currentTime
                // -- 匹配歌词
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
                if(index === ctx.currentLyricIndex) return // -- 当 currentLyricIndex === index 直接返回，不执行下面的部分逻辑 -> 避免同一句歌词重复赋值
                const text = ctx.lyricInfos[index] ? ctx.lyricInfos[index].text : false
                if(text) {
                    ctx.currentLyricText = text
                    ctx.currentLyricIndex = index
                }
            })
        },

        switchMusicStatusAction(ctx){ // -- 播放/暂停
            if(!audioContext.paused){
                audioContext.pause()
                ctx.isPlaying = false
            }else {
                audioContext.play()
                ctx.isPlaying = true
            }
        },

        switchPlayMode(ctx){ // -- 切换歌曲列表播放模式 <顺序/随机/重复>
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
        
        switchNewSongPlaying(ctx, isNext = true){ // -- 切换歌曲播放 <上一首/下一首>
            this.dispatch("resetPlayingSongInfo") // -- 重置当前播放信息
            function getNewSongPlayingIndex() { // -- 切换歌曲播放: 歌曲索引查找工具方法 <闭包函数>
                const LIST_LENGTH = ctx.playingList.length // -- 歌曲列表长度
                if(ctx.playMode === "random"){ // -- 随机播放
                    let randomIndex = Math.floor(Math.random() * LIST_LENGTH)
                    while(LIST_LENGTH > 1 && randomIndex === ctx.playingIndex){ // 当随机 randomIndex 为当前 playingIndex 重新进行随机（前提: playingList.length > 1，否则可能会造成死循环）
                        console.log(randomIndex,ctx.playingIndex);
                        randomIndex = Math.floor(Math.random() * LIST_LENGTH)
                    }
                    ctx.playingIndex = randomIndex
                    return
                }

                // if(ctx.playMode === "repeat") return // -- 重复播放

                if(isNext){ // -- 顺序播放
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
            this.dispatch("playMusicWithSongIdActionc", ctx.playingList[ctx.playingIndex].id) // -- 调用当前 store 中的 playMusicWithSongIdActionc 方法，播放新歌曲
        },

        resetPlayingSongInfo(ctx){ // -- 重置当前播放歌曲信息: 工具函数
            ctx.currentSong = {}
            ctx.currentTime = 0
            ctx.durationTime = 0
            ctx.currentLyricIndex = 0
            ctx.currentLyricText = ""
            ctx.lyricInfos = []
        }
    }
}) 

// -- audioContext 播放器事件监听
audioContext.onEnded(() => { 
    if(playingStore.playMode === 'repeat') return // -- 单曲循环，不执行下面播放下一首的操作
    playingStore.dispatch("switchNewSongPlaying")
})




