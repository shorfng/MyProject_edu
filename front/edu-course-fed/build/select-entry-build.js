const readlineSync = require('readline-sync');


module.exports = function(entrys, isProd) {

    const entrysKeys = Object.keys(entrys);
    entrysKeys.forEach(function(item, index) {
        console.log(`${index}) ${item}`);
    });

    let userSelect = isProd ? '' : '';
    // let userSelect = isProd ? '' : readlineSync.question('输入数字进行选择，多选（1,2,3），不选择则全部构建:');
    if (userSelect) {
        userSelect = userSelect.split(',');
        let tempEntrys = {};
        userSelect.forEach(function(select) {
            if (entrysKeys[select]) {
                tempEntrys[entrysKeys[select]] = entrys[entrysKeys[select]];
            }
            else {
                console.warn(`${select} 是无效的输入`);
            }
        });
        return tempEntrys;
    }
    return entrys;
};
