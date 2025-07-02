import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { transformWithEsbuild, defineConfig } from 'vite'
import restart from 'vite-plugin-restart'
import glsl from 'vite-plugin-glsl'
import tailwindcss from '@tailwindcss/vite'  // mejor eliminar o configurar Tailwind vía postcss

export default defineConfig({
  root: 'src/',
  publicDir: '../public/',
  base: '/ShadersLab/',   // base debe estar aquí, no dentro de build
  plugins: [
    restart({ restart: ['../public/**'] }),
    react(),
    basicSsl(),
    glsl(),
    tailwindcss(),  // mejor no usar este plugin si no es estrictamente necesario
    {
      name: 'load+transform-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      },
    },
  ],
  server: {
    host: true,
    open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env),
  },
  build: {
    outDir: '../build',
    emptyOutDir: true,
    sourcemap: true,
    target: 'esnext',
  },
})
