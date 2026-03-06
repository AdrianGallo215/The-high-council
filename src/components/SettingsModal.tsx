import { useState, useEffect } from "react";
import { Settings, X, Server } from "lucide-react";

interface ModelOption {
  name: string;
}

export interface ModelConfig {
  prospector: string;
  architect: string;
  curator: string;
}

export const DEFAULT_MODELS: ModelConfig = {
  prospector: "llama3:latest",
  architect: "qwen2.5-coder:7b",
  curator: "gemma3:latest"
};

const CONFIG_STORAGE_KEY = "high_council_models";

export function loadModelConfig(): ModelConfig {
  if (typeof window === "undefined") return DEFAULT_MODELS;
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_MODELS;
  } catch (e) {
    return DEFAULT_MODELS;
  }
}

export default function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([]);
  const [config, setConfig] = useState<ModelConfig>(DEFAULT_MODELS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setConfig(loadModelConfig());
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      if (data.models) {
        setAvailableModels(data.models);
      }
    } catch (e) {
      console.error("Failed to fetch models", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (role: keyof ModelConfig, modelName: string) => {
    const newConfig = { ...config, [role]: modelName };
    setConfig(newConfig);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <Settings className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <Server className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-zinc-200">Model Configuration</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col gap-4">
              <p className="text-[11px] text-zinc-600 font-mono">
                endpoint: http://localhost:11434
              </p>

              {(['prospector', 'architect', 'curator'] as const).map(role => (
                <div key={role} className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 font-medium capitalize pl-0.5">
                    {role} Agent
                  </label>
                  <select
                    value={config[role]}
                    onChange={(e) => handleChange(role, e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 appearance-none transition-colors cursor-pointer"
                  >
                    {!availableModels.some(m => m.name === config[role]) && (
                       <option value={config[role]}>{config[role]} (Missing)</option>
                    )}
                    {availableModels.map(model => (
                      <option key={model.name} value={model.name}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-zinc-100 text-zinc-950 font-medium text-xs rounded-lg hover:bg-white transition-colors cursor-pointer"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
