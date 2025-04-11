import 'package:dio/dio.dart';

class AdAPI{
  final Dio _dio;

  AdAPI(this._dio);

//   广告列表 = 首页
Future<dynamic> adList({ String spaceKeys = '999'}) async {
  Response res=await _dio.get('/front/ad/getAllAds',queryParameters: {
    "spaceKeys":spaceKeys
  });

  print(res.data);

}


// 课程详情
Future<dynamic> courseDetail({required int id}) async{
  Response res=await _dio.get('/front/course/getCourseById',queryParameters: {
    'courseId':id
  });

  List target=res.data['content'];
  return target;

}



}
