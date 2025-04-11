import 'package:flutter/material.dart';
import '../../utils/Global.dart';
import './HomeCourse.dart';


class Home extends StatefulWidget{
  Home({Key? key}) : super(key: key);

  @override
  _HomeState createState()=>_HomeState();

}
class _HomeState extends State<Home>{
  List adList=[];
  List<Map<String, String>> courseList = [
    {
      'courseListImg': '/',
      'courseName':"courseName",
      'brief':'brief',
      'id':'1',
      'title':'11'
    },
    {
      'courseListImg': '/',
      'courseName':"courseName",
      'brief':'brief',
      'id':'2',
      'title':'22'
    },
    {
      'courseListImg': '/',
      'courseName':"courseName",
      'brief':'brief',
      'id':'3',
      'title':'33'
    }
  ];
  @override
  void initState() {
    // 请求广告
    // G.api.ad.adList().then((value){
    //   print(value);
    // }).catchError((){
    // });

    setState(() {
      adList=[
      ];
    });
    super.initState();
  }



  @override
  Widget build(BuildContext context){
    return Container(
      color: Colors.grey[200],
      padding: EdgeInsets.all(10),
      child: CustomScrollView(
        slivers: [
          SliverPadding(padding:
          EdgeInsets.all(5),
          sliver: HomeCourse(courseList:courseList),
          )
        ],

      ),
    );

  }

  @override
  void dispose(){
    super.dispose();
  }
}
