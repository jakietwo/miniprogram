// pages/map/map.js
let amapFile = require("../../libs/amap-wx.js")
let markerData = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: '9335f7cec9da19c48dbc8d9a06c035b3'
    });
    myAmapFun.getPoiAround({
      success: function(data) {
        //成功回调
      },
      fail: function(info) {
        //失败回调
        console.log(info)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  markertap: function(e) {
    let id = e.markerId
    let that = this
    that.showMarkerInfo(markerData, id)
    that.changeMarkerColor(markerData, id)
  }
})