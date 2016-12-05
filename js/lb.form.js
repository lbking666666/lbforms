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
						var b = $(a[i]).parents('.lb-form').parent().width();
						if($(window).outerWidth(true)%2 != 0) var b = b-1
						c._g(a[i],b);
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
						如果为下拉输入框，则把data-select的值转化为ul>li形式插入到input之后,添加select事件函数;
						如果为上传文件，则复制当前input，去掉当前input的id，类型改变为hide，把复制后的b使用uploadfiy插件；
					2.SELECT:
						添加change事件	
			***/
			var c = this;
			var type = a.tagName;
			var f = $('<div class="lb-form" style="float:right"></div>');
			$(a).wrap(f);
			if(type == "INPUT"){
				if($(a).attr('data-select')){
					var g = [];
					var h = $(a).attr('data-select').split(';');
					g.push('<ul class="lb-input-select-list">');
					for(var i = 0; i<h.length;i++){
						var obj = eval("("+h[i]+")")
						g.push('<li id="'+obj.id+'">'+obj.value+'</li>')
					}
					g.push('</ul>');
					$(a).parents('.lb-form').append(g.join(''));
					c._select(a);
				}
				if($(a).attr('data-file')){
					var b = $(a).clone();
					$(a).parents('.lb-form').append(b);
					var ft = $(a).attr('placeholder');
					$(a).parents('.lb-form').append('<span class="lb-file-tip">'+ft+'</span>')
					$(a).attr('type','hide');
					$(a).removeAttr('id');
					c._uploadfile(a,b);
				}
				c._blurEvent(a,type);
			}
			if(type == "SELECT"){
				c._changeEvent(a,type);
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
			var d = 0;
			if(c.length > 1){
				for(var i = 0; i < c.length; i++){
					d += parseInt(c.eq(i).outerWidth(true));
				}	
			}else{
				d = parseInt(c.outerWidth(true));
			}
			var w = b - d - 2;
			$(a).parents('.lb-form').css({"width":w});
		},
		_blurEvent:function(a,b){//input光标离开时事件
			$(a).bind('blur',function(){
				if($(a).attr('data-tip') == "true"){//判断是否需要提示
					t(a,b);
				}
			})
		},
		_changeEvent:function(a,b){//select下拉选择事件
			$(a).bind('change',function(){
				if($(a).attr('data-tip') == "true"){//判断是否需要提示
					t(a,b);
				}
			});
		},
		_select:function(a){//模拟下拉
			$(a).bind('click',function(event){
				var c = $(this);
				var b = $(this).next('.lb-input-select-list');
				var bh = $(window).height();
				var t = $(this).offset().top + 31;
				var h = b.find('li').length *23;
				((bh - t)< h)?(b.css("top",-h)):(b.css("top","31px"));
				$(document).bind('click',function(){
					b.hide();
				});
				c.bind('keydown',function(){
					b.hide();
				});
				b.toggle();
				b.find('li').bind('click',function() {
					var d = $(this).html();
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
			function getNowFormatDate() {//获得日期格式为20161202的日期
			    var date = new Date();
			    var s = "";
			    var mh = date.getMonth() + 1;
			    var sd = date.getDate();
			    if (mh >= 1 && mh <= 9) {
			        mh = "0" + mh;
			    }
			    if (sd >= 0 && sd <= 9) {
			        sd = "0" + sd;
			    }
			    var cd = date.getFullYear() + s + mh + s + sd;
			    return cd;
			}

			var bn = $(a).attr('data-btname')|| "上传图片";
			var y = $(a).attr('data-upType');
			var n = $(a).attr('data-upnumber');
			var u = 'http://xiaoyaoge.me/lbforms/upload/'+getNowFormatDate();//文件路径
			if(y == "img"){
				var d = 'Image Files';
				var x = '*.gif; *.jpg; *.png; *.jpeg';
			}else{
				var d = 'All Files';
				var x = '*';
			}
			if(n=="1"){
				var m = false;
			}else{
				var m = true;
			}
			$(b).uploadify({
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
		            if($('body').find('.lb-pop')){
						$('.lb-pop').remove();
					}
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
			});
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
			@s: 当前input的data-msg
				创建提示信息结构
				判断当前input是否存在data-msg
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
					为空显示data-msg提示信息;
					不为空查看input的data-type用正则判断;
					如果不符合显示验证信息;
					再次输入时隐藏掉错误提示.
				2.SELECT:
					判断当前被选中的是否为初始选项;
					为初始值显示提示信息;
					再次选择时隐藏提示信息.

		***/
		var s = $(a).attr('data-msg');
		if(b == "INPUT"){
			var v = $(a).val();
			var t = $(a).attr('data-type');
			var g = {
		        tel : /^0?1[3|4|5|8][0-9]\d{8}$/,//手机
		        mail:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,//邮箱
		        name : /^[a-z0-9_-]{3,16}$///用户名
		    }
			if(v == ""){
				ms(a,s);
			}else{
				switch (t){
					case 'name':
						var m = '请输入正确名称！';
						if(!g.name.test(v)) ms(a,m);
						break;
					case 'tel':
						var m = '请输入正确手机号！';
						if(!g.tel.test(v)) ms(a,m);
						break;
					case 'mail':
						var m = '请输入正确邮箱！';
						if(!g.mail.test(v)) ms(a,m);
						break;
				}
			}
			$(a).bind('keydown',function(){
				$(this).parents('.lb-form').removeClass('error');
				$(this).next('.lb-msg').hide();
			});
		}
		if(b == "SELECT"){
			var index = $(a).find('option:selected').index();
			if(index == 0){
				var m = $(a).attr('data-msg');
				ms(a,m);
			}
			$(a).bind('change',function(){
				$(this).parents('.lb-form').removeClass('error');
				$(this).next('.lb-msg').hide();
			});
		}
	}

	/* 暴露给外部调用tip */
	$.fn.lbform.tip = function(a){
		var type = a[0].tagName;
		t(a,type);
	}

})(jQuery, window , document);