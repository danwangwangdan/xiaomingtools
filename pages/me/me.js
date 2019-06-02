var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '姓名',
    imgSrc: '',
    point: 0,
    signCount: 0,
    shareCount: 0,
    videoCount: 0,
  },
  toSign: function(options) {
    console.log("签到");
    wx.request({
      url: app.globalData.localApiUrl + 'douyin/getRealUrl?url=' + encodeURIComponent(vedioUrl),
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        var data = res.data;
        if (data.data != null && data.data.url != '') {
          that.setData({
            realUrl: data.data.url,
            isSaveShow: true,
            isVedioShow: true
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})