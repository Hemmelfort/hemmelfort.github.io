## 调试

调试时运行 debug_server.cmd 文件，在本机启动该网站，然后从浏览器进入查看效果，如 127.0.0.1:1313。


如果要生成能够在本机运行的静态 html 页面，需要运行命令：

```cmd
hugo --baseURL file:///C:/Users/X/Desktop/web/public 
```

把后面的路径换成你实际的本地路径，也就是将 baseURL 设为本地的目录，这样生成的 html 页面中的链接才能映射到本地。


## 更新内容

### 添加分类

1、在 content 目录下添加文件夹，每个文件夹代表一个分类。

2、在分类文件夹下创建 `_index.md` 文件（前有下划线），添加 front matter：

```yaml
title: 神界：原罪2
description: 《神界：原罪2》是一款回合制 RPG，发行于2017年9月14日。
```

其中 title 为分类名，description 显示在分类的描述一栏中。

### 手动添加文章

在分类目录下新建文件夹，名字会显示在 url 中，所以要注意命名规则。

在该文件夹下新建 `index.md` 文件（前面没有下划线），该文件就是真正写文章的地方。

常用的 front matter：

```yaml
title: 文章标题
author: Hemmelfort
isCJKLanguage: true
draft: false
date: 2019-12-09T11:26:27+08:00
lastmod: 2024-04-16T19:27:04+08:00
```

在文章开头编写一段摘要，然后接 `<!--more-->` 标签。Hugo 会自动采用该摘要。


### 自动添加文章

默认主题 themes/wei 已设置好 archetypes/default.md，只要运行以下命令即可用 hugo 快速创建一篇新文章：

```cmd
hugo new <文件夹>/<文件名>.md
```

Hugo 会自动在 content 目录下添加文件夹并创建 md 文件。

