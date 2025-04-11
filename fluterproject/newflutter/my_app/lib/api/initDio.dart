import 'package:dio/dio.dart';
import 'package:my_app/providers/UserProvider.dart';
import 'package:provider/provider.dart';
import '../utils/Global.dart';

Dio initDio(){
  // 声明Dio的配置项
  BaseOptions _baseOptions=BaseOptions(
    baseUrl: 'http://eduboss.lagou.com',//接口请求地址

  );
  Dio dio=Dio(_baseOptions);//初始化

//   添加拦截器
dio.interceptors.add(
  InterceptorsWrapper(
//    请求拦截
    onRequest: (RequestOptions options,RequestInterceptorHandler handler){
      print('请求之前进行拦截');
      // 将access_token 封装到  header上
      var user=G.getCurrentContext()?.read<UserProvider>();
      // if(user.isNotEmpty){
        options.headers['Authorization']=user?.accessToken;
      // }


      return handler.next(options);

    },
  //   响应拦截
    onResponse: (Response options,ResponseInterceptorHandler handler){
      print('响应之前进行拦截');
    },

  )
);

// 返回dio
return dio;

}
