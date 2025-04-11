# 🎯 槓桿導向學習系統

基於 Notion API 的個人知識管理系統，通過精準的主題學習來提升整體學習效率。

## 📚 系統結構

### 1. Dashboard
- 任務導航
- 日常引導儀式
- 進度追蹤

### 2. 主攻主題模塊
- Notion PKM
- 生理學學習策略設計

### 3. 槓桿模組區
- 認知心理
- Python/Flask
- 熱力學（熵）
- 神經激素
- AI Prompt 工程
- 博弈論/決策邏輯

### 4. 每日輸出卡系統
- 結構化輸出模板
- 知識關聯追蹤
- 學習效果評估

### 5. 語意資源區
- 比喻卡數據庫
- Prompt 模板庫
- 潛意識啟動問題集

## 🚀 快速開始

### 安裝依賴
```bash
npm install
```

### 設置環境變量
1. 複製 `.env.example` 為 `.env`
2. 填入您的 Notion API 密鑰和頁面 ID

### 初始化 Notion 數據庫
```bash
npm run setup
```

### 記錄操作
每次執行操作後，運行以下命令記錄操作：
```bash
npm run log
```

## 📝 使用指南

詳細的使用指南請參考 [Notion 整合方案實現指南](./docs/notion_integration_guide.md)

## 📊 操作日誌

所有操作都會記錄在 [操作日誌](./docs/operation_log.md) 中，方便追蹤和回顧。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來幫助改進這個系統。

## �� 許可證

MIT License
