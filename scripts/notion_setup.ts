import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function createDatabase(parentPageId: string, title: string, properties: any) {
  const response = await notion.databases.create({
    parent: { page_id: parentPageId },
    title: [{ type: 'text', text: { content: title } }],
    properties,
  });
  return response.id;
}

async function setup() {
  try {
    const pageId = process.env.NOTION_PAGE_ID;
    if (!pageId) {
      throw new Error('請在 .env 文件中設置 NOTION_PAGE_ID');
    }

    // 創建主題數據庫
    const mainTopicsDbId = await createDatabase(pageId, '主要主題', {
      '標題': { title: {} },
      '狀態': { select: { options: [
        { name: '進行中', color: 'blue' },
        { name: '已完成', color: 'green' },
        { name: '待處理', color: 'gray' }
      ]}},
      '優先級': { select: { options: [
        { name: '高', color: 'red' },
        { name: '中', color: 'yellow' },
        { name: '低', color: 'green' }
      ]}},
      '最後更新': { date: {} }
    });

    // 創建槓桿模塊數據庫
    const leverageModulesDbId = await createDatabase(pageId, '槓桿模塊', {
      '標題': { title: {} },
      '類型': { select: { options: [
        { name: '工具', color: 'blue' },
        { name: '方法', color: 'green' },
        { name: '資源', color: 'purple' }
      ]}},
      '狀態': { select: { options: [
        { name: '可用', color: 'green' },
        { name: '開發中', color: 'yellow' },
        { name: '已棄用', color: 'red' }
      ]}}
    });

    // 創建每日輸出數據庫
    const dailyOutputDbId = await createDatabase(pageId, '每日輸出', {
      '日期': { date: {} },
      '內容': { rich_text: {} },
      '類型': { select: { options: [
        { name: '筆記', color: 'blue' },
        { name: '想法', color: 'green' },
        { name: '任務', color: 'red' }
      ]}}
    });

    // 創建語義資源數據庫
    const semanticResourcesDbId = await createDatabase(pageId, '語義資源', {
      '標題': { title: {} },
      '類型': { select: { options: [
        { name: '文章', color: 'blue' },
        { name: '視頻', color: 'green' },
        { name: '音頻', color: 'purple' }
      ]}},
      '標籤': { multi_select: { options: [
        { name: '學習', color: 'blue' },
        { name: '工作', color: 'green' },
        { name: '生活', color: 'yellow' }
      ]}}
    });

    // 更新 .env 文件
    const envPath = path.join(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf-8');
    
    envContent = envContent.replace(
      'NOTION_MAIN_TOPICS_DB=your_main_topics_database_id',
      `NOTION_MAIN_TOPICS_DB=${mainTopicsDbId}`
    );
    envContent = envContent.replace(
      'NOTION_LEVERAGE_MODULES_DB=your_leverage_modules_database_id',
      `NOTION_LEVERAGE_MODULES_DB=${leverageModulesDbId}`
    );
    envContent = envContent.replace(
      'NOTION_DAILY_OUTPUT_DB=your_daily_output_database_id',
      `NOTION_DAILY_OUTPUT_DB=${dailyOutputDbId}`
    );
    envContent = envContent.replace(
      'NOTION_SEMANTIC_RESOURCES_DB=your_semantic_resources_database_id',
      `NOTION_SEMANTIC_RESOURCES_DB=${semanticResourcesDbId}`
    );

    fs.writeFileSync(envPath, envContent);

    console.log('Notion 數據庫設置完成！');
    console.log('數據庫 ID 已更新到 .env 文件中');
    console.log('\n您可以在 Notion 中查看以下數據庫：');
    console.log(`1. 主要主題: ${mainTopicsDbId}`);
    console.log(`2. 槓桿模塊: ${leverageModulesDbId}`);
    console.log(`3. 每日輸出: ${dailyOutputDbId}`);
    console.log(`4. 語義資源: ${semanticResourcesDbId}`);

  } catch (error) {
    console.error('設置過程中發生錯誤：', error);
  }
}

setup(); 