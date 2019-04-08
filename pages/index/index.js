//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    url: '',
    isTextNull:0
  },
  //事件处理函数
  toDecode: function() {
    var that = this;
    console.log(that.data.url)
    if (that.data.url.indexOf('http')>-1) {

      wx.navigateTo({
        url: '/pages/save/save?url=' + that.data.url
      });
    } else {
      wx.showToast({
        title: '要输入正确的链接呀！',
        icon: 'none',
        duration: 3000
      })
    }
  },
  bindUrlClear: function() {
    this.setData({
      url: '',
      isTextNull: 0
    })
  },
  pasteUrl: function () {
    var that = this;
    wx.getClipboardData({
      success(res) {
        that.setData({
          url: res.data,
          isTextNull: 1
        })
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
    if(value==''){
      that.setData({
        isTextNull: 0
      })
    }
  },
  onLoad: function() {

  },
  onShow: function() {
    var that = this;
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
  },
  
})