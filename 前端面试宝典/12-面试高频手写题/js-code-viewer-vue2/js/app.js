/**
 * @description Vue2 JavaScript代码查看器
 * 提供代码片段展示、搜索、高亮、复制等功能
 */

// Vue应用实例
new Vue({
  el: "#app",

  data() {
    return {
      // 代码数据源
      codeSnippets: window.CODE_DATA || [],

      // 当前搜索关键词
      searchQuery: "",

      // 当前激活的代码片段
      activeItem: null,

      // 过滤后的代码片段
      filteredItems: [],

      // 侧边栏是否显示（移动端）
      sidebarVisible: false,

      // 搜索防抖定时器
      searchDebounceTimer: null,

      // 代码复制状态
      copyStates: {},

      // 是否已初始化
      initialized: false,

      // 显示回到顶部按钮
      showBackToTop: false,
    };
  },

  computed: {
    /**
     * 计算过滤后的代码片段列表
     */
    computedFilteredItems() {
      // if (!this.searchQuery.trim()) {
      //   return this.codeSnippets;
      // }

      // const query = this.searchQuery.toLowerCase();
      // return this.codeSnippets.filter(
      //   (item) =>
      //     item.title.toLowerCase().includes(query) ||
      //     item.description.toLowerCase().includes(query) ||
      //     item.id.toLowerCase().includes(query) ||
      //     item.code.toLowerCase().includes(query)
      // );
      return this.codeSnippets;
    },

    /**
     * 检查是否为移动设备
     */
    isMobile() {
      return window.innerWidth <= 768;
    },
  },

  watch: {
    /**
     * 监听搜索查询变化，实现防抖搜索
     */
    searchQuery(newQuery) {
      this.handleSearch(newQuery);
    },

    /**
     * 监听计算属性变化
     */
    computedFilteredItems(newItems) {
      this.filteredItems = newItems;
      // 如果当前激活项不在过滤结果中，清除激活状态
      if (
        this.activeItem &&
        !newItems.find((item) => item.id === this.activeItem)
      ) {
        this.activeItem = null;
      }
    },
  },

  mounted() {
    // Vue实例挂载后初始化
    this.initializeApp();
  },

  beforeDestroy() {
    // 清理定时器和事件监听器
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    /**
     * 初始化应用
     */
    initializeApp() {
      try {
        // 初始化过滤列表
        this.filteredItems = this.codeSnippets;

        // 初始化事件监听器
        this.initializeEventListeners();

        // 使用 nextTick 确保DOM已渲染
        this.$nextTick(() => {
          this.highlightAllCode();
          this.initialized = true;
        });
      } catch (error) {
        console.error("初始化失败:", error);
      }
    },

    /**
     * 初始化事件监听器
     */
    initializeEventListeners() {
      // 滚动事件（仅用于回到顶部按钮）
      window.addEventListener("scroll", this.handleScroll);

      // 窗口大小改变事件
      window.addEventListener("resize", this.handleResize);
    },

    /**
     * 处理搜索输入（带防抖）
     */
    handleSearch(query) {
      // 清除之前的定时器
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }

      // 设置新的防抖定时器
      this.searchDebounceTimer = setTimeout(() => {
        // console.log(query);
        // if (!query) return;
        const searchText = query.toLowerCase();

        // 获取所有导航项和代码片段
        const navItems = document.querySelectorAll(".nav-item");

        // 遍历所有导航项
        navItems.forEach((item) => {
          const targetId = item.dataset.target;
          // const codeSection = document.getElementById(`code-${targetId}`);

          // 如果导航项文本包含搜索文本，显示对应的代码片段
          if (
            item.textContent.toLowerCase().includes(searchText) ||
            searchText === ""
          ) {
            // codeSection.style.display = "block";
            item.style.display = "block";
          } else {
            // codeSection.style.display = "none";
            item.style.display = "none";
          }
        });
      }, 200);
    },

    /**
     * 清除搜索
     */
    clearSearch() {
      this.searchQuery = "";
    },

    /**
     * 滚动到指定代码片段
     */
    scrollToSection(itemId) {
      // 设置激活项
      this.activeItem = itemId;

      // 滚动到对应元素
      this.$nextTick(() => {
        const element = document.getElementById(`code-${itemId}`);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });

      // 移动端收起侧边栏
      if (window.innerWidth <= 768) {
        this.sidebarVisible = false;
      }
    },

    /**
     * 处理滚动事件
     */
    handleScroll() {
      // 仅更新回到顶部按钮显示状态
      this.showBackToTop = window.pageYOffset > 300;
    },

    /**
     * 处理窗口大小改变
     */
    handleResize() {
      // 大屏幕时自动显示侧边栏
      if (window.innerWidth > 768) {
        this.sidebarVisible = true;
      } else {
        this.sidebarVisible = false;
      }
    },

    /**
     * 切换侧边栏显示状态
     */
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    },

    /**
     * 高亮所有代码块
     */
    highlightAllCode() {
      console.log(Prism);
      if (typeof Prism !== "undefined") {
        // 使用requestAnimationFrame提升性能
        requestAnimationFrame(() => {
          Prism.highlightAll();
        });
      }
    },

    /**
     * 复制代码到剪贴板
     */
    async copyCode(code, itemId) {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          // 使用现代异步剪贴板API
          await navigator.clipboard.writeText(code);
        } else {
          // 降级到传统方法
          const textArea = document.createElement("textarea");
          textArea.value = code;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          textArea.remove();
        }

        // 设置复制成功状态
        this.$set(this.copyStates, itemId, true);

        // 2秒后重置状态
        setTimeout(() => {
          this.$set(this.copyStates, itemId, false);
        }, 2000);
      } catch (error) {
        console.error("复制失败:", error);
        alert("复制失败，请手动复制代码");
      }
    },

    /**
     * 回到顶部
     */
    backToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    /**
     * 获取代码语言类型（用于Prism高亮）
     */
    getCodeLanguage(code) {
      // 简单的语言检测
      if (
        code.includes("function") ||
        code.includes("const") ||
        code.includes("let")
      ) {
        return "javascript";
      }
      return "javascript"; // 默认为JavaScript
    },

    /**
     * 格式化代码片段标题
     */
    formatTitle(title) {
      return title.replace(/[^\w\s]/gi, "").trim();
    },
  },
});
