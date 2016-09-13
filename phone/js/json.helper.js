Array.prototype.selectFirst = function (predicate) { 
    var first = null; 
    if (typeof predicate == "function") {

        for (var i = 0; i < this.length; i++) { 
            if (predicate(this[i])) { 
                first = this[i]; 
                break; 
            } 
        } 

    } else { 
        throw new Error("predicate ���ͱ���Ϊfunction"); 
    } 
    return first; 
}; 

Array.prototype.deleteFirst = function (predicate) { 
    if (typeof predicate == "function") { 
        var obj = this.firstOrDefault(predicate); 
        if (obj) {
            //delete obj;
            //array.splice(array.indexOf(obj),1);
            this.splice(this.indexOf(obj), 1);
        } 

    } else { 
        throw new Error("predicate ���ͱ���Ϊfunction"); 
    } 
};

//����
//var str = '[{"name":"aa","age":"23"},{"name":"bb","age":"24"},{"name":"cc","age":"25"}]';
//var array = JSON.parse(str);

//array.push({ "name": "dd", "age": "25" });

////�޸� 
//var obj = array.selectFirst(
//    function (x) {
//        return x.name == 'bb';
//    }
//);
//obj.age = 25;

////ɾ�� 
//array.deleteFirst(
//    function (x) {
//        return x.name == 'cc';
//    }
//);

////תΪjson�ַ��� 
//str = JSON.stringify(array);
//alert(str);





//����һ���޸�
//���Զ�ֵ����ɾ�ģ�û��return��ʾ���������ԣ�return��ֵ��ʾ��key��json�ַ����е�ֵ
//var jsonStr = '{"name": "hanzichi", "sex": "male", "age": 10}';
//var obj = JSON.parse(jsonStr, function (key, value) {
//    if (key === 'name') {
//        return 'my name is ' + value;
//    }
//    return value;

//});