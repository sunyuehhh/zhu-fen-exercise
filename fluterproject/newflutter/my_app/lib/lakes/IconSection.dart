import 'package:flutter/material.dart';

class Iconsection extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: <Widget>[
        _IconItem(title:'CALL',icon: Icons.call,),
        _IconItem(title:'ROUTE',icon: Icons.near_me,),
        _IconItem(title:'SHARE',icon: Icons.share,),

      ],
    );
  }

}


class _IconItem extends StatelessWidget{
  _IconItem({Key? key, required this.icon, required this.title}) : super(key: key);
  final IconData icon;
  final String title;
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Container(
      child:
      Column(
        children: <Widget>[
         Padding(padding: EdgeInsets.only(bottom: 5),
         child:  Icon(icon,color:Colors.blue),),
          Text('$title',style: TextStyle(color: Colors.blue),)
        ],
      ),
    );
  }
}
