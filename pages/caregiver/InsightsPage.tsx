import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Smile,
  MessageSquare,
  CheckCircle2,
  Clock,
  Users,
  HelpCircle,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Download,
  Copy,
  Check,
  HeartHandshake,
  Lightbulb,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import {
  caregiverInsightsService,
  CaregiverInsights,
} from "@/src/services/caregiverInsightsService";

export default function CaregiverInsightsPage() {
  const [insights, setInsights] = useState<CaregiverInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInsights = async () => {
    try {
      const data = await caregiverInsightsService.getInsights("patient-001");
      setInsights(data);
    } catch (err) {
      console.error("Failed to load caregiver insights:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInsights();
  };

  const handleCopySummary = () => {
    if (!insights) return;
    const s = insights.weeklyAiSummary;
    const text = `Weekly AI Caregiver Summary (${s.period})\nOverall Score: ${s.overallScore}/100 - ${s.status}\n\nExecutive Summary:\n${s.executiveSummary}\n\nCognitive Observations:\n${s.cognitiveObservations.map((o) => `• ${o}`).join("\n")}\n\nEmotional Wellbeing:\n${s.emotionalWellbeing.map((o) => `• ${o}`).join("\n")}\n\nRoutine & Adherence:\n${s.routineAndAdherence.map((o) => `• ${o}`).join("\n")}\n\nRecommended Actions:\n${s.recommendedActions.map((o) => `• ${o}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !insights) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Synthesizing clinical insights and conversation analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Caregiver Insights"
          subtitle={`AI-powered clinical analytics and cognitive wellbeing for ${insights.patientName}`}
        />
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleCopySummary}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-emerald-300" />
                Copied
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Summary
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Top Level Key Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Average Mood */}
        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Average Mood</span>
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Smile className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {insights.averageMood.score.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/ 5.0</span>
            </div>
            <div className="mt-2 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {insights.averageMood.trend}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{insights.averageMood.label}</p>
          </CardContent>
        </Card>

        {/* Metric 2: Conversation Count */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Conversations</span>
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {insights.conversationStats.totalConversations}
              </span>
              <span className="text-sm text-muted-foreground">sessions</span>
            </div>
            <div className="mt-2 flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {insights.conversationStats.trend}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Avg {insights.conversationStats.avgDaily} chats / day</p>
          </CardContent>
        </Card>

        {/* Metric 3: Reminder Completion */}
        <Card className="border-l-4 border-l-indigo-500 shadow-sm hover:shadow transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Reminder Completion</span>
              <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {insights.reminderStats.overallRate}%
              </span>
              <span className="text-sm text-muted-foreground">on-time</span>
            </div>
            <div className="mt-2 flex items-center text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {insights.reminderStats.trend}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">25 of 28 reminders acknowledged</p>
          </CardContent>
        </Card>

        {/* Metric 4: Memory Recall Score */}
        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Memory Recall Score</span>
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Brain className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {insights.memoryRecall.currentScore}%
              </span>
              <span className="text-sm text-muted-foreground">index</span>
            </div>
            <div className="mt-2 flex items-center text-xs text-amber-600 dark:text-amber-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {insights.memoryRecall.trend}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">High stability in familiar recall</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Mood & Emotions + Conversation Volume (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Average Mood Daily Trend & Distribution */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smile className="w-5 h-5 text-emerald-500" />
                  Average Mood & Emotional Trajectory
                </CardTitle>
                <CardDescription>Daily affective balance rated on a 1.0 - 5.0 scale</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Score: {insights.averageMood.score.toFixed(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={insights.averageMood.dailyMoods} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" fontSize={12} stroke="currentColor" opacity={0.6} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} fontSize={12} stroke="currentColor" opacity={0.6} />
                  <Tooltip
                    formatter={(val: any) => [`${val} / 5.0`, "Mood Score"]}
                    labelFormatter={(label: any) => `Day: ${label}`}
                    contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)", background: "rgba(255,255,255,0.95)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#moodGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Emotion breakdown pill indicators */}
            <div className="pt-2 border-t border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Emotion Distribution
              </span>
              <div className="flex flex-wrap gap-2">
                {insights.averageMood.distribution.map((item) => (
                  <div
                    key={item.emotion}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted/60 border border-border"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground">{item.emotion}:</span>
                    <span className="font-bold text-foreground">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Conversation Activity Volume */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Conversation Activity Count
                </CardTitle>
                <CardDescription>Number of companion exchanges logged each day</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Total: {insights.conversationStats.totalConversations}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.conversationStats.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" fontSize={12} stroke="currentColor" opacity={0.6} />
                  <YAxis fontSize={12} stroke="currentColor" opacity={0.6} />
                  <Tooltip
                    formatter={(val: any) => [`${val} conversations`, "Count"]}
                    labelFormatter={(label: any) => `Day: ${label}`}
                    contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)", background: "rgba(255,255,255,0.95)" }}
                  />
                  <Bar dataKey="conversations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Peak Engagement: <strong>{insights.conversationStats.peakHours}</strong></span>
              </div>
              <span className="font-medium text-foreground">Avg duration: 5.2 min</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Reminder Completion + Memory Recall Score (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Reminder Completion */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  Reminder Completion & Adherence
                </CardTitle>
                <CardDescription>Timely acknowledgement of medications and daily schedule</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {insights.reminderStats.overallRate}% Adherence
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Donut Chart */}
              <div className="h-[210px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={insights.reminderStats.completionDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {insights.reminderStats.completionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any, name: any) => [`${val} reminders`, name]}
                      contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)", background: "rgba(255,255,255,0.95)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Breakdown Progress */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Category Breakdown
                </span>
                {insights.reminderStats.categoryAdherence.map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-foreground">{cat.category}</span>
                      <span className="text-muted-foreground">{cat.percentage}%</span>
                    </div>
                    <Progress value={cat.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart 4: Memory Recall Score Trend */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-amber-500" />
                  Memory Recall Score Trend
                </CardTitle>
                <CardDescription>Cognitive recall proficiency tracked over the past 6 weeks</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                Score: {insights.memoryRecall.currentScore}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={insights.memoryRecall.weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="week" fontSize={12} stroke="currentColor" opacity={0.6} />
                  <YAxis domain={[50, 100]} ticks={[50, 60, 70, 80, 90, 100]} fontSize={12} stroke="currentColor" opacity={0.6} />
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val}%`, name === "score" ? "Recall Score" : "Baseline Target"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)", background: "rgba(255,255,255,0.95)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={false}
                    name="baseline"
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", r: 4 }}
                    name="score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Micro indicators */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
              <div className="p-2 rounded bg-muted/40">
                <span className="text-xs text-muted-foreground block">Face Recognition</span>
                <span className="text-sm font-bold text-emerald-600">{insights.memoryRecall.faceRecognitionRate}%</span>
              </div>
              <div className="p-2 rounded bg-muted/40">
                <span className="text-xs text-muted-foreground block">Immediate Recall</span>
                <span className="text-sm font-bold text-amber-600">{insights.memoryRecall.immediateRecallRate}%</span>
              </div>
              <div className="p-2 rounded bg-muted/40">
                <span className="text-xs text-muted-foreground block">Recent Events</span>
                <span className="text-sm font-bold text-blue-600">{insights.memoryRecall.eventRecallRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Frequently Forgotten Topics + Most Discussed People (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 5: Frequently Forgotten Topics */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-rose-500" />
                  Frequently Forgotten Topics
                </CardTitle>
                <CardDescription>Specific items or details requiring repeated reassurance</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950 dark:border-rose-800">
                Top 5 Identified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Horizontal Bar Chart */}
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={insights.frequentlyForgottenTopics.map((t) => ({
                    topic: t.topic.length > 20 ? t.topic.slice(0, 18) + "..." : t.topic,
                    fullTopic: t.topic,
                    count: t.count,
                    category: t.category,
                  }))}
                  margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                  <XAxis type="number" fontSize={11} stroke="currentColor" opacity={0.6} />
                  <YAxis type="category" dataKey="topic" fontSize={11} stroke="currentColor" opacity={0.8} width={110} />
                  <Tooltip
                    formatter={(val: any, _name: any, item: any) => [
                      `${val} occurrences (${item.payload.category})`,
                      item.payload.fullTopic,
                    ]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)", background: "rgba(255,255,255,0.95)" }}
                  />
                  <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Caregiver intervention callout */}
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-rose-900 dark:text-rose-200">Recommended Intervention:</span>{" "}
                <span className="text-rose-800 dark:text-rose-300">
                  {insights.frequentlyForgottenTopics[0]?.interventionTip}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart 6: Most Discussed People */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Most Discussed People & Relationships
                </CardTitle>
                <CardDescription>Loved ones, doctors, and family members most frequently recalled</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                Core Network
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bar Chart */}
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.mostDiscussedPeople} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" fontSize={12} stroke="currentColor" opacity={0.7} />
                  <YAxis fontSize={12} stroke="currentColor" opacity={0.6} />
                  <Tooltip
                    formatter={(val: any, _name: any, item: any) => [
                      `${val} mentions (${item.payload.relation}) - ${item.payload.sentiment}`,
                      "Mentions",
                    ]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)", background: "rgba(255,255,255,0.95)" }}
                  />
                  <Bar dataKey="mentions" radius={[4, 4, 0, 0]}>
                    {insights.mostDiscussedPeople.map((entry, index) => (
                      <Cell key={`person-${index}`} fill={entry.sentimentColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Mention pill badges */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              {insights.mostDiscussedPeople.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-muted/60 border border-border"
                >
                  <span className="font-semibold text-foreground">{p.name}</span>
                  <span className="text-muted-foreground text-[11px]">({p.relation.split(" ")[0]}):</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                    {p.mentions}x
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Width Card: Weekly AI Summary */}
      <Card className="border-2 border-primary/20 shadow-md bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Weekly AI Clinical & Behavioral Summary
                  <Badge className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {insights.weeklyAiSummary.status}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Period: {insights.weeklyAiSummary.period} • Generated: {insights.weeklyAiSummary.generatedAt}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-muted-foreground">Stability Index</div>
                <div className="text-lg font-bold text-primary">{insights.weeklyAiSummary.overallScore} / 100</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopySummary}>
                {copied ? <Check className="w-4 h-4 text-emerald-500 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Executive Summary Paragraph */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/80 text-sm leading-relaxed text-foreground font-normal">
            <span className="font-semibold text-primary block mb-1">Executive Summary:</span>
            {insights.weeklyAiSummary.executiveSummary}
          </div>

          {/* Detailed Observations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 1: Cognitive Observations */}
            <div className="p-4 rounded-xl bg-background border border-border shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                <Brain className="w-4 h-4" />
                <span>Cognitive Observations</span>
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {insights.weeklyAiSummary.cognitiveObservations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2: Emotional Wellbeing */}
            <div className="p-4 rounded-xl bg-background border border-border shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <Smile className="w-4 h-4" />
                <span>Emotional Wellbeing & Climate</span>
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {insights.weeklyAiSummary.emotionalWellbeing.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3: Routine & Adherence */}
            <div className="p-4 rounded-xl bg-background border border-border shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Routine & Health Adherence</span>
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {insights.weeklyAiSummary.routineAndAdherence.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 4: Recommended Caregiver Actions */}
            <div className="p-4 rounded-xl bg-background border border-border shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                <HeartHandshake className="w-4 h-4" />
                <span>Actionable Recommendations for Caregiver</span>
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {insights.weeklyAiSummary.recommendedActions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span className="font-medium text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
