import { HYEventStore } from "hy-event-store" 

export const playingStore = new HYEventStore({ 
    state:{
        playingList: [],
        playingIndex: 0,
        playMode: "order" // -- 部分顺序: [order:顺序播放] [random:随机播放] [repeat:重复播放]
    },
    actions:{
        switchNewSongPlaying(ctx,isNext = true){
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

        resetStates(ctx){
            ctx.playingList = []
            ctx.playingIndex = 0
        }
    }
}) 





