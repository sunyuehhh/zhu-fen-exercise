// 引入material组件库  里面  规定了很多组件，我们可以直接引用
// 还 规定了移动端界面UI渲染的一些规范
import 'package:fluro/fluro.dart';
import 'package:flutter/material.dart';
import './SelfText.dart';
import './SelfContainer.dart';
import './SelfImage.dart';
import './increase/increase.dart';
import './lakes/Lakes.dart';
import './moviescroll/MovieScroll2.dart';
import 'moviescroll/Detail.dart';
import './pages/index.dart';
import './routes/Routes.dart';
import './utils/Global.dart';
import 'package:provider/provider.dart';
import 'providers/CurrentIndexProvider.dart';
import 'providers/UserProvider.dart';


// 请求数据
import 'http/SelfHttp.dart';

void main(){
  // 初始化路由
  FluroRouter router=new FluroRouter();
  Routes.configureRoutes(router);
  // 初始化后的路由  放到全局组件
  G.router=router;
  return runApp(
    MultiProvider(providers: [
      ChangeNotifierProvider.value(value: new CurrentIndexProvider()),
      ChangeNotifierProvider.value(value: UserProvider()),
    //   若干个provider
    ],
    child: MyApp(),)
  );
}

class MyApp extends StatelessWidget{
  @override
  Widget build(BuildContext context){
    return MaterialApp(
      navigatorKey: G.navigatorKey,
      title:'app',
      theme: ThemeData(
        primarySwatch: Colors.blue
      ),
    //   拉钩
    //   home: Index(),
      onGenerateRoute: G.router.generator,
      initialRoute: '/',

    );

  }
}

//Column  纵向排版
//Row   横向排版
//  它们两个都会有一个属性  children ,后面跟一个数组，里面的每一项都是一个Widget组件
