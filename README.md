# Economy CLI 🇺🇸 📊

**English** | [한국어](./README.ko.md)

A Node.js CLI tool for real-time monitoring of major U.S. economic indicators. Provides the latest economic data through the FRED (Federal Reserve Economic Data) API.

## Key Features

- 📈 **Real-time Economic Indicators**: Monitor major indicators like GDP, CPI, PPI, employment, and Fed rates
- 📊 **Historical Data**: Query historical data for any indicator with customizable limits
- 🔄 **Live Monitoring Mode**: Continuous data updates with --live option
- 🎯 **Wall Street Estimates**: Compare actual values with institutional forecasts for single indicators
- ⚡ **Automatic Caching**: 60-second cache for fast response times
- 🔒 **Rate Limiting**: Automatic API call management
- 🎨 **Beautiful Output**: Clean data display with colors and tables

## Supported Economic Indicators

| Code      | Indicator                  | Description                                                    |
| --------- | -------------------------- | -------------------------------------------------------------- |
| `gdp`     | GDP Growth Rate            | Real Gross Domestic Product (Quarterly, Annualized)            |
| `nonfarm` | Nonfarm Payrolls           | Total Nonfarm Employment (Thousands)                           |
| `cpi`     | Consumer Price Index (CPI) | Urban Consumer Price Index (Seasonally Adjusted)               |
| `ppi`     | Producer Price Index (PPI) | Producer Price Index for All Commodities (Seasonally Adjusted) |
| `corePce` | Core PCE Price Index       | Personal Consumption Expenditures excluding Food and Energy    |
| `fedRate` | Federal Funds Rate         | Effective Federal Funds Rate (Daily)                           |

## Installation

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- FRED API Key ([Get it here](https://fred.stlouisfed.org/docs/api/api_key.html))

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/economy-cli.git
cd economy-cli

# Install dependencies
npm install --registry https://registry.npmjs.org/

# Build TypeScript
npm run build

# Global installation (optional)
npm link
```

## Configuration

### 1. Get FRED API Key

1. Visit [FRED website](https://fred.stlouisfed.org/docs/api/api_key.html)
2. Create an account or sign in
3. Request and obtain API key

### 2. Set Environment Variables

#### Method 1: Using .env file (Recommended)

Create a `.env` file in the project root:

```env
FRED_API_KEY=your_api_key_here
```

#### Method 2: System Environment Variables

```bash
# Linux/Mac
export FRED_API_KEY=your_api_key_here

# Windows (PowerShell)
$env:FRED_API_KEY="your_api_key_here"

# Windows (CMD)
set FRED_API_KEY=your_api_key_here
```

## Usage

### Basic Commands

```bash
# Query all major economic indicators
economy --all
economy -a

# Query specific indicator
economy --indicator gdp
economy -i fedRate

# Query historical data
economy --indicator cpi --history 20
economy -i cpi -H 20

# List available indicators
economy --list
economy -l

# Live monitoring mode
economy --live                    # Monitor all indicators
economy --live gdp,cpi,fedRate    # Monitor specific indicators
economy --live cpi --estimates    # Monitor CPI with Wall Street estimates

# Show help
economy --help
economy -h
```

### Examples

#### 1. Query All Economic Indicators

```bash
$ economy --all

📊 U.S. Major Economic Indicators
┌─────────────────────┬──────────────┬──────────┬─────────────┐
│ Indicator           │ Value        │ Unit     │ Date        │
├─────────────────────┼──────────────┼──────────┼─────────────┤
│ GDP Growth Rate     │ 25,460 (B)   │ Billions │ Jan 2024    │
│ Nonfarm Payrolls    │ 157,000 (K)  │ Thousands│ Jan 2024    │
│ CPI                 │ 310.33       │ Index    │ Jan 2024    │
│ PPI                 │ 289.55       │ Index    │ Jan 2024    │
│ Core PCE            │ 125.79       │ Index    │ Jan 2024    │
│ Fed Rate            │ 5.33%        │ Percent  │ Jan 2024    │
└─────────────────────┴──────────────┴──────────┴─────────────┘
ℹ️  Last updated: 2024-01-15 15:30:00
```

#### 2. Query Fed Rate Historical Data

```bash
$ economy --indicator fedRate --history 5

📊 Federal Funds Rate - Last 5 Data Points
Effective Federal Funds Rate (Daily)

┌─────────────────┬────────┐
│ Date            │ Value  │
├─────────────────┼────────┤
│ Jan 15, 2024    │ 5.33%  │
│ Jan 14, 2024    │ 5.33%  │
│ Jan 13, 2024    │ 5.33%  │
│ Jan 12, 2024    │ 5.33%  │
│ Jan 11, 2024    │ 5.33%  │
└─────────────────┴────────┘
```

#### 3. Live Monitoring Mode

```bash
$ economy --live gdp,cpi,fedRate

🔄 Real-time Economic Indicator Monitoring
Update interval: 30s | Exit: Ctrl+C
Current time: 2024-01-15 15:30:00
Update count: 1

┌─────────────────────┬──────────────┬──────────┬─────────────┐
│ Indicator           │ Value        │ Unit     │ Date        │
├─────────────────────┼──────────────┼──────────┼─────────────┤
│ GDP Growth Rate     │ 25,460 (B)   │ Billions │ Jan 2024    │
│ CPI                 │ 310.33       │ Index    │ Jan 2024    │
│ Fed Rate            │ 5.33%        │ Percent  │ Jan 2024    │
└─────────────────────┴──────────────┴──────────┴─────────────┘

Next update in 30 seconds...
```

#### 4. Live Monitoring with Wall Street Estimates

```bash
$ economy --live cpi --estimates

🔄 Real-time Economic Indicator Monitoring
Update interval: 30s | Exit: Ctrl+C
Current time: 2024-01-15 15:30:00
Update count: 1

┌─────────────────────┬──────────────┬──────────┬─────────────┐
│ Indicator           │ Value        │ Unit     │ Date        │
├─────────────────────┼──────────────┼──────────┼─────────────┤
│ CPI                 │ 310.33       │ Index    │ Jan 2024    │
└─────────────────────┴──────────────┴──────────┴─────────────┘

📊 Wall Street Estimates vs Actual

Actual: 310.33
Consensus: 309.20
Difference: +1.13 (+0.37%) 📈

Estimate Range: 308.50 ~ 311.00
Median: 309.20
Number of Estimates: 15

Top Institutional Estimates:
┌─────────────────┬──────────┬───────────┬─────────────┐
│ Institution     │ Estimate │ Confidence │ Date        │
├─────────────────┼──────────┼───────────┼─────────────┤
│ Goldman Sachs   │ 309.50   │ High       │ Jan 10, 2024│
│ JP Morgan       │ 309.20   │ High       │ Jan 11, 2024│
│ Bank of America │ 309.10   │ High       │ Jan 9, 2024 │
│ Morgan Stanley  │ 311.00   │ Medium     │ Jan 12, 2024│
│ Citi            │ 308.50   │ Medium     │ Jan 8, 2024 │
└─────────────────┴──────────┴───────────┴─────────────┘

Next Release Date: Jan 15, 2024
```

## Development

### Development Environment

```bash
# Run TypeScript files directly (development)
npm run dev

# Run tests
npm test

# Check test coverage
npm run test:coverage

# Run linter
npm run lint

# Format code
npm run format
```

### Project Structure

```
economy-cli/
├── src/
│   ├── api/
│   │   └── fredClient.ts      # FRED API client
│   ├── commands/
│   │   └── indicators.ts      # CLI command implementation
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── utils/
│   │   ├── config.ts         # Configuration and constants
│   │   ├── formatter.ts      # Output formatter
│   │   └── rateLimiter.ts    # API rate limit management
│   ├── __tests__/            # Test files
│   └── index.ts              # CLI entry point
├── .env.example              # Environment variables example
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## API Limitations

- **Rate Limit**: 120 requests per minute (FRED API default limit)
- **Automatic Management**: Rate limiter automatically adjusts request intervals
- **Caching**: 60-second cache to prevent unnecessary API calls

## Troubleshooting

### FRED_API_KEY Error

```
❌ Error: FRED_API_KEY environment variable is not set.
```

**Solution:**

1. Add `FRED_API_KEY=your_key` to `.env` file
2. Or set environment variable directly

### API Rate Limit Exceeded

```
❌ Error: API request limit exceeded. Please try again later.
```

**Solution:**

- Try again after 1-2 minutes
- Verify cache is enabled

### Network Error

```
❌ Error: FRED API Error: Network Error
```

**Solution:**

- Check internet connection
- Verify FRED API server status
- Check proxy settings

## Contributing

To contribute to this project:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Related Links

- [FRED API Documentation](https://fred.stlouisfed.org/docs/api/fred/)
- [FRED Data Series Search](https://fred.stlouisfed.org/tags/series)
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Commander.js](https://github.com/tj/commander.js/)

## Acknowledgments

- Federal Reserve Bank of St. Louis for providing the FRED API
- All contributors to the open source community
