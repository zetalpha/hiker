var pfix = (typeof prefix) == "undefined" ? "" : prefix;

var paths = {
    root: "hiker://files/cache/drpy/",
    webroot: pfix + "https://raw.githubusercontent.com/zetalpha/hiker/main/drpy/",
}

var dict = {
    libs_hiker: {
        ver: "1.0.0",
        toast: '',
        func: $.toString((local, web) => {
            let webfile = web + "libs_hiker.bin";
            let localfile = local + "libs_hiker.zip";
            downloadFile(webfile, localfile)
            if (fileExist(localfile)) {
                if ($.require("zip").unzipFile(localfile, local)) {
                    toast("解压成功");
                    deleteFile(localfile);
                    return "hiker://empty"
                } else {
                    toast("解压失败");
                    return "hiker://empty";
                }
            }
            return "hiker://empty";
        }, paths.root, paths.webroot),
        localPath: "hiker://files/cache/drpy/libsVer.js",
        webPath: pfix + "https://raw.githubusercontent.com/zetalpha/hiker/main/drpy/libsVer.js",
    }
}

function checkInFiles(files) {
    files.forEach((f) => {
        var key = f.replace(/\..+/gm, '');
        if (!fileExist(dict[key].localPath)) {
            downloadFile(dict[key].webPath, dict[key].localPath)
            if (dict[key].hasOwnProperty("func")) {
                eval(dict[key].func)
            }
            toast('导入完成')
        }
    })
}

function Updata(keys, show) {
    show = show != undefined ? show : false;
    var list = [];
    list = keys;
    toast('正在检查更新')
    list.forEach((x) => {
        log(`文件:${x}`)
        var key = x.replace(/\..+/gm, '');
        log(`-----开始检查-----`)
        var webver = dict[key].ver;
        log(`网络版本:${webver}`)
        eval(request(dict[key].localPath))
        localver = version.ver

        log(`本地版本:${localver == '' ? '空' : localver}`)
        if (webver == localver) {
            toast('网络与本地版本相同');
            log('网络与本地版本相同');
        } else {
            log(`发现新版本${webver}`)
            loc = dict[key].localPath;
            if (show) {
                confirm({
                    title: '新版本:' + dict[key].ver,
                    content: '更新内容:' + dict[key].toast,
                    confirm: $.toString((dict, key) => {
                        downloadFile(dict[key].webPath, dict[key].localPath)
                        if (dict[key].hasOwnProperty("func")) {
                            eval(dict[key].func)
                        }
                        log("更新完成");
                        toast("更新完成");
                        return "hiker://empty"
                    }, dict, key),
                    cancel: $.toString(() => {
                        toast("取消更新");
                        return "hiker://empty"
                    })
                })
            } else {
                downloadFile(dict[key].webPath, dict[key].localPath)
                if (dict[key].hasOwnProperty("func")) {
                    eval(dict[key].func)
                }
                log("更新完成");
            }
        }
        log(`-----完成检查-----`);
    })
}
