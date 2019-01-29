// pages/me/me.js
const app = getApp()
const db = wx.cloud.database()
const util = require('../../utils/formatTime.js')
const handleTime = require('./../../utils/index.js')
const getColor = require('./../../utils/randomDanmuColor.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    danmuList: [],
    danmuValue: '',
    danmuData: [],
    userInfo: {},
    danmuColor: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取数据和评论列表
    wx.showLoading({
      title: '加载数据ing',
    })
    this.getCommentList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.videoContext = wx.createVideoContext('myVideo')
    app.globalData.innerAudioContext.pause()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    app.globalData.innerAudioContext.play()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 所有自定义方法

  // 获取弹幕列表
  getCommentList() {
    let that = this
    db.collection('danmuData').get({
      success(res) {
        wx.hideLoading()
        let data = res.data
        if (data.length) {
          data = handleTime.orderByDateTime(data)
          // 弹幕列表需要根据time来显示具体时间
          // 对time 排序
          let danmu = []
          danmu = handleTime.orderByTime(data)
  
          that.setData({
            danmuData: data,
            danmuList: danmu
          })
        }
      },
      fail(info) {
        wx.hideLoading()
      }
    })
  },
  // 获取用户输入弹幕
  bindInputBlur(e) {
    this.setData({
      danmuValue: e.detail.value
    })
  },
  // 点击发送按钮
  sendDanmu(e) {
    let that = this
  
    // 判断是否授权用户信息
    if (!e.detail.userInfo) {
      return
    }
    this.setData({
      userInfo: e.detail.userInfo
    })
    if (that.data.danmuValue) {
      // 保存字体弹幕颜色
      that.setData({
        danmuColor: getColor.getRandomColor()
      })
      // 存弹幕到数据库以及显示弹幕到屏幕
      this.videoContext.sendDanmu({
        text: this.data.danmuValue,
        color: this.data.danmuColor
      })
    
      // 将弹幕存数据库
      let userInfo = that.data.userInfo
      let dateTime = util.formatTime(new Date())
      if (!that.currentTime) {
        that.currentTime = 0
      }
      db.collection('danmuData').add({
        data: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          dateTime: dateTime,
          text: that.data.danmuValue,
          time: parseInt(that.currentTime.toFixed(1)),
          color: that.data.danmuColor
        },
        success(res) {
          console.log('发送弹幕成功')
          that.getCommentList()
        },
        fail(info) {
          console.log('发送弹幕失败')
        }
      })
    } else {
      wx.showToast({
        title: '请输入弹幕!',
        icon: 'none'
      })
    }
  },
  // 获取播放进度
  bindVideoTime(e) {
    this.currentTime = e.detail.currentTime
  }
})