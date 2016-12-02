# lbforms

## 功能
- 创建一个整洁的表单
- 表单自适应
- 上传图片
- 验证
- 输入下拉

## 演示页面  [demo](http://xiaoyaoge.me/lbforms/demo.html)

## 使用方法
1.页面引入资源
``` bash
<link rel="stylesheet" type="text/css" href="css/uploadify.css"><!--上传图片需引入-->
<link rel="stylesheet" href="css/lbform.css">
<script src="js/jquery.js"></script><!-- jquery  -->
<script src="js/jquery.uploadify.min.js"></script><!-- 上传图片需引入 -->
<script src="js/lb.form.js"></script><!-- 表格插件 -->
<script src="http://my97.net/dp/My97DatePicker/WdatePicker.js"></script><!-- 日期需引入 -->
```
2.html
``` bash
<div class="form">
  <ul class="fn-clear">
    <li class="fn-left">
      <label><em>*</em>名称</label>
      <input type="text" class="lb-input" data-tip ="true" date-type="name" data-msg = "请填写名称">
    </li>
    <li class="fn-left">
      <label>选项</label>
      <select class="lb-input" data-tip ="true"  data-msg = "请选择">
        <option value="0">全部</option>
        <option value="1">选项1</option>
        <option value="2">选项2</option>
      </select>
    </li>
    <li class="fn-left">
      <label><em>*</em>日期</label>
      <input type="text" class="Wdate lb-input"  readonly="true" data-type="date" onclick="WdatePicker()" data-msg = "请选择日期">
    </li>
    <li class="fn-left">
      <label>数量</label>
      <button class="button">取消</button>
      <button class="button">确定</button>
      <input type="number" class="lb-input" data-tip ="true" data-type="number" >
    </li>
    <li class="fn-left">
      <label>图片</label>
      <input type="file" data-file = 'true' class="lb-input" id="upload">
    </li>
    <li class="fn-left">
      <label>可输入选项</label>
      <input type="text" class="lb-input" data-msg = "请选择或输入"  value="" data-select="{'id':'0','value':'全部'};{'id':'1','value':'选项1'};{'id':'2','value':'选项2'}">
    </li>
  </ul>
  <ul  class="fn-clear">
    <li class="fn-clear">
      <label><em>*</em>姓名</label>
      <input type="text" class="lb-input" data-tip ="true"  data-msg = "请输入姓名">
    </li>
    <li class="fn-clear">
      <label>邮箱</label>
      <button class="button">确定</button>
      <input type="text" class="lb-input" data-type="mail" data-tip ="true" data-msg = "请输入邮箱">
    </li>
    <li class="fn-clear">
      <label>电话</label>
      <input type="text" class="lb-input" data-type="tel" data-tip ="true" data-msg = "请输入手机号">
    </li>
    <li class="fn-clear">
      <label>上传文件</label>
      <input type="file" data-file = 'true' class="lb-input" id="upload2" data-msg = "请上传文件" data-btn ="upload">
    </li>
    <li class="fn-clear">
      <label>地址</label>
      <input type="text" class="lb-input" data-msg = "请选择或输入地址"  value="" data-select="{'id':'0','value':'全部'};{'id':'1','value':'选项1'};{'id':'2','value':'选项2'}">
    </li>
  </ul>
  <button class="save">保存</button>
</div>
```
3.使用lbforms
``` bash
<script>
  $(function(){
    $('.lb-input').lbform({});
    $('.save').bind('click',function(){
      $('.lb-input').each(function(){
        $(this).lbform.tip($(this));
      });
    });

  });
</script>
```
