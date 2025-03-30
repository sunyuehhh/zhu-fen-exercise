import 'package:flutter/material.dart';

class SelfText extends StatelessWidget{
  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(),
      // 一般来说 我们需要自定义一些组件 图片  文本之类的
      body: Center(
        child: Text('hello flutterhello flutterhello flutterhello flutterhello flutterhello flutter',
        style:TextStyle(
          fontSize: 20.0,
          // color:Colors.red
          color: Color.fromARGB(255, 0, 255, 0),
          fontWeight: FontWeight.w700
        ),
        overflow: TextOverflow.ellipsis,
        maxLines: 1,),

      ),
    );
  }
}
