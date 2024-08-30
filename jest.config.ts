import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions} from "./tsconfig.json"

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {},
    { prefix: '<rootDir>/' }),
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleDirectories:["node_modules", "src"],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
