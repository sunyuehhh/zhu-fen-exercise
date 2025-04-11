import 'package:flutter/material.dart';
import '../../utils/Global.dart';



class HomeCourse extends StatefulWidget{
  List courseList;
  HomeCourse({Key? key,required this.courseList}) : super(key: key);

  @override
  _HomeCourseState createState()=>_HomeCourseState();

}


class _HomeCourseState extends State<HomeCourse>{
  @override
  Widget build(BuildContext context){
    return Container(
      child: SliverList(delegate:
          SliverChildBuilderDelegate((BuildContext context,int index){
            var course=widget.courseList[index];
            return GestureDetector(
              onTap: (){
                Map<String,dynamic> p={
                  'id':course['id'],
                  'title':course['title']
                };
                print(index);
                G.router.navigateTo(context, "/course_detail"+G.parseQuery(params:p));
              },
              child: Container(
                color: Colors.white,
                child: Flex(direction:
                Axis.horizontal,
                children: [
                  Expanded(child:ClipRRect(
                    borderRadius:BorderRadius.circular(10),
                    child:
                    Image.network(
                      course['courseListImg'],
                      fit: BoxFit.cover,
                      height: 120,
                    ),
                  ) ,flex: 3,),
                  Expanded(child: Container(
                    height: 120,
                    child: Column(
                      children: [
                        Container(
                          width: double.infinity,
                          child: Text(
                            course['courseName'],
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                        ),
                        Container(
                          width: double.infinity,
                          child: Text(
                            course['brief'],
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),flex: 3,)

                ],),
              ),
            );

          },childCount: widget.courseList.length)
      ),
    );

  }
}
