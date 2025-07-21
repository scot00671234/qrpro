import { build } from 'esbuild';

build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outdir: 'dist',
  packages: 'external',
  external: ['stripe', 'pg', 'bcrypt', 'nodemailer', 'qrcode'],
  target: 'node18',
  sourcemap: false,
  minify: false,
}).catch(() => process.exit(1));