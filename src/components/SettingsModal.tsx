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
        className="fixed top-4 right-4 p-2 rounded-full border border-foreground/10 bg-background/50 backdrop-blur-sm hover:bg-foreground/5 hover:border-neon-primary transition-all text-foreground/70 hover:text-neon-primary z-50"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-background border border-foreground/10 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-foreground/10 bg-foreground/5">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-neon-primary" />
                <h2 className="font-mono font-bold tracking-widest text-sm">COUNCIL_NODE_CFG</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:text-red-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-6">
              <p className="text-sm opacity-70">
                Configure the LLM models backing each agent. Requires Ollama running locally.
              </p>

              {(['prospector', 'architect', 'curator'] as const).map(role => (
                <div key={role} className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-wider opacity-80 pl-1">
                    {role} Model
                  </label>
                  <select
                    value={config[role]}
                    onChange={(e) => handleChange(role, e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-background border border-foreground/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neon-primary font-mono appearance-none"
                  >
                    {!availableModels.some(m => m.name === config[role]) && (
                       <option value={config[role]}>{config[role]} (Missing?)</option>
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
            <div className="p-4 border-t border-foreground/10 bg-foreground/5 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-foreground text-background font-bold text-sm rounded-md hover:opacity-90 transition-opacity"
              >
                APPLY & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
