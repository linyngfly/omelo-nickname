const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs');

// let queryHref = "http://www.cdhdky.com/touxiang/nvsheng/"; 	// 设置被查询的目标网址
// let queryHref = "http://www.cdhdky.com/touxiang/nansheng/"; 	// 设置被查询的目标网址
// let queryHref = "http://www.cdhdky.com/touxiang/katong/"; 	// 设置被查询的目标网址
let queryHref = "http://www.cdhdky.com/touxiang/weixin/"; 	// 设置被查询的目标网址
// let queryHref = "http://www.cdhdky.com/touxiang/oumei/"; 	// 设置被查询的目标网址

let url_config
let querySearch = 1;								// 设置分页位置
let urls = [];

let sumConut = 0;
let reptCount = 0;		// 重复的
let downCount = 0;		// 实际下载的

let pagemax = 208;		// 获取到多少页的内容
let startindex = 1;		// 从多少页开始获取

/**
 * 根据url和参数获取分页内容
 * @param {String}： url
 * @param {int}： serach
 */

function getHtml(href, serach) {
	console.log("正在获取第 "+serach + " 页的图片");
	var pageData = "";
	var req = http.get(href + `list${serach}.htm`, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			pageData += chunk;
		});

		res.on('end', function() {
            // console.log(pageData.toString());
			$ = cheerio.load(pageData);
            var html = $(".TxBox .TXC dd img");
            
            // console.log('----html', html);
			for(var i = 0; i < html.length; i++) {
				var src = html[i].attribs.src;
				// 筛选部分广告，不是真的段子
				if (src.indexOf("http://pic.cdhdky.com/download") > -1) {
					urls.push(html[i].attribs.src)
				}
			}
			// 递归调用
			if (serach < pagemax) {
				getHtml(href, ++serach);
			} else {
				console.log("图片链接获取完毕！");
				sumConut = urls.length;
				console.log("链接总数量：" + urls.length);
                console.log("开始下载......");
				downImg(urls.shift());
			}
		});
	});
}

/**
 * 下载图片
 * @param {String} imgurl：图片地址
 */
function downImg(imgurl) {

	//http://pic.cdhdky.com/download/20170522_134319142.jpg
	var narr = imgurl.replace("http://pic.cdhdky.com/", "").split("/")
	// 做一步优化，如果存在文件，则不下载
	var filename = "./upload/weixin/" + narr[1];

	console.log('--filename', filename);
	console.log('--imgurl', imgurl);

	fs.exists(filename, function(b){
		if (!b) {
            // 文件不存则进行 下载
			http.get(imgurl, function(res) {
				var imgData = "";
				//一定要设置response的编码为binary否则会下载下来的图片打不开
				res.setEncoding("binary"); 
		
				res.on("data", function(chunk) {
					imgData += chunk;
				});
				
				res.on("end", function() {
					var savePath = "./upload/weixin/" + narr[1];
					fs.writeFile(savePath, imgData, "binary", function(err) {
						if(err) {
							console.log(err);
						}  else {
							console.log(narr[1]);
							if (urls.length > 0) {
								downImg(urls.shift());
								downCount++;
								console.log("剩余图片数量....");
							}
						}
					});
				});
			});
		} else {
			// 统计重复的图片
			console.log("该图片已经存在重复.");
			reptCount++;
			if (urls.length > 0) {
				downImg(urls.shift());
			}
		}
	});
	
	if (urls.length <= 0) {
		console.log("下载完毕");
		console.log("重复图片：" + reptCount);
		console.log("实际下载：" + downCount);
	}
}


function start(){
	console.log("开始获取图片连接");
	getHtml(queryHref, startindex);
}

start();

