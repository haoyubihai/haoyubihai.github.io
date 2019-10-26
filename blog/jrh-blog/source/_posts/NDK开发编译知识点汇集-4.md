---
title: 'NDK开发编译知识点汇集[4]'
date: 2019-09-05 10:29:27
categories:
 - [NDK]
 - [JNI]
 - [Android]
tags:
 - NDK
 - JNI
 - Jni
 - 静态库
 - 动态库
---

 

## Android NDK 开发指南

Android NDK 是一组使您能将 C 或 C++（“原生代码”）嵌入到 Android 应用中的工具。能够在 Android 应用中使用原生代码对于想执行以下一项或多项操作的开发者特别有用：

<!--more-->

- 在平台之间移植其应用。
- 重复使用现有库，或者提供其自己的库供重复使用。
- 在某些情况下提高性能，特别是像游戏这种计算密集型应用。

### 工作原理

### 主要组件

- 原生共享库：NDK 从 C/C++ 源代码编译这些库或 `.so` 文件。
- 原生静态库：NDK 也可编译静态库或 `.a` 文件，而您可将静态库关联到其他库。
- Java 原生接口 (JNI)：JNI 是 Java 和 C++ 组件用以互相通信的接口。如需了解相关信息，请查阅 [Java 原生接口规范](http://docs.oracle.com/javase/7/docs/technotes/guides/jni/spec/jniTOC.html)。
- 应用二进制接口 (ABI)：ABI 可以非常精确地定义应用的机器代码在运行时应该如何与系统交互。NDK 根据这些定义编译 `.so` 文件。不同的 ABI 对应不同的架构：NDK 为 32 位 ARM、AArch64、x86 及 x86-64 提供 ABI 支持。有关详情，请参阅 [ABI 管理](https://developer.android.com/ndk/guides/abis.html)。
- 清单：如果您编写的应用不包含 Java 组件，则必须在[清单](https://developer.android.com/guide/topics/manifest/manifest-intro.html)中声明 `NativeActivity` 类。[原生 Activity 和应用](https://developer.android.com/ndk/guides/concepts#naa)的“使用 `native_activity.h` 接口”部分进一步详细介绍了如何执行此操作。

### android 交叉编译工具选择

从 r18 开始，所有独立工具链都使用 Clang 和 libc++，以前采用g++。除非编译的是静态可执行文件，否则默认情况下，将使用 libc++ 共享库。要强制使用静态库，请在创建链接时传递 `-static-libstdc++`。此行为与普通主机工具链的行为相符。

[C++支持库](https://developer.android.com/ndk/guides/cpp-support.html)

### [android ndk 工具链](https://developer.android.com/ndk/guides/standalone_toolchain)

#### 创建工具链

NDK 会提供 `make_standalone_toolchain.py` 脚本以便您通过命令行执行自定义工具链安装。

这是用来替代旧式 `make-standalone-toolchain.sh` 的新工具。此工具已在 Python 中重新实现，因此 Windows 用户无需安装 [Cygwin](https://www.cygwin.com/) 或 [MSYS](http://www.mingw.org/wiki/MSYS) 便可运行该工具。

脚本位于 `$NDK/build/tools/` 目录中，其中 `$NDK` 是 NDK 的安装根目录。

下面展示了使用此脚本的示例：(注意 在 NDK r19 之前请参考以下实现)

```bash
$NDK/build/tools/make_standalone_toolchain.py \
        --arch arm --api 21 --install-dir /tmp/my-android-toolchain
    
```

此命令会创建一个名为 `/tmp/my-android-toolchain/` 的目录，其中包含一个 `android-21/arch-arm` sysroot 的副本，以及适用于 32 位 ARM 目标的工具链二进制文件的副本。

请注意，工具链二进制文件不依赖或包含主机专属路径。换言之，您可以将其安装在任意位置，甚至可以视需要改变其位置。

`--arch` 参数是必填项，但 API 级别将默认设为指定架构的最低支持级别（目前，级别 16 适用于 32 位架构，级别 21 适用于 64 位架构）。

从 r18 开始，所有独立工具链都使用 Clang 和 libc++。除非编译的是静态可执行文件，否则默认情况下，将使用 libc++ 共享库。要强制使用静态库，请在创建链接时传递 `-static-libstdc++`。此行为与普通主机工具链的行为相符。

如 [C++ 库支持](https://developer.android.com/ndk/guides/cpp-support.html)中所提到的那样，在链接到 libc++ 时常常需要传递 `-latomic`。

请注意，如果您省略 `--install-dir` 选项，该工具将在名为 `$TOOLCHAIN_NAME.tar.bz2` 的当前目录中创建一个 tarball。使用 `--package-dir` 可将此 tarball 放入不同的目录中。

如需了解更多选项和详情，请使用 `--help`。

**NDK r20 大部分的工具目录 路径发生变化可以参考以下路径**

```makefile
$ $NDK/toolchains/llvm/prebuilt/$HOST_TAG/bin/clang++ \
    -target aarch64-linux-android21 foo.cpp
    
或者
$ $NDK/toolchains/llvm/prebuilt/$HOST_TAG/bin/aarch64-linux-android21-clang++ \
    foo.cpp
   
```



> $NDK 为NDK的 path
>
> $HOST_TAG 参考下面具体配置：

| NDK OS Variant | Host Tag         |
| -------------- | ---------------- |
| macOS          | `darwin-x86_64`  |
| Linux          | `linux-x86_64`   |
| 32-bit Windows | `windows`        |
| 64-bit Windows | `windows-x86_64` |



### Android ABI

> ABI全称:Application binary interface(应用程序二进制接口)

不同的 Android 手机使用不同的 CPU，而不同的 CPU 支持不同的指令集。CPU 与指令集的每种组合都有专属的应用二进制接口，即 ABI。ABI 可以非常精确地定义应用的机器代码在运行时如何与系统交互。您必须为应用要使用的每个 CPU 架构指定 ABI。

#### 典型的 ABI 包含以下信息

- 机器代码应使用的 CPU 指令集。
- 运行时内存存储和加载的字节顺序。
- 可执行二进制文件（例如程序和共享库）的格式，以及它们支持的内容类型。
- 在代码与系统之间传递数据的各种规范。这些规范包括对齐限制，以及系统调用函数时如何使用堆栈和寄存器。
- 运行时可用于机器代码的函数符号列表 - 通常来自非常具体的库集。

### android 支持的ABI

#### armeabi

> **注意**：此 ABI 已在 NDK r17 中移除。

此 ABI 适用于基于 ARM、至少支持 ARMv5TE 指令集的 CPU,此 ABI 不支持硬件辅助的浮点运算。相反，所有浮点运算都使用编译器的 `libgcc.a` 静态库中的软件辅助函数。

#### armeabi-v7a

此 ABI 可扩展 armeabi 以包含多个 [CPU 扩展指令集](http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.ddi0406c/index.html)。此 Android 特定 ABI 支持的扩展指令包括：

- Thumb-2 扩展指令集，其性能堪比 32 位 ARM 指令，简洁性类似于 Thumb-1。
- VFP 硬件 FPU 指令。更具体一点，是指 VFPv3-D16，它除了 ARM 核心中的 16 个 32 位寄存器之外，还包含 16 个专用 64 位浮点寄存器。

v7-a ARM 规范描述的其他扩展指令集，包括[高级 SIMD](http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.ddi0388f/Beijfcja.html)（亦称 NEON）、VFPv3-D32 和 ThumbEE，都是此 ABI 的可选扩展指令集。由于不能保证它们存在，因此系统在运行时应检查扩展指令集是否可用。如果不可用，您必须使用替代代码路径。此检查类似于系统在检查或使用 [MMX](http://en.wikipedia.org/wiki/MMX_(instruction_set))、[SSE2](http://en.wikipedia.org/wiki/SSE2) 及 x86 CPU 上其他专用指令集时所执行的检查。

要了解如何执行这些运行时检查，请参阅 [`cpufeatures` 库](https://developer.android.com/ndk/guides/cpu-features.html)。此外，如需有关 NDK 支持为 NEON 编译机器代码的信息，请参阅 [NEON 支持](https://developer.android.com/ndk/guides/cpu-arm-neon.html)。

`armeabi-v7a` ABI 使用 `-mfloat-abi=softfp` 开关强制实施以下规则：编译器在函数调用期间必须传递核心寄存器对中的所有双精度值，而不是专用浮点值。系统可以使用 FP 寄存器执行所有内部计算。这样可极大地提高计算速度。

#### arm64-v8a

此 ABI 适用于基于 ARMv8、支持 AArch64 的 CPU。它还包含 NEON 和 VFPv4 指令集。

如需了解更多信息，请参阅 [ARMv8 技术预览](http://www.arm.com/files/downloads/ARMv8_Architecture.pdf)，并联系 ARM 进一步了解详情。

#### x86

此 ABI 适用于支持通常称为“x86”或“IA-32”的指令集的 CPU。此 ABI 的特性包括：

- 指令一般由具有编译器标记的 GCC 生成
- 使用标准 Linux x86 32 位调用规范，与 SVR 使用的规范相反。详情请参阅[不同 C++ 编译器和操作系统的调用规范](http://www.agner.org/optimize/calling_conventions.pdf)的第 6 部分“寄存器的使用”。

NDK 工具链假设在函数调用之前进行 16 字节堆栈对齐。默认工具和选项会强制实施此规则。如果编写的是汇编代码，必须确保堆栈对齐，而且其他编译器也遵守此规则。

### C++ 库支持

NDK 支持多种 C++ 运行时库。

#### libc++

>  [LLVM 的 libc++](https://libcxx.llvm.org/) 是 C++ 标准库，自 Lollipop 以来 Android 操作系统便一直使用该库，并且从 NDK r18 开始成为 NDK 中唯一可用的 STL。
>
> libc++ 的共享库为 `libc++_shared.so`，静态库为 `libc++_static.a`。
>
> **注意**：libc++ 不是系统库。如果使用 `libc++_shared.so`，则必须将其包括在您的 APK 中。如果使用 Gradle 编译应用，则此步骤会自动完成。

#### system

> 系统运行时指的是 `/system/lib/libstdc++.so`。请勿将该库与 GNU 的全功能 libstdc++ 混淆。在 Android 系统中，libstdc++ 只是 `new` 和 `delete`。对于全功能 C++ 标准库，请使用 libc++。
>
> 系统 C++ 运行时支持基础 C++ 运行时 ABI。本质上此库提供 `new` 和 `delete`。不同于 NDK 中提供的其他选项，此库不支持异常处理和 RTTI。
>
> 除 `<cstdio>` 等用于 C 库头文件的 C++ 封装容器之外，并无标准库支持。

#### none

另外，您还可选择不使用 STL。在这种情况下，没有关联或授权要求。不提供 C++ 标准头文件。

### 选择C++ 运行时

如果您要使用 CMake，则可使用模块级 `build.gradle` 文件中的 `ANDROID_STL` 变量，指定表 1 中的一个运行时。要了解详情，请参阅[使用 CMake 变量](https://developer.android.com/ndk/guides/cmake.html#variables)。

如果您要使用 ndk-build，则可使用 [Application.mk](https://developer.android.com/ndk/guides/application_mk.html) 文件中的 `APP_STL` 变量指定表 1 中的一个运行时。例如：

```makefile
APP_STL := c++_shared
```



您只能为应用选择一个运行时，并且只能在 [Application.mk](https://developer.android.com/ndk/guides/application_mk.html) 中进行选择。

如果使用的是[独立工具链](https://developer.android.com/ndk/guides/standalone_toolchain.html)，工具链会默认使用共享 STL。要使用静态变体，请将 `-static-libstdc++` 添加至链接器标记中。

### 重要注意事项

#### 静态运行时(静态库)

如果应用的所有原生代码均位于一个共享库中，我们建议使用静态运行时。这样可让链接器最大限度内联和精简未使用的代码，使应用达到最优化状态且文件最小巧。这样做还能避免旧版 Android 中的 PackageManager 和动态链接器出现错误，此类错误可导致处理多个共享库变得困难，且容易出错。

然而，在 C++ 中，在单一程序中定义多个相同函数或对象的副本并不安全。这是 C++ 标准中提出的[单一定义规则](http://en.cppreference.com/w/cpp/language/definition)的一个方面。

如果使用静态运行时（以及一般静态库），很容易在不经意间破坏这条规则。例如，以下应用就破坏了这一规则：

```makefile
# Application.mk
    APP_STL := c++_static
    
```



```makefile
# Android.mk

    include $(CLEAR_VARS)
    LOCAL_MODULE := foo
    LOCAL_SRC_FILES := foo.cpp
    include $(BUILD_SHARED_LIBRARY)

    include $(CLEAR_VARS)
    LOCAL_MODULE := bar
    LOCAL_SRC_FILES := bar.cpp
    LOCAL_SHARED_LIBRARIES := foo
    include $(BUILD_SHARED_LIBRARY)
    
```



在这种情况下，包括全局数据和静态构造函数在内的 STL 将同时存在于两个库中。此应用的运行时行为未定义，因此在实际运行过程中，应用会经常崩溃。其他可能存在的问题包括：

- 内存在一个库中分配，而在另一个库中释放，从而导致内存泄漏或堆损坏。
- `libfoo.so` 中引发的异常在 `libbar.so` 中未被捕获，从而导致应用崩溃。
- `std::cout` 的缓冲未正常运行。

将静态运行时链接至多个库，除了会导致行为问题，还会在每个共享库中复制代码，从而增加应用的大小。

一般情况下，只有在应用中有且只有一个共享库时，才能使用 C++ 运行时的静态变体。

**注意**：此规则既适用于您的代码，也适用于您的第三方依赖项。



#### 共享运行时(动态库)

如果应用包括多个共享库，则应使用 `libc++_shared.so`。

在 Android 系统中，NDK 使用的 libc++ 不是操作系统的一部分。这使得 NDK 用户能够获得最新的 libc++ 功能和问题修复程序，即使应用以旧版 Android 为目标。需要权衡的是，如果使用 `libc++_shared.so`，则必须将其纳入 APK 中。如果使用 Gradle 编译应用，则此步骤会自动完成。

旧版 Android 的 PackageManager 和动态链接器存在错误，导致原生库的安装、更新和加载不可靠。具体而言，如果应用以早于 Android 4.3（Android API 级别 18）的 Android 版本为目标，并且您使用 `libc++_shared.so`，则必须先加载共享库，再加载依赖于共享库的其他库。

[ReLinker](https://github.com/KeepSafe/ReLinker) 项目能够解决所有已知的原生库加载问题，而且相较于自行编写解决方法，它通常是更好的选择。



### C++异常

C++ 异常受 libc++ 支持，但其在 ndk-build 中默认为停用状态。这是因为之前 NDK 并不支持 C++ 异常。CMake 和独立工具链默认启用 C++ 异常。

要在 ndk-build 中针对整个应用启用异常，请将下面这一行代码添加至 [Application.mk](https://developer.android.com/ndk/guides/application_mk.html) 文件：

```makefile
APP_CPPFLAGS := -fexceptions
    
```



要针对单一 ndk-build 模块启用异常，请将下面这一行代码添加至相应模块的 [Android.mk](https://developer.android.com/ndk/guides/android_mk.html) 中：

```makefile
LOCAL_CPP_FEATURES := exceptions
    
```



或者，您可以使用：

```makefile
LOCAL_CPPFLAGS := -fexceptions
    
```



### RTTI

与异常一样，RTTI 也受 libc++ 支持，但在 ndk-build 中默认为停用状态。CMake 和独立工具链默认启用 RTTI。

要在 ndk-build 中针对整个应用启用 RTTI，请将下面这一行代码添加至 [Application.mk](https://developer.android.com/ndk/guides/application_mk.html) 文件：

```makefile
APP_CPPFLAGS := -frtti
    

```



要针对单一 ndk-build 模块启用 RTTI，请将下面这行代码添加至相应模块的 [Android.mk](https://developer.android.com/ndk/guides/android_mk.html) 中：

```makefile
LOCAL_CPP_FEATURES := rtti
    

```



或者，您可以使用：

```makefile
LOCAL_CPPFLAGS := -frtti
    

```



## 头文件与库文件指定

```shell
--sysroot=XX
	使用xx作为这一次编译的头文件与库文件的查找目录，查找下面的 usr/include usr/lib目录
-isysroot XX
	头文件查找目录,覆盖--sysroot ，查找 XX/usr/include
-isystem XX
	指定头文件查找路径（直接查找根目录）
-IXX
	头文件查找目录
优先级：
	-I -> -isystem -> sysroot
	
-LXX
	指定库文件查找目录
-lxx.so
	指定需要链接的库名

#pie 位置无关的可执行程序
export CC="/root/android-ndk-r17b/toolchains/arm-linux-androideabi-4.9/prebuilt/linux-x86_64/bin/arm-linux-androideabi-gcc"
export CFLAGS="--sysroot=/root/android-ndk-r17b/platforms/android-21/arch-arm -isysroot /root/android-ndk-r17b/sysroot -isystem /root/android-ndk-r17b/sysroot/usr/include/arm-linux-androideabi -pie"	
$CC $CFLAGS -o main main.c

```

