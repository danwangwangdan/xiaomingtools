//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    url: ''
  },
  //事件处理函数
  toDecode: function() {
    var that = this;
    console.log(that.data.url)
    if (that.data.url!=''){
      wx.navigateTo({
        url: '/pages/save/save?url=' + that.data.url
      });
    } else {
      wx.showToast({
        title: '不要忘了输入链接哦！',
        icon: 'none',
        duration: 2500
      })
    }
   
  },
  bindUrlValue: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      url: value,
    })
  },
  onLoad: function() {

  },
  onShow: function() {
    var that = this;
    wx.getClipboardData({
      success(res) {
        if (res.data.indexOf('http') > -1) {
          that.setData({
            url: res.data
          });
          wx.showToast({
            title: '自动获取链接成功',
            icon: 'none',
            duration: 1500
          });
        }
      }
    })
  },

})