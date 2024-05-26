var dict = {
    libs_hiker: {
        ver: "1.0.0",
        toast: '',
        localPath: 'hiker://files/cache/drpy/libsVer.js',
        webPath: 'https://raw.githubusercontent.com/zetalpha/hiker/main/drpy/libsVer.js',
    }
}

function checkInFiles(files) {
    files.forEach((f) => {
        var key = f.replace(/\..+/gm, '');
        log(key)
        if (!fileExist(dict[key].localPath)) {
            downloadFile(dict[key].webPath, dict[key].localPath)
            toast('导入完成')
        }
    })
}

function Updata(keys,show) {
    show=show!=undefined?show:false;
    var list = [];
    list = keys;
    toast('正在检查更新')
    list.forEach((x) => {
        log(`文件:${x}`)
        var key = x.replace(/\..+/gm, '');
        log(`-----开始检查-----`)
        var webver = dict[key].ver;
        log(`网络版本:${webver}`)
        var localver = ''
        if (x.includes('.js')) {
            eval(request(dict[key].localPath))
            localver = version.ver
        }
        log(`本地版本:${localver == '' ? '空' : localver}`)
        if (webver == localver) {
            toast('网络与本地版本相同');
            log('网络与本地版本相同');
        } else {
            log(`发现新版本${webver}`)
            loc = dict[key].localPath;
            if(show){
            confirm({
                title: '新版本:' + dict[key].ver,
                content: '更新内容:' + dict[key].toast,
                confirm: $.toString((loc, w) => {
                    downloadFile(dict[key].webPath, dict[key].localPath)
                    log("更新完成");
                    return "toast://更新完成"
                }, loc, dict[key].webPath),
                cancel: $.toString(() => {
                    return "toast://取消更新"
                })
            })
            }else{
                downloadFile(dict[key].webPath, dict[key].localPath)
                log("更新完成");
            }
        }
        log(`-----完成检查-----`);
    })
}
