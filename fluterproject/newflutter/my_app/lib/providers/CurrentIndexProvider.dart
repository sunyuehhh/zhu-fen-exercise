import 'package:flutter/material.dart';

class CurrentIndexProvider with ChangeNotifier{
  int _currentIndex=0;
  int get currentIndex=>_currentIndex;

  changeIndex(int index){
    _currentIndex=index;

    // 通知组件更新
    notifyListeners();

  }

}
