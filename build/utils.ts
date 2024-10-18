// 定义环境变量值的类型，可以是字符串、布尔值、数字或字符串数组的元组
declare type EnvValues = string | boolean | number | [string, string][];

// 定义可记录的类型，键为字符串，值为 EnvValues 类型
declare type Recordable<T = EnvValues> = Record<string, T>;

// 定义 Vite 环境变量的接口
export interface ViteEnv {
  // 端口号
  VITE_PORT: number;
  // 代理配置
  VITE_PROXY: [string, string][];
  // 是否删除 console
  VITE_DROP_CONSOLE: boolean;
  // 是否删除 debugger
  VITE_DROP_DEBUGGER: boolean;
  // 设置 API 主机地址
  VITE_API_HOST: string;
}

// 辅助函数，用于解析和转换环境变量值
function parseEnvValue(key: string, value: string): EnvValues {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (key === 'VITE_PORT') return Number(value);
  if (key === 'VITE_PROXY') {
    try {
      return JSON.parse(value.replace(/'/g, '"'));
    } catch {
      return [];
    }
  }
  return value;
}

// 读取所有环境变量配置文件并设置到 process.env
export function wrapperEnv(envConf: Recordable): ViteEnv {
  const result: ViteEnv = {
    VITE_PORT: 8000,
    VITE_PROXY: [],
    VITE_DROP_CONSOLE: true,
    VITE_DROP_DEBUGGER: true,
    VITE_API_HOST: 'http://127.0.0.1:9300',
  };

  // 遍历所有环境变量配置
  for (const envName of Object.keys(envConf)) {
    const envValue = envConf[envName].toString().replace(/\\n/g, '\n');
    const parsedValue = parseEnvValue(envName, envValue);

    // 将解析后的值赋给 result 对应的属性
    result[envName as keyof ViteEnv] = parsedValue as never;

    // 设置到 process.env 中
    if (typeof parsedValue === 'string' || typeof parsedValue === 'number' || typeof parsedValue === 'boolean') {
      process.env[envName] = String(parsedValue);
    } else if (typeof parsedValue === 'object') {
      process.env[envName] = JSON.stringify(parsedValue);
    }
  }

  return result;
}
