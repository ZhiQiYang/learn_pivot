import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface OperationLog {
  timestamp: string;
  files: {
    status: 'M' | 'A' | 'D';
    path: string;
  }[];
  description: string[];
}

function getCurrentTimestamp(): string {
  const now = new Date();
  return now.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
}

function readOperationLog(): OperationLog[] {
  const logPath = path.join(__dirname, '../docs/operation_log.md');
  const content = fs.readFileSync(logPath, 'utf-8');
  
  const logs: OperationLog[] = [];
  let currentLog: OperationLog | null = null;
  
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (currentLog) {
        logs.push(currentLog);
      }
      currentLog = {
        timestamp: line.replace('### ', ''),
        files: [],
        description: []
      };
    } else if (line.startsWith('#### 修改的文件') && currentLog) {
      // Skip the header line
      continue;
    } else if (line.startsWith('- ') && currentLog) {
      if (line.includes('M ') || line.includes('A ') || line.includes('D ')) {
        const [status, filePath] = line.replace('- ', '').split(' ');
        currentLog.files.push({
          status: status as 'M' | 'A' | 'D',
          path: filePath
        });
      } else {
        currentLog.description.push(line.replace('- ', ''));
      }
    }
  }
  
  if (currentLog) {
    logs.push(currentLog);
  }
  
  return logs;
}

function writeOperationLog(logs: OperationLog[]): void {
  const logPath = path.join(__dirname, '../docs/operation_log.md');
  let content = '# 操作日誌\n\n';
  
  for (const log of logs) {
    content += `### ${log.timestamp}\n\n`;
    
    if (log.files.length > 0) {
      content += '#### 修改的文件\n';
      for (const file of log.files) {
        content += `- ${file.status} ${file.path}\n`;
      }
      content += '\n';
    }
    
    if (log.description.length > 0) {
      content += '#### 操作描述\n';
      for (const desc of log.description) {
        content += `- ${desc}\n`;
      }
      content += '\n';
    }
  }
  
  fs.writeFileSync(logPath, content);
}

function logOperation(files: { status: 'M' | 'A' | 'D'; path: string }[], description: string[]): void {
  const logs = readOperationLog();
  
  const newLog: OperationLog = {
    timestamp: getCurrentTimestamp(),
    files,
    description
  };
  
  logs.unshift(newLog);
  writeOperationLog(logs);
  
  console.log('操作已記錄到日誌中');
}

// 如果直接運行此腳本
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('用法: npm run log -- <文件狀態列表> <描述>');
    console.log('示例: npm run log -- "M README.md,A docs/guide.md" "更新文檔"');
    process.exit(1);
  }
  
  const [filesArg, ...descArgs] = args;
  const files = filesArg.split(',').map(f => {
    const [status, path] = f.trim().split(' ');
    return { status: status as 'M' | 'A' | 'D', path };
  });
  
  logOperation(files, descArgs);
}

export { logOperation }; 