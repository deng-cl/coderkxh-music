import { getSongMenuList, getSongMenuTags } from "../../services/handleRequest/index"

Page({

    data: {
        menuListAll:[]
    },


    onLoad(options) {
        this.fetchAllSongMenuList()
    },
     
    async fetchAllSongMenuList(){
        const tagRes = await getSongMenuTags()
        const tags = tagRes.tags

        const promiseAll = []
        tags.forEach(tag => {
            const promise = getSongMenuList(tag.name)
            promiseAll.push(promise)
        })

        Promise.all(promiseAll).then(res => {
            console.log(res);
            this.setData({ menuListAll: res })
        })
    },

})