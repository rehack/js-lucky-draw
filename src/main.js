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

    function luckyDraw(e){
        if(e.keyCode == 32){ //按下空格键 开始抽奖
            let newArr = useShuffle(defaultArr) //参与抽奖的号码-乱序
            let allSelf = [] //所有内号
            for (let item of config) {
                allSelf = allSelf.concat(item.self)
            }
            let joinNum = []; //剔除内号 得到真实参与抽奖的号码
            newArr.forEach( v => {
                if(allSelf.indexOf(v) === -1) joinNum.push(v)
            })
    
            config.map(i => {
                result.lucky.push({
                    title: i.title,
                    lucky: useShuffle([...i.self,...useDraw(joinNum,i.count - i.self.length)])
                })
            })
    
            
        }else{
            // alert(e.keyCode)
        }
    }
    // console.log(result);
    return toRefs(result)
    
}


createApp(App).mount('#app')