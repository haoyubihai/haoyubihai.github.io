---
title: android自定义View
date: 2018-12-31 14:01:02
categories:
- [android]
tags:
- android
- 自定义View
---

## Android自定义View

> 根据需求整合几个控件，使用
>
> 扩展或者更改原始控件的功能逻辑
>
> 实现一些无法用原始控件实现的布局，或简化布局复杂程度，提高性能

* 布局

* 绘制

* 触摸反馈

  <!--more-->

1. View中关于4个构造参数 

   ```java
   //  主要是在java代码中生命一个View时所调用，没有任何参数，一个空的View对象
   public ChildrenView(Context context) {
       super(context);
   }
   // 在布局文件中使用该自定义view的时候会调用到，一般会调用到该方法
   public ChildrenView(Context context, AttributeSet attrs) {
       this(context, attrs，0);
   }
   //如果你不需要View随着主题变化而变化，则上面两个构造函数就可以了
   //下面两个是与主题相关的构造函数
   public ChildrenView(Context context, AttributeSet attrs, int defStyleAttr) {
       this(context, attrs, defStyleAttr, 0);
   }
   //
   public ChildrenView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
       super(context, attrs, defStyleAttr, defStyleRes);
   }
   ```

   * `context` 上下文
   * `AttributeSet attrs` xml中的属性参数
   * `int defStyleAttr`  当前主题中提供一些默认的属性值，指向style资源，**只要在主题中对这个属性赋值，该View就会自动应用这个属性的值**。
   * `int defStyleRes`  只有在第三个参数defStyleAttr为0，或者主题中没有找到这个defStyleAttr属性的赋值时，才可以启用。而且这个参数不再是Attr了，而是真正的style。其实这也是一种低级别的“默认主题”，即在主题未声明属性值时，我们可以主动的给一个style，使用这个构造函数定义出的View，其主题就是这个定义的defStyleRes（是一种写死的style，因此优先级被调低）。

2. 当我们自定义一个view，且在布局文件中引用时，再系统初始化该view时，调用的是第二个构造函数。

3. 一个参数的构造方法， 主要是在java代码中生命一个View时所调用，没有任何参数，一个空的View对象

4. Android中的属性配置可以在 xml,style,主题中配置，defStyleAttr，defStyleRes，View类的后两个构造函数都是与主题相关的，也就是说，在你自定义View时，如果不需要你的View随着主题变化而变化，有前两个构造函数就OK了，但是如果你想你的View随着主题变化而变化，就需要利用后两个构造函数了。

5. 属性定义的优先级  xml>style>defStyleAttr>defStyleRes>Theme

   > * 当defStyleAttr！=0时，
   >
   > ​       主题中如果对defStyleAttr属性进行赋值，显示对defStyleAttr的赋值，优先级最高！
   >
   > * 当（defStyleAttr==0或主题没有对defStyleAttr进行赋值）&& defStyleRes!=0而且theme中没有定义时时，显示defStyleRes，优先级中
   > * 如果defStyleAttr==0且defStyleRes==0时，显示theme直接定义，优先级最低

   [Android View 四个构造函数详解](https://www.jianshu.com/p/7389287c04bb)

6. 自定义属性

   * color 引用颜色

   * integer 

   * boolean

   * string

   * float 

   * dimension 引用字体大小

     `//定义
     <attr name = "text_size" format = "dimension" />
     //使用：
         app:text_size = "28sp" 
     或者 
         app:text_size = "@android:dimen/app_icon_size"`

   * enum  枚举

     `//定义
         <attr name="orientation">
             <enum name="horizontal" value="0" />
             <enum name="vertical" value="1" />
         </attr>
     //使用：
         app:orientation = "vertical"`

   * flags  标志 （位或运行） 主要作用=可以多个值

     `//定义
       <attr name="gravity">
                 <flag name="top" value="0x01" />
                 <flag name="bottom" value="0x02" />
                 <flag name="left" value="0x04" />
                 <flag name="right" value="0x08" />
                 <flag name="center_vertical" value="0x16" />
         </attr>
     // 使用
     app:gravity = Top|left`

   * fraction:百分数：

     `//定义：
     <attr name = "transparency" format = "fraction" />
     //使用：
       app:transparency = "80%" `

   * reference:参考/引用某一资源ID

     `//定义：
      <attr name="leftIcon" format="reference" />
     //使用：
     app:leftIcon = "@drawable/图片ID"`

   * 混合类型：属性定义时指定多种类型值

     `//属性定义
      <attr name = "background" format = "reference|color" />
     //使用
     android:background = "@drawable/图片ID" 
     //或者
     android:background = "#FFFFFF" `

7. 自定义控件类型

   * 自定义组合控件 

     > 根据需求组合多个控件，方便复用

   * 集成系统控件

     > 对原有的功能进行改动，或者扩展新的功能

   * 直接继承ViewGroup

     > 可能要重写`onMeasure()`、`onLayout()`、`onDraw()`方法,这块很多问题要处理包括;轮询`childView`的测量值以及模式进行大小逻辑计算等 

   * 直接继承View

     > 需要根据自己的需求重写`onMeasure()`、`onLayout()`、`onDraw()`等方法便可以，要注意点就是记得`Padding`等值要记得加入运算

8. View绘制流程相关  measure()->layout()->draw()

9. onMeasure

   * MeasureSpec

     `MeasureSpec`是`View`的内部类，它封装了一个`View`的尺寸，在`onMeasure()`当中会根据这个`MeasureSpec`的值来确定View的宽高。 `MeasureSpec`的数据是`int`类型，有32位。 高两位表示模式，后面30位表示大小size。则`MeasureSpec` = mode+size 三种模式分别为：`EXACTLY`,`AT_MOST`,`UNSPECIFIED`

     * `EXACTLY`  match_parent 或者精确数值，精确模式 对应的数值就是MeasureSpec当中的size

     * `AT_MOST` wrap_content 最大值模式，View的尺寸有一个最大值，View不超过MeasureSpec当中的Size值

     * `UNSPECIFILED`  一般系统使用，无限制模式，View多大给多大

       `//获取测量模式
        val widthMode = MeasureSpec.getMode(widthMeasureSpec)
       //获取测量大小 
       val widthSize = MeasureSpec.getSize(widthMeasureSpec)
       //通过Mode和Size构造MeasureSpec
       val measureSpec = MeasureSpec.makeMeasureSpec(size, mode);`

     计算出尺寸后，调用resolveSize() 过滤一遍就是修正后的尺寸。

     

   * **setMeasuredDimension(int measuredWidth, int measuredHeight)** ：用来设置View的宽高，在我们自定义View保存宽高也会要用到。

   * **getSuggestedMinimumWidth()**：当View没有设置背景时，默认大小就是`mMinWidth`，这个值对应`Android:minWidth`属性，如果没有设置时默认为0. 如果有设置背景，则默认大小为`mMinWidth`和`mBackground.getMinimumWidth()`当中的较大值。

   * **getDefaultSize(int size, int measureSpec)**：用来获取View默认的宽高，在**getDefaultSize()**中对`MeasureSpec.AT_MOST`,`MeasureSpec.EXACTLY`两个的处理是一样的，我们自定义`View`的时候 要对两种模式进行处理。

   * #### ViewGroup中并没有measure()也没有onMeasure()

     > 因为ViewGroup除了测量自身的宽高，还需要测量各个子`View`的宽高，不同的布局测量方式不同 (例如 `LinearLayout`跟`RelativeLayout`等布局）,所以直接交由继承者根据自己的需要去复写。

10. onlayout()**相关**

    * View.java的onLayout方法是空实现:因为子View的位置，是由其父控件的onLayout方法来确定的。

    * onLayout(int l, int t, int r, int b)中的参数l、t、r、b都是相对于其父 控件的位置。

      > 四个参数`l、t、r、b`分别代表`View`的左、上、右、下四个边界相对于其父`View`的距离。 在调用`onLayout(changed, l, t, r, b);`之前都会调用到`setFrame()`确定`View`在父容器当中的位置，赋值给`mLeft`,`mTop`,`mRight`,`mBottom`。 在`ViewGroup#onLayout()`跟`View#onLayout()`都是空实现，交给继承者根据自身需求去定位。

    * 自身的mLeft, mTop, mRight, mBottom都是相对于父控件的位置。

    > **`getMeasureWidth()`与`getWidth()`** `getMeasureWidth()`返回的是`mMeasuredWidth`，而该值是在`setMeasureDimension()`中的`setMeasureDimensionRaw()`中设置的。因此`onMeasure()`后的所有方法都能获取到这个值。 `getWidth`返回的是`mRight-mLeft`，这两个值，是在`layout()`中的`setFrame()`中设置的. `getMeasureWidthAndState`中有一句： `This should be used during measurement and layout calculations only. Use {@link #getWidth()} to see how wide a view is after layout.`
    >
    > 总结：只有在测量过程中和布局计算时，才用`getMeasuredWidth()`。在layout之后，用`getWidth()`来获取宽度。

11. draw()绘画过程 

    > 1. 绘制背景。
    > 2. 如果必要的话,保存当前`canvas`
    > 3. 绘制`View`的内容
    > 4. 绘制子`View`
    > 5. 如果必要的话,绘画边缘重新保存图层
    > 6. 画装饰(例如滚动条)

    ### 绘制顺序

    先调用`drawBackground(canvas)` ->`onDraw(canvas)`->`dispatchDraw(canvas)`->`onDrawForeground(canvas)`越是后面绘画的越是覆盖在最上层。

    * **drawBackground(canvas)**:画背景，不可重写
    * **onDraw(canvas)**：画主体
      - **代码写在super.onDraw()前**：会被父类的onDraw覆盖
      - **代码写在super.onDraw()后**：不会被父类的onDraw覆盖
    * **dispatchDraw()** ：绘制子 View 的方法
      - **代码写在super.dispatchDraw(canvas)前**：把绘制代码写在 super.dispatchDraw() 的上面，这段绘制就会在 onDraw() 之后、 super.dispatchDraw() 之前发生，也就是绘制内容会出现在主体内容和子 View 之间。而这个…… 其实和重写 onDraw() 并把绘制代码写在 super.onDraw() 之后的做法，效果是一样的。
      - **代码写在super.dispatchDraw(canvas)后**：只要重写 dispatchDraw()，并在 super.dispatchDraw() 的下面写上你的绘制代码，这段绘制代码就会发生在子 View 的绘制之后，从而让绘制内容盖住子 View 了。

    * **onDrawForeground(canvas)**：包含了滑动边缘渐变和滑动条跟前景

    > 一般来说，一个 View（或 ViewGroup）的绘制不会这几项全都包含，但必然逃不出这几项，并且一定会严格遵守这个顺序。例如通常一个 LinearLayout 只有背景和子 View，那么它会先绘制背景再绘制子 View；一个 ImageView 有主体，有可能会再加上一层半透明的前景作为遮罩，那么它的前景也会在主体之后进行绘制。需要注意，前景的支持是在 Android 6.0（也就是 API 23）才加入的；之前其实也有，不过只支持 FrameLayout，而直到 6.0 才把这个支持放进了 View 类里。

    * 在重写的方法有多个选择时，优先选择 onDraw()

    >  一段绘制代码写在不同的绘制方法中效果是一样的，这时你可以选一个自己喜欢或者习惯的绘制方法来重写。但有一个例外：如果绘制代码既可以写在 onDraw() 里，也可以写在其他绘制方法里，那么优先写在 onDraw() ，因为 Android 有相关的优化，可以在不需要重绘的时候自动跳过 onDraw() 的重复执行，以提升开发效率。享受这种优化的只有 onDraw() 一个方法。

12. Activity中获取View宽高的几种方式

    > Activity 获取 view 的宽高， 在 onCreate , onResume 等方法中获取到的都是0， 因为 View 的测量过程并不是和 Activity 的声明周期同步执行的

    * **view.post** post 可以将一个 runnable 投递到消息队列的尾部，然后等待 Looper 调用此 runnable 的时候， View 也已经初始化好了

      ```java
         view.post(new Runnable() {
              @Override
              public void run() {
                  int width = view.getMeasuredWidth();
                  int height = view.getMeasuredHeight(); 
              }
          });
      ```

    * **ViewTreeObserver** 使用 addOnGlobalLayoutListener 接口， 当 view 树的状态发生改变或者 View 树内部的 view 的可见性发生改变时， onGlobalLayout 都会被调用， 需要注意的是， **onGlobalLayout 方法可能被调用多次**， 代码如下：

      ` view.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
                  @Override
                  public void onGlobalLayout() {
                      view.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                      int width = view.getMeasuredWidth();
                      int height = view.getMeasuredHeight();
                  }
              });`

    * **onWindowFocusChanged** 这个方法的含义是 View 已经初始化完毕了， 宽高已经准备好了， 需要注意的就是这个方法可能会调用多次， 在 Activity `onResume` 和`onPause`的时候都会调用， **也会有多次调用的情况**

      ```java
       @Override
      public void onWindowFocusChanged(boolean hasWindowFocus) {
          super.onWindowFocusChanged(hasWindowFocus);
          if(hasWindowFocus){
              int width = view.getMeasuredWidth();
              int height = view.getMeasuredHeight();
          }
      }
      ```

13. Canvas

    * 绘制几何图形 drawXXX()

    * 裁切展示范围 clipxxx()

      ``

      ```java
      @Override
      public void draw(Canvas canvas) {
          super.draw(canvas);
          //canvas裁切前先保存画布
          canvas.save();
          //确定绘制范围，该范围外部的将被裁切
          canvas.clipRect(new Rect(left,top,right,bottom));
          //绘制图形
          canvas.drawBitmap(bitmap,left,top,paint);
          //canvas裁切后要恢复画布，否则所有的绘制都会被裁切
          canvas.restore();
      }
      ```

    * 绘制内容几何变换，缩放，平移，选择，错切 matrix

      > 操作方式需要反向写

14. Android的布局过程

    * 测量布局  

      > 顶级--子级--逐一递归测量  父View调用 子View.measure（）-->onMeasure()

    * 布局过程

      >  父View调用 子View.layout()-->onLayout()

15. onMeasure（）重写：

    * 修改已有View的尺寸

      > 对于已有的View修改，先调用super.OnMeasure() 再取出原先的测量尺寸，重新计算，设置尺寸 调用setMeasureDimension()

    * 全新计算自定义View的尺寸

    * 重写onMeasure（） 和 onLayout() 来全新计算自定义ViewGroup的内部布局

      * 调用每个子View的measure（），让子View自我测量

        * 获取布局中开发者对view设定的宽高尺寸

          ![image-20191210145509782](/Users/jiarh/Library/Application Support/typora-user-images/image-20191210145509782.png)

          ![image-20191210150033016](/Users/jiarh/Library/Application Support/typora-user-images/image-20191210150033016.png)

          ![image-20191210150511429](/Users/jiarh/Library/Application Support/typora-user-images/image-20191210150511429.png)

      * 根据子view给出的尺寸，得出子View的尺寸，位置，并保存位置，尺寸

      * 根据子View的位置，尺寸，计算得出自己的尺寸，并用setMeasuredDimension()保存

16. 

### 来源

https://juejin.im/post/5dde44dc5188250e8b235d83

https://juejin.im/post/599109e45188257c666c60b6

