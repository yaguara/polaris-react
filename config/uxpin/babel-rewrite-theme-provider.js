module.exports = function builder({types: t}) {
  let isThemeProviderClass = false;
  let isRenderMethod = false;

  return {
    visitor: {
      ClassDeclaration(path) {
        isThemeProviderClass = path.node.id.name === 'ThemeProvider';
      },
      ClassProperty(path) {
        isRenderMethod = path.node.key.name === 'render';
        console.log(
          'method',
          path.node.key.name,
          isThemeProviderClass,
          isRenderMethod,
        );
      },
      VariableDeclarator(path) {
        // console.log(isThemeProviderClass, isRenderMethod, path.node.name);
        if (!isThemeProviderClass) {
          return;
        }

        if (path.node.id.name === 'style') {
          console.log('IN THE STYLE VARIABLE', path.node);
        }
      },
    },
  };
};
