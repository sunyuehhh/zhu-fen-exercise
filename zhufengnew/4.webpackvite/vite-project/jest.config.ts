import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
transform: {
  '^.+\\.ts$': 'ts-jest',
  '^.+\\.vue$': '@vue/vue3-jest',
  '^.+\\.(css|scss|png|jpg|svg)$': 'jest-transform-stub',
},
  moduleNameMapper:{//匿名别称
    "^@/(.*)$":"<rootDir>/src/$1"
  },
  testMatch: ['<rootDir>/src/**/*.spec.(t|j)s'],
  testEnvironment: 'jest-environment-jsdom', // 显式指定 jsdom 环境
  testEnvironmentOptions: {
    url: 'http://localhost', // ✅ 设置合法 URL，避免 opaque origin 报错
  },
  transformIgnorePatterns: ['/node_modules/'],
};

export default config;
