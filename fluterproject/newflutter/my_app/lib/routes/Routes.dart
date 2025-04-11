import 'package:flutter/material.dart';
import 'package:fluro/fluro.dart';
import './RoutesHandler.dart';


class Routes{
  static void configureRoutes(FluroRouter router){
    router.define('/', handler: indexHandler);
    router.define('/profile', handler: profileHandler);
    router.define('/login', handler: loginHandler);
    router.define('/course_detail', handler: courseDetailHandler);
    router.notFoundHandler=notfoundHandler;


  }
}
