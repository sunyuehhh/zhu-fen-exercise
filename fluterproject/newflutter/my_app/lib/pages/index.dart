import 'package:flutter/material.dart';
import 'home/Home.dart';
import 'study/Study.dart';
import 'mine/Mine.dart';
import 'package:provider/provider.dart';
import '../providers/CurrentIndexProvider.dart';

class Index extends StatefulWidget {
  // 使用 null 安全的 Key
  Index({Key? key}) : super(key: key);

  @override
  _IndexState createState() => _IndexState();
}

class _IndexState extends State<Index> {
  final List<BottomNavigationBarItem> bottomNavItems=[
    BottomNavigationBarItem(icon: Icon(Icons.home),backgroundColor: Colors.blue,label: '首页'),
    BottomNavigationBarItem(icon: Icon(Icons.message),backgroundColor: Colors.green,label: '学习'),
    BottomNavigationBarItem(icon: Icon(Icons.person),backgroundColor: Colors.red,label: '我'),
  ];

  final titles=[
    "拉钩教育",
    "学习中心",
    '我的'
  ];

  final pages=[
    Home(),
    Study(),
    Mine()
  ];

  // int currentIndex=0;





  @override
  Widget build(BuildContext context) {
    int curIndex=Provider.of<CurrentIndexProvider>(context).currentIndex;
    // 返回包含文本的容器
    return Scaffold(
      appBar: AppBar(
        title: Text('${titles[curIndex]}'),
        centerTitle: true,
        elevation: 0,
      ),
      bottomNavigationBar: BottomNavigationBar(items: bottomNavItems,currentIndex: curIndex,
      selectedItemColor: Colors.green,
      type: BottomNavigationBarType.fixed,
      onTap: (index){
        // setState(() {
        //   curIndex=index;
        // });

        Provider.of<CurrentIndexProvider>(context,listen: false).changeIndex(index);

      },),
      body: pages[curIndex],
    );
  }
}
