---
title: ArrayList使用笔记
date: 2019-10-02 11:08:08
categories:
- [java]
- [android]
- [集合框架]
tags:
- java
- android
---

## Arraylist

1. Arraylist 就是数组列表

2. 当我们转载的是基本数据int,long,byte,boolean,float,double,char,short的时候，只能存储他们对应的包装类。

3. 底层实现主要是  transient Object[] elementData;

   >  Java语言的关键字，变量修饰符，如果用**transient**声明一个实例变量，当对象存储时，它的值不需要维持。换句话来说就是，用**transient**关键字标记的成员变量不参与序列化过程。

   <!--more-->

4. 和LinkedList相比，它查找和访问元素的速度比较快，但是新增，删除的速度比较慢。

5. Arraylist 底层是通过数组实现的。 可以通过构造方法在初始化的时候指定底层数组的大小。

   * 通过无参构造方法的方式`ArrayList()`初始化，则赋值底层数组`Object[] elementData`为一个默认空数组`Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {}`所以数组容量为0，只有真正对数据进行添加`add`时，才分配默认`DEFAULT_CAPACITY = 10`的初始容量。

     ```java
     /**
      * Default initial capacity.
      */
     private static final int DEFAULT_CAPACITY = 10;
     
     /**
      * Shared empty array instance used for empty instances.
      */
     private static final Object[] EMPTY_ELEMENTDATA = {};
     
     /**
      * Shared empty array instance used for default sized empty instances. We
      * distinguish this from EMPTY_ELEMENTDATA to know how much to inflate when
      * first element is added.
      */
     private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
     
     /**
      * The array buffer into which the elements of the ArrayList are stored.
      * The capacity of the ArrayList is the length of this array buffer. Any
      * empty ArrayList with elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA
      * will be expanded to DEFAULT_CAPACITY when the first element is added.
      */
     // Android-note: Also accessed from java.util.Collections
     transient Object[] elementData; // non-private to simplify nested class access
     
         /**
          * Constructs an empty list with the specified initial capacity.
          *
          * @param  initialCapacity  the initial capacity of the list
          * @throws IllegalArgumentException if the specified initial capacity
          *         is negative
          */
         public ArrayList(int initialCapacity) {
             if (initialCapacity > 0) {
                 this.elementData = new Object[initialCapacity];
             } else if (initialCapacity == 0) {
                 this.elementData = EMPTY_ELEMENTDATA;
             } else {
                 throw new IllegalArgumentException("Illegal Capacity: "+
                                                    initialCapacity);
             }
         }
     
         /**
          * Constructs an empty list with an initial capacity of ten.
          */
         public ArrayList() {
             this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
         }
     
     ```

   * 当我们添加的元素数量已经达到底层数组`Object[] elementData`的上限时，我们再往ArrayList元素，则会触发ArrayList的自动扩容机制，ArrayList会通过位运算`int newCapacity = oldCapacity + (oldCapacity >> 1);`以1.5倍的方式初始化一个新的数组（如初始化数组大小为10，则扩容后的数组大小为15），然后使用`Arrays.copyOf(elementData, newCapacity);`方法将原数据的数据逐一复制到新数组上面去，以此达到ArrayList扩容的效果。虽然，`Arrays.copyOf(elementData, newCapacity);`方法最终调用的是`native void arraycopy(Object src, int srcPos, Object dest, int destPos, int length)`是一个底层方法，效率还算可以，但如果我们在知道ArrayList想装多少个元素的情况下，却没有指定容器大小，则就会导致ArrayList频繁触发扩容机制，频繁进行底层数组之间的数据复制，大大降低使用效率。

     ```java
     public boolean add(E e) {
         ensureCapacityInternal(size + 1);  // Increments modCount!!
         elementData[size++] = e;
         return true;
     }
     
         private void ensureCapacityInternal(int minCapacity) {
             if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
                 minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity);
             }
     
             ensureExplicitCapacity(minCapacity);
         }
     
         private void ensureExplicitCapacity(int minCapacity) {
             modCount++;
     
             // 容量不足，调用grow方法扩容
             if (minCapacity - elementData.length > 0)
                 grow(minCapacity);
         }
     
     
         //最大容量限制 OutOfMemoryError: Requested array size exceeds VM limit
         private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
         /**
          * Increases the capacity to ensure that it can hold at least the
          * number of elements specified by the minimum capacity argument.
          *
          * @param minCapacity the desired minimum capacity
          */
         private void grow(int minCapacity) {
             // 获取原容量的大小
             int oldCapacity = elementData.length;
           // 在原容量的基础上扩容1.5倍
             int newCapacity = oldCapacity + (oldCapacity >> 1);
           // 再判断新容量是否已足够，如果扩容后仍然不足够，则复制为最小容量长度
             if (newCapacity - minCapacity < 0)
                 newCapacity = minCapacity;
           // 判断是否超过最大长度限制
             if (newCapacity - MAX_ARRAY_SIZE > 0)
                 newCapacity = hugeCapacity(minCapacity);
             // 将原数组的数据复制至新数组， ArrayList的底层数组引用指向新数组
             // 如果数据量很大，重复扩容，则会影响效率
             elementData = Arrays.copyOf(elementData, newCapacity);
         }
     
        private static int hugeCapacity(int minCapacity) {
             if (minCapacity < 0) // overflow
                 throw new OutOfMemoryError();
             return (minCapacity > MAX_ARRAY_SIZE) ?
                 Integer.MAX_VALUE :
                 MAX_ARRAY_SIZE;
         }
     
     ```

   * 因此，在我们使用ArrayList的时候，如果知道最终的存储容量capacity，则应该在初始化的时候就指定ArrayList的容量`ArrayList(int initialCapacity)`，如果初始化时无法预知装载容量，但在使用过程中，得知最终容量，我们可以通过调用`ensureCapacity(int minCapacity)`方法来指定ArrayList的容量，并且，如果我们在使用途中，如果确定容量大小，但是由于之前每次扩容都扩充50%，所以会造成一定的存储空间浪费，我们可以调用`trimToSize()`方法将容器最小化到存储元素容量，进而消除这些存储空间浪费。例如：我们当前存储了11个元素，我们不会再添加但是当前的ArrayList的大小为15，有4个存储空间没有被使用，则调用`trimToSize()`方法后，则会重新创建一个容量为11的数组`Object[] elementData`，将原有的11个元素复制至新数组，达到节省内存空间的效果。

     ```java
     /**
      * Increases the capacity of this <tt>ArrayList</tt> instance, if
      * necessary, to ensure that it can hold at least the number of elements
      * specified by the minimum capacity argument.
      *
      * @param   minCapacity   the desired minimum capacity
      */
     public void ensureCapacity(int minCapacity) {
         int minExpand = (elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA)
             // any size if not default element table
             ? 0
             // larger than default for default empty table. It's already
             // supposed to be at default size.
             : DEFAULT_CAPACITY;
     
         if (minCapacity > minExpand) {
             ensureExplicitCapacity(minCapacity);
         }
     }
     
        /**
          * Trims the capacity of this <tt>ArrayList</tt> instance to be the
          * list's current size.  An application can use this operation to minimize
          * the storage of an <tt>ArrayList</tt> instance.
          */
         public void trimToSize() {
             modCount++;
             if (size < elementData.length) {
                 elementData = (size == 0)
                   ? EMPTY_ELEMENTDATA
                   : Arrays.copyOf(elementData, size);
             }
         }
     ```

     

6. ArrayList访问元素速度较快，但是新增和删除的速度较慢，为什么呢？

   * 通过源码我们可以得知，ArrayList删除元素时，先获取对应的删除元素，然后把要删除元素对应索引index后的元素逐一往前移动1位，最后将最后一个存储元素清空并返回删除元素，以此达到删除元素的效果

   * 当我们通过下标的方式去访问元素时，我们假设访问一个元素所花费的时间为K，则通过下标一步到位的方式访问元素，时间则为1K，用“大O”表示法表示，则时间复杂度为O(1)。所以ArrayList的访问数据的数据是比较快的。

   * 当我们去添加元素`add(E e)`时，我们是把元素添加至末尾，不需要移动元素，此时的时间复杂度为O(1)，但我们把元素添加到指定位置，最坏情况下，我们将元素添加至第一个位置`add(int index, E element)`，则整个ArrayList的n-1个元素都要往前移动位置，导致底层数组发生n-1次复制。通常情况下，我们说的时间复杂度都是按最坏情况度量的，此时的时间复杂度为O(n)。删除元素同理，删除最后一个元素不需要移动元素，时间复杂度为O(1)，但删除第一个元素，则需要移动n-1个元素，最坏情况下的时间复杂度也是O(n)。

     ```java
         /**
          * 将元素添加至末尾
          */
         public boolean add(E e) {
             // 确保底层数组容量，如果容量不足，则扩容
             ensureCapacityInternal(size + 1);  // Increments modCount!!
             elementData[size++] = e;
             return true;
         }
     
         /**
          * 将元素添加至指定下标位置
          */
         public void add(int index, E element) {
              // 检查下标是否在合法范围内
             rangeCheckForAdd(index);
             // 确保底层数组容量，如果容量不足，则扩容
             ensureCapacityInternal(size + 1);  // Increments modCount!!
             // 将要添加的元素下标后的元素通过复制的方式逐一往后移动，腾出对应index下标的存储位置
             System.arraycopy(elementData, index, elementData, index + 1,
                              size - index);
             // 将新增元素存储至指定下标索引index
             elementData[index] = element;
             // ArrayList的大小 + 1
             size++;
         }
     
         /**
          * 通过下标索引的方式删除元素
          */
         public E remove(int index) {
             // 检查下标是否在合法范围内
             rangeCheck(index);
     
             modCount++;
             // 直接通过下标去访问底层数组的元素
             E oldValue = elementData(index);
     
             // 计算数组需要移动的元素个数
             int numMoved = size - index - 1;
             if (numMoved > 0)
                 // 将要删除的元素下标后的元素通过复制的方式逐一往前移动
                 System.arraycopy(elementData, index+1, elementData, index, numMoved);
             //将底层数组长度减1，并清空最后一个存储元素。
             elementData[--size] = null; // clear to let GC do its work
             // 返回移除元素
             return oldValue;
         }
     ```

   7. ArrayList不是线程安全的。如果多个线程同时对同一个ArrayList更改数据的话，会导致数据不一致或者数据污染。如果出现线程不安全的操作时，ArrayList会尽可能的抛出`ConcurrentModificationException`防止数据异常，当我们在对一个ArrayList进行遍历时，在遍历期间，我们是不能对ArrayList进行添加，修改，删除等更改数据的操作的，否则也会抛出`ConcurrentModificationException`异常，此为fail-fast（快速失败）机制。从源码上分析，我们在`add,remove,clear`等更改ArrayList数据时，都会导致modCount的改变，当`expectedModCount != modCount`时，则抛出`ConcurrentModificationException`。如果想要线程安全，可以考虑使用Vector、CopyOnWriteArrayList。

      ```java
      /**
       * An optimized version of AbstractList.Itr
       */
      private class Itr implements Iterator<E> {
          // Android-changed: Add "limit" field to detect end of iteration.
          // The "limit" of this iterator. This is the size of the list at the time the
          // iterator was created. Adding & removing elements will invalidate the iteration
          // anyway (and cause next() to throw) so saving this value will guarantee that the
          // value of hasNext() remains stable and won't flap between true and false when elements
          // are added and removed from the list.
          protected int limit = ArrayList.this.size;
      
          int cursor;       // index of next element to return
          int lastRet = -1; // index of last element returned; -1 if no such
          int expectedModCount = modCount;
      
          public boolean hasNext() {
              return cursor < limit;
          }
      
          @SuppressWarnings("unchecked")
          public E next() {
              if (modCount != expectedModCount)
                  throw new ConcurrentModificationException();
              int i = cursor;
              if (i >= limit)
                  throw new NoSuchElementException();
              Object[] elementData = ArrayList.this.elementData;
              if (i >= elementData.length)
                  throw new ConcurrentModificationException();
              cursor = i + 1;
              return (E) elementData[lastRet = i];
          }
      
          public void remove() {
              if (lastRet < 0)
                  throw new IllegalStateException();
              if (modCount != expectedModCount)
                  throw new ConcurrentModificationException();
      
              try {
                  ArrayList.this.remove(lastRet);
                  cursor = lastRet;
                  lastRet = -1;
                  expectedModCount = modCount;
                  limit--;
              } catch (IndexOutOfBoundsException ex) {
                  throw new ConcurrentModificationException();
              }
          }
      
          @Override
          @SuppressWarnings("unchecked")
          public void forEachRemaining(Consumer<? super E> consumer) {
              Objects.requireNonNull(consumer);
              final int size = ArrayList.this.size;
              int i = cursor;
              if (i >= size) {
                  return;
              }
              final Object[] elementData = ArrayList.this.elementData;
              if (i >= elementData.length) {
                  throw new ConcurrentModificationException();
              }
              while (i != size && modCount == expectedModCount) {
                  consumer.accept((E) elementData[i++]);
              }
              // update once at end of iteration to reduce heap write traffic
              cursor = i;
              lastRet = i - 1;
      
              if (modCount != expectedModCount)
                  throw new ConcurrentModificationException();
          }
      }
      ```

      ```java
      public void add(int index, E e) {
          if (index < 0 || index > this.size)
              throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
          if (ArrayList.this.modCount != this.modCount)
              throw new ConcurrentModificationException();
          parent.add(parentOffset + index, e);
          this.modCount = parent.modCount;
          this.size++;
      }
      
      public E remove(int index) {
          if (index < 0 || index >= this.size)
              throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
          if (ArrayList.this.modCount != this.modCount)
              throw new ConcurrentModificationException();
          E result = parent.remove(parentOffset + index);
          this.modCount = parent.modCount;
          this.size--;
          return result;
      }
      ```



## 总结

1. 如果在初始化的时候知道ArrayList的初始容量，请一开始就指定容量`ArrayList list = new ArrayList(20);`,如果一开始不知道容量，中途才得知，请调用`list.ensureCapacity(20);`来扩充容量，如果数据已经添加完毕，但仍需要保存在内存中一段时间，请调用`list.trimToSize()`将容器最小化到存储元素容量，进而消除这些存储空间浪费。
2. ArrayList是以1.5倍的容量去扩容的，如初始容量是10，则容量依次递增扩充为：15，22，33，49。扩容后把原始数据从旧数组复制至新数组中。
3. ArrayList访问元素速度较快，下标方式访问元素，时间复杂度为O(1)，添加与删除速度较慢，时间复杂度均为O(n)。
4. ArrayList不是线程安全的，但是在发生并发行为时，它会尽可能的抛出`ConcurrentModificationException`，此为fail-fast机制。

