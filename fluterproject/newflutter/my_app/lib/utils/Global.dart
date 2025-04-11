import 'package:fluro/fluro.dart';
import 'package:flutter/material.dart';
import '../api/API.dart';

class G{
  // 导航唯一key
  static final GlobalKey<NavigatorState> navigatorKey=GlobalKey();

  // 获取构建上下文
  static BuildContext? getCurrentContext() => navigatorKey.currentContext;
  // 路由
  static late  FluroRouter router;

//   初始化API
static final API api=API();



// 解析Dart 对象到字符串
static parseQuery({Map<String,dynamic>? params}){
  String query="";
  if(params!=null){
    int index=0;
    for(String key in params.keys){
      final String value=Uri.encodeComponent(params[key].toString());
      if(index==0){
        query="?";
      }else{
        query=query+'&';
      }
      query+="$key=$value";
      index++;
    }
  }

  return query;

}
}
