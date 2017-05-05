class Lucky{
    constructor(startNum,endNum,digits,numWrap){
        this.startNum=startNum;//参与抽奖的起始号码
        this.endNum=endNum;//参与抽奖的结束号码
        this.digits=digits;//中奖号码显示的位数
        this.allList=[];//参与抽奖号码数组
        this.luckyNum=null;//中奖号码
        this.flag=true;//开始与停止标记
        this.numPwrap=document.getElementById(numWrap);//号码显示父容器
        this.numWrap=this.numPwrap.getElementsByTagName('span');//号码显示父容器
        this.timer=null;//定时器
        this.oLocalStorage=window.localStorage;//本地存储对象
        this.turn=1;//97->1 98->2 ... 抽奖轮次编号 按小键盘数字进行切换
        // this._d=this.d();
    }

    init(){
        this.getLocalStorage(this.turn);//刷新页面，从localStoreage中恢复
        // console.log(this.getLocalStorage())
        document.onkeyup=(e)=>{
            let oEvent=e||window.event;//let在当前作用域内有用，未声明前不可用，不可重复声明


            // alert(oEvent.keyCode)
            // console.log(this)
            // 空格键开始和停止抽奖


            if(oEvent.keyCode==32 && this.flag){
                // console.log(oEvent.keyCode);
                this.flag=false;
                this.run();
            }else if (oEvent.keyCode==32 && !this.flag) {
                this.flag=true;
                this.stop();
            }

            switch (oEvent.keyCode) {
                case 97:
                    this.turn=1;
                    this.getLocalStorage(this.turn);
                    break;
                case 98:
                    this.turn=2;
                    this.getLocalStorage(this.turn);
                    break;
                case 99:
                    this.turn=3;
                    this.getLocalStorage(this.turn);
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
        for(let i=this.startNum;i<=this.endNum;i++){
            this.allList.push(i);
        }
        // return this.allList;
        let randomNum=Math.floor(Math.random() * this.allList.length);//随机抽取一个中奖号码
        // return this.buquan(this.allList[randomNum],this.digits);//将中奖号码补全前导0 然后返回
        return this.buquan(this.allList[randomNum],this.digits);//将中奖号码补全前导0 然后返回
        // return this.luckyNum;
    }

    d(){
        let d=null;
        if(this.numWrap[0].innerHTML==''){
            d=0;
        }else if(this.numWrap[0].innerHTML!='' && this.numWrap[1].innerHTML==''){
            d=1;
        }
        return d;
    }

    // 开始滚动号码效果
    run(){


        // console.log('run：'+this._d)
        let oNode=document.createElement('span');
        clearInterval(this.timer);//清除之前的定时器
        this.timer=setInterval(()=>{
            // console.log(Math.floor(Math.random()*10));
            // console.log(d)
            // this.numWrap[this._d].innerHTML=Math.floor(Math.random()*10);
            this.numPwrap.innerHTML='<span class="num">'+Math.floor(Math.random()*10)+'</span>'
        },50)
        this.playRuningMusic();//同时播放音效
    }

    // 停止号码滚动
    stop(){

        // console.log('stop：'+this._d)
        // 先清空
        for(let i=0;i<this.numWrap.length;i++){
            // this.numWrap[i].innerHTML='';
            console.log(this.numWrap[i])

        }
        // alert('stop')
        // console.log(this.numPwrap.innerHTML)
        if(!this.getLocalStorage(this.turn)){
            this.luckyNum=this.getLucky();//当此轮没有抽取过 的时候才进行抽取
            console.log('中奖号码：'+this.luckyNum);
        }else{
            return false;
        }
        // console.log('d:'+this._d);//1
        clearInterval(this.timer);
        this.playStopMusic();
        let aLuckyNum=this.luckyNum.split('');//将中奖号码进行分割成数组


        // this.numWrap[this._d].innerHTML=aLuckyNum[this._d];//显示
        // 显示中奖号码
        let d=null;
        if(this.numWrap[0].innerHTML==''){
            d=0;
            this.numPwrap.innerHTML=aLuckyNum[0];
        }else if(this.numWrap[0].innerHTML!='' && this.numWrap[1].innerHTML==''){
            this.numPwrap.innerHTML=aLuckyNum[1];
        }

        // console.log(str)
        // this.saveLuckyNum();//存储
        // if()
    }

    // 滚动音效
    playRuningMusic(){

    }

    // 停止音效
    playStopMusic(){

    }

    //将中奖号码进行存储
    saveLuckyNum(){
        if(!oLocalStorage[this.turn]){//如果次轮抽奖结果没有存储就进行存储
            this.oLocalStorage.setItem(this.turn,this.getLucky());
        }else{
            this.oLocalStorage.setItem('new-'+this.turn,this.getLucky());
        }
        // console.log(this.oLocalStorage)
    }

    getLocalStorage(turn){
        if(this.oLocalStorage[turn]){
            // return
            this.numWrap.innerHTML=this.oLocalStorage[turn];
        }else{
            // this.numWrap.innerHTML='';
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
    // 数组扩展方法 从数组删除指定元素
    Array.prototype.removeByValue = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) {
                this.splice(i, 1);
                break;
            }
        }
    }

    let lucky=new Lucky(1,40,2,'get_num');
    lucky.init();

}
