---
title: Hexo next blog 问题集锦
date: 2019-09-05 10:54:31
categories:
- [hexo]
- [blog]
tags:
 - hexo
 - next
 - blog
---

1. YAMLException: can not read a block mapping entry; a multiline key may not be an implicit key at line 13, column 1:

   > 标签空格缺少

   

   ~~~makefile
   categories:
   - [hexo]
   - [blog]
   tags:
    - hexo  // 注意这里- 前面要添加空格
    - next
    - blog
   ~~~

2. YAMLException: bad indentation of a mapping entry at line 11, column 2:

   ​     — 静态库

   > — 要使用英文的 -