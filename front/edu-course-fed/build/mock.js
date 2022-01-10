const fs = require('fs');
const path = require('path');
const projectDir = './src/' + process.argv[2];
let lagouMockConfigPath =  require('./mockDir/lagouMockConfig');
function findJsonFile(jsonPath) {
    let jsonFiles = [];
    let files = fs.readdirSync(jsonPath);
    files.forEach(function (item) {
        let fPath = path.join(jsonPath, item);
        let stat = fs.statSync(fPath);
        if (stat.isDirectory() && item === 'service') {
            findJsonFile(fPath);
        }
        if (stat.isFile() && fPath.indexOf('service/index.js') > 0) {
            let content = fs.readFileSync(fPath, 'utf-8');
            console.log('============开始根据service接口定义自动构建本地mock==============');
            createMock(content, process.argv[2]);
        }
        isPathExisted('./mockDir/' + process.argv[2]);
    });
    return jsonFiles;
}
function createMock(content, dir) {
    let mockUrl = [];
    content.replace(/gnctx}(\S*)\`/g, function(match, p1) {
        mockUrl.push(p1);
    });
    let newMockObj = {};
    console.log(mockUrl);
    mockUrl.forEach((item) => {
        let serviveList = item.split('/');
        let serviceName = serviveList[serviveList.length - 1];
        serviceName = serviceName.includes('.json') ? serviceName : serviceName + '.json';
        newMockObj[item] = './' + dir + '/' + serviceName;
        fs.exists(path.join(__dirname, './mockDir/' + process.argv[2] + '/' + serviceName), function(exists) {
            if (!exists) {
                fs.writeFile(path.join(__dirname, './mockDir/' + process.argv[2] + '/' + serviceName), '', 'utf8', (err) => {
                    if (err) throw err;
                    console.log('文件创建成功');
                });
            } else {
                console.log('mock文件已经存在');
            }
        });

    });
    let result = Object.assign(lagouMockConfigPath.mockServerConfig, newMockObj);
    fs.readFile(path.join(__dirname, './mockDir/lagouMockConfig.js'), 'utf8', function (err, data) {
        if (err) throw err;
        data = data.replace(/mockServerConfig\:([\s\S]*?)mockJsonDir/g, function(match, p1) {
            return 'mockServerConfig:' + JSON.stringify(result, null, '\t') + ',mockJsonDir';
        });
        fs.writeFile(path.join(__dirname, './mockDir/lagouMockConfig.js'), data, 'utf8', (err) => {
            if (err) throw err;
            console.log('create mock success');
        });
    });
}
function isPathExisted(dirName) {
    return new Promise((resolve) => {
        fs.exists(path.join(__dirname, dirName), function(exists) {
            if (!exists) {
                fs.mkdirSync(path.join(__dirname, dirName));
            } else {
                console.log('当前目录已存在');
            }
            resolve();
        });
    });
}
isPathExisted('./mockDir/' + process.argv[2]).then(() => {
    findJsonFile(projectDir);
});