/**
 * Polaris sizes everything in rem.
 * Shopify and Polaris assumes a :root font-size of 10px.
 * UXPin uses a :root font-size of 16px.
 *
 * This means that if we leave everything as-is then everything ends up being
 * 1.6x too large in UXPin's UI.
 *
 * This plugin converts all rem sizes into their px values so that components
 * are correctly sized in UXPin's UI.
 */

const postcss = require('postcss');

const REM_REGEX = /([0-9]*\.?[0-9]+)rem/g;

module.exports = postcss.plugin('remtopx', function(opts) {
  const options = {rootFontSize: 10, ...opts};

  function replacePx(match, num) {
    return `${parseFloat(num) * options.rootFontSize}px`;
  }

  return function remtopx(css) {
    css.walkDecls(function(decl) {
      if (decl.value.indexOf('rem') === -1) {
        return;
      }

      decl.value = decl.value.replace(REM_REGEX, replacePx);
    });

    css.walkAtRules('media', function(rule) {
      if (rule.params.indexOf('rem') === -1) {
        return;
      }

      rule.params = rule.params.replace(REM_REGEX, replacePx);
    });
  };
});
