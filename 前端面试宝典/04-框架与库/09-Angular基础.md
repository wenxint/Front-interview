# Angular基础

> 本文介绍Angular框架的核心概念、基本用法和开发技巧，帮助读者快速掌握Angular开发。

## 一、Angular简介

### 1.1 什么是Angular

Angular是Google维护的开源前端框架，用于构建单页应用(SPA)。它采用TypeScript作为开发语言，提供了完整的应用架构方案。Angular的特点包括：

- **完整框架**：提供从路由、表单处理到HTTP请求的全套解决方案
- **基于组件**：使用组件化架构构建应用
- **强类型**：使用TypeScript提供类型安全
- **依赖注入**：内置强大的依赖注入系统
- **响应式编程**：通过RxJS支持响应式编程模式

### 1.2 Angular版本历史

- **AngularJS (Angular 1)**：最初版本，基于JavaScript
- **Angular 2+**：完全重写，采用TypeScript，组件化架构
- **Angular 4-13**：持续改进，保持向后兼容
- **Angular 14+**：引入独立组件、简化API

> 注意：现代Angular特指Angular 2及以上版本，与AngularJS(Angular 1)有显著差异。

## 二、Angular核心概念

### 2.1 组件(Components)

组件是Angular应用的基本构建块，由HTML模板、TypeScript类和CSS样式组成：

```typescript
// hello.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: '<h1>Hello, {{name}}!</h1>',
  styles: ['h1 { color: blue; }']
})
export class HelloComponent {
  name = 'Angular';
}
```

**使用组件**：
```html
<!-- 在其他组件模板中使用 -->
<app-hello></app-hello>
```

### 2.2 模块(Modules)

模块将应用组织为内聚的功能块，声明组件、指令、服务等：

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent, HelloComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 2.3 指令(Directives)

Angular提供三种类型的指令：

1. **组件**：带模板的指令
2. **结构型指令**：修改DOM结构
   ```html
   <div *ngIf="isVisible">Content to show/hide</div>
   <ul>
     <li *ngFor="let item of items">{{item}}</li>
   </ul>
   ```
3. **属性型指令**：修改元素属性或行为
   ```html
   <div [ngClass]="{'active': isActive}">Dynamic classes</div>
   <button [disabled]="isDisabled">Click me</button>
   ```

### 2.4 服务与依赖注入(Services & DI)

服务提供专门功能，通过依赖注入系统与组件共享：

```typescript
// data.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // 应用级单例
})
export class DataService {
  getData() {
    return ['Item 1', 'Item 2', 'Item 3'];
  }
}

// 在组件中使用
import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-list',
  template: '<ul><li *ngFor="let item of items">{{item}}</li></ul>'
})
export class ListComponent {
  items: string[];

  // 通过构造函数注入服务
  constructor(private dataService: DataService) {
    this.items = this.dataService.getData();
  }
}
```

## 三、模板语法与数据绑定

### 3.1 插值表达式(Interpolation)

```html
<h1>{{title}}</h1>
<p>Sum: {{1 + 1}}</p>
<div>{{user.name}}</div>
```

### 3.2 属性绑定(Property Binding)

```html
<img [src]="imageUrl">
<button [disabled]="isDisabled">Click</button>
```

### 3.3 事件绑定(Event Binding)

```html
<button (click)="onClick()">Click me</button>
<input (input)="onInput($event)">
```

### 3.4 双向绑定(Two-way Binding)

```html
<input [(ngModel)]="name">
<p>Hello, {{name}}!</p>
```

要使用`ngModel`，需要导入`FormsModule`：

```typescript
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [BrowserModule, FormsModule],
  // ...
})
export class AppModule { }
```

### 3.5 模板引用变量

```html
<input #nameInput>
<button (click)="greet(nameInput.value)">Greet</button>
```

## 四、组件间通信

### 4.1 @Input装饰器：父组件传递数据给子组件

```typescript
// child.component.ts
@Component({
  selector: 'app-child',
  template: '<p>{{message}}</p>'
})
export class ChildComponent {
  @Input() message: string;
}

// 父组件模板
<app-child [message]="parentMessage"></app-child>
```

### 4.2 @Output装饰器：子组件向父组件发送事件

```typescript
// child.component.ts
@Component({
  selector: 'app-child',
  template: '<button (click)="sendMessage()">Send</button>'
})
export class ChildComponent {
  @Output() messageEvent = new EventEmitter<string>();

  sendMessage() {
    this.messageEvent.emit('Hello from child');
  }
}

// 父组件模板
<app-child (messageEvent)="receiveMessage($event)"></app-child>
```

### 4.3 服务通信

使用共享服务在任意组件间通信：

```typescript
// communication.service.ts
@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private messageSource = new BehaviorSubject<string>('default message');
  currentMessage = this.messageSource.asObservable();

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
}

// 发送组件
@Component({ ... })
export class SenderComponent {
  constructor(private commService: CommunicationService) {}

  sendMessage() {
    this.commService.changeMessage('New message');
  }
}

// 接收组件
@Component({ ... })
export class ReceiverComponent implements OnInit {
  message: string;

  constructor(private commService: CommunicationService) {}

  ngOnInit() {
    this.commService.currentMessage.subscribe(message => {
      this.message = message;
    });
  }
}
```

## 五、路由与导航

### 5.1 基本路由配置

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### 5.2 路由出口与导航链接

```html
<!-- app.component.html -->
<nav>
  <a routerLink="/home" routerLinkActive="active">Home</a>
  <a routerLink="/about" routerLinkActive="active">About</a>
</nav>

<!-- 路由出口 -->
<router-outlet></router-outlet>
```

### 5.3 参数化路由

```typescript
// 路由配置
const routes: Routes = [
  { path: 'user/:id', component: UserDetailComponent }
];

// 组件中获取参数
@Component({ ... })
export class UserDetailComponent implements OnInit {
  userId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // 方式1：快照
    this.userId = this.route.snapshot.paramMap.get('id');

    // 方式2：Observable (响应参数变化)
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
    });
  }
}
```

### 5.4 编程式导航

```typescript
@Component({ ... })
export class NavigationComponent {
  constructor(private router: Router) {}

  goToUser(id: string) {
    this.router.navigate(['/user', id]);

    // 或带查询参数
    this.router.navigate(['/user'], {
      queryParams: { name: 'John' }
    });
  }
}
```

## 六、表单处理

Angular提供两种形式的表单：模板驱动表单和响应式表单。

### 6.1 模板驱动表单

基于HTML模板的简单表单：

```typescript
// app.module.ts
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [BrowserModule, FormsModule],
  // ...
})
export class AppModule { }
```

```html
<!-- template-form.component.html -->
<form #myForm="ngForm" (ngSubmit)="onSubmit(myForm)">
  <div>
    <label for="name">Name</label>
    <input id="name" name="name" [(ngModel)]="user.name" required>
  </div>

  <div>
    <label for="email">Email</label>
    <input id="email" name="email" [(ngModel)]="user.email"
           required email #email="ngModel">
    <div *ngIf="email.invalid && email.touched">
      Invalid email format
    </div>
  </div>

  <button type="submit" [disabled]="myForm.invalid">Submit</button>
</form>
```

```typescript
@Component({ ... })
export class TemplateFormComponent {
  user = { name: '', email: '' };

  onSubmit(form: NgForm) {
    console.log('Form submitted', form.value);
  }
}
```

### 6.2 响应式表单

基于代码的更灵活的表单：

```typescript
// app.module.ts
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule],
  // ...
})
export class AppModule { }
```

```typescript
// reactive-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html'
})
export class ReactiveFormComponent implements OnInit {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        street: [''],
        city: [''],
        zip: ['']
      })
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form submitted', this.userForm.value);
    }
  }
}
```

```html
<!-- reactive-form.component.html -->
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="name">Name</label>
    <input id="name" formControlName="name">
    <div *ngIf="userForm.get('name').invalid && userForm.get('name').touched">
      <div *ngIf="userForm.get('name').errors?.required">Name is required</div>
      <div *ngIf="userForm.get('name').errors?.minlength">
        Name must be at least 3 characters
      </div>
    </div>
  </div>

  <div>
    <label for="email">Email</label>
    <input id="email" formControlName="email">
    <div *ngIf="userForm.get('email').invalid && userForm.get('email').touched">
      Invalid email
    </div>
  </div>

  <div formGroupName="address">
    <h3>Address</h3>
    <div>
      <label for="street">Street</label>
      <input id="street" formControlName="street">
    </div>
    <div>
      <label for="city">City</label>
      <input id="city" formControlName="city">
    </div>
    <div>
      <label for="zip">ZIP</label>
      <input id="zip" formControlName="zip">
    </div>
  </div>

  <button type="submit" [disabled]="userForm.invalid">Submit</button>
</form>
```

## 七、HTTP服务与API调用

### 7.1 设置HttpClient

```typescript
// app.module.ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [BrowserModule, HttpClientModule],
  // ...
})
export class AppModule { }
```

### 7.2 创建数据服务

```typescript
// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://api.example.com/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUser(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
```

### 7.3 在组件中使用

```typescript
@Component({
  selector: 'app-user-list',
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">{{error}}</div>
    <ul *ngIf="users">
      <li *ngFor="let user of users">{{user.name}}</li>
    </ul>
  `
})
export class UserListComponent implements OnInit {
  users: any[];
  loading = false;
  error: string;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loading = true;
    this.dataService.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error(error);
      }
    );
  }
}
```

## 八、生命周期钩子

Angular组件有多个生命周期钩子，按执行顺序：

1. **ngOnChanges**：当@Input属性值改变时调用
2. **ngOnInit**：组件初始化后调用，只调用一次
3. **ngDoCheck**：每个变化检测周期调用
4. **ngAfterContentInit**：外部内容投影到视图后调用
5. **ngAfterContentChecked**：内容变化检测完成后调用
6. **ngAfterViewInit**：组件视图初始化完成后调用
7. **ngAfterViewChecked**：视图变化检测完成后调用
8. **ngOnDestroy**：组件销毁前调用，适合清理资源

常用的钩子示例：

```typescript
@Component({ ... })
export class LifecycleComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: any;
  private subscription: Subscription;

  constructor(private service: SomeService) {
    console.log('Constructor called');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Input changes', changes);
  }

  ngOnInit() {
    console.log('Component initialized');
    this.subscription = this.service.getData().subscribe();
  }

  ngOnDestroy() {
    console.log('Component destroyed');
    // 清理资源，避免内存泄漏
    this.subscription.unsubscribe();
  }
}
```

## 九、Angular的响应式编程(RxJS)

Angular深度集成了RxJS库用于响应式编程。

### 9.1 基本Observable示例

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable, of, from, interval } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

@Component({ ... })
export class RxjsComponent implements OnInit {
  ngOnInit() {
    // 创建Observable
    const simple$ = of(1, 2, 3, 4, 5);

    // 使用操作符
    simple$.pipe(
      filter(n => n % 2 === 0), // 过滤偶数
      map(n => n * 2)           // 每个值乘以2
    ).subscribe(
      value => console.log(value), // 输出: 4, 8
      error => console.error(error),
      () => console.log('Complete')
    );

    // 定时Observable
    const timer$ = interval(1000).pipe(take(5));
    timer$.subscribe(val => console.log('Timer:', val));
  }
}
```

### 9.2 在HTTP请求中使用

```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>('https://api.example.com/users').pipe(
      map(users => users.map(user => ({
        ...user,
        fullName: `${user.firstName} ${user.lastName}`
      }))),
      catchError(error => {
        console.error('Error fetching users', error);
        return throwError('Failed to load users. Please try again.');
      })
    );
  }
}
```

## 十、Angular最佳实践

### 10.1 组件最佳实践

- 遵循单一职责原则
- 保持组件较小，专注于特定功能
- 使用OnPush变更检测策略优化性能
- 使用ngOnChanges监听输入属性变化
- 分离展示型组件和容器组件

### 10.2 服务最佳实践

- 使用服务处理数据和业务逻辑
- 在适当的级别提供服务（模块级别或组件级别）
- 为API调用创建专门的服务
- 使用RxJS处理异步操作

### 10.3 模块组织最佳实践

- 创建特性模块封装相关功能
- 使用共享模块重用常用组件
- 实现惰性加载优化性能
- 保持模块聚焦和内聚

### 10.4 性能优化技巧

- 使用OnPush变更检测
- 避免复杂计算在模板中
- 使用trackBy优化ngFor
- 移除不必要的订阅
- 使用纯管道替代方法调用

## 十一、常见面试问题

1. **Angular的核心优势是什么？**
   - 完整的框架解决方案，不需要选择额外库
   - 强类型系统(TypeScript)提供更好的开发体验
   - 强大的依赖注入系统
   - 全面的CLI工具支持
   - 企业级应用友好

2. **Angular中的SPA是什么？**
   - 单页应用程序(Single Page Application)
   - 只加载一个HTML页面，然后动态更新内容
   - 通过路由在客户端渲染不同"页面"
   - 提供流畅的用户体验，减少页面刷新

3. **Angular中的服务是什么？为什么使用？**
   - 服务是专注于特定功能的类
   - 通过依赖注入在组件间共享
   - 分离业务逻辑和视图逻辑
   - 使代码更可测试和可维护

4. **模板驱动表单和响应式表单有什么区别？**
   - 模板驱动：在HTML模板中定义表单结构，简单直观
   - 响应式表单：在组件类中定义表单结构，更灵活强大
   - 模板驱动适合简单表单，响应式适合复杂表单
   - 响应式表单更容易测试，提供更多动态控制

5. **Zone.js在Angular中的作用是什么？**
   - 拦截异步操作（如setTimeout, Promise等）
   - 帮助Angular检测变化
   - 自动触发变更检测机制
   - 使开发者无需手动调用变更检测