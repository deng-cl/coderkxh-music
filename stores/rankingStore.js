import { HYEventStore } from "hy-event-store" // -- 🔺该库使用比较起来简单 --> 具体 github 上看
import { getMusicPlayListDetail } from "../services/handleRequest/index"

export const recommendStore = new HYEventStore({ // -- 创建一个 store <推荐歌曲>
    state:{
        recommendList: []
    },
    actions:{
        async fetchRecommendSongList(ctx){ // -- 请求 recommend 数据
            const res = await getMusicPlayListDetail(3778678)
            ctx.recommendList = res.playlist // -- 将对应的响应 songs 数据赋值给 recommendList 状态
        }
    }
}) 

export const rankingsMap = {
    newRanking: 3779629,
    originRanking:2884035,
    upRanking: 19723756
}
export const rankingStore = new HYEventStore({ // -- 排行榜数据 store <新歌榜,原创榜,飙升榜>
    state:{
        newRanking:{}, // -- 新歌榜
        originRanking:{}, // -- 原创榜
        upRanking:{} // -- 飙升榜
    },
    actions:{
        fetchRankingsSongList(ctx) {
            for(const key in rankingsMap){
                const id = rankingsMap[key]
                getMusicPlayListDetail(id).then(res => {
                    ctx[key] = res.playlist
                })
            }
        }
    }
})


