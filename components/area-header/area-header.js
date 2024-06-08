// components/area-title/area-title.js
Component({
    properties:{
        title:{
            type:String,
            value:"默认标题"
        },
        hasMore:{
            type:Boolean,
            value: true
        }
    },

    methods:{
        onMoreTap(){
            this.triggerEvent("onClickMore") // -- 当 点击该组件中的 "更多" 时，向外部发射一个 onChangeMoreClick 事件
        }
    }
})