import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/UserProvider.dart';


class Profile extends StatefulWidget{
  Profile({Key? key}) : super(key: key);

  @override
  _ProfileState createState()=>_ProfileState();

}


class _ProfileState extends State<Profile>{
  @override
  Widget build(BuildContext context){
    UserProvider userProvider = Provider.of<UserProvider>(context);


    return Scaffold(
      appBar: AppBar(
        title: Text('个人资料'),
        centerTitle: true,
      ),
      body: Container(
        child: Column(
          children: [
            ListTile(
              title: Text('头像'),
              trailing: Icon(Icons.supervised_user_circle_rounded,size: 50,),
            ),
            ListTile(
              title: Text('昵称'),
              trailing: Text('张三'),
            )
          ],
        ),
      ),
    );

  }
}
