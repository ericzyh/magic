/*
 *  渲染器 1.1
 *  @author eric_zyh
 *  @web    http://www.zhaoyuhao.com
 *  @email  1286514442@qq.com
 *  @微博    千叶_V
 *
 *  必须实现的接口
 *  1.render      渲染
 *  2.turnleft    
 *  3.turnright
 *  4.turnup
 *  5.turndown
 *
 */ 
$(function() {
	// 简单渲染器。帮助理解算法
	easyrender = {
		container : "#container",
		render : function(m) {
			var c = $("#container").html('');;
			for (var z = 0; z < m.d; z++) {
				var c2 = $("<div class='col'></div>").appendTo(c).css("height",
						m.d * 40 + 20).css("position", "relative");
				for (var y = 0; y < m.d; y++) {
					for (var x = 0; x < m.d; x++) {
						var block = $("<div class='block'>" + m.block[z][y][x] + "</div>").appendTo(c2);
						block.css({
							'top' : x * 40,
							'left' : y * 40
						});
					}
				}
			}  
		},
		turnleft : function(m){this.render(m);},
		turnright : function(m){this.render(m);},
		turnup : function(m){this.render(m);},
		turndown : function(m){this.render(m);}
	
	}
	// html5渲染器。很绚的效果
	html5render = {
		render : function(model) {
			alert("coding...");
		}
	}
});