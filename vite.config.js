export default ({ command }) => ({
    root: '.',
    // Use repo path only for the production build
    base: command === 'build' ? '/p5_bitfields/' : '/',
    
    build: {
        outDir: 'dist',
        emptyOutDir: true
    }
});
