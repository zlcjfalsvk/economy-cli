import chalk from 'chalk';
import { table } from 'table';
import { EconomicIndicator } from '../types/index.js';

export class Formatter {
  static formatIndicator(indicator: EconomicIndicator): string {
    const value = this.formatValue(indicator.value, indicator.id);
    const date = this.formatDate(indicator.date);
    
    return `${chalk.cyan(indicator.title)}: ${chalk.green(value)} ${chalk.gray(`(${date})`)}`;
  }

  static formatValue(value: number, indicatorId: string): string {
    if (isNaN(value)) return 'N/A';

    switch (indicatorId) {
      case 'DFF':
        return `${value.toFixed(2)}%`;
      case 'GDPC1':
        return `${value.toLocaleString('ko-KR')} (십억 달러)`;
      case 'PAYEMS':
        return `${value.toLocaleString('ko-KR')} (천명)`;
      case 'CPIAUCSL':
      case 'PCEPILFE':
      case 'PPIACO':
        return value.toFixed(2);
      default:
        return value.toLocaleString('ko-KR');
    }
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  static formatTable(indicators: EconomicIndicator[]): string {
    const data = [
      [
        chalk.bold('지표'),
        chalk.bold('현재값'),
        chalk.bold('단위'),
        chalk.bold('날짜'),
      ],
      ...indicators.map(ind => [
        ind.title,
        this.formatValue(ind.value, ind.id),
        ind.units || '-',
        this.formatDate(ind.date),
      ]),
    ];

    const config = {
      border: {
        topBody: chalk.gray('─'),
        topJoin: chalk.gray('┬'),
        topLeft: chalk.gray('┌'),
        topRight: chalk.gray('┐'),
        bottomBody: chalk.gray('─'),
        bottomJoin: chalk.gray('┴'),
        bottomLeft: chalk.gray('└'),
        bottomRight: chalk.gray('┘'),
        bodyLeft: chalk.gray('│'),
        bodyRight: chalk.gray('│'),
        bodyJoin: chalk.gray('│'),
        joinBody: chalk.gray('─'),
        joinLeft: chalk.gray('├'),
        joinRight: chalk.gray('┤'),
        joinJoin: chalk.gray('┼'),
      },
    };

    return table(data, config);
  }

  static formatError(message: string): string {
    return chalk.red(`❌ 오류: ${message}`);
  }

  static formatSuccess(message: string): string {
    return chalk.green(`✅ ${message}`);
  }

  static formatWarning(message: string): string {
    return chalk.yellow(`⚠️  ${message}`);
  }

  static formatInfo(message: string): string {
    return chalk.blue(`ℹ️  ${message}`);
  }
}