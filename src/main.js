const { createApp, ref, reactive, toRefs, computed, onMounted, onUnmounted} = Vue
const App = {
    setup() {
        
        // console.log('setup');
        const {lucky, newInitNum, config, roundData, rollingN, localData} = useStart()
        return {
            lucky,
            newInitNum,
            config,
            roundData,
            rollingN,
            localData
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
    // const initNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99]
    const initNum = [1, 2, 3, 4, 5, 6, 7, 8, 9,10]
    const config= [
        {
            'round': 1, //轮次
            'title': '600元现金', //标题
            'count': 2, //总抽取个数，包括内
            'self': ['05'] //内一定要补全0
        },
        {
            'round': 1, //轮次
            'title': '800元现金', //标题
            'count': 3, //抽取个数
            'self': ['04', '02']
        },
        {
            'round': 2, //轮次
            'title': '1000元现金', //标题
            'count': 2, //抽取个数
            'self': []
        },
        {
            'round': 2, //轮次
            'title': '1500元现金', //标题
            'count': 1, //抽取个数
            'self': ['09']
        },
        {
            'round': 3, //轮次
            'title': '2000元现金', //标题
            'count': 1, //抽取个数
            'self': ['10']
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
        rollingN: Array(config.length), //屏幕上不断滚动的号码
        roundData: [], //当前轮数据
        localData: []
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

    swRound()
    
    

    function luckyDraw(e){
        if(e.keyCode == 32 && state){ //按下空格键 开始抽奖
            if(joinNum.length<result.roundData[0].count){  //检测号码是否够用
                alert('已经抽完了') 
                return false
            }
            console.log('开始',joinNum);
            window.localStorage.removeItem('flag')
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
            result.rollingN =  Array(result.roundData.length)
            let i = 0
            // let timer
            clearInterval(timer)
            timer = setInterval(() => {
                if(i === result.roundData.length){
                    clearInterval(timer)
                    useSwitchPlayBgm(stopAudio)
                    window.localStorage.setItem('flag','over')
                    console.log('结束',joinNum);
                    console.log('结果',result.roundData);
                    window.localStorage.setItem('joinNum',JSON.stringify(joinNum))
                    return false
                }
                
                result.roundData[i].lucky = window.localStorage.getItem('flag')=='over' ? [...useDraw(joinNum,result.roundData[i].count)] : useShuffle([...result.roundData[i].self,...useDraw(joinNum,result.roundData[i].count - result.roundData[i].self.length)])
                const temp = {
                    'round': result.roundData[i].round,
                    'title': result.roundData[i].title,
                    'lucky': result.roundData[i].lucky
                }

                result.lucky.push(temp)
                let localData = JSON.parse(window.localStorage.getItem('lucky') ) || []
                localData.push(temp)
                window.localStorage.setItem('lucky',JSON.stringify(localData)) //抽奖结果存本地
                
                i++
                // console.log('?',joinNum);
            }, 2000);
            
            
        }
        // 按键操作
        switch (true || e.ctrlKey) {
            case (e.keyCode == 90):
                if(e.ctrlKey) window.localStorage.clear()
                break;
            case (e.keyCode>=49 && e.keyCode<=57): //数字键盘轮次切换 1-9
                // console.log(e.keyCode);
                const numkey = String.fromCharCode(e.keyCode)
                swRound(Number(numkey))
                console.log(result.roundData);
                break;
            case (e.keyCode==38):
                // console.log()
                result.localData = JSON.parse(window.localStorage.getItem('lucky'))
                console.log(result);
                break;
            default:
                break;
        }

        
    }

    // 轮次切换
    function swRound(turn=1) {
        const cur = config.filter(i=>i.round==turn)
        // console.log(result.lucky,'result.lucky');
        console.log(config,cur);
        result.roundData = cur
        // push
    }
    
    return toRefs(result)
}


createApp(App).mount('#app')