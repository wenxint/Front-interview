/**
 * 图片懒加载类
 * 提供两种实现方式：
 * 1. 现代浏览器：使用IntersectionObserver API
 * 2. 传统浏览器：使用滚动事件监听
 *
 * @author 前端面试宝典
 * @version 1.0.0
 */

/**
 * 图片懒加载类
 * @class LazyLoad
 */
class LazyLoad {
  /**
   * 创建懒加载实例
   * @param {Object} options - 配置选项
   * @param {string} [options.selector='.lazy-image'] - 懒加载图片的CSS选择器
   * @param {string} [options.dataSrc='data-src'] - 存储真实图片地址的data属性名
   * @param {number} [options.threshold=0.1] - IntersectionObserver的阈值，表示元素可见比例达到多少时触发加载
   * @param {number} [options.throttleDelay=200] - 节流延迟时间（毫秒）
   * @param {string} [options.loadingClass='lazy-loading'] - 加载中的CSS类名
   * @param {string} [options.loadedClass='lazy-loaded'] - 加载完成的CSS类名
   * @param {string} [options.errorClass='lazy-error'] - 加载失败的CSS类名
   */
  constructor(options = {}) {
    this.options = {
      selector: '.lazy-image',
      dataSrc: 'data-src',
      threshold: 0.1,
      throttleDelay: 200,
      loadingClass: 'lazy-loading',
      loadedClass: 'lazy-loaded',
      errorClass: 'lazy-error',
      ...options
    };

    this.images = [];
    this.observer = null;
    this.initialized = false;

    // 绑定方法的this
    this.throttledLoad = this.throttle(this.loadImages.bind(this), this.options.throttleDelay);
  }

  /**
   * 初始化懒加载
   * @returns {LazyLoad} 当前实例，支持链式调用
   */
  init() {
    if (this.initialized) return this;

    this.images = Array.from(document.querySelectorAll(this.options.selector))
      .filter(image => image.hasAttribute(this.options.dataSrc));

    if ('IntersectionObserver' in window) {
      this.initIntersectionObserver();
    } else {
      this.initLegacyLazyLoad();
    }

    this.initialized = true;
    return this;
  }

  /**
   * 使用IntersectionObserver初始化
   * @private
   */
  initIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: this.options.threshold,
      rootMargin: '0px 0px 200px 0px' // 预加载视口下方200px的图片
    });

    this.images.forEach(image => {
      this.observer.observe(image);
    });
  }

  /**
   * 初始化传统的滚动监听方式
   * @private
   */
  initLegacyLazyLoad() {
    // 初始检查
    this.loadImages();

    // 添加滚动事件监听
    window.addEventListener('scroll', this.throttledLoad);
    window.addEventListener('resize', this.throttledLoad);
    window.addEventListener('orientationchange', this.throttledLoad);
  }

  /**
   * 加载所有在可视区域内的图片
   * @private
   */
  loadImages() {
    this.images = this.images.filter(image => {
      if (this.isInViewport(image)) {
        this.loadImage(image);
        return false;
      }
      return true;
    });

    // 如果所有图片都已加载，移除事件监听
    if (this.images.length === 0) {
      this.destroy();
    }
  }

  /**
   * 加载单张图片
   * @param {HTMLImageElement} image - 要加载的图片元素
   * @private
   */
  loadImage(image) {
    const src = image.getAttribute(this.options.dataSrc);
    if (!src) return;

    // 添加加载中的类
    image.classList.add(this.options.loadingClass);

    // 设置加载事件
    image.onload = () => {
      image.removeAttribute(this.options.dataSrc);
      image.classList.remove(this.options.loadingClass);
      image.classList.add(this.options.loadedClass);

      // 触发自定义事件
      this.triggerEvent(image, 'lazyloaded');
    };

    // 设置错误处理
    image.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      image.removeAttribute(this.options.dataSrc);
      image.classList.remove(this.options.loadingClass);
      image.classList.add(this.options.errorClass);

      // 触发自定义事件
      this.triggerEvent(image, 'lazyerror');
    };

    // 触发图片加载
    image.src = src;
  }

  /**
   * 触发自定义事件
   * @param {HTMLElement} element - 要触发事件的元素
   * @param {string} eventName - 事件名称
   * @private
   */
  triggerEvent(element, eventName) {
    let event;
    if (window.CustomEvent) {
      event = new CustomEvent(eventName);
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, true, true, {});
    }
    element.dispatchEvent(event);
  }

  /**
   * 检查元素是否在可视区域内
   * @param {HTMLElement} element - 要检查的元素
   * @returns {boolean} 是否在可视区域内
   * @private
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    // 预加载视口下方200px的图片
    return (
      rect.top <= windowHeight + 200 &&
      rect.bottom >= 0 &&
      rect.left <= windowWidth &&
      rect.right >= 0
    );
  }

  /**
   * 节流函数
   * @param {Function} func - 要节流的函数
   * @param {number} delay - 延迟时间（毫秒）
   * @returns {Function} 节流后的函数
   * @private
   */
  throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  /**
   * 重新扫描页面中的懒加载图片
   * 用于动态添加的内容
   * @returns {LazyLoad} 当前实例，支持链式调用
   */
  rescan() {
    const newImages = Array.from(document.querySelectorAll(this.options.selector))
      .filter(image =>
        !this.images.includes(image) &&
        image.hasAttribute(this.options.dataSrc) &&
        !image.classList.contains(this.options.loadedClass)
      );

    if (newImages.length > 0) {
      this.images = [...this.images, ...newImages];

      if (this.observer) {
        newImages.forEach(image => this.observer.observe(image));
      } else {
        this.loadImages();
      }
    }

    return this;
  }

  /**
   * 销毁懒加载实例，移除所有事件监听
   * @returns {LazyLoad} 当前实例，支持链式调用
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    } else {
      window.removeEventListener('scroll', this.throttledLoad);
      window.removeEventListener('resize', this.throttledLoad);
      window.removeEventListener('orientationchange', this.throttledLoad);
    }

    this.initialized = false;
    return this;
  }
}

// 支持CommonJS和ES模块
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = LazyLoad;
} else {
  window.LazyLoad = LazyLoad;
}