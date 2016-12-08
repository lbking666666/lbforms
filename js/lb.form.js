;(function($, window, document, undefined){
	/*
	 * lbform
	 * 作者：吕彬 
	 * Q Q : 286504720
	 * form jQuery plugin
	 * 
	 */
	'use strict';//使用严格模式

	var lbform = function(ele) {
		this.$element = ele;
		this._init(ele);//初始化
	};

	function ls(a) {//render lb-select 
		var g = [], b = '', h = $(a).attr('lb-select').split(';');
		g.push('<ul class="lb-input-select-list">');
		for(var i = 0; i < h.length; i++) {
			b = eval("("+h[i]+")");
			g.push('<li id="'+b.id+'">'+b.value+'</li>');
		}
		g.push('</ul>');
		$(a.parentElement).append(g.join(''));
	}

	function lf(a, b, ft) {//render lb-file
		$(a.parentElement).append(b);
		$(a.parentElement).append('<span class="lb-file-tip">'+ft+'</span>');
		a.setAttribute('type','hide');
		a.removeAttribute('id');
	}

	function lw(c, b) {//w = parent width - siblings width  - border width
		var d = 0 ,w = 0;
		if(c.length > 1) {
			for(var i = 0; i < c.length; i++){
				d += parseInt(c.eq(i).outerWidth(true));
			}	
		}else {
			d = parseInt(c.outerWidth(true));
		}
		return w = b - d - 2;
	}

	function ld() {//date rule 20161202
		var mh = new Date().getMonth() + 1, sd = new Date().getDate(), cd;
	    if (mh >= 1 && mh <= 9) (mh = "0" + mh);
	    if (sd >= 0 && sd <= 9) (sd = "0" + sd);
	    return cd = new Date().getFullYear() + '' + mh + '' + sd;
	}

	function lp(y, f, s) {// render lb-pop
		var p = [];
		p.push(
			'<div class="lb-pop">',
			'<div class="lb-pop-con">',
			'<span class="lb-pop-close"></span>'
		);
		(y == "img") ? (p.push('<div><img class="lb-file" src="'+f+'"/></div>')) : (p.push('<div><a target="_blank" href="'+f+'">'+s+'</a></div>'));
		p.push('</div>',
			'<div class="lb-pop-bg"></div>',
			'</div>'
		);
		if($('body').find('.lb-pop').length > 0 ) {
			return;
		}else{
			$('body').append(p.join(''));
			$('.lb-pop').show();
		}
	}

	lbform.prototype = {
		/**
			@a:当前的容器
			@b:传入进来的参数
		**/
		_init : function(a) {
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
			var g = function() {
				setTimeout(function(){
					for(var i = 0;i<a.length;i++){
						var b, d;
						b = (a[i].parentElement.parentElement).clientWidth;
						(document.documentElement.clientWidth%2 != 0)?(d=b-1):(d=b);
						c._g(a[i],d);
					}
				},100);
			};
			g();

			$(window).resize(function(){
				g();
			});
		},

		_h : function(a) {
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
			var c = this, type = a.tagName, f = $('<div class="lb-form" style="float:right"></div>');
			$(a).wrap(f);
			switch(type) {
				case "INPUT":
					if(a.getAttribute('lb-select')) {
						ls(a);
						c._s(a);
					}
					if(a.getAttribute('lb-upload-set')) {
						var b,ft;
						b = $(a).clone();
						ft = a.getAttribute('placeholder');
						lf(a,b,ft)
						c._u(a,b);
					}
					c._b(a,type);
					break;
				case "SELECT":
					c._c(a,type);
					break;
			}
		},
		_g : function(a, b) {
			/*** 
				_g(a)宽度
				@a: 当前input
				@b: 当前父级lb-form的父级的宽度
					计算当前input的同辈元素的宽度之和d;
					b-d等于当前的lb-form的宽度 再减去边框2为当前的lb-form的宽度
			***/
			var c = $(a.parentElement).siblings().not('.lb-file');
			$(a.parentElement).css({"width":lw(c,b)});
		},
		_b : function(a, b) {//input光标离开时事件
			$(a).bind('blur',function() {
				lbMsgTip(a,b);
			});
			$(a).bind('keydown',function() {
				if($(a).parents('.lb-form').hasClass('error')) {
					$(a).parents('.lb-form').removeClass('error');
					$(a).next('.lb-msg').hide();
				}
			});
			$(a).bind('click',function(){//日期控件控制iframe显示
				if($('body').find('iframe')){
					$('iframe').show();
				}
			});
		},
		_c : function(a, b) {//select下拉选择事件
			$(a).bind('change',function() {
				if($(a).parents('.lb-form').hasClass('error')) {
					$(this.parentElement).removeClass('error');
					$(this).next('.lb-msg').hide();
				}else{
					lbMsgTip(a,b);
				}
			});
		},
		_s : function(a) {//模拟下拉
			$(a).bind('click',function(event) {
				var c = $(this), b = $(this.parentElement).find('.lb-input-select-list'), bh = $(window).height(), t = $(this).offset().top + 31, h = b.find('li').length *23,  d;
				((bh - t)< h)?(b.css("top",-h)):(b.css("top","31px"));
				if(c.parents('.lb-form').hasClass('error')) {
					c.parents('.lb-form').removeClass('error');
					c.next('.lb-msg').hide();
				}
				$(document).bind('click',function() {
					b.hide();
				});
				c.bind('keydown',function() {
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
		_u : function(a, b) {
			/*** 
				_u(a,b) 上传事件
				@a: 当前input
				@b: 当前input的复制
					调用uploadfiy插件;
					自定义插件的文件类型和按钮名称；
					成功后回调事件中创建弹出层显示文件或图片
			***/
			var c = $(this);
			var us = $(a).attr('lb-upload-set'), os = eval("("+us+")"), u = 'http://xiaoyaoge.me/lbforms/upload/'+ld(), m, x, d;
			(os.type == 'img')?(d = 'Image Files',x = '*.gif; *.jpg; *.png; *.jpeg'):(d = 'All Files',x = '*');
			(os.number =="1")?(m = false):(m= true);
			var set = {
				'buttonText'     : os.btn || '上传' ,
				'fileTypeDesc'   : d || 'All Files',
				'fileTypeExts'   : x || '*',
				'multi'          : m || false,
				'queueSizeLimit' : os.number || 1,
				'fileSizeLimit'  : os.limit || '1GB',
				'swf'            : 'js/uploadify.swf',
				'uploader'       : 'js/uploadify.php',
				'onSelect'       : function(file) {
					var fi = $(a.parentElement).find('.lb-file-name'),fw = $('#' + file.id).parents('.lb-form');
		            if(fi) fi.remove(); 
		            if(fw.hasClass('error')) {
						fw.removeClass('error');
						fw.find('.lb-msg').hide();	
					}
		        },
				'onUploadSuccess' : function(file) {
					var link = $('<span class="lb-file-name" lb-file-name="'+file.name+'" lb-file-src="'+u+'/'+file.name+'">'+file.name+'</span>') ,fw = $('#' + file.id).parents('.lb-form');
					$('#' + file.id).find('.data').html(' 上传完毕');
					fw.find('.lb-file-tip').hide();
					fw.append(link);
					$(a).each(function(){
						var e = '';
						$(this).parents('.lb-form').find('.lb-file-name').each(function() {
							e += ',' + $(this).attr('lb-file-src');
						});
						$(this).attr('value',e);
					});
				 }
			}
			$(b).uploadify(set);
			$('body').on('click','.lb-file-name',function() {
				var f = $(this).attr('lb-file-src'), s = $(this).attr('lb-file-name');
				var uy = $(this).parents('.lb-form').find('.lb-input').attr('lb-upload-set'), oy = eval("("+uy+")") || 'file';
				lp(oy.type, f, s);
			});
			$('body').on('click','.lb-pop-close',function() {
				$('.lb-pop').remove();
			});
		}
	};

	$.fn.lbform = function() {
		//创建Beautifier的实体
		var lbForm = new lbform(this);
		//调用其方法
		return this;
	};

	function ms(a, s) {
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
		if(s) {
			if($(a).next('.lb-msg').length > 0) $(a).next('.lb-msg').remove();
			$(a).after(f.join(''));
			$(a).parents('.lb-form').addClass('error');
		}
	}
	
	function t(a, b) {
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
		var s = $(a).attr('lb-msg'), k = $(a).attr('lb-msg-num'), r = $(a).attr('lb-msg-gule'), rw;
		if(b == "INPUT") {
			var v = $(a).val(), t = $(a).attr('lb-msg-type');
			if(v == "") {
				ms(a,s);
			} else {
				var m, rm;
				if(k) {
					var sk = k.split(","), sk1 = sk[0], sk2 = sk[1];
					if(v.length>sk2 || v.length<sk1) {
						m = '请输入'+sk1+'到'+sk2+'个字符';
						ms(a,m);
					}
				}
				if(r) {
					rw = eval("("+r+")");
					m = rw.tip;
					rm = eval("("+rw.gule+")");
					if(!rm.test(v)) ms(a,m);
				}
			}
		}
		if(b == "SELECT") {
			var index = $(a).find('option:selected').index(), m;
			if(index == 0) {
				m = $(a).attr('lb-msg');
				ms(a,m);
			}
		}
	}

	function lbMsgTip(a,b) {
		if($(a).attr('lb-msg-tip') == "true") {//判断是否需要提示
			t(a,b);
		}
	}

	/* 暴露给外部调用tip */
	$.fn.lbform.tip = function(a) {
		var type = a[0].tagName;
		t(a,type);
	}

})(jQuery, window , document);