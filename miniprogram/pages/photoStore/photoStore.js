// pages/photoStore/photoStore.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://6a61-jakietwo-1c0bb9-1253201912.tcb.qcloud.la/小强/5.jpg?sign=4a8fdfd7d831c285a30d3352e69660bc&t=1548293381',
      'cloud://jakietwo-1c0bb9.6a61-jakietwo-1c0bb9/小强/6.jpg',
      'cloud://jakietwo-1c0bb9.6a61-jakietwo-1c0bb9/小强/7.jpg',
      'cloud://jakietwo-1c0bb9.6a61-jakietwo-1c0bb9/小强/8.jpg',
      'cloud://jakietwo-1c0bb9.6a61-jakietwo-1c0bb9/小强/9.jpg',
      'cloud://jakietwo-1c0bb9.6a61-jakietwo-1c0bb9/小强/10.jpg'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.innerAudioContext.play()
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

  }
})