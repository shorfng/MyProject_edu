const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const onlineAdvisory =['java-base-sem']
const thirdPlatTrack =['java-base-class', 'big-data']

module.exports = ({ htmlWebpackPlugin }) => {

    const { html, baseDir, dll, staticUrl } = htmlWebpackPlugin.options.templateParameters;

    const globalVar = fs.readFileSync(path.join(baseDir, './layout/globalvar.html')).toString();
    let KFScript = fs.readFileSync(path.join(baseDir, './layout/53kf.html')).toString();
    let neteaseScript = fs.readFileSync(path.join(baseDir, './layout/netease.html')).toString();

    let mainContent = '';

    try {
        mainContent = fs.readFileSync(html + '.html', { encode: 'utf8' }).toString();
    }
    catch (e) {
        console.error(e);
    }
    
    mainContent = mainContent.replace('<script src="//cdn.bootcss.com/eruda/1.5.2/eruda.min.js"></script>', '');
    mainContent = mainContent.replace('<script>eruda.init();</script>', '');

    let oceanEngineTrack = ''
    onlineAdvisory.forEach(item => {
        if(html.includes(item)) {
            oceanEngineTrack = KFScript
        }
    })
    thirdPlatTrack.forEach(item => {
        if(html.includes(item)) {
            oceanEngineTrack += neteaseScript
        }
    })
    return ejs.renderFile(path.join(baseDir, './layout/base.ejs'), {
        mainContent: mainContent,
        globalVar: globalVar,
        dll,
        staticUrl,
        oceanEngineTrack,
    });

};
