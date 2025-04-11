import 'package:dio/dio.dart';
import 'initDio.dart';
import 'AdAPI.dart';

class API{
  Dio _dio;


  // API(){
  //   _dio=initDio();
  //
  // }

  API():_dio=initDio();

//   广告接口
AdAPI get ad=>AdAPI(_dio);
//   课程接口

// 用户接口

}
