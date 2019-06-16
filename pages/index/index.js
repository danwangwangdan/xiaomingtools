//index.js
//获取应用实例
const app = getApp()
let interstitialAd = null
Page({
  data: {
    isBtnShow: false,
    url: '',
    status: '正在获取支持的平台...',
    isTextNull: 0,
    modalHidden: true,
    bnrUrl: ["https://loveshiming.oicp.vip/img/qun.png",
      "https://loveshiming.oicp.vip/img/qun.png"
    ],
    bnrUrl2: ["https://loveshiming.oicp.vip/img/cash.png"],
    bnrUrl3: ["https://loveshiming.oicp.vip/img/qun.png"]
  },
  /**
   * 显示弹窗
   */
  showPic: function() {
    console.log("showPic");
    this.setData({
      modalHidden: false
    })
  },
  /**
   * 点击取消
   */
  modalCandel: function() {
    // do something
    this.setData({
      modalHidden: true
    })
  },
  previewImg: function(e) {
    console.log(e.currentTarget.dataset.index);
    var index = 0;
    var bnrUrl = this.data.bnrUrl;
    wx.previewImage({
      current: bnrUrl[index], //当前图片地址
      urls: bnrUrl, //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   *  点击确认
   */
  modalConfirm: function() {
    // do something
    this.setData({
      modalHidden: true
    })
  },
  //事件处理函数
  toDecode: function() {
    var that = this;
    console.log(that.data.url)
    if (wx.getStorageSync("userInfo") == undefined || wx.getStorageSync("userInfo") == "") {
      wx.showModal({
        title: '未登录',
        content: '必须登录后才能使用，点击确定后授权微信登录',
        success: function(res) {
          if (res.confirm) {
            wx.login({
              success(res) {
                if (res.code) {
                  //发起网络请求
                  wx.request({
                    url: app.globalData.myApiUrl + 'hishelp/shuiyin/login?code=' + res.code,
                    method: 'GET',
                    success(res) {
                      console.log(res.data);
                      wx.hideLoading();
                      var userInfo = res.data.data;
                      if (userInfo != null) {
                        wx.showToast({
                          title: '登录成功！',
                          icon: 'none',
                          duration: 3000
                        })
                        wx.setStorageSync("userInfo", userInfo);
                        that.onLoad();
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
    } else { // 已登录

      if (wx.getStorageSync("userInfo").point < 2) {
        wx.showModal({
          title: '积分不足2分',
          content: '解析不扣除积分，但先去个人中心完成简单的任务增加积分哦',
          success: function(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/me/me'
              })
            } else if (res.cancel) {

            }
          }
        });
      } else {
        if (that.data.url.indexOf('http') > -1) {
          wx.navigateTo({
              url: '/pages/save/save?url=' + that.httpString(that.data.url)
            });
          // if (that.data.url.indexOf('weishi') > -1) {
          //   wx.navigateTo({
          //     url: '/pages/save/save?url=' + encodeURIComponent(that.data.url)
          //   });
          // } else {
          //   wx.navigateTo({
          //     url: '/pages/save/save?url=' + that.data.url
          //   });
          // }
        } else {
          wx.showToast({
            title: '要输入正确的链接呀！',
            icon: 'none',
            duration: 3000
          })
        }
      }
    }
  },
  bindUrlClear: function() {
    this.setData({
      url: '',
      isTextNull: 0
    })
  },
  bindTest: function() {
    this.setData({
      url: 'http://v.douyin.com/Mw5coA/',
      isTextNull: 1
    })
  },
  pasteUrl: function() {
    var that = this;
    wx.getClipboardData({
      success(res) {
        if (res.data != null && res.data != '') {
          that.setData({
            url: res.data,
            isTextNull: 1
          });
        } else {
          wx.showToast({
            title: '剪切板为空！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });

  },
  bindUrlValue: function(e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      url: value,
      isTextNull: 1
    })
    if (value == '') {
      that.setData({
        isTextNull: 0
      })
    }
  },
  bindCash: function(e) {
    var bnrUrl2 = this.data.bnrUrl2;
    wx.previewImage({
      current: bnrUrl2[0], //当前图片地址
      urls: bnrUrl2, //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  bindAdvice: function(e) {
    var bnrUrl3 = this.data.bnrUrl3;
    wx.previewImage({
      current: bnrUrl3[0], //当前图片地址
      urls: bnrUrl3, //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onLoad: function() {

    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-e7d9cd4b1f5a4c00'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    };
    if (wx.getStorageSync("userInfo") == undefined || wx.getStorageSync("userInfo") == "") {
      //未登录，请前去登录
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
                    url: app.globalData.myApiUrl + 'hishelp/shuiyin/login?code=' + res.code,
                    method: 'GET',
                    success(res) {
                      console.log(res.data);
                      wx.hideLoading();
                      var userInfo = res.data.data;
                      if (userInfo != null) {
                        wx.showToast({
                          title: '登录成功！',
                          icon: 'none',
                          duration: 3000
                        })
                        wx.setStorageSync("userInfo", userInfo);
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
      wx.authorize({
        scope: "scope.writePhotosAlbum"
      })
    }

  },
  onShow: function() {
    var that = this;
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
    wx.getClipboardData({
      success(res) {
        var lastUrl = wx.getStorageSync('lastUrl');
        if (res.data.indexOf('http') > -1 && lastUrl != res.data) {
          console.log(res.data);
          that.setData({
            url: res.data,
            isTextNull: 1
          });
          wx.setStorage({
            key: 'lastUrl',
            data: res.data
          })
          wx.showToast({
            title: '自动获取成功',
            icon: 'success',
            duration: 1500
          });
        }
      }
    })
    wx.request({
      url: app.globalData.myApiUrl + 'hishelp/shuiyin/find?id=' + wx.getStorageSync("userInfo").id,
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        var userInfo = res.data.data;
        if (userInfo != null) {
          wx.setStorageSync("userInfo", userInfo);
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
    wx.request({
      url: 'https://loveshiming.oicp.vip/hishelp/common/dystatus',
      method: 'GET',
      success(res) {
        console.log(res.data);
        if (res.data != null && res.data.data != null) {
          that.setData({
            status: res.data.data.noticeText == '' ? '抖音正常 快手正常 火山正常' : res.data.data.noticeText
          })
        }
      },
      fail() {
        $stopWuxRefresher() //停止下拉刷新
        wx.showToast({
          title: '网络请求失败，请稍后重试！',
          icon: 'none',
          duration: 3000
        })
      }
    });


  },
  //转发
  onShareAppMessage: function(res) {

  },

  httpString: function(s) {
    var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
    var reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    s = s.match(reg);
    return (s)
  }
})