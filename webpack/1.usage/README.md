webpack-dev-server
1.用webpack打包项目,得到输出的文件，当道输出目录
webpack-dev-server打包的话,结果文件互惠写入硬盘,只会写入内存
2.启用http服务器，用来返回打包后的文件
http服务器的静态文件根目录有两个
1.打包后的dist目录
2.我们指定的静态文件根目录  public目录
