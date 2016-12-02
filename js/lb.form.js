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
			var c = this;
			var type = a.tagName;
			var f = $('<div class="lb-form" style="float:right"></div>');
			$(a).wrap(f);
			if(type == "INPUT"){
				if($(a).attr('data-select')){//判断是否转化为下拉输入框
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
				if($(a).attr('data-file')){//判断是否上传
					var b = $(a).clone();
					$(a).parents('.lb-form').append(b);
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
		_blurEvent:function(a,b){//input 点击事件
			$(a).bind('blur',function(){
				if($(a).attr('data-tip') == "true"){//判断是否需要提示
					t(a,b);
				}
			})
		},
		_changeEvent:function(a,b){//select 点击事件
			$(a).bind('change',function(){
				if($(a).attr('data-tip') == "true"){//判断是否需要提示
					t(a,b);
				}
			});
		},
		_select:function(a){
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
			function getNowFormatDate() {
			    var date = new Date();
			    var seperator1 = "";
			    var month = date.getMonth() + 1;
			    var strDate = date.getDate();
			    if (month >= 1 && month <= 9) {
			        month = "0" + month;
			    }
			    if (strDate >= 0 && strDate <= 9) {
			        strDate = "0" + strDate;
			    }
			    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
			    return currentdate;
			}
			var u = 'http://xiaoyaoge.me/lbforms/upload/'+getNowFormatDate(); 
			$(b).uploadify({
				'swf'      : 'js/uploadify.swf',
				'uploader' : 'js/uploadify.php',
				'onUploadSuccess' : function(file, data, response) {
					$('#' + file.id).find('.data').html(' 上传完毕');
					var link = $('<span class="lb-file-name">'+file.name+'</span>');
					var b = $('#' + file.id).parents('.lb-form').find('span.lb-file-name');
					if(b){
						b.remove();
					}
					$('#' + file.id).parents('.lb-form').append(link);
					$(a).attr('value',u+file.name);
					var d = $('#' + file.id).parents('.lb-form');
					function hd(){
						$('.lb-pop').remove();
					}
					d.each(function(){
						$(this).find('.lb-file-name').bind('click',function(e){
							var p = [];
							p.push(
								'<div class="lb-pop">',
								'<div class="lb-pop-con">',
								'<span class="lb-pop-close"></span>',
								'<img class="lb-file" src="'+u+'/'+file.name+'"/>',
								'</div>',
								'<div class="lb-pop-bg"></div>',
								'</div>'
							);
							if($('body').find('.lb-pop')){
								$('.lb-pop').remove();
							}
							$('body').append(p.join(''));
							$('.lb-pop').show(500);
							setTimeout(function(){
								var mh = -($('.lb-file').height()/2);
								$('.lb-pop-con').css('marginTop',mh);
							}, 200);

							$('.lb-pop-close').bind('click',function(){
								$('.lb-pop').hide(500);
								setTimeout(hd(), 1000);
							});
							e.stopPropagation();
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
	function ms(a,s){//添加提示
		var f = [];
		f.push(
			'<div class="lb-msg">',
			'<i class="lb-msg-arrow"></i>',
			'<i class="lb-msg-arrow-border"></i>',
			'<div class="lb-msg-con">'+s+'</div>',
			'</div>'
		);
		var b = $(a).attr('data-msg');
		if(b){
			//判断如果存在提示则显示，否则添加提示
			if($(a).next('.lb-msg').length > 0){
				$(a).next('.lb-msg').remove();
			}
			$(a).after(f.join(''));
			//给边框添加错误颜色
			$(a).parents('.lb-form').addClass('error');
		}
	}
	function t(a,b){
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
	$.fn.lbform.tip = function(a){
		var type = a[0].tagName;
		t(a,type);
	}
})(jQuery, window , document);