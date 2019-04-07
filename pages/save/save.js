const app = getApp()

Page({
  data: {
    isSaveShow: false,
    isVedioShow: false,
    url: ''
  },
  onLoad: function(options) {
   
    var vedioUrl = options.url;
    var that = this;
    if (vedioUrl != '') {
      console.log(vedioUrl)
      wx.request({
        url: app.globalData.localApiUrl + 'douyin/getRealUrl?url=' + '%23%E5%9C%A8%E6%8A%96%E9%9F%B3%EF%BC%8C%E8%AE%B0%E5%BD%95%E7%BE%8E%E5%A5%BD%E7%94%9F%E6%B4%BB%23%E6%B3%B8%E5%B7%9E%E5%AC%A2%E5%AC%A2%E7%9A%84%E5%BE%AE%E4%BF%A1%E5%90%8D%EF%BC%8C%E4%BD%A0%E5%BF%83%E5%8A%A8%E4%BA%86%E5%90%97%EF%BC%9F%E5%88%86%E4%BA%AB%E4%B8%80%E4%B8%8B%E4%BD%A0%E4%BB%AC%E7%88%B6%E6%AF%8D%E7%9A%84%E5%BE%AE%E4%BF%A1%E5%90%8D%E5%90%A7%F0%9F%98%82%F0%9F%98%82%F0%9F%98%82%23%E8%A1%97%E8%AE%BF%20%23%E6%B3%B8%E5%B7%9E%20http%3A%2F%2Fv.douyin.com%2Fj6YXha%2F%20%E5%A4%8D%E5%88%B6%E6%AD%A4%E9%93%BE%E6%8E%A5%EF%BC%8C%E6%89%93%E5%BC%80%E3%80%90%E6%8A%96%E9%9F%B3%E7%9F%AD%E8%A7%86%E9%A2%91%E3%80%91%EF%BC%8C%E7%9B%B4%E6%8E%A5%E8%A7%82%E7%9C%8B%E8%A7%86%E9%A2%91%EF%BC%81',
        method: 'GET',
        success(res) {
          console.log(res.data);
          if (res.data.code == 0) {
            var data = res.data;
            console.log("视频地址：" + data.url);
            if (data.data != null && data.data.url != '') {
              that.setData({
                url: data.data.url,
                isSaveShow: true,
                isVedioShow: true
              })
              wx.showToast({
                title: '解析成功，加载视频中！',
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '解析失败，请联系客服处理！',
                icon: 'none',
                duration: 2000
              })
            }
          } else {
            wx.showToast({
              title: '解析失败，请联系客服处理！',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail() {
          $stopWuxRefresher() //停止下拉刷新
          wx.showToast({
            title: '网络请求失败，请稍后重试！',
            icon: 'none',
            duration: 2000
          })
        }
      });
    } else {
      wx.showToast({
        title: '链接不见了！',
        icon: 'none',
        duration: 2000
      })
    }
  }
})