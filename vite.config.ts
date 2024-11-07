import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import imagemin from 'unplugin-imagemin/vite';
import type { ConfigEnv, UserConfig } from 'vite';
import { loadEnv } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { ViteEnv, wrapperEnv } from './build/utils';

export default ({ mode }: ConfigEnv): UserConfig => {
  // 获取当前工作目录
  const root = process.cwd();

  // 加载特定模式的环境变量
  const env = loadEnv(mode, root);

  // 包装环境变量以便使用
  const viteEnv: ViteEnv = wrapperEnv(env);
  const { VITE_PORT, VITE_DROP_CONSOLE, VITE_API_HOST } = viteEnv;

  return {
    // 设置基础路径
    base: './',
    // 服务器配置
    server: {
      // 监听所有本地IP
      host: true,
      open: true,
      port: VITE_PORT,
      // 设置代理
      proxy: {
        '/api': {
          target: VITE_API_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    // 插件配置
    plugins: [
      react(),
      imagemin({
        // 默认模式为sharp。支持squoosh和sharp
        mode: 'squoosh',
        beforeBundle: true,
        // 压缩不同图片的默认配置选项
        compress: {
          jpg: {
            quality: 10,
          },
          jpeg: {
            quality: 10,
          },
          png: {
            quality: 10,
          },
          webp: {
            quality: 10,
          },
        },
        conversion: [
          { from: 'jpeg', to: 'webp' },
          { from: 'png', to: 'webp' },
          { from: 'JPG', to: 'jpeg' },
        ],
      }),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      createSvgIconsPlugin({
        // 图标目录
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        // 图标ID格式
        symbolId: 'icon-[dir]-[name]',
      }),
    ],

    // 构建配置
    build: {
      target: 'es2015',
      cssTarget: 'chrome86',
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          // 删除生产环境中的console和debugger
          drop_console: VITE_DROP_CONSOLE,
          drop_debugger: VITE_DROP_CONSOLE,
        },
      },
      chunkSizeWarningLimit: 1000,
    },

    // 路径别名配置
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  };
};
