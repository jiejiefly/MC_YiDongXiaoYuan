
//var url1 = "abc/{Test}/{Test2}";
//var jsonParam = { "Test": "djw", "Test2": "xhw", "Test3": "wyyy" };

function GetMappingUrl(url,jsonParam)
{
    var returnUrl = url;
    var strParam = JSON.stringify(jsonParam).replace("{", "").replace("}", "");
    var arrParam = strParam.split(',');

    $.each(arrParam, function (index, item) {

        var paramKey = arrParam[index].split(':')[0].replace("\"", "").replace("\"", "").replace("'", "").replace("'", "");
        var paramVal = arrParam[index].split(':')[1].replace("\"", "").replace("\"", "").replace("'", "").replace("'", "");

        returnUrl = returnUrl.replace("{"+paramKey+"}", paramVal);

    });

    return returnUrl;
}

function GetApiData(apiName,apiParameters){
    var isSuccess = 0;
    var apiConfig = JSON.parse(appcan.getLocVal("ApiConfig"));
    var getApiDataUrl = apiConfig[apiName].Url;
    var getApiDataType = apiConfig[apiName].Type;
    getApiDataUrl = GetMappingUrl(getApiDataUrl,apiParameters);
    $.ajax({
        url: getApiDataUrl,
        type: getApiDataType,
        dataType: "json",
        data: apiParameters,
        success: function (msg) {
            isSuccess = 1;
            return msg;
        },
        complete: function (xhr, status) {
            if (isSuccess == 0) {
                alert("发生未知错误！");
                //appcan.window.confirm({
                //    title: '错误信息',
                //    content: '获取消息列表失败！',
                //    buttons: ['重试', '退出'],
                //    callback: function (err, data, dataType, optId) {
                //        if (err) {
                //            return;
                //        }
                //        if (data == 0) {
                //            GetTopic($scope, index, size);
                //        }
                //        else if (data == 1) {
                //            appcan.window.evaluateScript({
                //                name: 'StudyCircle',
                //                scriptContent: 'CloseWindow()'
                //            });
                //        }
                //    }
                //});
            }
        }
    });//ajax结束
}