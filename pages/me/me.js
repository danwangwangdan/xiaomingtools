var app = getApp()
let videoAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '姓名',
    imgSrc: '',
    point: 2,
    isLogin: 0,
    signCount: 0,
    shareCount: 0,
    videoCount: 0,
  },
  toSign: function(options) {
    var that = this;
    var currPoint = that.data.point;
    var currSignPoint = that.data.signCount;
    console.log("签到" + currPoint);
    wx.request({
      url: app.globalData.myApiUrl + 'hishelp/shuiyin/add?id=' + wx.getStorageSync("userInfo").id + '&type=3',
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        var data = res.data;
        if (data.code >= 0) {
          wx.showToast({
            title: ' 签到成功，增加10积分！',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            point: currPoint + 10,
            signCount: currSignPoint + 1,
          })
        } else if (data.code == -102) {
          wx.showToast({
            title: ' 您今天已经签过到了，请明天再来！',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: ' 服务器异常，请稍后重试！',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail() {
        wx.showToast({
          title: '网络请求失败，请稍后重试！',
          icon: 'none',
          duration: 3000
        })
      }
    });
  },

  toShare: function(options) {
    console.log("分享");
  },
  toVideo: function(options) {
    console.log("视频");
    var that = this;
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })



    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;

    if (res.from === 'button') {
      var currPoint = that.data.point;
      var currShareCount = that.data.shareCount;
      console.log("来自页面内转发按钮");
      console.log(res.target);
      wx.request({
        url: app.globalData.myApiUrl + 'hishelp/shuiyin/add?id=' + wx.getStorageSync("userInfo").id + '&type=2',
        method: 'GET',
        success(res) {
          console.log(res.data);
          wx.hideLoading();
          var data = res.data;
          if (data.data != null && data.code >= 0) {
            wx.showToast({
              title: '分享成功，增加1积分！',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              point: currPoint + 1,
              shareCount: (currShareCount > 0) ? 1 : (currShareCount + 1),
            })
          }
        },
        fail() {
          wx.showToast({
            title: '网络请求失败，请稍后重试！',
            icon: 'none',
            duration: 3000
          })
        }
      });
    } else {
      console.log("来自右上角转发菜单")
    }
    return {
      title: '我发现了一个好用的短视频去水印工具',
      path: '/pages/me/me',
      success: function(res) {
        console.log('成功', res)
      }
    }
  },
  sRequest: function() {
    wx.request({
      url: app.globalData.myApiUrl + 'hishelp/shuiyin/srequest?id=' + wx.getStorageSync("userInfo").id,
      method: 'GET',
      success(res) {
        console.log(res.data);
        if (res.data.code >= 0) {
          wx.showToast({
            title: '特殊请求成功！',
            icon: 'none',
            duration: 3000
          })
        }else{
          wx.showToast({
            title: '网络请求失败，请稍后重试！',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail() {
        wx.showToast({
          title: '网络请求失败，请稍后重试！',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {

    var that = this;
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-498062c378a63ba4'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {
        wx.showToast({
          title: '暂无合适的广告，请稍后再尝试！',
          icon: 'none',
          duration: 2000
        })
      });
      videoAd.onClose(res => {
        var currPoint = that.data.point;
        var currVideoCount = that.data.videoCount;
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          console.log("广告播放完毕");

          wx.request({
            url: app.globalData.myApiUrl + 'hishelp/shuiyin/add?id=' + wx.getStorageSync("userInfo").id + '&type=1',
            method: 'GET',
            success(res) {
              console.log(res.data);
              wx.hideLoading();
              var data = res.data;
              if (data.code >= 0) {
                wx.showToast({
                  title: '观看成功，增加5积分！',
                  icon: 'none',
                  duration: 2000
                });
                videoAd = wx.createRewardedVideoAd({
                  adUnitId: 'adunit-498062c378a63ba4'
                })
                that.setData({
                  point: currPoint + 5,
                  videoCount: currVideoCount + 1,
                })
              }
            },
            fail() {
              wx.showToast({
                title: '网络请求失败，请稍后重试！',
                icon: 'none',
                duration: 3000
              })
            }
          });
        } else {
          wx.showToast({
            title: '观看完广告才有积分奖励，谢谢支持！',
            icon: 'none',
            duration: 3000
          })
        }
      });
    }
    if (wx.getStorageSync("userInfo") == undefined || wx.getStorageSync("userInfo") == "") {
      //未登录，请前去登录
      that.setData({
        isLogin: 0
      })
      wx.showModal({
        title: '您尚未登录',
        content: '必须登录后才能使用，点击确定后授权微信登录',
        success: function(res) {
          if (res.confirm) {
            wx.login({
              success(res) {
                if (res.code) {
                  //发起网络请求
                  wx.request({
                    url: app.globalData.myApiUrl + 'hishelp/shuiyin/loginPro?code=' + res.code,
                    method: 'GET',
                    success(res) {
                      console.log(res.data);
                      wx.hideLoading();
                      var userInfo = res.data.data;
                      if (userInfo != null) {
                        wx.setStorageSync("userInfo", userInfo);
                        that.setData({
                          isLogin: 1
                        })
                        wx.showModal({
                          title: '登录成功',
                          content: '新用户将赠送您50积分，下载一次需要2积分，积分不够了可以去个人中心完成简单的任务获取',
                          success: function(res) {
                            if (res.confirm) {
                              wx.switchTab({
                                url: '/pages/me/me'
                              })
                            } else if (res.cancel) {
                              wx.showToast({
                                title: '任务极为简单，试一试就知道了哦',
                                icon: 'none',
                                duration: 2000
                              })
                            }
                          }
                        });
                      }
                    },
                    fail() {
                      wx.showToast({
                        title: '网络请求失败，请稍后重试！',
                        icon: 'none',
                        duration: 3000
                      })
                    }
                  })
                } else {
                  console.log('登录失败！' + res.errMsg)
                }
              }
            })
          } else if (res.cancel) {
            wx.showToast({
              title: '未登录将无法使用本程序！',
              icon: 'none',
              duration: 2000
            })
          }
        }
      });
    } else {
      that.setData({
        isLogin: 1
      })

      that.onShow();
    }
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
    var that = this;
    wx.request({
      url: app.globalData.myApiUrl + 'hishelp/shuiyin/find?id=' + wx.getStorageSync("userInfo").id,
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        var userInfo = res.data.data;
        if (userInfo != null) {
          wx.setStorageSync("userInfo", userInfo);
          that.setData({
            point: userInfo.point,
            videoCount: userInfo.videoCount,
            shareCount: userInfo.shareCount,
            signCount: userInfo.signCount
          });
        }
      },
      fail() {
        wx.showToast({
          title: '网络请求失败，请稍后重试！',
          icon: 'none',
          duration: 3000
        })
      }
    })
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

})