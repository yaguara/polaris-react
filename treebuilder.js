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
var graph = {};
function compile(fileNames, options) {
    var program = ts.createProgram(fileNames, options);
    fileNames.map(function (fileName) {
        if (!graph[path_1["default"].resolve(fileName)]) {
            var ast = program.getSourceFile(fileName);
            recurse({
                fileName: path_1["default"].resolve(ast.originalFileName),
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
                        fileName: moduleFileName,
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
}
function findDependencies(fileName) {
    var dependencies = [];
    recurse(graph[path_1["default"].resolve(fileName)]);
    function recurse(node) {
        node.dependedOnBy.forEach(function (dependency) {
            dependencies.push(dependency.fileName);
            recurse(dependency);
        });
    }
    return dependencies;
}
var files = glob_1["default"].sync(process.argv[2], {
    ignore: process.argv[3]
});
compile(files, {
    noEmitOnError: true,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});
console.log(findDependencies(process.argv[4]));
debugger;
