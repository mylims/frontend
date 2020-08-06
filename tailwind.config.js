module.exports = {
  purge: {
    enabled: true,
    content: [
      './src/components/*.tsx',
      './src/views/**/*.tsx',
      './src/views/*.tsx',
    ],
  },
  theme: { extend: {} },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
};
