import { defineConfig } from 'vitepress';
import Segment from 'segmentit';
import { rewrites,sidebar } from './rewrites';

const segmentit = Segment.useDefault(new Segment.Segment());

 // https://vitepress.dev/reference/site-config

export default defineConfig({
  base:"/nervui-ai-help",
  title: '算力云帮助文档',
  description: '算力云用户使用帮助',
  appearance: false,
  rewrites,
  transformPageData(pageData) {
    const canonicalUrl = `/nervui-ai-help/js/segmentit.min.js`;
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push([
      'script',
      {   src: canonicalUrl,onload:'segmentit = Segmentit.useDefault(new Segmentit.Segment());' }
    ])

  },
  themeConfig: {
    sidebarMenuLabel:"菜单",
    // home:true,
    outline:{
      label:"页面导航"
    },
    returnToTopLabel:"回到顶部",

    // nav: [
    //    { text: 'Home', link: '/user-guide/synopsis/chanpingaishu.html' },
    //   // { text: 'Examples', link: '/markdown-examples' },
    // ],
    sidebar: [

      ...sidebar
    ],

    socialLinks: [],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        },

        miniSearch: {
          /**
           * @type {Pick<import('minisearch').Options, 'extractField' | 'tokenize' | 'processTerm'>}
           */

          options: {
            // fields: ['title', 'titles', 'text', 'category'],
            // storeFields: ['title', 'titles', 'category'],
            processTerm: (term,_fieldName) => {
               if (!segmentit) return term;
              const tokens = segmentit.doSegment(term, {
                simple: true
              })
              // return term
              //   console.log('term',term, _fieldName)
              return tokens;
            }
          },
          /**
           * @type {import('minisearch').SearchOptions}
           * @default
           * { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } }
           */
          searchOptions: {
             fuzzy: 0.2,
              prefix:true,
             boost: { title: 4, text: 2, titles: 1 },
           },
        },


      },
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        // @ts-ignore
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },
  },



});
