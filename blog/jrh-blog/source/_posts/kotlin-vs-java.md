---
title: kotlin vs java
date: 2019-08-26 14:01:00
categories:
- kotlin
tags:
- kotlin
- java
- it
- android
---

1.  ***==***  & ***equals()***

   ``

   ```kotlin
   fun testEquals() {
       val aa = String(charArrayOf('b', 'o', 'o', 'k'))
       val bb = "book"
       println(bb == aa)
       //like java
       println(bb.equals(aa))
       // in java ==
       println(bb === aa)
   }
   ```

2. ***$*****字符串模板**

   > 1+2 = 3

   `

   kotlin

   ```kotlin
   fun testStringModel(){
       val aa = 1
       val bb = 2
       println("$aa+$bb=${aa+bb}")
   }
   ```

   `

   java

   `

   ```java
   int aa = 1;
   int bb = 2;
   System.out.println(aa+"+"+bb+"="+(aa+bb));
   ```

   `

3. **类**、**构造方法**、***data***

`

```kotlin
open class People(val name:String ,val age:Int)
data class Girl(private val gname: String,private val gage: Int):People(gname, gage)
data class Boy(private val gname: String,private val gage: Int):People(gname, gage)

fun testClass() {
    val lili = Girl("lili", 17)
    val jack = Boy("jack", 20)
    println(lili)
    println(jack)
    println(lili.name)
    println(jack.age)

    println(lili is People)
}

```

`

4. **空类型转换**

``

```kotlin
fun getName(): String? {
    return null
}
//1
fun testNull() {
    val name = getName()
    println(name?.length)
}
//2 ?: 
fun testNull() {
    val name = getName()?:return
    println(name.length)
    
}
```



5. ***is***  & ***instanceof***  **职能类型转换**

   kotlin

   `

   ```kotlin
   val c:People = Boy("tom",90)
   if (c is Boy)
       println(c.play())
   
    val child = jim as? Boy
       println(child)
   ```

   `

   java

   `

   ```java
   People people = new Boy("tom",90);
   if (people instanceof Boy){
       System.out.println(((Boy) people).play());
   }
   ```

   `

6. ***val var const***

   > val 运行期常量，不可以修改变量值
   >
   > var 变量，可以修改
   >
   > const val  编译期常量

7. **函数的简单写法**

`fun play() = "boy play"`

8. **lambda表达式**

`

```kotlin
args.forEach (::println)

args.forEach { println(it) }
```

`

9. **延迟初始化**

`

```kotlin
val jaa :Boy by lazy { 
    Boy("jaa",89)
}
```

`

10. **运算符重载**

``

```kotlin
data class Point(val x:Int,val y:Int){
    operator fun plus( other:Point):Point{
        return Point(x+other.x,y+other.y)
    }
}
fun testPlus(){
    var point = Point(1,3)
    var newPoint = Point(2,3)
    println(point+newPoint)
}
```

11. **中缀表达式** ***infix***

    ``

    ```kotlin
    data class Point(val x:Int,val y:Int){
        operator fun plus( other:Point):Point{
            return Point(x+other.x,y+other.y)
        }
        infix fun isDouble(p: Point):Boolean{
            return p.x-this.y>p.y-this.x
    
        }
    }
    fun testPlus(){
        var point = Point(1,3)
        var newPoint = Point(2,3)
        println(point+newPoint)
        println(point isDouble newPoint)
    }
    ```

12. ***when***

``

```kotlin
fun testWhen(){
    val x = 4
    when(x){
        is Int-> println()
        in 1..100-> println()
        !in 1..100 -> println()
        5-> println()
        else->{
            println()
        }
    }
}
```

13. ***for***

``

```kotlin

    for (arg in args){
       
    }
    for ((index,arg) in args.withIndex()){

    }
    for (arg in args.withIndex()){
        println("${arg.index}")
    }
    
```

14. **可变参数** ***vararg***   **默认参数**

``

```kotlin
@Test
fun testArgs(){
    var aa = intArrayOf(1,3,4,5,6,66)
    /**
     *   '*' 标记aa 可以将数组逐个传入
     * 1:位于可变参数前的参数，可以按照顺序传入
     * 2：位于可变参数后的参数，需要按命名参数传入
     */
    kprint(2,*aa,c="testargs")
}

/**
 * vararg: 可变参数
 * 1：可变参数的位置可以随意
 * 2: d 为默认参数
 */
fun kprint(a:Int,vararg b:Int,c:String,d:String="dd"){
    println(a)
    b.forEach(::println)
    println(c)
    println(d)
}
```



15. **接口**

``

```kotlin
interface People{
    /**
     * 子类需要实现
     */
    var name:String
    /**
     * 可以含有默认的实现方法，子类不需要实现
     */
    fun showName(){
        println(name)
    }

    /**
     * 子类实现
     */
    fun changeName(newName:String)
    
}

class Student(override var name: String) :People{
    override fun changeName(newName: String) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
}
```

16. **抽象类**

    > 默认的类和方法都是 ***final*** 的
    >
    > 子类要想继承父类，父类必须为***open*** ,或者 父类为***abstract***
    >
    > 子类要想重写父类的方法，父类中该方法必须为 ***open***，或者 ***abstract***
    >
    > 父类的变量也可以被重写

17. **代理** ***by***

    ``

    ```kotlin
    interface Dog{
        fun sayDog()
    }
    interface Cat{
        fun sayCat()
    }
    class RedDog:Dog{
        override fun sayDog() {
            println("redDog")
        }
    
    }
    
    class RedCat:Cat{
        override fun sayCat() {
            println("redCat")
        }
    
    }
    class Animal:Dog,Cat{
        override fun sayDog() {
        }
        override fun sayCat() {
        }
    }
    //by 关键字 代理
    class AiAnimal(var dog: Dog,var cat: Cat):Dog by dog,Cat by cat
    
    @Test
    fun testAiBy(){
        var aiAnimal = AiAnimal(RedDog(),RedCat())
        aiAnimal.sayDog()
        aiAnimal.sayCat()
    }
    ```

18. **类单继承，接口多实现&&函数名冲突**

    ``

    ```kotlin
    interface AA{
       fun show():Int = 1
    }
    interface BB{
        fun show():Int = 2
    }
    abstract class DD{
        open fun show()=3
    }
    //继承类 DD() 相当于继承DD的构造方法
    data class CC(var x:Int=10) :AA,BB,DD(){
    
        override fun show():Int {
            if (x>100){
               return super<AA>.show()
            }else if(x<90){
                return super<BB>.show()
            }else{
               return super<DD>.show()
            }
        }
    }
    
    @Test
    fun testDD(){
        println(CC(1000).show())
        println(CC(30).show())
        println(CC(99).show())
    }
    
    out:
    1
    2
    3
    ```



19.  ***internal*** **修饰符**

    > 模块内可见

20. ***object*** **单例的实现**

    ``

    ```kotlin
    abstract class Food
    interface  Drink{
        fun drink()
    }
    
    /**
     * Factory 只有一个实例
     */
    object Factory:Drink,Food(){
        override fun drink() {
            println("drink")
        }
        val num = 10
        fun createFood(){
            println("food")
        }
    }
    ```

    看一下反编译为Java代码的实现

    ``

    ```java
    // Factory.java
    import kotlin.Metadata;
    
    @Metadata(
       mv = {1, 1, 11},
       bv = {1, 0, 2},
       k = 1,
       d1 = {"\u0000 \n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\u0002\bÆ\u0002\u0018\u00002\u00020\u00012\u00020\u0002B\u0007\b\u0002¢\u0006\u0002\u0010\u0003J\u0006\u0010\b\u001a\u00020\tJ\b\u0010\n\u001a\u00020\tH\u0016R\u0014\u0010\u0004\u001a\u00020\u0005X\u0086D¢\u0006\b\n\u0000\u001a\u0004\b\u0006\u0010\u0007¨\u0006\u000b"},
       d2 = {"LFactory;", "LDrink;", "LFood;", "()V", "num", "", "getNum", "()I", "createFood", "", "drink", "test sources for module jrhlive_test"}
    )
    public final class Factory extends Food implements Drink {
       private static final int num = 10;
       public static final Factory INSTANCE;
    
       public void drink() {
          String var1 = "drink";
          System.out.println(var1);
       }
    
       public final int getNum() {
          return num;
       }
    
       public final void createFood() {
          String var1 = "food";
          System.out.println(var1);
       }
    
       static {
          Factory var0 = new Factory();
          INSTANCE = var0;
          num = 10;
       }
    }
    ```

21. **伴生对象 ，替代Java中static**

`

```kotlin
class UserUtil private constructor(var name:String){
    /**
     * 每个类可以定义一个伴生对象
     * 替代静态方法，静态变量
     * @JvmStatic 可以在Java中调用
     * @JvmFiled  可以标记变量供Java调用
     * @JvmOverloads 可以标记方法的重载供Java调用
     * const 标记的为编译期常量，可以被调用到
     *
     */
    companion object {
        const val TAG = "UserUtil"
        @JvmField
        var LABEL  ="label"
        @JvmStatic
        fun create(name:String):UserUtil{
            return UserUtil(name)
        }
    }
}


  @Test
    fun testCompaninon(){
        var userUtil =  UserUtil.create("user")
        println(userUtil.name)
        println(UserUtil.TAG)
        println(UserUtil.LABEL)
    }

out:
user
UserUtil
label

```

`

in java

``

```java
  @Test
    public void testUserUtil(){
        UserUtil userUtil = UserUtil.create("user");
        System.out.println(userUtil.getName());
        System.out.println(UserUtil.TAG);
        System.out.println(UserUtil.LABEL);
    }
```



22. **扩展属性**，**扩展方法**

`

```kotlin
fun String?.empty():Boolean{
    return null==this||""==this
}
//可以采用运算符重载
operator fun String.times(num:Int):String{
    val  sb = StringBuilder()
    for (i in 0 until num){
        sb.append(this)
    }
    return sb.toString()
}

var String.hot: String
    get() = "hot"
    set(value) {
    }


  @Test
    fun testExtends(){
        println("aaa".empty())
        println("aaa".times(3))
        println("abc"*5)
        var newaa = "aa".hot
        println(newaa)
    }

out:
false
aaaaaaaaa
abcabcabcabcabc
hot
```

`

use in java

``

```java
@Test
public void testExtends(){
  //KStringKt 为定义的类名
    System.out.println(KStringKt.times("aa", 2));
}
```



23. **属性代理** 

    > eg: lazy 第一次使用的时候进行初始化

    ``

    ```kotlin
    val hello by lazy {
        "hello world"
    }
    
    public actual fun <T> lazy(initializer: () -> T): Lazy<T> = SynchronizedLazyImpl(initializer)
    ```

24.  ***data*** 

    > 1：data 关键字，自动帮我们重写了 toString(),hashCode(),equals()等方法。
    >
    > 2：默认生成的类为 private final 修饰的类，所有不可以被子类继承：
    >
    > 如果想要修改的话，可以使用 noarg, allopen 两个插件，可以帮我们在运行时，创建无参的构造方法，去掉final 并修改为public。
    >
    > 3：所以被data修饰的Javabean 可能会出现无法构建，无法被实例化等问题。若有内部属性，要在构造方法中初始化。

25.  **内部类**

    > 1：*kotlin*的内部类，默认为静态内部类
    >
    > 2：可以用 *inner* 修饰，变为非静态内部类(可以通过*this@Outter.x*访问外部类的属性，内部类的属性可以用*this*)
    >
    > 3：可以用*object：Inner()*的方式实现一个匿名内部类

    ``

    ```kotlin
    class Outter {
        val a = 0
    
        inner class Inner {
            val a = 2
            fun hello() {
                // 通过 this@Outter 调用外部类的属性
                println(this@Outter.a)
                println(this.a)
                println(a)
            }
        }
    
        //通过 object 修饰的匿名内部类
        val onClickListener = object : OnClickListener {
            override fun onClick() {
            }
        }
    }
    
    interface OnClickListener {
        fun onClick()
    }
    
    
    @Test
    fun testInner(){
        val inner = Outter().Inner()
        inner.hello()
    }
    
    out:
    0
    2
    2
    ```

26.  ***enum class*** **定义枚举类**

    ``

    ```kotlin
    enum class Color(val id: Int) {
    
        GREEN(0), WHITE(1), BLACK(2);
    
        fun hello() {
            println("$name $id")
        }
    }
    
    @Test
    fun testEnum(){
       Color.values().forEach { it.hello() }
    }
    
    out:
    GREEN 0
    WHITE 1
    BLACK 2
    ```

27. ***sealed* *class* (密封类)**

    > 子类可数 
    >
    > enum class 实例可数
    >
    > 

28. **高阶函数**

    ``

    ```kotlin
    class PdfPrint{
        fun pp(any: Any){
            println(any)
        }
    }
    
    
        @Test
        fun testP(){
            var array: Array<String> = arrayOf("1","2")
            //函数引用  println
            array.forEach (::println)
            //isNotEmpty 为 String的扩展方法
            array.filter(String::isNotEmpty)
            //通过PdfPrint()实例调用
            array.forEach (PdfPrint()::pp)
        }
    
        /**
         * map 
         */
        @Test
        fun testList(){
    
            val list = listOf(1,2,3,4)
            var newList = list.map {
                it*2+3
            }
            var stringList = list.map {
                it.toString()+"s"
            }
            newList.forEach(::println)
            stringList.forEach(::println)
        }
    
    out:
    5
    7
    9
    11
    1s
    2s
    3s
    4s
    
    
        /**
         * flatmap,reduce(迭代)
         * flod(给予初始值)
         */
        @Test
        fun testFlatMap(){
            val list = listOf(
                    1..5,
                    3..5,
                    9..15
            )
            list.forEach(::println)
            println("*******************")
            val flatList = list.flatMap { it }
            flatList.forEach(::println)
            println("******************")
            val sum = flatList.reduce { acc, i ->acc+i }
            println(sum)
            println("**********")
            println((0..6).fold(StringBuilder()) { acc, i ->
                acc.append(i).append(",")
            })
    
            println((0..6).joinToString ("," ))
        }
    out:
    1..5
    3..5
    9..15
    *******************
    1
    2
    3
    4
    5
    3
    4
    5
    9
    10
    11
    12
    13
    14
    15
    ******************
    111
    **********
    0,1,2,3,4,5,6,
    0,1,2,3,4,5,6
    ```

29. ***?.let{}***  **目标对象不为空，则执行let内部的代码**  

    > *let*扩展函数的实际上是一个作用域函数，当你需要去定义一个变量在一个特定的作用域范围内，let函数的是一个不错的选择；let函数另一个作用就是可以避免写一些判断null的操作。

    object.let{
       it.todo()//在函数体内使用it替代object对象去访问其公有的属性和方法
       ...
    }

    //另一种用途 判断object为null的操作
    object?.let{//表示object不为null的条件下，才会去执行let函数体
       it.todo()

    }

    ###### 底层实现：

    ``

    ```kotlin
    /**
     * Calls the specified function [block] with `this` value as its argument and returns its result.
     */
    @kotlin.internal.InlineOnly
    public inline fun <T, R> T.let(block: (T) -> R): R {
        contract {
            callsInPlace(block, InvocationKind.EXACTLY_ONCE)
        }
        return block(this)
    }
    ```

    ######  使用场景:

    > **场景一:** 最常用的场景就是使用let函数处理需要针对一个可null的对象统一做判空处理。
    >
    > **场景二:** 然后就是需要去明确一个变量所处特定的作用域范围内可以使用

    ``

    ```kotlin
      val list  = mutableListOf<Int>(1,2,3,4,5)
      list?.let { println(it) }
    
    ```

30. ***with***

    > 它是将某对象作为函数的参数，在函数块内可以通过 this 指代该对象。返回值为函数块的最后一行或指定return表达式。

    `

    ```kotlin
        @Test
        fun testFun(){
            val list  = mutableListOf<Int>(1,2,3,4,5)
            with(list){
                add(0)
                add(4)
    
            }
            list.forEach(::println)
        }
    
    out:
    1
    2
    3
    4
    5
    0
    4
    ```

    `

    ###### 底层实现

    ``

    ```kotlin
    /**
     * Calls the specified function [block] with the given [receiver] as its receiver and returns its result.
     */
    @kotlin.internal.InlineOnly
    public inline fun <T, R> with(receiver: T, block: T.() -> R): R {
        contract {
            callsInPlace(block, InvocationKind.EXACTLY_ONCE)
        }
        return receiver.block()
    }
    ```

31. ***run***

    > run函数实际上可以说是let和with两个函数的结合体，run函数只接收一个lambda函数为参数，以闭包形式返回，返回值为最后一行的值或者指定的return的表达式。

    object.run{
    //todo
    }

    ###### 底层实现

    ``

    ```kotlin
    /**
     * Calls the specified function [block] with `this` value as its receiver and returns its result.
     */
    @kotlin.internal.InlineOnly
    public inline fun <T, R> T.run(block: T.() -> R): R {
        contract {
            callsInPlace(block, InvocationKind.EXACTLY_ONCE)
        }
        return block()
    }
    ```

    ``

    ```kotlin
    @Test
    fun testFun(){
        val list  = mutableListOf<Int>(1,2,3,4,5)
        val newlist = list.run {
            map {
                 it+2
            }
        }
        newlist.forEach(::println)
    }
    
    out:
    3
    4
    5
    6
    7
    ```

32. ***apply***

    > 从结构上来看apply函数和run函数很像，唯一不同点就是它们各自返回的值不一样，run函数是以闭包形式返回最后一行代码的值，而apply函数的返回的是传入对象的本身。

    ###### 底层实现

    ``

    ```kotlin
    /**
     * Calls the specified function [block] with `this` value as its receiver and returns `this` value.
     */
    @kotlin.internal.InlineOnly
    public inline fun <T> T.apply(block: T.() -> Unit): T {
        contract {
            callsInPlace(block, InvocationKind.EXACTLY_ONCE)
        }
        block()
        return this
    }
    ```

    ``

    ```kotlin
    @Test
    fun testApply(){
      val  sb =  StringBuilder ()
        println(sb.apply {
            append("hello")
            append("world")
        }.toString())
    
    }
    
    out:
    
    helloworld
    ```

33. ***also***

    > also函数的结构实际上和let很像唯一的区别就是返回值的不一样，let是以闭包的形式返回，返回函数体内最后一行的值，如果最后一行为空就返回一个Unit类型的默认值。而also函数返回的则是传入对象的本身.

    ###### 底层实现

    ``

    ```kotlin
    /**
     * Calls the specified function [block] with `this` value as its argument and returns `this` value.
     */
    @kotlin.internal.InlineOnly
    @SinceKotlin("1.1")
    public inline fun <T> T.also(block: (T) -> Unit): T {
        contract {
            callsInPlace(block, InvocationKind.EXACTLY_ONCE)
        }
        block(this)
        return this
    }
    ```

    ``

    ```kotlin
    @Test
    fun testAlso() {
        val sb = StringBuilder()
       var rest =  sb.also {
            it.append("hello")
            it.append("world")
            it.toString()
        }
    
        println(rest)
    }
    
    out:
    helloworld
    ```

    ##### let ,apply,with,also,run使用

    ![apply&&also&&let](/Users/jiarh/project/personWrite/kotlin/imgs/apply&&also&&let.png)

34. ***infix*** **中缀表达式**

    > 在算术表达式中，运算符位于两个操作数中间的表达式称为**中缀表达式**

35. **复合函数**

    ``

    ```kotlin
    import org.junit.Test
    
    class Kinfix {
    
        //m(x) = f(g(x)) 复合函数
        val plus5 = { i: Int -> i + 5 } //g(x)
        val multiply2 = { i: Int -> i * 2 } //f(x)
    
        /**
         * P1 参数1
         * P2 参数2
         * R 返回值
         *
         *
         */
    //    /** A function that takes 1 argument. */
    //    public interface Function1<in P1, out R> : Function<R> {
    //        public operator fun invoke(p1: P1): R
    //    }                                    
        
        //                    g(x)      within               f(x)
        infix fun <P1,P2,R> Function1<P1,P2>.within(function: Function1<P2,R>):Function1<P1,R>{
            return fun(p1:P1):R{
                //f(x)--> x = g(x)  
                //function --> f()
                // this --> g()
                // p1 = x
                
                return function.invoke(this.invoke(p1))
            }
        }
    
        infix fun <P1,P2,R> Function1<P2,R>.compose(function: Function1<P1,P2>):Function1<P1,R>{
            return fun(p1:P1):R{
                return this.invoke(function.invoke(p1))
            }
        }
    
        @Test
        fun testInFix() {
            println(multiply2(plus5(5))) //(5+5)*2 = 20
    
            val plus5AndMultiply2 = plus5 within multiply2 //f(g(x))
            println(plus5AndMultiply2(5))
    
            val multiply2AndPlus5 = plus5 compose multiply2//g(f(x))
            println(multiply2AndPlus5(5))
        }
    }
    
    out:
    
    20
    20
    15
    ```

36. **DSL**

37. **协程** ***coroutine***

    [kotlinx.couroutine学习](https://github.com/haoyubihai/kotlinx.coroutines)

38. ***anko*** **库的使用**

    [anko in github](https://github.com/Kotlin/anko)

39. 