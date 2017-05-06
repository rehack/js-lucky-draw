/**
 * ES6类的使用
 * 用到了构造器、箭头函数、新字符串连接语法`${}`、
 */
class Lucky{
    constructor(startNum,endNum,numPwrap,totalTurns){
        this.startNum=startNum;//参与抽奖的起始号码
        this.endNum=endNum;//参与抽奖的结束号码
        this.digits=this.endNum.toString().length;//中奖号码显示的位数
        this.allList=[];//参与抽奖号码数组
        this.totalTurns=totalTurns;//总抽奖轮次
        this.luckyNum=null;//中奖号码
        this.flag=true;//开始与停止标记
        this.numPwrap=document.getElementById(numPwrap);//号码显示父容器
        this.turnsWrap=document.getElementById('turns');//显示轮次容器
        this.numWrap=this.numPwrap.getElementsByTagName('span');//子节点个数
        this.timer=null;//定时器
        this.oLocalStorage=window.localStorage;//本地存储对象
        this.turn=1;//97->1 98->2 ... 抽奖轮次编号 按左右方向键进行切换
        this.d=0;//中奖号码滚动位置
    }

    init(){
        // 得到参与抽奖号码数组
        for(let i=this.startNum;i<=this.endNum;i++){
            this.allList.push(i);
        }


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

            // 左右方向键切换抽奖轮次，Esc清除localStorage
            switch (oEvent.keyCode) {
                case 37:
                    this.turn-=1;
                    if(this.turn==0){
                        this.turn=this.totalTurns;
                    }
                    this.fill();
                    break;
                case 39:
                    this.turn+=1;
                    if(this.turn>this.totalTurns){
                        this.turn=1;
                    }
                    this.fill();
                    break;
                case 27:
                    this.oLocalStorage.clear();
                    break;
                default:
                    // statements_def
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
        }
        return numstr;
    }

    /**
     * [getLucky 从参与抽奖号码中随机获取中奖号码]
     * @return {[number]} [带前导0的数字]
     */
    getLucky(){
        let randomNum=Math.floor(Math.random() * this.allList.length);//随机抽取一个中奖号码
        return this.buquan(this.allList[randomNum],this.digits);//将中奖号码补全前导0 然后返回
    }

    //从数组中移除指定值
    removeLuckyNum(num){
        // 数组扩展方法 从数组删除指定元素
        Array.prototype.removeByValue = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) {
                    this.splice(i, 1);
                    break;
                }
            }
        }
        this.allList.removeByValue(num);
    }

    // 开始滚动号码效果
    run(){
        clearInterval(this.timer);//清除之前的定时器
        console.log('this.numWrap子节点个数：'+this.numWrap.length);
        let oNode=document.createElement('b');
        this.playRuningMusic();//同时播放音效

        if(this.numWrap.length==0 || this.numWrap.length==this.digits){//当此没有子节点或者子节点已经全部显示 的时候才进行抽取

            this.numPwrap.innerHTML='';
            this.d=0;
            console.log('新')
            this.numPwrap.appendChild(oNode);

            this.timer=setInterval(()=>{
                oNode.innerHTML=Math.floor(Math.random()*10); //号码不断滚动
            },50)

            this.luckyNum=this.getLucky();//
            this.removeLuckyNum(this.luckyNum);//移除已经中奖的号码
            console.log('allList：'+this.allList)
            this.saveLuckyNum(this.luckyNum);//存储
        }else{

            this.numPwrap.appendChild(oNode);

            this.timer=setInterval(()=>{
                oNode.innerHTML=Math.floor(Math.random()*10); //号码不断滚动
            },50)

            this.luckyNum=this.luckyNum;
        }

    }

    // 停止号码滚动
    stop(){
        // 移除b节点
        let b=this.numPwrap.getElementsByTagName('b')[0];
        if(b){
            this.numPwrap.removeChild(b);
        }

        clearInterval(this.timer);
        this.playStopMusic();
        let aLuckyNum=this.luckyNum.split('');//将中奖号码进行分割成数组


        if(this.numWrap.length<this.digits){

            this.numPwrap.innerHTML+=`<span class="num">${aLuckyNum[this.d]}</span>`;
        }else{

        }
        this.d++;
        console.log('d：'+this.d)
        /*if(this.d<this.digits-1){
            this.d++;
        }else{
            this.d=this.digits-1;
        }*/
    }

    // 滚动音效
    playRuningMusic(){

    }

    // 停止音效
    playStopMusic(){

    }

    //将中奖号码进行存储
    saveLuckyNum(num){
        if(!this.oLocalStorage[this.turn]){//如果次轮抽奖结果没有存储就进行存储
            this.oLocalStorage.setItem(this.turn,num);
        }else{
            this.oLocalStorage.setItem(this.turn,`${this.getLocalStorage(this.turn)}、${num}`);
        }
    }

    getLocalStorage(turn){
        if(this.oLocalStorage[turn]){
            return this.oLocalStorage[turn];
        }else{
            return '';
        }
    }

    // 将中奖号码填充到页面
    fill(){
        this.turnsWrap.innerHTML=`第${this.turn}轮`;
        this.numPwrap.innerHTML='';
        this.d=0;
        if(this.getLocalStorage(this.turn) && this.numWrap.length==0){
            // this.numPwrap.innerHTML='';
            let aLuckyNum=this.getLocalStorage(this.turn).split('');//将中奖号码进行分割成数组
            for(let i=0 ;i<aLuckyNum.length;i++){
                this.numPwrap.innerHTML=`<span class="show">恭喜本轮中奖号码：${this.getLocalStorage(this.turn)}</span>`;
            }
        }else{

        }

    }
}





window.onload=function(){
    if(window.localStorage){
        var localsObj=window.localStorage;
        // alert('支持')
    }else{
        alert('您的浏览器不支持window.localStorage，请更换');
        return false;
    }


    let lucky=new Lucky(1,90,'get_num',8);
    lucky.init();

}
