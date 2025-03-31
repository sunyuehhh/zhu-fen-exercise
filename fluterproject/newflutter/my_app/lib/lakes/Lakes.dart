import 'package:flutter/material.dart';
import './IconSection.dart';
import './TextSection.dart';
import './TitleSection.dart';

class Lakes extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      body: Column(
        children: <Widget>[
          Image(image: AssetImage('images/baidu.png')),
        //   第二部分
          Titlesection(),
          Iconsection(),
          Textsection()
        ],
      ),
    );
  }

}
