const app = getApp()

Page({
  data: {
    isSaveShow: false,
    isVedioShow: false,
    realUrl: '',
    isSaveBtnLoad: false,
    isSaveBtnDis: false,
    saveBtnText: '存至相册',
    bnrUrl: ["https://www.daliandaxue.cn/img/qun.png",
      "https://www.daliandaxue.cn/img/dybg.png"]
  },
  previewImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = 0;
    var bnrUrl = this.data.bnrUrl;
    wx.previewImage({
      current: bnrUrl[index], //当前图片地址
      urls: bnrUrl, //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toSave: function() {
    var that = this;
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
          saveBtnText: '存至相册'
        })
      }
    })
  },
  onLoad: function(options) {
    var vedioUrl = options.url;
    console.log("options.url:" + vedioUrl)
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
    } else if (decodeURIComponent(vedioUrl).indexOf('weishi') > -1) {
      wx.showLoading({
        icon: 'none',
        title: '解析视频中...',
      })
      console.log(decodeURIComponent(vedioUrl).indexOf("&reqseq"));
      vedioUrl = decodeURIComponent(vedioUrl).substring(0, decodeURIComponent(vedioUrl).indexOf("&reqseq"));
      console.log("weishi：" + vedioUrl);
      wx.request({
        url: app.globalData.localApiUrl + 'video/weishi?url=' + encodeURIComponent(vedioUrl),
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
        title: '链接不见了！',
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