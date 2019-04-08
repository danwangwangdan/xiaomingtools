const app = getApp()

Page({
  data: {
    isSaveShow: false,
    isVedioShow: false,
    realUrl: '',
    isSaveBtnLoad: false,
    isSaveBtnDis: false,
    saveBtnText: '存至相册'
  },
  toSave: function() {
    var that = this;
    wx.authorize({ scope: "scope.writePhotosAlbum" })
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
      
        wx.showToast({
          title: '保存成功，请去系统相册查看！',
          icon: 'none',
          duration: 3000
        });
        that.setData({
          isSaveBtnLoad: false,
          isSaveBtnDis: false,
          saveBtnText: '存至相册'
        })
      }
    })
  },
  onLoad: function(options) {

    var vedioUrl = encodeURIComponent(options.url);
    console.log("options.url:" + vedioUrl)
    var that = this;
    if (vedioUrl != '') {
      wx.showLoading({
        icon: 'none',
        title: '最多等待30秒...',
      })
      wx.request({
        url: app.globalData.localApiUrl + 'douyin/getRealUrl?url=' + vedioUrl,
        method: 'GET',
        success(res) {
          console.log(res.data);
          wx.hideLoading();
          if (res.data.code == 0) {
            var data = res.data;
            console.log("视频地址：" + data.data.url);
            if (data.data != null && data.data.url != '') {
              that.setData({
                realUrl: data.data.url,
                isSaveShow: true,
                isVedioShow: true
              })
              wx.showToast({
                title: '解析成功，加载视频中！',
                icon: 'none',
                duration: 3000
              })
            } else {
              wx.showToast({
                title: '解析失败，请联系客服处理！',
                icon: 'none',
                duration: 3000
              })
            }
          } else {
            wx.showToast({
              title: '解析失败，请联系客服处理！',
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {

    }
    return {
      title: '我发现了一个好用的斗音视频去水印工具',
      path: '/pages/index/index',
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
})