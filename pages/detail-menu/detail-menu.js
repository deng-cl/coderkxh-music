import { getSongMenuList, getSongMenuTags } from "../../services/handleRequest/index"

Page({

    data: {
        menuListAll:[]
    },


    onLoad(options) {
        this.fetchAllSongMenuList()
    },
     
    async fetchAllSongMenuList(){
        // -- 1. 获取所有歌单标签信息
        const tagRes = await getSongMenuTags()
        const tags = tagRes.tags

        // -- 2. 请求所有标签的歌单列表: 这里先将每一个请求都 push 进 promiseAll 中，在使用 Promise.all(promiseAll) 来监听所有请求都成功后，在进行对应的 this.setData 赋值 <避免在多次调用 this.setData 方法> 
        const promiseAll = []
        tags.forEach(tag => {
            const promise = getSongMenuList(tag.name)
            promiseAll.push(promise)
        })

        // 3. 监听所有标签歌单列表的请求
        Promise.all(promiseAll).then(res => {
            console.log(res);
            this.setData({ menuListAll: res })
        })
    },

})