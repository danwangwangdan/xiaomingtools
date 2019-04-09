//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isBtnShow: false,
    url: '',
    isTextNull: 0,
    modalHidden: true,
    imgArr: ['res/help.png'],
  },
  /**
  * 显示弹窗
  */
  showPic: function () {
    console.log("showPic");
    this.setData({
      modalHidden: false
    })
  },
  /**
   * 点击取消
   */
  modalCandel: function () {
    // do something
    this.setData({
      modalHidden: true
    })
  },
  previewImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = 0;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   *  点击确认
   */
  modalConfirm: function () {
    // do something
    this.setData({
      modalHidden: true
    })
  },
  //事件处理函数
  toDecode: function() {
    var that = this;
    console.log(that.data.url)
    if (that.data.url.indexOf('http') > -1) {

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
  pasteUrl: function() {
    var that = this;
    wx.getClipboardData({
      success(res) {
        if (res.data != null && res.data != '') {
          that.setData({
            url: res.data,
            isTextNull: 1
          });
        }else{
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
  //转发
  onShareAppMessage: function(res) {
    if (res.from === 'button') {

    }
    return {
      title: '我发现了一个好用的斗音视频去水印工具',
      path: '/pages/index/index',
      success: function(res) {
        console.log('成功', res)
      }
    }
  }
})