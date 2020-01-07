---
title: 探索 Android 多线程优化方法
date: 2019-12-28 22:50:20
categories:
- [java]
- [android]
tags:
- java
- kotlin
- android
---

## 

#  探索 Android 多线程优化方法

[来源](https://juejin.im/post/5d45a75de51d4561ee1bdf10)

## 前言

### 1. 基本介绍

在我学习 Android 多线程优化方法的过程中，发现我对多线程优化的了解太片面。

写这篇文章的目的是完善我对 Android 多线程优化方法的认识，分享这篇文章的目的是希望大家也能从这些知识从得到一些启发。

这篇文章分为下面三部分。

- 第一部分

  第一部分讲的是多线程优化的基础知识，包括线程的介绍和线程调度基本原理的介绍。

- 第二部分

  第二部分讲的是多线程优化需要预防的一些问题，包括线程安全问题的介绍和实现线程安全的办法。

- 第三部分

  第三部分讲的是多线程优化可以使用的一些方法，包括线程之间的协作方式与 Android 执行异步任务的常用方式。
  
  <!--more-->

### 2. 阅读技巧

在阅读本文时，画图和思考可以帮助你更好地记忆和理解文中的内容。

- 画图

  画图指的是把每一节的重点画在思维导图的节点上。

  思维导图可以让随意信息在视觉上建立起一种视觉上的关联。

  随意信息指的是不存在逻辑关系的信息，比如线程的名字和线程的状态就是一种随意信息。

  随意信息的特点就是它们之间不存在逻辑关联，导致记忆困难。

  通过建立关联，我们大脑能更好地记忆随意信息。

- 思考

  学习不是为了被现有的知识所束缚，而是以现有的知识为基石，发展出新的思想。

  阅读本文时，可以带着下面这些问题边思考边阅读。

  - 这个说法的依据是什么？
  - 怎么以自己的方式去解释这个概念？
  - 怎么在自己的项目中应用这个技巧？
  - 这个概念的具体代码实现是怎样的？
  - 这个实现存在哪些问题？

### 3. 缩略词

- AS

  Android Studio（Android 应用开发工具）

- GC

  - Garbage Collector（垃圾回收器）
  - Garbage Collection（垃圾回收动作）

- ART

  Android Runtime（Android 应用运行时环境）

- JVM

  Java Virtual Machine（Java 虚拟机）

- JUC

  java.util.concurrent（Java 并发包）

## 1. 能不能不用多线程？

**不管你懂不懂多线程，你也必须要用多线程**。

- GC 线程

  假如我们现在运行的是用 AS 建的一个啥也没有的 demo 项目，那也不代表我们运行的是一个单线程应用。

  因为这个应用是运行在 ART 上的，而 ART 自带了 GC 线程，再加上主线程，它依旧是一个多线程应用。

- 第三方线程

  在我们开发应用的过程中，即使我们没有直接创建线程，也间接地创建了线程。

  因为我们日常使用的第三方库，包括 Android 系统本身都用到了多线程。

  比如 Glide 就是使用工作线程从网络上加载图片，等图片加载完毕后，再切回主线程把图片设置到 ImageView 中。

- 硬性要求

  假如我们的应用中只有一个线程，意味着加载图片时 Loading 动画无法播放，界面是卡死的，用户会失去耐心。

  而且 Android 强制要求开发者在发起网络请求时，必须在工作线程，不能在主线程，也就是开发 Android 应用必须使用多线程。

## 2. 为什么要做多线程优化？

既然上面说到了使用多线程是不可避免的，那使用多线程又会遇到哪些问题呢？

**做多线程优化是为了解决多线程的安全性和活跃性问题。**

这两个问题会导致多线程程序输出错误的结果以及任务无法执行，下面我们就来看看这两个问题的表现。

- 安全性问题

  假如现在有两个厨师小张和老王，他们两个人分别做两道菜，大家都知道自己的菜放了多少盐，多少糖，在这种情况下出问题的概率比较低。

  但是如果两个人做一个菜呢？

  小张在做一个菜，做着做着锅被老王抢走了，老王不知道小张有没有放盐，就又放了一次盐，结果炒出来的菜太咸了，没法吃，然后他们就决定要出去皇城 PK。

  这里的“菜”对应着我们程序中的数据。

  而这种现象就是导致线程出现安全性的原因之一：竞态（Race Condition）。

  之所以会出现竞态是由 Java 的内存模型和线程调度机制决定的，关于 Java 的线程调度机制，在后面会有更详细的介绍。

- 活跃性问题

  自从上次出了皇城 PK 的事情后，经理老李出了一条规定，打架扣 100，这条规定一出，小张和老王再也不敢 PK 了，不过没过几天，他们就找到了一种新的方式来互怼。

  有一天，小张在做菜，小张要先放盐再放糖，而老王拿着盐，老王要先放糖再放盐，结果过了两个小时两个人都没把菜做出来，经理老李再次陷入懵逼的状态。

  这就是线程活跃性问题的现象之一：死锁（Deadlock）。

关于线程安全性的三个问题和线程活跃性的四个问题，在本文后面会做更详细的介绍。

## 3. 什么是线程？

上一节我们讲到了多线程编程可能会导致程序出现这样那样的问题，那什么是线程呢？

我们这一节的内容包括下面几个部分。

- 线程简介
- 线程的四个属性
- 线程的六个方法
- 线程的六种状态

### 3.1 线程简介

**线程是进程中可独立执行的最小单位，也是 CPU 资源分配的基本单位**。

进程是程序向操作系统申请资源的基本条件，一个进程可以包含多个线程，同一个进程中的线程可以共享进程中的资源，如内存空间和文件句柄。

操作系统会把资源分配给进程，但是 CPU 资源比较特殊，它是分配给线程的，这里说的 CPU 资源也就是 CPU 时间片。

进程与线程的关系，就像是饭店与员工的关系，饭店为顾客提供服务，而提供服务的具体方式是通过一个个员工实现的。

线程的作用是执行特定任务，这个任务可以是下载文件、加载图片、绘制界面等。

### 3.2 线程的四个属性

线程有编号、名字、类别以及优先级四个属性，除此之外，线程的部分属性还具有继承性，下面我们就来看看线程的四个属性的作用和线程的继承性。

#### 3.2.1 编号

- 作用

  线程的编号（id）用于标识不同的线程，每条线程拥有不同的编号。

- 注意事项

  - 不能作为唯一标识

    某个编号的线程运行结束后，该编号可能被后续创建的线程使用，因此编号不适合用作唯一标识

  - 只读

    编号是只读属性，不能修改

#### 3.2.2 名字

每个线程都有自己的名字（name），名字的默认值是 Thread-线程编号，比如 Thread-0 。

除了默认值，我们也可以给线程设置名字，以我们自己的方式去区分每一条线程。

- 作用

  给线程设置名字可以让我们在某条线程出现问题时，用该线程的名字快速定位出问题的地方

#### 3.2.3 类别

线程的类别（daemon）分为守护线程和用户线程，我们可以通过 setDaemon(true) 把线程设置为守护线程。

当 JVM 要退出时，它会考虑是否所有的用户线程都已经执行完毕，是的话则退出。

而对于守护线程，JVM 在退出时不会考虑它是否执行完成。

- 作用

  守护线程通常用于执行不重要的任务，比如监控其他线程的运行情况，GC 线程就是一个守护线程。

- 注意事项

  setDaemon() 要在线程启动前设置，否则 JVM 会抛出非法线程状态异常（IllegalThreadStateException）。

#### 3.2.4 优先级

- 作用

  线程的优先级（Priority）用于表示应用希望优先运行哪个线程，线程调度器会根据这个值来决定优先运行哪个线程。

- 取值范围

  Java 中线程优先级的取值范围为 1~10，默认值是 5，Thread 中定义了下面三个优先级常量。

  - 最低优先级：MIN_PRIORITY = 1
  - 默认优先级：NORM_PRIORITY = 5
  - 最高优先级：MAX_PRIORITY = 10

- 注意事项

  - 不保证

    线程调度器把线程的优先级当作一个参考值，不一定会按我们设定的优先级顺序执行线程

  - 线程饥饿

    优先级使用不当会导致某些线程永远无法执行，也就是线程饥饿的情况，关于线程饥饿，在第 7 大节会有更多的介绍

#### 3.2.5 继承性

线程的继承性指的是线程的类别和优先级属性是会被继承的，线程的这两个属性的初始值由开启该线程的线程决定。

假如优先级为 5 的守护线程 A 开启了线程 B，那么线程 B 也是一个守护线程，而且优先级也是 5 。

这时我们就把线程 A 叫做线程 B 的父线程，把线程 B 叫做线程 A 的子线程。

### 3.3 线程的六个方法

线程的常用方法有六个，它们分别是三个非静态方法 start()、run()、join() 和三个静态方法 currentThread()、yield()、sleep() 。

下面我们就来看下这六个方法都有哪些作用和注意事项。

#### 3.3.1 start()

- 作用

  start() 方法的作用是启动线程。

- 注意事项

  该方法只能调用一次，再次调用不仅无法让线程再次执行，还会抛出非法线程状态异常。

#### 3.3.2 run()

- 作用

  run() 方法中放的是任务的具体逻辑，该方法由 JVM 调用，一般情况下开发者不需要直接调用该方法。

- 注意事项

  如果你调用了 run() 方法，加上 JVM 也调用了一次，那这个方法就会执行两次

#### 3.3.3 join()

- 作用

  join() 方法用于等待其他线程执行结束。

  如果线程 A 调用了线程 B 的 join() 方法，那线程 A 会进入等待状态，直到线程 B 运行结束。

- 注意事项

  join() 方法导致的等待状态是可以被中断的，所以调用这个方法需要捕获中断异常

#### 3.3.4 Thread.currentThread()

- 作用

  currentThread() 方法是一个静态方法，用于获取执行当前方法的线程。

  我们可以在任意方法中调用 Thread.currentThread() 获取当前线程，并设置它的名字和优先级等属性。

#### 3.3.5 Thread.yield()

- 作用

  yield() 方法是一个静态方法，用于使当前线程放弃对处理器的占用，相当于是降低线程优先级。

  调用该方法就像是是对线程调度器说：“如果其他线程要处理器资源，那就给它们，否则我继续用”。

- 注意事项

  该方法不一定会让线程进入暂停状态。

#### 3.3.6 Thread.sleep(ms)

- 作用

  sleep(ms) 方法是一个静态方法，用于使当前线程在指定时间内休眠（暂停）。

线程不止提供了上面的 6 个方法给我们使用，而其他方法的使用在文章的后面会有一个更详细的介绍。

### 3.4 线程的六种状态

#### 3.4.1 线程的生命周期

和 Activity 一样，线程也有自己的生命周期，而且生命周期事件也是由用户（开发者）触发的。

从 Activity 的角度来看，用户点击按钮后打开一个 Activity，就相当于是触发了 Activity 的 onCreate() 方法。

从线程的角度来看，开发者调用了 start() 方法，就相当于是触发了 Thread 的 run() 方法。

如果我们在上一个 Activity 的 onPause() 方法中进行了耗时操作，那么下一个 Activity 的显示也会因为这个耗时操作而慢一点显示，这就相当于是 Thread 的等待状态。

线程的生命周期不仅可以由开发者触发，还会受到其他线程的影响，下面是线程各个状态之间的转换示意图。



![线程的生命周期.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1015" height="1243"></svg>)



我们可以通过 Thread.getState() 获取线程的状态，该方法返回的是一个枚举类 Thread.State。

线程的状态有新建、可运行、阻塞、等待、限时等待和终止 6 种，下面我们就来看看这 6 种状态之间的转换过程。

#### 3.4.2 新建状态

当一个线程创建后未启动时，它就处于新建（NEW）状态。

#### 3.4.3 可运行状态

当我们调用线程的 start() 方法后，线程就进入了可运行（RUNNABLE）状态。

可运行状态又分为预备（READY）和运行（RUNNING）状态。

- 预备状态

  处于预备状态的线程可被线程调度器调度，调度后线程的状态会从预备转换为运行状态，处于预备状态的线程也叫活跃线程。

- 运行状态

  运行状态表示线程正在运行，也就是处理器正在执行线程的 run() 方法。

  当线程的 yield() 方法被调用后，线程的状态可能由运行状态变为预备状态。

#### 3.4.4 阻塞状态

当下面几种情况发生时，线程就处于阻塞（BLOCKED）状态。

- 发起阻塞式 I/O 操作
- 申请其他线程持有的锁
- 进入一个 synchronized 方法或代码块失败

#### 3.4.5 等待状态

一个线程执行特定方法后，会等待其他线程执行执行完毕，此时线程进入了等待（WAITING）状态。

- 等待状态

  下面的几个方法可以让线程进入等待状态。

  - Object.wait()
  - LockSupport.park()
  - Thread.join()

- 可运行状态

  下面的几个方法可以让线程从等待状态转变为可运行状态，而这种转变又叫唤醒。

  - Object.notify()
  - Object.notifyAll()
  - LockSupport.unpark()

#### 3.4.6 限时等待状态

限时等待状态 （TIMED_WAITING）与等待状态的区别就是，限时等待是等待一段时间，时间到了之后就会转换为可运行状态。

下面的几个方法可以让线程进入限时等待状态，下面的方法中的 ms、ns、time 参数分别代表毫秒、纳秒以及绝对时间。

- Thread.sleep(ms)
- Thread.join(ms)
- Object.wait(ms)
- LockSupport.parkNonos(ns)
- LockSupport.parkUntil(time)

#### 3.4.7 终止状态

当线程的任务执行完毕或者任务执行遇到异常时，线程就处于终止（TERMINATED）状态。

## 4. 线程调度的原理是什么？

阅读完上一节的内容后，我们对线程有了基本的了解，知道了什么是线程，也知道了线程的生命周期是怎么流转的。

这一节我们就来看看线程是怎么被调度的，这一节包括以下内容。

- Java 内存模型简介
- 高速缓存
- Java 线程调度机制

### 4.1 Java 的内存模型简介

了解 Java 的内存模型，能帮助我们更好地理解线程的安全性问题，下面我们就来看看什么是 Java 的内存模型。



![Java 内存模型.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="792" height="523"></svg>)



Java 内存模型（Java Memory Model，JMM）规定了所有变量都存储在主内存中，每条线程都有自己的工作内存。

JVM 把内存划分成了好几块，其中方法区和堆内存区域是线程共享的。

假如现在有三个线程同时对值为 5 的变量 a 进行自增操作，那最终的结果应该是 8 。

但是自增的真正实现是分为下面三步的，而不是一个不可分割的（原子的）操作。

1. 将变量 a 的值赋值给临时变量 temp
2. 将 temp 的值加 1
3. 将 temp 的值重新赋给变量 a。

假如线程 1 在进行到第二步的时候，其他两条线程读取了变量 a ，那么最终的结果就是 7，而不是预期的 8 。

这种现象就是线程安全的其中一个问题：原子性。

### 4.2 高速缓存

#### 4.2.1 高速缓存简介



![现代计算机系统高速缓存结构.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="606" height="466"></svg>)



现代处理器的处理能力要远胜于主内存（DRAM）的访问速率，主内存执行一次内存读/写操作需要的时间，如果给处理器使用，处理器可以执行上百条指令。

为了弥补处理器与主内存之间的差距，硬件设计者在主内存与处理器之间加入了高速缓存（Cache）。

处理器执行内存读写操作时，不是直接与主内存打交道，而是通过高速缓存进行的。

高速缓存相当于是一个由硬件实现的容量极小的散列表，这个散列表的 key 是一个对象的内存地址，value 可以是内存数据的副本，也可以是准备写入内存的数据。

#### 4.2.2 高速缓存内部结构



![高速缓存内部结构.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="627" height="349"></svg>)



从内部结构来看，高速缓存相当于是一个链式散列表（Chained Hash Table），它包含若干个桶，每个桶包含若干个缓存条目（Cache Entry）。

#### 4.2.3 缓存条目结构



![缓存条目结构.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="526" height="175"></svg>)



缓存条目可进一步划分为 Tag、Data Block 和 Flag 三个部分。

- Tag

  Tag 包含了与缓存行中数据对应的内存地址的部分信息（内存地址的高位部分比特）

- Data Block

  Data Block 也叫缓存行（Cache Line），是高速缓存与主内存之间数据交换的最小单元，可以存储从内存中读取的数据，也可以存储准备写进内存的数据。

- Flag

  Flag 用于表示对应缓存行的状态信息

### 4.3 Java 线程调度原理

在任意时刻，CPU 只能执行一条机器指令，每个线程只有获取到 CPU 的使用权后，才可以执行指令。

也就是在任意时刻，只有一个线程占用 CPU，处于运行的状态。

多线程并发运行实际上是指多个线程轮流获取 CPU 使用权，分别执行各自的任务。

线程的调度由 JVM 负责，线程的调度是按照特定的机制为多个线程分配 CPU 的使用权。

线程调度模型分为两类：分时调度模型和抢占式调度模型。

- 分时调度模型

  分时调度模型是让所有线程轮流获取 CPU 使用权，并且平均分配每个线程占用 CPU 的时间片。

- 抢占式调度模型

  JVM 采用的是抢占式调度模型，也就是先让优先级高的线程占用 CPU，如果线程的优先级都一样，那就随机选择一个线程，并让该线程占用 CPU。

  也就是如果我们同时启动多个线程，并不能保证它们能轮流获取到均等的时间片。

  如果我们的程序想干预线程的调度过程，最简单的办法就是给每个线程设定一个优先级。

## 5. 什么是线程的安全性问题？

阅读完上一节的内容后，我们对 Java 的线程调度机制有了基本的了解。

这一节我们就来看看线程调度机制导致的线程安全问题，这一节的内容包括以下几个部分。

- 竞态
- 原子性
- 可见性
- 有序性

### 5.1 竞态

线程安全问题不是说线程不安全，也不是说线程弄不好把手机都搞爆炸了。

线程安全问题指的是多个线程之间对一个或多个共享可变对象交错操作时，有可能导致数据异常。

多线程编程中经常遇到的问题就是一样的输入在不同的时间有不一样的输出，这种一个计算结果的正确性与时间有关的现象就是竞态，也就是计算的正确性依赖于相对时间顺序或线程的交错。

竞态不一定导致计算结果的不正确，而是不排除计算结果有时正确有时错误的可能。

竞态往往伴随着脏数据和丢失更新的问题，脏数据就是线程读到一个过时的数据，丢失更新就是一个线程对数据做的更新，没有体现在后续其他线程对该数据的读取上。

对于共享变量，竞态可以看成访问（读/写）同一组共享变量的多个线程锁执行的操作相互交错，比如一个线程读取共享变量，并以该共享变量为基础进行计算的期间，另一个线程更新了该共享变量的值，导致脏数据或丢失更新。

对于局部变量，由于不同的线程各自访问的是自己的局部变量，所以局部变量的使用不会导致竞态。

### 5.2 原子性

原子（Atomic）的字面意识是不可分割的，对于涉及共享变量访问的操作，若该操作从其执行线程以外的任意线程看来是不可分割的，那么该操作就是原子操作，相应地称该操作具有原子性（Atomicity）。

所谓不可分割，就是访问（读/写）某个共享变量的操作，从执行线程以外的其他线程看来，该操作只有未开始和结束两种状态，不会知道该操作的中间部分。

拿炒菜举例，炒菜可分为几个步骤：放油、放菜、放盐、放糖等。

但是从客人的角度来看，一个菜只有两种状态：没做好和做好了。

访问同一组共享变量的原子操作是不能被交错的，这就排除了一个线程执行一个操作的期间，另一个线程读取或更新该操作锁访问的共享变量，导致脏数据和丢失更新。

### 5.3 可见性

在多线程环境下，一个线程对某个共享变量进行更新后，后续访问该变量的线程可能无法立刻读取到这个更新的结果，甚至永远也无法读取到这个更新的结果，这就是线程安全问题的另一种表现形式：可见性。

可见性是指一个线程对共享变量的更新，对于其他读取该变量的线程是否可见。

可见性问题与计算机的存储系统有关，程序中的变量可能会被分配到寄存器而不是主内存中，每个处理器都有自己的寄存器，一个处理器无法读取另一个处理器的寄存器上的内容。

即使共享变量是分配到主内存中存储的，也不饿能保证可见性，因为处理器不是直接访问主内存，而是通过高速缓存进行的。

一个处理器上运行的线程对变量的更新，可能只是更新到该处理器的写缓冲器（Store Buffer）中，还没有到高速缓存中，更别说处理器了。

可见性描述的是一个线程对共享变量的更新，对于另一个线程是否可见，保证可见性意味着一个线程可以读取到对应共享变量的新值。

从保证线程安全的角度来看，光保证原子性还不够，还要保证可见性，同时保证可见性和原子性才能确保一个线程能正确地看到其他线程对共享变量做的更新。

### 5.4 有序性

有序性是指一个处理器在为一个线程执行的内存访问操作，对于另一个处理器上运行的线程来看是乱序的。

顺序结构是结构化编程中的一种基本结构，它表示我们希望某个操作先于另外一个操作执行。

但是在多核处理器的环境下，代码的执行顺序是没保障的，编译器可能改变两个操作的先后顺序，处理器也可能不是按照程序代码的顺序执行指令

重排序（Reordering）处理器和编译器是对代码做的一种优化，它可以在不影响单线程程序正确性的情况下提升程序的性能，但是它会对多线程程序的正确性产生影响，导致线程安全问题。

现代处理器为了提高指令的执行效率，往往不是按程序顺序注意执行指令的，而是哪条指令就绪就先执行哪条指令，这就是处理器的乱序执行。

## 6. 怎么实现线程安全？

要实现线程安全就要保证上面说到的原子性、可见性和有序性。

常见的实现线程安全的办法是使用锁和原子类型，而锁可分为内部锁、显式锁、读写锁、轻量级锁（volatile）四种。

下面我们就来看看这四种锁和原子类型的用法和特点。

### 6.1 锁



![锁示意图.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1024" height="648"></svg>)



文章的开头提到的“打架扣 100”就是一种现实生活中的锁，可以让小张和老王乖乖干活，别再炒出不能吃的菜。

这也就是锁（Lock）的作用，让多个线程更好地协作，避免多个线程的操作交错导致数据异常的问题。

#### 6.1.1 锁的五个特点

- 临界区

  持有锁的线程获得锁后和释放锁前执行的代码叫做临界区（Critical Section）。

- 排他性

  锁具有排他性，能够保障一个共享变量在任一时刻只能被一个线程访问，这就保证了临界区代码一次只能够被一个线程执行，临界区的操作具有不可分割性，也就保证了原子性。

- 串行

  锁相当于是把多个线程对共享变量的操作从并发改为串行。

- 三种保障

  锁能够保护共享变量实现线程安全，它的作用包括保障原子性、可见性和有序性。

- 调度策略

  锁的调度策略分为公平策略和非公平策略，对应的锁就叫公平锁和非公平锁。

  公平锁会在加锁前查看是否有排队等待的线程，有的话会优先处理排在前面的线程。

  公平锁以增加上下文切换为代价，保障了锁调度的公平性，增加了线程暂停和唤醒的可能性。

#### 6.1.2 锁的两个问题

- 锁泄漏

  锁泄漏是指一个线程获得锁后，由于程序的错误导致锁一直无法被释放，导致其他线程一直无法获得该锁。

- 活跃性问题

  锁泄漏会导致活跃性问题，这些问题包括死锁、和锁死等。

### 6.2 内部锁

#### 6.2.1 内部锁简介

Java 为我们提供了 synchronized 关键字来实现内部锁，被 synchronized 关键字修饰的方法和代码块就叫同步方法和同步代码块。

下面我们来看下内部锁的七个特点。

- 监视器锁

  因为使用 synchronized 实现的线程同步是通过监视器（monitor）来实现的，所以内部锁也叫监视器锁。

- 自动获取/释放

  线程对同步代码块的锁的申请和释放由 JVM 内部实施，线程在进入同步代码块前会自动获取锁，并在退出同步代码块时自动释放锁，这也是同步代码块被称为内部锁的原因。

- 锁定方法/类/对象

  synchronized 关键字可以用来修饰方法，锁住特定类和特定对象。

- 临界区

  同步代码块就是内部锁的临界区，线程在执行临界区代码前必须持有该临界区的内部锁。

- 锁句柄

  内部锁锁的对象就叫锁句柄，锁句柄通常会用 private 和 final 关键字进行修饰。

  因为锁句柄变量一旦改变，会导致执行同一个同步代码块的多个线程实际上用的是不同的锁。

- 不会泄漏

  泄漏指的是锁泄漏，内部锁不会导致锁泄漏，因为 javac 编译器把同步代码块编译为字节码时，对临界区中可能抛出的异常做了特殊处理，这样临界区的代码出了异常也不会妨碍锁的释放。

- 非公平锁

  内部锁是使用的是非公平策略，是非公平锁，也就是不会增加上下文切换开销。

#### 6.2.2 内部锁基本用法

```
// 锁句柄
private final String hello = "hello";

private void getLock1() {
  synchronized (hello) {
    System.out.println("ThreadA 拿到了内部锁");
    ThreadUtils.sleep(2 * 1000);
  }
  System.out.println("ThreadA 释放了内部锁");
}
复制代码
private void getLock2() {
  System.out.println("ThreadB 尝试获取内部锁");
  synchronized (hello) {
    System.out.println("ThreadB 拿到了内部锁");
  }
  System.out.println("ThreadB 继续执行");
}
复制代码
```

当我们在两个线程中分别运行上面两个函数后，我们可以得到下面的输出。

```
ThreadA 拿到了内部锁
ThreadB 尝试获取内部锁
ThreadA 释放了内部锁
ThreadB 拿到了内部锁
ThreadB 继续执行
复制代码
```

### 6.3 显式锁

#### 6.3.1 显式锁简介

显式锁（Explict Lock）是 Lock 接口的实例，Lock 接口对显式锁进行了抽象，ReentrantLock 是它的实现类。

下面是显式锁的四个特点。

- 可重入

  显式锁是可重入锁，也就是一个线程持有了锁后，能再次成功申请这个锁。

- 手动获取/释放

  显式锁与内部锁区别在于，使用显式锁，我们要自己释放和获取锁，为了避免锁泄漏，我们要在 finally 块中释放锁

- 临界区

  lock() 与 unlock() 方法之间的代码就是显式锁的临界区

- 公平/非公平锁

  显式锁允许我们自己选择锁调度策略。

  ReentrantLock 有一个构造函数，允许我们传入一个 fair 值，当这个值为 true 时，说明现在创建的这个锁是一个公平锁。

  由于公平锁的开销比非公平锁大，所以 ReentrantLock 的默认调度策略是非公平策略。

#### 6.3.2 显式锁基本用法

```
private final Lock lock = new ReentrantLock();

private void lock1() {
  lock.lock();
  System.out.println("线程 1 获取了显式锁");
  try {
    System.out.println("线程 1 开始执行操作");
    ThreadUtils.sleep(2 * 1000);
  } finally {
    lock.unlock();
    System.out.println("线程 1 释放了显式锁");
  }
}
复制代码
private void lock2() {
  lock.lock();
  System.out.println("线程 2 获取了显式锁");
  try {
    System.out.println("线程 2 开始执行操作");
  } finally {
    System.out.println("线程 2 释放了显式锁");
    lock.unlock();
  }
}
复制代码
```

当我们分别在两个线程中分别执行了上面的两个函数后，我们可以得到下面的输出。

```
线程 1 获取了显式锁
线程 1 开始执行操作
线程 1 释放了显式锁
线程 2 获取了显式锁
线程 2 开始执行操作
线程 2 释放了显式锁
复制代码
```

#### 6.3.3 显示锁获取锁的四个方法

- lock()

  获取锁，获取失败时线程会处于阻塞状态

- tryLock()

  获取锁，获取成功时返回 true，获取失败时会返回 false，不会处于阻塞状态

- tryLock(long time, TimeUnit unit)

  获取锁，获取到了会返回 true，如果在指定时间内未获取到，则返回 false。

  在指定时间内处于阻塞状态，可中断。

- lockInterruptibly()

  获取锁，可中断。

### 6.4 内部锁与显式锁的区别

看完了内部锁和显式锁的介绍，下面我们来看下内部锁和显式锁的五个区别。

- 灵活性

  内部锁是基于代码的锁，锁的申请和释放只能在一个方法内执行，缺乏灵活性。

  显式锁是基于对象的锁，锁的申请和释放可以在不同的方法中执行，这样可以充分发挥面向对象编程的灵活性。

- 锁调度策略

  内部锁只能是非公平锁。

  显式锁可以自己选择锁调度策略。

- 便利性

  内部锁简单易用，不会出现锁泄漏的情况。

  显式锁需要自己手动获取/释放锁，使用不当的话会导致锁泄漏。

- 阻塞

  如果持有内部锁锁的线程一直不释放这个锁，那其他申请这个锁的线程只能一直等待。

  显式锁 Lock 接口有一个 tryLock() 方法，当其他线程持有锁时，这个方法会返回直接返回 false。

  这样就不会导致线程处于阻塞状态，我们就可以在获取锁失败时做别的事情。

- 适用场景

  在多个线程持有锁的平均时间不长的情况下我们可以使用内部锁

  在多个线程持有锁的平均较长的情况下我们可以使用显式锁（公平锁）

### 6.5 读写锁

#### 6.5.1 读写锁简介

锁的排他性使得多个线程无法以线程安全的方式在同一时刻读取共享变量，这样不利于提高系统的并发性，这也是读写锁出现的原因。

读写锁 ReadWriteLock 接口的实现类是 ReentrantReadWriteLock，。

只读取共享变量的线程叫读线程，只更新共享变量的线程叫写线程。

读写锁是一种改进的排他锁，也叫共享/排他（Shared/Exclusive）锁。

读写锁有下面六个特点。

- 读锁共享

  读写锁允许多个线程同时读取共享变量，读线程访问共享变量时，必须持有对应的读锁，读锁可以被多个线程持有。

- 写锁排他

  读写锁一次只允许一个线程更新共享变量，写线程访问共享变量时，必须持有对应的写锁，写锁在任一时刻只能被一个线程持有。

- 可以降级

  读写锁是一个支持降级的可重入锁，也就是一个线程在持有写锁的情况下，可以继续获取对应的读锁。

  这样我们可以在修改变量后，在其他地方读取该变量，并执行其他操作。

- 不能升级

  读写锁不支持升级，读线程只有释放了读锁才能申请写锁

- 三种保障

  读写锁虽然允许多个线程读取共享变量，但是由于写锁的特性，它同样能保障原子性、可见性和有序性。

- 适用场景

  读写锁会带来额外的开销，只有满足下面两个条件，读写锁才是合适的选择

  - 读操作比写操作频繁很多
  - 读取共享变量的线程持有锁的时间较长

#### 6.5.2 读写锁基本用法

```
private final ReadWriteLock readWriteLock = new ReentrantReadWriteLock();
private final Lock readLock = readWriteLock.readLock();
private final Lock writeLock = readWriteLock.writeLock();

private void write1() {
  writeLock.lock();
  System.out.println("写线程1获取了写锁");
  try {
    System.out.println("写线程1开始执行操作");
    ThreadUtils.sleep(3 * 1000);
  } finally {
    writeLock.unlock();
    System.out.println("写线程1释放了写锁");
  }
}

private void write2() {
  writeLock.lock();
  System.out.println("写线程2获取了写锁");
  try {
    System.out.println("写线程2开始执行操作");
  } finally {
    writeLock.unlock();
    System.out.println("写线程2释放了写锁");
  }
}
复制代码
private void read1() {
  readLock.lock();
  System.out.println("读线程1获取了读锁");
  try {
    System.out.println("读线程1开始执行操作");
    ThreadUtils.sleep(3 * 1000);
  } finally {
    readLock.unlock();
    System.out.println("读线程1释放了读锁");
  }
}

private void read2() {
  readLock.lock();
  System.out.println("读线程2获取了读锁");
  try {
    System.out.println("读线程2开始执行操作");
    ThreadUtils.sleep(3 * 1000);
  } finally {
    readLock.unlock();
    System.out.println("读线程2释放了读锁");
  }
}
复制代码
```

当在四个线程中分别执行上面的四个函数时，我们可以得到下面的输出。

```
写线程1获取了写锁
写线程1开始执行操作
写线程1释放了写锁
写线程2获取了写锁
写线程2开始执行操作
写线程2释放了写锁
读线程1获取了读锁
读线程1开始执行操作
读线程2获取了读锁
读线程2开始执行操作
读线程1释放了读锁
读线程2释放了读锁
复制代码
```

### 6.6 volatile 关键字



![volatile 变量读写操作.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="718" height="432"></svg>)



volatile 关键字可用于修饰共享变量，对应的变量就叫 volatile 变量，volatile 变量有下面几个特点。

- 易变化

  volatile 的字面意思是“不稳定的”，也就是 volatile 用于修饰容易发生变化的变量，不稳定指的是对这种变量的读写操作要从高速缓存或主内存中读取，而不会分配到寄存器中。

- 开销

  - 比锁低

    volatile 的开销比锁低，volatile 变量的读写操作不会导致上下文切换，所以 volatile 关键字也叫轻量级锁 。

  - 比普通变量高

    volatile 变量读操作的开销比普通变量要高，这是因为 volatile 变量的值每次都要从高速缓存或主内存中读取，无法被暂存到寄存器中。

- 释放/存储屏障

  对于 volatile 变量的写操作，JVM 会在该操作前插入一个释放屏障，并在该操作后插入一个存储屏障。

  存储屏障具有冲刷处理器缓存的作用，所以在 volatile 变量写操作后插入一个存储屏障，能让该存储屏障前的所有操作结果对其他处理器来说是同步的。

- 加载/获取屏障

  对于 volatile 变量的读操作，JVM 会在该操作前插入一个加载屏障，并在操作后插入一个获取屏障。

  加载屏障通过冲刷处理器缓存，使线程所在的处理器将其他处理器对该共享变量做的更新同步到该处理器的高速缓存中。

- 保证有序性

  volatile 能禁止指令重排序，也就是使用 volatile 能保证操作的有序性。

- 保证可见性

  读线程执行的加载屏障和写线程执行的存储屏障配合在一起，能让写线程对 volatile 变量的写操作对读线程可见，从而保证了可见性。

- 原子性

  在原子性方面，对于 long/double 型变量，volatile 能保证读写操作的原子型。

  对于非 long/double 型变量，volatile 只能保证写操作的原子性。

  如果 volatile 变量写操作前涉及共享变量，竞态仍然可能发生，因为共享变量赋值给 volatile 变量时，其他线程可能已经更新了该共享变量的值。

### 6.7 原子类型

#### 6.7.1 原子类型简介

在 JUC 下有一个 atomic 包，这个包里面有一组原子类，使用原子类的方法，不需要加锁也能保证线程安全，而原子类是通过 Unsafe 类中的 CAS 指令从硬件层面来实现线程安全的。

这个包里面有如 AtomicInteger、AtomicBoolean、AtomicReference、AtomicReferenceFIeldUpdater 等。

我们先来看一个使用原子整型 AtomicInteger 自增的例子。

```
// 初始值为 1
AtomicInteger integer = new AtomicInteger(1);

// 自增
int result = integer.incrementAndGet();

// 结果为 2
System.out.println(result);
复制代码
```

AtomicReference 和 AtomicReferenceFIeldUpdater 可以让我们自己的类具有原子性，它们的原理都是通过 Unsafe 的 CAS 操作实现的。

我们下面看下它们的用法和区别。

#### 6.7.2 AtomicReference 基本用法

```
class AtomicReferenceValueHolder {
  AtomicReference<String> atomicValue = new AtomicReference<>("HelloAtomic");
}

public void getAndUpdateFromReference() {
  AtomicReferenceValueHolder holder = new AtomicReferenceValueHolder();
  
  // 对比并设值
  // 如果值是 HelloAtomic，就把值换成 World
  holder.atomicValue.compareAndSet("HelloAtomic", "World");
  
  // World
  System.out.println(holder.atomicValue.get());
  
  // 修改并获取修改后的值
  String value = holder.atomicValue.updateAndGet(new UnaryOperator<String>() {
    @Override
    public String apply(String s) {
      return "HelloWorld";
    }
  });
  // Hello World  
  System.out.println(value);
}


复制代码
```

#### 6.7.3 AtomicReferenceFieldUpdater 基本用法

AtomicReferenceFieldUpdater 在用法上和 AtomicReference 有些不同，我们直接把 String 值暴露了出来，并且用 volatile 对这个值进行了修饰。

并且将当前类和值的类传到 newUpdater ()方法中获取 Updater，这种用法有点像反射，而且 AtomicReferenceFieldUpdater 通常是作为类的静态成员使用。

```
public class SimpleValueHolder {
  public static AtomicReferenceFieldUpdater<SimpleValueHolder, String> valueUpdater
    = AtomicReferenceFieldUpdater.newUpdater(
      SimpleValueHolder.class, String.class, "value");

  volatile String value = "HelloAtomic";

}

public void getAndUpdateFromUpdater() {
  SimpleValueHolder holder = new SimpleValueHolder();
  holder.valueUpdater.compareAndSet(holder, "HelloAtomic", "World");

  // World
  System.out.println(holder.valueUpdater.get(holder));

  String value = holder.valueUpdater.updateAndGet(holder, new UnaryOperator<String>() {
    @Override
    public String apply(String s) {
      return "HelloWorld";
    }
  });
        
  // HelloWorld
  System.out.println(value);
}
复制代码
```

#### 6.7.4 AtomicReference 与 AtomicReferenceFieldUpdater 的区别

AtomicReference 和 AtomicReferenceFieldUpdater 的作用是差不多的，在用法上 AtomicReference 比 AtomicReferenceFIeldUpdater 更简单。

但是在内部实现上，AtomicReference 内部一样是有一个 volatile 变量。

使用 AtomicReference 和使用 AtomicReferenceFIeldUpdater 比起来，要多创建一个对象。

对于 32 位的机器，这个对象的头占 12 个字节，它的成员占 4 个字节，也就是多出来 16 个字节。

对于 64 位的机器，如果启动了指针压缩，那这个对象占用的也是 16 个字节。

对于 64 位的机器，如果没启动指针压缩，那么这个对象就会占 24 个字节，其中对象头占 16 个字节，成员占 8 个字节。

当要使用 AtomicReference 创建成千上万个对象时，这个开销就会变得很大。

这也就是为什么 BufferedInputStream 、Kotlin 协程 和 Kotlin 的 lazy 的实现会选择 AtomicReferenceFieldUpdater 作为原子类型。

因为开销的原因，所以一般只有在原子类型创建的实例确定了较少的情况下，比如说是单例，才会选择 AtomicReference，否则都是用 AtomicReferenceFieldUpdater。

### 6.8 锁的使用技巧

使用锁会带来一定的开销，而掌握锁的使用技巧可以在一定程度上减少锁带来的开销和潜在的问题，下面就是一些锁的使用技巧。

- 长锁不如短锁

  尽量只对必要的部分加锁

- 大锁不如小锁

  进可能对加锁的对象拆分

- 公锁不如私锁

  进可能把锁的逻辑放到私有代码中，如果让外部调用者加锁，可能会导致锁不正当使用导致死锁

- 嵌套锁不如扁平锁

  在写代码时要避免锁嵌套

- 分离读写锁

  尽可能将读锁和写锁分离

- 粗化高频锁

  合并处理频繁而且过短的锁，因为每一把锁都会带来一定的开销

- 消除无用锁

  尽可能不加锁，或者用 volatile 代替

## 7. 什么是线程的活跃性问题？

上一大节介绍了锁的作用和基本用法，锁能让线程进入阻塞状态，而这种阻塞就会导致任务无法正常执行，也就是线程出现活跃性问题，这也就是我们这一节要讲的内容。

活跃性问题不是说线程过于活跃，而是线程不够活跃，导致任务无法取得进展。

我们这一节就来看一下常见的四个线程活跃性问题：死锁、锁死、活锁和饥饿。

### 7.1 线程的四个活跃性问题

### 7.1 死锁



![死锁.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="557" height="573"></svg>)



死锁是线程的一种常见多线程活跃性问题，如果两个或更多的线程，因为相互等待对方而被永远暂停，那么这就叫死锁现象。

下面我们就来看看死锁产生的四个条件和避免死锁的三个方法。

#### 7.1.1 死锁产生的四个条件

当多个线程发生了死锁后，这些线程和相关共享变量就会满足下面四个条件。

1. 资源互斥

   涉及的资源必须是独占的，也就是资源每次只能被一个线程使用

2. 资源不可抢夺

   涉及的资源只能被持有该资源的线程主动释放，无法被其他线程抢夺（被动释放）

3. 占用并等待资源

   涉及的线程至少持有一个资源，还申请了其他资源，而其他资源刚好被其他线程持有，并且线程不释放已持有资源

4. 循环等待资源

   涉及的线程必须等待别的线程持有的资源，而别的线程又反过来等待该线程持有的资源

只要产生了死锁，上面的条件就一定成立，但是上面的条件都成立也不一定会产生死锁。

#### 7.1.2 避免死锁的三个方法

要想消除死锁，只要破坏掉上面的其中一个条件即可。

由于锁具有排他性，且无法被动释放，所以我们只能破坏掉第三个和第四个条件。

1. 粗锁法

   使用粗粒度的锁代替多个锁，锁的范围变大了，访问共享资源的多个线程都只需要申请一个锁，因为每个线程只需要申请一个锁就可以执行自己的任务，这样“占用并等待资源”和“循环等待资源”这两个条件就不成立了。

   粗锁法的缺点是会降低并发性，而且可能导致资源浪费，因为采用粗锁法时，一次只能有一个线程访问资源，这样其他线程就只能搁置任务了。

2. 锁排序法

   锁排序法指的是相关线程使用全局统一的顺序申请锁。

   假如有多个线程需要申请锁，我们只需要让这些线程按照一个全局统一的顺序去申请锁，这样就能破坏“循环等待资源”这个条件。

3. tryLock

   显式锁 ReentrantLock.tryLock(long timeUnit) 这个方法允许我们为申请锁的操作设置超时时间，这样就能破坏“占用并等待资源”这个条件。

4. 开放调用

   开放调用（Open Call）就是一个方法在调用外部方法时不持有锁，开放调用能破坏“占用并等待资源”这个条件。

### 7.2 锁死

等待线程由于唤醒的条件永远无法成立，导致任务一直无法继续执行，那么这个线程是被锁死（Lockout）了。

锁死和死锁的区别在于，即使产生死锁的条件全部都不成立，还是有可能发生锁死。

锁死可分为信号丢失锁死和嵌套监视器锁死。

#### 7.2.1 信号丢失锁死

信号丢失锁死是由于没有对应的通知线程唤醒等待线程，导致等待线程一直处于等待状态的一种活跃性问题。

信号丢失锁死的一个典型例子就是等待线程执行 Object.wait()/Condition.await() 前没有判断保护条件，而保护条件已经成立，但是后续没有其他线程更新保护条件并通知等待线程，这也就是为什么要强调 Object.wait()/Condition.await() 要放在循环语句中执行。

#### 7.2.2 嵌套监视器丢失锁死

嵌套监视器锁死指的是嵌套地使用锁导致线程永远无法被唤醒，在代码上的表现就是两个嵌套的同步代码块。

避免嵌套监视器锁死的办法只需要避免嵌套使用内部锁。

### 7.3 活锁

活锁（Livelock）是指线程一直处于运行状态，但是任务却一直无法继续执行的一种现象。

### 7.4 饥饿

线程饥饿（Starvation）是指线程一直无法获得所需资源，导致任务一直无法执行。

## 8. 线程之间怎么协作？

线程间的常见协作方式有两种：等待和中断。

中断型协作放在第 8 大节讲，我们这一节主要讲等待型协作。

当一个线程中的操作需要等待另一个线程中的操作结束时，就涉及到等待型线程协作方式。

常用的等待型线程协作方式有 join、wait/notify、await/signal、await/countDown 和 CyclicBarrier 五种，下面我们就来看看这五种线程协作方式的用法和区别。

### 8.1 join

使用 Thread.join() 方法，我们可以让一个线程等待另一个线程执行结束后再继续执行。

join() 方法实现等待是通过 wait() 方法实现的，在 join() 方法中，会不断判断调用了 join() 方法的线程是否还存活，是的话则继续等待。

下面是 join() 方法的简单用法。

```
public void tryJoin() {
  Thread threadA = new ThreadA();
  Thread threadB = new ThreadB(threadA);
  threadA.start();
  threadB.start();
}
复制代码
public class ThreadA extends Thread {
  @Override
  public void run() {
    System.out.println("线程 A 开始执行");
    ThreadUtils.sleep(1000);
    System.out.println("线程 A 执行结束");
  }
}
复制代码
public class ThreadB extends Thread {
  private final Thread threadA;

  public ThreadB(Thread thread) {
    threadA = thread;
  }

  @Override
  public void run() {
    try {
      System.out.println("线程 B 开始等待线程 A 执行结束");
      threadA.join();
      System.out.println("线程 B 结束等待，开始做自己想做的事情");
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }
}
复制代码
```

当我们执行完上面的代码后，会得到下面的输出。

```
线程 A 开始执行
线程 B 开始等待线程 A 执行结束
线程 A 执行结束
线程 B 结束等待，开始做自己想做的事情
复制代码
```

### 8.2 wait/notify

#### 8.2.1 wait/notify 简介

在 Java 中，使用 Object.wait()/Object.wait(long) 和 Object.notify()/Object.notifyAll() 可以用于实现等待和通知。

一个线程因为执行操作（目标动作）所需的保护条件未满足而被暂停的过程就叫等待（wait）。

一个线程更新了共享变量，使得其他线程需要的保护条件成立，唤醒了被暂停的线程的过程就叫通知（notify）。

wait() 方法的执行线程叫等待线程，notify() 方法执行的线程叫通知线程。

wait/notify 协作方式有下面几个特点。

- 暂停/唤醒

  Object.wait() 的作用是让线程暂停（状态改为 WAITING），而 Object.notify() 的作用是唤醒一个被暂停的线程。

- 所有对象

  由于 Object 是所有对象的父类，所以所有对象都可以实现等待和通知。

- 获取监视器锁

  使用 wait()/notify() 方法要先获取共享对象的监视器锁，获取共享对象的监视器锁有两种方式，一是在同步代码块中执行，二是在同步方法（synchronized 修饰的方法）中执行 wait()/notify()。

  如果没有事先获取监视器锁，那线程就会报出非法监视器状态异常 IllegalMonitorStateException 异常。

- 捕获中断异常

  使用 wait() 方法必须要捕获中断异常 InterruptedException，因为通过 wait() 进入的等待状态是可以被打断的。

- 唤醒任一线程

  notify() 方法唤醒的只是对应对象上的一个任意等待线程，被唤醒的线程不一定是我们想唤醒的线程。

- 唤醒特定线程

  如果我们想对应对象上的特定线程，我们可以使用 notifyAll()，把该对象上的所有等待线程都唤醒。

- final 修饰

  之所以 lock 对象要使用 final 修饰，是因为如果没有用 final 修饰，那么这个对象的值可能被修改，导致等待线程和通知线程同步在不同的内部锁上，从而造成竞态，违背了使用锁的初衷。

- 循环判断

  对保护条件的判断和 wait() 方法的调用要放在循环语句中，以确保目标动作只有在保护条件成立时才能执行。

- 仅释放对应内部锁

  使用 wait() 方法暂停当前线程时，释放的锁是与该 wait() 方法所属对象的内部锁，当前线程持有的其他内部锁和显式锁不会因此被释放

#### 8.2.2 wait/notify 基本用法

下面是 wait/notify 使用的示例代码。

```
final Object lock = new Object();
private volatile boolean conditionSatisfied;

public void startWait() throws InterruptedException {
  synchronized (lock) {
    System.out.println("等待线程获取了锁");
    while(!conditionSatisfied) {
      System.out.println("保护条件不成立，等待线程进入等待状态");
      lock.wait();
    }
    System.out.println("等待线程被唤醒，开始执行目标动作");
  }
}
复制代码
public void startNotify() {
  synchronized (lock) {
    System.out.println("通知线程获取了锁");
    System.out.println("通知线程即将唤醒等待线程");
    conditionSatisfied = true;
    lock.notify();
  }
}
复制代码
```

当我们在两个线程中分别执行上面两个函数后，会得到下面的输出。

```
等待线程获取了锁
保护条件不成立，等待线程进入等待状态
通知线程获取了锁
通知线程即将唤醒等待线程
等待线程被唤醒，开始执行目标动作
复制代码
```

#### 8.2.3 wait/notify 原理

JVM 会给每个对象维护一个入口集（Entry Set）和等待集（Wait Set）。

入口集用于存储申请该对象内部锁的线程，等待集用于存储对象上的等待线程。

wait() 方法会将当前线程暂停，在释放内部锁时，会将当前线程存入该方法所属的对象等待集中。

调用对象的 notify() 方法，会让该对象的等待集中的任意一个线程唤醒，被唤醒的线程会继续留在对象的等待集中，直到该线程再次持有对应的内部锁时，wait() 方法就会把当前线程从对象的等待集中移除。

添加当前线程到等待集、暂停当前线程、释放锁以及把唤醒后的线程从对象的等待集中移除，都是在 wait() 方法中实现的。

在 wait() 方法的 native 代码中，会判断线程是否持有当前对象的内部锁，如果没有的话，就会报非法监视器状态异常，这也就是为什么要在同步代码块中执行 wait() 方法。

#### 8.2.4 wait/notify 存在的问题

- 过早唤醒

  等待线程在保护条件未成立时被唤醒的现象就叫过早唤醒。

  过早唤醒使得无须被唤醒的等待线程也被唤醒了，导致资源浪费。

- 信号丢失

  导致信号丢失的情况有两种，一种是在循环体外判断保护条件，另一种是 notify() 方法使用不当。

  - 循环体外判断条件

    如果等待线程在执行 wait() 方法前没有判断保护条件是否成立，那么有可能导致通知线程在等待线程进入临界区前就更新了共享变量，使得保护条件成立，并进行了通知，但是等待线程并没有暂停，所以也没有被唤醒。

    这种现象相当于等待线程错过了一个发送给它的“信号”，所以叫信号丢失。

    只要对保护条件的判断和 wait() 方法的调用放在循环语句中，就可以避免这种情况导致的信号丢失。

  - notify() 使用不当

    信号丢失的另一个表现是在应该调用 notifyAll() 的情况下调用了 notify()，在这种情况下，避免信号丢失的办法是使用 notifyAll() 进行通知

- 欺骗性唤醒

  等待线程可能在没有其他线程执行 notify()/notifyAll() 的情况下被唤醒，这种现象叫欺骗性唤醒。

  虽然欺骗性唤醒出现的概率比较低，但是 Java 允许这种现象存在，这是 Java 平台对操作系统妥协的一种结果。

  - 避免欺骗性唤醒

    避免欺骗性唤醒的方法就是在循环中判断条件是否满足，不满足时则继续等待，也就是再次调用 wait() 方法。

- 上下文切换

  等待线程执行 wait() 方法至少会导致该线程对内部锁的两次申请与释放。

  通知线程在执行 notify()/notifyAll() 时需要持有对应对象的内部锁，所以这里会导致一次锁的申请，而锁的申请与释放可能导致上下文切换。

  其次，等待线程从被暂停到唤醒的过程本身就会导致上下文切换。

  再次，被唤醒的等待线程在继续运行时，需要再次申请内部锁，此时等待线程可能需要和对应对象的入口集中的其他线程，以及其他新来的活跃线程争用内部锁，这又可能导致上下文切换。

  最后，过早唤醒也会导致额外的上下文切换，因为被过早唤醒的线程需要继续等待，要再次经历被暂停和唤醒的过程。

减少 wait/notify 上下文切换的常用方法有下面两种。

- 使用 notify() 代替 notifyAll()

  在保证程序正确性的情况下，使用 notify() 代替 notifyAll()，notify() 不会导致过早唤醒，从而减少上下文切换开销

- 尽快释放对应内部锁

  通知线程执行完 notify()/notifyAll() 后尽快释放对应的内部锁，这样可以避免被唤醒的线程在 wait() 调用返回前，再次申请对应内部锁时，由于该锁未被通知线程释放，导致该线程被暂停

#### 8.2.5 notify()/notifyAll() 的选用

notify() 可能导致信号丢失，而 notifyAll() 虽然会把不需要唤醒的等待线程也唤醒，但是在正确性方面有保障。

所以一般情况下优先使用 notifyAll() 保障正确性。

一般情况下，只有在下面两个条件都实现时，才会选择使用 notify() 实现通知。

1. 只需唤醒一个线程

   当一次通知只需要唤醒最多一个线程时，我们可以考虑使用 notify() 实现通知，但是光满足这个条件还不够。

   在不同的等待线程使用不同的保护条件时，notify() 唤醒的一个任意线程可能不是我们需要唤醒的那个线程，所以需要条件 2 来排除。

2. 对象的等待集中只包含同质等待线程

   同质等待线程指的是线程使用同一个保护条件并且 wait() 调用返回后的逻辑一致。

   最典型的同质线程是使用同一个 Runnable 创建的不同线程，或者同一个 Thread 子类 new 出来的多个实例。

### 8.3 await/signal

#### 8.3.1 await/signal 简介

wait()/notify() 过于底层，而且还存在两个问题，一是过早唤醒、二是无法区分 Object.wait(ms) 返回是由于等待超时还是被通知线程唤醒。

使用 await/signal 协作方式有下面几个要点。

- Condition 接口

  在 JDK 5 中引入了 Condition（条件变量） 接口，使用 Condition 也可以实现等待/通知，而且不存在上面提到的两个问题。

  Condition 接口提供的 await()/signal()/signalAll() 相当于是 Object 提供的 wait()/notify()/notifyAll()。

  通过 Lock.newCondition() 可以获得一个 Condition 实例。

- 持有锁

  与 wait/notify 类似，wait/notify 需要线程持有所属对象的内部锁，而 await/signal 要求线程持有 Condition 实例的显式锁。

- 等待队列

  Condition 实例也叫条件变量或条件队列，每个 Condition 实例内部都维护了一个用于存储等待线程的等待队列，相当于是 Object 中的等待集。

- 循环语句

  对于保护条件的判断和 await() 方法的调用，要放在循环语句中

- 引导区内

  循环语句和执行目标动作要放在同一个显式锁引导的临界区中，这么做是为了避免欺骗性唤醒和信号丢失的问题

#### 8.3.2 await/signal 基本用法

```
private Lock lock = new ReentrantLock();
private Condition condition = lock.newCondition();
private volatile boolean conditionSatisfied = false;

private void startWait() {
  lock.lock();
  System.out.println("等待线程获取了锁");
  try {
    while (!conditionSatisfied) {
      System.out.println("保护条件不成立，等待线程进入等待状态");
      condition.await();
    }
    System.out.println("等待线程被唤醒，开始执行目标动作");
  } catch (InterruptedException e) {
    e.printStackTrace();
  } finally {
    lock.unlock();
    System.out.println("等待线程释放了锁");
  }
}
复制代码
public void startNotify() {
  lock.lock();
  System.out.println("通知线程获取了锁");
  try {
    conditionSatisfied = true;
    System.out.println("通知线程即将唤醒等待线程");
    condition.signal();
  } finally {
    System.out.println("通知线程释放了锁");
    lock.unlock();
  }
}
复制代码
```

当我们在两个线程中分别执行了上面的两个函数后，能得到下面的输出。

```
等待线程获取了锁
保护条件不成立，等待线程进入等待状态
通知线程获取了锁
通知线程即将唤醒等待线程
等待线程被唤醒，开始执行目标动作
复制代码
```

#### 8.3.3 awaitUntil() 用法

上面我们说到 Condition 接口可以解决 Object.wait(ms) 无法判断等待的结束是由于超时还是唤醒，而解决办法就是使用 awaitUntil(timeout, unit) 方法。

如果是由于超时导致等待结束，那么 awaitUntil() 会返回 false，否则会返回 true，表示等待是被唤醒的，下面我们就看看这个方法是怎么用的。

```
private void startTimedWait() throws InterruptedException {
  lock.lock();
  System.out.println("等待线程获取了锁");
  // 3 秒后超时
  Date date = new Date(System.currentTimeMillis() + 3 * 1000);
  boolean isWakenUp = true;
  try {
    while (!conditionSatisfied) {
      if (!isWakenUp) {
        System.out.println("已超时，结束等待任务");
        return;
      } else {
        System.out.println("保护条件不满足，并且等待时间未到，等待进入等待状态");
        isWakenUp = condition.awaitUntil(date);
      }
    }
    System.out.println("等待线程被唤醒，开始执行目标动作");
  } finally {
      lock.unlock();
  }
}
复制代码
public void startDelayedNotify() {
  threadSleep(4 * 1000);
  startNotify();
}
复制代码
等待线程获取了锁
保护条件不满足，并且等待时间未到，等待进入等待状态
已超时，结束等待任务
通知线程获取了锁
通知线程即将唤醒等待线程
复制代码
```

### 8.4 await/countDown

#### 8.4.1 await/countDown 简介

使用 join() 实现的是一个线程等待另一个线程执行结束，但是有的时候我们只是想要一个特定的操作执行结束，不需要等待整个线程执行结束，这时候就可以使用 CountDownLatch 来实现。

await/countDown 协作方式有下面几个特点。

- 先决操作

  CountDownLatch 可以实现一个或多个线程等待其他线程完成一组特定的操作后才继续运行，这组线程就叫先决操作。

- 先决操作数

  CountDownLatch 内部维护了一个用于计算未完成先决操作数的 count 值，每当 CountDownLatch.countDown() 方法执行一次，这个值就会减 1。

  未完成先决操作数 count 是在 CountDownLatch 的构造函数中设置的。

  要注意的是，这个值不能小于 0，否则会报非法参数异常。

- 一次性

  当计数器的值为 0 时，后续再调用 await() 方法不会再让执行线程进入等待状态，所以说 CountDownLatch 是一次性协作。

- 不用加锁

  CountDownLatch 内部封装了对 count 值的等待和通知逻辑，所以在使用 CountDownLatch 实现等待/通知不需要加锁

- await()

  CountDownLatch.await() 可以让线程进入等待状态，当 CountDownLatch 中的 count 值为 0 时，表示需要等待的先决操作已经完成。

- countDown()

  调用 CountDownLatch.countDown() 方法后，count 值就会减 1，并且在 count 值为 0 时，会唤醒对应的等待线程。

#### 8.4.2 await/countDown 基本用法

```
public void tryAwaitCountDown() {
  startWaitThread();
  startCountDownThread();
  startCountDownThread();
}
复制代码
final int prerequisiteOperationCount = 2;
final CountDownLatch latch = new CountDownLatch(prerequisiteOperationCount);

private void startWait() throws InterruptedException {
  System.out.println("等待线程进入等待状态");
  latch.await();
  System.out.println("等待线程结束等待");
}
复制代码
private void startCountDown() {
  try {
    System.out.println("执行先决操作");
  } finally {
    System.out.println("计数值减 1");
    latch.countDown();
  }
}
复制代码
```

当我们在两个线程中分别执行 startWait() 和 startCountDown() 方法后，我们会得到下面的输出。

```
等待线程进入等待状态
执行先决操作
计数值减 1
执行先决操作
计数值减 1
等待线程结束等待
复制代码
```

### 8.5 CyclicBarrier

#### 8.5.1 CyclicBarrier 简介

有的时候多个线程需要互相等待对方代码中的某个地方（集合点），这些线程才能继续执行，这时可以使用 CyclicBarrier（栅栏）。

CyclicBarrier 是 JDK 5 引入的一个类，CyclicBarrier 协作方式有下面几个特点。

使用 CyclicBarrier.await() 实现等待的线程叫参与方（Party），除了最后一个执行 CyclicBarrier.await() 方法的线程外，其他执行该方法的线程都会被暂停。

和 CountDownLatch 不同，CyclicBarrier 是可以重复使用的，也就是等待结束后，可以再次进行一轮等待。

#### 8.5.1 CyclicBarrier 基本用法

老王和小张整天这么整也不是办法，有一天老李就想了个办法，组织几天爬山，下面我们就来看看在爬山前他们都做了什么。

```
final int parties = 3;
final Runnable barrierAction = new Runnable() {
  @Override
  public void run() {
    System.out.println("人来齐了，开始爬山");
  }
};
final CyclicBarrier barrier = new CyclicBarrier(parties, barrierAction);

public void tryCyclicBarrier() {
  firstDayClimb();
  secondDayClimb();
}

private void firstDayClimb() {
  new PartyThread("第一天爬山，老李先来").start();
  new PartyThread("老王到了，小张还没到").start();
  new PartyThread("小张到了").start();
}

private void secondDayClimb() {
  new PartyThread("第二天爬山，老王先来").start();
  new PartyThread("小张到了，老李还没到").start();
  new PartyThread("老李到了").start();
}
复制代码
public class PartyThread extends Thread {
  private final String content;

  public PartyThread(String content) {
    this.content = content;
  }

  @Override
  public void run() {
    System.out.println(content);
    try {
      barrier.await();
    } catch (BrokenBarrierException e) {
      e.printStackTrace();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }
}
复制代码
```

运行上面的代码后，可以得到下面的输出。

```
第一天爬山，老李先来
老王到了，小张还没到
小张到了
人来齐了，开始爬山
第二天爬山，老王先到
小张到了，老李还没到
老李到了
人来齐了，开始爬山
复制代码
```

#### 8.5.3 CyclicBarrier 原理

CyclicBarrier 内部有一个用于实现等待/通知的 Condition（条件变量）类型的变量 trip 。

而且 CyclicBarrier 内部还有一个分代（Generation）对象，用于表示CyclicBarrier 实例是可以重复使用的。

当前分代的初始状态是 parties（参与方总数），CyclicBarrier.await() 方法每执行一次，parties 的值就会减 1。

调用了 CyclicBarrier 方法的参与方相当于是等待线程，而最后一个参与方相当于是通知线程。

当最后一个参与方调用了 CyclicBarrier.await() 方法时，在该方法中会先执行 barrierAction.run() ，再执行 trip.signalAll() 唤醒所有等待线程，接着开始下一个分代，也就是 parties 的值会恢复为初始值。

Generation 中有一个布尔值 broken，当调用 CyclicBarrier.await() 方法的线程被中断时，broken 的值就会变为 true。

这时会抛出一个 BrokenBarrierExcetpion 异常，这个异常用于表示当前分代已经被破坏了，无法完成该分代应该完成的任务了。

也就是使用 CyclicBarrier 的每一个线程，都不能被中断（interrupt() 方法被调用）。

## 9. 怎么让一个线程停止？

### 9.1 stop() 方法

JDK 中的 stop() 方法很早就被弃用了，之所以会被弃用，我们可以来看下 stop() 方法可能导致的两种情况。

第一种情况，假如现在有线程 A 和 线程 B，线程 A 持有了线程 B 需要的锁，然后线程 A 被 stop() 强行结束了，导致这个锁没有被释放，那线程 B 就一直拿不到这个锁了，相当于是线程 B 中的任务永远无法执行了。

第二种情况，假如线程 A 正在修改一个变量，修改到一半，然后被 stop() 强行结束了，这时候线程 B 去读取这个变量，读取到的就是一个异常值，这就可能导致线程 B 出现异常。

因为上述两种资源清理的问题，所以现在很多语言都废弃了线程的 stop() 方法。

虽然线程不能被简单粗暴地终止，但是线程执行的任务是可以停止的，下面我们就来看看怎么停止任务。

### 9.2 interrupt() 方法

当我们调用 sleep() 方法时，编译器会要求我们捕获中断异常 InterruptedException，这是因为线程的休眠状态可能会被中断。

在线程休眠期间，如果其他地方调用了线程的 interrupt() 方法，那么这个休眠状态就会被中断，中断后就会接收到一个中断异常。

我们可以在捕获到中断异常后释放锁，比如关闭流或文件。

但是调用线程的 interrupt() 方法不是百分百能中断任务的，假如我们现在有一个线程，它的 run() 方法中有个 while 循环在执行某些操作，那么在其他地方调用该线程的 interrupt() 方法并不能中断这个任务。

在这种情况下，我们可以通过 interrupted() 或 isInterruped() 方法判断任务是否被中断。

interrupted() 与 isInterrupted() 方法都可以获取线程的中断状态，但它们有下面一些区别。

- 静态

  interrupted() 是静态方法，isInterrupted() 是非静态方法

- 重置

  interrupted() 会重置中断状态，也就是不管这次获取到的中断状态是 true 还是 false，下次获取到的中断状态都是 false

  isInterrupted() 不会重置中断状态，也就是调用了线程的 interrupt() 方法后，通过该方法获取到的中断状态会一直为 true

不论是使用 interrupted() 还是 isInterrupted() 方法，本质上都是通过 Native 层的布尔标志位判断的。

### 9.3 布尔标志位

既然 interrupt() 只是对布尔值的一个修改，那我们可以在 Java 层自己设一个布尔标志位，让每个线程共享这个布尔值。

当我们想取消某个任务时，就在外部把这个标志位改为 true。

- 注意事项

  直接使用布尔标志位会有可见性问题，所以要用 volatile 关键字修饰这个值。

- 使用场景

  当我们需要用到 sleep() 方法时，我们可以使用 interrupt() 来中断任务，其他时候可以使用布尔标志位。

## 10. 什么是 ConcurrentHashMap？

### 10.1 ConcurrentHashMap 简介

ConcurrentHashMap 是一个并发容器，并发容器是相对于同步容器的一个概念。

我们经常使用的 HashMap 和 ArrayList 等数据容器是线程不安全的，比如使用 HashMap 时需要自己加锁，这时候就需要线程安全的数据容器：同步容器和异步容器。

同步容器指的是 Hashtable 等线程安全的数据容器，同步容器实现线程安全的方式存在性能问题。

同步容器之一的 Hashtable 存在如下的问题。

- 大锁

  对 Hashtable 对象加锁

- 长锁

  直接对方法加锁

- 读写锁共用

  只有一把锁，从头锁到尾

而并发容器比如 ConcurrentHashMap、CopyOnWriteArrayList 等就不存在这个问题，下面我就来看看它们是怎么实现的。

### 10.2 ConcurrentHashMap 简史

ConcurrentHashMap 从 JDK 5~8 ，每一个版本都进行了优化，下面我们就看下各个版本对 ConcurrentHashMap 做的优化。

1. JDK 5

   在 JDK 5 中，ConcurrentHashMap 的实现是使用分段锁，在必要时加锁。

   Hashtable 是整个哈希表加锁，而 JDK 5 引入的 ConcurrentHashMap 使用段（Segment）存储键值对，在必要时对段进行加锁，不同段之间的访问不受影响。

   JDK 5 的 ConcurrentHashMap 中的哈希算法对于比较小的整数，比如三万以下的整数作为 key 时，无法让元素均匀分布在各个段中，导致它退化成了一个 Hashtable。

2. JDK 6

   在 JDK 6 中，ConcurrentHashMap 优化了二次 Hash 算法，用了 single-word Wang/Jenkins 哈希算法，这个算法可以让元素均匀分布在各个段中。

3. JDK 7

   JDK 7 的 ConcurrentHashMap 初始化段的方式跟之前的版本不一样，以前是 ConcurrentHashMap 构造出来后直接实例化 16 个段，而 JDK 7 开始，是需要哪个就创建哪个。

   懒加载实例化段会涉及可见性问题，所以在 JDK 7 的 ConcurrentHashMap 中使用了 volatile 和 UNSAFE.getObjectVolatile() 来保证可见性。

4. JDK 8

   在 JDK 8 中，ConcurrentHashMap 废弃了段这个概念，实现改为基于 HashMap 原理进行并发化。

   对不必加锁的地方，尽量使用 volatile 进行访问，对于一定要加锁的操作，会选择小的范围加锁。

### 10.3 ConcurrentHashMap 特点

- 小锁

  分段锁（JDK 5~7）

  桶节点锁（JDK 8）

- 短锁

  先尝试获取，失败再加锁

- 分离读写锁

  读失败再加锁（JDK 5~7）

  volatile 读 CAS 写（JDK 7~8）

- 弱一致性

  - 添加元素后不一定马上能读到
  - 清空后可能仍有元素
  - 遍历前的段元素变化能读到
  - 遍历后的段元素变化读不到
  - 遍历时元素发生变化不会抛异常

## 11. 使用线程有哪些准则？

在使用线程执行异步任务的过程中，我们要准收一些使用准则，这样能在一定程度上避免使用线程的时候带来的问题。

常见的五个线程使用准则是：严谨直接创建线程、使用基础线程池、选择合适的异步方式、线程必须命名以及重视优先级设置。

1. 严禁直接创建线程

   直接创建线程除了简单方便之外，没有其他优势，所以在实际项目开发过程中，一定要严禁直接创建线程执行异步任务。

2. 提供基础线程池供各个业务线使用

   这个准则是为了避免各个业务线各自维护一套线程池，导致线程数过多。

   假如我们有 10 条业务线，如果每条业务线都维护一个线程池，假如这个线程池的核心数是 8，那么我们就有 80 条线程，这明显是不合理的。

3. 选择合适的异步方式

   HandlerThread、IntentService 和 RxJava 等方式都可以执行异步任务，但是要根据任务类型来选择合适的异步方式。

   假如我们有一个可能会长时间执行，但是优先级较低的任务，我们就可以选择用 HandlerThread。

   还有一种情况就是我们需要执行一个定时任务，这种情况下更适合使用线程池来操作。

4. 线程必须命名

   当我们开发组成员比较多的时候，不论是使用线程还是使用线程池，如果我们不对我们创建的线程命名，如果这个线程发生了异常，我们光靠默认线程名是不知道要找哪个开发人员的。

   如果我们对每个线程都命名了，就可以快速地定位到线程的创建者，可以把问题交给他来解决。

   我们可以在运行期通过 Thread.currentThread().setName(name) 修改线程的名字。

   如果在一段时间内是我们业务线使用，我们可以把线程的名字改成我们业务线的标志，在任务完成后，再把名字改回来。

5. 重视优先级设置

   Java 采用的是抢占式调度模型，高优先级的任务能先占用 CPU，如果我们想让某个任务先完成，我们可以给它设置一个较高的优先级。

   设置的方式就是通过 android.os.Process.setThreadPriority(priority)，这个 priority 的值越小，优先级就越高，它的取值范围在 -20~19。

## 12 怎么在 Android 中执行异步任务？

在这一节，我们会介绍 Android 中常用的 7 种异步方式：Thread、HandlerThread、IntentService、AsyncTask、线程池、RxJava 和 Kotlin 协程。

### 12.1 异步简介

异步指的是代码不是按照我们写的顺序来执行的，除了多线程，像是 OnClickListener 中的代码也算是异步执行的。

在编写异步代码时，要注意的是有可能写出回调地狱，回调地狱代码可能过两天后你自己看自己写的代码都不会知道是干什么用的，比如下面这样的。

```
btn.setOnClickListener(new View.OnClickListener() {
  @Override
  public void onClick(View v) {
    sendRequest(request, new Callback() {
      public void onSuccess(Response response) {
        handler.post(new Runnable() {
					@Override         
          public void run() {
            updateUI(response);
          }
        })
      }
    })
  }
});
复制代码
```

### 12.2 Thread

直接创建 Thread 是最简单的异步方式，但是使用这种方式除了方便简单之外，没有任何其他优势。

而且使用这种方式有很多缺点，比如说不容易被复用，导致频繁创建和销毁线程的开销大。

假如我们要执行一个定时任务，直接创建 Thread 虽然也能实现，但是比较麻烦。

### 12.3 HandlerThread

HandlerThread 本质上也是一个 Thread，但是它自带了消息循环。

HandlerThread 内部是以串行的方式执行任务，它比较适合需要长时间执行，不断从队列中取出任务执行的场景。

### 12.4 IntentService

IntentService 是 Service 组件的子类，它的内部有一个 HandlerThread，所以它具备了 HandlerThread 的特性。

它有两点优势，第一点是相对于 Service 来说，IntenService 的执行是在工作线程而不是主线程。

第二点是它是一个 Service，如果应用使用了 Service，会提高应用的优先级，这样就不容易被系统干掉。

### 12.5 AsyncTAsk

AsyncTask 是 Android 提供的异步工具类，它的内部实现使用了线程池，使用 AsyncTask 的好处就是不用我们自己处理线程切换。

使用 AsyncTask 要注意它在不同版本的实现不一致，但这个不一致是在 API 14 以下的，而我们现在大部分应用的适配都是在 15 及以上，所以这个问题基本上已经没有了。

### 12.6 线程池

#### 12.6.1 线程池简介



![线程池示意图.png](https://user-gold-cdn.xitu.io/2019/8/5/16c620771735d049?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



使用线程池执行异步任务有下面两个优点。

- 易于复用

  通过线程池创建的线程容易复用，这样就避免了线程频繁创建和销毁的开销。

- 功能强大

  线程池提供了几个强大的功能，比如定时、任务队列、并发数控制等。

我们可以通过 Executors 创建线程池，当 Executors 不能满足我们的需要时，我们可以自定义 ThreadPoolExecutor 实现满足我们需要的线程池。

#### 12.6.2 线程池基本用法

通过下面的 ThreadPoolUtils，各个业务线使用线程时可以通过这个类直接获取全局线程池。

将线程池的线程数固定为 5 个，可以避免直接创建线程导致线程数过多。

通过 ThreadFactory，我们可以在创建线程时设置名字，这样能避免无法定位问题到出问题的线程。

```
private static ExecutorService sService = Executors.newFixedThreadPool(5,
  new ThreadFactory() {
  @Override
  public Thread newThread(Runnable r) {
    Thread thread = new Thread(r);
    thread.setName("ThreadPoolUtils");
    return thread;
  }
});
复制代码
```

下面这段代码是在执行任务前把线程的名字改掉，并且在任务执行完毕后把线程的名字改回来，这样就能达到一个复用的效果。

```
public void executeTask() {
  ThreadPoolUtils.getService().execute(new Runnable() {
    @Override
    public void run() {
      String oldName = Thread.currentThread().getName();
      Thread.currentThread().setName("newName");
      System.out.println("执行任务");
      System.out.println("任务执行完毕");
      Thread.currentThread().setName(oldName);
    }
  });
}
复制代码
```

### 12.7 RxJava

#### 12.7.1 RxJava 简介

RxJava 是一个异步框架，在这里我们主要关注它的基本用法、异常和取消的处理。

RxJava 根据任务类型的不同提供了不同的线程池，对于 I/O 密集型任务，比如网络请求，它提供了 I/O 线程池。

对于 CPU 密集型任务，它提供了 CPU 任务专用的线程池，也就是 Schdulers.computation()。

如果我们项目集成了 RxJava，我们可以使用 RxJava 的线程池。

#### 12.7.1 RxJava 基本用法

对于 12.1 小节中的代码，使用 RxJava 写的话是下面这样的。

```
btn.setOnClickListener(new View.OnClickListener() {
  @Override
  public void onClick(View v) {
    sendRequest(request)
      .subscribeOn(Schedulers.io())
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(new Consumer<Response>() {
        @Override
        public void accept(Response response) throws Exception {
          updateUI(response);
        }
      });
  }
});
复制代码
```

而使用了 Lambda 表达式后，上面的代码就变成了下面这样。

```
btn.setOnClickListener(v -> sendRequest(request))
  .subscribeOn(Schedulers.io())
  .observeOn(AndroidSchedulers.mainThread())
  .subscribe(response -> updateUI(response));
复制代码
```

但是这两段代码是有潜在隐患的，这个隐患是因为直接使用 Consumer 而不是 Observer，没有对异常进行处理。

#### 12.7.2 RxJava 异常处理

上面那段代码，我们可以在 observeOn() 方法后面加上另一个方法：onErrorReturnItem()，比如下面这样，把异常映射成 Response。

```
btn.setOnClickListener(v -> sendRequest(request))
  .subscribeOn(Schedulers.io())
  .observeOn(AndroidSchedulers.mainThread())
  .onErrorReturnItem(t -> mapThrowableToResponse(t))
  .subscribe(response -> updateUI(response));
复制代码
```

另一个办法就是使用全局捕获异常，捕获到异常后上报异常。

这里要注意的是，捕获到的如果是 OnErrorNotImplmentedException，那我们要上报它的 cause，因为 cause 里面才是真正的异常信息，比如下面这样的。

```
RxJavaPlugins.setErrorHandler { e -> 
  report(e instanceof OnErrorNotImplmentedException ? e.getCause() : e);
  Exceptions.throwIfFatal(e);
}
复制代码
```

#### 12.7.3 RxJava 取消处理

RxJava 可以执行异步任务，异步任务就有可能出现 Acitvity 关闭后，任务还在继续执行的情况，这时候 Activity 就会被 Observer 持有，导致内存泄漏。

当我们调用了 subscribe() 方法后，我们可以得到一个 Disposable 对象，使用这个对象我们可以在页面销毁时取消对应的任务。

也就是我们可以在 Activity 中维护一个 Disposable 列表，在 onDestory() 方法中逐个取消任务。

还有一个更好的办法，就是使用滴滴的开源框架 AutoDispose，这个框架的使用很简单，只需要想下面这样加上一句 as 就可以了。

```
btn.setOnClickListener(v -> sendRequest(request))
  .subscribeOn(Schedulers.io())
  .observeOn(AndroidSchedulers.mainThread())
  .onErrorReturnItem(t -> mapThrowableToResponse(t))
  .as(AutoDispose.autoDisposable(ViewScopeProvider.from(btn)))
  .subscribe(response -> updateUI(response));
复制代码
```

AutoDispose 的原理就是监听传进来的控件的生命周期，当发现这个控件的被销毁时，往往也就意味着页面被关闭了，这时候就可以取消这个任务。

### 12.8 Kotlin 协程

#### 12.8.1 Kotlin 协程简介

除了 RxJava，我们还可以使用 Kotlin 协程在 Andorid 中实现异步任务。

使用 Kotlin 协程写出来的异步代码，看上去跟同步代码是非常相似的，下面是一个网络请求的例子。

首先我们定义一个 onClick 扩展方法，把上下文、启动模式和协程体传入 launch 方法中。

```
fun View.onClick(
  context: CoroutineContext = Dispatchers.Main,
  handler: suspend CoroutineScope.(v: View?) -> Unit
) {
  setOnClickListener { v ->
    GlobalScope.launch(context,CoroutineStart.DEFAULT) {
      handler(v)
    }
  }
}
复制代码
```

然后让一个按钮调用这个方法，并且发起网络请求。

```
btn.onClick {
  val request = Request()
  val response = async { sendRequest(request) }.await()
  updateUI(response)
}
复制代码
```

上面这段代码看上去是同步执行的，但是实际上 async {} 中的代码是异步执行的，并且在返回了 Response 之后 updateUI() 方法才会被执行。

#### 12.8.2 Kotlin 协程的取消处理

使用 Kotlin 协程和 RxJava 的作用一样，都是执行异步任务，也都需要注意任务的取消，避免内存泄漏，下面我们就来看下怎么取消 Kotlin 协程执行的异步任务。

对于上面这个例子，我们可以借鉴 AutoDispose 的思路，监听 View 的生命周期，在 View 销毁时取消异步任务。

使用 Kotlin 协程执行任务时我们可以获得一个 Job 对象，通过这个对象我们可以取消对应的任务。

首先我们定义一个监听 View 声明周期的类 AutoDisposableJob，再定义一个 Job 类的扩展函数 autoDispose()。

```
class AutoDisposableJob(
  private val view: View,
  private val wrapped: Job
) : Job by wrapped, View.OnAttachStateChangeListener {

  init {
    if (ViewCompat.isAttachedToWindow(view)) {
      view.addOnAttachStateChangeListener(this)
    } else {
      cancel()
    }
    invokeOnCompletion {
      view.removeOnAttachStateChangeListener(this)
    }
  }

  override fun onViewDetachedFromWindow(v: View?) {
    cancel()
    view.removeOnAttachStateChangeListener(this)
  }

  override fun onViewAttachedToWindow(v: View?) = Unit

}

fun Job.autoDispose(view: View) = AutoDisposableJob(view, this)
复制代码
```

然后再在 onClick() 方法中调用 autoDispose() 扩展方法。

```
fun View.onClick(
  context: CoroutineContext = Dispatchers.Main,
  handler: suspend CoroutineScope.(v: View?) -> Unit
) {
  setOnClickListener { v ->
    GlobalScope.launch(context,CoroutineStart.DEFAULT) {
      handler(v)
    }.autoDispose(v)
  }
}
复制代码
```

## 参考文献

### 1. 书籍

1. [《Java多线程编程实战指南（核心篇）》](https://book.douban.com/subject/27034721/)
2. [《Java 并发编程实战》](https://book.douban.com/subject/10484692/)
3. [《Java并发编程之美》](https://book.douban.com/subject/30351286/)

### 2. 视频

1. [国内Top团队大牛带你玩转Android性能分析与优化](https://coding.imooc.com/class/308.html)
2. [大厂资深面试官 带你破解Android高级面试](https://coding.imooc.com/class/317.html)

### 3. 文章

1. [Java线程中，Blocked，Wait,以及TIMED_WAIT的区别](https://blog.csdn.net/biglogo/article/details/79261745)
2. [Java进阶（六）从ConcurrentHashMap的演进看Java多线程核心技术](http://www.jasongj.com/java/concurrenthashmap/)
3. [Java多线程（二）之Atomic：原子变量与原子类](https://blog.csdn.net/vernonzheng/article/details/8206349)
4. [破解 Kotlin 协程(1) - 入门篇](https://www.bennyhuo.com/2019/04/01/basic-coroutines/)
5. [公平锁，非公平锁，乐观锁，悲观锁](https://www.cnblogs.com/darrenqiao/p/9211178.html)

### 4. 图片

1. [首图](https://kit8.net/illustrations/kitchen-of-restaurant/)


作者：灯不利多
链接：https://juejin.im/post/5d45a75de51d4561ee1bdf10
来源：掘金
