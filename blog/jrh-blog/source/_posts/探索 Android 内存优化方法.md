---
title: 探索 Android 内存优化方法
date: 2019-12-29 22:50:20
categories:
- [java]
- [android]
tags:
- java
- kotlin
- android

---



# 探索 Android 内存优化方法

[来源](https://juejin.im/post/5d3ada056fb9a07eb94fd1bc)

![首图.jpg](https://user-gold-cdn.xitu.io/2019/7/26/16c2de38e6eae104?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

<!--more-->



![目录](https://user-gold-cdn.xitu.io/2019/7/29/16c3bf56cf1088f5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



## 前言

这篇文章的内容是我回顾和再学习 Android 内存优化的过程中整理出来的，整理的目的是让我自己对 Android 内存优化相关知识的认识更全面一些，分享的目的是希望大家也能从这些知识中得到一些启发。

Android 应用运行在 ART 环境上，ART 是基于 JVM 优化而来的，ART 优化的目标就是为了让 Android 应用能更高效地在 Android 平台运行。

不严谨地说，Android 应用就是一个在 Android 平台运行良好的 Java 程序，承载着 Android 应用的 ActivityThread 同样有 main 方法。

因此只有了解了 Java 的内存管理机制，才能更好地理解 Android 的内存管理机制，如果你对这一块还不熟悉的话，可以看我的上一篇文章 [探索 Java 内存管理机制](https://juejin.im/post/5d3a870df265da1b855c9d41)。

本文的内容可分为下面两部分，大家可以根据自己的需要选择性地阅读。

- 第一部分

  第一部分讲的是 Android 内存管理机制相关的一些知识，包括 Dalvik 虚拟机和 ART 环境等。

- 第二部分

  第二部分讲的是内存问题的解决与优化方法，包括 Memory Profiler、MAT 等工具的使用方法。

## 1. 为什么要做内存优化？

**内存优化能让应用挂得少、活得好和活得久**。

- 挂得少

  “挂”指的是 Crash，假如一个满分的应用是 100 分，那么一个会 Crash 的应用在用户心里会扣掉 90 分。

  就像是我们在一家店吃到了一盘很难吃的小龙虾，哪怕别人说这家店再好吃，我们以后都不想吃这家店了。

  导致 Android 应用 Crash 的原因有很多种，而做内存优化就能让我们的应用避免由内存问题引起的 Crash。

  内存问题导致 Crash 的具体表现就是内存溢出异常 OOM，引起 OOM 的原因有多种，在后面我会对它们做一个更详细的介绍。

- 活得好

  活得好指的是使用流畅，Android 中造成界面卡顿的原因有很多种，其中一种就是由内存问题引起的。

  内存问题之所以会影响到界面流畅度，是因为垃圾回收（GC，Garbage Collection），在 GC 时，所有线程都要停止，包括主线程，当 GC 和绘制界面的操作同时触发时，绘制的执行就会被搁置，导致掉帧，也就是界面卡顿。

  关于 GC 的更多介绍，可以看我的上一篇文章。

- 活得久

  活得久指的是我们的应用在后台运行时不会被干掉。

  Android 会按照特定的机制清理进程，清理进程时优先会考虑清理后台进程。

  清理进程的机制就是低杀，关于低杀在后面会有更详细的介绍。

  假如现在有个用户小张想在我们的电商应用买一个商品，千辛万苦挑到了一个自己喜欢的商品后，当他准备购买时，小张的老婆叫他去给孩子换尿布，等小张再打开应用时，发现商品页已经被关闭了，也就是应用被干掉了，这时小张又想起了孩子的奶粉钱，可能就放弃这次购买了。

  用户在移动设备上使用应用的过程中被打断是很常见的，如果我们的应用不能活到用户回来的时候，要用户再次进行操作的体验就会很差。

## 2. 什么是 Dalvik？

要了解 Android 应用的内存管理机制，就要了解承载着 Android 应用的虚拟机 Dalvik，虽然 Android 现在是使用的 ART 来承载应用的执行，但是 ART 也是基于 Dalvik 优化而来的。

Dalvik 是 Dalvik Virtual Machine（Dalvik 虚拟机）的简称，是 Android 平台的核心组成部分之一，Dalvik 与 JVM 的区别有如下几个。

### 2.1 Dalvik 与 JVM 的区别

- 架构

  JVM 是基于栈的，也就是需要在栈中读取数据，所需的指令会更多，这样会导致速度慢，不适合性能优先的移动设备。

  Dalvik 是基于寄存器的，指令更紧凑和简洁。

  由于显式指定了操作数，所以基于寄存器的指令会比基于栈的指令要大，但是由于指令数的减少，总的代码数不会增加多少。

- 执行代码不同

  在 Java SE 程序中，Java 类会被编译成一个或多个 .class 文件，然后打包成 jar 文件，JVM 会通过对应的 .class 文件和 jar 文件获取对应的字节码。

  而 Dalvik 会用 dx 工具将所有的 .class 文件转换为一个 .dex 文件，然后会从该 .dex 文件读取指令和数据。



![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="612" height="379"></svg>)



- Zygote

  Dalvik 由 Zygote 孵化器创建，Zygote 本身也是一个 Dalvik VM 进程，当系统需要创建一个进程时，Zygote 就会进行 fork，快速创建和初始化一个 DVM 实例。

  对于一些只读的系统库，所有的 Dalvik 实例都能和 Zygote 共享一块内存区域，这样能节省内存开销。

- 有限内存运行多进程

  在 Androd 中，每一个应用都运行在一个 Dalvik VM 实例中，每一个 Dalvik VM 都运行在一个独立的进程空间，这种机制使得 Dalvik 运行在有限的内存中同时运行多个进程。

- 共享机制

  Dalvik 拥有预加载—共享机制，不同应用之间在运行时可以共享相同的类，拥有更高的效率。

  而 JVM 不存在这种共享机制，不同的程序，打包后的程序都是彼此独立的，即使包中使用了同样的类，运行时也是单独加载和运行的，无法进行共享。

- 不是 JVM

  Dalvik 不是 Java 虚拟机，它并不是按照 Java 虚拟机规范实现的，两者之间并不兼容。

### 2.2 Dalvik 堆大小

每一个手机厂商都可以设定设备中每一个进程能够使用的堆大小，有关进程堆大小的值有下面三个。

1. dalvik.vm.heapstartsize

   堆分配的初始值大小，这个值越小，系统内存消耗越慢，但是当应用扩展这个堆，导致 GC 和堆调整时，应用会变慢。

   这个值越大，应用越流畅，但是可运行的应用也会相对减少。

2. dalvik.vm.heapgrowthlimit

   如果在清单文件中声明 largeHeap 为 true，则 App 使用的内存到 heapsize 才会 OOM，否则达到 heapgrowthlimit 就会 OOM。

3. dalvik.vm.heapsize

   进程可用的堆内存最大值，一旦应用申请的内存超过这个值，就会 OOM。

假如我们想看其中的一个值，我们可以通过命令查看，比如下面这条命令。

```
   adb shell getprop dalvik.vm.heapsize
复制代码
```

## 3. 什么是 ART？

ART 的全称是 Android Runtime，是从 Android 4.4 开始新增的**应用运行时环境**，用于替代 Dalvik 虚拟机。

Dalvik VM 和 ART 都可以支持已转换为 .dex（Dalvik Executable）格式的 Java 应用程序的运行。

ART 与 Dalvik 的区别有下面几个。

- 预编译

  Dalvik 中的应用每次运行时，字节码都需要通过即时编译器 JIT 转换为机器码，这会使得应用的运行效率降低。

  在 ART 中，系统在安装应用时会进行一次预编译，将字节码预先编译成机器码并存储在本地，这样应用就不用在每次运行时执行编译了，运行效率也大大提高。

- GC

  在 Dalvik 采用的垃圾回收算法是标记-清除算法，启动垃圾回收机制会造成两次暂停（一次在遍历阶段，另一次在标记阶段）。

  而在 ART 下，GC 速度比 Dalvik 要快，这是因为应用本身做了垃圾回收的一些工作，启动 GC 后，不再是两次暂停，而是一次暂停。

  而且 ART 使用了一种新技术（packard pre-cleaning），在暂停前做了许多事情，减轻了暂停时的工作量。

- 64 位

  Dalvik 是为 32 位 CPU 设计的，而 ART 支持 64 位并兼容 32 位 CPU，这也是 Dalvik 被淘汰的主要原因。

## 4. 什么是低杀？

### 4.1 低杀简介

在 Android 中有一个心狠手辣的杀手，要想让我们的应用活下来，就要在开发应用时格外小心。

不过我们也不用太担心，因为它只杀“坏蛋”，只要我们不使坏，那它就不会对我们下手。

这个杀手叫低杀，它的全名是 Low Memory Killer。

低杀跟垃圾回收器 GC 很像，GC 的作用是保证应用有足够的内存可以使用，而低杀的作用是保证系统有足够的内存可以使用。

GC 会按照引用的强度来回收对象，而低杀会按照进程的优先级来回收资源，在这里进程优先级就相当于是应用被用户“引用”的强度。

下面我们就来看看 Android 中的几种进程优先级。

### 4.2 进程优先级

在 Android 中不同的进程有着不同的优先级，当两个进程的优先级相同时，低杀会优先考虑干掉消耗内存更多的进程。

也就是如果我们应用占用的内存比其他应用少，并且处于后台时，我们的应用能在后台活下来，这也是内存优化为我们应用带来竞争力的一个直接体现。

#### 4.2.1 前台进程

前台进程（Foreground Process）是优先级最高的进程，是正在于用户交互的进程，如果满足下面一种情况，则一个进程被认为是前台进程。

1. Activity

   进程持有一个与用户交互的 Activity（该 Activity 的 onResume 方法被调用）

2. 进程持有一个 Service，并且这个 Service 处于下面几种状态之一

```
 * Service 与用户正在交互的 Activity 绑定
 * Service 调用了 startForeground() 方法
 * Service 正在执行以下生命周期函数（onCreate、onStart、onDestroy ）
复制代码
```

1. BroadcastReceiver

   进程持有一个 BroadcastReceiver，这个 BroadcastReceiver 正在执行它的 onReceive() 方法

#### 4.2.2 可见进程

可见进程（Visible Process）不含有任何前台组件，但用户还能再屏幕上看见它，当满足一下任一条件时，进程被认定是可见进程。

1. Activity

   进程持有一个 Activity，这个 Activity 处于 pause 状态，比如前台 Activity 打开了一个对话框，这样后面的 Activity 就处于 pause 状态

2. Service

   进程持有一个 Service 这个 Service 和一个可见的 Activity 绑定。

可见进程是非常重要的进程，除非前台进程已经把系统的可用内存耗光，否则系统不会终止可见进程。

#### 4.2.3 服务进程

服务进程（Service Process）可能在播放音乐或在后台下载文件，除非系统内存不足，否则系统会尽量维持服务进程的运行。

当一个进程满足下面一个条件时，系统会认定它为服务进程。

1. Service

   如果一个进程中运行着一个 Service，并且这个 service 是通过 startService 开启的，那这个进程就是一个服务进程。

#### 4.2.4 后台进程

系统会把后台进程（Background Process）保存在一个 LruCache 列表中，因为终止后台进程对用户体验影响不大，所以系统会酌情清理部分后台进程。

你可以在 Activity 的 onSaveInstanceState() 方法中保存一些数据，以免在应用在后台被系统清理掉后，用户已输入的信息被清空，导致要重新输入。

当一个进程满足下面条件时，系统会认定它为后台进程。

1. Activity

   当进程持有一个用户不可见的 Activity（Activity 的 onStop() 方法被调用），但是 onDestroy 方法没有被调用，这个进程就会被系统认定为后台进程。

#### 4.2.5 空进程

当一个进程不包含任何活跃的应用组件，则被系统认定为是空进程。

系统保留空进程的目的是为了加快下次启动进程的速度。

## 5. 图片对内存有什么影响？

大部分 App 都免不了使用大量的图片，比如电商应用和外卖应用等。

图片在 Android 中对应的是 Bitmap 和 Drawable 类，我们从网络上加载下来的图片最终会转化为 Bitmap。

图片会消耗大量内存，如果使用图片不当，很容易就会造成 OOM。

下面我们来看下 Bitmap 与内存有关的一些内容。

### 5.1 获取 Bitmap 占用的内存大小

1. Bitmap.getByteCount()

   Bitmap 提供了一个 getByteCount() 方法获取图片占用的内存大小，但是这个方法只能在程序运行时动态计算。

2. 图片内存公式

   图片占用内存公式：宽 * 高 * 一个像素占用的内存。

   假如我们现在有一张 2048 * 2048 的图片，并且编码格式为 ARGB_8888，那么这个图片的大小为 2048 * 2048 * 4 = 16, 777, 216 个字节，也就是 16M。

   如果厂商给虚拟机设置的堆大小是 256M，那么像这样的图片，应用最极限的情况只能使用 16 张。

   我们的应用在运行时，不仅仅是我们自己写的代码需要消耗内存，还有库中创建的对象同样需要占用堆内存，也就是别说 16 张，多来几张应用就挂了。

### 5.2 Bitmap 像素大小

一张图片中每一个像素的大小取决于它的解码选项，而 Android 中能够选择的 Bitmap 解码选项有四种。

下面四种解码选项中的的 ARGB 分别代表透明度和三原色 Alpha、Red、Green、Blue。

1. ARGB_8888

   ARGB 四个通道的值都是 8 位，加起来 32 位，也就是每个像素占 4 个字节

2. ARGB_4444

   ARGB 四个通道的值都是 4 位，加起来 16 位，也就是每个像素占 2 个字节

3. RGB_565

   RGB 三个通道分别是 5 位、6 位、5 位，加起来 16 位，也就是每个像素占 2 个字节

4. ALPHA_8

   只有 A 通道，占 8 位，也就是每个像素占 1 个字节

### 5.3 Glide

如果服务器返回给我们的图片是 200 * 200，但是我们的 ImageView 大小是 100 * 100，如果直接把图片加载到 ImageView 中，那就是一种内存浪费。

但是使用的 Glide 的话，那这个问题就不用担心了，因为 Glide 会根据 ImageView 的大小把图片大小调整成 ImageView 的大小加载图片，并且 Glide 有三级缓存，在内存缓存中，Glide 会根据屏幕大小选择合适的大小作为图片内存缓存区的大小。

## 6. 什么是内存泄漏？

### 6.1 内存泄漏简介

内存泄漏指的是，当一块内存没有被使用，但无法被 GC 时的情况。

堆中一块泄漏的内存就像是地上一块扫不掉的口香糖，都很让人讨厌。

一个典型的例子就是匿名内部类持有外部类的引用，外部类应该被销毁时，GC 却无法回收它，比如在 Activity 中创建 Handler 就有可能出现这种情况。

内存泄漏的表现就是可用内存逐渐减少，比如下图中是一种比较严重的内存泄漏现象，无法被回收的内存逐渐累积，直到无更多可用内存可申请时，就会导致 OOM。



![内存泄漏.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="528"></svg>)



### 6.2 常见的内存泄漏原因

常见的造成内存泄漏的原因有如下几个。

#### 6.2.1 非静态内部类

1. 原因

   非静态内部类会持有外部类的实例，比如匿名内部类。

   匿名内部类指的是一个没有人类可识别名称的类，但是在字节码中，它还是会有构造函数的，而它的构造函数中会包含外部类的实例。

   比如在 Activity 中以匿名内部类的方式声明 Handler 或 AsyncTask，当 Activity 关闭时，由于 Handler 持有 Activity 的强引用，导致 GC 无法对 Activity 进行回收。

   当我们通过 Handler 发送消息时，消息会加入到 MessageQueue 队列中交给 Looper 处理，当有消息还没发送完毕时，Looper 会一直运行，在这个过程中会一直持有 Handler，而 Handler 又持有外部类 Activity 的实例，这就导致了 Activity 无法被释放。

2. 解决

   我们可以把 Handler 或 AsyncTask 声明为静态内部类，并且使用 WeakReference 包住 Activity，这样 Handler 拿到的就是一个 Activity 的弱引用，GC 就可以回收 Activity。

   这种方式适用于所有匿名内部类导致的内存泄漏问题。

   ```
   public static class MyHandler extends Handler {
       Activity activity;
       
       public MyHandler(Activity activity) {
           activity = new WeakReference<>(activity).get();
       }
     
       @Override
       public void handleMessage(Message message) {
          // ...
       }
     
   }
   复制代码
   ```

#### 6.2.2 静态变量

1. 原因

   静态变量导致内存泄漏的原因是因为长生命周期对象持有了短生命周期对象的引用，导致短生命周期对象无法被释放。

   比如一个单例持有了 Activity 的引用，而 Activity 的生命周期可能很短，用户一打开就关闭了，但是单例的生命周期往往是与应用的生命周期相同的。

2. 解决

   如果单例需要 Context， 可以考虑使用 ApplicationContext，这样单例持有的 Context 引用就是与应用的生命周期相同的了。

#### 6.2.3 资源未释放

1. 忘了注销 BroadcastReceiver
2. 打开了数据库游标（Cursor）忘了关闭
3. 打开流忘了关闭
4. 创建了 Bitmap 但是调用 recycle 方法回收 Bitmap 使用的内存
5. 使用 RxJava 忘了在 Activity 退出时取消任务
6. 使用协程忘了在 Activity 退出时取消任务

#### 6.2.4 Webview

1. 原因

   不同的 Android 版本的 Webview 会有差异，加上不同厂商定制 ROM 的 Webview 的差异，导致 Webview 存在很大的兼容问题。

   一般情况下，在应用中只要使用一次 Webview，它占用的内存就不会被释放。

2. 解决

   [WebView内存泄漏--解决方法小结](https://juejin.im/post/WebView内存泄漏--解决方法小结)



## 7. 什么是内存抖动？

### 7.1 内存抖动简介

当我们在短时间内频繁创建大量临时对象时，就会引起内存抖动，比如在一个 for 循环中创建临时对象实例。

下面这张图就是内存抖动时的一个内存图表现，它的形状是锯齿形的，而中间的垃圾桶代表着一次 GC。

这个是 Memory Profiler 提供的内存实时图，后面会对 Memory Profiler 进行一个更详细的介绍。



![image](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1280" height="430"></svg>)



### 7.2 预防内存抖动的方法

- 尽量避免在循环体中创建对象
- 尽量不要在自定义 View 的 onDraw() 方法中创建对象，因为这个方法会被频繁调用
- 对于能够复用的对象，可以考虑使用对象池把它们缓存起来

## 8. 什么是 Memory Profiler？

### 8.1 Profiler

#### 8.1.1 Profiler 简介

Profiler 是 Android Studio 为我们提供的性能分析工具，它包含了 CPU、内存、网络以及电量的分析信息，而 Memory Profiler 则是 Profiler 中的其中一个版块。

打开 Profiler 有下面三种方式。

1. View > Tool Windows > Android Profiler
2. 下方的 Profiler 标签
3. 双击 shift 搜索 profiler

打开 Profiler 后，可以看到下面这样的面板，而在左边的 SESSIONS 面板的右上角，有一个加号，在这里可以选择我们想要进行分析的应用。



![Profiler](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="370"></svg>)



#### 8.1.2 Profiler 高级选项

开了高级选项后，我们在 Memory Profiler 中就能看到用一个白色垃圾桶表示的 GC 动作。

打开 Profiler 的方式：Run > Edit Configucation > Profiling > Enable advanced profiling

### 8.2 Memory Profiler 简介

Memory Profiler 是 Profiler 的其中一个功能，点击 Profiler 中蓝色的 Memory 面板，我们就进入了 Memory Profiler 界面。

### 8.3 堆转储

在堆转储（Dump Java Heap）面板中有 Instance View（实例视图）面板，Instance View 面板的下方有 References 和 Bitmap Preview 两个面板，通过 Bitmap Preview，我们能查看该 Bitmap 对应的图片是哪一张，通过这种方式，很容易就能找到图片导致的内存问题。

要注意的是，Bitmap Preview 功能只有在 7.1 及以下版本的设备中才能使用。



![堆转储.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="761"></svg>)



### 8.4 查看内存分配详情

在 7.1 及以下版本的设备中，可以通过 Record 按钮记录一段时间内的内存分配情况。

而在 8.0 及以上版本的设别中，可以通过拖动时间线来查看一段时间内的内存分配情况。

点击 Record 按钮后，Profiler 会为我们记录一段时间内的内存分配情况。在内存分配面板中，我们可以查看对象的分配的位置，比如下面的 Bitmap 就是在 onCreate 方法的 22 行创建的。



![查看内存分配.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1240" height="647"></svg>)



## 9. 什么是 MAT？

### 9.1 MAT 介绍

对于内存泄漏问题，Memory Profiler 只能给我们提供一个简单的分析，不能够帮我们确认具体发生问题的地方。

而 MAT 就可以帮我们做到这一点，MAT 的全称是 Memory Analyzer Tool，它是一款功能强大的 Java 堆内存分析工具，可以用于查找内存泄漏以及查看内存消耗情况。

### 9.2 MAT 使用步骤

要想通过 MAT 分析内存泄漏，我们做下面几件事情。

1. 到 MAT 的官网[下载 MAT](https://www.eclipse.org/mat/downloads.php)。

2. 使用 Memory Profiler 的堆转储功能，导出 hprof（Heap Profile）文件。

3. 配置 platform-tools 环境变量

4. 使用命令将 Memory Profiler 中导出来的 hprof 文件转换为 MAT 可以解析的 hprof 文件，命令如下

   ```
   platform-tools hprof-conv ../原始文件.hprof ../输出文件.hprof
   复制代码
   ```

5. 打开 MAT

6. File > open Heap dump ，选择我们转换后的文件

### 9.3 注意事项

1. 如果在 mac 上打不开 MAT，可以参考[Eclipse Memory Analyzer在Mac启动报错](https://www.jianshu.com/p/9bbbe3c4cc8b)

2. 如果在 mac 上配置 platform-tools 不成功的话，可以直接定位到 Android SDK 下的 platform-tools 目录，直接使用 hprof-conv 工具，命令如下

   ```
    hprof-conv -z ../原始文件.hprof ../输出文件.hprof
   复制代码
   ```

## 10. 怎么用 MAT 分析内存泄漏？

我在项目中定义了一个静态的回调列表 sCallbacks，并且把 MemoryLeakActivity 添加到了这个列表中，然后反复进出这个 Activity，我们可以看到这个 Activity 的实例有 8 个，这就属于内存泄漏现象，下面我们来看下怎么找出这个内存泄漏。

首先，按 9.2 小节的步骤打开我们的堆转储文件，打开后，我们可以看到 MAT 为我们分析的一个预览页。



![MAT 预览页.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1122" height="930"></svg>)



打开左上角的直方图，我们可以看到一个类列表，输入我们想搜索的类，就可以看到它的实例数。

![MAT 直方图.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="714" height="503"></svg>)



我们右键 MemoryLeakActivity 类，选择 List Objects > with incoming references 查看这个 Activity 的实例。

点击后，我们能看到一个实例列表，再右键其中一个实例，选择 Path to GC Roots > with all references 查看该实例被谁引用了，导致无法回收。



![MAT 实例列表.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="714" height="503"></svg>)



选择 with all references 后，我们可以看到该实例被静态对象 sCallbacks 持有，导致无法被释放。



![MAT 查看引用](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="901" height="435"></svg>)



这样就完成了一次简单的内存泄漏的分析。

## 11. 什么是 LeakCanary？

### 11.1 LeakCanary 简介

如果使用 MAT 来分析内存问题，会有一些难度，而且效率也不是很高。

为了能迅速发现内存泄漏，Square 公司基于 MAT 开源了 [LeakCanary](https://github.com/square/leakcanary)。

LeakCanary 是一个内存泄漏检测框架。

### 11.2 LeakCanary 原理

1. 检测保留的实例

   LeakCanary 是基于 LeakSentry 开发的，LeakSentry 会 hook Android 生命周期，自动检测当 Activity 或 Fragment 被销毁时，它们的实例是否被回收了。

   销毁的实例会传给 RefWatcher，RefWatcher 会持有它们的弱引用。

   你也可以观察所有不再需要的实例，比如一个不再使用的 View，不再使用的 Presenter 等。

   如果等待了 5 秒，并且 GC 触发了之后，弱引用还没有被清理，那么 RefWatcher 观察的实例就可能处于内存泄漏状态了。

2. 堆转储

   当保留实例（Retained Instance）的数量达到了一个阈值，LeakCanary 会进行堆转储，并把数据放进 hprof 文件中。

   当 App 可见时，这个阈值是 5 个保留实例，当 App 不可见时，这个阈值是 1 个保留实例。

3. 泄漏踪迹

   LeakCanary 会解析 hprof 文件，并且找出导致 GC 无法回收实例的引用链，这也就是泄漏踪迹（Leak Trace）。

   泄漏踪迹也叫最短强引用路径，这个路径是 GC Roots 到实例的路径。

4. 泄漏分组

   当有两个泄漏分析结果相同时，LeakCanary 会根据子引用链来判断它们是否是同一个原因导致的，如果是的话，LeakCanary 会把它们归为同一组，以免重复显示同样的泄漏信息。

### 11.2 安装 LeakCanary

#### 11.2.1 AndroidX 项目

1. 添加依赖

   ```
   dependencies {
     // 使用 debugImplementation 是因为 LeakCanary 一般不用于发布版本
     debugImplementation 'com.squareup.leakcanary:leakcanary-android:2.0-alpha-3'
   }
   复制代码
   ```

2. 监控特定对象

   LeakCanary 默认只监控 Activity 实例是否泄漏，如果我们想监控其他的对象是否也泄漏，就要使用 RefWatcher。

   ```
   // 1. 在 Application 中定义一个 RefWatcher 的静态变量
   companion object {
       val refWatcher = LeakSentry.refWatcher
   }	
   复制代码
   ```

   ```
   // 2. 使用 RefWatcher 监控该对象
   MyApplication.refWatcher.watch(object);
   复制代码
   ```

3. 配置监控选项

   ```
   private fun initLeakCanary() {
       LeakSentry.config = LeakSentry.config.copy(watchActivities = false)
   }
   复制代码
   ```

#### 11.2.1 非 AndroidX 项目

1. 添加依赖

   ```
   dependencies {
     debugImplementation 'com.squareup.leakcanary:leakcanary-android:1.6.3'
     releaseImplementation 'com.squareup.leakcanary:leakcanary-android-no-op:1.6.3'
     // 只有在你使用了 support library fragments 的时候才需要下面这一项
     debugImplementation 'com.squareup.leakcanary:leakcanary-support-fragment:1.6.3'
   }
   复制代码
   ```

2. 初始化 LeakCanary

   ```
   public class MyApplication extends Application {
   
     @Override public void onCreate() {
       super.onCreate();
       // 不需要在 LeakCanary 用来做堆分析的进程中初始化 LeakCanary
       if (!LeakCanary.isInAnalyzerProcess(this)) {
         LeakCanary.install(this);
         return;
       }
     }
   }
   复制代码
   ```

3. 监控特定对象

   ```
   // 1. 在 Application 中定义一个获取 RefWatcher 的静态方法
   public static RefWatcher getRefWatcher() {
       return LeakCanary.installedRefWatcher();
   }
   复制代码
   ```

   ```
   // 2. 使用 RefWatcher 监控该对象
   MyApplication.getRefWatcher().watch(object);
   复制代码
   ```

4. 配置监控选项

   ```
   public class MyApplication extends Application {
       private void installLeakCanary() {
           RefWatcher refWatcher = LeakCanary.refWatcher(this)
             .watchActivities(false)
             .buildAndInstall();
       }
   }
   复制代码
   ```

当安装完成，并且重新安装了应用后，我们可以在桌面看到 LeakCanary 用于分析内存泄漏的应用。

下面这两张图中，第一个是 LeakCanary 为非 AndroidX 项目安装的应用，第二个是 LeakCanary 为 AndroidX 项目安装的应用。



![内存泄漏进程.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="447" height="529"></svg>)



### 11.4 使用 LeakCanary 分析内存泄漏

下面是一个静态变量持有 Activity 导致 Activity 无法被释放的一个例子。

```
   public class MemoryLeakActivity extends AppCompatActivity {
   
       public static List<Activity> activities = new ArrayList<>();
   
       @Override
       protected void onCreate(@Nullable Bundle savedInstanceState) {
           super.onCreate(savedInstanceState);
           activities.add(this);
       }
   }
复制代码
```

我们可以在 Logcat 中看到泄漏实例的引用链。



![Locat 内存泄漏信息](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="973" height="886"></svg>)



除了 Logcat，我们还可以在 Leaks App 中看到引用链。

点击桌面上 LeakCanary 为我们安装的 Leaks 应用后，可以看到 activities 变量，之所以在这里会显示这个变量，是因为 LeakCanary 分析的结果是这个变量持有了某个实例，导致该实例无法被回收。



![Leaks1.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="660" height="368"></svg>)



点击这一项泄漏信息，我们可以看到一个泄漏信息概览页。



![Leaks2](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="590" height="1280"></svg>)



我们点击第一项 MemoryActivity Leaked，可以看到泄漏引用链的详情。



![Leaks3.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1093" height="1280"></svg>)



通过上面这些步骤，很简单地就能找到 LeakCanary 为我们分析的导致内存泄漏的地方。

## 12. 怎么获取和监听系统内存状态？

Android 提供了两种方式让我们可以监听系统内存状态，下面我们就来看看这两种方式的用法。

### 12.1 ComponentCallback2

在 Android 4.0 后，Android 应用可以通过在 Activity 中实现 ComponentCallback2 接口获取系统内存的相关事件，这样就能在系统内存不足时提前知道这件事，提前做出释放内存的操作，避免我们自己的应用被系统干掉。

ComponentCallnback2 提供了 onTrimMemory(level) 回调方法，在这个方法里我们可以针对不同的事件做出不同的释放内存操作。

```
   import android.content.ComponentCallbacks2
   
   class MainActivity : AppCompatActivity(), ComponentCallbacks2 {
   
       /**
        * 当应用处于后台或系统资源紧张时，我们可以在这里方法中释放资源，
        * 避免被系统将我们的应用进行回收
        * @param level 内存相关事件
        */
       override fun onTrimMemory(level: Int) {
   
           // 根据不同的应用生命周期和系统事件进行不同的操作
           when (level) {
   
               // 应用界面处于后台
               ComponentCallbacks2.TRIM_MEMORY_UI_HIDDEN -> {
                   // 可以在这里释放 UI 对象
               }
   
               // 应用正常运行中，不会被杀掉，但是系统内存已经有点低了
               ComponentCallbacks2.TRIM_MEMORY_RUNNING_MODERATE,
             
               // 应用正常运行中，不会被杀掉，但是系统内存已经非常低了，
               // 这时候应该释放一些不必要的资源以提升系统性能
               ComponentCallbacks2.TRIM_MEMORY_RUNNING_LOW,
             
               // 应用正常运行，但是系统内存非常紧张，
               // 系统已经开始根据 LRU 缓存杀掉了大部分缓存的进程
               // 这时候我们要释放所有不必要的资源，不然系统可能会继续杀掉所有缓存中的进程
               ComponentCallbacks2.TRIM_MEMORY_RUNNING_CRITICAL -> {
                   // 释放资源
               }
   
               // 系统内存很低，系统准备开始根据 LRU 缓存清理进程，
               // 这时我们的程序在 LRU 缓存列表的最近位置，不太可能被清理掉，
               // 但是也要去释放一些比较容易恢复的资源，让系统内存变得充足
               ComponentCallbacks2.TRIM_MEMORY_BACKGROUND,
             
               // 系统内存很低，并且我们的应用处于 LRU 列表的中间位置，
               // 这时候如果还不释放一些不必要资源，那么我们的应用可能会被系统干掉
               ComponentCallbacks2.TRIM_MEMORY_MODERATE,
             
               // 系统内存非常低，并且我们的应用处于 LRU 列表的最边缘位置，
               // 系统会有限考虑干掉我们的应用，如果想活下来，就要把所有能释放的资源都释放了
               ComponentCallbacks2.TRIM_MEMORY_COMPLETE -> {
                   /*
                    * 把所有能释放的资源都释放了
                   */
               }
   
               // 应用从系统接收到一个无法识别的内存等级值，
               // 跟一般的低内存消息提醒一样对待这个事件
               
               else -> {
                   // 释放所有不重要的数据结构。
               }
           }
       }
   }
复制代码
```

### 12.2 ActivityManager.getMemoryInfo()

Android 提供了一个 ActivityManager.getMemoryInfo() 方法给我们查询内存信息，这个方法会返回一个 ActivityManager.MemoryInfo 对象，这个对象包含了系统当前内存状态，这些状态信息包括可用内存、总内存以及低杀内存阈值。

MemoryInfo 中包含了一个 lowMemory 布尔值，这个布尔值用于表明系统是否处于低内存状态。

```
   fun doSomethingMemoryIntensive() {
       // 在做一些需要很多内存的任务前，
       // 检查设备是否处于低内存状态、
       if (!getAvailableMemory().lowMemory) {
           // 做需要很多内存的任务
       }
   }
   
   // 获取 MemoryInfo 对象
   private fun getAvailableMemory(): ActivityManager.MemoryInfo {
       val activityManager = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
       return ActivityManager.MemoryInfo().also { memoryInfo ->
           activityManager.getMemoryInfo(memoryInfo)
       }
   }
复制代码
```

## 13. 还有哪些内存优化技巧？

### 13.1 谨慎使用 Service

让一个没用的 Service 在后台运行对于一个应用的内存管理来说是一件最糟糕的事情。

要在 Service 的任务完成后停止它，不然 Service 占用的这块内存会泄漏。

当你的应用中运行着一个 Service，除非系统内存不足，否则它不会被干掉。

这就导致对于系统来说 Service 的运行成本很高，因为 Service 占用的内存其他的进程是不能使用的。

Android 有一个缓存进程列表，当可用内存减少时，这个列表也会随之缩小，这就会导致应用间的切换变得很慢。

如果我们是用 Service 监听一些系统广播，可以考虑使用 JobScheduler。

如果你真的要用 Service，可以考虑使用 IntentService，IntentService 是 Service 的一个子类，在它的内部有一个工作线程来处理耗时任务，当任务执行完后，IntentService 就会自动停止。

### 13.2 选择优化后的数据容器

Java 提供的部分数据容器并不适合 Android，比如 HashMap，HashMap 需要中存储每一个键值对都需要一个额外的 Entry 对象。

Android 提供了几个优化后的数据容器，包括 SparseArray、SparseBooleanArray 以及 LongSparseArray。

SparseArray 之所以更高效，是因为它的设计是只能使用整型作为 key，这样就避免了自动装箱的开销。

### 13.3 小心代码抽象

抽象可以优化代码的灵活性和可维护性，但是抽象也会带来其他成本。

抽象会导致更多的代码需要被执行，也就是需要更多的时间和把更多的代码映射到内存中。

如果某段抽象代码带来的好处不大，比如一个地方可以直接实现而不需要用到接口的，那就不用接口。

### 13.4 使用 protobuf 作为序列化数据

Protocol buffers 是 Google 设计的，它可以对结构化的数据序列化，与 XML 类似，不过比 XML 更小，更快，而且更简单。

如果你决定使用 protobuf 作为序列化数据格式，那在客户端代码中应该使用轻量级的 protobuf。

因为一般的 protobuf 会生成冗长的代码，这样会导致内存增加、APK 大小增加，执行速度变慢等问题。

更多关于 protobuf 的信息可以查看 [protobuf readme](https://android.googlesource.com/platform/external/protobuf/+/master/java/README.md#installation-lite-version-with-maven) 中的 “轻量级版本” 。

### 13.5 Apk 瘦身

有些资源和第三方库会在我们不知情的情况下大量消耗内存。

Bitmap 大小、资源、动画以及第三方库会影响到 APK 的大小，Android Studio 提供了 R8 和 ProGuard 帮助我们缩小 Apk，去掉不必要的资源。

如果你使用的 Android Studio 版本是 3.3 以下的，可以使用 ProGuard，3.3 及以上版本的可以使用 R8。

### 13.6 使用 Dagger2 进行依赖注入

依赖注入框架不仅可以简化我们的代码，而且能让我们在测试代码的时候更方便。

如果我们想在应用中使用依赖注入，可以考虑使用 Dagger2。

Dagger2 是在编译期生成代码，而不是用反射实现的，这样就避免了反射带来的内存开销，而是在编译期生成代码，

### 13.7 谨慎使用第三方库

当你决定使用一个不是为移动平台设计的第三方库时，你需要对它进行优化，让它能更好地在移动设备上运行。

这些第三方库包括日志、分析、图片加载、缓存以及其他框架，都有可能带来性能问题。

## 参考文献

### 1. 视频

1. [Top团队大牛带你玩转Android性能分析与优化](https://coding.imooc.com/learn/list/308.html)

### 2. 书籍

1. [《Android 移动性能实战》](https://book.douban.com/subject/27021800/)
2. [《Android 进阶解密》](https://book.douban.com/subject/30358046/)
3. [《深入解析Android虚拟机》](https://book.douban.com/subject/30160468/)

### 3. 文章

1. 国内
   1. [Android Low memory killer](https://www.jianshu.com/p/b5a8a1d09712)
   2. [Android onTrimMemory](https://www.jianshu.com/p/a20ff3a3c3b5)
   3. [关于 Android 中 Bitmap 的 ARGB_8888、ALPHA_8、ARGB_4444、RGB_565 的理解](https://www.jianshu.com/p/80b2068a90a8)
   4. [android dalvik heap 浅析](https://blog.csdn.net/cqupt_chen/article/details/11068129)
   5. [Android内存分配/回收的一个问题-为什么内存使用很少的时候也GC](https://www.jianshu.com/p/3233c33f6a79)
   6. [IntentService和Service区别](https://www.jianshu.com/p/5a32226d2ce0)
2. 国外
   1. [利用 Android Profiler 测量应用性能](https://developer.android.com/studio/profile/android-profiler)
   2. [Manage Your App's Memory](https://developer.android.google.cn/topic/performance/memory.html)
   3. [使用 Memory Profiler 查看 Java 堆和内存分配](https://developer.android.com/studio/profile/memory-profiler.html)
   4. [Performance tips](https://developer.android.com/training/articles/perf-tips)
   5. [LeakCanary 官网](https://square.github.io/leakcanary/)
   6. [进程和线程](https://developer.android.com/guide/components/processes-and-threads)