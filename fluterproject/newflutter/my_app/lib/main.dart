// 引入material组件库  里面  规定了很多组件，我们可以直接引用
// 还 规定了移动端界面UI渲染的一些规范
import 'package:flutter/material.dart';
import './SelfText.dart';
import './SelfContainer.dart';
import './SelfImage.dart';
import './increase/increase.dart';
import './lakes/Lakes.dart';

void main()=>runApp(MyApp());

class MyApp extends StatelessWidget{
  @override
  Widget build(BuildContext context){
    return MaterialApp(
      title:'app',
      theme: ThemeData(
        primarySwatch: Colors.blue
      ),
      // home:SelfText()

      // home:SelfContainer()
      // home: SelfImage(),
      // home:Increase(title:'increase1'),
      home: Lakes(),
    );

  }
}

//Column  纵向排版
//Row   横向排版
//  它们两个都会有一个属性  children ,后面跟一个数组，里面的每一项都是一个Widget组件
