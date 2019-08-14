

/**匀速动画封装
 * @param: ele:元素
 * @param: target:目标位置
 */
function animationMove(ele, target) {
    //1.先清除之前的定时器，以本次为准
    clearInterval(ele.timeID);
    //2.开始本次移动
    ele.timeID = setInterval(function () {
        //2.1 获取元素当前位置
        var currentLeft = ele.offsetLeft;
        //2.2 开始移动
        var isLeft = currentLeft <= target ? true : false;
        isLeft ? currentLeft += 15 : currentLeft -= 15;
        ele.style.left = currentLeft + 'px';
        //2.3 边界检测
        if (isLeft ? currentLeft >= target : currentLeft <= target) {
            //(1)停止定时器
            clearInterval(ele.timeID);
            //(2)元素复位
            ele.style.left = target + 'px';
        };
    }, 10);
};


/**缓动动画封装
         * @parma: ele:移动元素
         * @parma: attrs:要移动的属性对象
         * @parma: fn 回调函数: 如果传了代码，动画结束之后帮你执行这段代码。没传不执行
         */
function animationSlow(ele, attrs, fn) {
    //1.先清除以前的定时器，以本次为准
    clearInterval(ele.timeID);
    //2.开始本次移动
    ele.timeID = setInterval(function () {
        /*开关思想
        1.提出假设 var isAllOk = true
        2.验证假设
        3.根据开关结果实现需求 
         */
        //1：提出假设
        var isAllOk = true;
        //2：验证假设
        //遍历对象的属性
        for (var key in attrs) {
            var attr = key;
            var target = attrs[key];
            if (attr == 'zIndex' || attr == 'backgroundColor') {
                //层级没有动画
                ele.style[attr] = target;
            } else if (attr == 'opacity') {//由于透明度与一般属性区别比较大，所以透明度单独逻辑
                //2.1.获取元素当前位置
                //注意点： 透明度使用parseFloat转换number，放大100倍
                var current = parseFloat(getStyle(ele, attr)) * 100;
                target *= 100;
                //2.2.计算本次移动距离 = （目标位置 - 当前位置）/10
                var step = (target - current) / 10;
                //取整：  step正数：向上取整 从左往右   step是负数：从下取整 从右往左
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                //2.3.开始移动
                current += step;
                ele.style[attr] = current / 100;//透明度没有单位
                //开关思想第二步：如果有任何属性没有到达终点则假设被推翻
                if (current != target) {
                    isAllOk = false;
                };
            } else {
                //2.1.获取元素当前位置
                //注意点： getComputerStyle获取的是字符串，需要使用parseInt转成number类型
                var current = parseInt(getStyle(ele, attr));
                //2.2.计算本次移动距离 = （目标位置 - 当前位置）/10
                var step = (target - current) / 10;
                //取整：  step正数：向上取整 从左往右   step是负数：从下取整 从右往左
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                //2.3.开始移动
                current += step;
                ele.style[attr] = current + 'px';
                //开关思想第二步：如果有任何属性没有到达终点则假设被推翻
                if (current != target) {
                    isAllOk = false;
                };
            }
        };
        //3：根据开关结果实现需求
        if (isAllOk) {
            clearInterval(ele.timeID);
            //如果调用者传递了第三个参数，并且是函数类型则执行函数体代码
            if (typeof fn == 'function') {
                fn();
            };
        };
    }, 20);
};

/*IE8兼容性封装
    @parma： ele：元素
    @parma: attribute:属性名字符串
    @return: 属性值 
 */

function getStyle(ele, attribute) {
    //能力检测
    //判断window对象有没有这个方法:对getComputedStyle属性取值，如果能和转成true说明存在这个方法
    if (window.getComputedStyle) {//谷歌火狐
        var style = window.getComputedStyle(ele, null);
        // return style.attribute;//点语法获取attribute属性值 : undefined
        return style[attribute];//字符串语法取attribute变量中对应字符串属性值
    } else {//IE8
        return ele.currentStyle[attribute];
    }
};