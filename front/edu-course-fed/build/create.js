const fs = require('fs');
const chalk = require('chalk');

/**
 * projectDir  项目文件夹
 * pageDir 页面文件夹
 */
const projectDir = process.argv[2];

const copyDir = (src, dist, callback) => {
  fs.access(dist, function (err) {
    if (err) {
      // 目录不存在时创建目录并开始复制
      fs.mkdirSync(dist);
      copy(null, src, dist);
    } else {
      callback('src下已存在此目录！');
    }
  });

  function copy(err, src, dist) {
    if (err) {
      callback(err);
    } else {
      fs.readdir(src, (err, paths) => {
        if (err) {
          callback(err);
        } else {
          paths.forEach((path) => {
            let _src = src + '/' + path;
            let _dist = dist + '/' + path;
            fs.stat(_src, (err, stat) => {
              if (err) {
                callback(err);
              } else {
                // 判断是文件还是目录
                if (stat.isFile()) {
                  fs.writeFileSync(_dist, fs.readFileSync(_src));
                } else if (stat.isDirectory()) {
                  // 当是目录是，递归复制
                  copyDir(_src, _dist, callback);
                }
              }
            });
          });
        }
      });
    }
  }
};

if (projectDir) {
  // 在src下创建模块
  copyDir('./build/templates', `./src/${projectDir}`, (err) => {
    if (err) {
      console.log(chalk.red(err));
    }
  });
} else {
  console.log(chalk.yellow('请输入项目名称!'));
}
