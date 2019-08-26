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
     hasMore2: true,
     videoList: [],
     videoList2: [],
     videoListFor: '',
     totalCount: 0,
     nextCursor: 0,
     nextCursorFor: 0,
     pCursor: '',
     pCursorFor: '',
     gifshowList: [],
     gifshowList2: [],
     gifshowListFor: '',
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
             url: 'https://api.tecms.net/downVideo.php?url=' + that.data.realUrl,
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
                 wx.request({
                   url: app.globalData.myApiUrl + 'hishelp/shuiyin/addpoint?id=' + wx.getStorageSync("userInfo").id + '&point=2',
                   method: 'GET',
                   success(res) {
                     console.log(res.data);
                     wx.hideLoading();
                   },
                   fail() {
                     wx.showToast({
                       title: '网络请求失败，请稍后重试！',
                       icon: 'none',
                       duration: 3000
                     })
                   }
                 });
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
   toHelp: function() {
     wx.navigateTo({
       url: '/pages/help/help'
     });
   },
   toCopy: function() {
     var that = this;
     wx.setClipboardData({
       data: 'https://api.tecms.net/downVideo.php?url=' + that.data.realUrl,
       success: function(res) {
         wx.showToast({
           title: '复制成功，请去第三方浏览器(如QQ/Alook等)打开下载！',
           icon: 'none',
           duration: 3000
         })
       }
     })
   },
   toCopyAll: function() {
     var that = this;
     wx.showModal({
       title: '确定需要复制所有作品链接吗？',
       content: '此操作需要50积分',
       success: function(res) {
         if (res.confirm) {
           console.log('用户点击确定');
           wx.request({
             url: app.globalData.myApiUrl + 'hishelp/shuiyin/takebatch?id=' + wx.getStorageSync("userInfo").id,
             method: 'GET',
             success(res) {
               console.log(res.data);
               var data = res.data;
               if (data.code >= 0) {
                 console.log("积分扣除");
                 // 扣除积分，积分不够则提醒
                 wx.showLoading({
                   icon: 'none',
                   title: '请求数据中...',
                 })
                 if (that.data.platform == 'douyin') {
                   that.fetchDYAll(that.data.nextCursorFor);
                 } else if (that.data.platform == 'gifshow') {
                   that.fetchKSAll(that.data.pCursorFor);
                 }
               } else if (data.code = -101) {
                 wx.showModal({
                   title: '积分不足50分',
                   content: '先去个人中心完成任务增加积分哦',
                   success: function(res) {
                     if (res.confirm) {
                       wx.switchTab({
                         url: '/pages/me/me'
                       })
                     } else if (res.cancel) {

                     }
                   }
                 });
               }
             }
           });
         } else if (res.cancel) {
           console.log('用户点击取消')
         }
       }
     });
   },
   fetchKSAll: function(pCursor) {
     var that = this;
     wx.request({
       url: 'https://service.qushuiyin.club/vcap/video/parse?format=mini&userId=&target=kuaishou&shareUrl=' + encodeURIComponent(that.data.videoUrl),
       method: 'GET',
       success(res) {
         console.log("gifshow");
         console.log(res.data);

         if (res.data != null && res.data.status == 0) {
           var userdata = res.data;
           wx.request({
             url: 'https://service.qushuiyin.club/vcap/video/list?format=mini&userId=' + userdata.id + '&target=kuaishou&cursor=' + pCursor + '&count=10&shareUrl=' + encodeURIComponent(that.data.videoUrl),
             method: 'GET',
             success(res) {
               console.log("gifshowrequest");
               console.log(res.data);
               var postData = {
                 values: {}
               };
               (function() {
                 var commonParam = '?' + JSON.parse(res.data.message).body
                 var item = '',
                   key = '',
                   val = '';
                 var commonParamArr = commonParam.split('&');
                 commonParamArr[0] = commonParamArr[0].replace(/^\?/, '');
                 console.log(commonParamArr);
                 for (var i = 0, len = commonParamArr.length; i < len; i++) {
                   item = commonParamArr[i].split('=');
                   key = item[0];
                   val = item[1];
                   // 排除commonParam内uid、token字段
                   if (key == 'uid') continue;
                   postData.values[key] = val;
                 }
                 console.log(postData.values);
               })();
               wx.request({
                 url: JSON.parse(res.data.message).url,
                 method: 'POST',
                 header: {
                   'content-type': 'application/x-www-form-urlencoded'
                 },
                 data: postData.values,
                 success(res) {
                   console.log(res.data);
                   that.setData({
                     gifshowList2: that.data.gifshowList2.concat(res.data.feeds),
                     pCursorFor: res.data.pcursor,
                   });
                   if (that.data.pCursorFor != '' && that.data.pCursorFor != 'no_more') {
                     that.fetchKSAll(res.data.pcursor);
                   } else {
                     console.log("总计:" + that.data.gifshowList2.length);
                     for (var j = 0, len = that.data.gifshowList2.length; j < len; j++) {
                       if (that.data.gifshowList2[j] && that.data.gifshowList2[j].main_mv_urls){
                         var oneUrl = that.data.gifshowList2[j].main_mv_urls[0].url != '' ? that.data.gifshowList2[j].main_mv_urls[0].url : that.data.gifshowList2[j].main_mv_urls[1].url;
                       }
                       that.setData({
                         gifshowListFor: that.data.gifshowListFor + '\r\n' + oneUrl
                       })
                     }
                     console.log('no_more');   
                     console.log(that.data.gifshowListFor);                   
                     wx.hideLoading();
                     wx.setClipboardData({
                       data: that.data.gifshowListFor,
                       success: function(res) {
                         wx.showToast({
                           title: '复制成功，请去电脑上IDM批量下载！',
                           icon: 'none',
                           duration: 3000
                         })
                       }
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
   },


   fetchDYAll: function(nextCursor) {
     var that = this;
     wx.request({
       url: 'https://service.qushuiyin.club/vcap/video/list?format=mini&userId=&target=douyin&cursor=' + nextCursor + '&count=10&shareUrl=' + encodeURIComponent(that.data.videoUrl),
       method: 'GET',
       success(res) {
         console.log(res.data);
         if (res.data != null && res.data.status == 0) {
           var message = JSON.parse(res.data.message);
           if (message != null) {
             console.log(message)
             that.setData({
               videoList2: that.data.videoList2.concat(message.videos),
               hasMore2: message.hasMore,
               nextCursorFor: message.nextCursor
             })
             if (message.hasMore) {
               that.fetchDYAll(message.nextCursor);
             } else if (!message.hasMore) {
               console.log("总计：" + that.data.videoList2.length)
               for (var j = 0, len = that.data.videoList2.length; j < len; j++) {
                 that.setData({
                   videoListFor: that.data.videoListFor + '\r\n' + that.data.videoList2[j].downloadUrl
                 })
               }
               console.log('no_more');
               wx.hideLoading();
               wx.setClipboardData({
                 data: that.data.videoListFor,
                 success: function(res) {
                   wx.showToast({
                     title: '复制成功，请去电脑上IDM批量下载！',
                     icon: 'none',
                     duration: 3000
                   })
                 }
               })

             }
           } else {

             console.log("总计：" + that.data.videoList2.length)
             for (var j = 0, len = that.data.videoList2.length; j < len; j++) {
               that.setData({
                 videoListFor: that.data.videoListFor + '\r\n' + that.data.videoList2[j].downloadUrl
               })
             }
             wx.hideLoading();
             wx.setClipboardData({
               data: that.data.videoListFor,
               success: function(res) {
                 wx.showToast({
                   title: '复制成功，请去电脑上IDM批量下载！',
                   icon: 'none',
                   duration: 3000
                 })
               }
             })
             console.log('message = null');
           }
         } else {
           console.log("总计：" + that.data.videoList2.length)
           for (var j = 0, len = that.data.videoList2.length; j < len; j++) {
             that.setData({
               videoListFor: that.data.videoListFor + '\r\n' + that.data.videoList2[j].downloadUrl
             })
           }
           wx.hideLoading();
           wx.setClipboardData({
             data: that.data.videoListFor,
             success: function(res) {
               wx.showToast({
                 title: '复制成功，请去电脑上IDM批量下载！',
                 icon: 'none',
                 duration: 3000
               })
             }
           })
           console.log('status is -');
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

   onReachBottom: function() {

     // 下拉触底，先判断是否有请求正在进行中
     // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
     var that = this;
     console.log(that.data.hasMore);
     console.log(that.data.nextCursor)
     if (that.data.platform == 'douyin') {
       if (that.data.hasMore && that.data.nextCursor != 0) {
         this.fetchDouyin(that.data.nextCursor)
       } else if ((!that.data.hasMore) || that.data.nextCursor) {
         wx.showToast({
           title: '已全部加载完毕！',
           icon: 'none',
           duration: 3000
         })
       }
     } else if (that.data.platform == 'gifshow') {
       if (that.data.pCursor != '' && that.data.pCursor != 'no_more') {
         this.fetchGifshow(that.data.pCursor)
       } else {
         wx.showToast({
           title: '已全部加载完毕！',
           icon: 'none',
           duration: 3000
         })
       }
     }
   },
   fetchGifshow: function(nextCursor) {
     var that = this;
     wx.showLoading({
       icon: 'none',
       title: '加载更多中 ...',
     })
     wx.request({
       url: 'https://service.qushuiyin.club/vcap/video/parse?format=mini&userId=&target=kuaishou&shareUrl=' + encodeURIComponent(that.data.videoUrl),
       method: 'GET',
       success(res) {
         console.log("gifshow");
         console.log(res.data);

         if (res.data != null && res.data.status == 0) {
           var userdata = res.data;
           wx.request({
             url: 'https://service.qushuiyin.club/vcap/video/list?format=mini&userId=' + userdata.id + '&target=kuaishou&cursor=' + that.data.pCursor + '&count=10&shareUrl=' + encodeURIComponent(that.data.videoUrl),
             method: 'GET',
             success(res) {
               console.log("gifshowrequest");
               console.log(res.data);
               var postData = {
                 values: {}
               };
               (function() {
                 var commonParam = '?' + JSON.parse(res.data.message).body
                 var item = '',
                   key = '',
                   val = '';
                 var commonParamArr = commonParam.split('&');
                 commonParamArr[0] = commonParamArr[0].replace(/^\?/, '');
                 console.log(commonParamArr);
                 for (var i = 0, len = commonParamArr.length; i < len; i++) {
                   item = commonParamArr[i].split('=');
                   key = item[0];
                   val = item[1];
                   // 排除commonParam内uid、token字段
                   if (key == 'uid') continue;
                   postData.values[key] = val;
                 }
                 console.log(postData.values);
               })();
               wx.request({
                 url: JSON.parse(res.data.message).url,
                 method: 'POST',
                 header: {
                   'content-type': 'application/x-www-form-urlencoded'
                 },
                 data: postData.values,
                 success(res) {
                   console.log(res.data);
                   that.setData({
                     'gifshowList': that.data.gifshowList.concat(res.data.feeds),
                     'pCursor': res.data.pcursor,
                   });
                   wx.hideLoading();
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
             wx.hideLoading();
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
     //  var currentUrl = 'http://v.douyin.com/keb6uL/'

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
           console.log("gifshow");
           console.log(res.data);
           wx.hideLoading();
           if (res.data != null && res.data.status == 0) {
             var userdata = res.data;
             wx.request({
               url: 'https://service.qushuiyin.club/vcap/video/list?format=mini&userId=' + userdata.id + '&target=kuaishou&cursor=0&count=10&shareUrl=' + encodeURIComponent(currentUrl),
               method: 'GET',
               success(res) {
                 console.log("gifshowrequest");
                 console.log(res.data);
                 var postData = {
                   values: {}
                 };
                 (function() {
                   var commonParam = '?' + JSON.parse(res.data.message).body
                   var item = '',
                     key = '',
                     val = '';
                   var commonParamArr = commonParam.split('&');
                   commonParamArr[0] = commonParamArr[0].replace(/^\?/, '');
                   console.log(commonParamArr);
                   for (var i = 0, len = commonParamArr.length; i < len; i++) {
                     item = commonParamArr[i].split('=');
                     key = item[0];
                     val = item[1];
                     // 排除commonParam内uid、token字段
                     if (key == 'uid') continue;
                     postData.values[key] = val;
                   }
                   console.log(postData.values);
                 })();
                 wx.request({
                   url: JSON.parse(res.data.message).url,
                   method: 'POST',
                   header: {
                     'content-type': 'application/x-www-form-urlencoded'
                   },
                   data: postData.values,
                   success(res) {
                     console.log(res.data);
                     that.setData({
                       'gifshowList': res.data.feeds,
                       'pCursor': res.data.pcursor,
                     })
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