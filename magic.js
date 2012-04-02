/*
 *
 *  ��άħ�����ݽ�ģ1.1
 *  @author eric_zyh
 *  @web    http://www.zhaoyuhao.com
 *  @email  1286514442@qq.com
 *  @΢��    ǧҶ_V
 *  
 *  ���ĸ���:Ȧ ��Ȧ��  http://www.wuzhi.me
 *  
 *  �������⣺
 *  1.����ת = 3*����ת ��Ҫ�Ż�
 *  2.����ת = 3*����ת ��Ҫ�Ż�
 *  3.̫���Ƕ��ѭ��
 *  
 *  API:
 *  function __init__      ��ʼ��
 *  function getQuan       ��ȡĳ��index���ڵ�Ȧ�±�,Ȧ�Ķ�,Ȧ�ķ�Χ {dgree=?,du=?,quan=?}
 *  function getDimension  ��ȡĳ��index�Ķ�ά���� {x=?,y=?} 
 *  function turnleft      ��ת
 *  function turnright     ��ת
 *  function turnup        ��ת
 *  function turndown      ��ת
 *  function check         ģ���Ƿ����
 *  
 *  
 */ 
$(function() {
	window.magic = function(d, render) { 
		// ħ�����ݽ�ģ
		magicModel = function(d, render) {
			this.d = d; // ά��
			this.col = Math.pow(d, 2); // ���� 
			this.block = new Array(); // �����λ���� 
			this.render = render; // ��Ⱦ��
			this.quan = new Array(); // Ȧ ģ��ת��ʱ����Ҫ�����ʾת��ʱ��λ�ñ仯 
			this.start = d % 2 == 0 ? 2 : 1; // ��ʼ��[Ȧ]
			this.change = [ { 'x' : 0, 'y' : 1 }, { 'x' : 1, 'y' : 0 }, { 'x' : 0, 'y' : -1 }, { 'x' : -1, 'y' : 0 } ]; //ģ��Ȧȷ������ת����
			
			
			// ��ʼ��ħ��
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
				//��ʼ�������ά����
				for (var z = 0; z < this.d; z++) {
					this.block = new Array();
					for (var x = 0; x < this.d; x++) {
						this.block[x] = new Array();
						for (var y = 0; y < this.d; y++) {  
							this.block[x][y] = new Array();
						}
					}
				} 
				//����Ȧģ�ͽ����ݳ�ʼ������ͬ������
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
				//��Ⱦ
				render.render(this);
				return this;
			},
			// ��ȡindex���ڵ�Ȧ�±� Ȧ�ķ�Χ Ȧ�Ķ�
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
			// ��ȡindex��Ӧ������
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
			}, //��ת
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
			},//��ת
			this.turnright = function(index){
				this.turnleft(index);
				this.turnleft(index);
				this.turnleft(index);
				render.turnright(this);
			},//��ת
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
			}//��ת
			this.turndown = function(index){
				this.turnup(index);
				this.turnup(index);
				this.turnup(index);
				render.turndown(this);
			}//���ħ���Ƿ����óɹ�
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
		// ��ʼ��
	}
});