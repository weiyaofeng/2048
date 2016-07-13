var game={
	data:null,//保存游戏的数据
	RN:4,//保存总行数
	CN:4,//保存总列数
  score:0,//保存目前得分
  top:0,//保存最高得分
  state:1,//保存游戏状态的编号
  GAMEOVER:0,//标识游戏结束状态
  RUNNING:1,//标识游戏进行中状态

  init:function(){//生成gridPanel中的所有div
    var div=document.getElementById("gridPanel");
    //计算容器的宽: CN*116+16
    div.style.width=this.CN*116+16+"px";
    //计算容器的高: RN*116+16
    div.style.height=this.RN*116+16+"px";
    var arr=[];//[00,01,02,03,10,11,12,13,21,...]
    //r从0开始，到<RN结束，每次增1  
    for(var r=0;r<this.RN;r++){
      //c从0开始，到<CN结束，每次增1
      for(var c=0;c<this.CN;c++){
        arr.push(""+r+c);//将""+r+c，压入arr中
      }
    }
    var grids='<div id="g'+
      arr.join('" class="grid"></div><div id="g')
      +'" class="grid"></div>';
    var cells='<div id="c'+
      arr.join('" class="cell"></div><div id="c')
      +'" class="cell"></div>';
    //设置id为gridPanel的div的内容为grids+cells
    div.innerHTML=grids+cells;
  },
	start:function(){//负责启动游戏
    this.init();//调用init初始化页面格子div

    this.score=0;//分数清零
    this.state=this.RUNNING;//状态重置为运行中

    //如果cookie中包含=，才从cookie中读取最大值
    if(document.cookie.indexOf("=")!=-1){
      this.top=document.cookie.split("=")[1];
    }

		this.data=[];//初始化data为空数组
		//r从0开始，到<RN结束，每次增1
		for(var r=0;r<this.RN;r++){
			//设置data中r位置为空数组
			this.data[r]=[];
			//c从0开始，到<CN结束，每次增1
			for(var c=0;c<this.CN;c++){
				//将data中r行c列位置设置为0
				this.data[r][c]=0
			}
		}
    //调用randomNum随机生成2个2或4
    this.randomNum();
    this.randomNum();
		//调用updateView更新页面
    this.updateView();
    var me=this;//留住this
    //为当前页面注册键盘事件
    document.onkeydown=function(e){
      if(me.state==me.RUNNING){//只有游戏运行中，才响应键盘事件
        //事件处理函数中，this->.前的对象
        //获得事件对象——事件发生时自动封装事件信息的对象
        e=window.event||e;
        //根据不同的按键，调用不同的方法
        switch(e.keyCode){
          case 37: me.moveLeft(); break;
          case 38: me.moveUp(); break;
          case 39: me.moveRight(); break;
          case 40: me.moveDown(); break;
        }
      }
    }
	},
  moveDown:function(){//下移所有列
    var before=String(this.data);
    for(var c=0;c<this.CN;c++){
      this.moveDownInCol(c); 
    }
    var after=String(this.data);
    if(before!=after){
      this.randomNum();
      //检查当前游戏是否结束
      if(this.isGameOver()){
        //如果游戏结束，就将游戏状态改为GAMEOVER
        this.state=this.GAMEOVER;
        //如果当前得分>top
        if(this.score>this.top){
          //将当前得分写入cookie
          var now=new Date();
          now.setFullYear(now.getFullYear()+1);
          document.cookie="top1="+this.score+
                          ";expires="+now.toGMTString();
        }
      }
      this.updateView();
    }
  },
  moveDownInCol:function(c){
    for(varb >0;r--){
      var prevr=this.getPrevInCol(r,c);
      if(prevr==-1){break;}
      else{
        if(this.data[r][c]==0){
          this.data[r][c]=this.data[prevr][c];
          this.data[prevr][c]=0;
          r++;
        }else if(this.data[r][c]==this.data[prevr][c]){
          this.data[r][c]*=2;
          this.data[prevr][c]=0;
          //将当前元素的值累加到score中
          this.score+=this.data[r][c];
        }
      }
    }
  },
  getPrevInCol:function(r,c){
    for(var prevr=r-1;prevr>=0;prevr--){
      if(this.data[prevr][c]!=0){return prevr;}
    }
    return -1;
  },
  moveUp:function(){//上移所有列
    var before=String(this.data);//先拍照
    //c从0开始，遍历data中每一列
    for(var c=0;c<this.CN;c++){
      this.moveUpInCol(c);//上移第c列
    }//(遍历结束)
    var after=String(this.data);//再拍照
    //如果有变化，才随机生成数，更新页面
    if(before!=after){
      this.randomNum();
      //检查当前游戏是否结束
      if(this.isGameOver()){
        //如果游戏结束，就将游戏状态改为GAMEOVER
        this.state=this.GAMEOVER;
        //如果当前得分>top
        if(this.score>this.top){
          //将当前得分写入cookie
          var now=new Date();
          now.setFullYear(now.getFullYear()+1);
          document.cookie="top1="+this.score+
                          ";expires="+now.toGMTString();
        }
      }
      this.updateView();}
  },
  moveUpInCol:function(c){//上移第c列
    //r从0开始，到<RN-1结束,每次+1
    for(var r=0;r<this.RN-1;r++){
      //查找r下方不为0的位置，nextr
      var nextr=this.getNextInCol(r,c);
      if(nextr==-1){break;}//如果没找到，就退出循环
      else{//否则
        if(this.data[r][c]==0){//如果当前元素是0
          //将nextr位置的元素赋值给当前元素
          this.data[r][c]=this.data[nextr][c];
          this.data[nextr][c]=0;//将nextr位置清零
          r--;//r倒退一步
        }else if(this.data[r][c]==
                  this.data[nextr][c]){
        //否则，如果当前元素等于nextr位置的元素
          this.data[r][c]*=2;//当前元素*=2
          this.data[nextr][c]=0;//nextr位置清零
          //将当前元素的值累加到score中
          this.score+=this.data[r][c];
        }
      }
    }
  },
  getNextInCol:function(r,c){//查找c列中r下方下一个不为0的位置
    //nextr从r+1开始，到<RN结束，每次增1
    for(var nextr=r+1;nextr<this.RN;nextr++){
      //如果nextr位置不等于0，就返回nextr
      if(this.data[nextr][c]!=0){return nextr};
    }//(遍历结束)返回-1
    return -1;
  },
  moveRight:function(){//右移所有行
    //给data拍照，保存在变量before中
    var before=String(this.data);
    //r从0开始，到<RN结束，遍历data中每一行
    for(var r=0;r<this.RN;r++){
      //调用moveRightInRow,移动第r行
      this.moveRightInRow(r);
    }//(遍历结束)
    //再给data拍照，保存在变量after中
    var after=String(this.data);
    if(before!=after){//如果发生了变化
      //随机生成数，更新页面
      this.randomNum();
      //检查当前游戏是否结束
      if(this.isGameOver()){
        //如果游戏结束，就将游戏状态改为GAMEOVER
        this.state=this.GAMEOVER;
        //如果当前得分>top
        if(this.score>this.top){
          //将当前得分写入cookie
          var now=new Date();
          now.setFullYear(now.getFullYear()+1);
          document.cookie="top1="+this.score+
                          ";expires="+now.toGMTString();
        }
      }
      this.updateView();
    }
  },
  moveRightInRow:function(r){//右移第r行
    //c从CN-1开始，到>0结束，每次-1
    for(var c=this.CN-1;c>0;c--){
      //调用getPrevInRow，查找c位置前一个不为0的位置，保存在变量prevc中
      var prevc=this.getPrevInRow(r,c);
      //如果没找到,就退出循环
      if(prevc==-1){break;}
      else{//否则
        if(this.data[r][c]==0){//如果当前元素为0
          //将r行prevc位置的元素赋值给当前元素
          this.data[r][c]=this.data[r][prevc];
          //将prevc位置的元素清零
          this.data[r][prevc]=0;
          c++; //c留在原地
        }else if(this.data[r][c]==
                  this.data[r][prevc]){
        //否则，如果当前元素等于r行prevc位置的元素
          this.data[r][c]*=2;//当前元素*=2;
          //将r行prevc位置的元素清零
          this.data[r][prevc]=0;
          //将当前元素的值累加到score中
          this.score+=this.data[r][c];
        }
      }
    }
  },
  getPrevInRow:function(r,c){//查找r行c之前的不为0的位置
    //prevc从c-1开始，到>=0结束,每次-1
    for(var prevc=c-1;prevc>=0;prevc--){
      //如果r行prevc位置的元素不等于0
      if(this.data[r][prevc]!=0){
        return prevc;//就返回prevc
      }
    }//(遍历结束)返回-1
    return -1;
  },
  moveLeft:function(){//左移所有行
    var before=String(this.data);//移动前拍张照
    //r从0开始，到<RN结束，遍历data中每一行
    for(var r=0;r<this.RN;r++){
      //调用moveLeftInRow(r)，移动第r行
      this.moveLeftInRow(r);
    }//(遍历结束)
    var after=String(this.data);//移动后拍张照
    //如果发生了移动，才随机生成数,更新页面
    if(before!=after){
      this.randomNum();
      //检查当前游戏是否结束
      if(this.isGameOver()){
        //如果游戏结束，就将游戏状态改为GAMEOVER
        this.state=this.GAMEOVER;
        //如果当前得分>top
        if(this.score>this.top){
          //将当前得分写入cookie
          var now=new Date();
          now.setFullYear(now.getFullYear()+1);
          document.cookie="top1="+this.score+
                          ";expires="+now.toGMTString();
        }
      }
      this.updateView();
    }
  },
  moveLeftInRow:function(r){//左移第r行
    //c从0开始，到<CN-1结束，每次增1
    for(var c=0;c<this.CN-1;c++){
      //调用getNextInRow(r,c),查找r行c位置之后，下一个不为0的位置，保存在变量nextc中
      var nextc=this.getNextInRow(r,c);
      //如果nextc等于-1，就退出循环
      if(nextc==-1){break;}
      else{//否则
        //如果data中r行c列为0
        if(this.data[r][c]==0){
          //将data中r行nextc位置的值赋值给c位置
          this.data[r][c]=this.data[r][nextc];
          //将data中r行nextc位置重置为0
          this.data[r][nextc]=0;
          c--;//让c倒退一步，抵消c++，留在原地
        }else if(this.data[r][c]==
                  this.data[r][nextc]){
        //否则 如果data中r行c列的值等于data中r行nextc列的值
          //将data中r行c列的值*=2;
          this.data[r][c]*=2;
          //将data中r行nextc的值设置为0
          this.data[r][nextc]=0;
          //将当前元素的值累加到score中
          this.score+=this.data[r][c];
        }
      }
    }
  },
  //查找r行c列之后下一个不为0的位置
  getNextInRow:function(r,c){
    //nextc从c+1开始，到<CN结束，每次增1
    for(var nextc=c+1;nextc<this.CN;nextc++){
      //如果data中r行nextc位置不等于0
      if(this.data[r][nextc]!=0){
        return nextc; //就返回nextc
      }
    }//(遍历结束)返回-1
    return-1;
  },
  updateView:function(){//将data中的数据更新到页面
    //遍历data中每个元素
    for(var r=0;r<this.RN;r++){
      for(var c=0;c<this.CN;c++){
      //找到id为"c"+r+c的div，保存在变量div中
        var div=document.getElementById("c"+r+c);
      //如果data中当前元素不等于0
        if(this.data[r][c]!=0){
        //设置div的内容为data中当前元素的值
          div.innerHTML=this.data[r][c];
        //设置div的className为"cell n"+data中当前元素的值
          div.className="cell n"+this.data[r][c];
        }else{//否则
          div.innerHTML="";//清空div的内容
        //设置div的className为"cell"
          div.className="cell";
        }
      }
    }
    //找到id为score的span，直接修改其内容为score
    document.getElementById("score").innerHTML=this.score;

    //找到id为topScore的span，直接修改器内容为top
    document.getElementById("topScore").innerHTML=this.top;

    //如果游戏状态为GAMEOVER
    if(this.state==this.GAMEOVER){
      //修改id为gameOver的div的style的display为block
      document.getElementById("gameOver").style.display="block";
      //设置id为finalScore的内容为score
      document.getElementById("finalScore").innerHTML=this.score;
    }else{//否则
      //修改id为gameOver的div的style的display为none
      document.getElementById("gameOver").style.display="none";
    }
  },
  randomNum:function(){//负责在随机位置生成2或4
    for(;;){//反复执行
      //在0~RN-1随机生成r
      var r=parseInt(Math.random()*this.RN);
      //在0~CN-1随机生成c
      var c=parseInt(Math.random()*this.CN);
      if(this.data[r][c]==0){//如果data中r行c列为0
        //设置data中r行c列的值为
          //如果Math.random()小于0.5就赋值为2，
                                //否则赋值为4
        this.data[r][c]=Math.random()<0.5?2:4;
        break;//退出循环
      }
    }
  },
  isGameOver:function(){//检查当前游戏是否结束
    for(var r=0;r<this.RN;r++){//遍历data中每个元素
      for(var c=0;c<this.CN;c++){
        //如果当前元素是0，就返回false
        if(this.data[r][c]==0){return false;}
        else if(c<this.CN-1&&this.data[r][c]==this.data[r][c+1]){
        //否则，如果c<CN-1,而且当前元素等于右侧元素
          return false;//就返回false
        }else if(r<this.RN-1&&this.data[r][c]==this.data[r+1][c]){
        //否则，如果r<RN-1,而且当前元素等于下方元素
          return false;//就返回false
        }
      }
    }//(遍历结束)返回true
    return true;
  }
}
//在页面加载后调用
window.onload=function(){game.start();}