// pages/message/message.js
const app = getApp()
const db = wx.cloud.database()
let recordManager
const util = require('../../utils/formatTime.js')
const handleTime = require('./../../utils/index.js')
let innerAudio = wx.createInnerAudioContext()
innerAudio.onPlay(() => {
  console.log('开始播放录音')
})
innerAudio.onError((error) => {
  console.log(error)
  console.log('出错了')
  wx.showToast({
    title: '网络状态不好！',
    icon: 'none'
  })
})
innerAudio.onEnded(() => {
  console.log('借束播放录音')
  // setTimeout(()=>{
  //   app.globalData.innerAudioContext.play()
  // },1000)
})
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
    selected: 0,
    commentData: [],
    isShowRecord: false,
    isShowRecordBtn: true,
    audioInfo: {},
    hadRecord: false,
    audioId: '',
    recordData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取数据
    this.getBlessWordsData()
    this.getRecordData()
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
    app.globalData.innerAudioContext.pause()
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
    app.globalData.innerAudioContext.play()
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
  // choose dif btn
  chooseNavBar() {
    this.setData({
      selected: !this.data.selected
    })
  },
  // 获取祝福列表以及文字
  getBlessWordsData() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    db.collection('userBlessing').get({
      success(res) {
        // 获取到评论数据
        // 对数据按时间排序
        let data = handleTime.orderByTime(res.data)
        that.setData({
          commentData: data
        })
        wx.hideLoading();
      },
      fail(info) {
        console.log(info)
        wx.hideLoading();
      }
    })
  },
  // 获取所有录音数据
  getRecordData(){
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    db.collection('userRecord').get({
      success(res){
        let data = res.data
        wx.hideLoading()
        if(data.length>0){
          data = handleTime.orderByTime(data)
          data = handleTime.toFix(data)
          that.setData({
            recordData: data
          })
        }
      },
      fail(info){
        console.log(info)
        wx.hideLoading();
      }
    })
  },
  // 用户点击发文字祝福 && 获取用户个人信息
  bindGetUserInfo(e) {
    let that = this

    this.setData({
      userInfo: e.detail.userInfo
    })
    // 将用户信息发globalData
    if (e.detail.userInfo.nickName) {
      app.globalData.userInfo = e.detail.userInfo
      // 已获得用户信息
      db.collection('userInfo').where({
        _openid: app.globalData.openid
      }).get({
        success(res) {

          let resdata = res.data
          if (resdata.length) {
            if (resdata[0].forbidden) {
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
        fail(info) {
          console.log(info)
        }
      })
    }
  },
  // 点击语音祝福按钮
  bindGetRecord(e) {
    let that = this
    // 询问授权
    if(!e.detail.userInfo){
      wx.showToast({
        title: '请授予用户信息权限',
        icon: 'none'
      })
      return 
    }
    wx.getSetting({
      success: (res) => {
        // 是否授权用户信息
        if (res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success(res){
              that.setData({
                userInfo: res.userInfo
              })
    
              app.globalData.userInfo = res.userInfo 
            },
            fail(info){
              console.log(info)
            }
          })
        }else {

        }
        if (res.authSetting['scope.record']) {
          // 已经授权 
          // show 录音页面
          that.showRecordWrapper()
        } else {
          // 没有授权则询问是否授权
          console.log('没有授权')
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 已经授权 可以使用record
              console.log('同意录音')
              that.showRecordWrapper()
            },
            fail(info) {
              wx.showToast({
                title: '你没有授权录音!',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
  // 点击取消按键
  cancelWord() {
    this.setData({
      isShowComment: false
    })
  },
  // 点击取消录音
  cancelRecord() {
    this.setData({
      isShowRecord: false,
      hadRecord: false
    })
  },
  // 发送文字祝福
  sendWord(e) {
    // 发送文字祝福
    // 先验证数据
    let that = this
    let value = e.detail.value.value

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
      success(res) {
        // 增加成功
        wx.showToast({
          title: '您的祝福已送达!',
        })
        that.setData({
          isShowComment: false
        })
        // todo 刷新列表数据
        that.getBlessWordsData()
      },
      fail(info) {
        console.log(info)
      }
    })
  },
  // 显示录音界面
  showRecordWrapper() {
    this.setData({
      isShowRecord: true
    })
  },
  // 开始录音
  touchStart() {
    let that = this
    wx.vibrateLong()
    wx.showToast({
      title: '正在录音ing',
      icon: "none",
      duration: 200000
    })
    // 开始录音 停止播放音乐
    // app.globalData.innerAudioContext.pause()
    console.log('开始')
    recordManager = wx.getRecorderManager()
    // 监听录音结束
    recordManager.onStop((res) => {
   
      // 录音结束 不管时长问题都要继续播放音乐
      // app.globalData.innerAudioContext.play()
      // 录音时长大于500 则有效
      if (res.duration > 500) {
        that.setData({
          audioInfo: res,
          hadRecord: true
        })
        // 将临时文件上传
        console.log('录音文件', res)
        const time = new Date().getTime()
        wx.cloud.uploadFile({
          cloudPath: time + '.mp3', // 上传至云端的路径
          filePath: res.tempFilePath, // 小程序临时文件路径
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          success: res1 => {
            // 返回文件 ID
  
            console.log('上传成功后结果', res1)
            that.setData({
              audioId: res1.fileID
            })
          },
          fail: console.error
        })
      }else{
        // 录音时长太短
        wx.showToast({
          title: '录音时长太短',
          icon: 'none'
        })
      }
    })
    recordManager.onStart(res => {
      console.log('1231')
    })
    recordManager.start({
      format: 'mp3',
      duration: 120000,
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 24000, //编码码率
      frameSize: 50, //指定帧大小，单位 KB
    })
  },
  touchEnd() {
    console.log('结束')
    wx.hideToast()
    recordManager.stop()
  },

  // 发送录音祝福
  sendRecord() {
    let that = this
    let userInfo = that.data.userInfo
    let time = util.formatTime(new Date())
    db.collection('userRecord').add({
      data: {
        avatarUrl: userInfo.avatarUrl,
        audioId: that.data.audioId,
        nickName: userInfo.nickName,
        time: time,
        duration: that.data.audioInfo.duration
      },
      success: (res)=>{
        console.log('发送祝福成功')
        wx.showToast({
          title: '发送祝福成功！',
          icon: 'success'
        })
        that.cancelRecord()
        that.getRecordData()
      },
      fail: (info)=>{
        wx.showToast({
          title: '发送语音祝福失败!',
          icon: 'none'
        })
        console.log('发送语音祝福失败')
      }
    })
  },
  playAudio() {
    if (this.data.audioId) {
      innerAudio.src = this.data.audioId

      // app.globalData.innerAudioContext.pause()
      setTimeout(()=>{
        innerAudio.play()
      },700)

    } else {
      wx.showToast({
        title: '没有资源无法播放',
        icon: 'none'
      })
    }
  },
  playSingleAudio(e){
    let audioId = e.currentTarget.dataset.id
    innerAudio.src = audioId
    setTimeout(() => {
      innerAudio.play()
    }, 800)
    // wx.getSetting({
    //   success(res){
    //     if (res.authSetting['scope.record']) {
        
    //     }else{
    //       wx.authorize({
    //         scope: 'scope.record',
    //         success() {
    //           // 已经授权 可以使用record
    //           console.log('同意录音')
    //           that.playPeopleAudio(audioId)
    //         },
    //         fail(info) {
    //           wx.showToast({
    //             title: '你没有授权录音!',
    //             icon: 'none'
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },
  playPeopleAudio(audioId){
  
    
    // app.globalData.innerAudioContext.pause()
   
  }
})