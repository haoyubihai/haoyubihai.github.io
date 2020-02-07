---
title: hashCode&&equals
date: 2018-07-20 19:20:24
categories:
- [java]
tags:
- java
---

## hashCode && equals

1. `hashCode`的存在主要用于查找的快捷性，如`Hashtable`，`HashMap`等，`hashCode`是用来在散列存储结构中确定对象的存储地址的。

2. 如果两个对象相同，就是适用于equals(java.lang.Object) 方法，那么这两个对象的hashCode一定要相同。

3. 如果对象的equals方法被重写，那么对象的hashCode也尽量重写，并且产生hashCode使用的对象，一定要和equals方法中使用的一致，否则就会违反上面提到的第2点。

   <!--more-->

4. 两个对象的hashCode相同，并不一定表示两个对象就相同，也就是不一定适用于equals(java.lang.Object) 方法，只能够说明这两个对象在散列存储结构中，如Hashtable，他们“存放在同一个篮子里”。

   ```java
   1.hashcode是用来查找的，如果你学过数据结构就应该知道，在查找和排序这一章有  
   例如内存中有这样的位置  
   0  1  2  3  4  5  6  7    
   而我有个类，这个类有个字段叫ID,我要把这个类存放在以上8个位置之一，
   如果不用hashcode而任意存放，那么当查找时就需要到这八个位置里挨个去找，或者用二分法一类的算法。  
   但如果用hashcode那就会使效率提高很多。  
   我们这个类中有个字段叫ID,那么我们就定义我们的hashcode为ID％8，
   然后把我们的类存放在取得得余数那个位置。比如我们的ID为9，
   9除8的余数为1，那么我们就把该类存在1这个位置，
   如果ID是13，求得的余数是5，那么我们就把该类放在5这个位置。
   这样，以后在查找该类时就可以通过ID除 8求余数直接找到存放的位置了。  
     
   2.但是如果两个类有相同的hashcode怎么办那（我们假设上面的类的ID不是唯一的），
   例如9除以8和17除以8的余数都是1，那么这是不是合法的，
   回答是：可以这样。那么如何判断呢？在这个时候就需要定义 equals了。  
   也就是说，我们先通过 hashcode来判断两个类是否存放某个桶里，
   但这个桶里可能有很多类，那么我们就需要再通过 equals 来在这个桶里找到我们要的类。  
   那么。重写了equals()，为什么还要重写hashCode()呢？  
   想想，你要在一个桶里找东西，你必须先要找到这个桶啊，
   你不通过重写hashcode()来找到桶，光重写equals()有什么用啊  
   ```

   ```java
   package java.lang;
   
   public class Object {
   ·······
   
       /**
        * 返回该对象的哈希码值。
        * 支持此方法是为了提高哈希表（例如 java.util.Hashtable 提供的哈希表）的性能
        * {@link java.util.HashMap}.
        * <p>
        * hashCode 的常规协定是:
        * <ul>
        * <li>在 Java 应用程序执行期间，在对同一对象多次调用 hashCode 方法时，
        *     必须一致地返回相同的整数，前提是将对象进行 equals 比较时所用的信息没有被修改。
        *     从某一应用程序的一次执行到同一应用程序的另一次执行，该整数无需保持一致。
        * <li>如果根据 equals(Object) 方法，两个对象是相等的，
        *     那么对这两个对象中的每个对象调用 hashCode 方法都必须生成相同的整数结果。
        * <li>如果根据 equals(java.lang.Object) 方法，两个对象不相等，
        *     那么对这两个对象中的任一对象上调用 hashCode 方法不 要求一定生成不同的整数结果。
        *     但是，程序员应该意识到，为不相等的对象生成不同整数结果可以提高哈希表的性能。
        * </ul>
        * <p>
        * 实际上，由 Object 类定义的 hashCode 方法确实会针对不同的对象返回不同的整数。
        * （这一般是通过将该对象的内部地址转换成一个整数来实现的，
        * 但是 JavaTM 编程语言不需要这种实现技巧。）
        *
        * @return  此对象的一个哈希码值。
        * @see     java.lang.Object#equals(java.lang.Object)
        * @see     java.lang.System#identityHashCode
        */
       public native int hashCode();
   ·······
   }
   ```

5. 对`equals(Object obj)`方法的理解，它和 `==` 操作符相比，有什么区别？

   * `==` 操作符分为两种情况
     * 比较基础类型（byte,short,int,long,float,double,char,boolean）时，比较的是值是否相等
     * 比较对象，比较的是对象在内存中的空间地址是否相等。
   * `equals(Object obj)`方法比较也分为两种情况
     * 如果一个类没有重写`equals(Object obj)`方法，则等价于通过`==`比较两个对象，即比较的是对象在内存中的空间地址是否相等。
     * 如果重写了`equals(Object obj)`方法，则根据重写的方法内容去比较相等，返回`true`则相等，`false`则不相等。

6. 如何重写`equals(Object obj)`方法，重写的过程需要注意什么？

   * 自反性：对于非 null 的对象 x，必须有 x.equals(x)=true；
   * 对称性：如果 x.equals(y)=true，那么 y.equals(x) 必须也为true；
   * 传递性：如果 x.equals(y)=true 而且 y.equals(z)=true，那么x.equals(z) 必须为true；
   * 对于非 null 的对象 x，一定有x.equals(null)=false
   * 当`equals(Object obj)`方法被重写时，通常有必要重写 hashCode 方法，以维护 hashCode 方法的常规协定，该协定声明相等对象必须具有相等的哈希码。

   

   重写`equals(Object obj)`

   * 先使用 `==` 操作符判断两个对象的引用地址是否相同。
   * 使用`instanceof`来判断 两个对象的类型是否一致。
   * 如果类型相同，则把待比较参数转型，逐一比较两个对象内部的值是否一致，全部一致才返回`true`,否则返回`false`。
   * 重写`hashCode`方法，确保相等的两个对象必须具有相等的哈希码.
     * 我们在重写一个类的`hashCode`方法时，最好是将所有用于相等性检查的字段都进行`hashCode`计算，最后将所有`hashCode`值相加，得出最终的`hashCode`，这样可以保证hashCode生成均匀，不容易产生碰撞。

   

   

7. 如果需要您去维护一个类的hash散列表，如何设计，如何解决hash冲突？

   我们在设计类的hash散列表时，不能保证每个元素的hash值都是不一样的，这样就会造成hash冲突。解决hash冲突有如下4种方法：

   * 开发定址法：既然当前位置容不下冲突的元素了，那就再找一个空的位置存储 Hash 冲突的值（当前 index 冲突了，那么将冲突的元素放在 index+1)
   * 再散列法：换一个 Hash 算法再计算一个 hash 值，如果不冲突了就存储值（例如第一个算法是名字的首字母的 Hash 值，如果冲突了，计算名字的第二个字母的 Hash 值，如果冲突解决了则将值放入数组中）
   * 链地址法：每个数组中都存有一个单链表，发生 Hash 冲突时，只是将冲突的 value 当作新节点插入到链表（HashMap 解决冲突的办法）
   * 公共溢出区法：将冲突的 value 都存到另外一个顺序表中，查找时如果当前表没有对应值，则去溢出区进行顺序查找。

   

   

## 总结

* 当你真要的需要重写`equals`方法，这两点一定要记住：
  * 如果两个对象相等（equals() 返回 true），那么它们的 hashCode()一定要相同
  * 如果两个对象hashCode()相等，它们并不一定相等（equals() 不一定返回 true）

* 如果重写的`equals`方法但不重写`hashCode`，都是耍流氓，会有意想不到的结果。
* 重写`hashCode`方法时，尽可能将所有用于相等比较的参数都参与hashCode的计算。
* 建立hash散列表的意义就是在于，提高查询效率，当数据量大时，尤为显著。



参考文章：
 [Java中hashCode的作用](https://link.jianshu.com?t=http://blog.csdn.net/fenglibing/article/details/8905007)
 [如何正确实现 Java 中的 HashCode](https://link.jianshu.com?t=https://www.oschina.net/translate/how-to-implement-javas-hashcode-correctly?lang=chs&p=1)
 [Java 的 equals 与 hashcode 对比分析](https://link.jianshu.com?t=http://wingjay.com/2017/03/29/Java的equals与hashcode对比分析/)
 [程序员必须搞清的概念equals和=和hashcode的区别](https://link.jianshu.com?t=https://juejin.im/post/584ac23061ff4b0058d5250f)
 [Android 面试准备之「equals 和 == 」](https://link.jianshu.com?t=https://androidzzt.github.io/2017/03/28/Android-面试准备之「equals-和-」/)



作者：liangzzz
链接：https://www.jianshu.com/p/ce3dbf5f027d
来源：简书