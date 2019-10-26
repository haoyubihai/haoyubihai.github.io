---
title: 'NDK开发基础[1]'
date: 2019-08-27 15:42:51
categories:
- [NDK]
- [C]
- [C++]
tags: 
- NDK
- C
- C++
---
![pexels](https://images.pexels.com/photos/21696/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&w=500 )
1. ### C 与 C++

   C面向过程的语言，C++ 面向对象的语言 oop，C++ 对C进行了扩展。

   C是C++的子集，C++是C的超集，所以大部分C库都可以被C++使用。

   <!--more-->

2. ### 数据类型

   * signed  有符号
   * unsigned   无符号

   两者区别：取值范围不同。

   

   | 整型           | 字节 | 取值范围                        | 占位 |
   | :------------- | ---- | ------------------------------- | ---- |
   | int            | 4    | -2,147,483,648 到 2,147,483,647 | %d   |
   | unsigned int   | 4    | 0 到 4,294,967,295              | %u   |
   | short          | 2    | -32,768 到 32,767               | %hd  |
   | unsigned short | 2    | 0 到 65,535                     | %hu  |
   | long           | 4    | -2,147,483,648 到 2,147,483,647 | %ld  |
   | unsigned long  | 4    | 0 到 4,294,967,295              | %lu  |
   | char           | 1    | -128 到 127                     | %c   |
   | unsigned char  | 1    | 0 到 255                        | %c   |

   *备注：* 

   *  *由于每个设备的操作系统是不一样的，要精确的获取某个类型在特定平台上的字节大小，可以使用sizeof 运算符。*

   ​    *eg:  sizeof(int) 得到int类型的存储字节大小。*

   * *long int （长整型相当于）= long     (int 可以省去)*
   * 在标准规定中， 规定int至少和short一样长，long 至少和int 一样长。
   * long和int在早期16位电脑时候 int 2字节，long 4字节，而计算机发展到现在，一般32、64下，long和int一样。和java类比的话，java的long就是 long long 8字节

   | 浮点型      | 字节 | 精度     | 占位 |
   | ----------- | ---- | -------- | ---- |
   | float       | 4    | 6位小数  | %f   |
   | double      | 8    | 15位小数 | %lf  |
   | long double | 8    | 19位小数 | %Lf  |

   * C99标准以前，C语言里面是没有bool，C++里面才有
   * C99标准里面定义了bool类型，需要引入头文件stdbool.h
   * bool类型有只有两个值：true =1 、false=0
   * 因此实际上bool就是一个int ，所以在c/c++中 if 遵循一个规则， 非0为true，非空为true
   * NULL 其实也就是被define为了 0 

3. ### 头文件的使用

   (比如：#include <iostream>  #include <stdio.h>)

   头文件中包含了一些定义的全局变量，对外暴露的函数接口，定义了一些函数类型，引入到源文件，程序在编译期间，根据头文件做一些，前置操作，目标文件与源代码文件一起打包变为一个程序执行的目标文件，源代码文件中对方法，函数实现，或者调用已有的变量，函数。

   一个库函数的使用，必须在头文件中定义函数类型，并在源文件中引入头文件。

   （#include <iosstream> 表示是一个全局搜索的头文件，全局查找；#include "aa.h" 表示一个相对路径查找）

4. ### 数组

   数组在内存中是开辟一块儿连续的地址存储。

   声明：

   ```c
   //c
   //必须声明时候确定大小
   int a[10]  
   //或者 直接初始化 
   int a[] = {1,2,3}
   
   //大小
   printf("%d",sizeof(a)/sizeof(int));
   ```

5. ### 内存

   **malloc** 
   	没有初始化内存的内容,一般调用函数memset来初始化这部分的内存空间.

   **calloc**
   	申请内存并将初始化内存数据为NULL.

   ​	 ` int *pn = (int*)calloc(10, sizeof(int));`

   **realloc**

   ​	 对malloc申请的内存进行大小的调整.

   ```c
   char *a = (char*)malloc(10);
   realloc(a,20);
   ```

   特别的：
   **alloca**
   在栈申请内存,因此无需释放.
   `int *p = (int *)alloca(sizeof(int) * 10);`

   {% asset_img  内存布局.png 内存布局%}

   

   {% asset_img  内存布局解释.jpg  内存布局解释%}


**物理内存**
   	物理内存指通过物理内存条而获得的内存空间

   **虚拟内存**
   	一种内存管理技术
	电脑中所运行的程序均需经由内存执行，若执行的程序占用内存很大，则会导致内存消耗殆尽。
   	虚拟内存技术还会匀出一部分硬盘空间来充当内存使用。

   

代码段：
   存放程序执行代码（cpu要执行的指令）

> 栈是向低地址扩展数据结构
   > 堆是向高地址扩展数据结构

   进程分配内存主要由两个系统调用完成：**brk和mmap** 。

   1. brk是将_edata(指带堆位置的指针)往高地址推；
   2. mmap 找一块空闲的虚拟内存。

   

   通过glibc (C标准库)中提供的malloc函数完成内存申请

   malloc小于128k的内存，使用brk分配内存，将_edata往高地址推,大于128k则使用mmap

   {% asset_img brk.png brk申请内存 %}

6. ### 指针

   int *p1;（没有初始化的指针，称为野指针）

   int i = 10;

   int *p1 = &i; （&表示取地址，p1指针指向 i 的地址）

   通过*p1 可以获取 p1指针指向地址的值 10 （通过* * 解应用）

   通过指针可以操作内存，指针支持自增（++），自减操作（--）加 （+） 减 （-）,地址偏移。

   例如： 

   数组的内存存储是一块儿连续的内存空间。是一块内存连续的数据。指针指向的是内存的变量。

   int array1[] ={1,2,3,4};

   int *array_p1 = array1;  //将数组的首地址赋值给指针。

   for(size_t  i=0; i<4; i++){

   printf("数组中的元素：%d\n",*array_p1++); //指针地址+1则指向下一个地址

   }

   printf("array2输出数组名：%#x",array1) ； //这里输出的是数组的首地址。

   ~~~c++
   #include <iostream>
   using namespace std;
   int main(int argc, const char * argv[]) {
       int array1[] = {12,22,32,42};
       int *p1 = array1;
       //&array1 数组的地址
       printf("array1的地址%#x\n",&array1);
       // 指针p1指向数组的地址 相当于第一个值12的地址
       printf("*p1指向的地址%#x\n",p1);
       // *p1 通过*解应用，取出p1地址的值 12
        printf("*p1的值%d\n",*p1);
       //相当于 12+1
        printf("*p1+1的值%d\n",*p1+1);
   //通过指针对地址进行+1操作，指向当前地址的下个地址，由于数组开辟的内存是连续的地址，所以现在下一个地址存储的值为22
        printf("*(p1+1)的值%d\n",*(p1+1));
       
        return 0;
   }
   
   out:
   
   array1的地址0xefbff590
   *p1指向的地址0xefbff590
   *p1的值12
   *p1+1的值13
   *(p1+1)的值22
   
   ~~~

   

   

   ### 数组指针 

   

   （数组的指针)

   ~~~c++
   #include <iostream>
   using namespace std;
   int main(int argc, const char * argv[]) {
   
       int array[2][3] = {{11,22,33},{43,53,63}};
       // 数组的指针，固定写法，这里创建了一个指向 int[3] 数组的指针
       int (*p)[3] = array;
       printf("*p的地址%#x\n",&array);
       //取出第一个值 *p 指向的是第一个元素即{11,22,33}的数组， 那么取出1的话  就是 *（*p）
       printf("**p取出第一个值%d\n",**p);
       //取出第一个数组的第二个值 （*p+1）指针后移一位找到第二位的地址， *（*p+1）取出值
       printf("取出第一个数组的第二个值%d\n",*(*p+1));
       //取出第二个数组的第二个值 *(p+1)表示找到第二个数组的首地址，*(p+1)+1指针后移一位找到第二位的地址， *(*(p+1)+1)取出值
       printf("取出第一个数组的第二个值%d\n",*(*(p+1)+1));
       
        return 0;
   }
   
   out:
   *p的地址0xefbff590
   **p取出第一个值11
   取出第一个数组的第二个值22
   取出第一个数组的第二个值53
   ~~~

   ### 指针数组

   （指针的数组）

   ~~~c++
   using namespace std;
   int main(int argc, const char * argv[]) {
   
       int aa =2;
       int *a  = &aa;
       int bb =3;
       int *b  = &bb;
       int cc =4;
       int *c  = &cc;
       
       int *p[] ={a,b,c};
       
       for (int i=0; i<3; i++) {
           printf("第%d个元素为%#x\n",i,*p+i);
       }
        return 0;
   }
   
   out:
   第0个元素为0xefbff57c
   第1个元素为0xefbff580
   第2个元素为0xefbff584
   ~~~

   * **const char *, char const *, char * const，char const * const** 

     > const ：常量 = final

     

     ```c
     //从右往左读
     //P是一个指针 指向 const char类型
     char str[] = "hello";
     const char *p = str;
     str[0] = 'c'; //正确
     p[0] = 'c';   //错误 不能通过指针修改 const char
     
     //可以修改指针指向的数据 
     //意思就是 p 原来 指向david,
     //不能修改david爱去天之道的属性，
     //但是可以让p指向lance，lance不去天之道的。
     p = "12345";
     
     //性质和 const char * 一样
     char const *p1;
     
     //p2是一个const指针 指向char类型数据
     char * const p2 = str;
     p2[0] = 'd';  //正确
     p2 = "12345"; //错误
     
     //p3是一个const的指针变量 意味着不能修改它的指向
     //同时指向一个 const char 类型 意味着不能修改它指向的字符
     //集合了 const char * 与  char * const
     char const* const p3 = str;
     ```

#### 多级指针

> 指向指针的指针
>
> 一个指针包含一个变量的地址。当我们定义一个指向指针的指针时，第一个指针包含了第二个指针的地址，第二个指针指向包含实际值的位置。

```c
int a = 10;
int *i = &a;
int **j = &i;
// *j 解出 i   
printf("%d\n", **j);
```

##### 多级指针的意义

> 见函数部分的引用传值

6. ### 函数

   函数在使用之前要声明。 int  plusNum(int,int);

   * 传值

     > 把参数的值复制给函数的形式参数。修改形参不会影响实参

     

   * 传引用 （传递地址，函数通过指针接收，操作地址）

     > ​	形参为指向实参地址的指针，可以通过指针修改实参。

     ~~~c
     void change1(int *i) {
     	*i = 10;
     }
     void change2(int *i) {
     	*i = 10;
     }
     int i = 1;
     change1(i);
     printf("%d\n",i); //i == 1
     change2(&i);
     printf("%d\n",i); //i == 10
     ~~~

     

7. ### 可变参数

~~~c
#include <stdarg.h>
int add(int num, ...)
{
	va_list valist;
	int sum = 0;
	// 初始化  valist指向第一个可变参数 (...)
	va_start(valist, num);
	for (size_t i = 0; i < num; i++)
	{
		//访问所有赋给 valist 的参数
		int j = va_arg(valist, int);
		printf("%d\n", j);
		sum += j;
	}
	//清理为 valist 内存
	va_end(valist);
	return sum;
}
~~~

8. ### 函数指针

   > 函数指针是指向函数的指针变量

   

   ~~~c
   void println(char *buffer) {
   	printf("%s\n", buffer);
   }
   //接受一个函数作为参数
   /*
   void(*p)(char*) //表示一个函数的定义
   void:表示函数的返回值。
   p:表示函数名，可以随便定义。
   char* :表示参数类型，可以有多个参数
   */
   void say(void(*p)(char*), char *buffer) {
   	p(buffer);
   }
   // 指向println函数
   void(*p)(char*) = println;
   //相当于调用 println函数
   p("hello");
   //传递参数
   say(println, "hello");
   
   //typedef 创建别名 由编译器执行解释
   //typedef unsigned char u_char;
   //定义了一个Fun的函数别名
   typedef void(*Fun)(char *);
   Fun fun = println;
   fun("hello");
   say(fun, "hello");
   
   //类似java的回调函数
   using namespace std;
   
   typedef void(*Callback)(char *);
   
   void callback(char *msg){
       printf("%s\n",msg);
   }
   void test(Callback callback){
       callback("success");
       callback("fail");
   }
   int main(int argc, const char * argv[]) {
       test(callback);
       return 0;
   }
   
   ~~~

   

9. ### 预处理器

   预处理器不是编译器，但是它是编译过程中一个单独的步骤。

   预处理器是一个文本替换工具

   所有的预处理器命令都是以井号（#）开头

   

   #### 常用预处理器

   | 预处理器 | 说明         |
   | -------- | ------------ |
   | #include | 导入头文件   |
   | #if      | if           |
   | #elif    | else if      |
   | #else    | else         |
   | #endif   | 结束 if      |
   | #define  | 宏定义       |
   | #ifdef   | 如果定义了宏 |
   | #ifndef  | 如果未定义宏 |
   | #undef   | 取消宏定义   |

   #### 宏

   **预处理器是一个文本替换工具**

   > 宏就是文本替换

   

   ~~~c
   //宏一般使用大写区分
   //宏变量
   //在代码中使用 A 就会被替换为1
   #define A 1
   
   //宏函数
   #define test(i) i > 10 ? 1: 0
   
   // # 连接符 连接两个符号组成新符号
   #define TWO(arg1,arg2) (arg1##arg2)
   
   // 在gcc中使用##来连接字符串（注意是字符串）的时候回报错，宏定义的时候可以直接将##省略
   #define TWOO(arg1,arg2) (arg1 arg2)
   
   #define MULTI(x,y) x*y
   
      printf("A = %d\n",A);
       int a = test(3);
       int b = test(120);
       
       printf("a = %d,b= %d \n",a,b);
       //1020
       printf("TWO(10,20) = %d\n",TWO(10,20));
       //aabb
       printf("TWOO(aa,bb) = %s\n",TWOO("aa", "bb"));
       // 2*4 = 8
       printf("MULTI(2,4) = %d\n",MULTI(2, 4));
       // 2+2*4 = 10
       printf("MULTI(2+2,4) = %d\n",MULTI(2+2, 4));
   
   out:
   
   A = 1
   a = 0,b= 1 
   TWO(10,20) = 1020
   TWOO(aa,bb) = aabb
   MULTI(2,4) = 8
   MULTI(2+2,4) = 10
   ~~~

   > 宏函数
   >
   > ​	优点：
   >
   > ​		文本替换，每个使用到的地方都会替换为宏定义。
   >
   > ​		不会造成函数调用的开销（开辟栈空间，记录返回地址，将形参压栈，从函数返回还要释放堆		
   >
   > ​		栈。）
   >
   > ​	缺点：
   >
   > ​		生成的目标文件大，不会执行代码检查
   >
   > 
   >
   > 内联函数
   >
   > 和宏函数工作模式相似，但是两个不同的概念，首先是函数，那么就会有类型检查同时也可以debug
   > 在编译时候将内联函数插入。
   >
   > 不能包含复杂的控制语句，while、switch，并且内联函数本身不能直接调用自身。
   > 如果内联函数的函数体过大，编译器会自动的把这个内联函数变成普通函数。

   

10. ###  结构体

    > 结构体是C编程中一种用户自定义的数据类型，类似于Java的JavaBean

    

    ~~~c
    //Student 相当于类名
    //student和a 可以不定义，表示结构变量，也就Student类型的变量
    struct Student
    {
    	char name[50];
    	int age;
    } student,a;
    //使用typedef定义
    typedef struct{
        char name[50];
        int age;
    } Student;
    ~~~

    

    

    当结构体需要内存过大，使用动态内存申请。结构体占用字节数和结构体内字段有关，指针占用内存就是4/8字节，因此传指针比传值效率更高。

    

    ~~~c
    struct Student *s = (Student*)malloc(sizeof(Student));
    memset(s,0,sizeof(Student));
    printf("%d\n", s->age);
    ~~~

    

    #### 字节对齐

    > 内存空间按照字节划分，理论上可以从任何起始地址访问任意类型的变量。但实际中在访问特定类型变量时经常在特定的内存地址开始访问，这就需要各种类型数据按照一定的规则在空间上排列，而不是顺序一个接一个地存放，这就是对齐。 
    >
    > 字节对齐的问题主要就是针对结构体。

    

    ~~~c
    struct MyStruct1
    {
    	short a;  
    	int b;	
    	short c; 
    };
    struct MyStruct2
    {
      short a;
    	short c; 
    	int b;
    };
    //自然对齐
    //1、某个变量存放的起始位置相对于结构的起始位置的偏移量是该变量字节数的整数倍；
    //2、结构所占用的总字节数是结构中字节数最长的变量的字节数的整数倍。
    // short = 2  补 2
    // int = 4
    // short = 2  补 2
    sizeof(MyStruct1) = 12
    // 2个short在一起组成一个 4 
    sizeof(MyStruct2) = 8
      
    #pragma pack(2) //指定以2字节对齐
    struct MyStruct1
    {
    	short a;  
    	int b;	
    	short c; 
    };
    #pragma pack()	//取消对齐
    //short = 2
    //int = 4
    //short = 2
    ~~~

    > 合理的利用字节可以有效地节省存储空间
    >
    > 不合理的则会浪费空间、降低效率甚至还会引发错误。(对于部分系统从奇地址访问int、short等数据会导致错误)

    

11. ### 共用体

    在相同的内存位置存储不同的数据类型，共用体占用的内存应足够存储共用体中最大的成员。

    ~~~c
    //占用4字节
    union Data
    {
    	int i;
    	short j;
    }
    union Data data;
    data.i = 1;
    //i的数据损坏
    data.j = 1.1f;
    ~~~



​	*以上为c基础知识整理，部分来自于动脑学院lance老师的课堂笔记，感谢Lance。*

  

   

   







