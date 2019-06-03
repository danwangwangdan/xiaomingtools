var app = getApp()
let videoAd = null
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
      url: app.globalData.myApiUrl + 'hishelp/add?id=' + wx.getStorageSync("userInfo").id + '&type=3',
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        var data = res.data;
        if (data.data != null && data.data.code >= 0) {
          wx.showToast({
            title: ' 签到成功，增加1积分！',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            point: point + 1,
            signCount: signCount + 1,
          })
        } else if (data.data != null && data.data.code == -102) {
          wx.showToast({
            title: ' 您今天已经签过到了，请明天再来！',
            icon: 'none',
            duration: 2000
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
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
      videoAd.onClose(res => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          wx.request({
            url: app.globalData.myApiUrl + 'hishelp/add?id=' + wx.getStorageSync("userInfo").id + '&type=1',
            method: 'GET',
            success(res) {
              console.log(res.data);
              wx.hideLoading();
              var data = res.data;
              if (data.data != null && data.data.code >= 0) {
                wx.showToast({
                  title: '观看成功，增加2积分！',
                  icon: 'none',
                  duration: 2000
                })
                that.setData({
                  point: point + 2,
                  videoCount: (videoCount > 7) ? 1 : (videoCount + 1),
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
        } else {
          wx.showToast({
            title: '请观看完广告再下载哦，谢谢支持！',
            icon: 'none',
            duration: 3000
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
      console.log(res.target);
      wx.request({
        url: app.globalData.myApiUrl + 'hishelp/add?id=' + wx.getStorageSync("userInfo").id + '&type=3',
        method: 'GET',
        success(res) {
          console.log(res.data);
          wx.hideLoading();
          var data = res.data;
          if (data.data != null && data.data.code >= 0) {
            wx.showToast({
              title: '分享成功，增加2积分！',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              point: point + 2,
              shareCount: (shareCount > 0) ? 1 : (shareCount + 1),
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
    } else {
      console.log("来自右上角转发菜单")
    }
    return {
      title: '我发现了一个好用的抖音短视频去水印工具',
      path: '/pages/index/index',
      success: function(res) {
        console.log('成功', res)
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {

    
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

})