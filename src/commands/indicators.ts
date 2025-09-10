import ora from 'ora';
import chalk from 'chalk';
import { table } from 'table';
import { FredApiClient } from '../api/fredClient.js';
import { INDICATORS } from '../utils/config.js';
import { Formatter } from '../utils/formatter.js';
import { EconomicIndicator } from '../types/index.js';
import { EstimatesProvider } from '../utils/estimatesProvider.js';

export class IndicatorCommands {
  private client: FredApiClient;
  private estimatesProvider: EstimatesProvider;

  constructor() {
    this.client = new FredApiClient();
    this.estimatesProvider = new EstimatesProvider();
  }

  async getAllIndicators(): Promise<void> {
    const spinner = ora('경제 지표 데이터를 가져오는 중...').start();
    
    try {
      const indicators: EconomicIndicator[] = [];
      const errors: string[] = [];

      for (const [, config] of Object.entries(INDICATORS())) {
        try {
          spinner.text = `${config.name} 데이터를 가져오는 중...`;
          const indicator = await this.client.getLatestObservation(
            config.seriesId,
            config.name
          );
          
          if (indicator) {
            indicators.push(indicator);
          } else {
            errors.push(`${config.name}: 데이터 없음`);
          }
        } catch (error) {
          errors.push(`${config.name}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
      }

      spinner.stop();

      if (indicators.length > 0) {
        console.log('\n' + chalk.bold.cyan('📊 미국 주요 경제 지표'));
        console.log(Formatter.formatTable(indicators));
        console.log(Formatter.formatInfo(`마지막 업데이트: ${new Date().toLocaleString('ko-KR')}`));
      }

      if (errors.length > 0) {
        console.log('\n' + chalk.yellow('경고:'));
        errors.forEach(error => console.log(Formatter.formatWarning(error)));
      }

    } catch (error) {
      spinner.stop();
      console.error(Formatter.formatError(
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      ));
      process.exit(1);
    }
  }

  async getSpecificIndicator(indicatorKey: string): Promise<void> {
    const indicators = INDICATORS();
    const config = indicators[indicatorKey];
    
    if (!config) {
      console.error(Formatter.formatError(
        `'${indicatorKey}'는 유효하지 않은 지표입니다. 사용 가능한 지표: ${Object.keys(indicators).join(', ')}`
      ));
      process.exit(1);
    }

    const spinner = ora(`${config.name} 데이터를 가져오는 중...`).start();

    try {
      const indicator = await this.client.getLatestObservation(
        config.seriesId,
        config.name
      );

      spinner.stop();

      if (indicator) {
        console.log('\n' + chalk.bold.cyan(`📊 ${config.name}`));
        console.log(chalk.gray(config.description));
        console.log('\n' + Formatter.formatIndicator(indicator));
        console.log('\n' + Formatter.formatInfo(`마지막 업데이트: ${new Date().toLocaleString('ko-KR')}`));
      } else {
        console.log(Formatter.formatWarning('데이터를 찾을 수 없습니다.'));
      }

    } catch (error) {
      spinner.stop();
      console.error(Formatter.formatError(
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      ));
      process.exit(1);
    }
  }

  async getHistorical(indicatorKey: string, limit: number = 10): Promise<void> {
    const indicators = INDICATORS();
    const config = indicators[indicatorKey];
    
    if (!config) {
      console.error(Formatter.formatError(
        `'${indicatorKey}'는 유효하지 않은 지표입니다. 사용 가능한 지표: ${Object.keys(indicators).join(', ')}`
      ));
      process.exit(1);
    }

    const spinner = ora(`${config.name} 과거 데이터를 가져오는 중...`).start();

    try {
      const data = await this.client.getHistoricalData(config.seriesId, undefined, undefined, limit);
      
      spinner.stop();

      if (data.observations.length > 0) {
        console.log('\n' + chalk.bold.cyan(`📊 ${config.name} - 과거 ${limit}개 데이터`));
        console.log(chalk.gray(config.description));
        
        const tableData = data.observations.map(obs => {
          const value = parseFloat(obs.value);
          return [
            Formatter.formatDate(obs.date),
            Formatter.formatValue(value, config.seriesId),
          ];
        });

        const formattedTable = table([
          [chalk.bold('날짜'), chalk.bold('값')],
          ...tableData,
        ]);

        console.log('\n' + formattedTable);
      } else {
        console.log(Formatter.formatWarning('데이터를 찾을 수 없습니다.'));
      }

    } catch (error) {
      spinner.stop();
      console.error(Formatter.formatError(
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      ));
      process.exit(1);
    }
  }

  listAvailableIndicators(): void {
    console.log('\n' + chalk.bold.cyan('📊 사용 가능한 경제 지표'));
    console.log(chalk.gray('각 지표는 --indicator 옵션과 함께 사용할 수 있습니다.\n'));

    Object.entries(INDICATORS()).forEach(([key, config]) => {
      console.log(`  ${chalk.green(key.padEnd(10))} - ${chalk.cyan(config.name)}`);
      console.log(`  ${' '.repeat(12)}${chalk.gray(config.description)}\n`);
    });

    console.log(chalk.yellow('사용 예시:'));
    console.log('  economy --indicator gdp');
    console.log('  economy --indicator fedRate --history 20');
    console.log('  economy --live gdp,cpi,fedRate');
  }

  async startLiveMonitoring(indicatorsArg: string, showEstimates: boolean = false): Promise<void> {
    console.clear();
    console.log(chalk.bold.cyan('🔄 실시간 경제 지표 모니터링 시작'));
    console.log(chalk.gray('종료하려면 Ctrl+C를 누르세요.\n'));

    const indicators = INDICATORS();
    const selectedIndicators: string[] = indicatorsArg === 'all' 
      ? Object.keys(indicators)
      : indicatorsArg.split(',').map(s => s.trim());

    // 유효성 검사
    for (const key of selectedIndicators) {
      if (!indicators[key]) {
        console.error(Formatter.formatError(
          `'${key}'는 유효하지 않은 지표입니다. 사용 가능한 지표: ${Object.keys(indicators).join(', ')}`
        ));
        process.exit(1);
      }
    }

    // 추정치는 단일 지표일 때만 표시
    if (showEstimates && selectedIndicators.length > 1) {
      console.log(Formatter.formatWarning('월스트릿 추정치는 단일 지표 모니터링 시에만 표시됩니다.'));
      showEstimates = false;
    }

    let iteration = 0;
    const updateInterval = 30000; // 30초마다 업데이트

    const indicatorConfigs = indicators; // Store the config object
    
    const updateData = async () => {
      const currentTime = new Date().toLocaleString('ko-KR');
      
      // 화면 지우고 헤더 다시 표시
      console.clear();
      console.log(chalk.bold.cyan('🔄 실시간 경제 지표 모니터링'));
      console.log(chalk.gray(`업데이트 주기: ${updateInterval / 1000}초 | 종료: Ctrl+C`));
      console.log(chalk.gray(`현재 시간: ${currentTime}`));
      console.log(chalk.gray(`업데이트 횟수: ${++iteration}\n`));

      const indicatorData: EconomicIndicator[] = [];
      const errors: string[] = [];

      for (const key of selectedIndicators) {
        const config = indicatorConfigs[key as keyof typeof indicatorConfigs];
        try {
          const indicator = await this.client.getLatestObservation(
            config.seriesId,
            config.name
          );
          
          if (indicator) {
            indicatorData.push(indicator);
          } else {
            errors.push(`${config.name}: 데이터 없음`);
          }
        } catch (error) {
          errors.push(`${config.name}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
      }

      if (indicatorData.length > 0) {
        console.log(Formatter.formatTable(indicatorData));
        
        // 단일 지표 + 추정치 옵션이 활성화된 경우
        if (showEstimates && selectedIndicators.length === 1) {
          const key = selectedIndicators[0];
          const config = indicatorConfigs[key as keyof typeof indicatorConfigs];
          const estimates = await this.estimatesProvider.getEstimates(config.seriesId);
          
          if (estimates && indicatorData[0]) {
            console.log('\n' + chalk.bold.yellow('📊 월스트릿 추정치 vs 실제값'));
            
            const actual = indicatorData[0].value;
            const comparison = this.estimatesProvider.compareWithActual(actual, estimates.consensusEstimate);
            
            // 비교 결과 표시
            const surpriseIcon = comparison.surprise === 'positive' ? '📈' : 
                                comparison.surprise === 'negative' ? '📉' : '➡️';
            const surpriseColor = comparison.surprise === 'positive' ? chalk.green : 
                                 comparison.surprise === 'negative' ? chalk.red : chalk.yellow;
            
            console.log(chalk.white(`\n실제값: ${Formatter.formatValue(actual, config.seriesId)}`));
            console.log(chalk.white(`컨센서스: ${Formatter.formatValue(estimates.consensusEstimate, config.seriesId)}`));
            console.log(surpriseColor(`차이: ${comparison.difference > 0 ? '+' : ''}${comparison.difference.toFixed(2)} (${comparison.percentDifference > 0 ? '+' : ''}${comparison.percentDifference.toFixed(2)}%) ${surpriseIcon}`));
            
            // 추정치 범위
            console.log(chalk.gray(`\n추정치 범위: ${Formatter.formatValue(estimates.low, config.seriesId)} ~ ${Formatter.formatValue(estimates.high, config.seriesId)}`));
            console.log(chalk.gray(`중간값: ${Formatter.formatValue(estimates.median, config.seriesId)}`));
            console.log(chalk.gray(`참여 기관 수: ${estimates.numberOfEstimates}개`));
            
            // 주요 기관 추정치 (상위 5개)
            console.log(chalk.bold.cyan('\n주요 기관 추정치:'));
            const topEstimates = estimates.estimates.slice(0, 5);
            const estimatesData = topEstimates.map(est => [
              est.institution,
              Formatter.formatValue(est.estimate, config.seriesId),
              est.confidence ? 
                (est.confidence === 'high' ? chalk.green('높음') : 
                 est.confidence === 'medium' ? chalk.yellow('중간') : 
                 chalk.red('낮음')) : '-',
              Formatter.formatDate(est.date),
            ]);
            
            const estimatesTable = table([
              [chalk.bold('기관'), chalk.bold('추정치'), chalk.bold('신뢰도'), chalk.bold('날짜')],
              ...estimatesData,
            ]);
            
            console.log(estimatesTable);
            
            if (estimates.nextReleaseDate) {
              console.log(chalk.blue(`\n다음 발표 예정일: ${Formatter.formatDate(estimates.nextReleaseDate)}`));
            }
          }
        }
      }

      if (errors.length > 0) {
        console.log(chalk.yellow('\n경고:'));
        errors.forEach(error => console.log(Formatter.formatWarning(error)));
      }

      // 다음 업데이트까지 카운트다운
      console.log(chalk.gray(`\n다음 업데이트: ${updateInterval / 1000}초 후...`));
    };

    // 첫 번째 업데이트 즉시 실행
    await updateData();

    // 주기적으로 업데이트
    const intervalId = setInterval(updateData, updateInterval);

    // Ctrl+C 처리
    process.on('SIGINT', () => {
      clearInterval(intervalId);
      console.log('\n' + Formatter.formatInfo('실시간 모니터링을 종료합니다.'));
      process.exit(0);
    });

    // 프로세스가 종료되지 않도록 유지
    await new Promise(() => {});
  }
}