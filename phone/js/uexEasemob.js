/**
 * Created by xuhw on 2015/11/23.
 * ���Żص���������
 */
function uexEasemob(){
    /* ���Żص���������ʼ */
    var appKey = "eco-edu#jiaoxiang";//����app�ı�ʶ(��iOS)
    var apnsCertName = "";//iOS������֤�����ƣ���iOS��
    var isAutoLoginEnabled = "1";//�Ƿ����Զ���¼���� 1-���� 2-�ر�
    //iOS��ʼ��
    uexEasemob.initEasemob('{"appKey":"' + appKey + '","apnsCertName":"' + apnsCertName + '","isAutoLoginEnabled":"' + isAutoLoginEnabled + '"}');
    //��ʼ���ص�
    uexEasemob.cbInit = function (data) {
        //alert('cbInit:'+data);
    };
    //���Ӽ���
    uexEasemob.onConnected = function (data) {
        //alert('onConnected');
    };
    //�Ͽ����Ӽ���
    uexEasemob.onDisconnected = function (data) {
        //var optionCode = JSON.parse(data).error;
        ////1-�˺ű��Ƴ���2-�˺������豸��½��3-���Ӳ��������������4-��ǰ���粻����
        //switch (optionCode) {
        //    case '1':
        //        var content = "�����˺ű��Ƴ�";
        //        appcan.openToast(content, 3000);
        //        break;
        //    case '2':
        //        var content = "�����˺����������豸��¼���Ƿ����µ�¼?";
        //        OnDisConnectConfirm (content);
        //        break;
        //    case '3':
        //        var content = "���Ӳ������������";
        //        appcan.openToast(content, 3000);
        //        break;
        //    case '4':
        //        var content = "��ǰ���粻����";
        //        appcan.openToast(content, 3000);
        //        break;
        //}
    };

    //��¼�ص�
    uexEasemob.cbLogin = function (data) {
        var data = eval('(' + data + ')');
        if (data.result == 1) {
        }
        else {
        }
        uexEasemob.getTotalUnreadMsgCount();
        uexEasemob.getRecentChatters();
    };

    //��Ϣ�����������
    var param = {
        enable: 1,//0-�رգ�1-������Ĭ��Ϊ1 ��������Ϣ����
        soundEnable: 1,// 0-�رգ�1-������Ĭ��Ϊ1 ������������
        vibrateEnable: 1,// 0-�رգ�1-������Ĭ��Ϊ1 ����������
        userSpeaker: 1,// 0-�رգ�1-������Ĭ��Ϊ1 �������������ţ���Android���ã�
        showNotificationInBackgroud: 1,// 0-�رգ�1-������Ĭ��Ϊ1�����ú�̨��������Ϣʱ�Ƿ�ͨ��֪ͨ����ʾ ����Android���ã�
        acceptInvitationAlways: 0,// 0-�رգ�1-������Ĭ����Ӻ���ʱΪ1���ǲ���Ҫ��֤�ģ��ĳ���Ҫ��֤Ϊ0����Android���ã�
        deliveryNotification: 1// 0-�ر� 1-����  Ĭ��Ϊ1 ������Ϣ�ʹ�֪ͨ   ����iOS���ã�
    };
    var params = JSON.stringify(param);
    uexEasemob.setNotifyBySoundAndVibrate(param);

    //����Ϣ����
    uexEasemob.onNewMessage = function (param) {//�յ�����Ϣ����
        var data = eval('(' + param + ')');
        if (data.chatType == "0") {
            uexWindow.evaluatePopoverScript("Chatboard", "content", "NewMessage(" + param + ")");
        } else {
            uexWindow.evaluatePopoverScript("Chatroom", "content", "NewMessage(" + param + ")");
        }
        uexEasemob.getTotalUnreadMsgCount();
    };

    //��Ϣ�ʹ����
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
            appcan.window.openToast(" ��Ϣ����ʧ�ܣ��������磡", 3000);
        }
    };

    //��ȡconversation����ص�����ʱû�ã�
    uexEasemob.cbGetConversationByName = function (param) {
        //alert("cbGetConversationByName" + param);
    };

    //��ʷ��Ϣ��¼�ص�
    uexEasemob.cbGetMessageHistory = function (param) {
        var data = eval('(' + param + ')');
        var plat = uexWidgetOne.platformName;
        switch (plat) {
            case 'android':
                if (data[0].chatType == "0") {
                    //����
                    uexWindow.evaluatePopoverScript("Chatboard", "content", "HistoryMessage(" + param + ")");
                } else {
                    //Ⱥ��
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

    //��ȡ����δ����Ϣ�����ص�
    uexEasemob.cbGetUnreadMsgCount = function (param) {
        //alert("cbGetUnreadMsgCount" + param);
    };

    //��ȡ�ܼ�δ����Ϣ�����ص�
    uexEasemob.cbGetTotalUnreadMsgCount = function (param) {
        var data = eval('(' + param + ')');
        var count = data.count;
        appcan.locStorage.setVal("TotalUnreadMsgCount", count);
        appcan.window.publish("TaskData", param);
    };

    //��ȡ�����ϵ�˻ص�
    uexEasemob.cbGetRecentChatters = function (param) {
        appcan.locStorage.setVal("RecentChattersData", param);
        //uexWindow.evaluateMultiPopoverScript("MainTab", "content", "MyMsgContent", "BindChatMsgData(" + param + ")");
        uexWindow.evaluatePopoverScript("ImMsgCenter", "content", "ChatContentList(" + param + ")");
        uexWindow.evaluateScript("MainTab", 0, "TranslateRecentChatters('" + param + "')");
    };

    //�����������
    var aname = new Array();
    uexEasemob.onContactInvited = function (param) {
        var data = eval('(' + param + ')');
        var username = data.username;
        var displayName = data.reason;
        aname.push({"username": username, "displayName": displayName});
        appcan.locStorage.setVal('contactInvited', aname);
    };

    //��������ͬ�����
    uexEasemob.onContactAgreed = function (param) {
        //alert('onContactAgreed:'+param);
    };

    //�������󱻾ܾ�����
    uexEasemob.onContactRefused = function (param) {
        //alert('onContactRefused:'+param);
    };

    //��ȡȺ����ص�
    uexEasemob.cbGetGroup = function (param) {
        //alert("cbGetGroup:" + param);
        var data = eval('(' + param + ')');
        var isBlock = data.isBlock;
        appcan.frame.evaluateScript("ChatroomCenter", "content", "ChangeSwitchBtnStatus ('" + isBlock + "')");
    };
    /* ���Żص����������� */

}