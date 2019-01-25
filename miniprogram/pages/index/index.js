//index.js
const app = getApp()
const db = wx.cloud.database()
let innerAudioContext
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    openId: '',
    animationData: [],
    array: [{
      message: '获取个人信息'
    }],
    imgUrls: [
      'https://6a61-jakietwo-1c0bb9-1253201912.tcb.qcloud.la/小强/1-1.jpg?sign=177e75ecb71767cc279485bbe8c57bc6&t=1548213327',
      'https://6a61-jakietwo-1c0bb9-1253201912.tcb.qcloud.la/小强/2.jpg?sign=f1ae4a80d3553351f70b6674bc74d87b&t=1548214084',
      'https://6a61-jakietwo-1c0bb9-1253201912.tcb.qcloud.la/小强/3.jpg?sign=2e03e9cb0ed9739cfd12904e459bbb3e&t=1548214443',
      'https://6a61-jakietwo-1c0bb9-1253201912.tcb.qcloud.la/小强/4.jpg?sign=63ec2cb47b7543aaa1a6636b2997f9f9&t=1548214465'
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

    // 获取用户openId
    that.onGetOpenid()

    // 播放音乐
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = 'https://6a61-jakietwo-1c0bb9-1253201912.tcb.qcloud.la/1.mp3?sign=591b6ce3824c59a4e905bccff6e76c6d&t=1548120575'
    innerAudioContext.onPlay(() => {
      console.log('开始播放音乐')
    })
    innerAudioContext.onPause(() => {
      console.log('暂停')
    })
    innerAudioContext.onError(() => {
      console.log('播放失败')
    })
    innerAudioContext.play()


    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log('已经青请求过的权限', res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              // 判断用户信息是否存在数据库 没有则添加
              db.collection('userInfo').where({
                nickname: res.userInfo.nickname
              }).get({
                success(res1) {
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

            }
          })
        } else {
          // 用户没有授予getUserInfo 权限
          // 则询问是否授予
          // that.requestUserInfoFunction()
        }
        // 是否授予位置权限
        if (!res.authSetting['scope.userLocation']) {
          // 用户没有授予位置权限
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用位置信息 则调用位置信息
              wx.getLocation({
                success: function(res) {
                  const latitude = res.latitude
                  const longitude = res.longitude
                  const speed = res.speed
                  const accuracy = res.accuracy
                
                },
              })
            
            }
          })
        } else {
          // 用户已经授予位置权限 直接调用wx.getLocation
          wx.getLocation({
            success: function(res) {
              const latitude = res.latitude
              const longitude = res.longitude
              const speed = res.speed
              const accuracy = res.accuracy
        
              // 将用户地址信息存入数据库 todo
              // 先查看用户是否存在数据库
              that.uploadUserAddress(res)
            },
          })
        }
      },

    })
    wx.cloud.callFunction({
      name: 'login',
      success: function(data) {
        that.setData({
          openId: data.result.openid
        })
      },
      fail: function(e) {
        console.log(e)
      }
    })
    db.collection('userSystem').where({
      _openid: that.openId
    }).get({
      success(res) {
        if (!res.data.length) {
          // 说明用户系统信息不存在数据库 则添加
          // 获取系统信息
          wx.getSystemInfo({
            success: function(res2) {
              wx.cloud.callFunction({
                name: 'userSystemInfo',
                data: res2,
                success: res3 => {
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
    // 给文字添加动画
    // const animation = wx.createAnimation({
    //   duration: 1000,
    //   timingFunction: 'ease',
    // })
    // this.animation = animation

    // animation.step()
    // this.setData({
    //   animationData: animation.export()
    // })

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
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
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
  // 转发分享小程序
  onShareAppMessage() {

  },
  // 页面展现默认调用的方法
  onShow() {
    console.log('123456', innerAudioContext)
    if (innerAudioContext) {
      innerAudioContext.play()
    }
  },
  // 封装询问是否授予用户信息函数
  requestUserInfoFunction() {
    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        // 用户已经同意小程序使用用户信息
       
        wx.getUserInfo({
          success: res => {
            this.setData({
              avatarUrl: res.userInfo.avatarUrl,
              userInfo: res.userInfo
            })
            // 判断用户信息是否存在数据库 没有则添加
            db.collection('userInfo').where({
              nickname: res.userInfo.nickname
            }).get({
              success(res1) {
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

          }
        })
      },
      fail() {
        // 用户拒绝授权
        wx.showToast({
          title: '你已拒绝授权位置,可能会影响使用',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 将用户地理位置信息上传服务器
  uploadUserAddress(data) {
    // 先判断是否已上传过此人位置
    // if 存在则更新位置
    // 不存在就新增位置
    db.collection('userLocation').where({
      _openid: app.globalData.openid
    }).get({
      success: (res) => {
      
        if (res.data.length) {
          // 存在用户 则更新
        
          db.collection('userLocation').doc(res.data[0]._id).set({
            data: data,
            success: console.log,
            fail: console.error
          })
        } else {
          // 不存在则添加
          db.collection('userLocation').add({
            data: data,
            success: (res1) => {
              console.log('添加用户位置信息成功', res1)
            },
            fail: (info) => {
              console.log('添加失败', info)
            }
          })
        }
      },
      fail: (info) => {

      }
    })
  }
})