# lbforms

## 功能
- 创建一个整洁的表单
- 表单自适应
- 上传图片
- 验证
- 输入下拉

## 演示页面  [demo](http://xiaoyaoge.me/lbforms/demo.html)

## 使用方法
#### 1.页面引入资源
``` bash
<link rel="stylesheet" type="text/css" href="css/uploadify.css"><!--上传需引入-->
<link rel="stylesheet" href="css/lbform.css">
<script src="js/jquery.js"></script><!-- jquery  -->
<script src="js/jquery.uploadify.min.js"></script><!-- 上传图片需引入 -->
<script src="js/lb.form.js"></script><!-- 表格插件 -->
<script src="js/My97DatePicker/WdatePicker.js"></script><!-- 日期需引入 -->
```
#### 2.html
``` bash
<div class="form">
<ul class="fn-clear">
	<li class="fn-left">
		<label><em>*</em>名称</label>
		<input type="text" class="lb-input" lb-msg-tip ="true" lb-msg-gule="{'gule':'/^[\u4E00-\u9FA5]+$/','tip':'请输入文字'}" lb-msg = "请填写名称" lb-msg-num="0,10"  placeholder="填写名称">
	</li>
	<li class="fn-left">
		<label>选项</label>
		<select class="lb-input" lb-msg-tip ="true"  lb-msg = "请选择">
			<option value="0">全部</option>
			<option value="1">选项1</option>
			<option value="2">选项2</option>
		</select>
	</li>
	<li class="fn-left">
		<label><em>*</em>日期</label>
		<input type="text" class="Wdate lb-input"  readonly="true" onclick="WdatePicker({onpicking:function(){$(this).parents('.lb-form').removeClass('error');$(this).next('.lb-msg').hide();}})" placeholder="点击选择日期" lb-msg = "请选择日期">
	</li>
	<li class="fn-left">
		<label>数量</label>
		<button class="button">取消</button>
		<button class="button">确定</button>
		<input type="text" class="lb-input" lb-msg-tip ="true" b-msg-gule="{'gule':'/^[0-9]*$/','tip':'请输入数字'}"  lb-msg = "请输入数量" placeholder="数量">
	</li>
	<li class="fn-left">
		<label>图片</label>
		<input type="file" lb-upload-set="{'btn':'选择图片','type':'img','number':'1','limit':'1000KB'}" class="lb-input" id="upload" placeholder="上传一张图片,不超过1000KB">
	</li>
	<li class="fn-left">
		<label>可输入选项</label>
		<input type="text" class="lb-input" lb-msg = "请选择或输入"  value="" lb-select="{'id':'0','value':'全部'};{'id':'1','value':'选项1'};{'id':'2','value':'选项2'}">
	</li>
</ul>
<ul class="fn-clear">
	<li class="fn-clear">
		<label><em>*</em>姓名</label>
		<input type="text" class="lb-input" lb-msg-tip ="true"  lb-msg = "请输入姓名" lb-msg-gule="{'gule':' /^[\u4E00-\u9FA5]+$/','tip':'请输入文字'}">
	</li>
	<li class="fn-clear">
		<label><em>*</em>日期</label>
		<input type="text" class="Wdate lb-input"  readonly="true" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',onpicking:function(){$(this).parents('.lb-form').removeClass('error');$(this).next('.lb-msg').hide();}})" placeholder="点击选择日期" lb-msg = "请选择日期">
	</li>
	<li class="fn-clear">
		<label>邮箱</label>
		<button class="button">确定</button>
		<input type="text" class="lb-input" lb-msg-gule="{'gule':'/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/','tip':'邮箱格式错误'}"  lb-msg-tip ="true" lb-msg = "请输入邮箱">
	</li>
	<li class="fn-clear">
		<label>电话</label>
		<input type="text" class="lb-input" lb-msg-gule="{'gule':'/^0?1[3|4|5|8][0-9]\d{8}$/','tip':'请输正确手机号'}" lb-msg-tip ="true" lb-msg = "请输入手机号">
	</li>
	<li class="fn-clear">
		<label>上传文件</label>
		<input type="file" lb-upload-set="true" class="lb-input" id="upload3" placeholder="上传文件,不超过1000KB">
	</li>
	<li class="fn-clear">
		<label>上传文件</label>
		<input type="file" class="lb-input" id="upload2"  lb-upload-set="{'btn':'选择文件','type':'file','number':'3','limit':'1000KB'}" lb-msg = "请上传文件"  placeholder="上传最多3个文件">
	</li>
	<li class="fn-clear">
		<label>地址</label>
		<input type="text" class="lb-input" lb-msg = "请选择或输入地址"  value="" lb-select="{'id':'0','value':'全部'};{'id':'1','value':'选项1'};{'id':'2','value':'选项2'}">
	</li>
</ul>
<button class="save">保存</button>
</div>
```
#### 3.使用lbforms
``` bash
<script>
  $(function(){
    $('.lb-input').lbform({});/*使用lbforms插件*/
    $('.save').bind('click',function(){//点击保存按钮时，调用tip函数做验证判断
        $('.lb-input').each(function(){
        $(this).lbform.tip($(this));
      });
    });
  });
</script>
```

## 设置说明
<table width="100%">
  <tr>
    <th>lb-msg</th>
    <td>当input的值为空时的提示语</td>
    <td>string</td>
  </tr>
  <tr>
    <th>lb-msg-tip</th>
    <td>是否当离开input时显示提示语</td>
    <td>true,false</td>
  </tr>
  <tr>
    <th>lb-msg-num</th>
    <td>验证input类型输入文字的个数</td>
    <td>"0,10"</td>
  </tr>
  <tr>
    <th>lb-msg-gule</th>
    <td>自定义验证input</td>
    <td>"{'gule':' /^[\u4E00-\u9FA5]+$/','tip':'请输入文字'}"</td>
  </tr>
  <tr>
    <th>lb-upload-set</th>
    <td>设置上传控件</td>
    <td>{'btn':'选择文件','type':'file','number':'3','limit':'1000KB'} btn：按钮名称，type：文件类型，numer：上传文件数量限制，limit：上传文件资源限制</td>
  </tr>
  <tr>
    <th>lb-select</th>
    <td>下拉输入类型input</td>
    <td>{'id':'0','value':'全部'};{'id':'1','value':'选项1'};{'id':'2','value':'选项2'}</td>
  </tr>
</table>
