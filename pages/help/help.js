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

  toCopyIDM: function() {
    var that = this;
    console.log('1111')
    wx.setClipboardData({
      data: 'https://www.lanzous.com/i4ub73a',
      success: function(res) {
        wx.showToast({
          title: '复制IDM下载地址成功，请前去电脑浏览器打开！',
          icon: 'none',
          duration: 3000
        })
      }
    })
  }

})