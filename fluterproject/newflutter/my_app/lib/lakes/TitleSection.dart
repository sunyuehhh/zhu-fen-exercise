import 'package:flutter/material.dart';

class Titlesection extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Container(
      padding: EdgeInsets.all(20),
      margin: EdgeInsets.only(bottom: 10),
      child:
      Row(
        children: <Widget>[
          // 弹性布局
          Expanded(child:
          Column(
            // 主轴  和  副轴
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Padding(padding: EdgeInsets.only(bottom: 5),child:
              Text('Oeschildren Lake Campground',style: TextStyle(
                  fontWeight: FontWeight.w700
              ),),),
              Text('Kandersteg,Switzerland',style: TextStyle(
                color: Colors.grey
              ),)
            ],
          )),
          //   中  星星
          Icon(Icons.star,color: Colors.red,),
          Text('41')
        ],
      ),
    );
  }

}
