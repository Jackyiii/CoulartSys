/**
javascript 运动函数
 */
//获取对象样式的函数getStyle：解决currentStyle与getComputedStyle的浏览器兼容问题
function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];//attr为变量，用[]来表示
    }else{
        return getComputedStyle(obj,false)[attr];
    }
}
function startMove(obj,json,sp,endFn){
    clearInterval(obj.timer); //开始另一个定时器之前要先清除之前的定时器
    //obj.timer为定时器的名字   
    obj.timer = setInterval(function(){
        //设置一个开关，解决动画被连续调用出现的一些问题
        var stop=true;//假设运动到了目标位置
            for(attr in json){
                //opcity需要处理浏览器兼容问题
                var start=0;//start记录当前值
                if(attr==='opacity'){
                    start = Math.round(parseFloat(getStyle(obj,attr))*100) || 100;//统一采用0-100，默认100
                }else{
                    start=parseInt(getStyle(obj,attr));
                }
                if(start!=json[attr]){
                    stop=false;
                }
                //比当前值小的时候start>json[attr]，比当前值大的时候start<json[attr]
                var speed=(json[attr]-start)/sp;//随着start增大，速度会越来越慢
                    speed = speed>0 ? Math.ceil(speed) : Math.floor(speed);//为正时向上取整；为负时向下取整
                if(attr==='opacity'){
                    obj.style.filter="alpha(opacity:'+ (start + speed) +')";//IE "alpha(opacity:'+ (start + speed) +')";
                    obj.style.opacity=(start+speed)/100;//标准浏览器

                }else{
                     obj.style[attr]=(start+speed)+'px';
                }
                if(stop){
                    clearInterval(obj.timer);//到达指定位置就清除定时器
                }
                if(endFn){
                    endFn.call(obj);
                }

            }

        },30);
    }
/*
*应注意的几点：
*opacity单词拼写错误
*获取元素样式要用getStyle
*opacity兼容性写法
*转换为整数处理
 */