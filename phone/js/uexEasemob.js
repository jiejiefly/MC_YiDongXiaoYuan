/**
 * Created by xuhw on 2015/11/23.
 * 环信回调监听代码
 */
function uexEasemob(){
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
        }
        else {
        }
        uexEasemob.getTotalUnreadMsgCount();
        uexEasemob.getRecentChatters();
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
    uexEasemob.onNewMessage = function (param) {//收到新消息监听
        var data = eval('(' + param + ')');
        if (data.chatType == "0") {
            uexWindow.evaluatePopoverScript("Chatboard", "content", "NewMessage(" + param + ")");
        } else {
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

    //获取conversation对象回调（暂时没用）
    uexEasemob.cbGetConversationByName = function (param) {
        //alert("cbGetConversationByName" + param);
    };

    //历史消息记录回调
    uexEasemob.cbGetMessageHistory = function (param) {
        var data = eval('(' + param + ')');
        var plat = uexWidgetOne.platformName;
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

    //获取单条未读消息数量回调
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

    //获取最近联系人回调
    uexEasemob.cbGetRecentChatters = function (param) {
        appcan.locStorage.setVal("RecentChattersData", param);
        //uexWindow.evaluateMultiPopoverScript("MainTab", "content", "MyMsgContent", "BindChatMsgData(" + param + ")");
        uexWindow.evaluatePopoverScript("ImMsgCenter", "content", "ChatContentList(" + param + ")");
        uexWindow.evaluateScript("MainTab", 0, "TranslateRecentChatters('" + param + "')");
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

    //获取群详情回调
    uexEasemob.cbGetGroup = function (param) {
        //alert("cbGetGroup:" + param);
        var data = eval('(' + param + ')');
        var isBlock = data.isBlock;
        appcan.frame.evaluateScript("ChatroomCenter", "content", "ChangeSwitchBtnStatus ('" + isBlock + "')");
    };
    /* 环信回调、监听结束 */

}