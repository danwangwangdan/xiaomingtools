 const app = getApp()
 // let videoAd = null
 Page({
   data: {
     platform: 'douyin',
     isSaveShow: true,
     isCopyShow: true,
     isVedioShow: false,
     realUrl: '',
     videoUrl: '',
     hasMore: true,
     videoList: [],
     totalCount: 0,
     nextCursor: 0,
     isSaveBtnLoad: false,
     isSaveBtnDis: false,
   },
   toSave: function(e) {
     var videoUrl = e.currentTarget.dataset.url;
     this.setData({
       realUrl: videoUrl
     })
     console.log('click:' + videoUrl);
     var that = this;
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
             title: '已扣除2积分,后台下载中,请耐心等待成功提示！',
             icon: 'none',
             duration: 2000
           })

           that.setData({
             isSaveBtnLoad: true,
             saveBtnText: '存至相册中...',
             isSaveBtnDis: true
           })

           const downloadTask = wx.downloadFile({
             url: 'https://api.tecms.net/downVideo.php?url=' + encodeURIComponent(that.data.realUrl),
             success(res) {
               console.log("开始下载...")
               console.log(res)
               if (res.statusCode == 200) {
                 wx.saveVideoToPhotosAlbum({
                   filePath: res.tempFilePath,
                   success(res) {
                     console.log(res)
                     that.setData({
                       isSaveBtnLoad: false,
                       isSaveBtnDis: false,

                     })
                     wx.showToast({
                       title: '保存成功，请去系统相册查看！',
                       icon: 'none',
                       duration: 3000
                     })
                   }
                 })
               } else {
                 that.setData({
                   isSaveBtnLoad: false,
                   isSaveBtnDis: false,
                   saveBtnText: '存至相册，2积分/次'
                 })
                 wx.showToast({
                   title: '保存失败，请复制链接到浏览器下载！',
                   icon: 'none',
                   duration: 3000
                 })
               }
             },
             fail() {
               that.setData({
                 isSaveBtnLoad: false,
                 isSaveBtnDis: false,
                 saveBtnText: '存至相册，2积分/次'
               })
               wx.showToast({
                 title: '保存失败，请复制链接到浏览器下载！',
                 icon: 'none',
                 duration: 3000
               })
             }
           });
           downloadTask.onProgressUpdate((res) => {
             console.log('下载进度', res)

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
             content: '先去个人中心完成免费的任务增加积分哦',
             success: function(res) {
               if (res.confirm) {
                 wx.switchTab({
                   url: '/pages/me/me'
                 })
               } else if (res.cancel) {
                 wx.showToast({
                   title: '任务极为简单，试一试就知道了哦',
                   icon: 'none',
                   duration: 2000
                 })
               }
             }
           });
         }
       }

     });
   },
   toCopy: function() {
     var that = this;
     wx.setClipboardData({
       data: 'https://api.tecms.net/downVideo.php?url=' + encodeURIComponent(that.data.realUrl),
       success: function(res) {
         wx.showToast({
           title: '复制成功，请去第三方浏览器(如QQ/Alook等)打开下载！',
           icon: 'none',
           duration: 3000
         })
       }
     })
   },
   onReachBottom: function() {

     // 下拉触底，先判断是否有请求正在进行中
     // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
     var that = this;
     console.log(that.data.hasMore);
     console.log(that.data.nextCursor)
     if (that.data.hasMore && that.data.nextCursor != 0) {
       if (that.data.platform == 'douyin') {
         this.fetchDouyin(that.data.nextCursor)
       } else if (that.data.platform == 'gifshow') {
         this.fetchGifshow(that.data.nextCursor)
       }
     } else if (!that.data.hasMore) {
       wx.showToast({
         title: '已全部加载完毕！',
         icon: 'none',
         duration: 3000
       })
     }
   },
   fetchDouyin: function(nextCursor) {
     var that = this;
     wx.showLoading({
       icon: 'none',
       title: '加载更多中 ...',
     })
     wx.request({
       url: 'https://service.qushuiyin.club/vcap/video/list?format=mini&userId=&target=douyin&cursor=' + nextCursor + '&count=10&shareUrl=' + encodeURIComponent(that.data.videoUrl),
       method: 'GET',
       success(res) {
         console.log(res.data);
         wx.hideLoading();
         if (res.data != null && res.data.status == 0) {
           var message = JSON.parse(res.data.message);
           if (message != null && message.count > 0) {
             console.log(message)
             that.setData({
               videoList: that.data.videoList.concat(message.videos),
               hasMore: message.hasMore,
               totalCount: message.count,
               nextCursor: message.nextCursor
             })

           } else {
             wx.showToast({
               title: '解析失败，请稍后重试或联系客服处理！',
               icon: 'none',
               duration: 3000
             })
           }
         } else {
           wx.showToast({
             title: '解析失败，请稍后重试或联系客服处理！',
             icon: 'none',
             duration: 3000
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
   onLoad: function(options) {

      var currentUrl = options.url;
    //  var currentUrl = 'http://m.gifshow.com/s/yn9qahlI'

     // console.log("options.url:" + currentUrl)
     var that = this;
     that.setData({
       videoUrl: currentUrl
     })
     wx.showLoading({
       icon: 'none',
       title: '解析视频中...',
     })
     if (currentUrl.indexOf("douyin") > 0) {
       that.setData({
         platform: 'douyin'
       })
       wx.request({
         url: 'https://service.qushuiyin.club/vcap/video/list?format=mini&userId=&target=douyin&cursor=0&count=10&shareUrl=' + encodeURIComponent(currentUrl),
         method: 'GET',
         success(res) {
           console.log(res.data);
           wx.hideLoading();
           if (res.data != null && res.data.status == 0) {
             var message = JSON.parse(res.data.message);
             if (message != null && message.count > 0) {
               that.setData({
                 videoList: message.videos,
                 hasMore: message.hasMore,
                 totalCount: message.count,
                 nextCursor: message.nextCursor
               })
               wx.showToast({
                 title: '解析成功，上拉加载更多',
                 icon: 'none',
                 duration: 3000
               })
             } else {
               wx.showToast({
                 title: '解析失败，请稍后重试或联系客服处理！',
                 icon: 'none',
                 duration: 3000
               })
             }
           } else {
             wx.showToast({
               title: '解析失败，请稍后重试或联系客服处理！',
               icon: 'none',
               duration: 3000
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
     } else if (currentUrl.indexOf("gifshow") > 0) {
       that.setData({
         platform: 'gifshow'
       })
       wx.request({
         url: 'https://service.qushuiyin.club/vcap/video/parse?format=mini&userId=&target=kuaishou&shareUrl=' + encodeURIComponent(currentUrl),
         method: 'GET',
         success(res) {
           console.log(res.data);
           wx.hideLoading();
           if (res.data != null && res.data.status == 0) {
             var data = res.data;
             wx.request({
               url: 'https://service.qushuiyin.club/vcap/video/list?format=mini&userId=' + data.id + '&target=kuaishou&cursor=0&count=10&shareUrl=' + encodeURIComponent(currentUrl),
               method: 'GET',
               success(res) {
                 console.log(res.data);
                 wx.hideLoading();
                 if (res.data != null && res.data.status == 0) {
                   var message = JSON.parse(res.data.message);
                   if (message != null && message.count > 0) {
                     that.setData({
                       videoList: message.videos,
                       hasMore: message.hasMore,
                       totalCount: message.count,
                       nextCursor: message.nextCursor
                     })
                     wx.showToast({
                       title: '解析成功，上拉加载更多',
                       icon: 'none',
                       duration: 3000
                     })
                   } else {
                     wx.showToast({
                       title: '解析失败，请稍后重试或联系客服处理！',
                       icon: 'none',
                       duration: 3000
                     })
                   }
                 } else {
                   wx.showToast({
                     title: '解析失败，请稍后重试或联系客服处理！',
                     icon: 'none',
                     duration: 3000
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
               title: '解析失败，请稍后重试或联系客服处理！',
               icon: 'none',
               duration: 3000
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