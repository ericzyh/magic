/*
 *
 *  多维魔方数据建模1.1
 *  @author eric_zyh
 *  @web    http://www.zhaoyuhao.com
 *  @email  1286514442@qq.com
 *  @微博    千叶_V
 *  
 *  核心概念:圈 、圈度  http://www.wuzhi.me
 *  
 *  遗留问题：
 *  1.向右转 = 3*向左转 需要优化
 *  2.向下转 = 3*向上转 需要优化
 *  3.太多的嵌套循环
 *  
 *  API:
 *  function __init__      初始化
 *  function getQuan       获取某个index所在的圈下标,圈的度,圈的范围 {dgree=?,du=?,quan=?}
 *  function getDimension  获取某个index的二维坐标 {x=?,y=?} 
 *  function turnleft      左转
 *  function turnright     右转
 *  function turnup        上转
 *  function turndown      下转
 *  function check         模仿是否完毕
 *  
 *  
 */ 
$(function() {
	window.magic = function(d, render) { 
		// 魔方数据建模
		magicModel = function(d, render) {
			this.d = d; // 维度
			this.col = Math.pow(d, 2); // 列数 
			this.block = new Array(); // 块的三位数组 
			this.render = render; // 渲染器
			this.quan = new Array(); // 圈 模仿转动时的重要概念，表示转动时块位置变化 
			this.start = d % 2 == 0 ? 2 : 1; // 初始化[圈]
			this.change = [ { 'x' : 0, 'y' : 1 }, { 'x' : 1, 'y' : 0 }, { 'x' : 0, 'y' : -1 }, { 'x' : -1, 'y' : 0 } ]; //模型圈确定坐标转向定义
			
			
			// 初始化魔方
			this.__init__ = function() {
				var i = 0;
				var coltemp = this.col;
				var tempstart =this.d-1;
				while (tempstart >= 0) {
					if(tempstart==0){this.quan[i]=1;break;}
					this.quan[i] = 4*tempstart;
					tempstart -= 2;
					i++;
				}   
				//初始化块的三维数组
				for (var z = 0; z < this.d; z++) {
					this.block = new Array();
					for (var x = 0; x < this.d; x++) {
						this.block[x] = new Array();
						for (var y = 0; y < this.d; y++) {  
							this.block[x][y] = new Array();
						}
					}
				} 
				//按照圈模型将数据初始化到不同的坐标
				var index = 1;
				for (var z = 0; z < this.d; z++) { 
					for (var x = 0; x < this.d; x++) { 
						for (var y = 0; y < this.d; y++) {  
							var distemp = index%this.col;
							if(distemp==0){
								distemp = this.col;
							}
							var dimension = this.getDimension(distemp);
							this.block[z][dimension.x][dimension.y] = index; 
							index++;
						}
					}
				}  
				//渲染
				render.render(this);
				return this;
			},
			// 获取index所在的圈下标 圈的范围 圈的度
			this.getQuan = function(index) { 
				var k = this.quan.length;
				var quan = 0;//8,1
				for (var i = 0; i<k ; i++) {
					quan += this.quan[i]; 
					if (quan >= index) {
						break;
					}
				} 
				quan-=this.quan[i]; 
				return {
					'dgree' :i,
					'du' : this.quan[i]/4,
					'quan' : quan
				};
			},
			// 获取index对应的坐标
			this.getDimension = function(index) {
				var k = this.quan.length;
				var quan = 0;//8,1
				for (var i = 0; i<k ; i++) {
					quan += this.quan[i];
					if (quan >= index) {
						break;
					}
				}
				var quan = this.getQuan(index);
				var q = quan.du;
				var dgree = quan.dgree;
				var q1 = quan.quan;
				var j = 0;
				var nowx = dgree, nowy = dgree;
				for (i = 1; i <= 4 * q; i++) {
					if (i == index - q1) {
						break;
					}
					nowx = nowx + this.change[j].x * 1;
					nowy = nowy + this.change[j].y * 1;
					if ((i) % (q) == 0) {
						j++;
					}

				}
				return {
					x : nowx,
					y : nowy
				};
			}, //左转
			this.turnleft = function(index){
				var l = this.quan.length;
				var tmp = 0;
				for(var i=0;i<l;i++){
					var temp = new Array();
					var nowx = nowy = i;
					for(var j=0;j<this.quan[i];j++){
						if(this.quan[i]==1)break;
						var du = this.quan[i]/4>0?this.quan[i]/4:0;
						if(j<du){  
							temp[tmp+j]=this.block[index][i][nowy];
							this.block[index][i][nowy]=this.block[index][nowy][du+i];
							nowy++;
						}else if(j<2*du){  
							this.block[index][nowx][du+i]=this.block[index][du+i][nowy]; 
							nowx++;
							nowy--;
						}else if(j<3*du){  
							this.block[index][du+i][nowx]=this.block[index][nowx][i];  
							nowx--;
						}else{  
							if(j==3*du){nowx=du+i;}
							this.block[index][nowx][i]=temp[tmp+j-3*du];
							nowx--;
						} 
					}
					tmp += this.quan[i]; 
				} 
				render.turnleft(this);
			},//右转
			this.turnright = function(index){
				this.turnleft(index);
				this.turnleft(index);
				this.turnleft(index);
				render.turnright(this);
			},//上转
			this.turnup = function(index){
				var l = this.quan.length;
				var tmp = 0;
				for(var i=0;i<l;i++){
					var temp = new Array();
					var nowx = nowy = i;
					for(var j=0;j<this.quan[i];j++){
						if(this.quan[i]==1)break;
						var du = this.quan[i]/4>0?this.quan[i]/4:0;
						if(j<du){  
							temp[tmp+j]=this.block[i][index][nowy];
							this.block[i][index][nowy]=this.block[nowy][index][du+i];
							nowy++;
						}else if(j<2*du){  
							this.block[nowx][index][du+i]=this.block[du+i][index][nowy]; 
							nowx++;
							nowy--;
						}else if(j<3*du){
							this.block[du+i][index][nowx]=this.block[nowx][index][i];  
							nowx--;
						}else{ 
							if(j==3*du){nowx=du+i;}
							this.block[nowx][index][i]=temp[tmp+j-3*du];
							nowx--;
						} 
					} 
					tmp += this.quan[i];  
				}
				render.turnup(this);
			}//下转
			this.turndown = function(index){
				this.turnup(index);
				this.turnup(index);
				this.turnup(index);
				render.turndown(this);
			}//检查魔方是否设置成功
			this.check = function(index){ 
				var retval = true;
				var index = 2;
				for(var y=0 ;y<this.d;y++){
					for(var x=0;x<this.d-1;x++){ 
						var lastdimension = this.getDimension(index-1);
						var dimension = this.getDimension(index); 
						var quan = this.getQuan(index).du*4;
						var fx = this.block[0][lastdimension.x][lastdimension.y]-this.block[0][dimension.x][dimension.y];
						if(fx!=1&&fx!=-1&&fx!=-1*(quan-1)&&fx!=(quan-1)){
							retval =  false;
							break;
						} 
						for(var i=1 ;i<this.d;i++){
							fy =this.block[i][dimension.y][dimension.x]-this.block[0][dimension.y][dimension.x];
							if(fy!=this.col*i&&fy!=(this.col)*-1*i){
								retval =  false; 
								break;
							}
						}
						if(!retval)break;
						index++;
					}
					if(!retval)break;
				} 
				if(!retval){
					for(var y=0 ;y<this.d;y++){
						this.turnup(y);
					}
					retval = true;
					index = 2;
					for(var y=0 ;y<this.d;y++){
						for(var x=0;x<this.d-1;x++){ 
							var lastdimension = this.getDimension(index-1);
							var dimension = this.getDimension(index); 
							var quan = this.getQuan(index).du*4;
							var fx = this.block[0][lastdimension.x][lastdimension.y]-this.block[0][dimension.x][dimension.y];
							if(fx!=1&&fx!=-1&&fx!=-1*(quan-1)&&fx!=(quan-1)){
								retval =  false;
								break;
							} 
							for(var i=1 ;i<this.d;i++){
								fy =this.block[i][dimension.y][dimension.x]-this.block[0][dimension.y][dimension.x];
								if(fy!=this.col*i&&fy!=(this.col)*-1*i){
									retval =  false; 
									break;
								}
							}
							if(!retval)break;
							index++;
						}
						if(!retval)break;
					} 
					for(var y=0 ;y<this.d;y++){
						this.turndown(y);
					}
				}
				return retval;
			}
		}
		return new magicModel(d,render);
		// 开始咯
	}
});