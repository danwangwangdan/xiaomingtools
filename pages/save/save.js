 const app = getApp()
// let videoAd = null
Page({
  data: {
    isSaveShow: false,
    isVedioShow: false,
    realUrl: '',
    isSaveBtnLoad: false,
    isSaveBtnDis: false,
    saveBtnText: '存至相册，2积分/次',
    bnrUrl: ["https://loveshiming.oicp.vip/img/qun.png",
      "https://loveshiming.oicp.vip/img/dybg.png"
    ],
    bnrUrl2: ["https://loveshiming.oicp.vip/img/cash.png"]
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
  toSave: function() {
    var that = this;
    // if (videoAd) {
    //   videoAd.show().catch(() => {
    //     // 失败重试
    //     videoAd.load()
    //       .then(() => videoAd.show())
    //       .catch(err => {
    //         console.log('激励视频 广告显示失败')
    //       })
    //   })

    //   videoAd.onClose(res => {
    //     // 用户点击了【关闭广告】按钮
    //     if (res && res.isEnded) {
    // 正常播放结束，可以下发游戏奖励
    wx.request({
      url: app.globalData.myApiUrl + 'hishelp/shuiyin/take?id=' + wx.getStorageSync("userInfo").id,
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        var data = res.data;

        if (data.code >= 0) {
          console.log("积分扣除");
          // 扣除积分，积分不够则提醒
          wx.showToast({
            title: '已扣除2积分， 开始存至相册！',
            icon: 'none',
            duration: 2000
          })

          wx.authorize({
            scope: "scope.writePhotosAlbum"
          })
          that.setData({
            isSaveBtnLoad: true,
            isSaveBtnDis: true
          })
          const downloadTask = wx.downloadFile({
            url: that.data.realUrl,
            success(res) {
              console.log("开始下载...")
              console.log(res)
              if (res.statusCode === 200) {
                wx.saveVideoToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success(res) {
                    console.log(res)
                    wx.showToast({
                      title: '保存成功，请去系统相册查看！',
                      icon: 'none',
                      duration: 3000
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: '连接服务器失败，请联系客服！',
                  icon: 'none',
                  duration: 3000
                })
              }
            }
          });
          downloadTask.onProgressUpdate((res) => {
            console.log('下载进度', res)
            that.setData({
              saveBtnText: '存至相册中' + res.progress + '%...'
            });
            if (res.progress === 100) {
              that.setData({
                isSaveBtnLoad: false,
                isSaveBtnDis: false,
                saveBtnText: '存至相册，2积分/次'
              })
            }
          })
        } else if (data.code = -101) {
          wx.showModal({
            title: '积分不足2分',
            content: '先去个人中心完成简单的任务增加积分哦',
            success: function(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/me/me'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });
        }
      }

    });
  },
  onLoad: function(options) {
    // if (wx.createRewardedVideoAd) {
    //   videoAd = wx.createRewardedVideoAd({
    //     adUnitId: 'adunit-498062c378a63ba4'
    //   })
    //   videoAd.onLoad(() => {})
    //   videoAd.onError((err) => {})
    //   videoAd.onClose((res) => {})
    // }
    var vedioUrl = options.url;
    // console.log("options.url:" + vedioUrl)
    var that = this;
    if (vedioUrl != '' && vedioUrl.indexOf('douyin') > -1) {
      wx.showLoading({
        icon: 'none',
        title: '解析视频中...',
      })
      wx.request({
        url: app.globalData.localApiUrl + 'douyin/getRealUrl?url=' + encodeURIComponent(vedioUrl),
        method: 'GET',
        success(res) {
          console.log(res.data);
          wx.hideLoading();
          if (res.data != null && res.data.code == 0) {
            var data = res.data;
            if (data.data != null && data.data.url != '') {
              that.setData({
                realUrl: data.data.url,
                isSaveShow: true,
                isVedioShow: true
              })
              wx.showToast({
                title: '解析成功，您可以直接存至相册了！',
                icon: 'none',
                duration: 3000
              })
            } else {
              wx.showToast({
                title: '解析失败，请检查链接或联系客服处理！',
                icon: 'none',
                duration: 3000
              })
            }
          } else {
            wx.showToast({
              title: '解析失败，请检查链接或联系客服处理！',
              icon: 'none',
              duration: 3000
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
    } else if (vedioUrl.indexOf('gifshow') > -1 || vedioUrl.indexOf('huoshan') > -1) {
      wx.showLoading({
        icon: 'none',
        title: '解析视频中...',
      })
      wx.request({
        url: 'https://mini.fccabc.com/kuaishoumini',
        method: 'POST',
        data: {
          "sourceURL": vedioUrl
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res.data);
          if (res.data != null && res.data.status == 0) {
            var data = res.data;
            if (data.data != null && data.data.realDownloadURL != '') {
              wx.request({
                url: app.globalData.localApiUrl + 'video/download?url=' + encodeURIComponent(data.data.realDownloadURL),
                method: 'GET',
                success(res) {
                  console.log(res.data);
                  wx.hideLoading();
                  if (res.data != null && res.data.code == 0) {
                    var data = res.data;
                    if (data.data != null && data.data.url != '') {
                      that.setData({
                        realUrl: data.data.url,
                        isSaveShow: true,
                        isVedioShow: true
                      })
                      wx.showToast({
                        title: '解析成功，您可以直接存至相册了！',
                        icon: 'none',
                        duration: 3000
                      })
                    } else {
                      wx.showToast({
                        title: '解析失败，请检查链接或联系客服处理！',
                        icon: 'none',
                        duration: 3000
                      })
                    }
                  } else {
                    wx.showToast({
                      title: '解析失败，请检查链接或联系客服处理！',
                      icon: 'none',
                      duration: 3000
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
            } else {
              wx.showToast({
                title: '解析失败，请检查链接或联系客服处理！',
                icon: 'none',
                duration: 3000
              })
            }
          } else {
            wx.showToast({
              title: '解析失败，请检查链接或联系客服处理！',
              icon: 'none',
              duration: 3000
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
    } else {
      wx.showToast({
        title: '不支持的链接！',
        icon: 'none',
        duration: 3000
      })
    }
  },
  //转发
  onShareAppMessage: function(res) {
    if (res.from === 'button') {

    }
    return {
      title: '我发现了一个免费好用的短视频去水印工具',
      path: '/pages/index/index',
      success: function(res) {
        console.log('成功', res)
      }
    }
  }
})