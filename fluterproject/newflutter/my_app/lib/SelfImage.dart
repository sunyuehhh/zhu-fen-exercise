import 'package:flutter/material.dart';

class SelfImage extends StatelessWidget{
  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(),
      body: Container(
        width: 200,
        height: 100,
        // 我们在里面添加版 一个是网络图片 一个是本地图片
        child: Image(
          // 图片的扩展方式
          fit: BoxFit.cover,
          // image: NetworkImage('https://www.baidu.com/img/flexible/logo/pc/result.png'),
          image: AssetImage('images/baidu.png'),
        ),
      ),
    );
  }
}
