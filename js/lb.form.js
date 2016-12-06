;(function($, window, document, undefined){
	/*
	 * lbform
	 * 作者：吕彬 
	 * Q Q : 286504720
	 * form jQuery plugin
	 * 
	 */
	'use strict';//使用严格模式

	var lbform = function (ele) {
		this.$element = ele;
		this._init(ele);//初始化
	};

	function lbSelect(a){
		var g = [], b = '', h = '';
		h = $(a).attr('lb-select').split(';');
		g.push('<ul class="lb-input-select-list">');
		for(var i = 0; i < h.length; i++){
			b = eval("("+h[i]+")");
			g.push('<li id="'+b.id+'">'+b.value+'</li>');
		}
		g.push('</ul>');
		$(a).parents('.lb-form').append(g.join(''));
	}

	function lbFile(a,b,ft){
		$(a).parents('.lb-form').append(b);
		$(a).parents('.lb-form').append('<span class="lb-file-tip">'+ft+'</span>')
		$(a).attr('type','hide');
		$(a).removeAttr('id');
	}
	function _w(c,b){
		var d = 0 ,w = 0;
		if(c.length > 1){
			for(var i = 0; i < c.length; i++){
				d += parseInt(c.eq(i).outerWidth(true));
			}	
		}else{
			d = parseInt(c.outerWidth(true));
		}
		return w = b - d - 2;
	}

	function getNowFormatDate() {//获得日期格式为20161202的日期
		var mh, sd, cd;
	    mh = new Date().getMonth() + 1;
	    sd = new Date().getDate();
	    if (mh >= 1 && mh <= 9) (mh = "0" + mh);
	    if (sd >= 0 && sd <= 9) (sd = "0" + sd);
	    return cd = new Date().getFullYear() + '' + mh + '' + sd;
	}

	lbform.prototype = {
		/**
			@a:当前的容器
			@b:传入进来的参数
		**/
		_init : function(a){
			/*** 
				_int(a)初始化
				@a: 出入进来的input
					循环input添加结构;
					循环input给父级lb-form宽度;
					当window窗口大小改变时，循环input改变父级lb-form宽度;
			***/
			var c = this;
			for(var i = 0; i<a.length; i++){
				c._h(a[i]);
			}

			function g(){
				setTimeout(function(){
					for(var i = 0;i<a.length;i++){
						var b, d;
						b = $(a[i]).parents('.lb-form').parent().width();
						($(window).outerWidth(true)%2 != 0)?(d=b-1):(d=b);
						c._g(a[i],d);
					}
				},50);
			}

			g();

			$(window).resize(function(){
				g();
			});
		},
		_h : function(a){
			/*** 
				_h(a)结构
				@a: 当前input
					创建父级lb-form添加到当前input的外层;
					根据type判断input的类型：
					1.INPUT:
						如果为下拉输入框，则把lb-select的值转化为ul>li形式插入到input之后,添加select事件函数;
						如果为上传文件，则复制当前input，去掉当前input的id，类型改变为hide，把复制后的b使用uploadfiy插件；
					2.SELECT:
						添加change事件	
			***/
			var c, type, f;
			c = this;
			type = a.tagName;
			f = $('<div class="lb-form" style="float:right"></div>');
			$(a).wrap(f);
			switch(type){
				case "INPUT":
					if($(a).attr('lb-select')){
						lbSelect(a);
						c._select(a);
					}
					if($(a).attr('lb-file')){
						var b,ft;
						b = $(a).clone();
						ft = $(a).attr('placeholder');
						lbFile(a,b,ft)
						c._uploadfile(a,b);
					}
					c._blurEvent(a,type);
					break;
				case "SELECT":
					c._changeEvent(a,type);
					break;
			}
		},
		_g : function(a,b){
			/*** 
				_g(a)宽度
				@a: 当前input
				@b: 当前父级lb-form的父级的宽度
					计算当前input的同辈元素的宽度之和d;
					b-d等于当前的lb-form的宽度 再减去边框2为当前的lb-form的宽度
			***/
			var c = $(a).parents('.lb-form').siblings().not('.lb-file');
			$(a).parents('.lb-form').css({"width":_w(c,b)});
		},
		_blurEvent:function(a,b){//input光标离开时事件
			$(a).bind('blur',function(){
				lbMsgTip(a,b);
			})
		},
		_changeEvent:function(a,b){//select下拉选择事件
			$(a).bind('change',function(){
				lbMsgTip(a,b);
			});
		},
		_select:function(a){//模拟下拉
			$(a).bind('click',function(event){
				var c, b, d, bh, t, h;
				c = $(this);
				b = $(this).next('.lb-input-select-list');
				bh = $(window).height();
				t = $(this).offset().top + 31;
				h = b.find('li').length *23;
				((bh - t)< h)?(b.css("top",-h)):(b.css("top","31px"));
				$(document).bind('click',function(){
					b.hide();
				});
				c.bind('keydown',function(){
					b.hide();
				});
				b.toggle();
				b.find('li').bind('click',function() {
					d = $(this).html();
					c.val(d);
					b.hide();
				});
				event.stopPropagation();
			});
		},
		_uploadfile:function(a,b){
			/*** 
				_uploadfile(a,b) 上传事件
				@a: 当前input
				@b: 当前input的复制
					调用uploadfiy插件;
					自定义插件的文件类型和按钮名称；
					成功后回调事件中创建弹出层显示文件或图片
			***/
			var bn, y, n, u, m, x, d;
			bn = $(a).attr('lb-upload-btn')|| "上传";
			y = $(a).attr('lb-upload-type');//文件类型
			n = $(a).attr('lb-upload-number');//文件个数
			u = 'http://xiaoyaoge.me/lbforms/upload/'+getNowFormatDate();//文件路径
			(y == "img")?(d = 'Image Files',x = '*.gif; *.jpg; *.png; *.jpeg'):(d = 'All Files',x = '*');
			(n =="1")?(m = false):(m= true);
			var set = {
				'buttonText' : bn,
				'fileTypeDesc' : d,
				'fileTypeExts' : x,
				'multi'    : m,
				'queueSizeLimit' : n,
				'swf'      : 'js/uploadify.swf',
				'uploader' : 'js/uploadify.php',
				'onSelect' : function(file) {
		            var fi = $(a).parents('.lb-form').find('span.lb-file-name');
		            if(fi){
		            	fi.remove();
		            }
		           /* if($('body').find('.lb-pop')){
						$('.lb-pop').remove();
					}*/
		        },
				'onUploadSuccess' : function(file, data, response) {
					$('#' + file.id).parents('.lb-form').find('.lb-file-tip').hide();
					$('#' + file.id).find('.data').html(' 上传完毕');
					var link = $('<span class="lb-file-name">'+file.name+'</span>');
					$('#' + file.id).parents('.lb-form').append(link);
					$(a).attr('value',u+'/'+file.name);
					var d = $('#' + file.id).parents('.lb-form');
					var p = [];
					p.push(
						'<div class="lb-pop">',
						'<div class="lb-pop-con">',
						'<span class="lb-pop-close"></span>'
					);
					if(y == "img"){
						p.push('<img class="lb-file" src="'+u+'/'+file.name+'"/>');
					}else{
						var k = '<a target="_blank" href="'+u+'/'+file.name+'">'+file.name+'</a>';
						p.push(k);
					}
					p.push(
						'</div>',
						'<div class="lb-pop-bg"></div>',
						'</div>'
					);
					$('body').append(p.join(''));
					d.each(function(){
						$(this).find('.lb-file-name').each(function(index){
							$(this).bind('click',function(e){
								$('.lb-pop').eq(index).show();
								e.stopPropagation();
							});
							$('.lb-pop-close').bind('click',function(){
								$(this).parents('.lb-pop').hide();
							});
						});
					});
				 }
			}
			$(b).uploadify(set);
		}
	};

	$.fn.lbform = function() {
		//创建Beautifier的实体
		var lbForm = new lbform(this);
		//调用其方法
		return this;
	};

	function ms(a,s){
		/***
			ms(a,s)添加提示信息 
			@a: 当前input
			@s: 当前input的lb-msg
				创建提示信息结构
				判断当前input是否存在lb-msg
				判断是否已经存在提示
				给当前input添加提示并给父级添加error样式
		***/
		var f = [];
		f.push(
			'<div class="lb-msg">',
			'<i class="lb-msg-arrow"></i>',
			'<i class="lb-msg-arrow-border"></i>',
			'<div class="lb-msg-con">'+s+'</div>',
			'</div>'
		);
		if(s){
			if($(a).next('.lb-msg').length > 0) $(a).next('.lb-msg').remove();
			$(a).after(f.join(''));
			$(a).parents('.lb-form').addClass('error');
		}
	}
	
	function t(a,b){
		/***
			t(a,b)验证提示信息 
			@a: 当前input
			@s: 当前input的type类型INPUT,SELECT
				1.INPUT:
					input先判断是否为空;
					为空显示lb-msg提示信息;
					不为空查看input的lb-type用正则判断;
					如果不符合显示验证信息;
					再次输入时隐藏掉错误提示.
				2.SELECT:
					判断当前被选中的是否为初始选项;
					为初始值显示提示信息;
					再次选择时隐藏提示信息.

		***/
		var s, k;
		s = $(a).attr('lb-msg');
		k= $(a).attr('lb-msg-num');
		if(k){
			var sk, sk1, sk2;
			sk = k.split(",");
			sk1 = sk[0];
			sk2 = sk[1];
		}
		if(b == "INPUT"){
			var v, t;
			v = $(a).val();
			t = $(a).attr('lb-msg-type');
			var g = {
		        tel : /^0?1[3|4|5|8][0-9]\d{8}$/,//手机
		        mail:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,//邮箱
		        number : /^[0-9]*$/
		    }
			if(v == ""){
				ms(a,s);
			}else{
				var m;
				switch (t){
					case 'number':
						m = '请输入数字！';
						if(!g.number.test(v)) ms(a,m);
						break;
					case 'tel':
						m = '请输入正确手机号！';
						if(!g.tel.test(v)) ms(a,m);
						break;
					case 'mail':
						m = '请输入正确邮箱！';
						if(!g.mail.test(v)) ms(a,m);
						break;
					default :
						if(k){
							if(v.length>sk2 || v.length<sk1){
								m = '请输入'+sk1+'到'+sk2+'个字符';
								ms(a,m)
							}
						}
						break;
				}
				
			}
			$(a).bind('keydown',function(){
				$(this).parents('.lb-form').removeClass('error');
				$(this).next('.lb-msg').hide();
			});
		}
		if(b == "SELECT"){
			var index, m;
			index = $(a).find('option:selected').index();
			if(index == 0){
				m = $(a).attr('lb-msg');
				ms(a,m);
			}
			$(a).bind('change',function(){
				$(this).parents('.lb-form').removeClass('error');
				$(this).next('.lb-msg').hide();
			});
		}
	}

	function lbMsgTip(a,b){
		if($(a).attr('lb-msg-tip') == "true"){//判断是否需要提示
			t(a,b);
		}
	}

	/* 暴露给外部调用tip */
	$.fn.lbform.tip = function(a){
		var type = a[0].tagName;
		t(a,type);
	}

})(jQuery, window , document);