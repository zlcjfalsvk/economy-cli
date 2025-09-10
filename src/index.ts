#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { IndicatorCommands } from './commands/indicators.js';
import { FRED_API_KEY } from './utils/config.js';
import { Formatter } from './utils/formatter.js';

const program = new Command();
const indicatorCommands = new IndicatorCommands();

program
  .name('economy')
  .description('미국 경제 지표를 실시간으로 조회하는 CLI 도구')
  .version('1.0.0')
  .option('-i, --indicator <type>', '특정 경제 지표 조회 (gdp, nonfarm, cpi, corePce, fedRate, ppi)')
  .option('-H, --history <count>', '과거 데이터 조회 (기본값: 10)', '10')
  .option('-l, --list', '사용 가능한 모든 지표 목록 표시')
  .option('-a, --all', '모든 주요 경제 지표 한번에 조회')
  .option('--live [indicators]', '실시간 모니터링 모드 (쉼표로 구분된 지표 또는 all)', 'all')
  .helpOption('-h, --help', '도움말 표시')
  .addHelpText('after', `
${chalk.cyan('사용 예시:')}
  $ economy --all                    # 모든 주요 경제 지표 조회
  $ economy --indicator gdp           # GDP 성장률 조회
  $ economy --indicator fedRate       # 연준 금리 조회
  $ economy --indicator cpi --history 20  # CPI 과거 20개 데이터 조회
  $ economy --list                    # 사용 가능한 지표 목록 확인
  $ economy --live                    # 모든 지표 실시간 모니터링
  $ economy --live gdp,cpi,fedRate    # 특정 지표만 실시간 모니터링

${chalk.yellow('환경 변수:')}
  FRED_API_KEY    FRED API 키 (필수)
                  https://fred.stlouisfed.org/docs/api/api_key.html 에서 발급

${chalk.green('사용 가능한 지표:')}
  gdp       GDP 성장률
  nonfarm   비농업 고용지수
  cpi       소비자물가지수 (CPI)
  corePce   근원 개인소비지출 물가지수 (Core PCE)
  fedRate   연준 금리
  ppi       생산자물가지수 (PPI)

${chalk.gray('자세한 정보는 https://github.com/yourusername/economy-cli 를 참조하세요.')}
`);

async function main() {
  try {
    if (!FRED_API_KEY) {
      console.error(Formatter.formatError(
        'FRED_API_KEY 환경변수가 설정되지 않았습니다.\n' +
        '  1. https://fred.stlouisfed.org/docs/api/api_key.html 에서 API 키를 발급받으세요.\n' +
        '  2. 환경변수를 설정하세요: export FRED_API_KEY=your_api_key\n' +
        '  3. 또는 .env 파일에 FRED_API_KEY=your_api_key 를 추가하세요.'
      ));
      process.exit(1);
    }

    program.parse(process.argv);
    const options = program.opts();

    if (options.list) {
      indicatorCommands.listAvailableIndicators();
    } else if (options.live) {
      await indicatorCommands.startLiveMonitoring(options.live);
    } else if (options.all) {
      await indicatorCommands.getAllIndicators();
    } else if (options.indicator) {
      const historyCount = parseInt(options.history);
      
      if (historyCount > 1) {
        await indicatorCommands.getHistorical(options.indicator, historyCount);
      } else {
        await indicatorCommands.getSpecificIndicator(options.indicator);
      }
    } else {
      await indicatorCommands.getAllIndicators();
    }
  } catch (error) {
    console.error(Formatter.formatError(
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    ));
    process.exit(1);
  }
}

main();