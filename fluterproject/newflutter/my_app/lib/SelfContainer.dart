import 'package:flutter/material.dart';

class SelfContainer extends StatelessWidget{
  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(),
      // 盒子容器
      //   Container 的child可以传递任何组件
      //   系统的组件不支持传值 我们就在外面套上一个Container盒子
      body:Container(
        decoration: BoxDecoration(
        //   可以传递背景色  背景图 边框
          color:Colors.red,
        ),
        width: 100,
        height: 100,
        margin: EdgeInsets.all(30),
        padding: EdgeInsets.all(20),

      )
    );
  }
}
