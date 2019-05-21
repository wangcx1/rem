/*2019.4.1---by wang
* */
$(function () {
    var $plateBtn = $('#plateBtn');
    var datas = [
        {'text': '恭喜您抽中<em>游戏手柄</em>', 'src': 'images/shoubing_03.png'},
        {'text': '', 'src': '', 'text1': '恭喜您抽中价值168元豪华礼包，请妥善保管礼包码在游戏中兑换!','id':'2'},
        {'text': '恭喜您抽中<em>小度音响</em>', 'src': 'images/yinxiang_03.png'},
        {'text': '恭喜您抽中<em>蓝牙耳机</em>', 'src': 'images/erji_03.png'},
        {'text': '恭喜您抽中<em>充电宝</em>', 'src': 'images/chongdianbao_03.png'},
        {'text': '恭喜您抽中<em>机械键盘</em>', 'src': 'images/keybord_03.png'},
        {'text': '恭喜您抽中<em>switch</em>', 'src': 'images/switch_03.png'},
        {'text': '恭喜您抽中<em>100元京东卡</em>', 'src': 'images/jingdong_03.png'},
        {'text': '恭喜您抽中<em>iPhone XS Max</em>', 'src': 'images/iphone_03.png'}
    ];


    $plateBtn.click(function () {
        var count = $('.text span').text();
        if (count == 0) {
            $('.yaoqingBg,.modal').show();
            return false;
        }
        // var data = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        until.request({
            'url': url + 'getAwardAndRecord',
            'type': 'get',
            'successCallback': function (json) {
                // console.log(data);
                if (json.success == 1) {
                    var random = json.result.id;
                    // data = data[random];
                    var angel = 14 + random * 40 + Math.floor(Math.random() * 40);

                    rotateFunc(random, angel, datas[random]);

                }else{
                    layer.alert(json.msg)
                }
            }
        })

    });

    var rotateFunc = function (awards, angle, datas) {  //awards:奖项，angle:奖项对应的角度
        $plateBtn.stopRotate();
        $plateBtn.rotate({
            angle: 0,
            duration: 5000,
            animateTo: angle + 1440,  //angle是图片上各奖项对应的角度，1440是让指针固定旋转4圈
            callback: function () {
                $('.materialImg img').attr('src', datas.src);
                $('.materialBg p.award_name').html(datas.text);
                if(datas.id==2){
                    $('.materialImg div').html(datas.text1);
                    $('p.service').hide();
                }
                $('.modal,.materialBg').show();
            }
        });
    };

    var url = '//www.msyxz.com/api/API20190408/';

    // 获取用户信息
    function getUserInfo() {
        until.request({
            'url': url + 'getUserInfo',
            'type': 'get',
            'successCallback': function (data) {
                var success = data.success;
                $('.appointmentNum span').text(data.result.curYyNum);
                if (success == 0) {
                    $('.phone_name').html('');
                    $('.appointmentBtn').addClass('default');
                    $('.appointmentBtn').removeClass('success');
                } else {
                    $('.welcomeBg p').html('欢迎您,' + data.result.user.phone);
                    $('.welcomeBg').show();
                    $('.libaoText p.text span').text(data.result.user.num);
                    $('.appointmentBtn').addClass('success');
                    $('.appointmentBtn').removeClass('default');
                    $(".appointmentBtn").attr("disabled",true).css("pointer-events","none");
                    rURL(data.result.user.id);
                    //识别二维码
                    $(".erweimaBg").qrcode(
                        {
                            render:'canvas',
                            width: '198px',                       //宽度
                            height:'198px',
                            moduleSize:4,
                            margin:3,                                              //高度
                            text: "http://www.msyxz.com/activity/mumbo_y/index.html?id="+data.result.user.id,      //任意内容
                            logo:'http://www.gundambattle.com/static/images/website/index/icon_04.png',//logo图片
                        }
                    );
                }

            }
        })
    }

    getUserInfo();

//    发送验证码
    function sendCode(val) {
        var value = $('#phone').val();
        console.log(value)
        until.request({
            'url': url + 'sendCode',
            'type': 'get',
            'data': {'phone': value},
            'successCallback': function (data) {
                // console.log(data);
                if(data.msg){
                    layer.alert(data.msg);
                }

            }
        })
    }

    //检测手机号
    function checkPhone(dom) {
        var value = $(dom).val();
        if (!value || !(/^1\d{10}$/.test(value))) {
            layer.alert('请填写正确的手机号！')
            return false;
        } else {
            return 1;
        }
    }

    //发送验证码

    $('.appointmentBg a.code').click(function (e) {
        e.preventDefault();
        checkPhone('#phone');
        var value = $('#phone').val();
        var count = 60;
        if (checkPhone('#phone') === 1) {
            sendCode(value);
            $(this).css('background', 'none');
            settime(this);
        }

    });
    //60s倒计时
    var countdown = 60;

    function settime(val) {
        console.log(countdown)
        if (countdown == 0) {
            countdown = 60;
            layer.alert('请重新发送！');
            $(val).text('');
            $(val).css('background', 'url("images/codeBgt_03.png") no-repeat center');
            // $(val).css('background-size', '100%');

            return false;
        } else {
            $(val).text(countdown + 's');
            countdown--;
        }
        setTimeout(function () {
            settime(val);
        }, 1000);
    }

//    预约
    $('.appointmentBg .sureBtn a').click(function (e) {
        e.preventDefault();
        var phone = $('#phone').val();
        var code = $('#code').val();
        var parb = getQueryString("id");//上一级id
        until.request({
            'url': url + 'tmaa',
            'type': 'get',
            'data': {'phone': phone, 'code': code, 'parb': parb},
            'successCallback': function (data) {
                console.log(data);
                if (data.success == 1) {
                    layer.alert(data.msg, function () {
                        window.location.reload();
                    });
                } else if (data.success == 2) {
                    $('.appointmentBg').hide();
                    $('.successBg').show();
                }else{
                    layer.alert(data.msg)
                }
            }
        })
    });

    // var shareUrl = http_type+'www.gundambattle.com/hd/shareActivity/share/'+id;
    // $.getJSON(http_type+"www.gundambattle.com/API201712/getWxShareRead/",function (reg) {
    //     wx.config({
    //         debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //         appId: reg.appId, // 必填，公众号的唯一标识
    //         timestamp: reg.timestamp, // 必填，生成签名的时间戳
    //         nonceStr: reg.nonceStr, // 必填，生成签名的随机串
    //         signature: reg.signature,// 必填，签名
    //         jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
    //     });
    //
    //     wx.ready(function () {
    //         // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    //         /*分享朋友圈*/
    //         wx.onMenuShareTimeline({
    //             title: '找到属于你的敢达机体!', // 分享标题
    //             desc: '3D正版敢达动作手游《敢达争锋对决》', // 分享描述
    //             link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //             imgUrl: imgUrl + 'images/share_hd_01.png', // 分享图标
    //             success: function () {
    //                 // 用户确认分享后执行的回调函数
    //             },
    //             cancel: function () {
    //                 // 用户取消分享后执行的回调函数
    //             },
    //             complete: function () {
    //                 if (jumpFlag) location.href = http_type + "www.gundambattle.com/hd/shareActivity/saf/" + id;
    //             }
    //
    //         });
    //
    //         /*分享朋友*/
    //         wx.onMenuShareAppMessage({
    //             title: '找到属于你的敢达机体!', // 分享标题
    //             desc: '3D正版敢达动作手游《敢达争锋对决》', // 分享描述
    //             link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //             imgUrl: imgUrl + 'images/share_hd_01.png', // 分享图标
    //             type: '', // 分享类型,music、video或link，不填默认为link
    //             dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    //             success: function () {
    //                 // 用户确认分享后执行的回调函数
    //             },
    //             cancel: function () {
    //                 // 用户取消分享后执行的回调函数
    //             },
    //             complete: function () {
    //                 if (jumpFlag) location.href = http_type + "www.gundambattle.com/hd/shareActivity/saf/" + id;
    //             }
    //
    //         });
    //
    //     });
    // });


    function rURL(id) {
        $(".link").val("http://www.msyxz.com/activity/mumbo_p/index.html?id="+id);
    }

});

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

