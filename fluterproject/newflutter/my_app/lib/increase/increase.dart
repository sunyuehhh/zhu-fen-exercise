import 'package:flutter/material.dart';

class Increase extends StatefulWidget {
  // 使用构造函数传递参数
  Increase({Key? key, required this.title}) : super(key: key);

  final String title; // 接收传递的标题

  @override
  _IncreaseState createState() => _IncreaseState();
}

class _IncreaseState extends State<Increase> {

  //  页面当中的数字需要增加  我们就定义一个状态值
  int _count=1;
  // 数字自增函数
  void _increaseCounter(){
    setState(() {
      _count++;
    });

  }







  @override
  Widget build(BuildContext context) {
    // 使用 widget.title 来访问传递的参数
    return Scaffold(appBar: AppBar(
      title:Text('${widget.title}')
    ),
    body: Center(
      // 从上到下排列组件的盒子
      child: Column(
        // 从上到下排列组件  这个是排列的方式
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Text('please press the button'),
          Text('$_count',
          style: TextStyle(
            fontSize: 30
          ),)
        ],
      ),
    ),
    floatingActionButton: FloatingActionButton(
      onPressed: _increaseCounter,
      // 提示信息
      tooltip: 'increase button',
      child: Icon(Icons.add),
    ),

    );
  }
}


