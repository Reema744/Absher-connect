import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Brain,
  Database,
  Cpu,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Zap,
  FileText,
  AlertTriangle,
  Calendar,
  Users,
} from "lucide-react";

interface DocumentAnalysis {
  documentType: string;
  daysToExpiry: number;
  documentImportance: "HIGH" | "MEDIUM" | "LOW";
  aiScore: number;
  scoreBreakdown: {
    expiryScore: number;
    importanceScore: number;
    historyScore: number;
  };
  shouldNotify: boolean;
  threshold: number;
}

interface ApiCall {
  endpoint: string;
  method: string;
  status: "success" | "not_found";
  responseTime: number;
  data?: any;
}

interface SuggestionAnalysis {
  timestamp: string;
  userId: number;
  apiCalls: ApiCall[];
  inputData: any;
  aiAnalysis: {
    documentsAnalyzed: DocumentAnalysis[];
    rulesApplied: string[];
    modelType: string;
    modelVersion: string;
  };
  output: {
    totalSuggestions: number;
    byPriority: { high: number; medium: number; low: number };
    byType: { [key: string]: number };
    suggestions: any[];
  };
  processingTime: number;
}

interface DemoPanelProps {
  onClose: () => void;
}

export default function DemoPanel({ onClose }: DemoPanelProps) {
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["api", "ai", "output"])
  );

  const {
    data: analysis,
    isLoading,
    refetch,
    isFetching,
  } = useQuery<SuggestionAnalysis>({
    queryKey: [`/api/suggestions/${user?.id}/analysis`],
    enabled: !!user,
  });

  const toggleSection = (section: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setExpandedSections(newSet);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />;
      case "violation":
        return <AlertTriangle className="h-4 w-4" />;
      case "appointment":
        return <Calendar className="h-4 w-4" />;
      case "delegation":
        return <Users className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  AI Suggestion Engine
                </h1>
                <p className="text-gray-400 text-sm">
                  Demo Mode - Behind the Scenes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                data-testid="button-refresh-analysis"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                className="text-white hover:bg-white/20"
                data-testid="button-close-demo"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Cpu className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
                <p className="text-white text-lg">Processing AI Analysis...</p>
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white/10 border-white/20 p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                    API Calls
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {analysis.apiCalls.length}
                  </p>
                </Card>
                <Card className="bg-white/10 border-white/20 p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                    Documents Analyzed
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {analysis.aiAnalysis.documentsAnalyzed.length}
                  </p>
                </Card>
                <Card className="bg-white/10 border-white/20 p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                    Suggestions Generated
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {analysis.output.totalSuggestions}
                  </p>
                </Card>
                <Card className="bg-white/10 border-white/20 p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                    Processing Time
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {analysis.processingTime}ms
                  </p>
                </Card>
              </div>

              {/* API Calls Section */}
              <Card className="bg-white/5 border-white/10 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                  onClick={() => toggleSection("api")}
                >
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold text-white">
                      API Calls Made
                    </span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                      {analysis.apiCalls.length}
                    </Badge>
                  </div>
                  {expandedSections.has("api") ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {expandedSections.has("api") && (
                  <div className="border-t border-white/10 p-4 space-y-2">
                    {analysis.apiCalls.map((call, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-black/30 font-mono text-sm"
                      >
                        <Badge
                          variant="outline"
                          className="bg-green-500/20 text-green-400 border-green-500/30"
                        >
                          {call.method}
                        </Badge>
                        <span className="text-gray-300 flex-1 truncate">
                          {call.endpoint}
                        </span>
                        <div className="flex items-center gap-2">
                          {call.status === "success" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-yellow-400" />
                          )}
                          <span className="text-gray-500 text-xs">
                            {call.responseTime}ms
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* AI Analysis Section */}
              <Card className="bg-white/5 border-white/10 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                  onClick={() => toggleSection("ai")}
                >
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <span className="font-semibold text-white">
                      AI Model Analysis
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-purple-500/20 text-purple-300"
                    >
                      {analysis.aiAnalysis.modelType}
                    </Badge>
                  </div>
                  {expandedSections.has("ai") ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {expandedSections.has("ai") && (
                  <div className="border-t border-white/10 p-4 space-y-4">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
                        Document Scoring
                      </p>
                      <div className="space-y-3">
                        {analysis.aiAnalysis.documentsAnalyzed.map((doc, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-lg bg-black/30 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-white">
                                  {doc.documentType}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    doc.documentImportance === "HIGH"
                                      ? "border-red-500/50 text-red-400"
                                      : doc.documentImportance === "MEDIUM"
                                      ? "border-yellow-500/50 text-yellow-400"
                                      : "border-gray-500/50 text-gray-400"
                                  }`}
                                >
                                  {doc.documentImportance}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-sm">
                                  Expires in {doc.daysToExpiry} days
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="bg-black/40 rounded p-2">
                                <p className="text-gray-500 text-xs">Expiry</p>
                                <p className="text-white font-mono">
                                  +{doc.scoreBreakdown.expiryScore}
                                </p>
                              </div>
                              <div className="bg-black/40 rounded p-2">
                                <p className="text-gray-500 text-xs">Importance</p>
                                <p className="text-white font-mono">
                                  +{doc.scoreBreakdown.importanceScore}
                                </p>
                              </div>
                              <div className="bg-black/40 rounded p-2">
                                <p className="text-gray-500 text-xs">History</p>
                                <p className="text-white font-mono">
                                  +{doc.scoreBreakdown.historyScore}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-sm">
                                  AI Score:
                                </span>
                                <span className="text-xl font-bold text-white">
                                  {doc.aiScore}
                                </span>
                                <span className="text-gray-500">/</span>
                                <span className="text-gray-400">
                                  {doc.threshold} threshold
                                </span>
                              </div>
                              <Badge
                                className={
                                  doc.shouldNotify
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-gray-500/20 text-gray-400"
                                }
                              >
                                {doc.shouldNotify ? (
                                  <>
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    NOTIFY
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    SKIP
                                  </>
                                )}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
                        Rules Applied
                      </p>
                      <div className="space-y-2">
                        {analysis.aiAnalysis.rulesApplied.map((rule, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-sm text-gray-300"
                          >
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Output Section */}
              <Card className="bg-white/5 border-white/10 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                  onClick={() => toggleSection("output")}
                >
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold text-white">
                      Generated Suggestions
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500/20 text-yellow-300"
                    >
                      {analysis.output.totalSuggestions}
                    </Badge>
                  </div>
                  {expandedSections.has("output") ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {expandedSections.has("output") && (
                  <div className="border-t border-white/10 p-4 space-y-4">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-gray-300 text-sm">
                          High: {analysis.output.byPriority.high}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-gray-300 text-sm">
                          Medium: {analysis.output.byPriority.medium}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-gray-300 text-sm">
                          Low: {analysis.output.byPriority.low}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {analysis.output.suggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-lg bg-black/30"
                        >
                          <div
                            className={`p-2 rounded-lg ${
                              suggestion.priority === "high"
                                ? "bg-red-500/20"
                                : suggestion.priority === "medium"
                                ? "bg-yellow-500/20"
                                : "bg-green-500/20"
                            }`}
                          >
                            {getTypeIcon(suggestion.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">
                              {suggestion.title}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {suggestion.description}
                            </p>
                          </div>
                          <Badge
                            className={`${
                              suggestion.priority === "high"
                                ? "bg-red-500/20 text-red-400"
                                : suggestion.priority === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {suggestion.priority}
                          </Badge>
                        </div>
                      ))}
                      {analysis.output.suggestions.length === 0 && (
                        <p className="text-gray-500 text-center py-8">
                          No suggestions generated for this user
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Card>

              {/* Timestamp */}
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <Clock className="h-4 w-4" />
                <span>
                  Analysis generated at{" "}
                  {new Date(analysis.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400">No analysis data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
