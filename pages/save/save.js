 const app = getApp()
 // let videoAd = null
 Page({
   data: {
     isSaveShow: false,
     isCopyShow: false,
     isVedioShow: false,
     realUrl: '',
     isSaveBtnLoad: false,
     isSaveBtnDis: false,
     saveBtnText: '存至相册，3积分/次',
     bnrUrl: ["https://loveshiming.oicp.vip/img/qun.png",
       "https://loveshiming.oicp.vip/img/dybg.png"
     ],
     bnrUrl2: ["https://loveshiming.oicp.vip/img/cash.png"]
   },
   previewImg: function(e) {
     console.log(e.currentTarget.dataset.index);
     var index = 0;
     var bnrUrl = this.data.bnrUrl;
     wx.previewImage({
       current: bnrUrl[index], //当前图片地址
       urls: bnrUrl, //所有要预览的图片的地址集合 数组形式
       success: function(res) {},
       fail: function(res) {},
       complete: function(res) {},
     })
   },
   bindCash: function(e) {
     var bnrUrl2 = this.data.bnrUrl2;
     wx.previewImage({
       current: bnrUrl2[0], //当前图片地址
       urls: bnrUrl2, //所有要预览的图片的地址集合 数组形式
       success: function(res) {},
       fail: function(res) {},
       complete: function(res) {},
     })
   },
   toSave: function() {
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
           that.setData({
             isSaveBtnLoad: true,
             saveBtnText: '视频过大，请耐心等待哦...',
             isSaveBtnDis: true
           })
           wx.showToast({
             title: '已扣除3积分， 开始存至相册！',
             icon: 'none',
             duration: 2000
           })
           const downloadTask = wx.downloadFile({
             url: 'https://api.lingquan166.com/downVideo.php?url=' + that.data.realUrl,
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
                       saveBtnText: '存至相册，3积分/次'
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
                   saveBtnText: '存至相册，3积分/次'
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
                   title: '保存失败，已退回3积分，请复制链接到浏览器下载！',
                   icon: 'none',
                   duration: 3000
                 })
               }
             },
             complete() {
               that.setData({
                 isSaveBtnLoad: false,
                 isSaveBtnDis: false,
                 saveBtnText: '存至相册，3积分/次'
               })
             },
             fail() {
               that.setData({
                 isSaveBtnLoad: false,
                 isSaveBtnDis: false,
                 saveBtnText: '存至相册，3积分/次'
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
                 title: '保存失败，已退回3积分，请复制链接到浏览器下载！',
                 icon: 'none',
                 duration: 3000
               })
             }
           });
           // downloadTask.onProgressUpdate((res) => {
           //   console.log('下载进度', res)

           //   if (res.progress === 100) {
           //     that.setData({
           //       isSaveBtnLoad: false,
           //       isSaveBtnDis: false,
           //       saveBtnText: '存至相册，3积分/次'
           //     })
           //   }
           // })
         } else if (data.code = -101) {
           wx.showModal({
             title: '积分不足3分',
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
       data: 'https://api.lingquan166.com/downVideo.php?url=' + that.data.realUrl,
       success: function(res) {
         wx.showToast({
           title: '复制成功，请去第三方浏览器(如QQ/UC)打开下载！',
           icon: 'none',
           duration: 3000
         })
       }
     })
   },
   onLoad: function(options) {

     var vedioUrl = options.url;
     // console.log("options.url:" + vedioUrl)
     var that = this;
     wx.showLoading({
       icon: 'none',
       title: '解析视频中...',
     })
     if (vedioUrl.indexOf("tiktok") > 0) {
       wx.request({
         url: 'https://www.daliandaxue.cn/douyin-1.0/video/tiktok?url=' + encodeURIComponent(vedioUrl),
         method: 'GET',
         success(res) {
           console.log(res.data);
           wx.hideLoading();
           if (res.data != null && res.data.code == 0) {
             var data = res.data;
             if (data.data != null && data.data.url != '') {
               that.setData({
                 realUrl: data.data.url,
                 isSaveShow: true,
                 isCopyShow: true,
                 isVedioShow: true
               })
               wx.showToast({
                 title: '解析成功，您可以直接存至相册了！',
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
       wx.request({
         url: 'https://api.lingquan166.com/dsp?token=111032QZ94631AFUWIQ&key=4FCBDFDCD5UWIQ18C5EDB5&url=' + vedioUrl,
         method: 'GET',
         success(res) {
           console.log(res.data);
           if (res.data != null && res.data.status == 101) {
             var data = res.data;
             if (data.data != null && data.data.url != '' && data.data.url != null) {
               wx.hideLoading();
               that.setData({
                 realUrl: data.data.url,
                 isSaveShow: true,
                 isCopyShow: true,
                 isVedioShow: true
               })
               wx.showToast({
                 title: '解析成功，您可以直接存至相册了！',
                 icon: 'none',
                 duration: 3000
               })
             } else {
               //  wx.showToast({
               //    title: '解析失败，请稍后重试或联系客服处理！',
               //    icon: 'none',
               //    duration: 3000
               //  });
               // 尝试其他解析方式
               that.secDecode(vedioUrl);
             }
           } else {
             //  wx.showToast({
             //    title: '解析失败，请稍后重试或联系客服处理！',
             //    icon: 'none',
             //    duration: 3000
             //  })
             // 尝试其他解析方式
             that.secDecode(vedioUrl);
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
     }
   },
   secDecode: function(vedioUrl) {
     var that = this;
     console.log("尝试其他方式"+vedioUrl)
     if (vedioUrl.indexOf("douyin") > 0) {
       that.setData({
         platform: 'douyin'
       })
       wx.request({
         url: 'https://service.qushuiyin.club/vcap/video/list?format=mini&userId=&target=douyin&cursor=0&count=10&shareUrl=' + encodeURIComponent(vedioUrl),
         method: 'GET',
         success(res) {
           console.log('douyin2');
           console.log(res.data);
           wx.hideLoading();
           if (res.data != null && res.data.status == 0) {
             wx.hideLoading();
             var message = JSON.parse(res.data.message);
             if (message != null && message.count > 0) {
               that.setData({
                 realUrl: message.videos[0].downloadUrl,
                 isSaveShow: true,
                 isCopyShow: true,
                 isVedioShow: true

               })
               wx.showToast({
                 title: '解析成功，您可以直接存至相册了！',
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
     } else if (vedioUrl.indexOf("gifshow") > 0) {
       wx.request({
         url: 'https://service.qushuiyin.club/vcap/video/parse?format=mini&userId=&target=kuaishou&shareUrl=' + encodeURIComponent(vedioUrl),
         method: 'GET',
         success(res) {
           console.log("gifshow");
           console.log(res.data);
           wx.hideLoading();
           if (res.data != null && res.data.status == 0) {
             // type ==0 列表  type==1单个
             var userdata = res.data;
             wx.request({
               url: 'https://service.qushuiyin.club/vcap/video?url=' + encodeURIComponent(vedioUrl) + '&videoId=' + userdata.id + '&target=kuaishou&version=1.0.7',
               method: 'GET',
               success(res) {
                 console.log("gifshowrequest");
                 console.log(res.data);
                 var postData = {
                   values: {}
                 };
                 (function() {
                   var commonParam = '?' + JSON.parse(res.data.message).body
                   console.log("commonParam");
                   console.log(commonParam);
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
                     that.setData({
                       realUrl: res.data.photos[0].main_mv_urls[0].url != '' ? res.data.photos[0].main_mv_urls[0].url : res.data.photos[0].main_mv_urls[1].url,
                       isSaveShow: true,
                       isCopyShow: true,
                       isVedioShow: true

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
     }else{
       wx.hideLoading()
       wx.showToast({
         title: '解析失败，请稍后重试或联系客服处理！',
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