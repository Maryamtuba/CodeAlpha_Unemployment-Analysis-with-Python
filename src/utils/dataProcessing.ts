import { UnemploymentRecord, SummaryStats, RegionalStats, CovidImpactMetrics } from '../types';

export function calculateSummaryStats(values: number[]): SummaryStats {
  if (values.length === 0) {
    return { count: 0, mean: 0, std: 0, min: 0, q25: 0, median: 0, q75: 0, max: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;
  const mean = sorted.reduce((sum, v) => sum + v, 0) / count;

  const variance = sorted.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (count > 1 ? count - 1 : 1);
  const std = Math.sqrt(variance);

  const getPercentile = (p: number) => {
    const idx = (count - 1) * p;
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    const weight = idx - lower;
    if (upper === lower) return sorted[lower];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };

  return {
    count,
    mean: Number(mean.toFixed(2)),
    std: Number(std.toFixed(2)),
    min: Number(sorted[0].toFixed(2)),
    q25: Number(getPercentile(0.25).toFixed(2)),
    median: Number(getPercentile(0.5).toFixed(2)),
    q75: Number(getPercentile(0.75).toFixed(2)),
    max: Number(sorted[count - 1].toFixed(2))
  };
}

export function computeCovidImpact(records: UnemploymentRecord[]): CovidImpactMetrics {
  // Pre-covid: Before March 2020
  const preCovid = records.filter(r => r.date < '2020-03-01');
  // Lockdown: March 2020 through June 2020
  const lockdown = records.filter(r => r.date >= '2020-03-01' && r.date <= '2020-06-30');
  // Post lockdown: July 2020 onwards
  const postLockdown = records.filter(r => r.date > '2020-06-30');

  const preAvg = preCovid.length ? preCovid.reduce((acc, r) => acc + r.unemploymentRate, 0) / preCovid.length : 0;
  const lockAvg = lockdown.length ? lockdown.reduce((acc, r) => acc + r.unemploymentRate, 0) / lockdown.length : 0;
  const postAvg = postLockdown.length ? postLockdown.reduce((acc, r) => acc + r.unemploymentRate, 0) / postLockdown.length : 0;

  // Max peak month across all records
  const peakRate = records.length ? Math.max(...records.map(r => r.unemploymentRate)) : 0;

  // Surge calculation
  const surge = preAvg > 0 ? ((lockAvg - preAvg) / preAvg) * 100 : 0;

  // Region grouping for most affected
  const regionStats = computeRegionalStats(records);
  const sortedBySurge = [...regionStats].sort((a, b) => b.surgeDelta - a.surgeDelta);
  const mostAffected = sortedBySurge[0]
    ? { name: sortedBySurge[0].region, peak: sortedBySurge[0].peakRate, delta: sortedBySurge[0].surgeDelta }
    : { name: 'N/A', peak: 0, delta: 0 };

  const sortedByAvg = [...regionStats].sort((a, b) => a.avgRate - b.avgRate);
  const leastAffected = sortedByAvg[0]
    ? { name: sortedByAvg[0].region, rate: sortedByAvg[0].avgRate }
    : { name: 'N/A', rate: 0 };

  // Urban vs Rural peak in lockdown
  const urbanLockdown = lockdown.filter(r => r.area === 'Urban');
  const ruralLockdown = lockdown.filter(r => r.area === 'Rural');
  const urbanPeakRate = urbanLockdown.length ? Math.max(...urbanLockdown.map(r => r.unemploymentRate)) : lockAvg;
  const ruralPeakRate = ruralLockdown.length ? Math.max(...ruralLockdown.map(r => r.unemploymentRate)) : lockAvg;

  return {
    preCovidRate: Number(preAvg.toFixed(2)),
    lockdownPeakRate: Number(lockAvg.toFixed(2)),
    postLockdownRate: Number(postAvg.toFixed(2)),
    percentageSurge: Number(surge.toFixed(1)),
    mostAffectedRegion: mostAffected,
    leastAffectedRegion: leastAffected,
    totalJobsLostEstimated: Math.round(preAvg > 0 ? (lockAvg - preAvg) * 1250000 : 0),
    urbanPeakRate: Number(urbanPeakRate.toFixed(2)),
    ruralPeakRate: Number(ruralPeakRate.toFixed(2))
  };
}

export function computeRegionalStats(records: UnemploymentRecord[]): RegionalStats[] {
  const byRegion = new Map<string, UnemploymentRecord[]>();

  records.forEach(r => {
    if (!byRegion.has(r.region)) {
      byRegion.set(r.region, []);
    }
    byRegion.get(r.region)!.push(r);
  });

  const results: RegionalStats[] = [];

  byRegion.forEach((items, region) => {
    const rates = items.map(i => i.unemploymentRate);
    const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;

    const preItems = items.filter(i => i.date < '2020-03-01');
    const lockItems = items.filter(i => i.date >= '2020-03-01' && i.date <= '2020-06-30');
    const postItems = items.filter(i => i.date > '2020-06-30');

    const preAvg = preItems.length ? preItems.reduce((a, b) => a + b.unemploymentRate, 0) / preItems.length : avgRate;
    const lockAvg = lockItems.length ? lockItems.reduce((a, b) => a + b.unemploymentRate, 0) / lockItems.length : avgRate;
    const postAvg = postItems.length ? postItems.reduce((a, b) => a + b.unemploymentRate, 0) / postItems.length : avgRate;

    // Find peak
    let peakRate = 0;
    let peakDate = '';
    items.forEach(i => {
      if (i.unemploymentRate > peakRate) {
        peakRate = i.unemploymentRate;
        peakDate = i.date;
      }
    });

    const lprAvg = items.reduce((a, b) => a + b.labourParticipationRate, 0) / items.length;
    const empAvg = items.reduce((a, b) => a + b.employed, 0) / items.length;

    const ruralItems = items.filter(i => i.area === 'Rural');
    const urbanItems = items.filter(i => i.area === 'Urban');
    const ruralAvg = ruralItems.length ? ruralItems.reduce((a, b) => a + b.unemploymentRate, 0) / ruralItems.length : undefined;
    const urbanAvg = urbanItems.length ? urbanItems.reduce((a, b) => a + b.unemploymentRate, 0) / urbanItems.length : undefined;

    results.push({
      region,
      avgRate: Number(avgRate.toFixed(2)),
      preCovidAvg: Number(preAvg.toFixed(2)),
      lockdownAvg: Number(lockAvg.toFixed(2)),
      postCovidAvg: Number(postAvg.toFixed(2)),
      peakRate: Number(peakRate.toFixed(2)),
      peakDate,
      surgeDelta: Number((lockAvg - preAvg).toFixed(2)),
      avgLabourParticipation: Number(lprAvg.toFixed(2)),
      totalEmployedAvg: Math.round(empAvg),
      ruralAvg: ruralAvg !== undefined ? Number(ruralAvg.toFixed(2)) : undefined,
      urbanAvg: urbanAvg !== undefined ? Number(urbanAvg.toFixed(2)) : undefined
    });
  });

  return results.sort((a, b) => b.avgRate - a.avgRate);
}

export function computeTimelineAggregates(records: UnemploymentRecord[]) {
  const map = new Map<string, { totalRate: number; totalEmp: number; totalLpr: number; count: number; urbanRate: number; urbanCount: number; ruralRate: number; ruralCount: number }>();

  records.forEach(r => {
    if (!map.has(r.date)) {
      map.set(r.date, { totalRate: 0, totalEmp: 0, totalLpr: 0, count: 0, urbanRate: 0, urbanCount: 0, ruralRate: 0, ruralCount: 0 });
    }
    const entry = map.get(r.date)!;
    entry.totalRate += r.unemploymentRate;
    entry.totalEmp += r.employed;
    entry.totalLpr += r.labourParticipationRate;
    entry.count += 1;

    if (r.area === 'Urban') {
      entry.urbanRate += r.unemploymentRate;
      entry.urbanCount += 1;
    } else if (r.area === 'Rural') {
      entry.ruralRate += r.unemploymentRate;
      entry.ruralCount += 1;
    }
  });

  const sortedDates = Array.from(map.keys()).sort();

  return sortedDates.map(date => {
    const val = map.get(date)!;
    return {
      date,
      avgRate: Number((val.totalRate / val.count).toFixed(2)),
      avgEmployed: Math.round(val.totalEmp / val.count),
      avgLpr: Number((val.totalLpr / val.count).toFixed(2)),
      urbanRate: val.urbanCount > 0 ? Number((val.urbanRate / val.urbanCount).toFixed(2)) : null,
      ruralRate: val.ruralCount > 0 ? Number((val.ruralRate / val.ruralCount).toFixed(2)) : null,
      count: val.count
    };
  });
}

export function computeHeatmapMatrix(records: UnemploymentRecord[]) {
  const years = Array.from(new Set(records.map(r => r.year))).sort();
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Matrix: year -> month -> avg rate
  const matrix: { year: number; months: (number | null)[] }[] = [];

  years.forEach(year => {
    const rowMonths: (number | null)[] = [];
    months.forEach(m => {
      const match = records.filter(r => r.year === year && r.month === m);
      if (match.length === 0) {
        rowMonths.push(null);
      } else {
        const sum = match.reduce((acc, curr) => acc + curr.unemploymentRate, 0);
        rowMonths.push(Number((sum / match.length).toFixed(1)));
      }
    });
    matrix.push({ year, months: rowMonths });
  });

  return { matrix, monthLabels, years };
}

export function exportToCSV(records: UnemploymentRecord[], filename: string = 'cleaned_unemployment_data.csv') {
  const headers = ['Region', 'Date', 'Frequency', 'Estimated Unemployment Rate (%)', 'Estimated Employed', 'Estimated Labour Participation Rate (%)', 'Area'];
  const rows = records.map(r => [
    `"${r.region}"`,
    `"${r.date}"`,
    `"${r.frequency}"`,
    r.unemploymentRate,
    r.employed,
    r.labourParticipationRate,
    `"${r.area}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportJupyterNotebook(recordsCount: number) {
  const notebookData = {
    cells: [
      {
        cell_type: 'markdown',
        metadata: {},
        source: [
          '# CodeAlpha Data Science Internship - Task 2: Unemployment Analysis with Python\n',
          '**Author:** CodeAlpha Intern\n',
          '**Objective:** Clean, inspect, and analyze unemployment data during 2019-2020 with specific focus on COVID-19 pandemic shockwaves, regional disparities, and urban/rural differences.'
        ]
      },
      {
        cell_type: 'code',
        execution_count: 1,
        metadata: {},
        outputs: [],
        source: [
          '# Step 1: Import Required Libraries\n',
          'import pandas as pd\n',
          'import numpy as np\n',
          'import matplotlib.pyplot as plt\n',
          'import seaborn as sns\n',
          '\n',
          '# Visual aesthetic configuration\n',
          'sns.set_theme(style="whitegrid")\n',
          'plt.rcParams["figure.figsize"] = (14, 7)\n',
          'plt.rcParams["font.sans-serif"] = "DejaVu Sans"\n',
          'print("Libraries imported successfully!")'
        ]
      },
      {
        cell_type: 'code',
        execution_count: 2,
        metadata: {},
        outputs: [],
        source: [
          '# Step 2: Load and Inspect Dataset\n',
          'df = pd.read_csv("unemployment_data.csv")\n',
          'print("Dataset Shape:", df.shape)\n',
          'print("\\nColumn Data Types & Info:")\n',
          'df.info()\n',
          'print("\\nFirst 5 Rows:")\n',
          'df.head()'
        ]
      },
      {
        cell_type: 'code',
        execution_count: 3,
        metadata: {},
        outputs: [],
        source: [
          '# Step 3: Data Cleaning & Preprocessing\n',
          '# Clean column header spaces\n',
          'df.columns = df.columns.str.strip()\n',
          '\n',
          '# Verify missing values\n',
          'print("Missing Values per Column:")\n',
          'print(df.isnull().sum())\n',
          '\n',
          '# Drop missing if any\n',
          'df = df.dropna()\n',
          '\n',
          '# Parse datetime\n',
          'df["Date"] = pd.to_datetime(df["Date"])\n',
          'df["Year"] = df["Date"].dt.year\n',
          'df["Month"] = df["Date"].dt.month\n',
          'df["Month_Name"] = df["Date"].dt.strftime("%b")\n',
          'print("Preprocessed successfully. Cleaned records:", len(df))'
        ]
      },
      {
        cell_type: 'code',
        execution_count: 4,
        metadata: {},
        outputs: [],
        source: [
          '# Step 4: Exploratory Data Analysis (EDA)\n',
          'print("Statistical Summary:")\n',
          'display(df.describe().T)\n',
          '\n',
          '# Regional Unemployment ranking\n',
          'regional_agg = df.groupby("Region")["Estimated Unemployment Rate (%)"].agg(["mean", "median", "max", "std"])\n',
          'regional_agg = regional_agg.sort_values(by="mean", ascending=False)\n',
          'display(regional_agg)'
        ]
      },
      {
        cell_type: 'code',
        execution_count: 5,
        metadata: {},
        outputs: [],
        source: [
          '# Step 5: COVID-19 Shock Visualizations\n',
          '# 1. Timeline Trend\n',
          'plt.figure(figsize=(14, 6))\n',
          'trend = df.groupby("Date")["Estimated Unemployment Rate (%)"].mean().reset_index()\n',
          'sns.lineplot(data=trend, x="Date", y="Estimated Unemployment Rate (%)", color="#0284c7", linewidth=2.5, marker="o")\n',
          'plt.axvline(pd.to_datetime("2020-03-24"), color="#dc2626", linestyle="--", label="Lockdown Enacted (Mar 2020)")\n',
          'plt.title("National Unemployment Rate Trend: COVID-19 Lockdown Surge", fontsize=16, fontweight="bold")\n',
          'plt.ylabel("Unemployment Rate (%)")\n',
          'plt.legend()\n',
          'plt.show()\n',
          '\n',
          '# 2. Regional Bar Chart\n',
          'plt.figure(figsize=(15, 7))\n',
          'order = df.groupby("Region")["Estimated Unemployment Rate (%)"].mean().sort_values(ascending=False).index\n',
          'sns.barplot(data=df, x="Region", y="Estimated Unemployment Rate (%)", order=order, palette="mako")\n',
          'plt.xticks(rotation=90)\n',
          'plt.title("Average Unemployment Rate by Region/State", fontsize=16, fontweight="bold")\n',
          'plt.tight_layout()\n',
          'plt.show()\n',
          '\n',
          '# 3. Monthly Heatmap\n',
          'pivot_tab = df.pivot_table(values="Estimated Unemployment Rate (%)", index="Year", columns="Month", aggfunc="mean")\n',
          'plt.figure(figsize=(12, 5))\n',
          'sns.heatmap(pivot_tab, annot=True, fmt=".1f", cmap="YlOrRd", cbar_kws={"label": "Unemployment (%)"})\n',
          'plt.title("Seasonality & COVID-19 Shock Heatmap (Year x Month)", fontsize=15, fontweight="bold")\n',
          'plt.show()'
        ]
      },
      {
        cell_type: 'markdown',
        metadata: {},
        source: [
          '# Step 6: Policy Recommendations & Academic Conclusions\n',
          '1. **COVID-19 Economic Shockwave:** Unemployment surged dramatically in April-May 2020 during the nationwide lockdown, surpassing 23% nationally and breaching 40-70% in heavily impacted service-oriented regions.\n',
          '2. **Informal Sector Fragility:** Daily-wage earners and urban informal service workers suffered immediate displacements without statutory income buffers.\n',
          '3. **Policy Recommendation 1:** Establish digital direct benefit transfer (DBT) conduits for unorganized migrant workers.\n',
          '4. **Policy Recommendation 2:** Expand rural employment safety programs (such as MGNREGA) to absorb reverse migration from urban economic hubs.'
        ]
      }
    ],
    metadata: {
      kernelspec: {
        display_name: 'Python 3 (ipykernel)',
        language: 'python',
        name: 'python3'
      },
      language_info: {
        codemirror_mode: { name: 'ipython', version: 3 },
        file_extension: '.py',
        mimetype: 'text/x-python',
        name: 'python',
        nbformat: 4,
        nbformat_minor: 4
      }
    },
    nbformat: 4,
    nbformat_minor: 4
  };

  const jsonStr = JSON.stringify(notebookData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/x-ipynb+json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Task2_Unemployment_Analysis_CodeAlpha.ipynb');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
