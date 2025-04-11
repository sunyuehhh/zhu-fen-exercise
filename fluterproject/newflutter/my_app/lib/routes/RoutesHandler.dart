import 'package:flutter/material.dart';
import 'package:fluro/fluro.dart';
import '../pages/index.dart';
import '../pages/user/Login.dart';
import '../pages/notfound/NotFound.dart';
import '../pages/course/CourseDetail.dart';
import '../pages/mine/Profile.dart';


// 编辑个人信息
var profileHandler=Handler(handlerFunc: (BuildContext? context,Map<String,List<String>> params){
  return Profile();

});

// 空页面
var notfoundHandler=Handler(handlerFunc: (BuildContext? context,Map<String,List<String>> params){
  return NotFound();

});

// 首页
var indexHandler=Handler(handlerFunc: (BuildContext? context,Map<String,List<String>> params){
  return Index();

});

//登录页
var loginHandler=Handler(handlerFunc: (BuildContext? context,Map<String,List<String>> params){
  return Login();

});


//课程详情
var courseDetailHandler = Handler(handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  // 确保 'id' 和 'title' 参数存在才进行访问
  // id  后面是个list类型
  String idParam = params['id']?.first ?? ''; // 获取 'id' 的第一个值，如果没有则默认为空字符串
  String titleParam = params['title']?.first ?? ''; // 获取 'title' 的第一个值，如果没有则默认为空字符串

  // 解析 id 并返回 CourseDetail 小部件
  return CourseDetail(
    id: int.tryParse(idParam) ?? 0, // 安全解析 'id'，如果解析失败则默认为 0
    title: titleParam, // 直接使用 'title' 参数
  );
});
