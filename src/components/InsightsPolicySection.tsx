import React, { useState } from 'react';
import { UnemploymentRecord, CovidImpactMetrics } from '../types';
import { computeRegionalStats } from '../utils/dataProcessing';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  Lightbulb, 
  FileText, 
  Briefcase, 
  Cpu, 
  Landmark, 
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

interface InsightsPolicySectionProps {
  metrics: CovidImpactMetrics;
  records: UnemploymentRecord[];
}

export const InsightsPolicySection: React.FC<InsightsPolicySectionProps> = ({ metrics, records }) => {
  const [selectedState, setSelectedState] = useState<string>(metrics.mostAffectedRegion.name || 'All');
  const [copiedMemo, setCopiedMemo] = useState(false);

  const regionalStats = computeRegionalStats(records);
  const selectedStateData = regionalStats.find(r => r.region === selectedState) || regionalStats[0];

  const handleCopyMemo = () => {
    const memo = `CODEALPHA TASK 2: UNEMPLOYMENT ANALYSIS & POLICY RECOMMENDATION MEMO
Dataset: Pre- and Post-COVID-19 Labor Dynamics
--------------------------------------------------
Key Findings:
1. Baseline vs Shock: National pre-lockdown baseline was ${metrics.preCovidRate}%, which surged to ${metrics.lockdownPeakRate}% (+${metrics.percentageSurge}% surge) during the peak April-May 2020 lockdown.
2. Regional Epicenter: ${metrics.mostAffectedRegion.name} experienced the steepest surge, reaching ${metrics.mostAffectedRegion.peak}% (delta of +${metrics.mostAffectedRegion.delta}%).
3. Sectoral Asymmetry: Urban unemployment peaked at ${metrics.urbanPeakRate}%, outpacing rural peaks (${metrics.ruralPeakRate}%) due to rigid service closures and industrial halts.

Policy Recommendations:
- Targeted Economic Stimulus: Direct digital cash transfers for unorganized and migrant workers.
- Rural Buffer Mechanisms: Immediate scaling of public works (e.g., MGNREGA) to absorb reverse migration.
- Digital Resilience & Upskilling: Targeted funding for remote-work enablement and decentralized micro-enterprises.`;

    navigator.clipboard.writeText(memo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Step 6: Policy Synthesis
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                COVID-19 Impact &amp; Economic Policy Recommendations
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Synthesizing empirical findings from CodeAlpha Task 2 into actionable public policy frameworks for macroeconomic shock resilience.
            </p>
          </div>

          <button
            onClick={handleCopyMemo}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md self-start md:self-auto"
          >
            {copiedMemo ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMemo ? 'Copied Policy Memo!' : 'Copy Policy Memo'}</span>
          </button>
        </div>
      </div>

      {/* Core Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Insight Card 1: COVID Shockwave */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="h-10 w-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1.5">
            1. COVID-19 Acute Lockdown Shockwave
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The data demonstrates an immediate, vertical dislocation during March–May 2020. The nationwide unemployment rate surged from a baseline of <strong className="text-cyan-400">{metrics.preCovidRate}%</strong> to a peak of <strong className="text-red-400">{metrics.lockdownPeakRate}%</strong> (+{metrics.percentageSurge}% surge). This reflects the immediate stoppage of construction, manufacturing, passenger transit, and retail hospitality.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Subsequent easing in Q3 2020 induced rapid partial recovery back to ~{metrics.postLockdownRate}%.</span>
          </div>
        </div>

        {/* Insight Card 2: Spatial & Regional Asymmetries */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1.5">
            2. Regional Disparities &amp; Spatial Fragility
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unemployment shocks were highly geographically asymmetric. States heavily reliant on interstate migrant labor, tourism, or industrial services (such as <strong className="text-amber-300">{metrics.mostAffectedRegion.name}</strong>, Haryana, and Puducherry) recorded spikes surpassing 40%–70%, whereas self-sufficient agrarian provinces retained structural baseline buffers.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Highlights the necessity for localized fiscal responses rather than uniform national mandates.</span>
          </div>
        </div>

      </div>

      {/* Actionable Policy Pillars */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Landmark className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Key Policy Recommendations &amp; Strategic Levers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Pillar 1 */}
          <div className="bg-slate-950/70 border border-cyan-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-2">
              <Briefcase className="w-4 h-4" />
              <span>Targeted Economic Stimulus</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Deploy direct benefit transfer (DBT) and digital wage cushions specifically targeting informal and daily-wage laborers who lack formal severance pay or unemployment insurance.
            </p>
            <div className="text-[10px] text-cyan-300/80 bg-cyan-950/50 p-2 rounded border border-cyan-800/40">
              Focus: Portable social security IDs for migrant workforce.
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-slate-950/70 border border-emerald-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Rural Employment Buffers</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Scale emergency funding for public employment programs (like MGNREGA). As urban migrants fled to rural hometowns, public works acted as the sole vital absorption sponge.
            </p>
            <div className="text-[10px] text-emerald-300/80 bg-emerald-950/50 p-2 rounded border border-emerald-800/40">
              Focus: Expand guaranteed workdays from 100 to 150 days during crisis.
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-slate-950/70 border border-indigo-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-2">
              <Cpu className="w-4 h-4" />
              <span>Skill &amp; Digital Resilience</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Invest heavily in digital literacy, remote connectivity, and decentralized micro-enterprises so business continuity does not collapse when physical containment is enforced.
            </p>
            <div className="text-[10px] text-indigo-300/80 bg-indigo-950/50 p-2 rounded border border-indigo-800/40">
              Focus: Tele-services training &amp; SME digital access grants.
            </div>
          </div>

        </div>
      </div>

      {/* State-Level Policy Drilldown */}
      {selectedStateData && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Territorial Policy Drilldown</span>
                <span className="text-xs text-cyan-400 font-mono">({selectedStateData.region})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Inspect local metrics and customized recovery recommendations
              </p>
            </div>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              {regionalStats.map(r => (
                <option key={r.region} value={r.region}>{r.region}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 text-xs">
            <div>
              <div className="text-slate-400 text-[11px]">Average Unemployment</div>
              <div className="text-lg font-bold font-mono text-cyan-400">{selectedStateData.avgRate}%</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Lockdown Peak</div>
              <div className="text-lg font-bold font-mono text-red-400">{selectedStateData.peakRate}%</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Lockdown Surge Delta</div>
              <div className="text-lg font-bold font-mono text-amber-400">+{selectedStateData.surgeDelta}%</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Labor Force Participation</div>
              <div className="text-lg font-bold font-mono text-emerald-400">{selectedStateData.avgLabourParticipation}%</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-300 bg-slate-950/40 p-3 rounded border border-slate-800/80">
            <strong>Recommended Policy Action for {selectedStateData.region}:</strong>{' '}
            {selectedStateData.surgeDelta > 20
              ? 'High volatility region. Prioritize immediate liquidity backstops for localized MSMEs and create temporary state emergency wage-support funds.'
              : 'Moderate volatility region. Focus on supply chain debottlenecking, expanding technical vocational training, and incentivizing private sector recruitment.'}
          </div>
        </div>
      )}

    </div>
  );
};
