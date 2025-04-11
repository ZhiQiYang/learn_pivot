import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function createDatabase(title: string, properties: any) {
  return await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: process.env.NOTION_PAGE_ID,
    },
    title: [
      {
        type: 'text',
        text: {
          content: title,
        },
      },
    ],
    properties,
  });
}

async function setupDatabases() {
  // 創建主攻主題數據庫
  const mainTopicsDb = await createDatabase('主攻主題', {
    Title: {
      title: {},
    },
    Status: {
      select: {
        options: [
          { name: '進行中', color: 'blue' },
          { name: '已完成', color: 'green' },
        ],
      },
    },
    '開始日期': {
      date: {},
    },
    '預計完成日期': {
      date: {},
    },
    Progress: {
      number: {
        format: 'percent',
      },
    },
  });

  // 創建槓桿模組數據庫
  const leverageModulesDb = await createDatabase('槓桿模組', {
    Title: {
      title: {},
    },
    Type: {
      select: {
        options: [
          { name: '認知心理', color: 'purple' },
          { name: 'Python', color: 'blue' },
          { name: '熱力學', color: 'red' },
          { name: '神經激素', color: 'green' },
          { name: 'AI Prompt', color: 'orange' },
          { name: '博弈論', color: 'yellow' },
        ],
      },
    },
    Status: {
      select: {
        options: [
          { name: '活躍', color: 'green' },
          { name: '暫停', color: 'yellow' },
          { name: '完成', color: 'blue' },
        ],
      },
    },
  });

  // 創建每日輸出數據庫
  const dailyOutputDb = await createDatabase('每日輸出', {
    Title: {
      title: {},
    },
    Date: {
      date: {},
    },
    Topic: {
      relation: {
        database_id: mainTopicsDb.id,
        single_property: {},
      },
    },
    '使用的槓桿模組': {
      relation: {
        database_id: leverageModulesDb.id,
        single_property: {},
      },
    },
    '比喻內容': {
      rich_text: {},
    },
    '觸發聯想': {
      rich_text: {},
    },
    '應用場景': {
      rich_text: {},
    },
    '學習收穫': {
      rich_text: {},
    },
    '改進點': {
      rich_text: {},
    },
    '明日計劃': {
      rich_text: {},
    },
  });

  // 創建語意資源數據庫
  const semanticResourcesDb = await createDatabase('語意資源', {
    Title: {
      title: {},
    },
    Type: {
      select: {
        options: [
          { name: '比喻卡', color: 'purple' },
          { name: 'Prompt模板', color: 'blue' },
          { name: '問題集', color: 'green' },
        ],
      },
    },
    Content: {
      rich_text: {},
    },
    Tags: {
      multi_select: {
        options: [
          { name: '學習', color: 'blue' },
          { name: '思考', color: 'green' },
          { name: '創意', color: 'purple' },
        ],
      },
    },
  });

  console.log('數據庫創建完成！');
  console.log('主攻主題數據庫 ID:', mainTopicsDb.id);
  console.log('槓桿模組數據庫 ID:', leverageModulesDb.id);
  console.log('每日輸出數據庫 ID:', dailyOutputDb.id);
  console.log('語意資源數據庫 ID:', semanticResourcesDb.id);
}

setupDatabases().catch(console.error); 