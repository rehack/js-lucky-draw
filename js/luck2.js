class Lucky{
    constructor(startNum,endNum){
        this.startNum=startNum;//参与抽奖的起始号码
        this.endNum=endNum;//参与抽奖的结束号码

    }

    init(){
        document.onkeyup=function(e){
            let e=e||window.event;
            // alert(e.keyCode)
            // 空格键开始和停止抽奖
            if(e.keyCode==32 && flag){
                // console.log(e.keyCode);
                start();
            }else if (e.keyCode==32 && !flag) {
                end();
            }
            // 右方向键切换到下一轮抽奖环节
            if(e.keyCode==39){
                lunItem+=1;
                if(lunItem==12){
                    lunItem=1;
                }
                // console.log(lunItem)
                changeLun();
                num.innerHTML=numHtml.substring(0,6);
            }
            // 左方向键切换到上一轮抽奖环节
            if(e.keyCode==37){
                lunItem-=1;
                if(lunItem==0){
                    lunItem=11;
                }
                // console.log(lunItem)
                changeLun();
                num.innerHTML=numHtml.substring(0,6);
            }

            //清除本地所有存储数据
            if(e.keyCode==27){
                localStorage.clear();
            }

        }
    }

    /**
     * [getLucky 获取中奖号码]
     * @return {[array]} [description]
     */

    getLucky(){

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

}
