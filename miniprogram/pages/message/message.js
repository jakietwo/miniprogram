// pages/message/message.js
const app = getApp()
const db = wx.cloud.database()
const util = require('../../utils/formatTime.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    forbidden: false,
    isShowComment: false,
    animationData: {},
    blessWord: '',
    userInfo: {},
    selected: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取数据
    this.getBlessWordsData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // choose dif btn
  chooseNavBar(){
    this.setData({
      selected: !this.data.selected
    })
  },
  // 获取祝福列表以及文字
  getBlessWordsData(){
    wx.showLoading({
      title: '加载中',
    })
    db.collection('userBlessing').get({
      success(res){
        console.log(res)
      },
      fail(info){
        console.log(info)
      }
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 1000)  
  },
  // 用户点击发文字祝福 && 获取用户个人信息
  bindGetUserInfo(e){
    let that = this
    console.log(e.detail.userInfo)
    console.log(app.globalData)
    this.setData({
      userInfo: e.detail.userInfo
    })
    // 将用户信息发globalData
    if(e.detail.userInfo.nickName){
      app.globalData.userInfo = e.detail.userInfo
      // 已获得用户信息
      db.collection('userInfo').where({
        _openid: app.globalData.openid
      }).get({
        success(res){
          console.log(res)
          let resdata = res.data
          if(resdata.length){
            if(resdata[0].forbidden){
              // 用户已被禁止评论
              that.setData({
                forbidden: true
              })
              wx.showToast({
                title: '你已被禁止评论',
                icon: 'none'
              })
            }
            // 用户可以正常使用
            that.setData({
              isShowComment: true
            })
          }
        },
        fail(info){
          console.log(info)
        }
      })
    }
  },
  // 点击取消按键
  cancelWord(){
    this.setData({
      isShowComment: false
    })
  },
  sendWord(e){
    // 发送文字祝福
    // 先验证数据
    let that = this
    let value = e.detail.value.value
    console.log(value);
    this.setData({
      blessWord: value
    })
    // 存祝福到数据库
    let time = util.formatTime(new Date())
    db.collection('userBlessing').add({
      data: {
        comment: value,
        nickName: that.data.userInfo.nickName,
        avatarUrl: that.data.userInfo.avatarUrl,
        time: time
      },
      success(res){
        // 增加成功
        wx.showToast({
          title: '您的祝福已送达!',
        })
        that.setData({
          isShowComment: false
        })
        // todo 刷新列表数据
      },
      fail(info){
        console.log(info)
      }
    })
  }

})