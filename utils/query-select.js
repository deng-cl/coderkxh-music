
function querySelect(selector){
    return new Promise((resolve,reject) => {
        const query = wx.createSelectorQuery() // -- 1. 创建一个 query 查询对象
        query.select(selector).boundingClientRect() // -- 2. 通过 query.select(selector) 获取对应的组件实例查询对象 --> boundingClientRect 方法获取对应实例的矩形等信息
        query.exec(res => { // -- 3. 通过 query 查询对象的 exec 方法，来执行上面的语句 --> 对应的数据在其回调参数中
            resolve(res)
        }) 
    })
}
export default querySelect

