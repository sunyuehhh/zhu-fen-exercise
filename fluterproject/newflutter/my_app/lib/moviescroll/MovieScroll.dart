import 'package:flutter/material.dart';

class MovieScroll extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    final List imgList=[
      'images/1.jpg',
      'images/2.jpg',
      'images/3.jpg',
      'images/4.jpg',
      'images/5.jpg',
    ];
    // TODO: implement build
    // 一个排列的组件盒子  可以横向排列 可以纵向排列
    return Scaffold(
      body: Center(
        child: Container(
          height: 203,
          child:
          ListView(
            scrollDirection: Axis.horizontal,
            children: <Widget>[
              _ImgItem(url:imgList[0]),
              _ImgItem(url:imgList[1]),
              _ImgItem(url:imgList[2]),
              _ImgItem(url:imgList[3]),
              _ImgItem(url:imgList[4]),

            ],

          ),
        )
      ),
    );
  }

}


class _ImgItem extends StatelessWidget{
  _ImgItem({Key? key, required this.url}) : super(key: key);
  final String url;
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Container(
      width: 135,
      child:
      Image.asset(
        '$url',
        fit: BoxFit.cover,
      ),
    );
  }
}


// ListView 和 ListView.builder
// 它会不停的进行排版 不会有益处 可以用滚动条滑动

// 和Column 和Row 的排版上的简单区别
// 会溢出  类似于一个盒子 横着放或者纵这放 放多了益处
