//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    openId: '',
    array: [
      {message: '获取个人信息'}
    ],
    imgUrls:[
      '../../images/swipe/11',
      '../../images/swipe/25',
      '../../images/swipe/31'
    ]
  },

  onLoad: function() {
    let that = this
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    const db = wx.cloud.database()
    // 获取用户信息
    wx.getSetting({
      success: res => { 
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              console.log('0000',res.userInfo)
              console.log('1111', )
              // 判断用户信息是否存在数据库 没有则添加
              db.collection('userInfo').where({
                nickname: res.userInfo.nickname
              }).get({
                success(res1) {
                  console.log(res1)
                  if (!res1.data.length) {
                    db.collection('userInfo').add({
                      data: res.userInfo,
                      success(res) {
                        console.log(' 增加成功')
                      },
                      fail(info) {
                        console.log('增加失败')
                      }
                    })
                  }
                },
                fail(info) {
                  console.log(info)
                }
              })
              console.log('用户', res)
            }
          })
        }
      },
  
    })
    wx.cloud.callFunction({
      name: 'login',
      success: function (data) {
        that.setData({
          openId: data.result.openid
        })
      },
      fail: function(e){
        console.log(e)
      }
    })
    db.collection('userSystem').where({
      _openid: that.openId
    }).get({
      success(res){
        if(!res.data.length ){
          // 说明用户系统信息不存在数据库 则添加
          // 获取系统信息
          wx.getSystemInfo({
            success: function(res2) {
              wx.cloud.callFunction({
                name: 'userSystemInfo',
                data: res2,
                success: res3 =>{
                  // 将用户系统数据添加到数据库
                  db.collection('userSystem').add({
                    data: res2,
                    success: addData => {
                      console.log('增加系统信息ok')
                    }
                  })
                }
              })
            },
          })
        }
      }
    })
    // wx.getSystemInfo({
    //   success: function(res) {
    //     console.log(res)
    //     wx.cloud.callFunction({
    //       name: 'userSystemInfo',
    //       data: res,
    //       success: function(e) {
    //         console.log('云函数', e)
    //       },
    //       fail: error=>{
    //         console.log('123123',error)
    //       }
    //     })
    //     console.log(res)
    //     // 用户系统
    //     // const userSysInfo = db.collection('userSystem').add({
    //     //   data: res,
    //     //   success(res) {
    //     //     console.log(res)
    //     //   },
    //     //   fail(res) {
    //     //     console.log(res)
    //     //   }
    //     // })
    //   },
    // })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})