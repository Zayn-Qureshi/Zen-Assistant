import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    return {
        // 1. ADD BASE PATH FOR DEPLOYMENT (use './' for safest static hosting)
        base: './', 
        
        server: {
            port: 3000,
            host: '0.0.0.0',
        },
        plugins: [react()],
        
        // 2. REMOVE the unnecessary 'define' block. Vite handles VITE_ variables automatically.
        
        // You might use 'resolve.alias' later, but for now, we'll keep it simple.
        // resolve: {
        //   alias: {
        //     '@': path.resolve(__dirname, '.'),
        //   }
        // }
    };
});