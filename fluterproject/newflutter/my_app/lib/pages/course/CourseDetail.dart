import 'package:flutter/material.dart';
import '../../utils/Global.dart';
import 'package:flutter_html/flutter_html.dart';


class CourseDetail extends StatefulWidget{
  final int id;
  final String title;
  CourseDetail({Key? key,required this.id,required this.title}) : super(key: key);

  @override
  _CourseDetailState createState()=>_CourseDetailState();

}


class _CourseDetailState extends State<CourseDetail>{
  Map course={

  };
  List section=["11","22"];

  final List<Widget> _tabs=[
    Tab(text: "详情",),
    Tab(text: "目录",),
  ];

  List<Widget> get _tabViews=>[
    Html(data: 'Html'),
    // Text('这里是章节'),
    renderCourseSection()
  ];

  @override
  void initState() {
    // TODO: implement initState
    // 调用详情接口
    G.api.ad.courseDetail(id: widget.id).then((value){
      print(value);
    });

    setState(() {
      course={
        'courseImgUrl':''
      };
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        centerTitle: true,
      ),
      body: ListView(
        children: [
          Image.network(
            course['courseImgUrl'],
            fit: BoxFit.cover,
          ),
          Html(data: "<h1>Hello Flutter</h1>"),
        //   展示详情和章节
          Container(
            height: double.maxFinite,
            width: double.infinity,
            child: DefaultTabController(length: _tabs.length, child:
            Column(
              children: [
                TabBar(tabs: _tabs,
                labelColor: Colors.blue,
                unselectedLabelColor: Colors.black45,
                  indicatorSize: TabBarIndicatorSize.label,
                ),
                Expanded(child: TabBarView(children:
                _tabViews))
              ],
            )),
          )
        ],
      ),
      bottomNavigationBar: Row(
        children: [
          InkWell(
            onTap: (){
            },
            child: Container(
              width: 200,
              height: 80,
              color: Colors.green,

              alignment: Alignment.center,
              child: Text('立刻购买',
              style:
                TextStyle(
                  color: Colors.white,
                  fontSize: 30
                ),),
            ),
          ),
          InkWell(
            onTap: (){

            },
            child: Container(
              width: 200,
              height: 80,
              color: Colors.red,

              alignment: Alignment.center,
              child: Text('砍价一元',
                style:
                TextStyle(
                    color: Colors.white,
                    fontSize: 30
                ),),
            ),
          )
        ],
      ),
    );

  }


  Widget renderCourseSection(){
    return section.isNotEmpty
        ? Column(
      children: section.map((module) {
        return ListTile(
          title: Text(module.toString()),
        );
      }).toList(),
    )
        : Text('没有课程');
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
  }
}
