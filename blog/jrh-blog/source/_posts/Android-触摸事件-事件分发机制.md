---
title: Android 触摸事件&&事件分发机制
date: 2019-02-18 23:58:55
categories:
- [android]
tags:
- android
- 自定义View
---

## Android 触摸事件

> 触摸反馈的本质就是把一系列的触摸反馈解读为对应的事件。
>
> 比如：点击，按下移动，抬起
>
> 触摸事件不是独立的，是成组出现。

<!--more-->

1. 触摸事件的处理

   Android上当用户触摸屏幕时，触发`View.onTouchEvent(MotionEvent event)`方法。并把触摸事件传递给MotionEvent .

   一系列事件触发时，会不断的触发该方法。

2. 如果写自己的触摸反馈的算法，需要重写`onTouchEvent()`  

3. 事件分发

   解决事件冲突的机制

   当用户触摸屏幕时也就是一个事件组的第一个事件Down事件发生的时候，Android会从用户的触摸点上离用户最近的那个View开始，向下一个一个的调用每个View的`onTouchEvent()`事件，如果一个View的`onTouchEvent（）`事件对这个Down事件没有响应， 该事件就会向下一直传递，直到有一个View对该事件做出来了响应，消费了该事件，这个向下的过程才会结束。这个时候该View则成为该组事件的接受者。这组事件的后续事件，都会直接给这个View，直到改组事件结束，也就是up 或者`cancel`事件出现。

4. 事件的响应指`onTouchEvent`()的返回值，如果down事件发生时，该返回值为true，表示消费，响应该事件。其它的`up`,`move`事件的返回值没有影响。

5. 如果你点击的事件是在一个列表里面，点击一下列表，会触发点击事件，上下移动手指，列表上滑动，

   这种隔着一个按钮，屏幕列表滑动事件，是靠着Android的事件拦截机制。

   当用户触摸屏幕每一个触摸事件到达onTouchEvent()方法之前，Android会从activity最根本的那个View向上一级一级的去询问，你要不要拦截这组事件，自己处理消费。

   在实现上，是通过调用ViewGroup的`onInterceptTouchEvent`()来实现的。事件发生时，首先会从底部的View,向上递归的调用每个子View的`onInterceptTouchEvent`()方法，询问是不是拦截该事件，默认返回false不拦截，如果直到整个流程走完，全部返回false， 这个时候会走第二个流程：OnTouchEvent(),从上往下，如果中途某个View想拦截这组事件，直接在`onTouchEvent`()事件中返回true，该事件就不会再发生给它的子View，而是直接转交给他自己的onTouchEvent()来处理。后续的所有该组事件都会被拦截。

6. `onTouchEvent()`事件 是否要消费这组事件，是在`onTouchEvent`() 中Down事件发生时，返回的`true`，false决定的，如果down事件，返回false，以后就与这组事件无缘。

   

7. `onInterceptTouchEvent`()事件在整个事件过程中，对每个事件进行观察。再需要的合适时机进行拦截，处理自己的逻辑。再在合适的时候取消拦截，恢复以前的事件流，当`onInterceptTouchEvent`()返回为`true`时，除了完成事件监管，还会对它的子View发生一个额外的`CANCEL`取消事件。因为当你接管事件时，可能上面的子View可能正处于一个中间状态，则可以在收到该事件恢复状态。

8. 如果你不需要父View不要拦截事件，你需要调用到`requestDisallowInterceptTouchEvent`()，在子view里调用父view的这个方法。父View就不会去拦截该事件。该方法是一个递归方法，会依次调用所有的父View取消拦截该事件。不过仅限于当前事件流，当用户这个操作结束后，一切恢复正常。需要用时，再调用。

9. `dispatchTouchEvent`() ,`onTouchEvent`() 和`onInterceptTouchEvent`()都是在该方法中调用的，其实一个事件的分发过程，就是从根View递归的调用了一次`dispatchTouchEvent`()的过程。



### 总结：

自定义触摸反馈的关键：

1. 重写 `onTouchEvent()`，在里面写上你的触摸反馈算法，并返回 `true`（关键是 `ACTION_DOWN` 事件时返回 `true`）。
2. 如果是会发生触摸冲突的 `ViewGroup`，还需要重写 `onInterceptTouchEvent()`，在事件流开始时返回 `false`，并在确认接管事件流时返回一次 `true`，以实现对事件的拦截。
3. 当子 View 临时需要阻止父 View 拦截事件流时，可以调用父 View 的 `requestDisallowInterceptTouchEvent()` ，通知父 View 在当前事件流中不再尝试通过 `onInterceptTouchEvent()` 来拦截。