import 'package:flutter/material.dart';


class NotFound extends StatefulWidget{
  NotFound({Key? key}) : super(key: key);

  @override
  _NotFoundState createState()=>_NotFoundState();

}


class _NotFoundState extends State<NotFound>{
  @override
  Widget build(BuildContext context){
    return Center(
      child: Text('NotFound'),
    );

  }
}
