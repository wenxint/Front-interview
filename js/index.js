/*等页面加载完毕后执行的函数
等页面资源都加载完毕才执行JS代码*/
window.addEventListener('load', function() {
    //调用搜索渐变功能函数
    // searchGradient();
    //调用倒计时功能函数
    // downTime();
    //调用轮播图功能的函数
    // slide();
    // 使用构造函数的方式就需要new 创建构造函数的实例对象 才能调用里面的原型对象的方法
    var jdEffect = new JdEffect();
    //调用对象里面的搜索效果  来自于父元素的原型对象继承下来的函数
    jdEffect.searchGradient();
    //调用对象里面的倒计时效果
    jdEffect.downTime();
    //调用对象里面的轮播图效果
    jdEffect.slide();
});

//顶部搜索渐变JS 功能函数
// function searchGradient() {
//     // 1. 获取header顶部元素
//     var header = document.querySelector('#header');
//     // 2. 获取滚动条滚动的距离需要添加一个滚动条滚动的事件在事件里面去获取
//     window.addEventListener('scroll', scroll);
//     scroll();
//     //防止突然刷新页面没有触发事件 无法生效背景色
//     function scroll() {
//         // 3. 在滚动条事件里面获取滚动的距离
//         var scrollTop = document.documentElement.scrollTop;
//         // var scrollTop = document.body.scrollTop;
//         // 如果你的东西是属于html的使用 documentElement  如果属于body那就是body
//         console.log(scrollTop);
//         // 4. 获取轮播图的高度来计算
//         var slideHeight = document.querySelector('#slide').offsetHeight;
//         // 5. 计算当前滚动里面的透明度值 距离/轮播图高度
//         var opacity = scrollTop / slideHeight;
//         // 6. 判断当前透明度是否大于1
//         if (opacity > 1) {
//             // 7. 如果透明度大于1就设置为1
//             header.style.backgroundColor = 'rgba(222, 24, 27,1)';
//         } else {
//             // 8. 如果透明度小于 就设置为当前计算的透明度
//             header.style.backgroundColor = 'rgba(222, 24, 27,' + opacity + ')';
//         }
//     }
// }

//倒计时JS 功能函数 
// function downTime() {
//     // 1. 获取未来的时间  new Date()参数 
//     //今天中午12点的时间 月份是从0-11 月份减少1月  按照年月日时分秒每个数字用逗号隔开
//     // getTime方法是获取一个时间的毫秒数 从1970 1.1. 0:00:00  - 今天中午12的时间差的毫秒数
//     var futureTime = Math.floor(new Date(2018, 8, 22, 12, 00, 00).getTime() / 1000); //除以1000是求秒数
//     // 2. 获取当前时间的秒数
//     var nowTime = Math.floor(new Date().getTime() / 1000);
//     // 3. 获取未来时间-当前时间的秒杀的时间差 倒计时的总时间
//     var time = futureTime - nowTime;
//     var spans = document.querySelectorAll('.down-time span');
//     // 4. 定义一个定时器 让总时间每隔1秒--
//     setInterval(function() {
//         time--;
//         if (time <= 0) {
//             //写死的一个时间  真正开发使用重新请求后台的时间
//             time = 7200;
//         }
//         // 5. 求出当前秒数的小时 分钟 秒数  
//         // 小时 因为1小时是3600秒 总秒数/3600就是小时数
//         var hour = Math.floor(time / 3600);
//         //分钟 因为1分钟60 可能超过了1小时去掉小时部分 总时间%3600  用秒数/60
//         var minute = Math.floor(time % 3600 / 60);
//         //秒数 总时间 % 60 只要除不尽60 都是秒数部分
//         var second = Math.floor(time % 60);
//         // 6. 把计算好的时分秒放到span里面 把小时的部分/10 就是 十位
//         spans[0].innerHTML = Math.floor(hour / 10);
//         //小时部分的个位 小时 取模10 
//         spans[1].innerHTML = Math.floor(hour % 10);
//         spans[3].innerHTML = Math.floor(minute / 10);
//         spans[4].innerHTML = Math.floor(minute % 10);
//         spans[6].innerHTML = Math.floor(second / 10);
//         spans[7].innerHTML = Math.floor(second % 10);
//     }, 1000);
// }

//轮播图功能函数
// function slide() {
//     //轮播图的初始化
//     var mySwiper = new Swiper('#slide .swiper-container', {
//         direction: 'horizontal', // 垂直切换选项
//         autoplay: {
//             delay: 1000, //轮播图的延迟
//             stopOnLastSlide: false, // 如果设置为true，当切换到最后一个slide时停止自动切换。（loop模式下无效）
//             disableOnInteraction: false //当用户滑动的时候禁止自动轮播图 不需要禁止就为false
//         },
//         loop: true, // 是否开启无缝轮播图 开启无轮播图  如果不开 刷回去倒退回去
//         // 如果需要分页器
//         pagination: {
//             el: '.swiper-pagination',
//         }
//     });
// }

// 为什么要使用对象
// 	1. 对象只需要一个全局 减少全局污染
// 	2. 给函数归类 属于效果归在效果类  属于工具 归在工具类

//京东效果对象
// var jdEffect = {
//     //顶部搜索渐变JS 功能函数
//     searchGradient: function() {
//         // 1. 获取header顶部元素
//         var header = document.querySelector('#header');
//         // 2. 获取滚动条滚动的距离需要添加一个滚动条滚动的事件在事件里面去获取
//         window.addEventListener('scroll', scroll);
//         scroll();
//         //防止突然刷新页面没有触发事件 无法生效背景色
//         function scroll() {
//             // 3. 在滚动条事件里面获取滚动的距离
//             var scrollTop = document.documentElement.scrollTop;
//             // var scrollTop = document.body.scrollTop;
//             // 如果你的东西是属于html的使用 documentElement  如果属于body那就是body
//             console.log(scrollTop);
//             // 4. 获取轮播图的高度来计算
//             var slideHeight = document.querySelector('#slide').offsetHeight;
//             // 5. 计算当前滚动里面的透明度值 距离/轮播图高度
//             var opacity = scrollTop / slideHeight;
//             // 6. 判断当前透明度是否大于1
//             if (opacity > 1) {
//                 // 7. 如果透明度大于1就设置为1
//                 header.style.backgroundColor = 'rgba(222, 24, 27,1)';
//             } else {
//                 // 8. 如果透明度小于 就设置为当前计算的透明度
//                 header.style.backgroundColor = 'rgba(222, 24, 27,' + opacity + ')';
//             }
//         }
//     },
//     //倒计时JS 功能函数 
//     downTime: function() {
//         // 1. 获取未来的时间  new Date()参数 
//         //今天中午12点的时间 月份是从0-11 月份减少1月  按照年月日时分秒每个数字用逗号隔开
//         // getTime方法是获取一个时间的毫秒数 从1970 1.1. 0:00:00  - 今天中午12的时间差的毫秒数
//         var futureTime = Math.floor(new Date(2018, 8, 22, 12, 00, 00).getTime() / 1000); //除以1000是求秒数
//         // 2. 获取当前时间的秒数
//         var nowTime = Math.floor(new Date().getTime() / 1000);
//         // 3. 获取未来时间-当前时间的秒杀的时间差 倒计时的总时间
//         var time = futureTime - nowTime;
//         var spans = document.querySelectorAll('.down-time span');
//         // 4. 定义一个定时器 让总时间每隔1秒--
//         setInterval(function() {
//             time--;
//             if (time <= 0) {
//                 //写死的一个时间  真正开发使用重新请求后台的时间
//                 time = 7200;
//             }
//             // 5. 求出当前秒数的小时 分钟 秒数  
//             // 小时 因为1小时是3600秒 总秒数/3600就是小时数
//             var hour = Math.floor(time / 3600);
//             //分钟 因为1分钟60 可能超过了1小时去掉小时部分 总时间%3600  用秒数/60
//             var minute = Math.floor(time % 3600 / 60);
//             //秒数 总时间 % 60 只要除不尽60 都是秒数部分
//             var second = Math.floor(time % 60);
//             // 6. 把计算好的时分秒放到span里面 把小时的部分/10 就是 十位
//             spans[0].innerHTML = Math.floor(hour / 10);
//             //小时部分的个位 小时 取模10 
//             spans[1].innerHTML = Math.floor(hour % 10);
//             spans[3].innerHTML = Math.floor(minute / 10);
//             spans[4].innerHTML = Math.floor(minute % 10);
//             spans[6].innerHTML = Math.floor(second / 10);
//             spans[7].innerHTML = Math.floor(second % 10);
//         }, 1000);
//     },
//     //轮播图功能函数
//     slide: function() {
//         //轮播图的初始化
//         var mySwiper = new Swiper('#slide .swiper-container', {
//             direction: 'horizontal', // 垂直切换选项
//             autoplay: {
//                 delay: 1000, //轮播图的延迟
//                 stopOnLastSlide: false, // 如果设置为true，当切换到最后一个slide时停止自动切换。（loop模式下无效）
//                 disableOnInteraction: false //当用户滑动的时候禁止自动轮播图 不需要禁止就为false
//             },
//             loop: true, // 是否开启无缝轮播图 开启无轮播图  如果不开 刷回去倒退回去
//             // 如果需要分页器
//             pagination: {
//                 el: '.swiper-pagination',
//             }
//         });
//     }
// }
var JdEffect = function (dom) {
	
}

//京东效果对象
JdEffect.prototype = {
    //顶部搜索渐变JS 功能函数
    searchGradient: function() {
    	  // console.log(this.dom);
        // 1. 获取header顶部元素
        var header = document.querySelector('#header');
        // 2. 获取滚动条滚动的距离需要添加一个滚动条滚动的事件在事件里面去获取
        window.addEventListener('scroll', scroll);
        scroll();
        //防止突然刷新页面没有触发事件 无法生效背景色
        function scroll() {
            // 3. 在滚动条事件里面获取滚动的距离
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            // var scrollTop = document.body.scrollTop;
            // 如果你的东西是属于html的使用 documentElement  如果属于body那就是body
            console.log(scrollTop);
            // 4. 获取轮播图的高度来计算
            var slideHeight = document.querySelector('#slide').offsetHeight;
            // 5. 计算当前滚动里面的透明度值 距离/轮播图高度
            var opacity = scrollTop / slideHeight;
            // 6. 判断当前透明度是否大于1
            if (opacity > 1) {
                // 7. 如果透明度大于1就设置为1
                header.style.backgroundColor = 'rgba(222, 24, 27,1)';
            } else {
                // 8. 如果透明度小于 就设置为当前计算的透明度
                header.style.backgroundColor = 'rgba(222, 24, 27,' + opacity + ')';
            }
        }
    },
    //倒计时JS 功能函数 
    downTime: function() {
    	  // console.log(this.dom);
        // 1. 获取未来的时间  new Date()参数 
        //今天中午12点的时间 月份是从0-11 月份减少1月  按照年月日时分秒每个数字用逗号隔开
        // getTime方法是获取一个时间的毫秒数 从1970 1.1. 0:00:00  - 今天中午12的时间差的毫秒数
        var futureTime = Math.floor(new Date(2018, 8, 22, 12, 00, 00).getTime() / 1000); //除以1000是求秒数
        // 2. 获取当前时间的秒数
        var nowTime = Math.floor(new Date().getTime() / 1000);
        // 3. 获取未来时间-当前时间的秒杀的时间差 倒计时的总时间
        var time = futureTime - nowTime;
        var spans = document.querySelectorAll('.down-time span');
        // 4. 定义一个定时器 让总时间每隔1秒--
        setInterval(setTime, 1000);
        setTime();
        function setTime() {
            time--;
            if (time <= 0) {
                //写死的一个时间  真正开发使用重新请求后台的时间
                time = 7200;
            }
            // 5. 求出当前秒数的小时 分钟 秒数  
            // 小时 因为1小时是3600秒 总秒数/3600就是小时数
            var hour = Math.floor(time / 3600);
            //分钟 因为1分钟60 可能超过了1小时去掉小时部分 总时间%3600  用秒数/60
            var minute = Math.floor(time % 3600 / 60);
            //秒数 总时间 % 60 只要除不尽60 都是秒数部分
            var second = Math.floor(time % 60);
            // 6. 把计算好的时分秒放到span里面 把小时的部分/10 就是 十位
            spans[0].innerHTML = Math.floor(hour / 10);
            //小时部分的个位 小时 取模10 
            spans[1].innerHTML = Math.floor(hour % 10);
            spans[3].innerHTML = Math.floor(minute / 10);
            spans[4].innerHTML = Math.floor(minute % 10);
            spans[6].innerHTML = Math.floor(second / 10);
            spans[7].innerHTML = Math.floor(second % 10);
        }
    },
    //轮播图功能函数
    slide: function() {
    	  // console.log(this.dom);
        //轮播图的初始化
        var mySwiper = new Swiper('#slide .swiper-container', {
            direction: 'horizontal', // 垂直切换选项
            autoplay: {
                delay: 1000, //轮播图的延迟
                stopOnLastSlide: false, // 如果设置为true，当切换到最后一个slide时停止自动切换。（loop模式下无效）
                disableOnInteraction: false //当用户滑动的时候禁止自动轮播图 不需要禁止就为false
            },
            loop: true, // 是否开启无缝轮播图 开启无轮播图  如果不开 刷回去倒退回去
            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination',
            }
        });
    }
}