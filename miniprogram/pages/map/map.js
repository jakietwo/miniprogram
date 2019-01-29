// pages/map/map.js
// 32.7010500000,112.0906700000
// const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js')
const app = getApp()
let qqmapsdk
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      // iconPath: '/images/location.svg',
      id: 0,
      latitude: '32.70105',
      longitude: '112.09067',
      width: 40,
      height: 40
    }],
    latitude: '32.70105',
    longitude: '112.09067',
    originAddress: ['112.09067', '32.70105'],
    textData: {
      name: '香江湾大酒店',
      address: '地址：南阳市邓州市蓝湾嘉园西大门口'
    },   
    showText: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // qqmapsdk = new QQMapWX({
    //   key: 'TXKBZ-P2EKQ-L7C5E-GBGDG-HEPF7-6PFJ7'
    // })
    // qqmapsdk.search({
    //   keyword: '酒店',
    //   success: function(res) {
    //     console.log(res);
    //   },
    //   fail: function(res) {
    //     console.log(res);
    //   },
    //   complete: function(res) {
    //     console.log(res);
    //   }
    // })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    app.globalData.innerAudioContext.play()
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
  // all methods create by user

  // 点击marker事件
  markerTap(e){
    console.log(e)
    this.setData({
      showText: true,
      textData: {
        name: '香江湾大酒店',
        address: '地址：南阳市邓州市蓝湾嘉园西大门口'
      }      
    })
  }
})