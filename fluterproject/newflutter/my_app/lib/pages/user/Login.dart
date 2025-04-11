import 'package:flutter/material.dart';


class Login extends StatefulWidget{
  Login({Key? key}) : super(key: key);

  @override
  _LoginState createState()=>_LoginState();

}


class _LoginState extends State<Login>{
  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(
        title: Text('用户登录'),
        centerTitle: true,
      ),
      body: Center(
        child: Text('用户登录'),
      ),
    );

  }
}
