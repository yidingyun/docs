import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import pinyinModule from 'pinyin';
import translationMap from './translationMap'; // 导入翻译对照表

// 使用用户定义的 getPinyin 函数
const { pinyin } = pinyinModule;

function getPinyin(pkg: string): string {
  const name = pinyin(pkg, {
    segment: '@node-rs/jieba', // 启用分词
    style: 'NORMAL',
  })
    .flat()
    .join('');
  return name;
}

// 自定义解析文件名和扩展名的函数，处理多个点号
function customParseFilename(filename: string): { name: string, ext: string } {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return { name: filename, ext: '' };
  }
  const name = filename.slice(0, lastDotIndex);
  const ext = filename.slice(lastDotIndex);
  return { name, ext };
}

// 根据翻译对照表或拼音转换，忽略文件后缀
function convertToPinyinOrTranslation(text: string): string {
  const cleanName = text.replace(/^\d+\./, ''); // 先清理前导数字和点号
  const { name, ext } = customParseFilename(cleanName); // 然后解析文件名和扩展名
  const hasChinese = /[\u4e00-\u9fa5]+/.test(name);

  // 检查是否在翻译对照表中精确匹配（不包括文件后缀）
  if (translationMap.hasOwnProperty(name)) {
    return translationMap[name] + ext;
  }

  // 如果不在翻译对照表中，使用拼音转换
  return hasChinese ? getPinyin(name) + ext : name + ext;
}

// 转换路径中的每个部分（文件夹和文件名），忽略文件后缀
function convertPathToPinyin(path: string): string {
  return path
    .split('/')
    .map(part => convertToPinyinOrTranslation(part)) // 在 map 之前先清理并转换
    .join('/');
}

// 生成目录路径映射并同时生成 sidebar 配置
function generatePathsAndSidebar(dir: string): { rewrites: Record<string, string>, sidebar: any[] } {
  const pathsMap: Record<string, string> = {};
  const sidebar: any[] = [];

  const readDirectory = (currentDir: string): any[] => {
    const items = readdirSync(currentDir).map((item) => {
      const fullPath = join(currentDir, item);
      const relativePath = join(currentDir.replace(dir, ''), item).replace(/\\/g, '/');
      const convertedRelativePath = convertPathToPinyin(relativePath);

      const originalPathWithPrefix = `${dir}${relativePath}`;
      const convertedPathWithPrefix = `${dir}${convertedRelativePath}`;

      // 更新 rewrites
      if (!statSync(fullPath).isDirectory()) {
        pathsMap[originalPathWithPrefix] = convertedPathWithPrefix;
      }

      // 提取文件名前的数字并排序
      const cleanName = item.replace(/^\d+\./, ''); // 清理前导数字和点号
      const { name } = customParseFilename(cleanName); // 去除文件后缀
      const match = item.match(/^(\d+)\./);
      const order = match ? parseInt(match[1], 10) : 9999;

      if (statSync(fullPath).isDirectory()) {
        return {
          text: name, // 去掉数字、点号和文件后缀的部分
          items: readDirectory(fullPath),
          order,
        };
      } else {
        return {
          text: name, // 去掉文件后缀
          link:`${pathsMap[originalPathWithPrefix]}` , // 使用 rewrites 处理后的链接
          order,
        };
      }
    });

    // 按文件名前的数字排序
    return items.sort((a, b) => a.order - b.order);
  };

  sidebar.push(...readDirectory(dir));

  function cleanSidebar(items: any[]): any[] {
    return items.map(({ items: subItems, link, text }) => ({
      text,
      collapsed: false,
      link: link ? `/${link}` : undefined, // 在link前添加斜杠
      items: subItems ? cleanSidebar(subItems) : undefined, // 递归处理子项
    }));
  }

// 使用递归处理 sidebar
  const cleanedSidebar = cleanSidebar(sidebar);

  return { rewrites: pathsMap, sidebar: cleanedSidebar };
}

// 调用函数生成对象
const { rewrites, sidebar } = generatePathsAndSidebar('user-guide');

// 输出生成的对象
console.log('-----------------目录结构-----------------');
console.log(rewrites);
console.log('-----------------Sidebar-----------------');
console.log(JSON.stringify(sidebar, null, 2));
console.log('------------------------------------------');

// 导出生成的对象
export { rewrites, sidebar };
