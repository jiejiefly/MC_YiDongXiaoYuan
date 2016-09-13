var plat;
window.uexOnload = function (type) {
    //appcan.locStorage.remove();
    appcan.setLocVal("BaseUrl", "http://dapi.izhihuidao.com/api/");
    uexWidgetOne.cbGetMainWidgetId = cbGetMainWidgetId;
    uexWidgetOne.getMainWidgetId();

    //获取版本号
    uexWidgetOne.cbGetCurrentWidgetInfo = cbGetCurrentWidgetInfo;
    uexWidgetOne.getCurrentWidgetInfo();

    //获取系统类型
    uexWidgetOne.cbGetPlatform = cbGetPlatform;
    uexWidgetOne.getPlatform();

    ExitForAndroid();

    appcan.ready(function () {
        if (appcan.getLocVal("AppStarted-V20151026") == null) {
            ExecuteOneTime();
        }
        else {
            Business();
        }

        /* 环信回调、监听开始 */
        var appKey = "eco-edu#jiaoxiang";//区别app的标识(仅iOS)
        var apnsCertName = "";//iOS中推送证书名称（仅iOS）
        var isAutoLoginEnabled = "1";//是否开启自动登录功能 1-开启 2-关闭
        //iOS初始化
        uexEasemob.initEasemob('{"appKey":"' + appKey + '","apnsCertName":"' + apnsCertName + '","isAutoLoginEnabled":"' + isAutoLoginEnabled + '"}');
        //初始化回调
        uexEasemob.cbInit = function (data) {
            //alert('cbInit:'+data);
        };
        //连接监听
        uexEasemob.onConnected = function (data) {
            //alert('onConnected');
        };
        //断开连接监听
        uexEasemob.onDisconnected = function (data) {
            //var optionCode = JSON.parse(data).error;
            ////1-账号被移除，2-账号其他设备登陆，3-连接不到聊天服务器，4-当前网络不可用
            //switch (optionCode) {
            //    case '1':
            //        var content = "您的账号被移除";
            //        appcan.openToast(content, 3000);
            //        break;
            //    case '2':
            //        var content = "您的账号已在其他设备登录，是否重新登录?";
            //        OnDisConnectConfirm (content);
            //        break;
            //    case '3':
            //        var content = "连接不到聊天服务器";
            //        appcan.openToast(content, 3000);
            //        break;
            //    case '4':
            //        var content = "当前网络不可用";
            //        appcan.openToast(content, 3000);
            //        break;
            //}
        };

        //登录回调
        uexEasemob.cbLogin = function (data) {
            var data = eval('(' + data + ')');
            if (data.result == 1) {
                //登录成功
                uexEasemob.getTotalUnreadMsgCount();//获取未读消息总数
                uexEasemob.getRecentChatters();//获取最近的聊天对象信息
            }
            else {
                //登录失败
            }
        };

        //消息提醒相关配置
        var param = {
            enable: 1,//0-关闭，1-开启。默认为1 开启新消息提醒
            soundEnable: 1,// 0-关闭，1-开启。默认为1 开启声音提醒
            vibrateEnable: 1,// 0-关闭，1-开启。默认为1 开启震动提醒
            userSpeaker: 1,// 0-关闭，1-开启。默认为1 开启扬声器播放（仅Android可用）
            showNotificationInBackgroud: 1,// 0-关闭，1-开启。默认为1。设置后台接收新消息时是否通过通知栏提示 （仅Android可用）
            acceptInvitationAlways: 0,// 0-关闭，1-开启。默认添加好友时为1，是不需要验证的，改成需要验证为0（仅Android可用）
            deliveryNotification: 1// 0-关闭 1-开启  默认为1 开启消息送达通知   （仅iOS可用）
        };
        var params = JSON.stringify(param);
        uexEasemob.setNotifyBySoundAndVibrate(param);

        //新消息监听
        uexEasemob.onNewMessage = function (param) {
            var data = eval('(' + param + ')');
            if (data.chatType == "0") {
                //收到来自人的新消息
                uexWindow.evaluatePopoverScript("Chatboard", "content", "NewMessage(" + param + ")");
            } else {
                //收到来自群组的新消息
                uexWindow.evaluatePopoverScript("Chatroom", "content", "NewMessage(" + param + ")");
            }
            uexEasemob.getTotalUnreadMsgCount();
        };

        //消息送达监听
        uexEasemob.onMessageSent = function (param) {
            var data = eval('(' + param + ')');
            var isSuccess = data.isSuccess;
            if (isSuccess == true) {
                var messageId = data.message.messageId;
                var messageType = data.message.messageType;
                switch (messageType) {
                    case 'text':
                        var str = data.message.messageBody.text;
                        var typestr = 1;
                        break;
                    case 'image':
                        var str = data.message.messageBody.remotePath;
                        var typestr = 2;
                        break;
                    case 'audio':
                        var str = data.message.messageBody.remotePath;
                        var typestr = 3;
                        break;
                }
                if (data.message.chatType == "0") {
                    appcan.frame.evaluateScript("Chatboard", "content", "AddMyChat('" + str + "','" + typestr + "','" + messageId + "')");
                } else {
                    appcan.frame.evaluateScript("Chatroom", "content", "AddMyChat('" + str + "','" + typestr + "','" + messageId + "')");
                }

                uexEasemob.getRecentChatters();
            } else {
                appcan.window.openToast(" 消息发送失败，请检查网络！", 3000);
            }
        };

        //好友请求监听
        var aname = new Array();
        uexEasemob.onContactInvited = function (param) {
            var data = eval('(' + param + ')');
            var username = data.username;
            var displayName = data.reason;
            aname.push({"username": username, "displayName": displayName});
            appcan.locStorage.setVal('contactInvited', aname);
        };

        //好友请求被同意监听
        uexEasemob.onContactAgreed = function (param) {
            //alert('onContactAgreed:'+param);
        };

        //好友请求被拒绝监听
        uexEasemob.onContactRefused = function (param) {
            //alert('onContactRefused:'+param);
        };

        //获取conversation对象回调（暂时没用）
        uexEasemob.cbGetConversationByName = function (param) {
            //alert("cbGetConversationByName" + param);
        };

        //历史消息记录回调
        uexEasemob.cbGetMessageHistory = function (param) {
            var data = eval('(' + param + ')');
            var plat = uexWidgetOne.platformName;
            //由于android和iOS的返回字段不同，因此在这里需要判断平台
            switch (plat) {
                case 'android':
                    if (data[0].chatType == "0") {
                        //单聊
                        uexWindow.evaluatePopoverScript("Chatboard", "content", "HistoryMessage(" + param + ")");
                    } else {
                        //群聊
                        uexWindow.evaluatePopoverScript("Chatroom", "content", "HistoryMessage(" + param + ")");
                    }
                    break;
                case 'iOS':
                    if (data.messages[0].chatType == "0") {
                        uexWindow.evaluatePopoverScript("Chatboard", "content", "HistoryMessage(" + param + ")");
                    } else {
                        uexWindow.evaluatePopoverScript("Chatroom", "content", "HistoryMessage(" + param + ")");
                    }
                    break;
            }
        };

        //获取单条未读消息数量回调（暂未用到）
        uexEasemob.cbGetUnreadMsgCount = function (param) {
            //alert("cbGetUnreadMsgCount" + param);
        };

        //获取总计未读消息数量回调
        uexEasemob.cbGetTotalUnreadMsgCount = function (param) {
            var data = eval('(' + param + ')');
            var count = data.count;
            appcan.locStorage.setVal("TotalUnreadMsgCount", count);
            appcan.window.publish("TaskData", param);
        };

        //获取最近聊天对象回调
        uexEasemob.cbGetRecentChatters = function (param) {
            appcan.locStorage.setVal("RecentChattersData", param);
            //uexWindow.evaluateMultiPopoverScript("MainTab", "content", "MyMsgContent", "BindChatMsgData(" + param + ")");
            uexWindow.evaluatePopoverScript("ImMsgCenter", "content", "ChatContentList(" + param + ")");
            uexWindow.evaluateScript("MainTab", 0, "TranslateRecentChatters('" + param + "')");
        };

        //获取群详情回调
        uexEasemob.cbGetGroup = function (param) {
            //alert("cbGetGroup:" + param);
            var data = eval('(' + param + ')');
            var isBlock = data.isBlock;
            appcan.frame.evaluateScript("ChatroomCenter", "content", "ChangeSwitchBtnStatus ('" + isBlock + "')");
        };
        /* 环信回调、监听结束 */
    });

};

//只需要在应用安装后第一次启动的时候执行一次的,每次版本升级，需要AppStarted+版本号
function ExecuteOneTime() {

    appcan.setLocVal("AppStarted-V20151026", "True");
    appcan.setLocVal("BaseUrl", "http://dapi.izhihuidao.com/api/");
    //appcan.setLocVal("BaseUrl", "http://www.taedu.gov.cn:81/Mobile/api/");
    //appcan.setLocVal("BaseUrl", "http://192.168.1.100/Zhihuidao.Mobile.MCAPISample/api/");
    //appcan.setLocVal("BaseUrl", "");

    //to do 起始页面
    appcan.window.open({ name: 'Guide', data: 'Guide.html', aniId: 5 });
}

//登录和每次启动执行业务
function LoginCheck() {

    var token = appcan.getLocVal("Token");
    if (token == null) {
        setTimeout("appcan.window.open({ name: 'Login', data: 'Login.html', aniId: 5 })", 1000);
    }
    else {
        setTimeout("ExecuteMoreTimes()", 1000);
        //appcan.window.open({ name: 'MainTab', data: 'MainTab.html', aniId: 5 });
    }

}

//业务处理
function Business() {
    //读取配置文件到本地缓存或DB里
    var baseUrl = appcan.getLocVal("BaseUrl");
    $.ajax({
        url: baseUrl + "Config/GetJson?category=app",
        type: "GET",
        dataType: "json",
        success: function (appConfig) {
            appcan.setLocVal("AppConfig", JSON.stringify(appConfig));

            //切换数据源的时候，清除Token
            var lastDataSource = appcan.getLocVal("DataSource");
            if (lastDataSource != appConfig.DataSource) {
                appcan.locStorage.remove("Token");
                appcan.setLocVal("DataSource", appConfig.DataSource);
            }

            if (appConfig.DataSource == "ProjectData") {

                $.ajax({
                    url: baseUrl + "Config/GetScript?category=ProjectApi",
                    dataType: "json",
                    success: function (data) {
                        eval(data);
                        appcan.setLocVal("ApiConfig", apiConfig);
                        LoginCheck();
                    },
                    error: function () { ErrorFun2('读取ProjectApi配置文件错误(004)！'); }
                });

            }
            else if (appConfig.DataSource == "OnlineSampleData") {

                $.ajax({
                    url: baseUrl + "Config/GetScript?category=OnlineSampleApi",
                    dataType: "json",
                    success: function (data) {
                        eval(data);
                        appcan.setLocVal("ApiConfig", apiConfig);
                        LoginCheck();
                    },
                    error: function () { ErrorFun2('读取OnlineSampleApi配置文件错误(005)！'); }
                });
            }
            else {

                $.ajax({
                    url: "Config/LocalSampleApi.js",
                    dataType: "script",
                    success: function () {
                        //alert(apiConfig.GetUserInfo.Type);
                        appcan.setLocVal("ApiConfig", apiConfig);
                        LoginCheck();
                    },
                    error: function () { ErrorFun2('读取LocalSampleApi配置文件错误(006)！'); }
                });

            }

        },
        error: function () { ErrorFun2('读取App配置文件错误(003)！'); }
    });

}

function ExitForAndroid() {
    //如果是Android平台，则监听返回按钮事件
    //plat = uexWidgetOne.getPlatform();
    var exitv = 0;
    uexWindow.onKeyPressed = function (keyCode) {
        if (keyCode == 0) {
            exitv++;
            //uexWidgetOne.exit();
            //uexWidgetOne.exit("0");
            if (exitv == 1) {
                appcan.window.openToast("再按一次，退出应用！", 3000);
                setTimeout("exitv = 0;", 3000);
            }
            else if (exitv == 2) {
                uexWidgetOne.exit("0");
            }
        }
    };
    uexWindow.setReportKey(0, 1);
}

//需要第一次执行和登录后再次执行的JS
function ExecuteMoreTimes() {

    var token = appcan.getLocVal("Token");
    var userInfoApiParameters = { "accessToken": token };
    var apiConfig = JSON.parse(appcan.getLocVal("ApiConfig"));

    var url = apiConfig.GetUserInfo.Url;
    url = GetMappingUrl(url, userInfoApiParameters);

    var Type = apiConfig.GetUserInfo.Type;
    var isSuccess = 0;
    $.ajax({
        url: url,
        type: Type,
        data: userInfoApiParameters,
        dataType: "json",
        success: function (dt) {

            isSuccess = 1;
            var EEData = dt;
            var EEData_string = JSON.stringify(dt);
            //alert(EEData_string);
            if (EEData.res_code == undefined) {

                GlobalInit(EEData_string);

                appcan.setLocVal("UserInfo", EEData_string);
                appcan.setLocVal("UserID", EEData.Id);

                //在本地调试中心运行的时候，MainWidgetId是001，不能执行XG，会有问题。
                if (MainWidgetId != "001") {

                    var appConfig = JSON.parse(appcan.getLocVal("AppConfig"));
                    var accessID;
                    var accessKey;

                    if (plat == "Android") {
                        accessID = appConfig.MsgAndroid.AccessID;
                        accessKey = appConfig.MsgAndroid.AccessKey;
                    }
                    else {
                        accessID = appConfig.MsgIOS.AccessID;
                        accessKey = appConfig.MsgIOS.AccessKey;
                    }


                    /*
                     *以下为信鸽注册，第三个参数为注册账号（别名）
                     *
                     *此为正式项目中的信鸽注册代码
                     *
                     *正式项目中请取消下面一行代码的注释，并注释掉移动校园DEMO版本信鸽注册
                     */

                    //uexXG.InitXgUserPush(accessID, accessKey, EEData.Id);


                    /*
                     *以下为信鸽注册，第三个参数为注册账号（别名）
                     *
                     *此为移动校园DEMO中的信鸽注册代码
                     *
                     *正式项目中请注释掉以下代码，并取消注释正式项目的信鸽注册，即取消上方一行代码
                     */

                    //var xgID = EEData.Id + Math.random();
                    var xgID = EEData.Id;
                    appcan.locStorage.val("xgID", xgID);
                    //uexXG.InitXgUserPush(accessID, accessKey, xgID);

                }
                //IOS下面，需要下面这个代码，否则跳转不过去，似乎与异步有关系。
                appcan.window.open({ name: 'MainTab', data: 'MainTab.html', aniId: 5 });
            }
            else if (EEData.res_code == "0") { }
            else if (EEData.res_code == "-1") {
                //-1表示Token无效
                alert("请重新登录！");
                appcan.locStorage.remove("Token");
                appcan.window.open({ name: 'Login', data: 'Login.html', aniId: 5 });
            }
            else { alert(res_message); }

        },
        complete: function (xhr, status) {
            if (isSuccess == 0) {
                ErrorFun('获取用户信息发生错误(001)！');
            }
        }

    });

}

//错误处理公共方法
function ErrorFun(errorTxt) {
    appcan.window.confirm({
        title: '错误信息',
        content: errorTxt,
        buttons: ['重试', '退出', '继续'],
        callback: function (err, data, dataType, optId) {
            if (err) {
                return;
            }
            if (data == 0) {
                ExecuteMoreTimes();
            }
            else if (data == 1) {
                uexWidgetOne.exit("0");
            }
            else if (data == 2) {
                appcan.window.open({ name: 'MainTab', data: 'MainTab.html', aniId: 5 });
            }
        }
    });
}

function ErrorFun2(errorTxt) {
    appcan.window.confirm({
        title: '错误信息',
        content: errorTxt,
        buttons: ['退出', '继续'],
        callback: function (err, data, dataType, optId) {
            if (err) {
                return;
            }
            if (data == 0) {
                uexWidgetOne.exit("0");
            }
            else if (data == 1) {
                LoginCheck();
            }
        }
    });
}

//全局对象初始化 持久化
function GlobalInit(userInfo) {

    var appConfig = JSON.parse(appcan.getLocVal("AppConfig"));

    if (userInfo.indexOf(appConfig.RoleId.Teacher) != -1) {
        //老师
        appcan.setLocVal("UserType", "Teacher");
    }
    else if (userInfo.indexOf(appConfig.RoleId.Parents) != -1) {
        //家长
        appcan.setLocVal("UserType", "Parents");
    }
    else {
        //学生
        appcan.setLocVal("UserType", "Student");
    }
}

function cbGetCurrentWidgetInfo(opId, dataType, data) {

    var data = JSON.parse(data);
    var version = data.version;
    appcan.locStorage.val("version", version);

    var appId = data.appId;
    appcan.locStorage.val("appId", appId);

}

function OnDisConnectConfirm (content) {
    appcan.window.confirm({
        title:'提示',
        content:content,
        buttons:['确定','取消'],
        callback:function(err,data,dataType,optId){
            if(err){
                //如果出错了
                return;
            }
            if(data == 0){
                appcan.locStorage.remove("Token");
                appcan.window.open("Login", "../Login.html", 2);
            }
        }
    });
}

function cbGetPlatform(opId,dataType,data){
    if(data == 0){
        plat = "iOS";
    }else if(data == 1){
        plat = "Android";
    }else {
        plat = "Unknow";
    }
    appcan.locStorage.val("Platform",plat);
}