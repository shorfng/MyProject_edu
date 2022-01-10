# kw-web-fed

> 本地开发

``` bash
# 安装依赖
npm install

# 新建项目
npm run create <module-name>

# 自动以热更新的方式打开浏览器localhost:8081
npm run start

# 入口文件配置
build/config/index.js
entry属性
```

### mock数据
```bash
# 自动生成mock当前的mock文件和映射
npm run mock <module-name>
```

##### json数据模拟
[lagou-mock-middleware](https://github.com/wangjinyang/lagou-mock-middleware/tree/master)关键组件

```javascript
mockServerConfig: {
    '/user/info': '/a.html', //重定向
    '/user/info2': 'info.json',  //读取本地文件
    '/user/info3': {  //返回json数据
        'name': 'jingyang'
    },
    '/user/info4': {  service
        'GET': function (query, body) {
            return 'hello word';
        }
    },
},
mockJsonDir: path.join(__dirname, '../mockDir')  //存贮 mock json 的文件夹的地址
```

##### velocity 数据模拟

1. 公共velocity数据
build/velocity-common.js

1. 在page目录下，main.html,建立velocity.js文件
page
--index.html
--index.js

*修改index.html刷新页面即可生效*

##### 静态资源

1. 需要添加hash值的，放在src/assets
1. 使用cdn引入的，放在src/static

> k8s联调

1. 本分支打tag

`./tag.sh`
`git push origin [branch name]`

2. 登录测试跳板机

`ssh [userName]@10.1.200.106`

3. 登录测试机

`kuber.dev.110`

4. 运行脚本命令

``` bash
sudo -i 
cd /etc/init.d/
./kw-web-fed
```
选择分支，开始构建

> 上线流程

1. 本分支打tag

`./tag.sh`
`git push origin [branch name]`

2. 登录线上跳板机

`ssh [userName]@10.1.200.106`

3. 登录999环境

`kw.web.tomcat.bjc.999`

4. 运行脚本命令，选择分支进行构建

`sudo /etc/init.d/kw-web-fed update`

*999测试host，不配置静态资源host*
*123.59.57.81	kaiwu.lagou.com*

5. 上线命令，静态资源上到cdn，template上到Tomcat

`sudo /etc/init.d/kw-web-fed sync`

6. 在Git上将代码合并到master

> package命令

``` bash
# 安装依赖
npm install

# 自动以热更新的方式打开浏览器localhost:8081
npm run start

# 本地查看生产模式的输出到dist目录的文件
npm run prod

# eslint自动修复和执行检查
npm run lint
```

7. 如果发现有页面之间有可复用的组件，请抽象到最顶层common内，强烈禁止平级目录间的组件互相引用。

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
