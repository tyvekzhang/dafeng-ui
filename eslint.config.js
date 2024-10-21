import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// 导出eslint配置
export default tseslint.config(
  // 忽略dist目录
  { ignores: ['dist'] },
  {
    // 扩展推荐的eslint和typescript-eslint 配置
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    // 指定要lint的文件类型
    files: ['**/*.{ts,tsx}'],
    // 语言选项配置
    languageOptions: {
      // 设置ECMAScript版本
      ecmaVersion: 2020,
      // 设置全局变量为浏览器环境
      globals: globals.browser,
    },
    // 插件配置
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    // 规则配置
    rules: {
      // 使用react-hooks推荐的规则
      ...reactHooks.configs.recommended.rules,
      // 配置react-refresh插件的规则，警告级别，允许常量导出
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
