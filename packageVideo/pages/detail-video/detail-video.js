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
        
        // -- 数据请求
        this.fetchMVUrl() // -- 请求视频 url 地址...
        this.fetchMVInfo()
        this.fetchSimiMV()

        // -- 计算 video 组件在页面的高度 --> 对下面的其它组件进行下移相应距离 <video 组件通过 fixed 定位固定在顶部>
        
    },

    async fetchMVUrl(){ 
        const res = await getMVUrl(this.data.id) 
        this.setData({ mvUrl:res.data.url })
    },
    async fetchMVInfo(){
        const res = await getMVInfo(this.data.id)
        this.setData({ mvInfo: res.data })
    },

    // async fetchMVRelated(){
    //     const res = await getMVRelate(this.data.id)
    //     this.setData({ relatedRideo: res.data })
    // },

    async fetchSimiMV(){
        const res = await getSimiMV(this.data.id)
        this.setData({ relatedRideo: res.mvs })
        console.log(res,this.data.relatedRideo);
    },

    onEntrySimiMVTap(e){ // -- 相关视频点击的跳转
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: `/packageVideo/pages/detail-video/detail-video?id=${id}`,
        })
    }
})