import { getMVInfo, getMVRelate, getMVUrl, getSimiMV } from "../../../services/handleRequest/rideo"

Page({
    data:{
        id:0,
        mvUrl:"",
        mvInfo:{},
        relatedRideo:[],
        danmuList:[
            { text:"Coderkxh001" , color:"#ffffff", time: 3 }
        ]
    },
    onLoad(options){
        this.setData({ id: options.id })  
        
        
        this.fetchMVUrl() 
        this.fetchMVInfo()
        this.fetchSimiMV()

        
        
    },

    async fetchMVUrl(){ 
        const res = await getMVUrl(this.data.id) 
        this.setData({ mvUrl:res.data.url })
    },
    async fetchMVInfo(){
        const res = await getMVInfo(this.data.id)
        this.setData({ mvInfo: res.data })
    },


    async fetchSimiMV(){
        const res = await getSimiMV(this.data.id)
        this.setData({ relatedRideo: res.mvs })
        console.log(res,this.data.relatedRideo);
    },

    onEntrySimiMVTap(e){ 
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: `/packageVideo/pages/detail-video/detail-video?id=${id}`,
        })
    }
})