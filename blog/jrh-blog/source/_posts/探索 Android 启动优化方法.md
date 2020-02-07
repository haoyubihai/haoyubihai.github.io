---
title: 探索 Android 启动优化方法
date: 2019-12-28 23:22:20
categories:
- [java]
- [android]
tags:
- 性能优化
- android

---



# 探索 Android 启动优化方法

[来源](https://juejin.im/post/5d5aa36af265da03963b9913)

![首图](https://user-gold-cdn.xitu.io/2019/8/19/16ca87e72e9460ed?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

<!--more-->



![目录.png](https://user-gold-cdn.xitu.io/2019/8/19/16caa0e6ea0ca7a6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



## 前言

### 1. 启动优化的意义

假如我们去到一家餐厅，叫了半天都没有人过来点菜，那等不了多久就没耐心想走了。

对于 App 也是一样的，如果我们打开一个应用半天都打不开，那很快的我们也会失去耐心。

启动速度是用户对我们应用的第一体验，用户只有启动我们的应用才能使用我们应用中的功能。

就算我们应用内部设计得再精美，其他性能优化地再好，如果打开速度很慢的话，用户对我们应用的第一印象还是很差。

你可以追求完美，要做到应用在 1 毫秒内启动。

但是一般情况下， 我们只要做到超越竞品或者远超竞品，就能在启动速度这一个点上让用户满意。

用户选择 App 的时候会考虑各种因素，而我们 App 开发者能做的就是在争取通过各种技术让我们的 App 从众多竞品中脱颖而出。

### 2. 文章内容

这篇文章分为三部分。

- 第一部分：启动优化基础

  第一部分是第 1 大节，讲的是应用启动流程的相关知识。

- 第二部分：启动优化方法

  第二部分是第 2~4 大节，讲的是常用的优化启动速度的工具和方法。

- 第三部分：优化方法改进

  第三部分是第 5~7 大节，讲的是常规优化启动方法的改进型解决方案。

## 1. 三种启动状态

启动速度对 App 的整体性能非常重要，所以谷歌官方给出了一篇启动速度优化的文章。

在这篇文章中，把启动分为了三种状态：热启动、暖启动和冷启动。

下面我们来看下三种启动状态的特点。

### 1.1 热启动

热启动是三种启动状态中是最快的一种，因为热启动是从后台切到了前台，不需要再创建 Applicaiton，也不需要再进行渲染布局等操作。

### 1.2 暖启动

暖启动的启动速度介于冷启动和热启动之间，暖启动只会重走 Activity 的生命周期，不会重走进程创建和 Application 的创建和生命周期等。

### 1.3 冷启动

冷启动经历了一系列流程，耗时也是最多的，理解冷启动整体流程的理解，可以帮助我们寻找之后的一个优化方向。

冷启动也是优化的衡量标准，一般在线上进行的启动优化都是以冷启动速度为指标的。

启动速度的优化方向是 Application 和 Activity 生命周期阶段，这是我们开发者能控制的时间，其他阶段都是系统做的。

冷启动流程可以分为三步：创建进程、启动应用和绘制界面。

1. 创建进程

   创建进程阶段主要做了下面三件事，这三件事都是系统做的。

   - 启动 App
   - 加载空白 Window
   - 创建进程

2. 启动应用

   启动应用阶段主要做了下面三件事，从这些开始，随后的任务和我们自己写的代码有一定的关系。

   - 创建 Application
   - 启动主线程
   - 创建 MainActivity

3. 绘制界面

   绘制界面阶段主要做了下面三件事。

   - 加载布局
   - 布置屏幕
   - 首帧绘制

## 2. 两种测量方法

上一节介绍了三种启动状态，这一节我们来看一下常用的两种测量启动时间的方法：命令测量和埋点测量。

### 2.1 命令测量

命令测量指的是用 adb 命令测量启动时间，通过下面两步就能实现 adb 命令测量应用启动时间

1. 输入测量命令
2. 分析测量结果

#### 2.2.1 输入测量命令

我们在终端中输入一条 adb 命令打开我们要测量的应用，打开后系统会输出应用的启动时间。

下面就是测量启动时间的 adb 命令。



![adb 命令1.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="946" height="362"></svg>)



首屏 Activity 也要加上包名，比如下面这样的。



![adb 命令2.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1022" height="362"></svg>)



#### 2.2.2 分析测量结果



![adb 输出结果.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="684"></svg>)



上面是命令执行完成后显示的内容，在输出中可以看到三个值：ThisTime、TotalTime 和 WaitTime。

下面我们来看下这三个值分别代表什么。

- ThisTime

  ThisTime 代表最后一个 Activity 启动所需要的时间，也就是最后一个 Activity 的启动耗时。

- TotalTime

  TotalTime 代表所有 Activity 启动耗时，在上面的输出中，TotalTime 和 ThisTime 是一样的，因为这个 Demo 没有写 Splash 界面。

  也就是这个 App 打开了 Application 后就直接打开了 MainActivity 界面，没有启动其他页面。

- WaitTime

  WaitTime 是 AMS 启动 Activity 的总耗时。

这三者之间的关系如下。

ThisTime <= TotalToime < WaitTime

### 2.2 埋点测量

埋点测量指的是我们在应用启动阶段埋一个点，在启动结束时再埋一个点，两者之间的差值就是 App 的启动耗时。

通过下面三步可以实现埋点测量。

1. 定义埋点工具类
2. 记录启动时间
3. 计算启动耗时

#### 2.2.1 定义埋点工具类

使用埋点测量的第一步是定义一个记录埋点工具类。

在这里要注意的是，除了 System.currentTimeMillis() 以外，我们还可以用 SystemClock.currentThreadTimeMillis() 记录时间。

通过 SystemClock 拿到的是 CPU 真正执行的时间，这个时间与下一大节要讲的 Systrace 上记录的时间点是一样的。



![LaunchTimer.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1020" height="924"></svg>)



#### 2.2.2 记录启动时间

使用埋点测量的第二步是记录启动时间。

开始记录的位置放在 Application 的 attachBaseContext 方法中，attachBaseContext 是我们应用能接收到的最早的一个生命周期回调方法。



![记录启动时间.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1124" height="644"></svg>)



#### 2.2.3 计算启动耗时

计算启动耗时的一个误区就是在 onWindowFocusChanged 方法中计算启动耗时。

onWindowFocusChanged 方法只是 Activity 的首帧时间，是 Activity 首次进行绘制的时间，首帧时间和界面完整展示出来还有一段时间差，不能真正代表界面已经展现出来了。

按首帧时间计算启动耗时并不准确，我们要的是用户真正看到我们界面的时间。

正确的计算启动耗时的时机是要等真实的数据展示出来，比如在列表第一项的展示时再计算启动耗时。

在 Adapter 中记录启动耗时要加一个布尔值变量进行判断，避免 onBindViewHolder 方法被多次调用导致不必要的计算。



![计算启动耗时.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="1205"></svg>)



### 2.3 小结

### 2.3.1 命令测量优缺点

- 命令测量优点

  - 线下使用方便

    adb 命令测量启动速度的方式在线下使用比较方便，而且这种方式还能用于测量竞品。

- 命令测量缺点

  - 不能带到线上

    如果一条 adb 命令带到线上去，没有 app 也没有系统帮我们执行这一条 adb 命令，我们就拿不到这些数据，所以不能带到线上。

  - 不严谨和精确

    不能精确控制启动时间的开始和结束。

#### 2.3.2 埋点测量的特点

- 精确

  手动打点的方式比较精确，因为我们可以精确控制开始和结束的位置。

- 可带到线上

  使用埋点测量进行用户数据的采集，可以很方便地带到线上，把数据上报给服务器。

  服务器可以针对所有用户上报的启动数据，每天做一个整合，计算出一个平均值，然后对比不同版本的启动速度。

## 3. 两个分析工具

常用的分析方法耗时的工具有 Systrace 和 Traceview，它们两个是相互补充的关系，我们要在不同的场景下使用不同的工具，这样才能发挥工具的最大作用。

本节内容如下。

- Traceview
- Systrace
- 小结

### 3.1 Traceview

Traceview 能以图形的形式展示代码的执行时间和调用栈信息，而且 Traceview 提供的信息非常全面，因为它包含了所有线程。

Traceview 的使用可以分为两步：开始跟踪、分析结果。

下面我们来看看这两步的具体操作。

#### 3.1.1 开始跟踪

我们可以通过 Debug.startMethodTracing("输出文件") 就可以开始跟踪方法，记录一段时间内的 CPU 使用情况。

当我们调用了 Debug.stopMethodTracing() 停止跟踪方法后，系统就会为我们生成一个文件，我们可以通过 Traceview 查看这个文件记录的内容。

文件生成的位置在 Android/data/包名/files 下，下面我们来看一个示例。

我们在 Application 的 onCreate 方法的开头开始追踪方法，然后在结尾结束追踪，在这里只是对 BlockCanary 卡顿监测框架进行初始化。



![startMethodTracing.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="679"></svg>)



startMethodTracing 方法真正调用的其实是另一个重载方法，在这个重载方法可以传入 bufferSize。

bufferSize 就是分析结果文件的大小，默认是 8 兆。

我们可以进行扩充，比如扩充为 16 兆、32 兆等。

这个重载方法的第三个参数是标志位，这个标志位只有一个选项，就是 TRACE_COUNT_ALLOCS。



![startMethodTracing2.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1144" height="608"></svg>)



#### 3.1.2 分析结果

运行了程序后，有两种方式可以获取到跟踪结果文件。

第一种方式是通过下面的命令把文件拉到项目根目录。



![pull 跟踪结果.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1086" height="364"></svg>)



第二种方式是在 AS 右下方的文件资源管理器中定位到 /sdcard/android/data/包名/files/ 目录下，然后自己找个地方保存。



![文件资源管理器.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="482" height="784"></svg>)



我们在 AS 中打开跟踪文件 mytrace.trace 后，就可以用 Profiler 查看跟踪的分析结果。



![查看跟踪文件.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="662"></svg>)



在分析结果上比较重要的是 5 种信息。

- 代码指定的时间范围

  这个时间范围是我们通过 Debug 类精确指定的

- 选中的时间范围

  我们可以拖动时间线，选择查看一段时间内某条线程的调用堆栈

- 进程中存在的线程

  在这里可以看到在指定时间范围内进程中只有主线程和 BlockCanary 的线程，一共有 4 条线程。

- 调用堆栈

  在上面的跟踪信息中，我选中了 main，也就是主线程。

  还把时间范围缩小到了特定时间区域内，放大了这个时间范围内主线程的调用堆栈信息

- 方法耗时

  当我们把鼠标放到某一个方法上的时候，我们可以看到这个方法的耗时，比如上面的 initBlockCanary 的耗时是 19 毫秒。

### 3.2 Systrace

Systrace 结合了 Android 内核数据，分析了线程活动后会给我们生成一个非常精确 HTML 格式的报告。

Systrace 提供的 Trace 工具类默认只能 API 18 以上的项目中才能使用，如果我们的兼容版本低于 API 18，我们可以使用 TraceCompat。

Systrace 的使用步骤和 Traceview 差不多，分为下面两步。

- 调用跟踪方法
- 查看跟踪结果

#### 3.2.2 调用跟踪方法

首先在 Application 中调用 Systrace 的跟踪方法。



![beginSection.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1086" height="644"></svg>)



然后连接设备，在终端中定位到 Android SDK 目录下，比如我的 Android SDK 目录在 /users/oushaoze/library/Android/sdk 。

这时候我打开 SDK 目录下的 platform-tools/systrace 就能看到 systrace.py 的一个 python 文件。

Systrace 是一个 Python 脚本，输入下面命令，运行 systrace ，开始追踪系统信息。



![systrace命令.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1066" height="434"></svg>)



这行命令附加了下面一些选项。

- -t ...

  -t 后面表示的是跟踪的时间，比如上面设定的是 10 秒就结束。

- -o ...

  -o 后面表示把文件输出到指定目录下。

- -a ...

  -a 后面表示的是要启动的应用包名

输入完这行命令后，可以看到开始跟踪的提示。看到 Starting tracing 后可以打开打开我们的应用。

10 秒后，会看到 Wrote trace HTML file: ....。



![systrace输出.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1066" height="504"></svg>)



上面这段输出就是说追踪完毕，追踪到的信息都写到 trace.html 文件中了，接下来我们打开这个文件。

#### 3.2.3 查看跟踪结果



![Systrace.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="550"></svg>)



打开文件后我们可以看到上面这样的一个视图，在这里有几个需要特别关注的地方。

- 8 核

  我运行 Systrace 的设备是 8 核的，所以这里的 Kernel 下面是 8 个 CPU。

- 缩放

  当我们选中缩放后，缩放的方式是上下移动，不是左右移动。

- 移动

  选择移动后，我们可以拖动我们往下查看其它进程的分析信息。

- 时间片使用情况

  时间片使用情况指的是各个 CPU 在特定时间内的时间片使用情况，当我们用缩放把特定时间段内的时间片信息放大，我们就可以看到时间片是被哪个线程占用了。

- 运行中的进程

  左侧一栏除了各个内核外，还会显示运行中的进程。

我们往下移动，可以看到 MyAppplication 进程的线程活动情况。



![Systrace_myapp.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="549"></svg>)



在这个视图上我们主要关注三个点。

- 主线程

  在这里我们主要关注主线程的运行了哪些方法

- 跟踪的时间段

  刚才在代码中设置的标签是 AppOnCreate，在这里就显示了这个跟踪时间段的标签

- 耗时

  我们选中 AppOnCreate 标签后，就可以看到这个方法的耗时。

  在 Slice 标签下的耗时信息包括 Wall Duration 和 CPU Duration，下面是它们的区别。

  - Wall Duration

    Wall Time 是执行这段代码耗费的时间，不能作为优化指标。

    假如我们的代码要进入锁的临界区，如果锁被其他线程持有，当前线程就进入了阻塞状态，而等待的时间是会被计算到 Wall Time 中的。

  - CPU Duration

    CPU Duration 是 CPU 真正花在这段代码上的时间，是我们关心的优化指标。

    在上面的例子中 Wall Duration 是 84 毫秒，CPU Duration 是 34 毫秒，也就是在这段时间内一共有 50 毫秒 CPU 是处于休息状态的，真正执行代码的时间只花了 34 毫秒。

### 3.3 小结

#### 3.3.1 Traceview 的两个特点

Traceview 有两个特点：可埋点、开销大。

- 可埋点

  Traceview 的好处之一是可以在代码中埋点，埋点后可以用 CPU Profiler 进行分析。

  因为我们现在优化的是启动阶段的代码，如果我们打开 App 后直接通过 CPU Profiler 进行记录的话，就要求你有单身三十年的手速，点击开始记录的时间要和应用的启动时间完全一致。

  有了 Traceview，哪怕你是老年人手速也可以记录启动过程涉及的调用栈信息。

- 开销大

  Traceview 的运行时开销非常大，它会导致我们程序的运行变慢。

  之所以会变慢，是因为它会通过虚拟机的 Profiler 抓取我们当前所有线程的所有调用堆栈。

  因为这个问题，Traceview 也可能会带偏我们的优化方向。

  比如我们有一个方法，这个方法在正常情况下的耗时不大，但是加上了 Traceview 之后可能会发现它的耗时变成了原来的十倍甚至更多。

#### 3.3.2 Systrace 的两个特点

Systrace 的两个特点：开销小、直观。

- 开销小

  Systrace 开销非常小，不像 Traceview，因为它只会在我们埋点区间进行记录。

  而 Traceview 是会把所有的线程的堆栈调用情况都记录下来。

- 直观

  在 Systrace 中我们可以很直观地看到 CPU 利用率的情况。

  当我们发现 CPU 利用率低的时候，我们可以考虑让更多代码以异步的方式执行，以提高 CPU 利用率。

#### 3.3.3 Traceview 与 Systrace 的两个区别

- 查看工具

  Traceview 分析结果要使用 Profiler 查看。

  Systrace 分析结果是在浏览器查看 HTML 文件。

- 埋点工具类

  Traceview 使用的是 Debug.startMethodTracing()。

  Systrace 用的是 Trace.beginSection() 和 TraceCompat.beginSection()。

## 4. 两种优化方法

常用的两种优化方法有两种，这两种是可以结合使用的。

第一种是闪屏页，在视觉上让用户感觉启动速度快，第二种是异步初始化。

### 4.1 闪屏页

闪屏页是优化启动速度的一个小技巧，虽然对实际的启动速度没有任何帮助，但是能让用户感觉比启动的速度要快一些。

闪屏页就是在 App 打开首屏 Activity 前，首先显示一张图片，这张图片可以是 Logo 页，等 Activity 展示出来后，再把 Theme 变回来。

冷启动的其中一步是创建一个空白 Window，闪屏页就是利用这个空白 Window 显示占位图。

通过下面四个步骤可以实现闪屏页。

1. 定义闪屏图
2. 定义闪屏主题
3. 设置主题
4. 换回主题

#### 4.1.1 定义闪屏图

第一步是在 drawable 目录下创建一个 splash.xml 文件。



![splash.xml.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1066" height="644"></svg>)



#### 4.1.2 定义闪屏主题

第二步是在 values/styles.xml 中定义一个 Splash 主题。



![SplashTheme.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1066" height="854"></svg>)



#### 4.1.3 设置主题

第三步是在清单文件中设置 Theme。



![ActivityTheme.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1066" height="644"></svg>)



#### 4.1.4 换回主题

第四步是在调用 super.onCreate 方法前切换回来



![换回主题.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)



### 4.2 异步初始化

我们这一节来看一下怎么用线程池进行异步初始化。

本节内容包括如下部分，

- 异步初始化简介
- 线程池大小
- 线程池基本用法

#### 4.2.1 异步初始化简介

异步优化就是把初始化的工作分细分成几个子任务，然后让子线程分别执行这些子任务，加快初始化过程。

如果你对怎么在 Android 中实现多线程不了解，可以看一下我的上一篇文章：探索 Android 多线程优化，在这篇文章中我对在 Android 使用多线程的方法做了一个简单的介绍。

有些初始化代码在子线程执行的时候可能会出现问题，比如要求在 onCreate 结束前执行完成。

这种情况我们可以考虑使用 CountDownLatch 实现，实在不行的时候就保留这段初始化代码在主线程中执行。

#### 4.2.2 线程池大小

我们可以使用线程池来实现异步初始化，使用线程池需要注意的是线程池大小的设置。

线程池大小要根据不同的设备设置不同的大小，有的手机是四核的，有的是八核的，如果把线程池大小设为固定数值的话是不合理的。

我们可以参考 AsyncTask 中设置的线程池大小，在 AsyncTask 中有 CPU_COUNT 和 CORE_POOL_SIZE。

- CPU_COUNT

  CPU_COUNT 的值是设备的 CPU 核数。

- CORE_POOL_SIZE

  CORE_POOL_SIZE 是线程池核心大小，这个值的最小值是 2，最大值是 Math.min(CPU_COUNT - 1, 4)。

  当设备的核数为 8 时，CORE_POOL_SIZE 的值为 4，当设备核数为 4 时，这个值是 3，也就是 CORE_POOL_SIZE 的最大值是 4。

#### 4.2.3 线程池基本用法

在这里我们可以参考 AsyncTask 的做法来设置线程池的大小，并把初始化的工作提交到线程池中。



![线程池.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1054" height="1168"></svg>)



## 6. 改进优化方案

上一节介绍了怎么通过线程池处理初始化任务，这一节我们看一下改进的异步初始化工具：启动器（LaunchStarter）。

这一节的内容包括如下部分。

- 线程池实现的不足
- 启动器简介
- 启动器工作流程
- 实现任务等待执行
- 实现任务依赖关系

### 6.1 线程池实现的不足

通过线程池处理初始化任务的方式存在三个问题。

- 代码不够优雅

  假如我们有 100 个初始化任务，那像上面这样的代码就要写 100 遍，提交 100 次任务。

- 无法限制在 onCreate 中完成

  有的第三方库的初始化任务需要在 Application 的 onCreate 方法中执行完成，虽然可以用 CountDownLatch 实现等待，但是还是有点繁琐。

- 无法实现存在依赖关系

  有的初始化任务之间存在依赖关系，比如极光推送需要设备 ID，而 initDeviceId() 这个方法也是一个初始化任务。

### 6.2 启动器简介

启动器的核心思想是充分利用多核 CPU ，自动梳理任务顺序。

第一步是我们要对代码进行任务化，任务化是一个简称，比如把启动逻辑抽象成一个任务。

第二步是根据所有任务的依赖关系排序生成一个有向无环图，这个图是自动生成的，也就是对所有任务进行排序。

比如我们有个任务 A 和任务 B，任务 B 执行前需要任务 A 执行完，这样才能拿到特定的数据，比如上面提到的 initDeviceId。

第三步是多线程根据排序后的优先级依次执行，比如我们现在有三个任务 A、B、C。

假如任务 B 依赖于任务 A，这时候生成的有向无环图就是 ACB，A 和 C 可以提前执行，B 一定要排在 A 之后执行。

### 6.3 启动器工作流程



![启动器流程图.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="577"></svg>)



- Head Task

  Head Task 就是所有任务执行前要做的事情，在这里初始化一些其他任务依赖的资源，也可以只是打个 Log。

- Tail Task

  Tail Task 可用于执行所有任务结束后打印一个 Log，或者是上报数据等任务。

- Idle Task

  Idle Task 是在程序空闲时执行的任务。

如果我们不使用异步的方案，所有的任务都会在主线程执行。

为了让其他线程分担主线程的工作，我们可以把初始化的工作拆分成一个个的子任务，采用并发的方式，使用多个线程同时执行这些子任务。

### 6.4 实现任务等待执行

启动器（LaunchStarter）使用了有向无环图实现任务之间的依赖关系，具体的代码可以在本文最下方找到。

使用启动器需要完成 3 个步骤。

- 添加依赖
- 定义任务
- 开始任务

下面我们来看下这 3 个步骤的具体操作。

#### 6.4.1 添加依赖

首先在项目根目录的 build.gradle 中添加 jitpack 仓库。

```
allprojects {
  repositories {
    // ...
    maven { url 'https://jitpack.io' }
  }
}
复制代码
```

然后在 app 模块的 build.gradle 中添加依赖

```
dependencies {
  // 启动器
  implementation 'com.github.zeshaoaaa:LaunchStarter:0.0.1'
}  
复制代码
```

#### 6.4.2 定义任务

定义任务这个步骤涉及了几个概念：MainTask、Task、needWait 和 run。

- MainTask

  MainTask 是需要在主线程执行的任务

- Task

  Task 就是在工作线程执行的任务。

- needWait

  InitWeexTask 中重写了 needWait 方法，这个方法返回 true 表示 onCreate 的执行需要等待这个任务完成。

- run

  run() 方法中的代码就是需要做的初始化工作



![InitWeexTask.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1160" height="784"></svg>)



#### 6.4.3 开始任务

定义好了任务后，我们就可以开始任务了。

这里需要注意的是，如果我们的任务中有需要等待完成的任务，我们可以调用 TaskDispatcher 的 await() 方法等待这个任务完成，比如 InitWeexTask。

使用 await() 方法要注意的是这个方法要在 start() 方法调用后才能使用。



![startDispatcher.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1160" height="678"></svg>)



### 6.5 实现任务依赖关系

除了上面提到的等待功能以外，启动器还支持任务之间存在依赖关系，下面我们来看一个极光推送初始化任务的例子。

在这一节会讲实现任务依赖关系的两个步骤。

- 定义任务
- 开始任务

#### 6.5.1 定义任务

在这里我们定义两个存在依赖关系的任务：GetDeviceIdTask 和 InitJPush Task。

首先定义 GetDeviceIdTask ，这个任务负责初始化设备 ID 。



![GetDeviceIdTask.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="766"></svg>)



然后定义InitJPushTask，这个任务负责初始化极光推送 SDK，InitJPushTask 在启动器中是尾部任务 Tail Task。

InitJPushTask 依赖于 GetDeviceIdTask，所以需要重写 dependsOn 方法，在 dependsOn 方法中创建一个 Class 列表，把想依赖的任务的 Class 添加到列表中并返回。



![InitJPushTask.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="911"></svg>)



#### 6.5.2 开始任务

GetDeviceIdTask 和 InitJPushTask 这两个任务都不需要等待 Application 的 onCreate 方法执行完成，所以我们这里不需要调用 TaskDispatcher 的 await 方法。



![startTask.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="734"></svg>)



#### 6.5.3 小结

上面这两个步骤就能实现通过启动器实现任务之间的依赖关系。

## 7. 延迟执行任务

在我们应用的 Application 和 Activity 中可能存在部分优先级不高的初始化任务，我们可以考虑把这些任务进行延迟初始化，比如放在列表的第一项显示出来后再进行初始化。

常规的延迟初始化方法有两种：onPreDraw 和 postDelayed。

除了常规方法外，还有一种改进的延迟初始化方案：延迟启动器。

本节包括如下内容。

- onPreDraw

  onPreDraw 指的是在列表第一项显示后，在 onPreDraw 回调中执行初始化任务

- postDelayed

  通过 Handler 的 postDelayed 方法延迟执行初始化任务

- 延迟启动器

### 7.1 onPreDraw

这一节我们来看下怎么通过 OnPreDrawListener 把任务延迟到列表显示后再执行。

下面是 onPreDraw 方式实现延迟初始化的 3 个步骤。

- 声明回调接口
- 调用接口方法
- 在 Activity 中监听
- 小结

#### 7.1.1 声明回调接口

第一步先声明一个 OnFeedShowCallback。



![OnFeedShowCallback.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="994" height="504"></svg>)



#### 7.1.2 调用接口方法

第二步是在 Adapter 中的第一条显示的时候调用 onFeedShow() 方法。



![AdapterOnFeedShow.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="1126"></svg>)



#### 7.1.3 在 Activity 中监听

第三步是在 Activity 中调用 setOnFeedCallback 方法。



![ActivityOnFeedShow.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1214" height="678"></svg>)



#### 7.1.4 小结

直接在 onFeedShow 中执行初始化任务的弊端是有可能导致滑动卡顿。

如果我们 onPreDraw 的方式延迟执行初始化任务，假如这个任务耗时是 2 秒，那就意味着在列表显示第一条后的 2 秒内，列表是无法滑动的，用户体验很差。

### 7.2 postDelayed

还有一种方式就是通过 Handler.postDelayed 方法发送一个延迟消息，比如延迟到 100 毫秒后执行。

假如在 Activity 中有 1 个 100 行的初始化方法，我们把前 10 行代码放在 postDelayed 中延迟 100 毫秒执行，把前 20 行代码放在 postDelayed 中延迟 200 毫秒执行。

这种实现的确缓解了卡顿的情况，但是这种实现存在两个问题

- 不够优雅

  假如按上面的例子，可以分出 10 个初始化任务，每一个都放在 不同的 postDelayed 中执行，这样写出来的代码不够优雅。

- 依旧卡顿

  假如把任务延迟 200 毫秒后执行，而 200 后用户还在滑动列表，那还是会发生卡顿。

### 7.3 延迟启动器

#### 7.3.1 延迟启动器基本用法

除了上面说到的方式外，现在我们来说一个更好的解决方案：延迟启动器。

延迟启动器利用了 IdleHandler 实现主线程空闲时才执行任务，IdleHandler 是 Android 提供的一个类，IdleHandler 会在当前消息队列空闲时才执行任务，这样就不会影响用户的操作了。

假如现在 MessageQueue 中有两条消息，在这两条消息处理完成后，MessageQueue 会通知 IdleHandler 现在是空闲状态，然后 IdleHandler 就会开始处理它接收到的任务。

DelayInitDispatcher 配合 onFeedShow 回调来使用效果更好。

下面是一段使用延迟启动器 DelayInitDispatcher 执行初始化任务的示例代码。



![DelayInitDispatcher.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="993"></svg>)



## 结语

看完了上面提到的一些启动优化技巧，你有没有得到一些启发呢？

又或者是你有没有自己的一些启动优化技巧，不妨在评论区给大家说说。

可能你觉得不值一提的技巧，能解决了其他同学的一个大麻烦。

## 参考文献

### 1. 视频

1. [国内Top团队大牛带你玩转Android性能分析与优化](https://coding.imooc.com/class/308.html)

### 2. 文章

1. [App startup time](https://developer.android.com/topic/performance/vitals/launch-time)
2. [Android App 冷启动优化方案](https://juejin.im/post/5aec28bb6fb9a07ac90d13dc)
3. [使用 CPU Profiler 检查 CPU Activity 和函数跟踪](https://developer.android.com/studio/profile/cpu-profiler)
4. [Overview of Systrace](https://developer.android.com/studio/profile/systrace)