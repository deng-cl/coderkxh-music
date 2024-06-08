import { HYEventStore } from "hy-event-store" 
import { getMusicPlayListDetail } from "../services/handleRequest/index"

export const recommendStore = new HYEventStore({
    state:{
        recommendList: []
    },
    actions:{
        async fetchRecommendSongList(ctx){ 
            const res = await getMusicPlayListDetail(3778678)
            ctx.recommendList = res.playlist 
        }
    }
}) 

export const rankingsMap = {
    newRanking: 3779629,
    originRanking:2884035,
    upRanking: 19723756
}
export const rankingStore = new HYEventStore({ 
    state:{
        newRanking:{}, 
        originRanking:{}, 
        upRanking:{} 
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


