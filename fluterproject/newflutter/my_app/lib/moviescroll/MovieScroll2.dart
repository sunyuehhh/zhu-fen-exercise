import 'package:flutter/material.dart';
import './Detail.dart';

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
            //     这个是一个对数组进行遍历  然后再渲染的组件
            ListView.builder(
              // 横向排版
              scrollDirection: Axis.horizontal,
                itemBuilder: (BuildContext context,int index){
            //   传递一个回调函数,返回值是一个组件,一个系统提供的上下文context 一个index(索引),我们每次遍历到当前项的索引值
              var _item=imgList[index];
              return _ImgItem(url:_item);
            },itemCount: imgList.length),
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
    // 如果我们需要再我们的组件上添加事件 那么我们就调用一个组件

    // 我们可以把事件添加再GestureDetector
    return GestureDetector(
      onTap: (){
        //  Navigator.of(context).push  是我们路由跳转的方法
        // MaterialPageRoute 相当于路由组件 是material库为我们提供的
        //  build 传递一个函数  返回值是我们需要跳转到的组件
        Navigator.of(context).push(MaterialPageRoute(builder: (BuildContext context){
          return Detail(url:url);
        })).then((val){
          print(val);

        });
      },
      child: Container(
        width: 135,
        child:
        Image.asset(
          '$url',
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}

