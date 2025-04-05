import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
class SelfHttp extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState

    return _SelfHttpState();
  }
}



class _SelfHttpState extends State<SelfHttp>{
  @override
  void initState(){
    getMovieList();
    super.initState();
  }
  void getMovieList(){
    try{
      Dio dio=Dio();

      dio.get('/sunyue').then((res){
        print(res);
      });

    }catch(err){
      print('$err');

    }

  }


  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      appBar: AppBar(),
    );
  }
}
