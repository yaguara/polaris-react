# Unreleased changes

Use [the changelog guidelines](https://git.io/polaris-changelog-guidelines) to format new entries. 💜

**Use the `🤖Skip Changelog` label to ignore a failing changelog check** in your pull request if you feel the code changes do not warrant a changelog entry.

---

### Breaking changes

### Enhancements

- The styles in global.scss have been moved into AppProvider. As AppProvider is a required wrapper for polaris components this should not affect your usage. An empty global.scss is provided in order to not break existing integration with old sewing-kit versions. ([#2392](https://github.com/Shopify/polaris-react/pull/2392))

### Bug fixes

- Fixed an accessibility issue with `TextField` `multiline` where `aria-multiline` would be set to an invalid type `number` ([#2351](https://github.com/Shopify/polaris-react/pull/2351))
- Revert [#2231](https://github.com/Shopify/polaris-react/pull/2351) as it breaks middle aligned popovers ([#2237](https://github.com/Shopify/polaris-react/pull/2237))
- Fixed alignement of disclosure icons on `ResourceItem` ([#2370](https://github.com/Shopify/polaris-react/pull/2370))

### Documentation

### Development workflow

### Dependency upgrades

### Code quality

### Deprecations
