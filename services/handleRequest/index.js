import { http } from "../index"

/**
 * 获取轮播图 banner 数据
 * @param {*} type 当前设配类型 Number --> [pc, android, iphone, ipad] 传入该数组对应的索引 (默认 0)
 */
export function getMusicBanners(type = 0){ 
    return http.get({ 
        url: "/banner", 
        data: { type } 
    })
}

/**
 * 获取 songs/recommendList ，某一榜单歌曲数据
 * @param {*} id 榜单 ID --> 如: 热歌榜 ID 为 3778678 <具体ID看接口文档>
 */
export function getMusicPlayListDetail(id){
    return http.get({
        url:"/playlist/detail",
        data:{ id }
    })
}

/**
 * 获取 "热门歌单" 数据
 * @param {*} cat 传入一个 tag 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 " 等 --> 默认为 "全部"
 * @param {*} limit 获取歌单数量 --> 默认 6
 * @param {*} offset 偏移数量 --> 默认 0
 */
export function getSongMenuList(cat = "全部", limit = 6, offset = 0){ 
    return http.get({
        url: "/top/playlist",
        data:{
            cat, limit, offset
        }
    })
}

/**
 * 获取歌单所有标签列表
 */
export function getSongMenuTags(){
    return http.get({
        url:"/playlist/hot"
    })
}


