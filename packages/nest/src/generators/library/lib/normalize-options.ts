import { extractLayoutDirectory, Tree } from '@nrwl/devkit';
import { getWorkspaceLayout, joinPathFragments, names } from '@nrwl/devkit';
import type { LibraryGeneratorSchema as JsLibraryGeneratorSchema } from '@nrwl/js/src/utils/schema';
import { Linter } from '@nrwl/linter';
import type { LibraryGeneratorOptions, NormalizedOptions } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: LibraryGeneratorOptions
): NormalizedOptions {
  const { layoutDirectory, projectDirectory } = extractLayoutDirectory(
    options.directory
  );
  const { libsDir: defaultLibsDir, npmScope } = getWorkspaceLayout(tree);
  const libsDir = layoutDirectory ?? defaultLibsDir;
  const name = names(options.name).fileName;
  const fullProjectDirectory = projectDirectory
    ? `${names(projectDirectory).fileName}/${name}`
    : name;

  const projectName = fullProjectDirectory.replace(new RegExp('/', 'g'), '-');
  const fileName = projectName;
  const projectRoot = joinPathFragments(libsDir, fullProjectDirectory);

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const normalized: NormalizedOptions = {
    ...options,
    controller: options.controller ?? false,
    fileName,
    global: options.global ?? false,
    linter: options.linter ?? Linter.EsLint,
    parsedTags,
    prefix: npmScope, // we could also allow customizing this
    projectDirectory: fullProjectDirectory,
    projectName,
    projectRoot,
    service: options.service ?? false,
    target: options.target ?? 'es6',
    testEnvironment: options.testEnvironment ?? 'node',
    unitTestRunner: options.unitTestRunner ?? 'jest',
    libsDir,
  };

  return normalized;
}

export function toJsLibraryGeneratorOptions(
  options: LibraryGeneratorOptions
): JsLibraryGeneratorSchema {
  return {
    name: options.name,
    buildable: options.buildable,
    directory: options.directory,
    importPath: options.importPath,
    linter: options.linter,
    publishable: options.publishable,
    skipFormat: true,
    skipTsConfig: options.skipTsConfig,
    strict: options.strict,
    tags: options.tags,
    testEnvironment: options.testEnvironment,
    unitTestRunner: options.unitTestRunner,
    config: options.standaloneConfig ? 'project' : 'workspace',
    setParserOptionsProject: options.setParserOptionsProject,
  };
}
