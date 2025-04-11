import 'package:flutter/material.dart';
import '../../utils/Global.dart';


class Mine extends StatefulWidget{
  Mine({Key? key}) : super(key: key);

  @override
  _MineState createState()=>_MineState();

}


class _MineState extends State<Mine>{
  final double iconSize=20;
  @override
  Widget build(BuildContext context){
    TextStyle ts1=TextStyle(fontSize: 26);
    TextStyle ts2=TextStyle(fontSize: 16,color: Colors.grey[600]);

    // 垂直方向的分割线
    SizedBox vline=SizedBox(
      width: 1,
      height: 60,
      child: DecoratedBox(decoration: BoxDecoration(color: Colors.grey)),
    );

    return SingleChildScrollView(
      child: Container(
        child: Column(
          children: [
            Card(
              margin: EdgeInsets.all(30),
              // color: Colors.purple,
              shadowColor: Colors.yellow,
              elevation: 20,//阴影高度
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(40),
                side: BorderSide(
                  color: Colors.yellow,
                  width: 3
                )
              ),
              child:
              Column(
                children: [
                  ListTile(
                    leading: Icon(Icons.supervised_user_circle_rounded,
                    size: 50,),
                    title: Text('张三',
                    style:
                      TextStyle(
                        fontSize: 24
                      ),),
                    subtitle: InkWell(
                      child: Text('编辑个人资料',style: TextStyle(fontSize: 16),),
                      onTap: (){
                        G.router.navigateTo(context, '/profile');
                      },
                    ),

                  ),
                  Divider(),
                  Container(
                    margin: EdgeInsets.all(10),
                    padding: EdgeInsets.all(10),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Column(
                          children: [
                            Text('14.06',style: ts1,),
                            Text('学习时常',style: ts2,)
                          ],
                        ),
                        vline,
                        Column(
                          children: [
                            Text('2',style: ts1,),
                            Text('优惠券',style: ts2,)
                          ],
                        ),
                        vline,
                        Column(
                          children: [
                            Text('75',style: ts1,),
                            Text('学分',style: ts2,)
                          ],
                        )
                      ],
                    ),
                  )
                ],
              ),
            ),
            ListTile(
              leading: Icon(Icons.settings,size: iconSize,),
              title: Text('设置'),
              trailing: Icon(Icons.arrow_forward_ios,size: iconSize,),
              onTap: (){

              },

            ),
            ListTile(
              leading: Icon(Icons.help_outline,size: iconSize,),
              title: Text('帮助与反馈'),
              trailing: Icon(Icons.arrow_forward_ios,size: iconSize,),
              onTap: (){

              },


            ),
            ListTile(
              leading: Icon(Icons.info_outline,size: iconSize,),
              title: Text('关于'),
              trailing: Icon(Icons.arrow_forward_ios,size: iconSize,),
              onTap: (){

              },

            ),
            ListTile(
              leading: Icon(Icons.login_outlined,size: iconSize,),
              title: Text('退出'),
              trailing: Icon(Icons.arrow_forward_ios,size: iconSize,),
              onTap: (){

              },

            ),
            Text('用户名'),
            ElevatedButton(onPressed: (){
              G.router.navigateTo(context, '/login');
            }, child: Text('跳转到登录页'))
          ],
        ),
      ),
    );

  }
}
