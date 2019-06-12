/**
 * ES6类的使用
 * 用到了构造器、箭头函数、模板字符串`${}`、
 */
class Lucky{
    constructor(params){
        // initNum=[1,40],numPwrap,turnsProWrap,smTitle=[],selfNum=[],runSpeed=30
        /*this.startNum=initNum[0];//参与抽奖的起始号码
        this.endNum=initNum[1];//参与抽奖的结束号码
        this.numPwrap=document.getElementById(numPwrap);//号码显示父容器
        this.turnsProWrap=document.getElementById(turnsProWrap);//显示轮次容器
        this.smTitle=smTitle;//轮次小标题
        this.selfNum=selfNum;//每轮内定号码 传一个二维数组*/
        this.initNum=params.initNum;//
        this.startNum=params.initNum[0];//参与抽奖的起始号码 必填参数
        this.endNum=params.initNum[1];//参与抽奖的结束号码 必填参数
        this.numPwrap=document.getElementById(params.numPwrap);//号码显示父容器 必填参数
        this.turnsProWrap=document.getElementById(params.turnsProWrap);//显示抽奖项目容器 必填参数
        this.turnsWrap=document.getElementById(params.turnsWrap);//显示轮次容器 必填参数
        this.smTitle=params.smTitle || [];//轮次小标题 必填参数
        this.selfNum=params.selfNum || [];//每轮内定号码 传一个二维数组
        this.runSpeed=params.runSpeed || 40;//号码滚动速度(毫秒)
        this.isPlay=params.isPlay;//是否播放音效
        this.isShowTurn=params.isShowTurn;//是否显示轮次标题



        this.digits=this.initNum[this.initNum.length-1].toString().length;//中奖号码显示的位数
        this.aJoinNum=[];
        this.totalTurns=this.smTitle.length;//总抽奖轮次
        this.luckyNum=null;//中奖号码
        this.flag=true;//开始与停止标记
        this.timer=null;//定时器
        this.oLocalStorage=window.localStorage;//本地存储对象
        this.turn=1;//抽奖轮次编号 按左右方向键进行切换
        this.pro=0;//轮次内部项目索引

        this.runStatus=false;//抽奖状态 正在滚动或者已经停止

        this.playM=document.getElementById('play-music');//滚动音效对象
        this.stopM=document.getElementById('stop-music');//停止音效对象

        this.oSave=[];//临时存储中奖信息的数组
    }

    init(){
        // 如果还没有存储参与抽奖号码就进行存储 如果是null就表示没有初始化，如果是空字符串就表示号码已经抽取完了,如果是抽取完了就不应该再初始化数据
        // console.log(typeof(this.oLocalStorage.getItem("sJoinNum")))
        if(this.oLocalStorage.getItem("sJoinNum") === null){
            if(this.initNum.length==2){//如果是设置的[1,30]这种连续号码段
                // 得到参与抽奖号码数组
                let arr=[];
                for(let i=this.startNum;i<=this.endNum;i++){

                    let j=this.buquan(i,this.digits);//补全
                    arr.push(j);



                }

                for(var a=0;a<this.selfNum.length;a++){

                    for(var b=0;b<this.selfNum[a].length;b++){
                        // console(1)
                        for(var c= 0;c<this.selfNum[a][b].length;c++){

                            this.buquan(this.selfNum[a][b][c],this.digits);
                            this.removeLuckyNum(this.buquan(this.selfNum[a][b][c],this.digits),arr);
                        }
                        // console.log(this.selfNum[a][b])
                        // this.removeLuckyNum(this.buquan(this.selfNum[a][b],this.digits),arr);
                        // this.removeLuckyNum[1,arr];
                    }
                }
                // console.log('arr'+arr)
                // let str = JSON.stringify(arr);
                let str = arr.join(',');
                localStorage.setItem("sJoinNum",str);
            }else{
                let arr=[];
                for (var i = 0; i <this.initNum.length; i++) {
                    arr.push(this.buquan(this.initNum[i],this.digits));
                }
                let str = arr.join(',');
                localStorage.setItem("sJoinNum",str);
            }

        }else{
            console.log(`已经存储了aJoinNum${this.oLocalStorage.getItem('sJoinNum')}`);
        }
        // this.aJoinNum=JSON.parse(this.oLocalStorage.getItem('sJoinNum'));//参与抽奖号码数组
        this.aJoinNum=this.oLocalStorage.getItem('sJoinNum').split(",");//参与抽奖号码数组





        //刷新页面，从localStoreage中恢复
        this.fill();
        // console.log(this.getLocalStorage())
        document.onkeyup=(e)=>{
            let oEvent=e||window.event;//let在当前作用域内有用，未声明前不可用，不可重复声明


            // alert(oEvent.keyCode)

            // 空格键开始和停止抽奖
            if(oEvent.keyCode==32 && this.flag){
                // console.log(oEvent.keyCode);
                this.flag=false;
                this.run();
                console.log('开始')
            }else if (oEvent.keyCode==32 && !this.flag) {
                this.flag=true;
                this.stop();
                console.log('停止')
            }

            // 左右方向键切换抽奖轮次，Ctrl + z清除localStorage
            switch (oEvent.keyCode || oEvent.ctrlKey) {
                case 37: //左键切换上一轮
                    this.pro = 0
                    if(this.runStatus){
                        return false;//未停止抽奖不允许进行键盘切换
                    }
                    this.turn-=1;
                    if(this.turn==0){
                        this.turn=this.totalTurns;
                    }
                    // console.log('zuo',this.turn);
                    this.fill();
                    break;
                case 39: //右键切换下一轮
                    this.pro = 0
                    if(this.runStatus){
                        return false;//未停止抽奖不允许进行键盘切换
                    }
                    this.turn+=1;
                    if(this.turn>this.totalTurns){
                        this.turn=1;
                    }
                    this.fill();
                    break;
                case 38://上键查询全部中奖记录
                    if(this.runStatus){
                        return false;//未停止抽奖不允许进行键盘切换
                    }
                    this.showAllLucky();
                    break;
                case 90 || true:
                    this.oLocalStorage.clear();
                    break;

                case 40:
                    // 下方向键切换轮次内部抽奖项目
                    this.pro+=1;
                    // console.log(this.pro)
                    if(this.pro+1>this.smTitle[this.turn-1].tit.length){
                        this.pro=0;
                    }
                    this.turnsProWrap.innerHTML=`${this.smTitle[this.turn-1].tit[this.pro]}`;
                    this.numPwrap.innerHTML='';
                    break;
                default:
                    break;
            }
        }
    }

    // 补全前导0
    buquan(num,length){
        let numstr = num.toString();
        let l=numstr.length;
        if (l>=length) {return numstr;}
        for(let  i = 0 ;i<length - l;i++){
            numstr = "0" + numstr;
            // console.log(numstr)
        }
        return numstr;
    }

    //从数组中移除指定值
    removeLuckyNum(num,arr){
        // 数组扩展方法 从数组删除指定元素
        Array.prototype.removeByValue = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) {
                    this.splice(i, 1);
                    break;
                }
            }
        }
        arr.removeByValue(num);
        return arr;
    }


    /**
     * [getLucky 从参与抽奖号码中随机获取中奖号码]
     * @return {[number]} [带前导0的数字]
     */
    getLucky(arr,count){
        /*let randomNum=Math.floor(Math.random() * arr.length);//随机抽取指定个数的号码
        // alert(arr[randomNum]);
        return arr[randomNum];*/
        //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
        var temp_array = new Array();
        for (var index in arr) {
            temp_array.push(arr[index]);
        }
        //取出的数值项,保存在此数组
        var return_array = new Array();
        for (var i = 0; i<count; i++) {
            //判断如果数组还有可以取出的元素,以防下标越界
            if (temp_array.length>0) {
                //在数组中产生一个随机索引
                var arrIndex = Math.floor(Math.random()*(temp_array.length-1));
                // console.log('length'+temp_array.length)
                // console.log('随机：'+arrIndex)
                if(temp_array[arrIndex]){
                    //将此随机索引的对应的数组元素值复制出来
                    return_array[i] = temp_array[arrIndex];
                    //然后删掉此索引的数组元素,这时候temp_array变为新的数组
                    temp_array.splice(arrIndex, 1);
                }

            } else {
                //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
                break;
            }
        }
        return return_array;
    }



    // 开始滚动号码效果
    run(){
        this.runStatus=true;//运行中的标记

        clearInterval(this.timer);//清除之前的定时器

        if(this.isPlay){
            this.playRuningMusic();//同时播放音效
        }

        if(this.aJoinNum.length<1){
            alert('参与抽奖号码已抽完！');
            return false;
        }
        this.numPwrap.innerHTML='';
        this.timer=setInterval(()=>{
            let randomIndex=Math.floor(Math.random()*this.aJoinNum.length);
            console.log(`参与号码：${this.aJoinNum}`);
            this.numPwrap.innerHTML=`<b>${this.aJoinNum[randomIndex]}</b>`; //号码不断滚动
        },this.runSpeed);

    }

    // 停止号码滚动
    stop(){
        clearInterval(this.timer);
        this.runStatus=false;
        if(this.isPlay){
            this.playStopMusic();
        }
        // alert(this.turn)
        // alert(this.selfNum[this.turn-1])
        // console.log(this.turn,this.pro)
        // return false
        if(this.selfNum.length>0 && this.selfNum[this.turn-1][this.pro]){
            var a = this.getLucky(this.aJoinNum,this.smTitle[this.turn-1].luckyCount[this.pro]-this.selfNum[this.turn-1][this.pro].length);
            var luckyNum =[];
            for(var i=0;i<a.length;i++){
                luckyNum.push(this.buquan(a[i],this.digits));
            }
            this.luckyNum=luckyNum.concat(this.selfNum[this.turn-1][this.pro]);
            // this.luckyNum=luckyNum;
            var aa =this.luckyNum;
            // this.selfNum[this.turn-1][this.pro]=this.removeLuckyNum(this.luckyNum,this.selfNum[this.turn-1]);//从内定号码数组中移除中奖号码
            this.selfNum[this.turn-1][this.pro]=[];//从内定号码数组中移除中奖号码
        }else{

            this.luckyNum=this.getLucky(this.aJoinNum,this.smTitle[this.turn-1].luckyCount[this.pro]);//随机抽取指定个数的号码 array
        }
        // console.log(`中奖号码：${this.luckyNum}`);



        for(var i=0;i<this.luckyNum.length;i++){
            var b =this.luckyNum[i];
            this.removeLuckyNum(this.luckyNum[i],this.aJoinNum);//移除该中奖号码
        }
        var arr=this.aJoinNum;
        this.oLocalStorage.setItem('sJoinNum',arr);//出现存储剩余号码，更新参与抽奖号码
        console.log(`抽取后剩余号码：${this.aJoinNum}--个数${this.aJoinNum.length}`);
        this.saveLuckyNum(this.luckyNum);//存储
        this.numPwrap.innerHTML=`<b>${this.luckyNum}</b>`;

    }

    // 滚动音效
    playRuningMusic(){
        // this.playM.load();//从新加载audio 使其重头播放

        this.stopM.pause();
        this.playM.play();
    }

    // 停止音效
    playStopMusic(){
        this.playM.pause();
        this.stopM.load();
        this.stopM.play();
    }

    //将中奖号码进行存储
    saveLuckyNum(num){
        var tit = this.turnsProWrap.innerHTML;
        let tmpObj = {}
        tmpObj.title = tit
        tmpObj.num = num
        // console.log(s)
        if(!this.oLocalStorage[this.turn]){//如果此轮还没有抽过
            this.oSave = [];
            // console.log(1)

        }else{
            // 表示本轮已经抽过一次或多次了 然后从LocalStorage把之前抽过的数据取出来
            this.oSave=JSON.parse(this.oLocalStorage[this.turn])
            // console.log(2)
            // [
            //     {
            //         "title":'',
            //         num:[1,2,3]
            //     },
            //     {
            //         "title":'',
            //         num:[1,2,3]
            //     }
            // ]
        }
        if(!this.oSave[this.pro]){
            this.oSave[this.pro] = tmpObj
        }else{
            // 如果本次抽奖已经存到了localStorage表示已经抽过了，相当于额外再增加一次抽奖
            console.log('已经抽过了')
            // this.oSave['other'] = tmpObj JSON.stringify不能读关联数组
        }
        // console.log(this.oSave)


        
        var strtmp=JSON.stringify(this.oSave);
        // console.log(strtmp)
        this.oLocalStorage.setItem(this.turn,strtmp);
    }

    getLocalStorage(turn){
        if(this.oLocalStorage[turn]){
            return this.oLocalStorage[turn];
        }else{
            return '';
        }
    }

    // 将中奖号码填充到页面 && 轮次标题填充
    fill(){

        // 切换抽奖轮次
        // console.log(this.smTitle[this.turn-1].tit)
        if(this.smTitle[this.turn-1].tit){
            this.pro=0;
            if(this.isShowTurn){
                // this.turnsProWrap.innerHTML=`第${this.turn}轮：${this.smTitle[this.turn-1][0]}`;
                this.turnsWrap.innerHTML=`第${this.turn}轮：`;

                this.turnsProWrap.innerHTML=`${this.smTitle[this.turn-1].tit[this.pro]}`;
            }else{
                // this.turnsProWrap.innerHTML=`${this.smTitle[this.turn-1][this.pro]}`;
                this.turnsProWrap.innerHTML=`${this.smTitle[this.turn-1].tit[this.pro]}`;
            }
        }else{
            this.turnsProWrap.innerHTML=`第${this.turn}轮`;//如果没有配置项目标题
        }

        // 填充本轮中奖号码
        this.numPwrap.innerHTML='';
        // this.d=0;
        if(this.getLocalStorage(this.turn)){
            // console.log(JSON.parse(this.getLocalStorage(this.turn)))
            this.numPwrap.innerHTML+=`<span class="show">恭喜本轮中奖号码：<br>`;
            let currentTurnData = JSON.parse(this.getLocalStorage(this.turn))
            // for (var variable in ) {
            //     this.numPwrap.innerHTML+=`${variable}：${JSON.parse(this.getLocalStorage(this.turn))[variable]}</span><br>`;
            // }
            currentTurnData.map(item => {
                if(item){ //判断如果切换的时候有些轮次还没有抽取 item为null
                    this.numPwrap.innerHTML += `${item.title}:${item.num}<br>`
                }
            })
        }else{

        }


    }

    // 显示全部中奖号码
    showAllLucky(){
        this.numPwrap.innerHTML='';
        this.numPwrap.innerHTML='恭喜本次活动所有中奖号码：<br />';
        this.turnsProWrap.parentNode.style.display = 'none';
        // console.log(this.oLocalStorage.length);//object
        for(let i=1;i<=this.totalTurns;i++){
            if(this.oLocalStorage.getItem(i)){
                let allData = JSON.parse(this.oLocalStorage.getItem(i))
                if(this.isShowTurn){
                    allData.map(item => {
                        if(item){
                            this.numPwrap.innerHTML += `<div class="show"><span class="turnShow">第${i}轮</span>${item.title}：${item.num}</div>`
                        }
                    })
                }else{
                    allData.map(item => {
                        if(item){
                            this.numPwrap.innerHTML += `<div class="show">${item.title}：${item.num}</div>`
                        }
                    })
                }
            }

        }
    }

}
