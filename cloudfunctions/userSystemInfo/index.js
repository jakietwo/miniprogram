// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
    // 上传用户系统信息
  const { userInfo, res } = event
  console.log('调用云函数')
  const db = cloud.database()
  db.collection('userSystem').add({
    data: res,
    success(res) {
      console.log('=====', res)
    },
    fail(res){
      console.log('-----', res)
    }
  })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}