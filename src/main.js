const { createApp, ref, reactive, toRefs, computed, onMounted, onUnmounted} = Vue
const App = {
    setup() {
        
        // console.log('setup');
        const {lucky, newInitNum, config, rollingN} = useStart()
        return {
            lucky,
            newInitNum,
            config,
            rollingN
        }
    }
}

// 洗牌算法 打乱数组
function useShuffle(array) {
    const length = array == null ? 0 : array.length
    if (!length) {
        return []
    }
    const maxL = (Math.max(...array)+'').length
    let index = -1
    const lastIndex = length - 1
    const [...newArr] = array //拷贝数组
    while (++index < length) {
        const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
        const value = newArr[rand]
        newArr[rand] = numPadStart(maxL,newArr[index])
        newArr[index] = numPadStart(maxL,value)
    }
    
    return newArr
}
// 数字补位
function numPadStart(targetLength,num){
    if(num){
        return (num+'').padStart(targetLength,'0')
    }
    return num
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
            v-=0.06;
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

function useNumRolling(arr){
    // const randomN = ref(null)
    let randomIndex=Math.floor(Math.random()*arr.length);
    randomN = arr[randomIndex]
    return randomN
}

function useStart(){
    const initNum = [1, 2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 23,31,41,63,55,56,57,62,61,63,64,65]
    // const initNum = [1, 2, 4, 6,8,15,42]
    const config= [
        {
            'round': 1, //轮次
            'title': '600元代金券', //标题
            'count': 10, //抽取个数
            'self': ['05'] //内号一定要补全0
        },
        {
            'round': 2, //轮次
            'title': '1000元代金券', //标题
            'count': 3, //抽取个数
            'self': ['04', '22'] //内
        },
        {
            'round': 3, //轮次
            'title': '半价种植牙代金券', //标题
            'count': 2, //抽取个数
            'self': [] //内
        },
        {
            'round': 4, //轮次
            'title': '免费种植牙代金券', //标题
            'count': 1, //抽取个数
            'self': ['41'] //内
        }
    ]

    const rollingAudio = new Audio()
    rollingAudio.src = './assets/music/run.mp3'
    rollingAudio.loop = true
    rollingAudio.volume = 0
    const stopAudio = new Audio()
    stopAudio.src = './assets/music/stop.mp3'

    let state = true // 开始与停止标记
    let timer = null
    

    // let result = ref([])
    onMounted(() => {
        document.addEventListener('keydown',luckyDraw)
    })
    onUnmounted(() => {            
        document.removeEventListener('keydown',luckyDraw)
    })
    // console.log(e);

    let newArr = useShuffle(initNum) //参与抽奖的号码-乱序

    const result = reactive({
        lucky: [],
        newInitNum: newArr,
        config,
        rollingN: Array(config.length)
    })

    let allSelf = [] //提取所有内号
    for (let item of config) {
        allSelf = allSelf.concat(item.self)
    }
    let joinNum = window.localStorage.getItem('joinNum') ? JSON.parse(window.localStorage.getItem('joinNum')) : []; //剔除内号 得到真实参与抽奖的号码

    if(!window.localStorage.getItem('joinNum')){
        newArr.forEach( v => {
            if(allSelf.indexOf(v) === -1) joinNum.push(v)
        })
    }
    
    

    function luckyDraw(e){
        if(e.keyCode == 32 && state){ //按下空格键 开始抽奖
            if(joinNum.length<config[0].count){  //检测号码是否够用
                alert('已经抽完了') 
                return false
            }
            console.log('开始',joinNum);
            state = false
            useSwitchPlayBgm(rollingAudio)
            clearInterval(timer)
            // let i = 0
            
            timer = setInterval(()=>{
                for (let i = 0; i < result.rollingN.length; i++) {
                    result.rollingN[i] = useNumRolling(newArr)
                }
                // 不用循环的方式，滚动有点慢
                /* if(i>=result.rollingN.length){
                    i = 0
                }
                result.rollingN[i] = useNumRolling(newArr)
                i++ */
            },50)
            
        }else if(e.keyCode == 32 && !state){ //按空格键停止
            state = true
            useSwitchPlayBgm(rollingAudio)
            result.rollingN =  Array(config.length)
            let i = 0
            // let timer
            clearInterval(timer)
            timer = setInterval(() => {
                if(i === config.length){
                    clearInterval(timer)
                    useSwitchPlayBgm(stopAudio)
                    window.localStorage.setItem('flag','over')
                    console.log('结束',joinNum);
                    window.localStorage.setItem('joinNum',JSON.stringify(joinNum))
                    return false
                }
                result.lucky.push({
                    title: config[i].title,
                    lucky: window.localStorage.getItem('flag')=='over' ? [...useDraw(joinNum,config[i].count)] : useShuffle([...config[i].self,...useDraw(joinNum,config[i].count - config[i].self.length)])
                })
                i++
                // console.log('?',joinNum);
            }, 2000);
            
            
        }

        switch (e.keyCode || e.ctrlKey) {
            case 90 || true:
                window.localStorage.clear();
                break;
            default:
                break;
        }
    }
    
    return toRefs(result)
}


createApp(App).mount('#app')