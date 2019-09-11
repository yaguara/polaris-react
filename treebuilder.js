"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var ts = __importStar(require("typescript"));
var glob_1 = __importDefault(require("glob"));
var node_cmd_1 = __importDefault(require("node-cmd"));
var graph = {};
function compile(fileNames, options) {
    var program = ts.createProgram(fileNames, options);
    fileNames.map(function (fileName) {
        if (!graph[path_1["default"].resolve(fileName)]) {
            var ast = program.getSourceFile(fileName);
            recurse({
                fileName: skipIndexFile(path_1["default"].resolve(ast.originalFileName)),
                dependsOn: [],
                dependedOnBy: []
            });
        }
    });
    function recurse(node) {
        var ast = program.getSourceFile(node.fileName);
        if (ast && ast.resolvedModules) {
            var dependencies = Array.from(ast.resolvedModules.entries())
                .map(function (_a) {
                var key = _a[0], module = _a[1];
                if (!module) {
                    return recurse({
                        fileName: path_1["default"].resolve(ast.originalFileName.replace(/(.*\/)(.*)/, "$1" + key)),
                        dependsOn: [],
                        dependedOnBy: [node]
                    });
                }
                if (module.isExternalLibraryImport) {
                    return undefined;
                }
                var moduleFileName = module.resolvedFileName;
                var newNode;
                if (graph[path_1["default"].resolve(moduleFileName)]) {
                    newNode = graph[path_1["default"].resolve(moduleFileName)];
                    newNode.dependedOnBy.push(node);
                }
                else {
                    newNode = recurse({
                        fileName: skipIndexFile(moduleFileName),
                        dependsOn: [],
                        dependedOnBy: [node]
                    });
                }
                return newNode;
            })
                .filter(function (node) { return node; });
            node.dependsOn = dependencies;
        }
        graph[path_1["default"].resolve(node.fileName)] = node;
        return node;
    }
    function skipIndexFile(fileName) {
        if (/(components\/)(\w*\/)?(index.ts)/.test(fileName)) {
            var ast = program.getSourceFile(fileName);
            return Array.from(ast.resolvedModules.values())[0]
                .resolvedFileName;
        }
        return fileName;
    }
}
function findDependencies(fileName) {
    var dependencies = {};
    recurse(graph[path_1["default"].resolve(fileName)], 0);
    function recurse(node, depth) {
        if (node.dependedOnBy) {
            node.dependedOnBy.forEach(function (dependency) {
                dependencies[dependency.fileName] = 1;
                recurse(dependency, depth + 1);
            });
        }
    }
    return Object.keys(dependencies).filter(function (dependency) {
        return dependency !==
            '/Users/andrerocha/src/github.com/Shopify/polaris-react/src/components/index.ts';
    });
}
function getGitStagedFiles() {
    return new Promise(function (resolve, reject) {
        node_cmd_1["default"].get('git status --no-renames -s', function (err, data, stderr) {
            if (err) {
                reject(err);
                return;
            }
            resolve(data
                .split('\n')
                .filter(function (datum) {
                return ['M', 'A'].includes(datum[0]) || ['M', 'A'].includes(datum[1]);
            })
                .map(function (datum) { return datum.slice(3); }));
        });
    });
}
exports.getGitStagedFiles = getGitStagedFiles;
function getDependencies(codebaseGlob, ignoreGlob, fileGlobs) {
    var codebase = glob_1["default"].sync(codebaseGlob, {
        ignore: ignoreGlob
    });
    compile(codebase, {
        noEmitOnError: true,
        noImplicitAny: true,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS
    });
    return fileGlobs
        .map(function (fileGlob) { return glob_1["default"].sync(fileGlob); })
        .reduce(function (accumulator, current) { return accumulator.concat(current); }, [])
        .map(findDependencies);
}
exports.getDependencies = getDependencies;
