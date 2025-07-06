import fs from 'fs';
import path from 'path';

// sitemap.xml을 dist에서 public으로 복사
const srcPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
const destPath = path.join(process.cwd(), 'public', 'sitemap.xml');

try {
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log('✅ sitemap.xml이 public 폴더에 복사되었습니다.');
  } else {
    console.log('⚠️  dist/sitemap.xml 파일을 찾을 수 없습니다. 먼저 빌드를 실행해주세요.');
  }
} catch (error) {
  console.error('❌ sitemap.xml 복사 중 오류가 발생했습니다:', error);
} 