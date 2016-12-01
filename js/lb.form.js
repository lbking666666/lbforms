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
	var bodyWidth = $(window).outerWidth(true);
	function lbTip(a,msg){//添加提示
		var c = [];
		c.push(
			'<div class="lb-msg">',
			'<i class="lb-msg-arrow"></i>',
			'<i class="lb-msg-arrow-border"></i>',
			'<div class="lb-msg-con">'+msg+'</div>',
			'</div>'
		);
		var b = $(a).attr('data-msg');
		if(b){
			//判断如果存在提示则显示，否则添加提示
			if($(a).next('.lb-msg').length > 0){
				$(a).next('.lb-msg').remove();
			}
			$(a).after(c.join(''));
			//给边框添加错误颜色
			$(a).parents('.lb-form').addClass('error');
		}
		
		
	}
	lbform.prototype = {
		/**
			@a:当前的容器
			@b:传入进来的参数
		**/
		_init : function(a){
			var that = this;
			for(var i = 0; i<a.length; i++){
				this._html(a[i]);
			}
			for(var i = 0;i<a.length;i++){
				var b = $(a[i]).parents('.lb-form').parent().width();
				if($(window).outerWidth(true)%2 != 0){
					var b = b-1
				}
				this._layout(a[i],b);
			}
			$(window).resize(function(){
				for(var i = 0;i<a.length;i++){
					var b = parseFloat($(a[i]).parents('.lb-form').parent().width());
					if($(window).outerWidth(true)%2 != 0){
						var b = b-1
					}
					that._layout(a[i],b);
				}
			});
		},
		_html : function(a){
			var that = this;
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
					var p = g.join('');
					$(a).parents('.lb-form').append(p);
					that._select(a);
				}
				if($(a).attr('data-file')){//判断是否上传
					var b = $(a).clone();
					$(a).parents('.lb-form').append(b);
					$(a).attr('type','hide');
					$(a).removeAttr('id');
					that._uploadfile(a,b);
				}
				that._blurEvent(a);
			}
			if(type == "SELECT"){
				that._choose(a);
			}
		},
		_layout : function(a,b){
			var c = $(a).parents('.lb-form').siblings().not('.lb-file');
			var d = 0;
			if(c.length > 1){
				for(var i = 0; i < c.length; i++){
					d += parseInt(c.eq(i).outerWidth(true));
				}	
			}else{
				d = parseInt(c.outerWidth(true));
			}
			var width = b - d - 2;
			$(a).parents('.lb-form').css({"width":width});
		},
		_blurEvent:function(a){//input 点击事件
			var b = this;
			$(a).bind('blur',function(){
				if($(a).attr('data-tip') == "true"){//判断是否需要提示
					var val = $(a).val();
					if(val == ""){
						var msg = $(a).attr('data-msg');
						lbTip(a,msg);
					}else{
						var gulestr = {
					        mobile : /^0?1[3|4|5|8][0-9]\d{8}$/,//手机
					        mail:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,//邮箱
					        name : /^[a-z0-9_-]{3,16}$/,//用户名
					        tel : /^0[\d]{2,3}-[\d]{7,8}$///电话号
					    }
					    var type = $(a).attr('data-type')
						if(type == 'tel'){
							if(!gulestr.mobile.test(val)){
								var msg = '请输入正确手机号！';
								lbTip(a,msg);
							}
						}
					}
					b._keyDownEvent(a);
				}
			})
		},
		_keyDownEvent:function(a){
			$(a).bind('keydown',function(){
				$(this).parents('.lb-form').removeClass('error');
				$(this).next('.lb-msg').hide();
			});
		},
		_choose:function(a){//select 点击事件
			$(a).bind('change',function(){
				var index = $(this).find('option:selected').index();
				if(index == 0){
					if($(this).attr('data-tip') == "true")lbTip(a);
				}else{
					$(this).parents('.lb-form').removeClass('error');
					$(this).next('.lb-msg').hide();
				}
			});
		},
		_select:function(a){
			$(a).bind('click',function(event){
				var that = $(this);
				var b = $(this).next('.lb-input-select-list');
				var bodyHeight = $(window).height();
				var top = $(this).offset().top + 31;
				var height = b.find('li').length *23;
				((bodyHeight - top)< height)?(b.css("top",-height)):(b.css("top","31px"));
				$(document).bind('click',function(){
					b.hide();
				});
				that.bind('keydown',function(){
					b.hide();
				});
				b.toggle();
				b.find('li').bind('click',function() {
					var d = $(this).html();
					that.val(d);
					b.hide();
				});
				event.stopPropagation();
			});
		},
		_uploadfile:function(a,b){
			var uploadUrl = 'http://xiaoyaoge.me/lbforms/upload/'; 
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
					$(a).attr('value',uploadUrl+file.name);
					var d = $('#' + file.id).parents('.lb-form');
					d.each(function(){
						$(this).find('.lb-file-name').bind('click',function(){
							var pop = [];
							pop.push('<div class="lb-pop"><div class="lb-pop-con"><span class="lb-pop-close"></span><img class="lb-file" src="'+uploadUrl+file.name+'"/></div><div class="lb-pop-bg"></div></div>');
							if($('body').find('.lb-pop')){
								$('.lb-pop').remove();
							}
							$('body').append(pop.join(''));
							$('.lb-pop').show(500);
							setTimeout(function(){
								var top = -($('.lb-pop-con').height()/2);
								$('.lb-pop-con').css('marginTop',top);
							}, 50);
							$('.lb-pop-close').bind('click',function(){
								$('.lb-pop').hide(500);
								setTimeout(function(){
									$('.lb-pop').remove();
								}, 1000);
								
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
	$.fn.lbform.tip = function(a){
		var type = a[0].tagName;
		if(type == "INPUT"){
		    var val = $(a).val();
			if(val == ""){
				var msg = $(a).attr('data-msg');
				lbTip(a,msg);
			}else{
				var gulestr = {
			        tel : /^0?1[3|4|5|8][0-9]\d{8}$/,//手机
			        mail:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,//邮箱
			        name : /^[a-z0-9_-]{3,16}$///用户名
			    }
			    var type = $(a).attr('data-type');
				switch (type){
					case 'name':
						if(!gulestr.name.test(val)){
							var msg = '请输入正确名称！';
							lbTip(a,msg);
						}
						break;
					case 'tel':
						if(!gulestr.tel.test(val)){
							var msg = '请输入正确手机号！';
							lbTip(a,msg);
						}
						break;
					case 'mail':
						if(!gulestr.mail.test(val)){
							var msg = '请输入正确邮箱！';
							lbTip(a,msg);
						}
						break;

				}
			}
			$(a).bind('keydown',function(){
				$(this).parents('.lb-form').removeClass('error');
				$(this).next('.lb-msg').hide();
			});
		}else if(type == "SELECT"){
			var index = $(a).find('option:selected').index();
			if(index == 0){
				var msg = $(a).attr('data-msg');
				lbTip(a,msg);
			}
			$(a).bind('change',function(){
				$(this).parents('.lb-form').removeClass('error');
				$(this).next('.lb-msg').hide();
			});
		}
	}
	//参数设置
	$.fn.lbform.defaults = {}
})(jQuery, window , document);