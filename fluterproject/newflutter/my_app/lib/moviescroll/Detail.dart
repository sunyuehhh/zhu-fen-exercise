import 'package:flutter/material.dart';

class Detail extends StatelessWidget{
  Detail({Key? key, required this.url}) : super(key: key);
  final String url;
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      appBar: AppBar(
        title: Text("Movie Detail"),
      ),
      body: Center(
        child: Column(
          children: <Widget>[
            Image.asset(
               url
            ),
            GestureDetector(
              onTap: (){
                Navigator.of(context).pop('49亿');
              },
              child:
              Text('49亿',style: TextStyle(
                fontSize: 20,
              ),),
            )
          ],
        )
      ),
    );
  }

}
