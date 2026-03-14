// ==UserScript==
// @name         问卷星脚本-Tsingyou
// @author       Tsingyou
// @version      1.0
// @description  在zemelee的基础上稍加改进而来。特别感谢。zemelee的项目原地址https://github.com/Zemelee/wjx/   本人在原本基础上增加了阿里云验证码（点击）的应对机制。Tsingyouz@qq.com。2026-3-14。
// @match        *://*.wjx.*
// @match        https://www.wjx.cn/*
// @match        https://w.wjx.com/*
// @match        https://v.wjx.cn/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.min.js
// ==/UserScript==


//user需要关注的代码就是：
//①问卷链接需要替换
//②题目设置
//③改完代码记得保存！ctrl+s。
//④在开启插件的情况下，另开一个标签页打开目标问卷星链接即可。
//建议使用chrome浏览器。



(function () {
    // 1. 强制清空所有存储
    localStorage.clear();
    sessionStorage.clear();
    window.name = "";

    // 2. 隐藏webdriver
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

    // 3. 随机浏览器指纹
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => [2, 4, 8][Math.floor(Math.random() * 3)] });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => [4, 8, 16][Math.floor(Math.random() * 3)] });

    // 4. 屏蔽所有脚本检测
    delete window.chrome;
    delete window._greasyMonkey;
})();

localStorage.clear();
sessionStorage.clear();
console.log("Storage已清除!")

setTimeout(() => {
    localStorage.clear();
    sessionStorage.clear();
    location.href = url;
}, 60000);//防止意外终止，页面60s后强制自动刷新


localforage.config({  //左边的黄色警告不用管
    driver: localforage.INDEXEDDB,
    name: 'wjx'  //准备 wjx 数据库
});


//左边的黄色警告不用管，只要不是红色就不影响运行
localforage.getItem("wjx_count").then(value => {
    if (value !== null)
    {
        QDPOYIt1();
    } else
    {
        return localforage.setItem("wjx_count", 0).then(() => {
            QDPOYIt1();
        });
    }
}).catch(() => {
    console.log("如果出现意外错误，可手动刷新")
});

var cancelBtn = document.querySelector('a.layui-layer-btn1');
if (cancelBtn)
{
    cancelBtn.click();
}

(async function () {
    var url = "https://v.wjx.cn/vm/xxxxxx.aspx";//此处填入你的链接
    // 若当前页面为问卷调查完成页，重定向到目标 URL
    if (window.location.href.includes("join"))
    {
        await setCount();   // 👈 必须加 await，等保存成功
        let count = await localforage.getItem('wjx_count');
        console.log(`✅ 提交成功！当前已完成：${count} 份`);

        setTimeout(() => {
            window.location.href = url;
        }, 2000);
    }

    var opt;
    //原作者描述的规则开始：
    //在单选题的函数single()中，括号里需要写题号和每个选项的比例，比如single(1, [1,2,3])表示第1题，选A占1/(1+2+3),B占2/6,C占3/6;
    //单选：也可以写成百分比的形式，比如[1,20,79],毕竟百分比也是比例；选项数量和比例数量必须一致，否则会报错
    //在多选题的函数multiple()，括号里需写题号和各选项选择的人数比，比如multiple(2, [50,10,100])表示第2题，选A的人有50%,选B的人有10%,选C的人有100%;、
    //多选：每个选项的概率彼此独立,不需要让概率和加起来等于100，
    //在填空题的函数vacant()中,括号里需写题号，内容和每个内容对应的比例，比如vacant(3,[1,1],["hello","world"])表示第3题，填写hello和world的比例为1: 1
    //nextPage()表示翻页
    //{"1": [1, 0, 0, 0, 0],.......}表示矩阵题各个小题的比例，其中的每个小题概率含义与单选题一致
    //在矩阵题的函数matrix()中，括号里需要写题号和每个选项的比例，比如matrix(4,{...})表示第4题，每个小题按照中括号里写的比例刷数据
    //在单选题的函数scale()中，括号里需要写题号和每个选项的比例，比如scale(5,[1,1,2,2,6])表示第5题，A:B:C:D:E = 1:1:2:2:6(和单选题意思一致)
    //在滑块题的函数slide()中,括号里需写题号,以及希望分数最大最小值，slide(7,50,70)表示第7题，分数介于50和70之间
    //所有输入，请在英文输入法里进行，中文和英文的很多符号是不一样的，比如---->    （）()  ｛｝{}   ：:   ,， ;；
    //目前脚本可以处理单选（single）、多选（multiple）、矩阵（matrix）、滑块（slide）、填空（vacant）、量表（scale）类问题，这也包括了大部分常见题型
    //原作者描述的规则结束。

    //  原作者极力广告  sugarblack.top  
    //  以上网站可以免费解析出问卷的问题，可以用这个网站快捷完成下方代码的填写
    //  解析步骤：填写问卷链接，点击解析，点击“复制比例”按钮，将复制的内容与以上规则一起交给ai。让ai进行合适的格式转换。

    //题目设置：
    single(1, [18, 42, 15, 13, 8, 4])
    multiple(2, [78, 18, 42, 12, 35, 0])
    single(3, [16, 12, 24, 15, 8, 10, 15, 0])
    single(4, [22, 21, 24, 18, 15])
    multiple(5, [28, 22, 18, 56, 62, 32, 0])
    multiple(6, [26, 18, 42, 15, 38, 56, 28, 22, 35, 0])
    slide(7, 2, 5)
    single(8, [24, 38, 20, 8, 3, 4, 3])
    single(9, [5, 22, 18, 25, 18, 12])
    multiple(10, [68, 62, 58, 12, 8, 32, 45, 0])
    slide(11, 2, 5)
    single(12, [28, 35, 16, 10, 4, 3, 4])
    multiple(13, [68, 56, 18, 32, 22, 45, 15, 12, 0])
    multiple(14, [42, 58, 46, 62, 32, 28, 65, 0])
    slide(15, 2, 5)
    multiple(16, [32, 58, 65, 42, 52, 62, 35, 38, 0])
    multiple(17, [38, 25, 42, 58, 22, 65, 32, 0])
    slide(18, 3, 5)
    slide(19, 3, 5)
    slide(20, 2, 5)
    slide(21, 2, 5)
    slide(22, 2, 5)
    multiple(23, [52, 48, 35, 12, 18])
    multiple(24, [42, 38, 68, 62, 25, 72])
    await reorder(25)
    vacant(26, ["无/没有/不了解", "具体建议"], [85, 15])
    single(27, [50, 50])
    single(28, [22, 25, 24, 14, 12, 3])
    single(29, [12, 18, 32, 24, 6, 5, 3])
    single(30, [5, 35, 38, 6, 4, 3, 2, 4, 3, 0])




    //题目设置到此结束
    //下面的代码小白可无视。等待时长可改。




    getCount();
    reset();
    submit();
    window.scrollTo(0, document.body.scrollHeight)

    function setCount_yuan() {
        localforage.getItem('wjx_count').then(e => {
            let wjx_count = e || 0; // 如果e为null则设为0
            wjx_count++;
            // 将其存回 localForage
            localforage.setItem('wjx_count', wjx_count)
        })
    }
    function getCount() {
        localforage.getItem('wjx_count').then(e => {
            let wjx_count = e || 0; // 如果e为null则设为0
            // 将其存回 localForage
            localforage.setItem('wjx_count', wjx_count)
                .then(() => {
                    // 创建元素
                    createButton(wjx_count)
                })
        }).catch()
    }

    async function setCount() {
        let count = await localforage.getItem('wjx_count') || 0;
        count++;
        await localforage.setItem('wjx_count', count);
    }


    // 创建显示数量的元素
    function createButton(count) {
        //var parentElement = document.getElementById("ctlNext");
        var parentElement = document.querySelector('.container') || document.body;
        var divAlert = document.createElement("div");
        divAlert.innerHTML = `已填写${count}份`;
        divAlert.style.backgroundColor = "blue";
        divAlert.style.color = "white";
        divAlert.style.border = "none";
        divAlert.style.textAlign = "center";
        divAlert.style.padding = "10px 20px";
        divAlert.style.margin = "10px";
        parentElement.appendChild(divAlert);
    }
    // 清0按钮
    function reset() {
        //var parentElement = document.getElementById("ctlNext");
        var parentElement = document.querySelector('.container') || document.body;
        var resetButton = document.createElement("button");
        resetButton.innerHTML = "点我可以把份数清0,重新计数哦!";
        resetButton.style.backgroundColor = "red";
        resetButton.style.color = "white";
        resetButton.style.cursor = "pointer";
        resetButton.style.textAlign = "center";
        resetButton.style.padding = "10px 20px";
        resetButton.style.margin = "10px";
        // 清0
        resetButton.addEventListener("click", function (e) {
            e.stopPropagation;
            // 设置 localForage 中的 wjx_count 为 0
            localforage.setItem('wjx_count', 0).then(e => {
                console.log("wjx_count 已重置为 0");
            }).catch(function (error) {
                console.error("重置 wjx_count 时出错:", error);
            });
        });
        parentElement.appendChild(resetButton);
    }


    async function submit() {
        let refreshCount = 0;
        QDPOYIt1();
        // 延迟 10 秒后点击确认按钮
        await new Promise((resolve) => {
            setTimeout(() => {
                //点击提交按钮
                const nextBtn = document.evaluate('//*[@id="ctlNext"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (nextBtn)
                {
                    nextBtn.click();
                    resolve();
                }
            }, 10000);
        });

        // 延迟 2 秒后处理新的阿里云验证码
        await new Promise((resolve) => {
            setTimeout(async () => {
                // 立即尝试点击验证码
                await handleAliyunCaptcha();
                resolve();
            }, 2000);
        });



    }

    // 专门处理阿里云点击验证码 2026-3-14
    async function handleAliyunCaptcha() {
        console.log("开始处理阿里云验证码 模拟真人轨迹");

        try
        {
            await waitForElement('#aliyunCaptcha-window-popup', 4000);
            const captchaBox = document.querySelector('#aliyunCaptcha-checkbox-icon');
            if (!captchaBox) return;

            // 获取按钮位置
            const rect = captchaBox.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // ==============================================
            // 第一步：鼠标在验证框周围随机滑动
            // ==============================================
            for (let i = 0; i < 8; i++)
            {
                let randX = centerX + (Math.random() - 0.5) * 60;
                let randY = centerY + (Math.random() - 0.5) * 40;

                document.dispatchEvent(new MouseEvent('mousemove', {
                    clientX: randX,
                    clientY: randY,
                    bubbles: true,
                    cancelable: true
                }));
                await new Promise(r => setTimeout(r, 30 + Math.random() * 40));
            }

            // ==============================================
            // 第二步：精准移动到按钮中心
            // ==============================================
            document.dispatchEvent(new MouseEvent('mousemove', {
                clientX: centerX,
                clientY: centerY,
                bubbles: true
            }));
            await new Promise(r => setTimeout(r, 80));

            // ==============================================
            // 第三步：长按点击
            // ==============================================
            captchaBox.dispatchEvent(new MouseEvent('mousedown', {
                bubbles: true, cancelable: true, button: 0
            }));

            // 真人按住时间 200~500ms
            await new Promise(r => setTimeout(r, 200 + Math.random() * 300));

            captchaBox.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true, cancelable: true, button: 0
            }));

            captchaBox.dispatchEvent(new MouseEvent('click', {
                bubbles: true
            }));

            console.log("✅ 真人轨迹验证完成！");
        } catch (e)
        {
            console.log("验证未出现，跳过");
        }
    }

    // 等待元素出现
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element)
            {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element)
                {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout waiting for element: ${selector}`));
            }, timeout);
        });
    }

    // 检查验证状态
    async function checkVerificationStatus() {
        // 验证是否成功可以通过检查弹窗是否存在来判断
        await new Promise(resolve => setTimeout(resolve, 3000));

        const captchaPopup = document.querySelector('#aliyunCaptcha-window-popup');
        if (!captchaPopup || captchaPopup.style.display === 'none')
        {
            // 验证码窗口已消失，可能是验证成功
            console.log("验证码窗口已消失，可能已验证成功");
            return true;
        } else
        {
            console.log("验证码窗口仍在显示，验证可能未完成");
            return false;
        }
    }

    // 模拟旧的滑块验证函数，兼容旧版验证，不确定。
    async function simulateSliderVerification() {
        const slider = document.querySelector('#nc_1__scale_text > span');
        console.log("slider", slider)
        if (slider && slider.textContent.startsWith('请按住滑块'))
        {
            const width = slider.offsetWidth;
            const eventOptions = { bubbles: true, cancelable: true };
            const dragStartEvent = new MouseEvent('mousedown', eventOptions);
            const dragEndEvent = new MouseEvent('mouseup', eventOptions);
            const steps = 10;
            const stepWidth = width / steps;
            let currX = stepWidth / 2;
            slider.dispatchEvent(dragStartEvent);
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            for (let i = 0; i < steps; i++)
            {
                const randomTime = Math.random() * 100 + 50
                slider.dispatchEvent(new MouseEvent('mousemove', Object.assign({ clientX: currX }, eventOptions)));
                currX += stepWidth;
                await delay(randomTime);
            }
            slider.dispatchEvent(dragEndEvent);
            console.log("滑动完成")
        }
    }


    //////////以下题目处理逻辑未经任何修改，欢迎补充
    async function refresh() {
        document.querySelector("#nc_1_refresh1").click()
    }
    //下一页
    function nextPage() {
        document.querySelector('a.button.mainBgColor').click();
    }

    //单选题函数
    function single(current, ratio) {
        try
        {
            current = current - 1
            var lists = document.querySelectorAll('.field.ui-field-contain')
            //该单选题的选项
            var ops = lists[current].getElementsByClassName('ui-controlgroup')[0].children
            ratio = normArray(ratio)
            var index = singleRatio([1, ops.length], ratio)
            ops[index - 1].click()
            console.log("第", current + 1, "题选择了第", index, "个选项")
            return index
        } catch
        {
            console.log("第", current + 1, "题错误")
        }

    }
    //多选题函数
    function multiple(current, ratio) {
        try
        {
            current = current - 1
            var lists = document.querySelectorAll('.field.ui-field-contain')
            //该多选题的选项
            var ops = lists[current].getElementsByClassName('ui-controlgroup')[0].children
            let mul_list = [];
            // 获取随机数列表
            function getRandomNumberList(ratio, mul_list) {
                return ratio.map((item) => Math.random() < item / 100 ? 1 : 0);
            }
            while (mul_list.reduce((acc, curr) => acc + curr, 0) <= 0)
            {
                mul_list = getRandomNumberList(ratio, mul_list);
            }
            for (const [index, item] of mul_list.entries())
            {
                if (item == 1)
                {
                    ops[index].click()
                    console.log("第", current + 1, "题选择了第", index + 1, "个选项")
                }
            }
        } catch { }

    }
    //矩阵题函数
    function matrix(current, matrix_prob) {
        try
        {
            const xpath1 = `//*[@id="divRefTab${current}"]/tbody/tr`;
            const a = document.evaluate(xpath1, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            let q_num = 0;
            //遍历每项判断是否为题
            for (let i = 0; i < a.snapshotLength; i++)
            {
                const tr = a.snapshotItem(i);
                if (tr.getAttribute("rowindex") !== null)
                {
                    q_num++;
                }
            }
            const xpath2 = `//*[@id="drv${current}_1"]/td`;
            const b = document.evaluate(xpath2, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            // 矩阵题的选项数量
            const optionCount = b.snapshotLength - 1;
            // 转嵌套的数组
            const matrix_arrays = Object.values(matrix_prob);
            // 遍历每个数组并归一化
            const normalizedArrays = matrix_arrays.map((arr) => {
                return normArray(arr)
            });
            for (let i = 1; i <= q_num; i++)
            {
                //生成[2,optionCount]之间的随机数
                var opt = singleRatio([2, optionCount + 1], normalizedArrays[i - 1])
                var nthElement = document.querySelectorAll(`#drv${current}_${i} td`)[opt - 1];
                nthElement.click()
            }
        } catch { }
    }

    function scale(current, ratio) {
        try
        {
            let xpath = `//*[@id="div${current}"]/div[2]/div/ul/li`;
            let a = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            let b = singleRatio([1, a.snapshotLength], ratio);
            let element = document.querySelector(`#div${current} > div.scale-div > div > ul > li:nth-child(${b})`);
            element.click();
            console.log("第", current, "题选择了第", b, "个选项")
            return b
        } catch { }

    }

    function slide(current, min, max) {
        try
        {
            var score = randint(min, max)
            document.querySelector(`#q${current}`).value = score
            console.log("第", current, "题填写了", score)
        } catch { }
    }
    //填空题函数
    function vacant(current, texts, ratio) {
        try
        {
            var text_index = singleRatio([0, texts.length - 1], ratio)
            document.querySelector(`#q${current}`).value = texts[text_index]
            console.log("第", current, "题填写了", texts[text_index])
        } catch { }

    }
    async function setLocation(current) {
        const locationElement = document.querySelector(`#q${current}`);
        if (!locationElement)
        {
            console.log(`位置题第${current}题未找到`);
            return;
        }

        locationElement.click();
        // await new Promise((resolve) => { setTimeout(resolve, 3000); });
        await new Promise((resolve) => {
            const observer = new MutationObserver(() => {
                if (document.querySelector("#divFrameData>script"))
                {
                    observer.disconnect();
                    resolve();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            if (document.querySelector("#divFrameData>script"))
            {
                observer.disconnect();
                resolve();
            }
        });
        //----------------------------province
        document.querySelector("#divFrameData>div>div.ui-select.divProvince>div>span>span.selection>span")
            .dispatchEvent(new MouseEvent('mousedown'));//点击省份按钮
        await new Promise((resolve) => { setTimeout(resolve, 500); });
        let provinceList = document.querySelectorAll("[id^=select2-province][id$=-results]>li");
        let pIndex = randint(1, provinceList.length - 1)
        provinceList[pIndex].dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
        })); //选择省份
        await new Promise((resolve) => { setTimeout(resolve, 500); });
        //----------------------------city
        document.querySelector("#divFrameData>div>div:nth-child(3)>div>span>span.selection>span")
            .dispatchEvent(new MouseEvent('mousedown')); //点击城市按钮
        await new Promise((resolve) => { setTimeout(resolve, 500); });
        let cityList = document.querySelectorAll("[id^=select2-city][id$=-results]>li");
        let cIndex = randint(1, cityList.length - 1)
        console.log(cityList, cIndex)
        await new Promise((resolve) => { setTimeout(resolve, 500); });
        cityList[cIndex].dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
        })); //选择城市
        await new Promise((resolve) => { setTimeout(resolve, 700); });
        //----------------------------area(optional)
        try
        {
            document.querySelector("#divFrameData>div>div:nth-child(4)>div>span>span.selection>span")
                .dispatchEvent(new MouseEvent('mousedown'));//点击地区按钮
            await new Promise((resolve) => { setTimeout(resolve, 1000); });
            let areaList = document.querySelectorAll("[id^=select2-area][id$=-results]>li");
            let aIndex = randint(1, areaList.length - 1)
            areaList[aIndex].dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true,
            })); //选择地区
            await new Promise((resolve) => { setTimeout(resolve, 500); });
        } catch { }
        document.querySelector("#divFrameData>div div.save_btn.layer_save_btn > a").click()

    }

    async function reorder(current) {
        let orderList = document.querySelectorAll(`#div${current}>ul>li`);
        for (let i = 0; i < orderList.length; i++)
        {
            orderList = document.querySelectorAll(`#div${current}>ul>li`)
            orderList[randint(i, orderList.length - 1)].click()
            await new Promise((resolve) => { setTimeout(resolve, 1000) })
        }
    }

    function normArray(arr) {
        const sum = arr.reduce((accum, val) => accum + val, 0);
        return arr.map(val => val / sum);
    }

    function singleRatio(range, ratio) {
        let weight = [];
        let sum = 0;
        for (let i = range[0]; i <= range[1]; i++)
        {
            sum += ratio[i - range[0]];
            weight.push(sum);
        }
        const rand = Math.random() * sum;
        for (let i = 0; i < weight.length; i++)
        {
            if (rand < weight[i])
            {
                return i + range[0];
            }
        }
    }

    function randint(a, b) {
        return Math.floor(Math.random() * (b - a + 1) + a);
    }

    // 允许右键和复制
    document.oncontextmenu = function () {
        return true;
    };
    document.onselectstart = function () {
        return true;
    };
    function clearAll() {
        var cookies = document.cookie.split("; ");
        for (var i = 0; i < cookies.length; i++)
        {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
        sessionStorage.clear();
        localStorage.clear();
    }
    $("body").css("user-select", "text");
    function QDPOYIt1() { for (let i = 0; i < randint(14, 130); i++) { $("\x23\x64\x69\x76\x31")['\x74\x72\x69\x67\x67\x65\x72']("\x6d\x6f\x75\x73\x65\x6f\x76\x65\x72") } }
    function showMessage(text) {
        let messageBox = document.createElement('div');
        messageBox.textContent = text;
        messageBox.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 9999;
    `;
        document.body.appendChild(messageBox);
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 4000);
    }
})();