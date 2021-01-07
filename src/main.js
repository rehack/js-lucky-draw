const { createApp, reactive,toRefs, onMounted, onUnmounted} = Vue
const App = {
    setup() {
        
        // console.log('setup');
        const {lucky} = useStart()
        return {
            lucky
        }
    }
}

// 洗牌算法 打乱数组
function useShuffle(array) {
    const length = array == null ? 0 : array.length
    if (!length) {
        return []
    }
    let index = -1
    const lastIndex = length - 1
    const [...newArr] = array //拷贝数组
    while (++index < length) {
        const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
        const value = newArr[rand]
        newArr[rand] = newArr[index]
        newArr[index] = value
    }
    return newArr
}

/**
 * 从数组截取元素
 * @param {arr} 参与的号码
 * @param {count} 抽取的个数
 */
function useDraw(arr,count){
    return arr.splice(0,count)
}

// 背景音乐淡入淡出切换
function useSwitchPlayBgm(audio){
    let v = audio.volume;
    if (audio.paused) {
        audio.play()
        var t = setInterval(function(){
            v+= 0.1;
            // console.log('v1:'+v);
            if(v<=1){
                audio.volume = v;
            }else{
                clearInterval(t);
            }
        },200);
    }else{
        var t = setInterval(function(){
            v-=0.12;
            // console.log('v2:'+v);
            if(v>0){
                audio.volume = v;
            }else{
                clearInterval(t);
                audio.pause();
            }
        },500);
    }
    
}


function useStart(){
    const defaultArr = [1, 2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 23,31,41,63,3]
    // const defaultArr = [1, 2, 4, 6,8,15,42]
    const config= [
        {
            'round': 1, //轮次
            'm': 600, //金额
            'title': '600元代金券', //标题
            'count': 2, //抽取个数
            'self': [5] //内
        },
        {
            'round': 2, //轮次
            'm': 1000, //金额
            'title': '1000元代金券', //标题
            'count': 3, //抽取个数
            'self': [4, 2] //内
        }
    ]

    const startAudio = new Audio()
    startAudio.src = './assets/music/run.mp3'
    startAudio.loop = true
    startAudio.volume = 0
    const stopAudio = new Audio()
    stopAudio.src = './assets/music/stop.mp3'

    let state = true // 开始与停止标记

    const result = reactive({
        lucky: []
    })

    // let result = ref([])
    onMounted(() => {
        document.addEventListener('keydown',luckyDraw)
    })
    onUnmounted(() => {            
        document.removeEventListener('keydown',luckyDraw)
    })
    // console.log(e);

    let newArr = useShuffle(defaultArr) //参与抽奖的号码-乱序
    let allSelf = [] //提取所有内号
    for (let item of config) {
        allSelf = allSelf.concat(item.self)
    }
    let joinNum = []; //剔除内号 得到真实参与抽奖的号码
    newArr.forEach( v => {
        if(allSelf.indexOf(v) === -1) joinNum.push(v)
    })

    function luckyDraw(e){
        if(e.keyCode == 32 && state){ //按下空格键 开始抽奖
            state = false
            useSwitchPlayBgm(startAudio)
            
        }else if(e.keyCode == 32 && !state){
            state = true
            useSwitchPlayBgm(startAudio)

            let i = 0
            let timer
            clearInterval(timer)
            timer = setInterval(() => {
                if(i === config.length-1){
                    clearInterval(timer)
                    useSwitchPlayBgm(stopAudio)
                }
                result.lucky.push({
                    title: config[i].title,
                    lucky: useShuffle([...config[i].self,...useDraw(joinNum,config[i].count - config[i].self.length)])
                })
                i++
            }, 2000);
            
            
            
        }
    }
    // console.log(result);
    return toRefs(result)
    
}


createApp(App).mount('#app')