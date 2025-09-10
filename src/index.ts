#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { IndicatorCommands } from './commands/indicators.js';
import { FRED_API_KEY, getIndicators } from './utils/config.js';
import { Formatter } from './utils/formatter.js';
import { i18n } from './i18n/index.js';

const program = new Command();
const indicatorCommands = new IndicatorCommands();
const t = i18n.t;

program
  .name(t.cli.name)
  .description(t.cli.description)
  .version('1.0.0')
  .option('-i, --indicator <type>', `${t.commands.indicator} (gdp, nonfarm, cpi, corePce, fedRate, ppi)`)
  .option('-H, --history <count>', t.commands.history, '10')
  .option('-l, --list', t.commands.list)
  .option('-a, --all', t.commands.all)
  .option('--live [indicators]', t.commands.live)
  .option('--estimates', t.commands.estimates)
  .helpOption('-h, --help', t.commands.help)
  .addHelpText('after', () => {
    const indicators = getIndicators();
    const lang = i18n.getLanguage();
    
    const examples = lang === 'ko' ? `
${chalk.cyan(t.cli.examples + ':')}
  $ economy --all                    # 모든 주요 경제 지표 조회
  $ economy --indicator gdp           # GDP 성장률 조회
  $ economy --indicator fedRate       # 연준 금리 조회
  $ economy --indicator cpi --history 20  # CPI 과거 20개 데이터 조회
  $ economy --list                    # 사용 가능한 지표 목록 확인
  $ economy --live                    # 모든 지표 실시간 모니터링
  $ economy --live gdp,cpi,fedRate    # 특정 지표만 실시간 모니터링
  $ economy --live cpi --estimates    # CPI 실시간 모니터링 + 월스트릿 추정치` : `
${chalk.cyan(t.cli.examples + ':')}
  $ economy --all                    # Query all major economic indicators
  $ economy --indicator gdp           # Query GDP growth rate
  $ economy --indicator fedRate       # Query Federal Funds Rate
  $ economy --indicator cpi --history 20  # Query CPI with 20 historical data points
  $ economy --list                    # List available indicators
  $ economy --live                    # Monitor all indicators in real-time
  $ economy --live gdp,cpi,fedRate    # Monitor specific indicators
  $ economy --live cpi --estimates    # Monitor CPI with Wall Street estimates`;

    return `${examples}

${chalk.yellow(t.cli.environment + ':')}
  FRED_API_KEY    FRED API Key (Required)
                  https://fred.stlouisfed.org/docs/api/api_key.html
  CLI_LANG        Language setting (en/ko, default: en)

${chalk.green(t.cli.availableIndicators + ':')}
  gdp       ${indicators.gdp.name}
  nonfarm   ${indicators.nonfarm.name}
  cpi       ${indicators.cpi.name}
  corePce   ${indicators.corePce.name}
  fedRate   ${indicators.fedRate.name}
  ppi       ${indicators.ppi.name}

${chalk.gray(t.cli.moreInfo + ' https://github.com/yourusername/economy-cli')}
`;
  });

async function main() {
  try {
    if (!FRED_API_KEY) {
      console.error(Formatter.formatError(
        t.messages.apiKeyMissing + '\n' + t.messages.apiKeyInstructions
      ));
      process.exit(1);
    }

    program.parse(process.argv);
    const options = program.opts();

    if (options.list) {
      indicatorCommands.listAvailableIndicators();
    } else if (options.live !== undefined) {
      const indicatorsArg = options.live === true ? 'all' : options.live;
      await indicatorCommands.startLiveMonitoring(indicatorsArg, options.estimates || false);
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