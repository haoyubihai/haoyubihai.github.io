---
title: 'NDK开发基础[2]'
date: 2019-08-29 10:40:21
categories:
- [NDK]
- [C]
- [C++]
tags:
- NDK
- C
- C++
- 友元函数
- 命名空间
---

[TOC]



###  输出方式

~~~c
C使用printf向终端输出信息
C++提供了 标准输出流 
#include <iostream>
using namespace std;
string name("David");
int time = 8;
cout << name  << time << "点," << "天之道不见不散"<< endl;
return 0;


out:
David8点,天之道不见不散
~~~

<!--more-->

### c c++ 函数符号兼容

C的大部分代码可以在C++中直接使用，但是仍然有需要注意的地方.

~~~c
//如果需要在C++中调用C实现的库中的方法
extern "C" //指示编译器这部分代码使用C的方式进行编译而不是C++
~~~

众所周知,C是面向过程的语言，没有函数重载。

~~~c
void func(int x, int y);
~~~

对于 `func` 函数 被C的编译器编译后在函数库中的名字可能为`func `(无参数符号),而C++编译器则会产生类似`funcii`之类的名字。

~~~c
//main.c / main.cpp
int func(int x,int y){}
int main(){return 0;}

gcc main.c -o mainc.o
gcc main.cpp -o maincpp.o

nm -A mainc.o 
nm -A maincpp.o 
~~~

main.c

{% asset_img main.c main.c %}

main.cpp

{% asset_img main.cpp main.cpp %}

那么这样导致的问题就在于： c的.h头文件中定义了`func`函数，则.c源文件中实现这个函数符号都是`func`,然后拿到C++中使用，.h文件中的对应函数符号就被编译成另一种，和库中的符号不匹配，这样就无法正确调用到库中的实现。

因此，对于C库可以:

~~~c++
#ifdef __cplusplus
extern "C"{
#endif
void func(int x,int y);
#ifdef __cplusplus    
}
#endif

//__cplusplus 是由c++编译器定义的宏，用于表示当前处于c++环境
~~~

extern 关键字 可用于变量或者函数之前，表示真实定义在其他文件，编译器遇到此关键字就会去其他模块查找

### 引用

~~~c
//声明形参为引用
void change(int& i) {
	i = 10;
}
int i = 1;
change(i);
printf("%d\n",i); //i == 10
~~~

引用和指针是两个东西

引用 ：变量名是附加在内存位置中的一个标签,可以设置第二个标签

简单来说 引用变量是一个别名，表示一个变量的另一个名字

### 字符串

#### C字符串

> 字符串实际上是使用 NULL字符 `'\0' `终止的一维字符数组。



~~~c++
//字符数组 = 字符串
char str1[6] = {'H', 'e', 'l', 'l', 'o', '\0'};
//自动加入\0
char str2[] = "Hello";
~~~

#### 字符串操作

| 函数            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| strcpy(s1, s2); | 复制字符串 s2 到字符串 s1。                                  |
| strcat(s1, s2); | 连接字符串 s2 到字符串 s1 的末尾。                           |
| strlen(s1);     | 返回字符串 s1 的长度。                                       |
| strcmp(s1, s2); | 如果 s1 和 s2 相同，则返回 0；如果 s1 &lt; s2 则返回小于0；如果 s1&gt;s2 则返回大于0 |
| strchr(s1, ch); | 返回指向字符串 s1 中字符 ch 的第一次出现的位置的指针。       |
| strstr(s1, s2); | 返回指向字符串 s1 中字符串 s2 的第一次出现的位置的指针。     |

> 说明：strcmp:两个字符串自左向右逐个字符相比（按ASCII值大小相比较）



#### C++ string类

> C++ 标准库提供了 **string** 类类型，支持上述所有的操作，另外还增加了其他更多的功能。 



~~~c++
#include <string>
//string 定义在 std命令空间中
usning namespace std;
string str1 = "Hello";
string str2 = "World";
string str3("天之道");
string str4(str3);
	
// str1拼接str2 组合新的string
string str5 = str1 + str2;
// 在str1后拼接str2 str1改变
str1.append(str2);
//获得c 风格字符串
const char *s1 = str1.c_str();
//字符串长度
str1.size();
//长度是否为0
str1.empty();
......等等
~~~



### 命名空间

namespace 命名空间 相当于package

~~~c++
namespace A{
    void a(){}
}

错误 : a();
// :: 域操作符
正确： A::a();

//当然也能够嵌套
namespace A {
	namespace B{
		void a() {};
	}
}
A::B::a();

//还能够使用using 关键字
using namespace A;
using namespace A::B;
~~~

当全局变量在局部函数中与其中某个变量重名，那么就可以用::来区分 

~~~c++
int i;
int main(){
    int i = 10;
    printf("i : %d\n",i);
    //操作全局变量
    ::i = 11;
    printf("i : %d\n",::i);
}
~~~



### 类

>  C++ 在 C 语言的基础上增加了面向对象编程，C++ 支持面向对象程序设计。类是 C++ 的核心特性，用户定义的类型。



Student.h



~~~c++
#define Student_h

class Student{
public: int num;
public: int age;
private : int height;
public: char *name;
//构造方法
public:Student(int num,int age);
public:Student(char *name,int num,int age);
public: void showName();
public: void setName(char *name);
    
public:~Student();
};

#endif /* Student_h */

~~~

Student.cpp

~~~c++
#include "Student.h"
#include <iostream>

using namespace std;
//构造方法的实现
Student::Student(int a,int b ){
    cout << "构造方法"<< a <<b <<endl;
}
Student::~Student(){
    cout<< "析构函数"<<endl;
}
//构造方法的实现  重载
Student::Student(char *name,int num,int age):name(name),num(num),age(age){
    
}

//方法的实现
void Student::showName(){
    if (name) {
      cout <<"student show name "<<name<< endl;
    }
    
};

~~~

main.cpp

~~~c++
  //new 动态在堆中申请内存 创建对象
    Student *stu = new Student("jack",10,20);
    stu->showName(); //指针调用方法使用 -> ,对象使用 .
    stu->setName("liliy");
    stu->showName();
    
    //栈中
    Student student(30,40);
    student.showName();
    student.setName("jiarh");
    student.showName();
    cout<<"age="<< student.age<<"num="<<student.num<<endl;
    
    delete stu;//释放内存 new-delete
    stu=0;

out:

student show name jack
student show name liliy
构造方法3040
student show name jiarh
age=14num=1
析构函数
析构函数
~~~

类的析构函数是类的一种特殊的成员函数，它会在每次删除所创建的对象时执行(不需要手动调用)。

private：可以被该类中的函数、友元函数访问。 不能被任何其他访问，该类的对象也不能访问。 

protected：可以被该类中的函数、子类的函数、友元函数访问。 但不能被该类的对象访问。

public：可以被该类中的函数、子类的函数、友元函数访问，也可以被该类的对象访问。  

#### 常量函数 

函数后写上const，表示不会也不允许修改类中的成员。

Student.h

~~~c++
public: void setNum(int num) const;
~~~

Student.cpp

{% asset_img const.png const%}

#### 友元

类的友元函数是定义在类外部，但有权访问类的所有私有（private）成员和保护（protected）成员

友元可以是一个函数，该函数被称为友元函数；友元也可以是一个类，该类被称为友元类，在这种情况下，整个类及其所有成员都是友元。

##### 友元函数

Student.h

~~~c++
#ifndef Student_h
#define Student_h

class Student{
private : int height;
public: void setHeight(int _height);
//友元函数
friend void printHeight(Student *stu);
};

// height 属性在 Student 中被 private 修饰，需要在Student中将该函数定义为友元函数
void printHeight(Student *stu);

#endif /* Student_h */
~~~

Student.cpp

~~~c++
void Student::setHeight(int _height){
    height = _height;
}

void printHeight(Student *stu){
    cout << stu->height<<endl;
}

~~~

main.cpp

~~~c++
 Student *stu = new Student("jack",10,20);
 stu->setHeight(180);

 printHeight(stu);//180
 
~~~

##### 友元类

Student.h

~~~c++
#ifndef Student_h
#define Student_h

class Student{
private : int height;
public: void setHeight(int _height);
//友元类
friend class Teacher;
};
class Teacher{
//想要访问Student.height 属性 在Studenth中将该类设置为友元类 ，则该类中所有的方法都变为了友元函数
public: void callStudentHeight(Student *stu);
};
#endif /* Student_h */

~~~

Student.cpp

~~~c++
void Teacher::callStudentHeight(Student *stu){
     cout << stu->height<<endl;
}
~~~

main.cpp

~~~c++
Student *stu = new Student("jack",10,20);
stu->setHeight(180);

Teacher *teacher = new Teacher;
teacher->callStudentHeight(stu);//180
~~~



### 静态成员

和Java一样，可以使用static来声明类成员为静态的

当我们使用静态成员属性或者函数时候 需要使用 域运算符 :: 

~~~c++
//Student.h

class Student{
//静态成员
public: static char LABLE ;
};

//Student.cpp
char Student::LABLE='S';

//main.cpp
 cout<<"Student LABLE = "<<Student::LABLE<<endl; // Student LABLE = S
~~~



### 重载函数

C++ 允许在同一作用域中的某个**函数**和**运算符**指定多个定义，分为**函数重载**和**运算符重载**。



#### 函数重载

~~~c++
void print(int i) {
	cout << "整数为: " << i << endl;
}
 
void print(double  f) {
	cout << "浮点数为: " << f << endl;
}
~~~

#### 操作符重载

> C++允许重定义或重载大部分 C++ 内置的运算符 
>
> 函数名是由关键字 operator 和其后要重载的运算符符号构成的 
>
> 重载运算符可被定义为普通的非成员函数或者被定义为类成员函数 

##### 成员函数

~~~c++
class Test1 {
public:
    Test1(){}
	//定义成员函数进行重载
  //返回对象   调用拷贝构造函数  释放函数内 t 对象
  //引用类型(Test1&) 没有复制对象 返回的是 t 对象本身 t会被释放 所以会出现问题(数据释放不彻底就不一定)
  // 可以输出 t 与 t3 地址查看
	Test1 operator+(const Test1& t1) {
		Test1 t;
		t.i = this->i + t1.i;
		return t;
	}
  //拷贝构造函数 (有默认的) 
  Test1(const Test1& t){
        //浅拷贝
		this->i = t.i;
		cout << "拷贝" << endl;
        //如果动态申请内存 需要深拷贝
	};
	int i;
};

Test1 t1;
Test1 t2;
t1.i = 100;
t2.i = 200;
//发生两次拷贝
// C++真正的临时对象是不可见的匿名对象
//1、拷贝构造一个无名的临时对象，并返回这个临时对象
//2、由临时对象拷贝构造对象 t3
//语句结束析构临时对象
Test1 t3 = t1 + t2;
cout << t3.i << endl; //300
~~~

##### 非成员函数

~~~c++
class Test2 {
public:
	int i;
};
//定义非成员函数进行 + 重载
Test2 operator+(const Test2& t21, const Test2& t22) {
	Test2 t;
	t.i = t21.i + t22.i;
	return t;
}

Test2 t21;
Test2 t22;
t21.i = 100;
t22.i = 200;
Test2 t23 = t21 + t22;
cout << t23.i << endl; //300
~~~

允许重载的运算符

| 类型           | 运算符                                                       |
| -------------- | ------------------------------------------------------------ |
| 关系运算符     | ==(等于)，!= (不等于)，< (小于)，> (大于>，<=(小于等于)，>=(大于等于) |
| 逻辑运算符     | \|\|(逻辑或)，&&(逻辑与)，!(逻辑非)                          |
| 单目运算符     | + (正)，-(负)，*(指针)，&(取地址)                            |
| 自增自减运算符 | ++(自增)，--(自减)                                           |
| 位运算符       | \| (按位或)，& (按位与)，~(按位取反)，^(按位异或),，<< (左移)，>>(右移) |
| 赋值运算符     | =, +=, -=, *=, /= , % = , &=, \|=, ^=, <<=, >>=              |
| 空间申请与释放 | new, delete, new[ ] , delete[]                               |
| 其他运算符     | ()(函数调用)，->(成员访问)，,(逗号)，[](下标)                |

```c++
void *operator new (size_t size)
{
	cout << "新的new:" << size << endl;
	return malloc(size);
}

void operator delete(void *p)
{
	//释放由p指向的存储空间
	cout << "新的delete" << endl;
	free(p);
}
... ...
```



### 继承

> class A:[private/protected/public] B
>
> 默认为private继承 
>
> B是基类，A称为子类或者派生类 

| 方式      | 说明                                                         |
| --------- | ------------------------------------------------------------ |
| public    | 基类的public、protected成员也是派生类相应的成员，基类的private成员不能直接被派生类访问，但是可以通过调用基类的公有和保护成员来访问。 |
| protected | 基类的公有和保护成员将成为派生类的保护成员                   |
| private   | 基类的公有和保护成员将成为派生类的私有成员                   |

~~~c++
class Parent {
public:
	void test() {
		cout << "parent" << endl;
	}
};

class Child :   Parent {
public:
	void test() {
         // 调用父类 方法
		Parent::test();
		cout << "child" << endl;
	}
};
~~~

#### 多继承

>一个子类可以有多个父类，它继承了多个父类的特性。
>
>class <派生类名>:<继承方式1><基类名1>,<继承方式2><基类名2>,…

#### 多态

> 多种形态。当类之间存在层次结构，并且类之间是通过继承关联时，就会用到**多态**。
>
> **静态多态**（静态联编）是指在编译期间就可以确定函数的调用地址，通过**函数重载**和**模版（泛型编程）**实现 
>
> **动态多态**（动态联编）是指函数调用的地址不能在编译器期间确定，必须需要在运行时才确定 ,通过**继承+虚函数** 实现

#### 虚函数

~~~c++
class Parent {
public:
	 void test() {
		cout << "parent" << endl;
	}
};

class Child :public Parent {
public:
	void test() {
		cout << "child" << endl;
	}
};

Parent *c = new Child();
// 编译期间 确定c 为 parent 调用parent的test方法
c->test();

//修改Parent为virtual 虚函数 动态链接,告诉编译器不要静态链接到该函数
virtual void test() {
		cout << "parent" << endl;
}
//动态多态 调用Child的test方法
c->test();
~~~

> 构造函数任何时候都不可以声明为虚函数
>
> 析构函数一般都是虚函数,释放先执行子类再执行父类

#### 纯虚函数

~~~c++
class Parent {
public:
    //纯虚函数 继承自这个类需要实现 抽象类型
	virtual void test() = 0;
};

class Child :public Parent {
public:
	void test(){}
};
~~~

#### 模板

模板是泛型编程的基础

##### 函数模板

函数模板能够用来创建一个通用的函数。以支持多种不同的形參。避免重载函数的函数体反复设计。

~~~c++
template <typename T> 
T max(T a,T b)
{
	// 函数的主体
	return  a > b ? a : b;
}
//代替了
int max(int a,int b)
int max(float a,float b)
~~~

##### 类模板(泛型类)

> 为类定义一种模式。使得类中的某些数据成员、默写成员函数的參数、某些成员函数的返回值，能够取随意类型
>
> 常见的 容器比如 向量 vector <int> 或 vector <string> 就是模板类



~~~c++
template<class E,class T>
class Queue {
public:
    T add(E e,T t){
        return e+t;
    }
};

Queue<int,float> q;
q.add(1,1.1f) = 2.1f
~~~

### 容器

> 容器，就是用来存放东西的盒子。
>
> 常用的数据结构包括：数组array,  链表list，  树tree，  栈stack，  队列queue，  散列表hash table,  集合set、映射表map 等等。容器便是容纳这些数据结构的。这些数据结构分为序列式与关联式两种，容器也分为序列式容器和关联式容器。
>
> STL 标准模板库，核心包括容器、算法、迭代器。

#### 序列式容器/顺序容器

> 元素排列次序与元素无关，由元素添加到容器的顺序决定

| 容器           | 说明                                             |
| -------------- | ------------------------------------------------ |
| vector         | 支持快速随机访问                                 |
| list           | 支持快速插入、删除                               |
| deque          | 双端队列  允许两端都可以进行入队和出队操作的队列 |
| stack          | 后进先出LIFO(Last In First Out)堆栈              |
| queue          | 先进先出FIFO(First Input First Output)队列       |
| priority_queue | 有优先级管理的queue                              |

#### 向量(vector)  

> 连续存储的元素 

#### 列表 (list)

> 由节点组成的双向链表，每个结点包含着一个元素  

#### 双端队列(deque)

> 连续存储的指向不同元素的指针所组成的数组 

**以上三种容器操作基本一样**

**基本操作:**

```c++
#include <vector>
using namespace std;

vector<int> vec_1;
//1个元素
vector<int> vec_2(1);
//6个值为 1 的元素
vector<int> vec_3(6,1);
//使用容器初始化
vector<int> vec_4(vec_3);

//通过下标操作元素
int i = vec_3[1];
int j = vec_3.at(1);
//首尾元素
vec_3.front()
vec_3.back()

//插入元素 
//vector不支持 push_front list,deque可以
vec_1.push_back(1);
//删除元素 vector不支持 pop_front
vec_1.pop_back();

//释放
//可以单个清除，也可以清除一段区间里的元素
vec_3.erase(vec_3.begin(),vec_3.end())
//清理容器 即erase所有
vec_3.clear(); 

//容量大小
vec_3.capacity();
//在容器中，其内存占用的空间是只增不减的，
//clear释放元素，却不能减小vector占用的内存
//所以可以对vector 收缩到合适的大小 
vector< int >().swap(vec_3);  

//在vec是全局变量时候
//建立临时vector temp对象，swap调用之后对象vec占用的空间就等于默认构造的对象的大小
//temp就具有vec的大小，而temp随即就会被析构，从而其占用的空间也被释放。
```

**迭代器**

```c++
//获得指向首元素的迭代器  模板类，不是指针，当做指针来使用
vector<int>::iterator it = vec.begin();
//遍历元素
for (; it < vec.end(); it++)
{
	cout << *it << endl;
}
//begin和end   分别获得 指向容器第一个元素和最后一个元素下一个位置的迭代器
//rbegin和rend 分别获得 指向容器最后一个元素和第一个元素前一个位置的迭代器

//注意循环中操作元素对迭代器的影响
vector<int>::iterator it = vec.begin();
for (; it < vec.end(); )
{
    //删除值为2的元素 
	if (*it == 2) {
		it = vec.erase(it);
	}
	else {
		it++;
	}
}
```

#### 栈(stack)

> 后进先出的值的排列 

```c++
stack<int> s;
//入栈
s.push(1);
s.push(2);
//弹栈
s.pop();
//栈顶
cout << s.top() << endl;
```

#### 队列(queue)

> 先进先出的值的排列 

```c++
queue<int> q;
q.push(1);
q.push(2);
//移除最后一个
q.pop();
//获得第一个
q.front();
//最后一个元素
cout << q.back() << endl;
```

#### 优先队列(priority_queue )

> 元素的次序是由所存储的数据的某个值排列的一种队列 

```c++
//最大的在队首
priority_queue<int>;
//在vector之上实现的
priority_queue<int, vector<int>, less<int> >; 
//vector 承载底层数据结构堆的容器
//less 表示数字大的优先级高，而 greater 表示数字小的优先级高
//less  	 让优先队列总是把最大的元素放在队首
//greater    让优先队列总是把最小的元素放在队首

//less和greater都是一个模板结构体 也可以自定义

class Student {
public:
	int grade;
	Student(int grade):grade(grade) {
	}
};
struct cmp {
	bool operator ()(Student* s1, Student* s2) {
        // > 从小到大
        // < 从大到小 
		return s1->grade > s2->grade;
	}
	bool operator ()(Student s1, Student s2) {
		return s1.grade > s2.grade;
	}
};
priority_queue<Student*, vector<Student*>, cmp > q1;
q1.push(new Student(2));
q1.push(new Student(1));
q1.push(new Student(3));
cout << q1.top()->grade << endl;
```

### 关联式容器

> 关联容器和大部分顺序容器操作一致
>
> 关联容器中的元素是按关键字来保存和访问的 支持高效的关键字查找与访问

#### 集合(set)

> 由节点组成的红黑树，每个节点都包含着一个元素,元素不可重复

```c++
set<string> a;  
set<string> a1={"fengxin","666"};
a.insert("fengxin");  // 插入一个元素
a.erase("123");	//删除
```

#### 键值对(map)

> 由{键，值}对组成的集合

```c++
map<int, string> m;
map<int, string> m1 = { { 1,"Lance" },{ 2,"David" } };
//插入元素
m1.insert({ 3,"Jett" });
//pair=键值对
pair<int, string> p(4, "dongnao");
m1.insert(p);
//insetrt 返回 map<int, string>::iterator : bool 键值对
//如果 插入已经存在的 key，则会插入失败   
//multimap：允许重复key
//使用m1[3] = "xx" 能够覆盖


//通过【key】操作元素
m1[5] = "yihan";
cout << m1[5].c_str() << endl; 
//通过key查找元素
map<int, string>::iterator it = m1.find(3);
cout << (*it).second.c_str()<< endl;
// 删除 
m1.erase(5);
//遍历
for (it = m1.begin(); it != m1.end(); it++)
{
	pair<int, string> item = *it;
	cout << item.first << ":" << item.second.c_str() << endl;
}

//其他map================================

```

> unordered_map c++11取代hash_map（哈希表实现，无序）
>
> 哈希表实现查找速度会比RB树实现快,但rb整体更节省内存
>
> 需要无序容器，高频快速查找删除，数据量较大用unordered_map；
>
> 需要有序容器，查找删除频率稳定，在意内存时用map。

### 类型转换

> 除了能使用c语言的强制类型转换外,还有：转换操作符 （新式转换）

#### const_cast

> 修改类型的const或volatile属性 

```c++
const char *a;
char *b = const_cast<char*>(a);
	
char *a;
const char *b = const_cast<const char*>(a);
```

#### static_cast

> 1. 基础类型之间互转。如：float转成int、int转成unsigned int等
> 2. 指针与void之间互转。如：float\*转成void\*、Bean\*转成void\*、函数指针转成void\*等
> 3. 子类指针/引用与 父类指针/引用 转换。

```c++
class Parent {
public:
	void test() {
		cout << "p" << endl;
	}
};
class Child :public Parent{
public:
	 void test() {
		cout << "c" << endl;
	}
};
Parent  *p = new Parent;
Child  *c = static_cast<Child*>(p);
//输出c
c->test();

//Parent test加上 virtual 输出 p
```

#### dynamic_cast

> 主要 将基类指针、引用 安全地转为派生类.
>
> 在运行期对可疑的转型操作进行安全检查，仅对多态有效

```c++
//基类至少有一个虚函数
//对指针转换失败的得到NULL，对引用失败  抛出bad_cast异常 
Parent  *p = new Parent;
Child  *c = dynamic_cast<Child*>(p);
if (!c) {
	cout << "转换失败" << endl;
}


Parent  *p = new Child;
Child  *c = dynamic_cast<Child*>(p);
if (c) {
	cout << "转换成功" << endl;
}
```

#### reinterpret_cast 

> 对指针、引用进行原始转换

```c++
float i = 10;

//&i float指针，指向一个地址，转换为int类型，j就是这个地址
int j = reinterpret_cast<int>(&i);
cout  << hex << &i << endl;
cout  << hex  << j << endl;

cout<<hex<<i<<endl; //输出十六进制数
cout<<oct<<i<<endl; //输出八进制数
cout<<dec<<i<<endl; //输出十进制数
```

#### char*与int转换



```c++
//char* 转int float
int i = atoi("1");
float f = atof("1.1f");
cout << i << endl;
cout << f << endl;
	
//int 转 char*
char c[10];
//10进制
itoa(100, c,10);
cout << c << endl;

//int 转 char*
char c1[10];
sprintf(c1, "%d", 100);
cout << c1 << endl;
```

### 异常



```c++
void test1()
{
	throw "测试!";
}

void test2()
{
	throw exception("测试");
}

try {
	test1();
}
catch (const char *m) {
	cout << m << endl;
}
try {
	test2();
}
catch (exception  &e) {
	cout << e.what() << endl;
}

//自定义
class MyException : public exception
{
public:
   virtual char const* what() const
    {
        return "myexception";
    }
};

//随便抛出一个对象都可以
```

### 文件与流操作

> C 语言的文件读写操作
>
> 头文件:stdio.h
>
> 函数原型：FILE * fopen(const char * path, const char * mode); 
>
> path:  操作的文件路径
>
> mode:模式

| 模式 | 描述                                                         |
| ---- | ------------------------------------------------------------ |
| r    | 打开一个已有的文本文件，允许读取文件。                       |
| w    | 打开一个文本文件，允许写入文件。如果文件不存在，则会创建一个新文件。在这里，您的程序会从文件的开头写入内容。如果文件存在，则该会被截断为零长度，重新写入。 |
| a    | 打开一个文本文件，以追加模式写入文件。如果文件不存在，则会创建一个新文件。在这里，您的程序会在已有的文件内容中追加内容。 |
| r+   | 打开一个文本文件，允许读写文件。                             |
| w+   | 打开一个文本文件，允许读写文件。如果文件已存在，则文件会被截断为零长度，如果文件不存在，则会创建一个新文件。 |
| a+   | 打开一个文本文件，允许读写文件。如果文件不存在，则会创建一个新文件。读取会从文件的开头开始，写入则只能是追加模式。 |

```C++
//========================================================================
FILE *f = fopen("xxxx\\t.txt","w");
//写入单个字符
fputc('a', f);
fclose(f);


FILE *f = fopen("xxxx\\t.txt","w");
char *txt = "123456";
//写入以 null 结尾的字符数组
fputs(txt, f);
//格式化并输出
fprintf(f,"%s",txt);
fclose(f);

//========================================================================
fgetc(f); //读取一个字符

char buff[255];
FILE *f = fopen("xxxx\\t.txt", "r");
//读取 遇到第一个空格字符停止
fscanf(f, "%s", buff);
printf("1: %s\n", buff);

//最大读取 255-1 个字符
fgets(buff, 255, f);
printf("2: %s\n", buff);
fclose(f);

//二进制 I/O 函数
size_t fread(void *ptr, size_t size_of_elements, 
             size_t number_of_elements, FILE *a_file);       
size_t fwrite(const void *ptr, size_t size_of_elements, 
             size_t number_of_elements, FILE *a_file);
//1、写入/读取数据缓存区
//2、每个数据项的大小
//3、多少个数据项
//4、流
//如：图片、视频等以二进制操作:
//写入buffer 有 1024个字节
fwrite(buffer,1024,1,f);
```



> C++ 文件读写操作
>
> \<iostream\> 和 \<fstream\>

| 数据类型 | 描述                                               |
| -------- | -------------------------------------------------- |
| ofstream | 输出文件流，创建文件并向文件写入信息。             |
| ifstream | 输入文件流，从文件读取信息。                       |
| fstream  | 文件流，且同时具有 ofstream 和 ifstream 两种功能。 |

```c++
char data[100];
// 以写模式打开文件
ofstream outfile;
outfile.open("XXX\\f.txt");
cout << "输入你的名字: ";
//cin 接收终端的输入
cin >> data;
// 向文件写入用户输入的数据
outfile << data << endl;
// 关闭打开的文件
outfile.close();

// 以读模式打开文件
ifstream infile;
infile.open("XXX\\f.txt");

cout << "读取文件" << endl;
infile >> data;
cout << data << endl;

// 关闭
infile.close();
```

