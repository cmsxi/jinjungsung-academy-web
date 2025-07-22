import fs from 'fs';
import path from 'path';

// sitemap.xml을 public에서 dist로 복사 (역방향)
const srcPath = path.join(process.cwd(), 'public', 'sitemap.xml');
const destPath = path.join(process.cwd(), 'dist', 'sitemap.xml');

try {
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  } else {
  }
} catch (error) {
  console.error('❌ sitemap.xml 복사 중 오류가 발생했습니다:', error);
} 