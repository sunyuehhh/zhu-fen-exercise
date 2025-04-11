import 'package:flutter/material.dart';


class UserProvider with ChangeNotifier{
  bool _isLogin=false;
  Map _user={};
  String _accessToken='accessToken';

  bool get isLogin=>_isLogin;
  Map get user=>_user;
  String get accessToken=>_accessToken;

  doLogin(data){
    if(data!=false){
      _isLogin=true;
      _user=data;

      notifyListeners();
    }

  }

  doLogout(){
    _isLogin=false;
    _user={};

    notifyListeners();
  }
}
