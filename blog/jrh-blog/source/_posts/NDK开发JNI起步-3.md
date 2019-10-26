---

title: 'NDK开发JNI起步[3]'
date: 2019-09-02 19:41:32
categories:
- [NDK]
- [JNI]
- [Android]
tags:
- NDK
- JNI
- Jni
- Android 
---



### 采用Android studio进行开发

1. 首先要集成NDK开发环境 参见 ["NDK Android studio 环境集成"](https://developer.android.google.cn/ndk/guides?hl=zh_cn)

2. 按照如下流程操作，新建一个工程项目：

   > as->File->new Project->Phone and Tablet->Native C++ > next > C++ support > finish

   <!--more-->

### JNI数据类型

> JNIEXPORT 和 JNICALL，定义在`jni_md.h`头文件中。
>
> JNIEXPORT：
>
> ​	在 Windows 中,定义为`__declspec(dllexport)`。因为Windows编译 dll 动态库规定，如果动态库中的函数要被外部调用，需要在函数声明中添加此标识，表示将该函数导出在外部可以调用。
>
> ​	在 Linux/Unix/Mac os/Android 这种 Like Unix系统中，定义为`__attribute__ ((visibility ("default")))`
>
> ​	GCC 有个visibility属性, 该属性是说, 启用这个属性:
>
> 1. 当-fvisibility=hidden时
>
> 动态库中的函数默认是被隐藏的即 hidden. 除非显示声明为`__attribute__((visibility("default")))`.
>
> 2. 当-fvisibility=default时
>
>  动态库中的函数默认是可见的.除非显示声明为`__attribute__((visibility("hidden")))`.
>
> JNICALL:
>
> ​	在类Unix中无定义，在Windows中定义为：`_stdcall  ` ，一种函数调用约定
>
> 类Unix系统中这两个宏可以省略不加。	



| Java类型  | 本地类型      | 描述                                     |
| --------- | ------------- | ---------------------------------------- |
| boolean   | jboolean      | C/C++8位整型                             |
| byte      | jbyte         | C/C++带符号的8位整型                     |
| char      | jchar         | C/C++无符号的16位整型                    |
| short     | jshort        | C/C++带符号的16位整型                    |
| int       | jint          | C/C++带符号的32位整型                    |
| long      | jlong         | C/C++带符号的64位整型                    |
| float     | jfloat        | C/C++32位浮点型                          |
| double    | jdouble       | C/C++64位浮点型                          |
| Object    | jobject       | 任何Java对象，或者没有对应java类型的对象 |
| Class     | jclass        | Class对象                                |
| String    | jstring       | 字符串对象                               |
| Object[]  | jobjectArray  | 任何对象的数组                           |
| boolean[] | jbooleanArray | 布尔型数组                               |
| byte[]    | jbyteArray    | 比特型数组                               |
| char[]    | jcharArray    | 字符型数组                               |
| short[]   | jshortArray   | 短整型数组                               |
| int[]     | jintArray     | 整型数组                                 |
| long[]    | jlongArray    | 长整型数组                               |
| float[]   | jfloatArray   | 浮点型数组                               |
| double[]  | jdoubleArray  | 双浮点型数组                             |



### 基本数据类型的签名

> 基本数据类型的签名采用一系列大写字母来表示, 如下表所示:

| Java类型 | 签名             |
| -------- | ---------------- |
| boolean  | Z                |
| short    | S                |
| float    | F                |
| byte     | B                |
| int      | I                |
| double   | D                |
| char     | C                |
| long     | J                |
| void     | V                |
| 引用类型 | L + 全限定名 + ; |
| 数组     | [+类型签名       |

>可以使用javap来获取反射方法时的签名

~~~shell
#cd 进入 class所在的目录 执行： javap -s 全限定名,查看输出的 descriptor
D:\Lance\ndk\lsn7_jni\JniTest\app\build\intermediates\classes\debug>javap -s com.dongnao.jnitest.Helper
Compiled from "Helper.java"
public class com.dongnao.jnitest.Helper {
  public com.dongnao.jnitest.Helper();
    descriptor: ()V

  public void instanceMethod(java.lang.String, int, boolean);
    descriptor: (Ljava/lang/String;IZ)V

  public static void staticMethod(java.lang.String, int, boolean);
    descriptor: (Ljava/lang/String;IZ)V
}
~~~



### 在java中创建native 方法

~~~java
    public native String stringFromJNI();

    public native void showTag(int num,String msg);

    public native void testArray(int[] nums,String[] strs);

    public native void testStudent(Student student);

~~~

### 加载 C++ 库

~~~java
    static {
        System.loadLibrary("native-lib");
    }
~~~

cmake.text

~~~tiki wiki
add_library( # Sets the name of the library.
        native-lib
        # Sets the library as a shared library.
        SHARED
        # Provides a relative path to your source file(s).
        native-lib.cpp)
~~~

### activity中调用native方法

~~~java
 @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Example of a call to a native method
        TextView tv = findViewById(R.id.sample_text);
        tv.setText(stringFromJNI());
        showTag(100,"showTag");
        nums = new int[]{1, 2, 3, 4, 5};
        strs = new String[]{"aa","bb","cc","dd","ee"};
        testArray(nums,strs);

        Student student = new Student("jiarh",20);
        testStudent(student);
    }

~~~



native-lib.cpp

~~~c++
#include <jni.h>
#include <string>
#include <android/log.h>

#define LOG(...) __android_log_print(ANDROID_LOG_ERROR,"JNI",__VA_ARGS__);

using namespace std;


extern "C" JNIEXPORT jstring JNICALL
Java_jrhlive_com_ndkapplication_MainActivity_stringFromJNI(
        JNIEnv *env,
        jobject /* this */) {
    string hello = "Hello from C++";
    return env->NewStringUTF(hello.c_str());
}

//获取 int  string 传参的值
extern "C"
JNIEXPORT void JNICALL
Java_jrhlive_com_ndkapplication_MainActivity_showTag(JNIEnv *env, jobject instance, jint num,
                                                     jstring msg_) {
    const char *msg = env->GetStringUTFChars(msg_, 0);
    LOG("获取java传入的参数：num = %d", num);
    LOG("获取java传入的参数：msg = %s", msg);
    env->ReleaseStringUTFChars(msg_, msg);
}
// 获取java传入的参数：num = 100
// 获取java传入的参数：msg = showTag

//获取传入的数组 int[] array[]
extern "C"
JNIEXPORT void JNICALL
Java_jrhlive_com_ndkapplication_MainActivity_testArray(JNIEnv *env, jobject instance,
                                                       jintArray nums_, jobjectArray strs) {

    //获取传入的 nums数组的地址
    jint *nums = env->GetIntArrayElements(nums_, NULL);

    // 获取数组的长度
    jint nums_len = env->GetArrayLength(nums_);
    LOG("获取java传入的nums长度 %d", nums_len);   //获取java传入的nums长度 5
    //遍历数组的值
    for (int i = 0; i < nums_len; i++) {
        LOG("nums 的第%d个元素是%d", i, *(nums + i));
    }

//nums 的第0个元素是1
//nums 的第1个元素是2
//nums 的第2个元素是3
//nums 的第3个元素是4
//nums 的第4个元素是5
  
    //释放内存
    env->ReleaseIntArrayElements(nums_, nums, 0);


    //获取字符串数组的长度
    jint str_len = env->GetArrayLength(strs);
    LOG("获取java传入的strs长度 %d", str_len); // 获取java传入的strs长度 5
    for (int i = 0; i < str_len; ++i) {
        jstring str = static_cast<jstring>(env->GetObjectArrayElement(strs, i));
        const char *c_str = env->GetStringUTFChars(str, 0);
        LOG("字符串有:%s", c_str);
        //释放内存
        env->ReleaseStringUTFChars(str, c_str);
    }

//字符串有:aa
//字符串有:bb
//字符串有:cc
//字符串有:dd
//字符串有:ee

}


// 传递引用类型

extern "C"
JNIEXPORT void JNICALL
Java_jrhlive_com_ndkapplication_MainActivity_testStudent(JNIEnv *env, jobject instance,
                                                         jobject student) {

    //1:反射获取 Java 对应的class对象。
    jclass stu_class = env->GetObjectClass(student);
    //2:找到要调用的方法
    // 第三个参数 方法签名
    jmethodID get_name = env->GetMethodID(stu_class,"getName", "()Ljava/lang/String;");
    //调用方法
    jstring  strName = static_cast<jstring>(env->CallObjectMethod(student, get_name));
    const  char * str_n = env->GetStringUTFChars(strName,0);
    LOG("student的name:%s", str_n); //student的name:jiarh
    env->ReleaseStringUTFChars(strName,str_n);

    jmethodID  get_age = env->GetMethodID(stu_class,"getAge", "()I");
    jint stuAge = env->CallIntMethod(student,get_age);
    LOG("student的age:%d", stuAge); // student的age:20

    //调用设置属性

    jmethodID  setName = env->GetMethodID(stu_class,"setName", "(Ljava/lang/String;)V");
    jstring  newName = env->NewStringUTF("jrhLiveLife");
    env->CallVoidMethod(student,setName,newName);


    // 调用 staticMethod
    jmethodID show = env->GetStaticMethodID(stu_class,"show","()V");
    env->CallStaticVoidMethod(stu_class,show);


    //在jni创建java对象

    jclass person_class = env->FindClass("jrhlive/com/ndkapplication/Person");
    //获得类的构造方法
    jmethodID perConstuct = env->GetMethodID(person_class,"<init>","(Ljava/lang/String;)V");

    jstring  pName = env->NewStringUTF("Person_Live");
    jobject per = env->NewObject(person_class,perConstuct,pName);

    jmethodID getPName = env->GetMethodID(person_class,"getName", "()Ljava/lang/String;");
    env->CallObjectMethod(per,getPName);//Person: getName: Person

    //打印name的值
    jfieldID  pn = env->GetFieldID(person_class,"name","Ljava/lang/String;");
    jstring  pnStr = static_cast<jstring>(env->GetObjectField(per, pn));
    const char* pn_str = env->GetStringUTFChars(pnStr,0);

    LOG("Person的name:%s", pn_str);//Person的name:Person_Live

    // 获取static Filed
    jfieldID  p_tag = env->GetStaticFieldID(person_class,"TAG","Ljava/lang/String;");
    jstring p_tag_str = static_cast<jstring>(env->GetStaticObjectField(person_class, p_tag));
    const  char * pTag = env->GetStringUTFChars(p_tag_str,0);
    LOG("Person的TAG=:%s", pTag); //Person的TAG=:Person


    env->DeleteLocalRef(p_tag_str);
    env->DeleteLocalRef(per);
    env->DeleteLocalRef(pName);
    env->DeleteLocalRef(pnStr);
    env->DeleteLocalRef(stu_class);


}
~~~



person.java

~~~java
package jrhlive.com.ndkapplication;

import android.util.Log;

/**
 * desc:
 * Created by jiarh on 2019-09-02 18:00.
 */
public class Person {

    String name;
    int age;

    private static final String TAG = "Person";
    public Person(String name) {
        this.name = name;
    }

    public String getName() {
        Log.e(TAG, "getName: Person" );
        return name;

    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}

~~~



Student.java

~~~java
package jrhlive.com.ndkapplication;

import android.util.Log;

/**
 * desc:
 * Created by jiarh on 2019-09-02 17:06.
 */
public class Student {
    String name;
    int age;
    private static final String TAG = "Student";

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {

        return name;
    }

    public void setName(String name) {
        this.name = name;
        Log.e(TAG, "student setName: " + name);

    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public static void show(){
        Log.e(TAG, "student show: student");
    }
}

~~~



### JNI引用

> 在 JNI 规范中定义了三种引用：局部引用（Local Reference）、全局引用（Global Reference）、弱全局引用（Weak Global Reference）。

#### 局部引用

> 大多数JNI函数会创建局部引用。NewObject/FindClass/NewStringUTF 等等都是局部引用。
>
> 局部引用只有在创建它的本地方法返回前有效,本地方法返回后，局部引用会被自动释放。
>
> 因此无法跨线程、跨方法使用。

```c++
extern "C"
JNIEXPORT jstring JNICALL
xxx(JNIEnv *env, jobject instance) {
	//错误
	//不能在本地方法中把局部引用存储在静态变量中缓存起来供下一次调用时使用。
	// 第二次执行 str依然有值，但是其引用的 “C++字符串” 已经被释放
    static jstring str;
    if(str == NULL){
    	 str = env->NewStringUTF("C++字符串");
    }
    return str;
}
```

> **释放一个局部引用有两种方式:**
>
> **1、本地方法执行完毕后VM自动释放；**
>
> **2、通过DeleteLocalRef手动释放；**
>
> VM会自动释放局部引用，为什么还需要手动释放呢？
>
> 因为局部引用会阻止它所引用的对象被GC回收。 

#### 全局引用

> 全局引用可以跨方法、跨线程使用，直到它被手动释放才会失效 。
>
> 由 NewGlobalRef  函数创建

```c++
extern "C"
JNIEXPORT jstring JNICALL
Java_com_dongnao_jnitest_MainActivity_test1(JNIEnv *env, jobject instance) {
	//正确
    static jstring globalStr;
    if(globalStr == NULL){
        jstring str = env->NewStringUTF("C++字符串");
        //删除全局引用调用  DeleteGlobalRef
        globalStr = static_cast<jstring>(env->NewGlobalRef(str));
        //可以释放，因为有了一个全局引用使用str，局部str也不会使用了
        env->DeleteLocalRef(str);
    }
    return globalStr;
}
```



#### 弱引用

> 与全局引用类似，弱引用可以跨方法、线程使用。与全局引用不同的是，弱引用不会阻止GC回收它所指向的VM内部的对象 。
>
> 在对Class进行弱引用是非常合适（FindClass），因为Class一般直到程序进程结束才会卸载。
>
> 在使用弱引用时，必须先检查缓存过的弱引用是指向活动的对象，还是指向一个已经被GC的对象

```c++
extern "C"
JNIEXPORT jclass JNICALL
Java_com_dongnao_jnitest_MainActivity_test1(JNIEnv *env, jobject instance) {
    static jclass globalClazz = NULL;
    //对于弱引用 如果引用的对象被回收返回 true，否则为false
    //对于局部和全局引用则判断是否引用java的null对象
    jboolean isEqual = env->IsSameObject(globalClazz, NULL);
    if (globalClazz == NULL || isEqual) {
        jclass clazz = env->GetObjectClass(instance);
        //删除使用 DeleteWeakGlobalRef
        globalClazz = static_cast<jclass>(env->NewWeakGlobalRef(clazz));
        env->DeleteLocalRef(clazz);
    }
    return globalClazz;
}
```

### JNI_OnLoad

> 调用System.loadLibrary()函数时， 内部就会去查找so中的 JNI_OnLoad 函数，如果存在此函数则调用。
>
> JNI_OnLoad会：
>
> 告诉 VM 此 native 组件使用的 JNI 版本。
>
> ​	对应了Java版本，android中只支持JNI_VERSION_1_2 、JNI_VERSION_1_4、JNI_VERSION_1_6 
>
> ​	在JDK1.8有 JNI_VERSION_1_8。

```c++
jint JNI_OnLoad(JavaVM* vm, void* reserved){
    // 2、4、6都可以
    return JNI_VERSION_1_4;
}
```

> 

```c++
//Java：
native void dynamicNative();
native String dynamicNative(int i);

//C++：
void  dynamicNative1(JNIEnv *env, jobject jobj){
    LOGE("dynamicNative1 动态注册");
}
jstring  dynamicNative2(JNIEnv *env, jobject jobj,jint i){
    return env->NewStringUTF("我是动态注册的dynamicNative2方法");
}

//需要动态注册的方法数组
static const JNINativeMethod mMethods[] = {
        {"dynamicNative","()V", (void *)dynamicNative1},
        {"dynamicNative", "(I)Ljava/lang/String;", (jstring *)dynamicNative2}

};
//需要动态注册native方法的类名
static const char* mClassName = "com/dongnao/jnitest/MainActivity";
jint JNI_OnLoad(JavaVM* vm, void* reserved){
    JNIEnv* env = NULL;
    //获得 JniEnv
    int r = vm->GetEnv((void**) &env, JNI_VERSION_1_4);
    if( r != JNI_OK){
        return -1;
    }
    jclass mainActivityCls = env->FindClass( mClassName);
    // 注册 如果小于0则注册失败
    r = env->RegisterNatives(mainActivityCls,mMethods,2);
    if(r  != JNI_OK )
    {
        return -1;
    }
    return JNI_VERSION_1_4;
}
```

### native线程调用Java

> native调用java需要使用JNIEnv这个结构体，而JNIEnv是由Jvm传入与线程相关的变量。
>
> 但是可以通过JavaVM的AttachCurrentThread方法来获取到当前线程中的JNIEnv指针。



```c++
JavaVM* _vm = 0;
jobject  _instance = 0;
jint JNI_OnLoad(JavaVM* vm, void* reserved){
    _vm = vm;
    return JNI_VERSION_1_4;
}
void *task(void *args){
    JNIEnv *env;
    //将本地当前线程附加到jvm，并获得jnienv
    //成功则返回0
    _vm->AttachCurrentThread(&env,0);
    
    jclass clazz = env->GetObjectClass(_instance);

    //获得具体的静态方法 参数3：方法签名
    //如果不会填 可以使用javap
    jmethodID staticMethod = env->GetStaticMethodID(clazz,"staticMethod","(Ljava/lang/String;IZ)V");
    //调用静态方法
    jstring staticStr= env->NewStringUTF("C++调用静态方法");
    env->CallStaticVoidMethod(clazz,staticMethod,staticStr,1,1);

    //获得构造方法
    jmethodID constructMethod = env->GetMethodID(clazz,"<init>","()V");
    //创建对象
    jobject  helper = env->NewObject(clazz,constructMethod);
    jmethodID instanceMethod = env->GetMethodID(clazz,"instanceMethod","(Ljava/lang/String;IZ)V");
    jstring instanceStr= env->NewStringUTF("C++调用实例方法");
    env->CallVoidMethod(helper,instanceMethod,instanceStr,2,0);

    //释放
    env->DeleteLocalRef(clazz);
    env->DeleteLocalRef(staticStr);
    env->DeleteLocalRef(instanceStr);
    env->DeleteLocalRef(helper);
    //分离
    _vm->DetachCurrentThread();
    return 0;
}

//Helper 类方法
extern "C"
JNIEXPORT void JNICALL
Java_com_dongnao_jnitest_Helper_nativeThread(JNIEnv *env, jobject instance) {
    pthread_t  pid;
    //这里注意释放
    _instance = env->NewGlobalRef(instance);
   pthread_create(&pid,0,task,0);
}
```

