---
title: LinkedList使用笔记
date: 2019-10-03 11:12:11
categories:
- [java]
- [android]
- [集合框架]
tags:
- java
- android
---

## LinkedList

1. LinkedList底层是双向链表，同时实现了List接口和Deque接口

2. 可以看作是一个顺序容器，也可以看作是一个队列(Queue)，同时也可以看作是一个栈(Stack)

3. 如果想使用栈或队列等数据结构的话，推荐使用ArrayDeque，它作为栈或队列会比LinkedList有更好的使用性能。

   <!--more-->

4. LinkedList底层实现是双向链表，核心组成元素有：`int size = 0`用于记录链表长度；`Node first;`用于记录头（第一个）结点（储存的是头结点的引用）；`Node last;`用于记录尾（最后一个）结点（储存的是尾结点的引用）。

   ``

   ```java
   public class LinkedList<E>
       extends AbstractSequentialList<E>
       implements List<E>, Deque<E>, Cloneable, java.io.Serializable
     
     
     transient int size = 0;
   
       /**
        * Pointer to first node. 第一个节点
        * Invariant: (first == null && last == null) ||
        *            (first.prev == null && first.item != null)
        */
       transient Node<E> first;
   
       /**
        * Pointer to last node. 最后一个节点
        * Invariant: (first == null && last == null) ||
        *            (last.next == null && last.item != null)
        */
       transient Node<E> last;
   ```



5. 双向链表的核心组成元素还有一个最重要的`Node`，`Node`包含：`E item;` 用于存储元素数据，`Node next;` 指向当前元素的后继结点，`Node prev;` 指向当前元素的前驱结点。

   ``

   ```java
   private static class Node<E> {
       E item;
       Node<E> next;
       Node<E> prev;
   
       Node(Node<E> prev, E element, Node<E> next) {
           this.item = element;
           this.next = next;
           this.prev = prev;
       }
   }
   ```

6. 获取元素：LinkedList提供了三种获取元素的方法，分别是

   * 获取第一个元素`getFirst()`，获取第一个元素，直接返回`Node first`指向的结点即可，所以时间复杂度为O(1)。
   * 获取最后一个元素`getLast()`，获取最后一个元素，直接返回`Node last`指向的结点即可，所以时间复杂度也为O(1)。
   * 获取指定索引index位置的元素`get(int index)`，由于`Node`结点在内存中存储的空间不是连续存储的，所以查找某一位置的结点，只能通过遍历链表的方式查找结点，因此LinkedList会先通过判断`index < (size >> 1)`，`size>>1`即为`size/2`当前链表长度的一半，判断index的位置是在链表的前半部分还是后半部分。决定是从头部遍历查找数据还是从尾部遍历查找数据。最坏情况下，获取中间元素，则需要遍历n/2次才能获取到对应元素，所以此方法的时间复杂度为O(n)。
   * 综上所述，LinkedList获取元素的时间复杂度为O(n)。

   ```java
       /**
        * 返回列表中指定位置的元素
        *
        * @param index 指定index位置
        * @return 返回指定位置的元素
        * @throws IndexOutOfBoundsException {@inheritDoc}
        */
       public E get(int index) {
           // 检查index下标是否合法[0,size)
           checkElementIndex(index);
           // 遍历列表获取对应index位置的元素
           return node(index).item;
       }
   
       /**
        * 检查下标是否合法
        */
       private void checkElementIndex(int index) {
           if (!isElementIndex(index))
               throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
       }
   
       private boolean isElementIndex(int index) {
           return index >= 0 && index < size;
       }
   
       /**
        * 返回指定位置的结点元素（重点）
        */
       Node<E> node(int index) {
           // assert isElementIndex(index);
           // 判断index位置是在链表的前半部分还是后半部分
           if (index < (size >> 1)) {
               // 从头结点开始，从前往后遍历找到对应位置的结点元素
               Node<E> x = first;
               for (int i = 0; i < index; i++)
                   x = x.next;
               return x;
           } else {
               // 从尾结点开始，从后往前遍历找到对应位置的结点元素
               Node<E> x = last;
               for (int i = size - 1; i > index; i--)
                   x = x.prev;
               return x;
           }
       }
   ```

7. 修改元素：LinkedList提供了一种修改元素数据的方法`set(int index, E element)`，修改元素数据的步骤是：

   * 检查index索引是否合法[0,size)。
   * 折半查询获取对应索引元素。
   * 将新元素赋值，返回旧元素。由获取元素的分析可知，折半查询的时间复杂度为O(n)，故修改元素数据的时间复杂度为O(n)。

   ```java
       /**
        * 修改指定位置结点的存储数据
        *
        * @param index 指定位置
        * @param element 修改的存储数据
        * @return 返回未修改前的存储数据
        * @throws IndexOutOfBoundsException {@inheritDoc}
        */
       public E set(int index, E element) {
           // 检查index下标是否合法[0,size)
           checkElementIndex(index);
           // 折半查询获取对应索引元素
           Node<E> x = node(index);
           // 将新元素赋值，返回旧元素
           E oldVal = x.item;
           x.item = element;
           return oldVal;
       }
   ```

8. 新增元素：LinkedList提供了四种新增元素的方法

   * 将指定元素插入到链表的第一个位置中`addFirst(E e)`，只需将头结点`first`指向新元素结点，将原第一结点的前驱指针指向新元素结点即可。不需要移动原数据存储位置，只需交换一下相关结点的指针域信息即可。所以时间复杂度为O(1)。

   * 将指定元素插入到链表的最后一个位置中`addLast(E e)`，只需将尾结点`last`指向新元素结点，将原最后一个结点的后继指针指向新元素结点即可。不需要移动原数据存储位置，只需交换一下相关结点的指针域信息即可。所以时间复杂度也为O(1)

   * 添加元素方法`add(E e)` 等价于`addLast(E e)`。

   * 将指定元素插入到链表的指定位置index中`add(int index, E element)`，需要先根据位置index调用`node(index)`遍历链表获取该位置的原结点，然后将新结点插入至原该位置结点的前面，不需要移动原数据存储位置，只需交换一下相关结点的指针域信息即可。所以时间复杂度也为O(1)

   * 综上所述，LinkedList新增元素的时间复杂度为O(1)，单纯论插入新元素，操作是非常高效的，特别是插入至头部或插入到尾部。但如果是通过索引index的方式插入，插入的位置越靠近链表中间所费时间越长，因为需要对链表进行遍历查找。

     ```java
         /**
          * 将指定元素插入到链表的第一个位置中
          *
          * @param e 要插入的元素
          */
         public void addFirst(E e) {
             linkFirst(e);
         }
     
         /**
          * 将元素e作为第一个元素
          */
         private void linkFirst(E e) {
             // 获取原头结点
             final Node<E> f = first;
             // 初始化新元素结点
             final Node<E> newNode = new Node<>(null, e, f);
             // 头指针指向新元素结点
             first = newNode;
             // 如果是第一个元素（链表为空）
             if (f == null)
                 // 将尾指针也指向新元素结点
                 last = newNode;
             else // 链表不会空
                 // 原头结点的前驱指针指向新结点
                 f.prev = newNode;
             // 记录链表长度的size + 1
             size++;
             modCount++;
         }
     
         /**
          * 将指定元素插入到链表的最后一个位置中
          *
          * <p>此方法等同与add(E e)方法 {@link #add}.
          *
          * @param e 要插入的元素
          */
         public void addLast(E e) {
             linkLast(e);
         }
     
         /**
          * 将指定元素插入到链表的最后一个位置中
          *
          * <p>此方法等同与addLast(E e)方法  {@link #addLast}.
          *
          * @param e 要插入的元素
          * @return {@code true} (as specified by {@link Collection#add})
          */
         public boolean add(E e) {
             linkLast(e);
             return true;
         }
     
         /**
          * 将元素e作为最后一个元素
          */
         void linkLast(E e) {
             // 获取原尾结点
             final Node<E> l = last;
             // 初始化新元素结点
             final Node<E> newNode = new Node<>(l, e, null);
             // 位指针指向新元素结点
             last = newNode;
             // 如果是第一个元素（链表为空）
             if (l == null)
                 // 将头指针也指向新元素结点
                 first = newNode;
             else // 链表不会空
                 // 原尾结点的后继指针指向新结点
                 l.next = newNode;
             // 记录链表长度的size + 1
             size++;
             modCount++;
         }
     
         /**
          * 将指定元素插入到链表的指定位置index中
          *
          * @param index 元素要插入的位置index
          * @param element 要插入的元素
          * @throws IndexOutOfBoundsException {@inheritDoc}
          */
         public void add(int index, E element) {
             // 检查插入位置是否合法[0,size]
             checkPositionIndex(index);
             // 如果插入的位置和当前链表长度相等，则直接将元素插入至链表的尾部
             if (index == size)
                 // 将元素插入至链表的尾部
                 linkLast(element);
             else
                 //将元素插入至指定位置,node(index)先获取占有该index位置的原结点
                 linkBefore(element, node(index));
         }
     
         /**
          * 检查位置是否合法
          */
         private void checkPositionIndex(int index) {
             if (!isPositionIndex(index))
                 throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
         }
     
         /**
          * 检查位置是否合法
          */
         private boolean isPositionIndex(int index) {
             //合法位置为[0,size]
             return index >= 0 && index <= size;
         }
     
         /**
          * 将新元素e插入至旧元素succ前面
          */
         void linkBefore(E e, Node<E> succ) {
             // assert succ != null;
             // 记录旧元素结点succ的前驱指针
             final Node<E> pred = succ.prev;
             // 初始化新元素结点
             final Node<E> newNode = new Node<>(pred, e, succ);
             // 旧元素结点的前驱指针指向新元素结点(即新元素结点放至在旧元素结点的前面，取代了原本旧元素的位置)
             succ.prev = newNode;
             // 如果旧元素结点的前驱指针为空，则证明旧元素结点是头结点，
             // 将新元素结点插入至旧元素结点前面，所以现时新的头结点是新元素结点
             if (pred == null)
                 first = newNode;
             else //不是插入至头部
                 // 旧元素的前驱结点的后继指针指向新元素结点
                 pred.next = newNode;
             // 记录链表长度的size + 1
             size++;
             modCount++;
         }
     ```

9. 删除元素：LinkedList提供了四种删除元素的方法

   * 删除链表中的第一个元素`removeFirst()`，只需将头结点`first`指向删除元素结点的后继结点并将其前驱结点指针信息`prev`清空即可。不需要移动原数据存储位置，只需操作相关结点的指针域信息即可。所以时间复杂度为O(1)。

   * 删除链表中的最后一个元素`removeLast()`，只需将尾结点`last`指向删除元素结点的前驱结点并将其后继结点指针信息`next`清空即可。不需要移动原数据存储位置，只需操作相关结点的指针域信息即可，所以时间复杂度也为O(1)。

   * 将指定位置index的元素删除`remove(int index)`，需要先根据位置index调用`node(index)`遍历链表获取该位置的原结点，然后将删除元素结点的前驱结点的`next`后继结点指针域指向删除元素结点的后继结点`node.prev.next = node.next`，删除元素结点的后继结点的`prev`前驱结点指针域指向删除元素结点的前驱结点即可`node.next.prev = node.prev`（此处可能有些绕，不太理解的同学自行学习一下双向链表的数据结构吧），不需要移动原数据存储位置，只需交换一下相关结点的指针域信息即可。所以时间复杂度也为O(1)。

   * 除传入的Object o指定对象，比较对象是否一致通过o.equals方法比较`remove(Object o)`

   * 综上所述，LinkedList删除元素的时间复杂度为O(1)，单纯论删除元素，操作是非常高效的，特别是删除第一个结点或删除最后一个结点。但如果是通过索引index的方式或者object对象的方式删除，则需要对链表进行遍历查找对应index索引的对象或者利用equals方法判断对象。

     ```java
         /**
          * 删除链表中的第一个元素并返回
          *
          * @return 链表中的第一个元素
          * @throws NoSuchElementException if this list is empty
          */
         public E removeFirst() {
             //根据头结点获取第一个元素结点
             final Node<E> f = first;
             if (f == null) // 没有元素结点则抛出异常
                 throw new NoSuchElementException();
             return unlinkFirst(f);
         }
     
         /**
          * 移除第一个元素
          */
         private E unlinkFirst(Node<E> f) {
             // assert f == first && f != null;
             // 记录要移除元素结点的数据域
             final E element = f.item;
             // 记录要移除元素结点的后继结点指针
             final Node<E> next = f.next;
             // 清空要删除结点的数据域和next指针域信息，以帮助垃圾回收
             f.item = null;
             f.next = null; // help GC
             // 头结点指向要移除元素结点的后继结点
             first = next;
             // 如果要移除元素结点的后继结点为空，则证明链表只有一个元素
             // 所以需要将尾结点的指针信息也要清空
             if (next == null)
                 last = null;
             else
                 // 将新的第一个结点的前驱结点指针信息清空
                 next.prev = null;
             // 记录链表长度的size - 1
             size--;
             modCount++;
             // 返回移除元素结点的数据域
             return element;
         }
     
         /**
          * 删除链表中的最后一个元素并返回
          *
          * @return 链表中的最后一个元素
          * @throws NoSuchElementException if this list is empty
          */
         public E removeLast() {
             // 根据尾结点获取最后一个元素结点
             final Node<E> l = last;
             if (l == null)// 没有元素结点则抛出异常
                 throw new NoSuchElementException();
             return unlinkLast(l);
         }
     
     
     
         /**
          * 移除最后一个元素
          */
         private E unlinkLast(Node<E> l) {
             // assert l == last && l != null;
             // 记录要移除元素结点的数据域
             final E element = l.item;
             // 记录要移除元素结点的前驱结点指针
             final Node<E> prev = l.prev;
             // 清空要删除结点的数据域和prev指针域信息，以帮助垃圾回收
             l.item = null;
             l.prev = null; // help GC
             // 头结点指向要移除元素结点的前驱结点
             last = prev;
             // 如果要移除元素结点的前驱结点为空，则证明链表只有一个元素
             // 所以需要将头结点的指针信息也要清空
             if (prev == null)
                 first = null;
             else
                 // 将新的最后一个结点的后继结点指针信息清空
                 prev.next = null;
             // 记录链表长度的size - 1
             size--;
             modCount++;
             // 返回移除元素结点的数据域
             return element;
         }
     
         /**
          * 将指定位置index的元素删除
          *
          * @param index 要删除的位置index
          * @return 要删除位置的原元素
          * @throws IndexOutOfBoundsException {@inheritDoc}
          */
         public E remove(int index) {
             // 检查index下标是否合法[0,size)
             checkElementIndex(index);
             // 根据index进行遍历链表获取要删除的结点，再调用unlink方法进行删除
             return unlink(node(index));
         }
     
         /**
          * 删除传入的Object o指定对象，比较对象是否一致通过o.equals方法比较
          * @param o 要删除的Object o指定对象
          * @return {@code true} 是否存在要删除对象o
          */
         public boolean remove(Object o) {
             // 如果删除对象为null，则遍历链表查找node.item数据域为null的结点并移除
             if (o == null) {
                 for (Node<E> x = first; x != null; x = x.next) {
                     if (x.item == null) {
                         unlink(x);
                         return true;
                     }
                 }
             } else {
                 // 从头开始遍历链表，并通过equals方法逐一比较node.item是否相等 
                 // 相等则对象一致，删除此对象。
                 for (Node<E> x = first; x != null; x = x.next) {
                     if (o.equals(x.item)) {
                         unlink(x);
                         return true;
                     }
                 }
             }
             return false;
         }
     
     
     
         /**
          * 移除指定结点x
          */
         E unlink(Node<E> x) {
             // assert x != null;
             // 记录要移除元素结点的数据域
             final E element = x.item;
             // 记录要移除元素结点的后继结点指针
             final Node<E> next = x.next;
             // 记录要移除元素结点的前驱结点指针
             final Node<E> prev = x.prev;
     
             // 如果要移除元素结点的前驱结点为空，则证明要删除结点为第一个结点
             if (prev == null) {
                 // 头结点指向要删除元素结点的后继结点
                 first = next;
             } else {
                 // 要删除元素结点的前驱结点的后继指针指向要删除元素结点的后继结点
                 prev.next = next;
                 // 清空要删除结点的前驱结点指针信息，以帮助GC
                 x.prev = null;
             }
             // 如果要移除元素结点的后继结点为空，则证明要删除结点为最后一个结点
             if (next == null) {
                 // 尾结点指向要删除元素结点的前驱结点
                 last = prev;
             } else {
                 // 要删除元素结点的后继结点的前驱指针指向要删除元素结点的前驱结点
                 next.prev = prev;
                 // 清空要删除结点的后继结点指针信息，以帮助GC
                 x.next = null;
             }
             // 清空要删除元素的数据域，以帮助GC
             x.item = null;
             // 记录链表长度的size - 1
             size--;
             modCount++;
             // 返回移除元素结点的数据域
             return element;
         }
     ```

10. ArrayList和LinkedList

    * LinkedList内部存储的是`Node`，不仅要维护数据域，还要维护`prev`和`next`，如果LinkedList中的结点特别多，则LinkedList比ArrayList更占内存。

    * LinkedList在做插入和删除操作时，插入或删除头部或尾部时是高效的，操作越靠近中间位置的元素时，需要遍历查找，速度相对慢一些，如果在数据量较大时，每次插入或删除时遍历查找比较费时。所以LinkedList插入与删除，慢在遍历查找，快在只需要更改相关结点的引用地址。

    * ArrayList在做插入和删除操作时，插入或删除尾部时也一样是高效的，操作其他位置，则需要批量移动元素，所以ArrayList插入与删除，快在遍历查找，慢在需要批量移动元素。

    * 由于ArrayList实现了`RandomAccess`随机访问接口，所以使用for(int i = 0; i < size; i++)遍历会比使用Iterator迭代器来遍历快：

      ```cpp
      for (int i=0, n=list.size(); i < n; i++) {     
          list.get(i);
      }
      
      runs faster than this loop:
      for (Iterator i=list.iterator(); i.hasNext(); ) { 
         i.next();
      }
      ```

    * 而由于LinkedList未实现`RandomAccess`接口，所以推荐使用Iterator迭代器来遍历数据。

    * 因此，如果我们需要频繁在列表的中部改变插入或删除元素时，建议使用LinkedList，否则，建议使用ArrayList，因为ArrayList遍历查找元素较快，并且只需存储元素的数据域，不需要额外记录其他数据的位置信息，可以节省内存空间。

11. LinkedList不是线程安全的，如果多个线程同时对同一个LinkedList更改数据的话，会导致数据不一致或者数据污染。如果出现线程不安全的操作时，LinkedList会尽可能的抛出`ConcurrentModificationException`防止数据异常，当我们在对一个LinkedList进行遍历时，在遍历期间，我们是不能对LinkedList进行添加，删除等更改数据结构的操作的，否则也会抛出`ConcurrentModificationException`异常，此为fail-fast（快速失败）机制。从源码上分析，我们在`add,remove`等更改LinkedList数据时，都会导致modCount的改变，当`expectedModCount != modCount`时，则抛出`ConcurrentModificationException`。如果想要线程安全，可以考虑调用`Collections.synchronizedCollection(Collection c)`方法。

    ```java
        private class ListItr implements ListIterator<E> {
            private Node<E> lastReturned;
            private Node<E> next;
            private int nextIndex;
            private int expectedModCount = modCount;
    
            ListItr(int index) {
                // assert isPositionIndex(index);
                next = (index == size) ? null : node(index);
                nextIndex = index;
            }
    
            public boolean hasNext() {
                return nextIndex < size;
            }
    
            public E next() {
                checkForComodification();
                if (!hasNext())
                    throw new NoSuchElementException();
    
                lastReturned = next;
                next = next.next;
                nextIndex++;
                return lastReturned.item;
            }
    
            public boolean hasPrevious() {
                return nextIndex > 0;
            }
    
            public E previous() {
                checkForComodification();
                if (!hasPrevious())
                    throw new NoSuchElementException();
    
                lastReturned = next = (next == null) ? last : next.prev;
                nextIndex--;
                return lastReturned.item;
            }
    
            public int nextIndex() {
                return nextIndex;
            }
    
            public int previousIndex() {
                return nextIndex - 1;
            }
    
            public void remove() {
                checkForComodification();
                if (lastReturned == null)
                    throw new IllegalStateException();
    
                Node<E> lastNext = lastReturned.next;
                unlink(lastReturned);
                if (next == lastReturned)
                    next = lastNext;
                else
                    nextIndex--;
                lastReturned = null;
                expectedModCount++;
            }
    
            public void set(E e) {
                if (lastReturned == null)
                    throw new IllegalStateException();
                checkForComodification();
                lastReturned.item = e;
            }
    
            public void add(E e) {
                checkForComodification();
                lastReturned = null;
                if (next == null)
                    linkLast(e);
                else
                    linkBefore(e, next);
                nextIndex++;
                expectedModCount++;
            }
    
            public void forEachRemaining(Consumer<? super E> action) {
                Objects.requireNonNull(action);
                while (modCount == expectedModCount && nextIndex < size) {
                    action.accept(next.item);
                    lastReturned = next;
                    next = next.next;
                    nextIndex++;
                }
                checkForComodification();
            }
    
            final void checkForComodification() {
                if (modCount != expectedModCount)
                    throw new ConcurrentModificationException();
            }
        }
    ```

