module.exports = {
  name: 'Shopify Polaris',
  components: {
    categories: [
      {
        name: 'Actions',
        include: [
          'src/components/Button/Button.tsx',
          'src/components/Link/Link.tsx',
        ]
      },
      {
        name: 'Structure',
        include: [
          'src/components/Card/Card.tsx',
          'src/components/Card/components/Header/Header.tsx',
          'src/components/Card/components/Section/Section.tsx',
        ]
      },
      {
        name: 'Images and Icons',
        include: [
          'src/components/Avatar/Avatar.tsx',
          'src/components/Badge/Badge.tsx',
        ]
      },
    ]
  }
};
