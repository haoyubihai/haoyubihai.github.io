---
title: kotlin 学习
date: 2019-01-20 22:11:37
categories:
- [kotlin]
tags:
- kotlin
---

## Kotlin 

1. kotlin的变量没有默认值,需要手动初始化，否则报错

2. kotlin 空安全

   * `Lateinit var view:View` 延迟初始化
   * kotlin变量默认非空 可以添加 `？`设置为可空   `var name:String?=null`
   * kotlin 线程安全  `name?.length`

3. 类型推断

   <!--more-->

4. var 可以修改设置变量

   val 只读变量

   * 不可以调用setter函数，不能重写setter函数，但可以重写getter函数

5. 默认实现了geter/setter 方法，重写getter,setter

   ```kotlin
   var name: String? = null
       get() {
         //注意此处的filed
           return field
       }
       set(value) {
           field = value
       }
   ```

6. ”基本类型“的舍弃

   数字，字符，布尔值，数组，字符串

   * Int
   * Float
   * Long
   * ...

7. 类的可见性

   * Java中的public在kotlin中可以省略，kotlin中的类默认是public的
   * kotlin中的类默认是final的，可以加`open` 关键字，来解除限制，继承时使用

8. `override`关键字 ，在注解中@Override 是注解，`override`具有遗传性，可以添加`final`关键字，关闭`override` 的遗传性

9. `abstract`关键字，修饰的类无法直接实例化使用。

10. 实例化一个新类时，省略了Java中的new关键字。

11. kotlin中使用`is`关键字进行类型判断，并且编译器能够进行类型判断，可以帮助我们省去强转的写法

    ```kotlin
    class NewActivity : MainActivity() {
        fun action() {}
    }
    
    
    fun main() {
        var activity: Activity = NewActivity()
        // 👆activity 是无法调用 NewActivity 的 action 方法的
    }
    
    fun main() {
        var activity: Activity = NewActivity()
        if (activity is NewActivity) {
            // 👇的强转由于类型推断被省略了
            activity.action()
        }
    }
    
    ```

    java中需要先使用 `instanceof` 关键字判断类型，再通过强转来调用：

    ```java
    void main() {
        Activity activity = new NewActivity();
        if (activity instanceof NewActivity) {
            ((NewActivity) activity).action();
        }
    }
    ```

    可以使用 `as` 关键字：直接进行强转调用

    ```java
    🏝️
    fun main() {
        var activity: Activity = NewActivity()
         //这种写法如果强转类型操作是正确的当然没问题，但如果强转成一个错误的类型，程序就会抛出一个异常。
        (activity as NewActivity).action()
          
         // 👇'(activity as? NewActivity)' 之后是一个可空类型的对象，所以，需要使用 '?.' 来调用
        (activity as? NewActivity)?.action()
    }
    ```

12. **constructor**

    ```java
    ☕️
    public class User {
        int id;
        String name;
          👇   👇
        public User(int id, String name) {
            this.id = id;
            this.name = name;
        }
    }
    ```

    ```kotlin
    🏝️
    class User {
        val id: Int
        val name: String
             👇
        constructor(id: Int, name: String) {
     //👆 没有 public
            this.id = id
            this.name = name
        }
    }
    ```

    - Java 中构造器和类同名，Kotlin 中使用 `constructor` 表示。
    - Kotlin 中构造器没有 public 修饰，因为默认可见性就是公开的（关于可见性修饰符这里先不展开，后面会讲到）。

13. #### init

    Java 里常常配合一起使用的 init 代码块，在 Kotlin 里的写法也有了一点点改变：你需要给它加一个 `init` 前缀。

    ```java
    ☕️
    public class User {
       👇
        {
            // 初始化代码块，先于下面的构造器执行
        }
        public User() {
        }
    }
    ```

    ```kotlin
    🏝️
    class User {
        👇
        init {
            // 初始化代码块，先于下面的构造器执行
        }
        constructor() {
        }
    }
    ```

    Kotlin 的 init 代码块和 Java 一样，都在实例化时执行，并且执行顺序都在构造器之前。

    

14. ### final

    Kotlin 中的 `val` 和 Java 中的 `final` 类似，表示只读变量，不能修改。这里分别从成员变量、参数和局部变量来和 Java 做对比：

    ```java
    ☕️
     👇
    final int final1 = 1;
                 👇  
    void method(final String final2) {
         👇
        final String final3 = "The parameter is " + final2;
    }
    
    ```

    ```kotlin
    🏝️
    👇
    val fina1 = 1
           // 👇 参数是没有 val 的
    fun method(final2: String) {
        👇
        val final3 = "The parameter is " + final2
    }
    
    ```

    - final 变成了 val。
    - Kotlin 函数参数默认是 val 类型，所以参数前不需要写 val 关键字，Kotlin 里这样设计的原因是保证了参数不会被修改，而 Java 的参数可修改（默认没 final 修饰）会增加出错的概率。
    - `var` 是 variable 的缩写， `val` 是 value 的缩写。

15. ### static

    在 Java 里面写常量，我们用的是 `static` + `final`。而在 Kotlin 里面，除了 `final` 的写法不一样，`static` 的写法也不一样，而且是更不一样。确切地说：在 `Kotlin` 里，静态变量和静态方法这两个概念被去除了。

    那如果想在 Kotlin 中像 Java 一样通过类直接引用该怎么办呢？Kotlin 的答案是 `companion object`：

    ```kotlin
    🏝️
    class Sample {
        ...
           👇
        companion object {
            val anotherString = "Another String"
        }
    }
    
    ```

16. ### object

    Kotlin 里的 `object` ——首字母小写的，不是大写，Java 里的 `Object` 在 Kotlin 里不用了。

    > Java 中的 `Object` 在 Kotlin 中变成了 `Any`，和 `Object` 作用一样：作为所有类的基类。

    而 `object` 不是类，像 `class` 一样在 Kotlin 中属于关键字：

    ```kotlin
    🏝️
    object Sample {
        val name = "A name"
    }
    
    ```

    它的意思很直接：创建一个类，并且创建一个这个类的对象。这个就是 `object` 的意思：对象。

    在代码中如果要使用这个对象，直接通过它的类名就可以访问：

    ```kotlin
    🏝️
    Sample.name
    //这不就是单例么，所以在 Kotlin 中创建单例不用像 Java 中那么复杂，只需要把 class 换成 object 就可以了。
    
    
    ```

    这种通过 `object` 实现的单例是一个饿汉式的单例，并且实现了线程安全。

    

    **继承类和实现接口**

    Kotlin 中不仅类可以继承别的类，可以实现接口，`object` 也可以：

    ```kotlin
    🏝️
    open class A {
        open fun method() {
            ...
        }
    }
    
    interface B {
        fun interfaceMethod()
    }
      👇      👇   👇
    object C : A(), B {
    
        override fun method() {
            ...
        }
    
        override fun interfaceMethod() {
            ...
        }
    }
    
    ```

    **匿名类**

    Kotlin 还可以创建 Java 中的匿名类，只是写法上有点不同：

    ```java
    ☕️                                              👇 
    ViewPager.SimpleOnPageChangeListener listener = new ViewPager.SimpleOnPageChangeListener() {
        @Override // 👈
        public void onPageSelected(int position) {
            // override
        }
    };
    
    ```

    ```kotlin
    🏝️          
    val listener = object: ViewPager.SimpleOnPageChangeListener() {
        override fun onPageSelected(position: Int) {
            // override
        }
    }    
    
    ```

    - Java 中 `new` 用来创建一个匿名类的对象
    - Kotlin 中 `object:` 也可以用来创建匿名类的对象

    这里的 `new` 和 `object:` 修饰的都是接口或者抽象类。

17. #### companion object

    用 `object` 修饰的对象中的变量和函数都是静态的，但有时候，我们只想让类中的一部分函数和变量是静态的该怎么做呢：

    ```kotlin
    🏝️
    class A {
              👇
        object B {
            var c: Int = 0
        }
    }
    
    ```

    如上，可以在类中创建一个对象，把需要静态的变量或函数放在内部对象 B 中，外部可以通过如下的方式调用该静态变量：

    ```kotlin
    🏝️
    A.B.c
      👆
    
    ```

    类中嵌套的对象可以用 `companion` 修饰：

    ```kotlin
    🏝️
    class A {
           👇
        companion object B {
            var c: Int = 0
        }
    }
    
    ```

    `companion` 可以理解为伴随、伴生，表示修饰的对象和外部类绑定。

    但这里有一个小限制：一个类中最多只可以有一个伴生对象，但可以有多个嵌套对象。

    这样的好处是调用的时候可以省掉对象名：

    ```kotlin
    🏝️
    A.c // 👈 B 没了
    
    ```

    所以，当有 `companion` 修饰时，对象的名字也可以省略掉：

    ```kotlin
    🏝️
    class A {
                    // 👇 B 没了
        companion object {
            var c: Int = 0
        }
    }
    
    ```

    **静态初始化**

    Java 中的静态变量和方法，在 Kotlin 中都放在了 `companion object` 中。因此 Java 中的静态初始化在 Kotlin 中自然也是放在 `companion object` 中的，像类的初始化代码一样，由 `init` 和一对大括号表示：

    ```kotlin
    🏝️
    class Sample {
           👇
        companion object {
             👇
            init {
                ...
            }
        }
    }
    
    ```

    **top-level property / function 声明**

    除了静态函数这种简便的调用方式，Kotlin 还有更方便的东西：「`top-level declaration` 顶层声明」。其实就是把属性和函数的声明不写在 `class` 里面，这个在 Kotlin 里是允许的：

    ```kotlin
    🏝️
    package com.hencoder.plus
    
    // 👇 属于 package，不在 class/object 内
    fun topLevelFuncion() {
    }
    
    ```

    这样写的属性和函数，不属于任何 `class`，而是直接属于 `package`，它和静态变量、静态函数一样是全局的，但用起来更方便：你在其它地方用的时候，就连类名都不用写：

    <br class="Apple-interchange-newline"><div></div>

    ```kotlin
    🏝️
    import com.hencoder.plus.topLevelFunction // 👈 直接 import 函数
    
    topLevelFunction()
    
    ```

    * 命名相同的顶级函数

      > 顶级函数不写在类中可能有一个问题：如果在不同文件中声明命名相同的函数，使用的时候会不会混淆？
      >
      > 不会，当出现两个同名顶级函数时，IDE 会自动加上包前缀来区分，这也印证了「顶级函数属于包」的特性。

    在 `object`、`companion object` 和 top-level 中该选择哪一个呢？简单来说按照下面这两个原则判断：

    - 如果想写工具类的功能，直接创建文件，写 top-level「顶层」函数。
    - 如果需要继承别的类或者实现接口，就用 `object` 或 `companion object`。

    

18. #### 常量

    Java 中声明常量：

    ```java
    ☕️
    public class Sample {
                👇     👇
        public static final int CONST_NUMBER = 1;
    }
    
    ```

    Kotlin 中声明常量：

    ```kotlin
    🏝️
    class Sample {
        companion object {
             👇                  // 👇
            const val CONST_NUMBER = 1
        }
    }
    
    const val CONST_SECOND_NUMBER = 2
    
    ```

    发现不同点有：

    - Kotlin 的常量必须声明在对象（包括伴生对象）或者「top-level 顶层」中，因为常量是静态的。

    - Kotlin 新增了修饰常量的 `const` 关键字。

    - Kotlin 中只有基本类型和 String 类型可以声明成常量。

      > 原因是 Kotlin 中的常量指的是 「compile-time constant 编译时常量」，它的意思是「编译器在编译的时候就知道这个东西在每个调用处的实际值」，因此可以在编译时直接把这个值硬编码到代码里使用的地方。
      >
      > 而非基本和 String 类型的变量，可以通过调用对象的方法或变量改变对象内部的值，这样这个变量就不是常量了，
      >
      > 来看一个 Java 的例子，比如一个 User 类：
      >
      > ```java
      > ☕️
      > public class User {
      >  int id; // 👈 可修改
      >  String name; // 👈 可修改
      >  public User(int id, String name) {
      >      this.id = id;
      >      this.name = name;
      >  }
      > }
      > 
      > ```
      >
      > 在使用的地方声明一个 `static final` 的 User 实例 `user`，它是不能二次赋值的：
      >
      > ```java
      > ☕️
      > static final User user = new User(123, "Zhangsan");
      > 👆    👆
      > 
      > ```
      >
      > 但是可以通过访问这个 `user` 实例的成员变量改变它的值：
      >
      > ```java
      > ☕️
      > user.name = "Lisi";
      >    👆
      > 
      > ```
      >
      > 所以 Java 中的常量可以认为是「伪常量」，因为可以通过上面这种方式改变它内部的值。而 Kotlin 的常量因为限制类型必须是基本类型，所以不存在这种问题，更符合常量的定义。

19. #### 数组和集合

    声明一个 String 数组：

    java:

    ```java
    String[] strs = {"a", "b", "c"};
    
    ```

    Kotlin:

    ```kotlin
    val strs: Array<String> = arrayOf("a", "b", "c")
    
    ```

    * 取值和修改

      Kotlin 中获取或者设置数组元素和 Java 一样，可以使用方括号加下标的方式索引：

      ```kotlin
      🏝️
      println(strs[0])
         👇      👆
      strs[1] = "B"
      
      ```

    * 不支持协变

      Kotlin 的数组编译成字节码时使用的仍然是 Java 的数组，但在语言层面是泛型实现，这样会失去协变 (covariance) 特性，就是子类数组对象不能赋值给父类的数组变量：

      ```kotlin
      🏝️
      val strs: Array<String> = arrayOf("a", "b", "c")
                        👆
      val anys: Array<Any> = strs // compile-error: Type mismatch
                      👆
      
      ```

      Java 中可以

      ```java
      ☕️
      String[] strs = {"a", "b", "c"};
        👆
      Object[] objs = strs; // success
        👆
      
      ```

20. #### 集合

    Kotlin 和 Java 一样有三种集合类型：List、Set 和 Map，它们的含义分别如下：

    - `List` 以固定顺序存储一组元素，元素可以重复。
    - `Set` 存储一组互不相等的元素，通常没有固定顺序。
    - `Map` 存储 键-值 对的数据集合，键互不相等，但不同的键可以对应相同的值。

    Java 中创建一个列表： 

    ```java
    ☕️
    List<String> strList = new ArrayList<>();
    strList.add("a");
    strList.add("b");
    strList.add("c"); // 👈 添加元素繁琐
    
    ```

    Kotlin 中创建一个列表：

    ```kotlin
    🏝️            
    val strList = listOf("a", "b", "c")
    
    ```

    首先能看到的是 Kotlin 中创建一个 `List` 特别的简单，有点像创建数组的代码。而且 Kotlin 中的 `List` 多了一个特性：支持 covariant（协变）。也就是说，可以把子类的 `List` 赋值给父类的 `List` 变量：

    ```kotlin
    🏝️
    val strs: List<String> = listOf("a", "b", "c")
                    👆
    val anys: List<Any> = strs // success
                   👆
    
    
    ```

    **和数组的区别:**

    Kotlin 中数组和 MutableList 的 API 是非常像的，主要的区别是数组的元素个数不能变。那在什么时候用数组呢？

    - 这个问题在 Java 中就存在了，数组和 `List` 的功能类似，`List` 的功能更多一些，直觉上应该用 `List` 。但数组也不是没有优势，基本类型 (`int[]`、`float[]`) 的数组不用自动装箱，性能好一点。
    - 在 Kotlin 中也是同样的道理，在一些性能需求比较苛刻的场景，并且元素类型是基本类型时，用数组好一点。不过这里要注意一点，Kotlin 中要用专门的基本类型数组类 (`IntArray` `FloatArray` `LongArray`) 才可以免于装箱。也就是说元素不是基本类型时，相比 `Array`，用 `List` 更方便些。

    Java 中创建一个 `Set`：

    ```java
    ☕️
    Set<String> strSet = new HashSet<>();
    strSet.add("a");
    strSet.add("b");
    strSet.add("c");
    
    ```

    - Kotlin 中创建相同的 `Set`    

      ```kotlin
      val strSet = setOf("a", "b", "c")
      
      ```

    Java 中创建一个 `Map`：

    ```java
    ☕️
    Map<String, Integer> map = new HashMap<>();
    map.put("key1", 1);
    map.put("key2", 2);
    map.put("key3", 3);
    map.put("key4", 3);
    
    ```

    Kotlin 中创建一个 `Map`：

    ```kotlin
    🏝️         
    val map = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 3)
    
    ```

    Kotlin 中的 Map 除了和 Java 一样可以使用 `get()` 根据键获取对应的值，还可以使用方括号的方式获取：

    ```kotlin
    🏝️
                     👇
    val value1 = map.get("key1")
                   👇
    val value2 = map["key2"]
    
    ```

    Kotlin 中也可以用方括号的方式改变 `Map` 中键对应的值：

    ```kotlin
    🏝️       
                  👇
    val map = mutableMapOf("key1" to 1, "key2" to 2)
        👇
    map.put("key1", 2)
       👇
    map["key1"] = 2   
    
    ```

    **可变集合/不可变集合**

    Kotlin 中集合分为两种类型：只读的和可变的。这里的只读有两层意思：

    - 集合的 size 不可变
    - 集合中的元素值不可变

    以下是三种集合类型创建不可变和可变实例的例子：

    - `listOf()` 创建不可变的 `List`，`mutableListOf()` 创建可变的 `List`。
    - `setOf()` 创建不可变的 `Set`，`mutableSetOf()` 创建可变的 `Set`。
    - `mapOf()` 创建不可变的 `Map`，`mutableMapOf()` 创建可变的 `Map`。

    可以看到，有 `mutable` 前缀的函数创建的是可变的集合，没有 `mutbale` 前缀的创建的是不可变的集合，不过不可变的可以通过 `toMutable*()` 系函数转换成可变的集合：

    ```kotlin
    🏝️
    val strList = listOf("a", "b", "c")
                👇
    strList.toMutableList()
    val strSet = setOf("a", "b", "c")
                👇
    strSet.toMutableSet()
    val map = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 3)
             👇
    map.toMutableMap()
    
    ```

    然后就可以对集合进行修改了，这里有一点需要注意下：

    - `toMutable*()` 返回的是一个新建的集合，原有的集合还是不可变的，所以只能对函数返回的集合修改。

21. #### Sequence

    除了集合 Kotlin 还引入了一个新的容器类型 `Sequence`，它和 `Iterable` 一样用来遍历一组数据并可以对每个元素进行特定的处理。

    ```kotlin
    🏝️
    sequenceOf("a", "b", "c")
    
    🏝️
    val list = listOf("a", "b", "c")
    list.asSequence()
    
    🏝️                          // 👇 第一个元素
    val sequence = generateSequence(0) { it + 1 }
                                      // 👆 lambda 表达式，负责生成第二个及以后的元素，it 表示前一个元素
    
    ```

22. #### 可见性修饰符

    Kotlin 中有四种可见性修饰符：

    - `public`：公开，可见性最大，哪里都可以引用。
    - `private`：私有，可见性最小，根据声明位置不同可分为类中可见和文件中可见。
    - `protected`：保护，相当于 `private` + 子类可见。
    - `internal`：内部，仅对 module 内可见。

    #### `public`

    Java 中没写可见性修饰符时，表示包内可见，只有在同一个 `package` 内可以引用，`package` 外如果要引用，需要在 `class` 前加上可见性修饰符 `public` 表示公开。

    Kotlin 中如果不写可见性修饰符，就表示公开，和 Java 中 `public` 修饰符具有相同效果。在 Kotlin 中 `public` 修饰符「可以加，但没必要」。

    #### `@hide`

    在 Android 的官方 sdk 中，有一些方法只想对 sdk 内可见，不想开放给用户使用（因为这些方法不太稳定，在后续版本中很有可能会修改或删掉）。为了实现这个特性，会在方法的注释中添加一个 Javadoc 方法 `@hide`，用来限制客户端访问：

    ```java
    ☕️
    /**
    * @hide 👈
    */
    public void hideMethod() {
        ...
    }
    
    ```

    但这种限制不太严格，可以通过反射访问到限制的方法。针对这个情况，Kotlin 引进了一个更为严格的可见性修饰符：`internal`。

    #### `internal`

    `internal` 表示修饰的类、函数仅对 module 内可见，这里的 module 具体指的是一组共同编译的 kotlin 文件，常见的形式有：

    - Android Studio 里的 module
    - Maven project

    > 我们常见的是 Android Studio 中的 module 这种情况，Maven project 仅作了解就好，不用细究。

    `internal` 在写一个 library module 时非常有用，当需要创建一个函数仅开放给 module 内部使用，不想对 library 的使用者可见，这时就应该用 `internal` 可见性修饰符。

    #### `protected`

    - Java 中 `protected` 表示包内可见 + 子类可见。
    - Kotlin 中 `protected` 表示 `private` + 子类可见。

    Kotlin 相比 Java `protected` 的可见范围收窄了，原因是 Kotlin 中不再有「包内可见」的概念了，相比 Java 的可见性着眼于 `package`，Kotlin 更关心的是 module。

    #### `private`

    - Java 中的 `private` 表示类中可见，作为内部类时对外部类「可见」。
    - Kotlin 中的 `private` 表示类中或所在文件内可见，作为内部类时对外部类「不可见」。

    `private` 修饰的变量「类中可见」和 「文件中可见」:

    ```kotlin
    🏝️
    class Sample {
        private val propertyInClass = 1 // 👈 仅 Sample 类中可见
    }
    
    private val propertyInFile = "A string." // 👈 范围更大，整个文件可见
    
    ```

    在 Java 中，外部类可以访问内部类的 `private` 变量

    ```java
    ☕️
    public class Outter {
        public void method() {
            Inner inner = new Inner();
                                👇
            int result = inner.number * 2; // success
        }
        
        private class Inner {
            private int number = 0;
        }
    }
    
    ```

    在 Kotlin 中，外部类不可以访问内部类的 `private` 变量：

    ```kotlin
    🏝️
    class Outter {
        fun method() {
            val inner = Inner()
                                👇
            val result = inner.number * 2 // compile-error: Cannot access 'number': it is private in 'Inner'
        }
        
        class Inner {
            private val number = 1
        }
    }
    
    ```

    **可以修饰类和接口**

    - Java 中一个文件只允许一个外部类，所以 `class` 和 `interface` 不允许设置为 `private`，因为声明 `private` 后无法被外部使用，这样就没有意义了。

    - Kotlin 允许同一个文件声明多个 `class` 和 top-level 的函数和属性，所以 Kotlin 中允许类和接口声明为 `private`，因为同个文件中的其它成员可以访问：

      ```kotlin
      🏝️                   
      private class Sample {
          val number = 1
          fun method() {
              println("Sample method()")
          }
      }
                  // 👇 在同一个文件中，所以可以访问
      val sample = Sample()
      
      ```

23. ### 构造器

    #### 主构造器

    Kotlin 中 constructor 的写法：

    ```kotlin
    🏝️
    class User {
        var name: String
        constructor(name: String) {
            this.name = name
        }
    }
    
    ```

    Kotlin 中还有更简单的方法来写构造器

    ```kotlin
    class User constructor(name: String) {
        //                  👇 这里与构造器中的 name 是同一个
        var name: String = name
    }
    
    
    ```

    - `constructor` 构造器移到了类名之后
    - 类的属性 `name` 可以引用构造器中的参数 `name`

    这个写法叫「主构造器 primary constructor」。

    在 Kotlin 中一个类最多只能有 1 个主构造器（也可以没有），而次构造器是没有个数限制。

    主构造器中的参数除了可以在类的属性中使用，还可以在 `init` 代码块中使用：

    ```kotlin
    🏝️
    class User constructor(name: String) {
        var name: String
        init {
            this.name = name
        }
    }
    
    ```

    其中 `init` 代码块是紧跟在主构造器之后执行的，这是因为主构造器本身没有代码体，`init` 代码块就充当了主构造器代码体的功能。

    另外，如果类中有主构造器，那么其他的次构造器都需要通过 `this` 关键字调用主构造器，可以直接调用或者通过别的次构造器间接调用。如果不调用 IDE 就会报错：

    ```kotlin
    🏝️
    class User constructor(var name: String) {
        constructor(name: String, id: Int) {
        // 👆这样写会报错，Primary constructor call expected
        }
    }
    
    ```

    为什么当类中有主构造器的时候就强制要求次构造器调用主构造器呢？

    我们从主构造器的特性出发，一旦在类中声明了主构造器，就包含两点：

    - 必须性：创建类的对象时，不管使用哪个构造器，都需要主构造器的参与
    - 第一性：在类的初始化过程中，首先执行的就是主构造器

    当一个类中同时有主构造器与次构造器的时候，需要这样写：

    ```kotlin
    🏝️
    class User constructor(var name: String) {
                                       // 👇  👇 直接调用主构造器
        constructor(name: String, id: Int) : this(name) {
        }
                                                    // 👇 通过上一个次构造器，间接调用主构造器
        constructor(name: String, id: Int, age: Int) : this(name, id) {
        }
    }
    
    ```

    在使用次构造器创建对象时，`init` 代码块是先于次构造器执行的。如果把主构造器看成身体的头部，那么 `init` 代码块就是颈部，次构造器就相当于身体其余部分。

    细心的你也许会发现这里又出现了 `:` 符号，它还在其他场合出现过，例如：

    - 变量的声明：`var id: Int`
    - 类的继承：`class MainActivity : AppCompatActivity() {}`
    - 接口的实现：`class User : Impl {}`
    - 匿名类的创建：`object: ViewPager.SimpleOnPageChangeListener() {}`
    - 函数的返回值：`fun sum(a: Int, b: Int): Int`

    可以看出 `:` 符号在 Kotlin 中非常高频出现，它其实表示了一种依赖关系，在这里表示依赖于主构造器。

    通常情况下，主构造器中的 `constructor` 关键字可以省略：

    ```kotlin
    🏝️
    class User(name: String) {
        var name: String = name
    }
    
    ```

    但有些场景，`constructor` 是不可以省略的，例如在主构造器上使用「可见性修饰符」或者「注解」：

    ```kotlin
    🏝️
    class User private constructor(name: String) {
    //           👆 主构造器被修饰为私有的，外部就无法调用该构造器
    }
    
    ```

    #### 主构造器里声明属性

    可以在主构造器中直接声明属性：

    ```kotlin
    🏝️
               👇
    class User(var name: String) {
    }
    // 等价于：
    class User(name: String) {
      var name: String = name
    }
    
    ```

    如果在主构造器的参数声明时加上 `var` 或者 `val`，就等价于在类中创建了该名称的属性（property），并且初始值就是主构造器中该参数的值。

    

    关于主构造器相关的知识，让我们总结一下类的初始化写法：

    首先创建一个 `User` 类：

    ```kotlin
    🏝️
    class User {
    }
    
    ```

    添加一个参数为 `name` 与 `id` 的主构造器：

    ```kotlin
    🏝️
    class User(name: String, id: String) {
    }
    
    ```

    将主构造器中的 `name` 与 `id` 声明为类的属性：

    ```kotlin
    🏝️
    class User(val name: String, val id: String) {
    }
    
    ```

    然后在 `init` 代码块中添加一些初始化逻辑：

    ```kotlin
    🏝️
    class User(val name: String, val id: String) {
        init {
            ...
        }
    }
    
    ```

    最后再添加其他次构造器：

    ```kotlin
    🏝️
    class User(val name: String, val id: String) {
        init {
            ...
        }
        
        constructor(person: Person) : this(person.name, person.id) {
        }
    }
    
    ```

    - 当一个类有多个构造器时，只需要把最基本、最通用的那个写成主构造器就行了。这里我们选择将参数为 `name` 与 `id` 的构造器作为主构造器。

24. ### 函数简化

    #### 使用 `=` 连接返回值

    ```kotlin
    🏝️
    fun area(width: Int, height: Int): Int {
        return width * height
    }
    
    
                                          👇
    fun area(width: Int, height: Int): Int = width * height
    
    
    //                               👇省略了返回类型  类型推断
    fun area(width: Int, height: Int) = width * height
    
    //对于没有返回值的情况，可以理解为返回值是 Unit：
    fun sayHi(name: String) {
        println("Hi " + name)
    }
    
                           👇
    fun sayHi(name: String) = println("Hi " + name)
    
    ```

25. #### 参数默认值

    Java 中，允许在一个类中定义多个名称相同的方法，但是参数的类型或个数必须不同，这就是方法的重载：

    ```java
    ☕️
    public void sayHi(String name) {
        System.out.println("Hi " + name);
    }
    ​
    public void sayHi() {
        sayHi("world"); 
    }
    
    
    ```

    在 Kotlin 中，也可以使用这样的方式进行函数的重载，不过还有一种更简单的方式，那就是「参数默认值」：

    ```kotlin
    🏝️
                               👇
    fun sayHi(name: String = "world") = println("Hi " + name)
    
    ```

26. #### 命名参数

    ```kotlin
    🏝️
    fun sayHi(name: String = "world", age: Int) {
        ...
    }
          👇   
    sayHi(age = 21)
    
    ```

    看一个有非常多参数的函数的例子：

    ```kotlin
    🏝️ 
    fun sayHi(name: String = "world", age: Int, isStudent: Boolean = true, isFat: Boolean = true, isTall: Boolean = true) {
        ...
    }
    
    
    🏝️
    sayHi("world", 21, false, true, false)
    
    
    //当看到后面一长串的布尔值时，我们很难分清楚每个参数的用处，可读性很差。通过命名参数，我们就可以这么写：
    
    sayHi(name = "wo", age = 21, isStudent = false, isFat = true, isTall = false)
    
    
    ```

    与命名参数相对的一个概念被称为「位置参数」，也就是按位置顺序进行参数填写。

    当一个函数被调用时，如果混用位置参数与命名参数，那么所有的位置参数都应该放在第一个命名参数之前：

    ```kotlin
    🏝️
    fun sayHi(name: String = "world", age: Int) {
        ...
    }
    
    sayHi(name = "wo", 21) // 👈 IDE 会报错，Mixing named and positioned arguments is not allowed
    sayHi("wo", age = 21) // 👈 这是正确的写法
    
    ```

27. #### 本地函数（嵌套函数）

    ```kotlin
    🏝️
    fun login(user: String, password: String, illegalStr: String) {
        // 验证 user 是否为空
        if (user.isEmpty()) {
            throw IllegalArgumentException(illegalStr)
        }
        // 验证 password 是否为空
        if (password.isEmpty()) {
            throw IllegalArgumentException(illegalStr)
        }
    }
    
    ```

    该函数中，检查参数这个部分有些冗余，我们又不想将这段逻辑作为一个单独的函数对外暴露。这时可以使用嵌套函数，在 `login` 函数内部声明一个函数：

    ```kotlin
    🏝️
    fun login(user: String, password: String, illegalStr: String) {
               👇 
        fun validate(value: String, illegalStr: String) {
          if (value.isEmpty()) {
              throw IllegalArgumentException(illegalStr)
          }
        }
       👇
        validate(user, illegalStr)
        validate(password, illegalStr)
    }
    
    ```

    这里我们将共同的验证逻辑放进了嵌套函数 `validate` 中，并且 `login` 函数之外的其他地方无法访问这个嵌套函数。

    这里的 `illegalStr` 是通过参数的方式传进嵌套函数中的，其实完全没有这个必要，因为**嵌套函数中可以访问在它外部的所有变量或常量，例如类中的属性、当前函数中的参数与变量等。**

    

    我们稍加改进：

    ```kotlin
    🏝️
    fun login(user: String, password: String, illegalStr: String) {
        fun validate(value: String) {
            if (value.isEmpty()) {
                                                  👇
                throw IllegalArgumentException(illegalStr)
            }
        }
        ...
    }
    
    ```

    这里省去了嵌套函数中的 `illegalStr` 参数，在该嵌套函数内直接使用外层函数 `login` 的参数 `illegalStr`。

    上面 `login` 函数中的验证逻辑，其实还有另一种更简单的方式：

    ```kotlin
    🏝️
    fun login(user: String, password: String, illegalStr: String) {
        require(user.isNotEmpty()) { illegalStr }
        require(password.isNotEmpty()) { illegalStr }
    }
    
    ```

    其中用到了 lambda 表达式以及 Kotlin 内置的 `require` 函数。

28. ### 字符串

    #### 字符串模板

    在 Java 中，字符串与变量之间是使用 `+` 符号进行拼接的，Kotlin 中也是如此：

    ```kotlin
    🏝️
    val name = "world"
    println("Hi " + name)
    
    ```

    但是当变量比较多的时候，可读性会变差，写起来也比较麻烦。

    Java 给出的解决方案是 `String.format`：

    ```java
    ☕️
    System.out.print(String.format("Hi %s", name));
    
    ```

    Kotlin 为我们提供了一种更加方便的写法：

    ```kotlin
    🏝️
    val name = "world"
    //         👇 用 '$' 符号加参数的方式
    println("Hi $name")
    
    ```

    这种方式就是把 `name` 从后置改为前置，简化代码的同时增加了字符串的可读性。

    除了变量，`$` 后还可以跟表达式，但表达式是一个整体，所以我们要用 `{}` 给它包起来：

    ```kotlin
    🏝️
    val name = "world"
    println("Hi ${name.length}") 
    
    ```

    其实就跟四则运算的括号一样，提高语法上的优先级，而单个变量的场景可以省略 `{}`。

    字符串模板还支持转义字符，比如使用转义字符 `\n` 进行换行操作：

    ```kotlin
    🏝️
    val name = "world!\n"
    println("Hi $name") // 👈 会多打一个空行
    
    ```

    #### raw string (原生字符串)

    有时候我们不希望写过多的转义字符，这种情况 Kotlin 通过「原生字符串」来实现。

    用法就是使用一对 `"""` 将字符串括起来：

    ```kotlin
    🏝️
    val name = "world"
    val myName = "kotlin"
               👇
    val text = """
          Hi $name!
        My name is $myName.\n
    """
    println(text)
    
    ```

    - `\n` 并不会被转义
    - 最后输出的内容与写的内容完全一致，包括实际的换行
    - `$` 符号引用变量仍然生效

    输出结果如下：

    ```kotlin
      Hi world!
        My name is kotlin.\n
    
    ```

    对齐方式看起来不太优雅，原生字符串还可以通过 `trimMargin()` 函数去除每行前面的空格：

    ```kotlin
    🏝️
    val text = """
         👇 
          |Hi world!
        |My name is kotlin.
    """.trimMargin()
    println(text)
    
    ```

    输出结果如下：

    ```kotlin
    Hi world!
    My name is kotlin.
    
    ```

    这里的 `trimMargin()` 函数有以下几个注意点：

    - `|` 符号为默认的边界前缀，前面只能有空格，否则不会生效
    - 输出时 `|` 符号以及它前面的空格都会被删除
    - 边界前缀还可以使用其他字符，比如 `trimMargin("/")`，只不过上方的代码使用的是参数默认值的调用方式。

29. ### 数组和集合

    #### 数组与集合的操作符

    声明如下 `IntArray` 和 `List`：

    ```kotlin
    🏝️
    val intArray = intArrayOf(1, 2, 3)
    val strList = listOf("a", "b", "c")
    
    ```

    `forEach`：遍历每一个元素

    ```kotlin
    🏝️
    //              👇 lambda 表达式，i 表示数组的每个元素
    intArray.forEach { i ->
        print(i + " ")
    }
    // 输出：1 2 3 
    
    ```

    `filter`：对每个元素进行过滤操作，如果 lambda 表达式中的条件成立则留下该元素，否则剔除，最终生成新的集合

    ```kotlin
    🏝️
    // [1, 2, 3]
          ⬇️
    //  {2, 3}
    
    //            👇 注意，这里变成了 List
    val newList: List = intArray.filter { i ->
        i != 1 // 👈 过滤掉数组中等于 1 的元素
    }
    
    ```

    `map`：遍历每个元素并执行给定表达式，最终形成新的集合

    ```kotlin 
    🏝️
    //  [1, 2, 3]
           ⬇️
    //  {2, 3, 4}
    
    val newList: List = intArray.map { i ->
        i + 1 // 👈 每个元素加 1
    }
    
    ```

    `flatMap`：遍历每个元素，并为每个元素创建新的集合，最后合并到一个集合中

    ```kotlin
    🏝️
    //          [1, 2, 3]
                   ⬇️
    // {"2", "a" , "3", "a", "4", "a"}
    
    intArray.flatMap { i ->
        listOf("${i + 1}", "a") // 👈 生成新集合
    }
    
    ```

30. #### `Range`

    在 Java 语言中并没有 `Range` 的概念，Kotlin 中的 `Range` 表示区间的意思，也就是范围。区间的常见写法如下：

    ```kotlin
    🏝️
                  👇      👇
    val range: IntRange = 0..1000 
    
    ```

    这里的 `0..1000` 就表示从 0 到 1000 的范围，**包括 1000**，数学上称为闭区间 [0, 1000]。除了这里的 `IntRange` ，还有 `CharRange` 以及 `LongRange`。

    Kotlin 中没有纯的开区间的定义，不过有半开区间的定义：

    ```koltin
    🏝️
                             👇
    val range: IntRange = 0 until 1000 
    
    ```

    这里的 `0 until 1000` 表示从 0 到 1000，但**不包括 1000**，这就是半开区间 [0, 1000) 。

    ```kotlin
    🏝️
    val range = 0..1000
    //     👇 默认步长为 1，输出：0, 1, 2, 3, 4, 5, 6, 7....1000,
    for (i in range) {
        print("$i, ")
    }
    
    ```

    除了使用默认的步长 1，还可以通过 `step` 设置步长：

    ```kotlin
    🏝️
    val range = 0..1000
    //               👇 步长为 2，输出：0, 2, 4, 6, 8, 10,....1000,
    for (i in range step 2) {
        print("$i, ")
    }
    
    ```

    Kotlin 还提供了递减区间 `downTo` ，不过递减没有半开区间的用法:

    ```kotlin
    🏝️
    //            👇 输出：4, 3, 2, 1, 
    for (i in 4 downTo 1) {
        print("$i, ")
    }
    
    ```

    其中 `4 downTo 1` 就表示递减的闭区间 [4, 1]。这里的 `downTo` 以及上面的 `step` 都叫做「中缀表达式」

    

31. #### `Sequence`

    了解 `Sequence` 序列的使用方式。

    序列 `Sequence` 又被称为「惰性集合操作」，关于什么是惰性，我们通过下面的例子来理解：

    ```kotlin
    🏝️
    val sequence = sequenceOf(1, 2, 3, 4)
    val result: List = sequence
        .map { i ->
            println("Map $i")
            i * 2 
        }
        .filter { i ->
            println("Filter $i")
            i % 3  == 0 
        }
    👇
    println(result.first()) // 👈 只取集合的第一个元素
    
    ```

    - 惰性的概念首先就是说在「👇」标注之前的代码运行时不会立即执行，它只是定义了一个执行流程，只有 `result` 被使用到的时候才会执行

    - 当「👇」的 `println` 执行时数据处理流程是这样的：

      - 取出元素 1 -> map 为 2 -> filter 判断 2 是否能被 3 整除
      - 取出元素 2 -> map 为 4 -> filter 判断 4 是否能被 3 整除
      - ...

      惰性指当出现满足条件的第一个元素的时候，`Sequence` 就不会执行后面的元素遍历了，即跳过了 `4` 的遍历。

    而 `List` 是没有惰性的特性的：

    ```kotlin
    🏝️
    val list = listOf(1, 2, 3, 4)
    val result: List = list
        .map { i ->
            println("Map $i")
            i * 2 
        }
        .filter { i ->
            println("Filter $i")
            i % 3  == 0 
        }
    👇
    println(result.first()) // 👈 只取集合的第一个元素
    
    ```

    包括两点：

    - 声明之后立即执行
    - 数据处理流程如下：
      - {1, 2, 3, 4} -> {2, 4, 6, 8}
      - 遍历判断是否能被 3 整除

    `Sequence` 这种类似懒加载的实现有下面这些优点：

    - 一旦满足遍历退出的条件，就可以省略后续不必要的遍历过程。
    - 像 `List` 这种实现 `Iterable` 接口的集合类，每调用一次函数就会生成一个新的 `Iterable`，下一个函数再基于新的 `Iterable` 执行，每次函数调用产生的临时 `Iterable` 会导致额外的内存消耗，而 `Sequence` 在整个流程中只有一个。

    因此，`Sequence` 这种数据类型可以在数据量比较大或者数据量未知的时候，作为流式处理的解决方案。

32. ### 条件控制

    #### `if/else`

    首先来看下 Java 中的 `if/else` 写法：

    ```java
    ☕️
    int max;
    if (a > b) {
        max = a;
    } else {
        max = b;
    }
    
    ```

    在 Kotlin 中，这么写当然也可以，不过，Kotlin 中 `if` 语句还可以作为一个表达式赋值给变量：

    ```kotlin
    🏝️
           👇
    val max = if (a > b) a else b
    
    ```

    另外，Kotlin 中弃用了三元运算符（条件 ? 然后 : 否则），不过我们可以使用 `if/else` 来代替它。

    上面的 `if/else` 的分支中是一个变量，其实还可以是一个代码块，代码块的最后一行会作为结果返回：

    ```kotlin
    🏝️
    val max = if (a > b) {
        println("max:a")
        a // 👈 返回 a
    } else {
        println("max:b")
        b // 👈 返回 b
    }
    
    
    ```

    #### `when`

    在 Java 中，用 `switch` 语句来判断一个变量与一系列值中某个值是否相等：

    ```java
    ☕️
    switch (x) {
        case 1: {
            System.out.println("1");
            break;
        }
        case 2: {
            System.out.println("2");
            break;
        }
        default: {
            System.out.println("default");
        }
    }
    
    ```

    kotlin中

    ```kotlin
    🏝️
    👇
    when (x) {
       👇
        1 -> { println("1") }
        2 -> { println("2") }
       👇
        else -> { println("else") }
    }
    
    ```

    这里与 Java 相比的不同点有：

    - 省略了 `case` 和 `break`，前者比较好理解，后者的意思是 Kotlin 自动为每个分支加上了 `break` 的功能，防止我们像 Java 那样写错
    - Java 中的默认分支使用的是 `default` 关键字，Kotlin 中使用的是 `else`

    与 `if/else` 一样，`when` 也可以作为表达式进行使用，分支中最后一行的结果作为返回值。需要注意的是，这时就必须要有 `else` 分支，使得无论怎样都会有结果返回，除非已经列出了所有情况：

    ```kotlin
    🏝️
    val value: Int = when (x) {
        1 -> { x + 1 }
        2 -> { x * 2 }
        else -> { x + 5 }
    }
    
    ```

    在 Java 中，当多种情况执行同一份代码时，可以这么写：

    ```java
    ☕️
    switch (x) {
        case 1:
        case 2: {
            System.out.println("x == 1 or x == 2");
            break;
        }
        default: {
            System.out.println("default");
        }
    }
    
    ```

    而 Kotlin 中多种情况执行同一份代码时，可以将多个分支条件放在一起，用 `,` 符号隔开，表示这些情况都会执行后面的代码：

    ```koltin
    🏝️
    when (x) {
        👇
        1, 2 -> print("x == 1 or x == 2")
        else -> print("else")
    }
    
    ```

    在 `when` 语句中，我们还可以使用表达式作为分支的判断条件：

    使用 `in` 检测是否在一个区间或者集合中：

    ```kotlin
    🏝️
    when (x) {
       👇
        in 1..10 -> print("x 在区间 1..10 中")
       👇
        in listOf(1,2) -> print("x 在集合中")
       👇 // not in
        !in 10..20 -> print("x 不在区间 10..20 中")
        else -> print("不在任何区间上")
    }
    
    ```

    或者使用 `is` 进行特定类型的检测：

    ```kotlin
    🏝️
    val isString = when(x) {
        👇
        is String -> true
        else -> false
    }
    
    ```

    还可以省略 `when` 后面的参数，每一个分支条件都可以是一个布尔表达式：

    ```kotlin
    🏝️
    when {
       👇
        str1.contains("a") -> print("字符串 str1 包含 a")
       👇
        str2.length == 3 -> print("字符串 str2 的长度为 3")
    }
    
    ```

    当分支的判断条件为表达式时，哪一个条件先为 `true` 就执行哪个分支的代码块。

33. #### `for`

    我们知道 Java 对一个集合或数组可以这样遍历：

    ```java
    ☕️
    int[] array = {1, 2, 3, 4};
    for (int item : array) {
        ...
    }
    
    ```

    kotlin

    ```kotlin
    🏝️
    val array = intArrayOf(1, 2, 3, 4)
              👇
    for (item in array) {
        ...
    }
    
    ```

    这里与 Java 有几处不同：

    - 在 Kotlin 中，表示单个元素的 `item` ，不用显式的声明类型
    - Kotlin 使用的是 `in` 关键字，表示 `item` 是 `array` 里面的一个元素

    另外，Kotlin 的 `in` 后面的变量可以是任何实现 `Iterable` 接口的对象。

    在 Java 中，我们还可以这么写 `for` 循环：

    ```java
    ☕️
    for (int i = 0; i <= 10; i++) {
        // 遍历从 0 到 10
    }
    
    ```

    但 Kotlin 中没有这样的写法，那应该怎样实现一个 0 到 10 的遍历呢？

    其实使用上面讲过的区间就可以实现啦，代码如下：

    ```kotlin
    🏝️
    for (i in 0..10) {
        println(i)
    }
    
    ```

34. #### `try-catch`

    关于 `try-catch` 我们都不陌生，在平时开发中难免都会遇到异常需要处理，那么在 Kotlin 中是怎样处理的呢，先来看下 Kotlin 中捕获异常的代码：

    ```kotlin
    🏝️
    try {
        ...
    }
    catch (e: Exception) {
        ...
    }
    finally {
        ...
    }
    
    ```

    可以发现 Kotlin 异常处理与 Java 的异常处理基本相同，但也有几个不同点：

    * 我们知道在 Java 中，调用一个抛出异常的方法时，我们需要对异常进行处理，否则就会报错：

      ```java
      ☕️
      public class User{
          void sayHi() throws IOException {
          }
          
          void test() {
              sayHi();
              // 👆 IDE 报错，Unhandled exception: java.io.IOException
          }
      }
      
      ```

      但在 Kotlin 中，调用上方 `User` 类的 `sayHi` 方法时：

      ```koltin
      🏝️
      val user = User()
      user.sayHi() // 👈 正常调用，IDE 不会报错，但运行时会出错
      
      ```

      为什么这里不会报错呢？因为 Kotlin 中的异常是不会被检查的，只有在运行时如果 `sayHi` 抛出异常，才会出错。

    * Kotlin 中 `try-catch` 语句也可以是一个表达式，允许代码块的最后一行作为返回值：

      ```kotlin
      🏝️
                 👇       
      val a: Int? = try { parseInt(input) } catch (e: NumberFormatException) { null }
      
      ```

    

35. #### `?.` 和 `?:`

    我们知道空安全调用 `?.`，在对象非空时会执行后面的调用，对象为空时就会返回 `null`。如果这时将该表达式赋值给一个不可空的变量：

    ```kotlin
    🏝️
    val str: String? = "Hello"
    var length: Int = str?.length
    //                👆 ，IDE 报错，Type mismatch. Required:Int. Found:Int?
    
    ```

    报错的原因就是 `str` 为 null 时我们没有值可以返回给 `length`

    这时就可以使用 Kotlin 中的 Elvis 操作符 `?:` 来兜底：

    ```kotlin
    🏝️
    val str: String? = "Hello"
                                 👇
    val length: Int = str?.length ?: -1
    
    ```

    它的意思是如果左侧表达式 `str?.length` 结果为空，则返回右侧的值 `-1`。

    Elvis 操作符还有另外一种常见用法，如下：

    ```kotlin
    🏝️
    fun validate(user: User) {
        val id = user.id ?: return // 👈 验证 user.id 是否为空，为空时 return 
    }
    
    // 等同于
    
    fun validate(user: User) {
        if (user.id == null) {
            return
        }
        val id = user.id
    }
    
    ```

36. #### `==` 和 `===`

    在 Java 中，`==` 比较的如果是基本数据类型则判断值是否相等，如果比较的是 `String` 则表示引用地址是否相等， `String` 字符串的内容比较使用的是 `equals()` ：

    ```java
    ☕️
    String str1 = "123", str2 = "123";
    System.out.println(str1.equals(str2));
    System.out.println(str1 == str2); 
    
    ```

    Kotlin 中也有两种相等比较方式：

    - `==` ：可以对基本数据类型以及 `String` 等类型进行内容比较，相当于 Java 中的 `equals`
    - `===` ：对引用的内存地址进行比较，相当于 Java 中的 `==`

    可以发现，Java 中的 `equals` ，在 Kotlin 中与之相对应的是 `==`，这样可以使我们的代码更加简洁。

    下面再来看看代码示例：

    ```kotlin
    🏝️
    val str1 = "123"
    val str2 = "123"
    println(str1 == str2) // 👈 内容相等，输出：true
    
    val str1= "字符串"
    val str2 = str1
    val str3 = str1
    print(str2 === str3) // 👈 引用地址相等，输出：true
    
    ```

    其实 Kotlin 中的 `equals` 函数是 `==` 的操作符重载。

37. ### 泛型

    > `in`  和 `out` 关键字

    java中：

    ```java
    ☕️
    List<TextView> textViews = new ArrayList<TextView>();
    
    ```

    其中 `List` 表示这是一个泛型类型为 `TextView` 的 `List`。

    > 什么是泛型？
    >
    > 现在的程序开发大都是面向对象的，平时会用到各种类型的对象，一组对象通常需要用集合来存储它们，因而就有了一些集合类，比如 `List`、`Map` 等。
    >
    > 这些集合类里面都是装的具体类型的对象，如果每个类型都去实现诸如 `TextViewList`、`ActivityList` 这样的具体的类型，显然是不可能的。
    >
    > 因此就诞生了「泛型」，它的意思是把具体的类型泛化，编码的时候用符号来指代类型，在使用的时候，再确定它的类型。
    >
    > 前面那个例子，`List` 就是泛型类型声明。

    既然泛型是跟类型相关的，那么是不是也能适用类型的多态呢？

    看看一个使用场景：

    ```java
    ☕️
    TextView textView = new Button(context);
    // 👆 这是多态
    
    List<Button> buttons = new ArrayList<Button>();
    List<TextView> textViews = buttons;
    // 👆 多态用在这里会报错 incompatible types: List<Button> cannot be converted to List<TextView>
    
    ```

    我们知道 `Button` 是继承自 `TextView` 的，根据 Java 多态的特性，第一处赋值是正确的。

    但是到了 `List` 的时候 IDE 就报错了，这是因为 Java 的泛型本身具有「不可变性 Invariance」，Java 里面认为 `List` 和 `List` 类型并不一致，也就是说，子类的泛型（`List`）不属于泛型（`List`）的子类。

    > Java 的泛型类型会在编译时发生**类型擦除**，为了保证类型安全，不允许这样赋值
    >
    > 在 Java 里用数组做类似的事情，是不会报错的，这是因为数组并没有在编译时擦除类型.

    #### 类型擦除

    [来源](https://www.cnblogs.com/wuqinglong/p/9456193.html)

    > Java的泛型是伪泛型，这是因为Java在编译期间，所有的泛型信息都会被擦掉。
    >
    > Java的泛型基本上都是在编译器这个层次上实现的，在生成的字节码中是不包含泛型中的类型信息的，使用泛型的时候加上类型参数，在编译器编译的时候会去掉，这个过程成为类型擦除。
    >
    > 
    >
    > 如在代码中定义`List`和`List`等类型，在编译后都会变成`List`，JVM看到的只是List，而由泛型附加的类型信息对JVM是看不到的。Java编译器会在编译时尽可能的发现可能出错的地方，但是仍然无法在运行时刻出现的类型转换异常的情况，类型擦除也是Java的泛型与C++模板机制实现方式之间的重要区别。

    * 例1 原始类型相等

    ```java
    public static void main(String[] args) {
        ArrayList<String> list1 = new ArrayList<String>();
        list1.add("abc");
    
        ArrayList<Integer> list2 = new ArrayList<Integer>();
        list2.add(123);
    
        System.out.println(list1.getClass() == list2.getClass());
    }
    
    
    ```

    在这个例子中，我们定义了两个`ArrayList`数组，不过一个是`ArrayList`泛型类型的，只能存储字符串；一个是`ArrayList`泛型类型的，只能存储整数，最后，我们通过`list1`对象和`list2`对象的`getClass()`方法获取他们的类的信息，最后发现结果为`true`。说明泛型类型`String`和`Integer`都被擦除掉了，只剩下原始类型。

    * 例2 通过反射添加其它类型元素

    ```Java
    ArrayList<Integer> list = new ArrayList<Integer>();
    
    list.add(1);  //这样调用 add 方法只能存储整形，因为泛型类型的实例为 Integer
    
    list.getClass().getMethod("add", Object.class).invoke(list, "asd");
    
    for (int i = 0; i < list.size(); i++) {
        System.out.println(list.get(i));
    }
    
    ```

    在程序中定义了一个`ArrayList`泛型类型实例化为`Integer`对象，如果直接调用`add()`方法，那么只能存储整数数据，不过当我们利用反射调用`add()`方法的时候，却可以存储字符串，这说明了`Integer`泛型实例在编译之后被擦除掉了，只保留了原始类型。

    ##### 类型擦除后保留的原始类型

    ------

    > **原始类型** 就是擦除去了泛型信息，最后在字节码中的类型变量的真正类型，无论何时定义一个泛型，相应的原始类型都会被自动提供，类型变量擦除，并使用其限定类型（无限定的变量用Object）替换。

    * 例3原始类型Object

    ```java
    class Pair<T> {
        private T value;
        public T getValue() {
            return value;
        }
        public void setValue(T  value) {
            this.value = value;
        }
    }  
    
    ```

    Pair的原始类型为:

    ```java
    class Pair {
        private Object value;
        public Object getValue() {
            return value;
        }
        public void setValue(Object  value) {
            this.value = value;
        }
    }
    
    ```

    因为在`Pair`中，T 是一个无限定的类型变量，所以用`Object`替换，其结果就是一个普通的类，如同泛型加入Java语言之前的已经实现的样子。在程序中可以包含不同类型的`Pair`，如`Pair`或`Pair`，但是擦除类型后他们的就成为原始的`Pair`类型了，原始类型都是`Object`。

    从上面的例2中，我们也可以明白`ArrayList`被擦除类型后，原始类型也变为`Object`，所以通过反射我们就可以存储字符串了。

    如果类型变量有限定，那么原始类型就用第一个边界的类型变量类替换。

    比如: Pair这样声明的话

    `public class Pair<T extends Comparable> {}` 那么原始类型就是`Comparable`。

    在调用泛型方法时，可以指定泛型，也可以不指定泛型。

    - 在不指定泛型的情况下，泛型变量的类型为该方法中的几种类型的同一父类的最小级，直到Object
    - 在指定泛型的情况下，该方法的几种类型必须是该泛型的实例的类型或者其子类

    ```java
    class Test {
    
        public static void main(String[] args) {
            /**不指定泛型的时候*/
            int i = Test.add(1, 2); //这两个参数都是Integer，所以T为Integer类型
            Number f = Test.add(1, 1.2); //这两个参数一个是Integer，一个是Double，所以取同一父类的最小级，为Number
            Object o = Test.add(1, "asd"); //这两个参数一个是Integer，一个是String，所以取同一父类的最小级，为String
    
            System.out.println(Test.add(1, 2).getClass());
            System.out.println(Test.add(1, 1.2).getClass());
            System.out.println(Test.add(1, "asd").getClass());
    
            /**指定泛型的时候*/
            int a = Test.<Integer>add(1, 2); //指定了Integer，所以只能为Integer类型或者其子类
            int b = Test.<Integer>add(1, 2.2); //编译错误，指定了Integer，不能为Double
            Number c = Test.<Number>add(1, 2.2); //指定为Number，所以可以为Integer和Double
        }
    
        //这是一个简单的泛型方法
        public static <T> T add(T x,T y){
            return y;
        }
    }
    
    ```

    输出

    class java.lang.Integer
    class java.lang.Double
    class java.lang.String

    其实在泛型类中，不指定泛型的时候，也差不多，只不过这个时候的泛型为`Object`，就比如`ArrayList`中，如果不指定泛型，那么这个`ArrayList`可以存储任意的对象。

    ```java
    public static void main(String[] args) {
        ArrayList list = new ArrayList();
        list.add(1);
        list.add("121");
        list.add(new Date());
    }
    
    ```

    ##### 类型擦除引起的问题及解决方法

    ------

    1. Q: 既然说类型变量会在编译的时候擦除掉，那为什么我们往 ArrayList 创建的对象中添加整数会报错呢？不是说泛型变量String会在编译的时候变为Object类型吗？为什么不能存别的类型呢？既然类型擦除了，如何保证我们只能使用泛型变量限定的类型呢？

       * Java编译器是通过先检查代码中泛型的类型，然后在进行类型擦除，再进行编译。

       ```java
       ArrayList<String> list = new ArrayList<String>();
       list.add("123");
       list.add(123);//编译错误  
       
       ```

       在上面的程序中，使用`add`方法添加一个整型，在IDE中，直接会报错，说明这就是在编译之前的检查，因为如果是在编译之后检查，类型擦除后，原始类型为`Object`，是应该允许任意引用类型添加的。可实际上却不是这样的，这恰恰说明了关于泛型变量的使用，是会在编译之前检查的。

    2. 泛型中参数话类型为什么不考虑继承关系？

       在Java中，像下面形式的引用传递是不允许的:

       ```java
       ArrayList<String> list1 = new ArrayList<Object>(); //编译错误  
       ArrayList<Object> list2 = new ArrayList<String>(); //编译错误
       
       ```

       我们先看第一种情况，将第一种情况拓展成下面的形式：

       ```java
       ArrayList<Object> list1 = new ArrayList<Object>();
       list1.add(new Object());
       list1.add(new Object());
       ArrayList<String> list2 = list1; //编译错误
       
       ```

       实际上，在第4行代码的时候，就会有编译错误。那么，我们先假设它编译没错。那么当我们使用`list2`引用用`get()`方法取值的时候，返回的都是`String`类型的对象（上面提到了，类型检测是根据引用来决定的），可是它里面实际上已经被我们存放了`Object`类型的对象，这样就会有`ClassCastException`了。所以为了避免这种极易出现的错误，Java不允许进行这样的引用传递。（这也是泛型出现的原因，就是为了解决类型转换的问题，我们不能违背它的初衷）。

       再看第二种情况，将第二种情况拓展成下面的形式：

       ```java
       ArrayList<String> list1 = new ArrayList<String>();
       list1.add(new String());
       list1.add(new String());
       
       ArrayList<Object> list2 = list1; //编译错误
       
       ```

       没错，这样的情况比第一种情况好的多，最起码，在我们用`list2`取值的时候不会出现`ClassCastException`，因为是从`String`转换为`Object`。可是，这样做有什么意义呢，泛型出现的原因，就是为了解决类型转换的问题。我们使用了泛型，到头来，还是要自己强转，违背了泛型设计的初衷。所以java不允许这么干。再说，你如果又用`list2`往里面`add()`新的对象，那么到时候取得时候，我怎么知道我取出来的到底是`String`类型的，还是`Object`类型的呢？

       **所以，要格外注意，泛型中的引用传递的问题。**

    3. ##### 自动类型转换

       因为类型擦除的问题，所以所有的泛型类型变量最后都会被替换为原始类型。

       既然都被替换为原始类型，那么为什么我们在获取的时候，不需要进行强制类型转换呢？

       看下`ArrayList.get()`方法：

       ```java
       public E get(int index) {
       
           RangeCheck(index);
       
           return (E) elementData[index];
       
       }
       
       ```

       可以看到，在`return`之前，会根据泛型变量进行强转。假设泛型类型变量为`Date`，虽然泛型信息会被擦除掉，但是会将`(E) elementData[index]`，编译为`(Date)elementData[index]`。所以我们不用自己进行强转。当存取一个泛型域时也会自动插入强制类型转换。假设`Pair`类的`value`域是`public`的，那么表达式：

       ```
       Date date = pair.value;
       
       ```

       也会自动地在结果字节码中插入强制类型转换。

    4. ##### 类型擦除与多态的冲突和解决方法

       现在有这样一个泛型类：

       ```java
       class Pair<T> {
       
           private T value;
       
           public T getValue() {
               return value;
           }
       
           public void setValue(T value) {
               this.value = value;
           }
       }
       
       ```

       然后我们想要一个子类继承它。

       ```java
       class DateInter extends Pair<Date> {
       
           @Override
           public void setValue(Date value) {
               super.setValue(value);
           }
       
           @Override
           public Date getValue() {
               return super.getValue();
           }
       }
       
       ```

       在这个子类中，我们设定父类的泛型类型为`Pair`，在子类中，我们覆盖了父类的两个方法，我们的原意是这样的：将父类的泛型类型限定为`Date`，那么父类里面的两个方法的参数都为`Date`类型。

       所以，我们在子类中重写这两个方法一点问题也没有，实际上，从他们的`@Override`标签中也可以看到，一点问题也没有，实际上是这样的吗？

       分析：实际上，类型擦除后，父类的的泛型类型全部变为了原始类型`Object`，所以父类编译之后会变成下面的样子：

       ```java
       class Pair {
           private Object value;
       
           public Object getValue() {
               return value;
           }
       
           public void setValue(Object  value) {
               this.value = value;
           }
       }
       
       ```

       先来分析`setValue`方法，父类的类型是`Object`，而子类的类型是`Date`，参数类型不一样，这如果实在普通的继承关系中，根本就不会是重写，而是重载。

       我们在一个main方法测试一下：

       ```java
       DateInter dateInter = new DateInter();
       dateInter.setValue(new Date());
       dateInter.setValue(new Object()); //编译错误  
       
       ```

       如果是重载，那么子类中两个`setValue`方法，一个是参数`Object`类型，一个是`Date`类型，可是我们发现，根本就没有这样的一个子类继承自父类的Object类型参数的方法。所以说，却是是重写了，而不是重载了。

       ???????????????

       原因是这样的，我们传入父类的泛型类型是`Date，Pair`，我们的本意是将泛型类变为如下：

       ```java
       class Pair {
           private Date value;
           public Date getValue() {
               return value;
           }
           public void setValue(Date value) {
               this.value = value;
           }
       }
       
       ```

       然后再子类中重写参数类型为Date的那两个方法，实现继承中的多态。

       可是由于种种原因，虚拟机并不能将泛型类型变为`Date`，只能将类型擦除掉，变为原始类型`Object`。这样，我们的本意是进行重写，实现多态。可是类型擦除后，只能变为了重载。这样，类型擦除就和多态有了冲突。JVM知道你的本意吗？知道！！！可是它能直接实现吗，不能！！！如果真的不能的话，那我们怎么去重写我们想要的`Date`类型参数的方法啊。

       于是JVM采用了一个特殊的方法，来完成这项功能，那就是桥方法。

       首先，我们用`javap -c className`的方式反编译下`DateInter`子类的字节码，结果如下：

       ```java
       class com.tao.test.DateInter extends com.tao.test.Pair<java.util.Date> {
               com.tao.test.DateInter();
               Code:
               0: aload_0
               1: invokespecial #8                  // Method com/tao/test/Pair."<init>":()V  
               4: return
       
       public void setValue(java.util.Date);  //我们重写的setValue方法  
               Code:
               0: aload_0
               1: aload_1
               2: invokespecial #16                 // Method com/tao/test/Pair.setValue:(Ljava/lang/Object;)V  
               5: return
       
       public java.util.Date getValue();    //我们重写的getValue方法  
               Code:
               0: aload_0
               1: invokespecial #23                 // Method com/tao/test/Pair.getValue:()Ljava/lang/Object;  
               4: checkcast     #26                 // class java/util/Date  
               7: areturn
       
       public java.lang.Object getValue();     //编译时由编译器生成的巧方法  
               Code:
               0: aload_0
               1: invokevirtual #28                 // Method getValue:()Ljava/util/Date 去调用我们重写的getValue方法;  
               4: areturn
       
       public void setValue(java.lang.Object);   //编译时由编译器生成的巧方法  
               Code:
               0: aload_0
               1: aload_1
               2: checkcast     #26                 // class java/util/Date  
               5: invokevirtual #30                 // Method setValue:(Ljava/util/Date; 去调用我们重写的setValue方法)V  
               8: return
               }
       }
       
       ```

       从编译的结果来看，我们本意重写`setValue`和`getValue`方法的子类，竟然有4个方法，其实不用惊奇，最后的两个方法，就是编译器自己生成的桥方法。可以看到桥方法的参数类型都是Object，也就是说，子类中真正覆盖父类两个方法的就是这两个我们看不到的桥方法。而打在我们自己定义的`setvalue`和`getValue`方法上面的`@Oveerride`只不过是假象。而桥方法的内部实现，就只是去调用我们自己重写的那两个方法。

       所以，虚拟机巧妙的使用了桥方法，来解决了类型擦除和多态的冲突。

       不过，要提到一点，这里面的`setValue`和`getValue`这两个桥方法的意义又有不同。

       `setValue`方法是为了解决类型擦除与多态之间的冲突。

       而`getValue`却有普遍的意义，怎么说呢，如果这是一个普通的继承关系：

       那么父类的`getValue`方法如下：

       ```java
       public Object getValue()
       {
         return super.getValue();
       }
       
       ```

       而子类重写的方法是：

       ```java
       public Date getValue() {
           return super.getValue();
       }
       
       ```

       其实这在普通的类继承中也是普遍存在的重写，这就是协变。

    5. ##### 泛型类型变量不能是基本数据类型

       不能用类型参数替换基本类型。就比如，没有`ArrayList`，只有`ArrayList`。因为当类型擦除后，`ArrayList`的原始类型变为`Object`，但是`Object`类型不能存储`double`值，只能引用`Double`的值。

       ##### 运行时类型查询

       `ArrayList<String> arrayList = new ArrayList<String>();`

       因为类型擦除之后，`ArrayList`只剩下原始类型，泛型信息`String`不存在了。

       那么，运行时进行类型查询的时候使用下面的方法是错误的

       `if( arrayList instanceof ArrayList<String>)`

    6. ##### 泛型在静态方法和静态类中的问题

       泛型类中的静态方法和静态变量不可以使用泛型类所声明的泛型类型参数

       ```java
       public class Test2<T> {
           public static T one;   //编译错误    
           public static  T show(T one){ //编译错误    
               return null;
           }
       }
       
       ```

       因为泛型类中的泛型参数的实例化是在定义对象的时候指定的，而静态变量和静态方法不需要使用对象来调用。对象都没有创建，如何确定这个泛型参数是何种类型，所以当然是错误的。

       但是要注意区分下面的一种情况：

       ```java
       public class Test2<T> {
       
           public static <T >T show(T one){ //这是正确的    
               return null;
           }
       }
       
       ```

       因为这是一个泛型方法，在泛型方法中使用的T是自己在方法中定义的 T，而不是泛型类中的T。

    ### Java 中的 `? extends`

    ```java
    ☕️
    List<Button> buttons = new ArrayList<Button>();
          👇
    List<? extends TextView> textViews = buttons;
    
    ```

    这个 `? extends` 叫做「上界通配符」，可以使 Java 泛型具有「协变性 Covariance」，协变就是允许上面的赋值是合法的。

    > 在继承关系树中，子类继承自父类，可以认为父类在上，子类在下。`extends` 限制了泛型类型的父类型，所以叫上界。

    它有两层意思：

    - 其中 `?` 是个通配符，表示这个 `List` 的泛型类型是一个**未知类型**。
    - `extends` 限制了这个未知类型的上界，也就是泛型类型必须满足这个 `extends` 的限制条件，这里和定义 `class` 的 `extends` 关键字有点不一样：
      - 它的范围不仅是所有直接和间接子类，还包括上界定义的父类本身，也就是 `TextView`。
      - 它还有 `implements` 的意思，即这里的上界也可以是 `interface`。

    这里 `Button` 是 `TextView` 的子类，满足了泛型类型的限制条件，因而能够成功赋值。

    下面几种情况都是可以的：

    ```java
    ☕️
    List<? extends TextView> textViews = new ArrayList<TextView>(); // 👈 本身
    List<? extends TextView> textViews = new ArrayList<Button>(); // 👈 直接子类
    List<? extends TextView> textViews = new ArrayList<RadioButton>(); // 👈 间接子类
    
    ```

    一般集合类都包含了 `get` 和 `add` 两种操作，比如 Java 中的 `List`，它的具体定义如下：

    ```java
    ☕️
    public interface List<E> extends Collection<E>{
        E get(int index);
        boolean add(E e);
        ...
    }
    
    
    ```

    上面的代码中，`E` 就是表示泛型类型的符号（用其他字母甚至单词都可以）。

    我们看看在使用了上界通配符之后，`List` 的使用上有没有什么问题：

    ```java
    ☕️
    List<? extends TextView> textViews = new ArrayList<Button>();
    TextView textView = textViews.get(0); // 👈 get 可以
    textViews.add(textView);
    //             👆 add 会报错，no suitable method found for add(TextView)
    
    ```

    前面说到 `List` 的泛型类型是个未知类型 `?`，编译器也不确定它是啥类型，只是有个限制条件。

    由于它满足 `? extends TextView` 的限制条件，所以 `get` 出来的对象，肯定是 `TextView` 的子类型，根据多态的特性，能够赋值给 `TextView`，啰嗦一句，赋值给 `View` 也是没问题的。

    到了 `add` 操作的时候，我们可以这么理解：

    - `List` 由于类型未知，它可能是 `List`，也可能是 `List`。
    - 对于前者，显然我们要添加 TextView 是不可以的。
    - 实际情况是编译器无法确定到底属于哪一种，无法继续执行下去，就报错了。

    那我干脆不要 `extends TextView` ，只用通配符 `?` 呢？这样使用 `List` 其实是 `List` 的缩写。

    ```java
    ☕️
    List<Button> buttons = new ArrayList<>();
    
    List<?> list = buttons;
    Object obj = list.get(0);
    
    list.add(obj); // 👈 这里还是会报错
    
    ```

    和前面的例子一样，编译器没法确定 `?` 的类型，所以这里就只能 `get` 到 `Object` 对象。

    同时编译器为了保证类型安全，也不能向 `List` 中添加任何类型的对象，理由同上。

    由于 `add` 的这个限制，使用了 `? extends` 泛型通配符的 `List`，只能够向外提供数据被消费，从这个角度来讲，向外提供数据的一方称为「生产者 Producer」。对应的还有一个概念叫「消费者 Consumer」，对应 Java 里面另一个泛型通配符 `? super`。

    ### Java 中的 `? super`

    ```java
    ☕️
         👇
    List<? super Button> buttons = new ArrayList<TextView>();
    
    ```

    这个 `? super` 叫做「下界通配符」，可以使 Java 泛型具有「逆变性 Contravariance」。

    > 与上界通配符对应，这里 super 限制了通配符 ? 的子类型，所以称之为下界。

    它也有两层意思：

    - 通配符 `?` 表示 `List` 的泛型类型是一个**未知类型**。
    - `super` 限制了这个未知类型的下界，也就是泛型类型必须满足这个 `super` 的限制条件。
      - `super` 我们在类的方法里面经常用到，这里的范围不仅包括 `Button` 的直接和间接父类，也包括下界 `Button` 本身。
      - `super` 同样支持 `interface`。

    上面的例子中，`TextView` 是 `Button` 的父类型 ，也就能够满足 `super` 的限制条件，就可以成功赋值了。

    根据刚才的描述，下面几种情况都是可以的：

    ```java
    ☕️
    List<? super Button> buttons = new ArrayList<Button>(); // 👈 本身
    List<? super Button> buttons = new ArrayList<TextView>(); // 👈 直接父类
    List<? super Button> buttons = new ArrayList<Object>(); // 👈 间接父类
    
    ```

    对于使用了下界通配符的 `List`，我们再看看它的 `get` 和 `add` 操作：

    ```java
    ☕️
    List<? super Button> buttons = new ArrayList<TextView>();
    Object object = buttons.get(0); // 👈 get 出来的是 Object 类型
    Button button = ...
    buttons.add(button); // 👈 add 操作是可以的
    
    ```

    解释下，首先 `?` 表示未知类型，编译器是不确定它的类型的。

    虽然不知道它的具体类型，不过在 Java 里任何对象都是 `Object` 的子类，所以这里能把它赋值给 `Object`。

    `Button` 对象一定是这个未知类型的子类型，根据多态的特性，这里通过 `add` 添加 `Button` 对象是合法的。

    使用下界通配符 `? super` 的泛型 `List`，只能读取到 `Object` 对象，一般没有什么实际的使用场景，通常也只拿它来添加数据，也就是消费已有的 `List`，往里面添加 `Button`，因此这种泛型类型声明称之为「消费者 Consumer」。

    ------

    小结下，Java 的泛型本身是不支持协变和逆变的。

    - 可以使用泛型通配符 `? extends` 来使泛型支持协变，但是「只能读取不能修改」，这里的修改仅指对泛型集合添加元素，如果是 `remove(int index)` 以及 `clear` 当然是可以的。
    - 可以使用泛型通配符 `? super` 来使泛型支持逆变，但是「只能修改不能读取」，这里说的不能读取是指不能按照泛型类型读取，你如果按照 `Object` 读出来再强转当然也是可以的。

    ### Kotlin 中的 `out` 和 `in`

    和 Java 泛型一样，Kolin 中的泛型本身也是不可变的。

    - 使用关键字 `out` 来支持协变，等同于 Java 中的上界通配符 `? extends`。
    - 使用关键字 `in` 来支持逆变，等同于 Java 中的下界通配符 `? super`。

    ```kotlin
    🏝️
    var textViews: List<out TextView>
    var textViews: List<in TextView>
    
    ```

    换了个写法，但作用是完全一样的。`out` 表示，我这个变量或者参数只用来输出，不用来输入，你只能读我不能写我；`in` 就反过来，表示它只用来输入，不用来输出，你只能写我不能读我。

    说了这么多 `List`，其实泛型在非集合类的使用也非常广泛，就以「生产者-消费者」为例子：

    ```kotlin
    🏝️
    class Producer<T> {
        fun produce(): T {
            ...
        }
    }
    
    val producer: Producer<out TextView> = Producer<Button>()
    val textView: TextView = producer.produce() // 👈 相当于 'List' 的 `get`
    
    ```

    ```kotlin
    🏝️            
    class Consumer<T> {
        fun consume(t: T) {
            ...
        }
    }
    
    val consumer: Consumer<in Button> = Consumer<TextView>()
    consumer.consume(Button(context))  // 👈 相当于 'List' 的 'add'
    
    ```

    在前面的例子中，在声明 `Producer` 的时候已经确定了泛型 `T` 只会作为输出来用，但是每次都需要在使用的时候加上 `out TextView` 来支持协变，写起来很麻烦。

    Kotlin 提供了另外一种写法：可以在声明类的时候，给泛型符号加上 `out` 关键字，表明泛型参数 `T` 只会用来输出，在使用的时候就不用额外加 `out` 了。

    ```kotlin
    🏝️             👇
    class Producer<out T> {
        fun produce(): T {
            ...
        }
    }
    
    val producer: Producer<TextView> = Producer<Button>() // 👈 这里不写 out 也不会报错
    val producer: Producer<out TextView> = Producer<Button>() // 👈 out 可以但没必要
    
    ```

    与 `out` 一样，可以在声明类的时候，给泛型参数加上 `in` 关键字，来表明这个泛型参数 `T` 只用来输入。

    ```kotlin
    🏝️            👇
    class Consumer<in T> {
        fun consume(t: T) {
            ...
        }
    }
    ​
    val consumer: Consumer<Button> = Consumer<TextView>() // 👈 这里不写 in 也不会报错
    val consumer: Consumer<in Button> = Consumer<TextView>() // 👈 in 可以但没必要
    
    ```

    ### `*` 号

    前面讲到了 Java 中单个 `?` 号也能作为泛型通配符使用，相当于 `? extends Object`。 它在 Kotlin 中有等效的写法：`*` 号，相当于 `out Any`。

    ```kotlin
    🏝️            👇
    var list: List<*>
    
    ```

    和 Java 不同的地方是，如果你的类型定义里已经有了 `out` 或者 `in`，那这个限制在变量声明时也依然在，不会被 `*` 号去掉。

    比如你的类型定义里是 `out T : Number` 的，那它加上 `<*>` 之后的效果就不是 `out Any`，而是 `out Number`。

    ### `where` 关键字

    Java 中声明类或接口的时候，可以使用 `extends` 来设置边界，将泛型类型参数限制为某个类型的子集：

    ```java
    ☕️                
    //                👇  T 的类型必须是 Animal 的子类型
    class Monster<T extends Animal>{
    }
    
    ```

    注意这个和前面讲的声明变量时的泛型类型声明是不同的东西，这里并没有 `?`。

    同时这个边界是可以设置多个，用 `&` 符号连接：

    ```java
    ☕️
    //                            👇  T 的类型必须同时是 Animal 和 Food 的子类型
    class Monster<T extends Animal & Food>{ 
    }
    
    ```

    Kotlin 只是把 `extends` 换成了 `:` 冒号。

    ```kotlin
    🏝️             👇
    class Monster<T : Animal>
    
    ```

    设置多个边界可以使用 `where` 关键字：

    ```kotlin
    🏝️                👇
    class Monster<T> where T : Animal, T : Food
    
    ```

    有人在看文档的时候觉得这个 `where` 是个新东西，其实虽然 Java 里没有 `where` ，但它并没有带来新功能，只是把一个老功能换了个新写法。

    不过笔者觉得 Kotlin 里 `where` 这样的写法可读性更符合英文里的语法，尤其是如果 `Monster` 本身还有继承的时候：

    ```kotlin
    🏝️
    class Monster<T> : MonsterParent<T>
        where T : Animal
    
    ```

    ### `reified` 关键字

    由于 Java 中的泛型存在类型擦除的情况，任何在运行时需要知道泛型确切类型信息的操作都没法用了。

    比如你不能检查一个对象是否为泛型类型 `T` 的实例：

    ```kotlin
    ☕️
    <T> void printIfTypeMatch(Object item) {
        if (item instanceof T) { // 👈 IDE 会提示错误，illegal generic type for instanceof
            System.out.println(item);
        }
    }
    
    ```

    Kotlin 里同样也不行：

    ```kotlin
    🏝️
    fun <T> printIfTypeMatch(item: Any) {
        if (item is T) { // 👈 IDE 会提示错误，Cannot check for instance of erased type: T
            println(item)
        }
    }
    
    ```

    这个问题，在 Java 中的解决方案通常是额外传递一个 `Class` 类型的参数，然后通过 `Class#isInstance` 

    方法来检查：

    ```java
    ☕️                             👇
    <T> void check(Object item, Class<T> type) {
        if (type.isInstance(item)) {
                   👆
            System.out.println(item);
        }
    }
    
    ```

    Kotlin 中同样可以这么解决，不过还有一个更方便的做法：使用关键字 `reified` 配合 `inline` 来解决：

    ```kotlin
    🏝️ 👇         👇
    inline fun <reified T> printIfTypeMatch(item: Any) {
        if (item is T) { // 👈 这里就不会在提示错误了
            println(item)
        }
    }
    
    ```

    ------

    1. Java 里的数组是支持协变的，而 Kotlin 中的数组 `Array` 不支持协变。

       这是因为在 Kotlin 中数组是用 `Array` 类来表示的，这个 `Array` 类使用泛型就和集合类一样，所以不支持协变。

    2. Java 中的 `List` 接口不支持协变，而 Kotlin 中的 `List` 接口支持协变。

       Java 中的 `List` 不支持协变，原因在上文已经讲过了，需要使用泛型通配符来解决。

       在 Kotlin 中，实际上 `MutableList` 接口才相当于 Java 的 `List`。Kotlin 中的 `List` 接口实现了只读操作，没有写操作，所以不会有类型安全上的问题，自然可以支持协变。

38. ### Kotlin 的协程

    ### 协程是什么

    > 从 Android 开发者的角度去理解它们的关系：
    >
    > - 我们所有的代码都是跑在线程中的，而线程是跑在进程中的。
    > - 协程没有直接和操作系统关联，但它不是空中楼阁，它也是跑在线程中的，可以是单线程，也可以是多线程。
    > - 单线程中的协程总的执行时间并不会比不用协程少。
    > - Android 系统上，如果在主线程进行网络请求，会抛出 `NetworkOnMainThreadException`，对于在主线程上的协程也不例外，这种场景使用协程还是要切线程的。
    >
    > 协程设计的初衷是为了解决并发问题，让 「协作式多任务」 实现起来更加方便。

    协程就是 Kotlin 提供的一套线程封装的 API，但并不是说协程就是为线程而生的。

    不过，我们学习 Kotlin 中的协程，一开始确实可以从线程控制的角度来切入。因为在 Kotlin 中，协程的一个典型的使用场景就是线程控制。就像 Java 中的 `Executor` 和 Android 中的 `AsyncTask`，Kotlin 中的协程也有对 Thread API 的封装，让我们可以在写代码时，不用关注多线程就能够很方便地写出并发操作。

    在 Java 中要实现并发操作通常需要开启一个 `Thread` ：

    ```java
    ☕️
    new Thread(new Runnable() {
        @Override
        public void run() {
            ...
        }
    }).start();
    
    ```

    Kotlin 中同样可以通过线程的方式去写：

    ```kotlin
    🏝️
    Thread({
        ...
    }).start()
    
    ```

    可以看到，和 Java 一样也摆脱不了直接使用 `Thead` 的那些困难和不方便：

    - 线程什么时候执行结束
    - 线程间的相互通信
    - 多个线程的管理

    我们可以用 Java 的 `Executor` 线程池来进行线程管理：

    ```kotlin
    🏝️
    val executor = Executors.newCachedThreadPool()
    executor.execute({
        ...
    })
    
    ```

    ------

    下面的例子是使用协程进行网络请求获取用户信息并显示到 UI 控件上：

    ```kotlin
    🏝️
    launch({
        val user = api.getUser() // 👈 网络请求（IO 线程）
        nameTv.text = user.name  // 👈 更新 UI（主线程）
    })
    
    ```

    这里只是展示了一个代码片段，`launch` 并不是一个顶层函数，它必须在一个对象中使用，我们之后再讲，这里只关心它内部业务逻辑的写法。

    `launch` 函数加上实现在 `{}` 中具体的逻辑，就构成了一个协程。

    通常我们做网络请求，要不就传一个 callback，要不就是在 IO 线程里进行阻塞式的同步调用，而在这段代码中，上下两个语句分别工作在两个线程里，但写法上看起来和普通的单线程代码一样。

    这里的 `api.getUser` 是一个**挂起函数**，所以能够保证 `nameTv.text` 的正确赋值.

    ### 协程好在哪

    在讲之前，我们需要先了解一下「闭包」这个概念，调用 Kotlin 协程中的 API，经常会用到闭包写法。

    其实闭包并不是 Kotlin 中的新概念，在 Java 8 中就已经支持。

    我们先以 `Thread` 为例，来看看什么是闭包：

    ```kotlin
    🏝️
    // 创建一个 Thread 的完整写法
    Thread(object : Runnable {
        override fun run() {
            ...
        }
    })
    ​
    // 满足 SAM，先简化为
    Thread({
        ...
    })
    ​
    // 使用闭包，再简化为
    Thread {
        ...
    }
    
    ```

    形如 `Thread {...}` 这样的结构中 `{}` 就是一个闭包。

    在 Kotlin 中有这样一个语法糖：当函数的最后一个参数是 lambda 表达式时，可以将 lambda 写在括号外。这就是它的闭包原则。

    在这里需要一个类型为 `Runnable` 的参数，而 `Runnable` 是一个接口，且只定义了一个函数 `run`，这种情况满足了 Kotlin 的 [SAM](https://medium.com/tompee/idiomatic-kotlin-lambdas-and-sam-constructors-fe2075965bfb)，可以转换成传递一个 lambda 表达式（第二段），因为是最后一个参数，根据闭包原则我们就可以直接写成 `Thread {...}`（第三段） 的形式。

    对于上文所使用的 `launch` 函数，可以通过闭包来进行简化 ：

    ```kotlin
    🏝️
    launch {
        ...
    }
    
    ```

    #### 基本使用

    前面提到，`launch` 函数不是顶层函数，是不能直接用的，可以使用下面三种方法来创建协程：

    ```kotlin
    🏝️
    // 方法一，使用 runBlocking 顶层函数
    runBlocking {
        getImage(imageId)
    }
    
    // 方法二，使用 GlobalScope 单例对象
    //            👇 可以直接调用 launch 开启协程
    GlobalScope.launch {
        getImage(imageId)
    }
    
    // 方法三，自行通过 CoroutineContext 创建一个 CoroutineScope 对象
    //                                    👇 需要一个类型为 CoroutineContext 的参数
    val coroutineScope = CoroutineScope(context)
    coroutineScope.launch {
        getImage(imageId)
    }
    
    ```

    - 方法一通常适用于单元测试的场景，而业务开发中不会用到这种方法，因为它是线程阻塞的。
    - 方法二和使用 `runBlocking` 的区别在于不会阻塞线程。但在 Android 开发中同样不推荐这种用法，因为它的生命周期会和 app 一致，且不能取消（什么是协程的取消后面的文章会讲）。
    - 方法三是比较推荐的使用方法，我们可以通过 `context` 参数去管理和控制协程的生命周期（这里的 `context` 和 Android 里的不是一个东西，是一个更通用的概念，会有一个 Android 平台的封装来配合使用）。

    协程最常用的功能是并发，而并发的典型场景就是多线程。可以使用 `Dispatchers.IO` 参数把任务切到 IO 线程执行：

    ```
    🏝️
    coroutineScope.launch(Dispatchers.IO) {
        ...
    }
    
    ```

    也可以使用 `Dispatchers.Main` 参数切换到主线程：

    ```kotlin
    🏝️
    coroutineScope.launch(Dispatchers.Main) {
        ...
    }
    
    ```

    所以在「协程是什么」一节中讲到的异步请求的例子完整写出来是这样的：

    ```kotlin
    🏝️
    coroutineScope.launch(Dispatchers.Main) {   // 在主线程开启协程
        val user = api.getUser() // IO 线程执行网络请求
        nameTv.text = user.name  // 主线程更新 UI
    }
    
    ```

    而通过 Java 实现以上逻辑，我们通常需要这样写：

    ```
    ☕️
    api.getUser(new Callback<User>() {
        @Override
        public void success(User user) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    nameTv.setText(user.name);
                }
            })
        }
        
        @Override
        public void failure(Exception e) {
            ...
        }
    });
    
    ```

    这种回调式的写法，打破了代码的顺序结构和完整性，读起来相当难受。

    #### 协程的「1 到 0」

    对于回调式的写法，如果并发场景再复杂一些，代码的嵌套可能会更多，这样的话维护起来就非常麻烦。但如果你使用了 Kotlin 协程，多层网络请求只需要这么写：

    ```kotlin
    🏝️
    coroutineScope.launch(Dispatchers.Main) {       // 开始协程：主线程
        val token = api.getToken()                  // 网络请求：IO 线程
        val user = api.getUser(token)               // 网络请求：IO 线程
        nameTv.text = user.name                     // 更新 UI：主线程
    }
    
    ```

    如果遇到的场景是多个网络请求需要等待所有请求结束之后再对 UI 进行更新。比如以下两个请求：

    ```kotlin
    🏝️
    api.getAvatar(user, callback)
    api.getCompanyLogo(user, callback)
    
    ```

    如果使用回调式的写法，那么代码可能写起来既困难又别扭。于是我们可能会选择妥协，通过先后请求代替同时请求：

    ```kotlin
    🏝️
    api.getAvatar(user) { avatar ->
        api.getCompanyLogo(user) { logo ->
            show(merge(avatar, logo))
        }
    }
    
    ```

    在实际开发中如果这样写，本来能够并行处理的请求被强制通过串行的方式去实现，可能会导致等待时间长了一倍，也就是性能差了一倍。

    而如果使用协程，可以直接把两个并行请求写成上下两行，最后再把结果进行合并即可：

    ```kotlin
    🏝️
    coroutineScope.launch(Dispatchers.Main) {
        //            👇  async 函数之后再讲
        val avatar = async { api.getAvatar(user) }    // 获取用户头像
        val logo = async { api.getCompanyLogo(user) } // 获取用户所在公司的 logo
        val merged = suspendingMerge(avatar, logo)    // 合并结果
        //                  👆
        show(merged) // 更新 UI
    }
    
    ```

    '可以看到，即便是比较复杂的并行网络请求，也能够通过协程写出结构清晰的代码。需要注意的是 `suspendingMerge` 并不是协程 API 中提供的方法，而是我们自定义的一个可「挂起」的结果合并方法。

    让复杂的并发代码，写起来变得简单且清晰，是协程的优势。

    这里，两个没有相关性的后台任务，因为用了协程，被安排得明明白白，互相之间配合得很好，也就是我们之前说的「协作式任务」。

    本来需要回调，现在直接没有回调了，这种从 1 到 0 的设计思想真的妙哉。


    Kotlin 协程是以官方扩展库的形式进行支持的。而且，我们所使用的「核心库」和 「平台库」的版本应该保持一致。

    - 核心库中包含的代码主要是协程的公共 API 部分。有了这一层公共代码，才使得协程在各个平台上的接口得到统一。
    - 平台库中包含的代码主要是协程框架在具体平台的具体实现方式。因为多线程在各个平台的实现方式是有所差异的。

    #### 开始使用协程

    协程最简单的使用方法，其实在前面章节就已经看到了。我们可以通过一个 `launch` 函数实现线程切换的功能：

    ```kotlin
    🏝️
    //               👇
    coroutineScope.launch(Dispatchers.IO) {
        ...
    }
    
    ```

    这个 `launch` 函数，它具体的含义是：我要创建一个新的协程，并在指定的线程上运行它。这个被创建、被运行的所谓「协程」是谁？就是你传给 `launch` 的那些代码，这一段连续代码叫做一个「协程」。

    所以，什么时候用协程？当你需要切线程或者指定线程的时候。你要在后台执行任务？切！

    ```kotlin
    🏝️
    launch(Dispatchers.IO) {
        val image = getImage(imageId)
    }
    
    ```

    然后需要在前台更新界面？再切！

    ```kotlin
    🏝️
    coroutineScope.launch(Dispatchers.IO) {
        val image = getImage(imageId)
        launch(Dispatch.Main) {
            avatarIv.setImageBitmap(image)
        }
    }
    
    ```

    好像有点不对劲？这不还是有嵌套嘛。

    如果只是使用 `launch` 函数，协程并不能比线程做更多的事。不过协程中却有一个很实用的函数：`withContext` 。这个函数可以切换到指定的线程，并在闭包内的逻辑执行结束之后，自动把线程切回去继续执行。那么可以将上面的代码写成这样：

    ```kotlin
    🏝️
    coroutineScope.launch(Dispatchers.Main) {      // 👈 在 UI 线程开始
        val image = withContext(Dispatchers.IO) {  // 👈 切换到 IO 线程，并在执行完成后切回 UI 线程
            getImage(imageId)                      // 👈 将会运行在 IO 线程
        }
        avatarIv.setImageBitmap(image)             // 👈 回到 UI 线程更新 UI
    } 
    
    ```

    这种写法看上去好像和刚才那种区别不大，但如果你需要频繁地进行线程切换，这种写法的优势就会体现出来。可以参考下面的对比：

    ```kotlin
    🏝️
    // 第一种写法
    coroutineScope.launch(Dispachers.IO) {
        ...
        launch(Dispachers.Main){
            ...
            launch(Dispachers.IO) {
                ...
                launch(Dispacher.Main) {
                    ...
                }
            }
        }
    }
    ​
    // 通过第二种写法来实现相同的逻辑
    coroutineScope.launch(Dispachers.Main) {
        ...
        withContext(Dispachers.IO) {
            ...
        }
        ...
        withContext(Dispachers.IO) {
            ...
        }
        ...
    }
    
    ```

    由于可以"自动切回来"，消除了并发代码在协作时的嵌套。由于消除了嵌套关系，我们甚至可以把 `withContext` 放进一个单独的函数里面：

    ```
    🏝️
    launch(Dispachers.Main) {              // 👈 在 UI 线程开始
        val image = getImage(imageId)
        avatarIv.setImageBitmap(image)     // 👈 执行结束后，自动切换回 UI 线程
    }
    //                               👇
    fun getImage(imageId: Int) = withContext(Dispatchers.IO) {
        ...
    }
    
    ```

    这就是之前说的「用同步的方式写异步的代码」了。

    不过如果只是这样写，编译器是会报错的：

    ```kotlin
    🏝️
    fun getImage(imageId: Int) = withContext(Dispatchers.IO) {
        // IDE 报错 Suspend function'withContext' should be called only from a coroutine or another suspend funcion
    }
    
    ```

    意思是说，`withContext` 是一个 `suspend` 函数，它需要在协程或者是另一个 `suspend` 函数中调用。

    ------

    大部分情况下，我们都是用 `launch` 函数来创建协程，其实还有其他两个函数也可以用来创建协程：

    - `runBlocking`
    - `async`

    `runBlocking` 通常适用于单元测试的场景，而业务开发中不会用到这个函数，因为它是线程阻塞的。

    接下来我们主要来对比 `launch` 与 `async` 这两个函数。

    - 相同点：它们都可以用来启动一个协程，返回的都是 `Coroutine`，我们这里不需要纠结具体是返回哪个类。
    - 不同点：`async` 返回的 `Coroutine` 多实现了 `Deferred` 接口。

    关于 `Deferred` 更深入的知识就不在这里过多阐述，它的意思就是延迟，也就是结果稍后才能拿到。

    我们调用 `Deferred.await()` 就可以得到结果了。

    接下来我们继续看看 `async` 是如何使用的

    ```kotlin
    🏝️
    
    coroutineScope.launch(Dispatchers.Main) {
        //                      👇  async 函数启动新的协程
        val avatar: Deferred = async { api.getAvatar(user) }    // 获取用户头像
        val logo: Deferred = async { api.getCompanyLogo(user) } // 获取用户所在公司的 logo
        //            👇          👇 获取返回值
        show(avatar.await(), logo.await())                     // 更新 UI
        
      }
        
    
    ```

    可以看到 avatar 和 logo 的类型可以声明为 `Deferred` ，通过 `await` 获取结果并且更新到 UI 上显示。

    `await` 函数签名如下：

    ```kotlin
    public suspend fun await(): T
    
    ```

39. ### suspend 「挂起」的本质

    > **挂起，就是一个稍后会被自动切回来的线程调度操作。**

    协程中「挂起」的对象到底是什么？挂起线程，还是挂起函数？都不对，**我们挂起的对象是协程。**

    还记得协程是什么吗？启动一个协程可以使用 `launch` 或者 `async` 函数，协程其实就是这两个函数中闭包的代码块。

    `launch` ，`async` 或者其他函数创建的协程，在执行到某一个 `suspend` 函数的时候，这个协程会被「suspend」，也就是被挂起。

    那此时又是从哪里挂起？**从当前线程挂起。换句话说，就是这个协程从正在执行它的线程上脱离。**

    注意，不是这个协程停下来了！是脱离，当前线程不再管这个协程要去做什么了。

    suspend 是有暂停的意思，但我们在协程中应该理解为：当线程执行到协程的 suspend 函数的时候，暂时不继续执行协程代码了。

    我们先让时间静止，然后兵分两路，分别看看这两个互相脱离的线程和协程接下来将会发生什么事情：

    **线程：**

    前面我们提到，挂起会让协程从正在执行它的线程上脱离，具体到代码其实是：

    协程的代码块中，线程执行到了 suspend 函数这里的时候，就暂时不再执行剩余的协程代码，跳出协程的代码块。

    那线程接下来会做什么呢？

    如果它是一个后台线程：

    - 要么无事可做，被系统回收
    - 要么继续执行别的后台任务

    跟 Java 线程池里的线程在工作结束之后是完全一样的：回收或者再利用。

    如果这个线程它是 Android 的主线程，那它接下来就会继续回去工作：也就是一秒钟 60 次的界面刷新任务。

    一个常见的场景是，获取一个图片，然后显示出来：

    ```kotlin
    🏝️
    // 主线程中
    GlobalScope.launch(Dispatchers.Main) {
      val image = suspendingGetImage(imageId)  // 获取图片
      avatarIv.setImageBitmap(image)           // 显示出来
    }
    suspend fun suspendingGetImage(id: String) = withContext(Dispatchers.IO) {
      ...
    }
    
    ```

    这段执行在主线程的协程，它实质上会往你的主线程 `post` 一个 `Runnable`，这个 `Runnable` 就是你的协程代码：

    ```kotlin
    🏝️
    handler.post {
      val image = suspendingGetImage(imageId)
      avatarIv.setImageBitmap(image)
    }
    
    ```

    当这个协程被挂起的时候，就是主线程 `post` 的这个 `Runnable` 提前结束，然后继续执行它界面刷新的任务。

    ------

    **协程：**

    线程的代码在到达 `suspend` 函数的时候被掐断，接下来协程会从这个 `suspend` 函数开始继续往下执行，不过是在**指定的线程**。

    谁指定的？是 `suspend` 函数指定的，比如我们这个例子中，函数内部的 `withContext` 传入的 `Dispatchers.IO` 所指定的 IO 线程。

    `Dispatchers` 调度器，它可以将协程限制在一个特定的线程执行，或者将它分派到一个线程池，或者让它不受限制地运行，关于 `Dispatchers` 这里先不展开了。

    那我们平日里常用到的调度器有哪些？

    常用的 `Dispatchers` ，有以下三种：

    - `Dispatchers.Main`：Android 中的主线程
    - `Dispatchers.IO`：针对磁盘和网络 IO 进行了优化，适合 IO 密集型的任务，比如：读写文件，操作数据库以及网络请求
    - `Dispatchers.Default`：适合 CPU 密集型的任务，比如计算

    回到我们的协程，它从 `suspend` 函数开始脱离启动它的线程，继续执行在 `Dispatchers` 所指定的 IO 线程。

    紧接着在 `suspend` 函数执行完成之后，协程为我们做的最爽的事就来了：会**自动帮我们把线程再切回来**。

    这个「切回来」是什么意思？

    我们的协程原本是运行在**主线程**的，当代码遇到 suspend 函数的时候，发生线程切换，根据 `Dispatchers` 切换到了 IO 线程；

    当这个函数执行完毕后，线程又切了回来，「切回来」也就是协程会帮我再 `post` 一个 `Runnable`，让我剩下的代码继续回到主线程去执行。

     

    我们从线程和协程的两个角度都分析完成后，终于可以对协程的「挂起」suspend 做一个解释：

    协程在执行到有 suspend 标记的函数的时候，会被 suspend 也就是被挂起，而所谓的被挂起，就是切个线程；

    不过区别在于，**挂起函数在执行完成之后，协程会重新切回它原先的线程**。

    再简单来讲，在 Kotlin 中所谓的挂起，就是**一个稍后会被自动切回来的线程调度操作**。

    >  这个「切回来」的动作，在 Kotlin 里叫做 [resume](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental/-continuation/resume.html)，恢复。

    通过刚才的分析我们知道：挂起之后是需要恢复。

    而恢复这个功能是协程的，如果你不在协程里面调用，恢复这个功能没法实现，所以也就回答了这个问题：为什么挂起函数必须在协程或者另一个挂起函数里被调用。

    再细想下这个逻辑：一个挂起函数要么在协程里被调用，要么在另一个挂起函数里被调用，那么它其实直接或者间接地，总是会在一个协程里被调用的。

    所以，要求 `suspend` 函数只能在协程里或者另一个 suspend 函数里被调用，还是为了要让协程能够在 `suspend` 函数切换线程之后再切回来。

    ------

    ####  怎么就「挂起」了？

    我们了解到了什么是「挂起」后，再接着看看这个「挂起」是怎么做到的。

    先随便写一个自定义的 `suspend` 函数：

    ```kotlin
    🏝️
    suspend fun suspendingPrint() {
      println("Thread: ${Thread.currentThread().name}")
     }
    
    I/System.out: Thread: main
    
    ```

    输出的结果还是在主线程。

    为什么没切换线程？因为它不知道往哪切，需要我们告诉它。

    对比之前例子中 `suspendingGetImage` 函数代码：

    ```kotlin
    🏝️
    //                                               👇
    suspend fun suspendingGetImage(id: String) = withContext(Dispatchers.IO) {
      ...
      
    }
    
    ```

    我们可以发现不同之处其实在于 `withContext` 函数。

    其实通过 `withContext` 源码可以知道，它本身就是一个挂起函数，它接收一个 `Dispatcher` 参数，依赖这个 `Dispatcher` 参数的指示，你的协程被挂起，然后切到别的线程。

    所以这个 `suspend`，其实并不是起到把任何把协程挂起，或者说切换线程的作用。

    真正挂起协程这件事，是 Kotlin 的协程框架帮我们做的。

    所以我们想要自己写一个挂起函数，仅仅只加上 `suspend` 关键字是不行的，还需要函数内部直接或间接地调用到 Kotlin 协程框架自带的 `suspend` 函数才行。

    ### suspend 的意义？

    这个 `suspend` 关键字，既然它并不是真正实现挂起，那它的作用是什么？

    **它其实是一个提醒。**

    函数的创建者对函数的使用者的提醒：我是一个耗时函数，我被我的创建者用挂起的方式放在后台运行，所以请在协程里调用我。

    为什么 `suspend` 关键字并没有实际去操作挂起，但 Kotlin 却把它提供出来？

    因为它本来就不是用来操作挂起的。

    挂起的操作 —— 也就是切线程，依赖的是挂起函数里面的实际代码，而不是这个关键字。

    所以这个关键字，**只是一个提醒**。

    还记得刚才我们尝试自定义挂起函数的方法吗？

    ```kotlin
    🏝️
    // 👇 redundant suspend modifier
    suspend fun suspendingPrint() {
      println("Thread: ${Thread.currentThread().name}")
    }
    
    ```

    如果你创建一个 `suspend` 函数但它内部不包含真正的挂起逻辑，编译器会给你一个提醒：`redundant suspend modifier`，告诉你这个 `suspend` 是多余的。

    因为你这个函数实质上并没有发生挂起，那你这个 `suspend` 关键字只有一个效果：就是限制这个函数只能在协程里被调用，如果在非协程的代码中调用，就会编译不通过。

    所以，创建一个 `suspend` 函数，为了让它包含真正挂起的逻辑，要在它内部直接或间接调用 Kotlin 自带的 `suspend` 函数，你的这个 `suspend` 才是有意义的。

    ### 怎么自定义 suspend 函数？

    在了解了 `suspend` 关键字的来龙去脉之后，我们就可以进入下一个话题了：怎么自定义 `suspend` 函数。

    这个「怎么自定义」其实分为两个问题：

    - 什么时候需要自定义 `suspend` 函数？
    - 具体该怎么写呢？

    #### 什么时候需要自定义 suspend 函数

    如果你的某个函数比较耗时，也就是要等的操作，那就把它写成 `suspend` 函数。这就是原则。

    耗时操作一般分为两类：I/O 操作和 CPU 计算工作。比如文件的读写、网络交互、图片的模糊处理，都是耗时的，通通可以把它们写进 `suspend` 函数里。

    另外这个「耗时」还有一种特殊情况，就是这件事本身做起来并不慢，但它需要等待，比如 5 秒钟之后再做这个操作。这种也是 `suspend` 函数的应用场景。

    #### 具体该怎么写

    给函数加上 `suspend` 关键字，然后在 `withContext` 把函数的内容包住就可以了。

    提到用 `withContext`是因为它在挂起函数里功能最简单直接：把线程自动切走和切回。

    当然并不是只有 `withContext` 这一个函数来辅助我们实现自定义的 `suspend` 函数，比如还有一个挂起函数叫 `delay`，它的作用是等待一段时间后再继续往下执行代码。

    使用它就可以实现刚才提到的等待类型的耗时操作：

    ```kotlin
    🏝️
    suspend fun suspendUntilDone() {
       while (!done) {
         delay(5)
       }
    }
    
    ```

40. ### 什么是「非阻塞式挂起」

    > - 协程就是个线程框架
    > - 协程的挂起本质就是线程切出去再切回来

    从语义上理解「非阻塞式挂起」，讲的是「非阻塞式」这个是挂起的一个特点，也就是说，协程的挂起，就是非阻塞式的，阻塞不阻塞，都是针对单线程讲的，一旦切了线程，肯定是非阻塞的，你都跑到别的线程了，之前的线程就自由了，可以继续做别的事情了。

    所以「非阻塞式挂起」，其实就是在讲协程在挂起的同时切线程这件事情。

    * 协程只是在写法上「看起来阻塞」，其实是「非阻塞」的，因为在协程里面它做了很多工作，其中有一个就是帮我们切线程。

    * 切线程先切过去，然后再切回来。
    * 线程虽然会切，但写法上和普通的单线程差不多。

    让我们来看看下面的例子：

    ```kotlin
    🏝️
    main {
        GlobalScope.launch(Dispatchers.Main) {
            // 👇 耗时操作
            val user = suspendingRequestUser()
            updateView(user)
        }
        
        private suspend fun suspendingRequestUser() : User = withContext(Dispatchers.IO) {
            api.requestUser()
        }
    }
    
    ```

    从上面的例子可以看到，耗时操作和更新 UI 的逻辑像写单线程一样放在了一起，只是在外面包了一层协程。

    而正是这个协程解决了原来我们单线程写法会卡线程这件事。

41. ### 协程与线程

    在 Kotlin 里，协程就是基于线程来实现的一种更上层的工具 API，类似于 Java 自带的 Executor 系列 API 或者 Android 的 Handler 系列 API。

    只不过呢，协程它不仅提供了方便的 API，在设计思想上是一个**基于线程的上层框架**，你可以理解为新造了一些概念用来帮助你更好地使用这些 API，仅此而已。

    就像 ReactiveX 一样，为了让你更好地使用各种操作符 API，新造了 Observable 等概念。

    说到这里，Kotlin 协程的三大疑问：协程是什么、挂起是什么、挂起的非阻塞式是怎么回事:

    - 协程就是切线程,基于线程来实现的一种更上层的工具 API；
    - 挂起就是可以自动切回来的切线程；
    - 挂起的非阻塞式指的是它能用看起来阻塞的代码写出非阻塞的操作

    

42. 

