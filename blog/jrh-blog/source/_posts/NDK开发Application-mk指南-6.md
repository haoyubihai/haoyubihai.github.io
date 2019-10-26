---
title: 'NDK开发Application.mk指南[6]'
date: 2019-09-05 13:39:51
categories:
 - [NDK]
 - [Android]
tags:
 - [NDK]
 - [JNI]
---

# Application.mk

[官网地址](https://developer.android.com/ndk/guides/application_mk.html)

Application.mk` 指定了 ndk-build 的项目范围设置。默认情况下，它位于应用项目目录中的 `jni/Application.mk` 下。

**注意**：其中许多参数也具有模块等效项。例如，`APP_CFLAGS` 对应于 `LOCAL_CFLAGS`。无论何种情况下，特定于模块的选项都将优先于应用范围选项。对于标记，两者都使用，但特定于模块的标记将后出现在命令行中，因此它们可能会替换项目范围设置。

<!--more-->

### 变量

##### APP_ABI

默认情况下，NDK 编译系统会为所有非弃用 ABI 生成代码。您可以使用 `APP_ABI` 设置为特定 ABI 生成代码。表 1 显示了不同指令集的 `APP_ABI` 设置。

**表 1.** 不同指令集的 `APP_ABI` 设置。

| 指令集                 | 值                       |
| ---------------------- | ------------------------ |
| 32 位 ARMv7            | `APP_ABI := armeabi-v7a` |
| 64 位 ARMv8 (AArch64） | `APP_ABI := arm64-v8a`   |
| x86                    | `APP_ABI := x86`         |
| x86-64                 | `APP_ABI := x86_64`      |
| 所有支持的 ABI（默认） | `APP_ABI := all`         |

您也可以指定多个值，方法是将它们放在同一行上，中间用空格分隔。例如：

```makefile
APP_ABI := armeabi-v7a arm64-v8a x86
    
```



**注意**：Gradle 的 `externalNativeBuild` 会忽略 `APP_ABI`。请在 `splits` 块内部使用 `abiFilters` 块或（如果使用的是“多个 APK”）`abi` 块。

有关所有受支持 ABI 的列表以及有关其用法和限制的详细信息，请参阅 [ABI 管理](https://developer.android.com/ndk/guides/abis)。

##### APP_ASFLAGS

要传递给项目中每个汇编源文件（`.s` 和 `.S` 文件）的汇编器的标记。

**注意**：`ASFLAGS` 与 `ASMFLAGS` 不同。后者专门适用于 YASM 源文件（请参阅 [APP_ASMFLAGS](https://developer.android.com/ndk/guides/application_mk.html#app-asmflags) 部分）。

##### APP_ASMFLAGS

对于所有 YASM 源文件（`.asm`，仅限 x86/x86_64），要传递给 YASM 的标记。

##### APP_BUILD_SCRIPT

默认情况下，ndk-build 假定 [Android.mk](https://developer.android.com/ndk/guides/android_mk.html) 文件位于相对于项目根目录的 `jni/Android.mk`。

要从其他位置加载 [Android.mk](https://developer.android.com/ndk/guides/android_mk.html) 文件，请将 `APP_BUILD_SCRIPT` 设置为 Android.mk 文件的绝对路径。

**注意**：Gradle 的 `externalNativeBuild` 将根据 `externalNativeBuild.ndkBuild.path` 变量自动配置此路径。

##### APP_CFLAGS

要为项目中的所有 C/C++ 编译传递的标记。

**注意**：Include 路径应使用 `LOCAL_C_INCLUDES` 而不是显式 `-I` 标记。

另请参阅：[APP_CONLYFLAGS](https://developer.android.com/ndk/guides/application_mk.html#app-conlyflags)、[APP_CPPFLAGS](https://developer.android.com/ndk/guides/application_mk.html#app-cppflags)。

##### APP_CLANG_TIDY

要为项目中的所有模块启用 clang-tidy，请将此标记设置为“True”。默认处于停用状态。

##### APP_CLANG_TIDY_FLAGS

要为项目中的所有 clang-tidy 执行传递的标记。

##### APP_CONLYFLAGS

要为项目中的所有 C 编译传递的标记。这些标记不会用于 C++ 代码。

另请参阅：[APP_CFLAGS](https://developer.android.com/ndk/guides/application_mk.html#app-cflags)、[APP_CPPFLAGS](https://developer.android.com/ndk/guides/application_mk.html#app-cppflags)。

##### APP_CPPFLAGS

要为项目中的所有 C++ 编译传递的标记。这些标记不会用于 C 代码。

另请参阅：[APP_CFLAGS](https://developer.android.com/ndk/guides/application_mk.html#app-cflags)、[APP_CONLYFLAGS](https://developer.android.com/ndk/guides/application_mk.html#app-conlyflags)。

##### APP_CXXFLAGS

**注意**：[APP_CPPFLAGS](https://developer.android.com/ndk/guides/application_mk.html#app-cppflags) 应优先于 `APP_CXXFLAGS`。

与 `APP_CPPFLAGS` 相同，但在编译命令中将出现在 `APP_CPPFLAGS` 之后。例如：

```makefile
APP_CPPFLAGS := -DFOO
    APP_CXXFLAGS := -DBAR
    
```

以上配置将导致编译命令类似于 `clang++ -DFOO -DBAR`，而不是 `clang++ -DBAR -DFOO`。

##### APP_DEBUG

要编译可调试的应用，请将此标记设置为“True”。

##### APP_LDFLAGS

关联可执行文件和共享库时要传递的标记。

**注意**：这些标记对静态库没有影响。不会关联静态库。

##### APP_MANIFEST

AndroidManifest.xml 文件的绝对路径。

默认情况下将使用 `$(APP_PROJECT_PATH)/AndroidManifest.xml)`（如果存在）。

**注意**：使用 `externalNativeBuild` 时，Gradle 不会设置此值。

##### APP_MODULES

要编译的模块的显式列表。此列表的元素是模块在 [Android.mk](https://developer.android.com/ndk/guides/android_mk.html) 文件的 `LOCAL_MODULE` 中显示的名称。

默认情况下，ndk-build 将编译所有共享库、可执行文件及其依赖项。仅当项目使用静态库、项目仅包含静态库或者在 `APP_MODULES` 中指定了静态库时，才会编译静态库。

**注意**：将不会编译导入的模块（在使用 `$(call import-module)` 导入的编译脚本中定义的模块），除非要在 `APP_MODULES` 中编译或列出的模块依赖导入的模块。

##### APP_OPTIM

将此可选变量定义为 `release` 或 `debug`。默认情况下，将编译发布二进制文件。

发布模式会启用优化，并可能生成无法与调试程序一起使用的二进制文件。调试模式会停用优化，以便可以使用调试程序。

请注意，您可以调试发布二进制文件或调试二进制文件。但是，发布二进制文件在调试期间提供的信息较少。例如，变量可能会被优化掉，导致无法检查代码。此外，代码重新排序会使单步调试代码变得更加困难；堆栈跟踪可能不可靠。

在应用清单的 `<application>` 标记中声明 `android:debuggable` 将导致此变量默认为 `debug`，而不是 `release`。通过将 `APP_OPTIM` 设置为 `release` 可替换此默认值。

**注意**：使用 `externalNativeBuild` 进行编译时，Android Studio 将根据您的编译风格适当地设置此标记。

##### APP_PLATFORM

`APP_PLATFORM` 会声明编译此应用所面向的 Android API 级别，并对应于应用的 `minSdkVersion`。

如果未指定，ndk-build 将以 NDK 支持的最低 API 级别为目标。最新 NDK 支持的最低 API 级别总是足够低，可以支持几乎所有使用中的设备。

**警告**：将 `APP_PLATFORM` 设置为高于应用的 `minSdkVersion` 可能会生成一个无法在旧设备上运行的应用。在大多数情况下，库将无法加载，因为它们引用了在旧设备上不可用的符号。

例如，值 `android-16` 指定库使用在 Android 4.1（API 级别 16）以前的版本中不可用的 API，并且无法在运行较低平台版本的设备上使用。有关平台名称和相应 Android 系统映像的完整列表，请参阅 [Android NDK 原生 API](https://developer.android.com/ndk/guides/stable_apis.html)。

使用 Gradle 和 `externalNativeBuild` 时，不应直接设置此参数。而是在[模块级别](https://developer.android.com/studio/build/index.html#module-level) `build.gradle`文件的 `defaultConfig` 或 `productFlavors` 块中设置 `minSdkVersion` 属性。这样就能确保只有在运行足够高 Android 版本的设备上安装的应用才能使用您的库。

请注意，NDK 不包含 Android 每个 API 级别的库，省略了不包含新的原生 API 的版本以节省 NDK 中的空间。ndk-build 按以下优先级降序使用 API：

1. 匹配 `APP_PLATFORM` 的平台版本。
2. 低于 `APP_PLATFORM` 的下一个可用 API 级别。例如，`APP_PLATFORM` 为 `android-20` 时，将使用 `android-19`，因为 android-20 中没有新的原生 API。
3. NDK 支持的最低 API 级别。

##### APP_PROJECT_PATH

项目根目录的绝对路径。

##### APP_SHORT_COMMANDS

`LOCAL_SHORT_COMMANDS` 的项目范围等效项。有关详情，请参阅 [Android.mk](https://developer.android.com/ndk/guides/android_mk.html) 中有关 `LOCAL_SHORT_COMMANDS` 的文档。

##### APP_STL

用于此应用的 C++ 标准库。

默认情况下使用 `system` STL。其他选项包括 `c++_shared`、`c++_static` 和 `none`。请参阅 [NDK 运行时和功能](https://developer.android.com/ndk/guides/cpp-support.html#runtimes)。

##### APP_STRIP_ARCHIVE

要为此应用中的模块传递给 `strip` 的参数。默认为 `--strip-unneeded`。要避免剥离模块中的所有二进制文件，请设置为 `none`。有关其他剥离模式，请参阅[剥离文档](https://sourceware.org/binutils/docs/binutils/strip.html)。

##### APP_THIN_ARCHIVE

要为项目中的所有静态库使用瘦归档，请将此变量设置为“True”。有关详情，请参阅 [Android.mk](https://developer.android.com/ndk/guides/android_mk.html) 中有关 `LOCAL_THIN_ARCHIVE` 的文档。

##### APP_WRAP_SH

要包含在此应用中的 [wrap.sh](https://developer.android.com/ndk/guides/wrap-script) 文件的路径。

每个 ABI 都存在此变量的变体，ABI 通用变体也是如此：

- `APP_WRAP_SH`
- `APP_WRAP_SH_armeabi-v7a`
- `APP_WRAP_SH_arm64-v8a`
- `APP_WRAP_SH_x86`
- `APP_WRAP_SH_x86_64`

**注意**：`APP_WRAP_SH_<abi>` 无法与 `APP_WRAP_SH` 相结合。如果任何 ABI 使用特定于 ABI 的 wrap.sh，则所有 ABI 都必须使用该 wrap.sh。