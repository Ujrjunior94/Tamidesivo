import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F6F3] text-[#2B2B2B] flex flex-col items-center justify-center p-6 text-center font-body">
          <div className="max-w-md w-full bg-white border border-[#D4AF37]/40 rounded-3xl p-8 shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#5B1E2D]/10 text-[#5B1E2D] flex items-center justify-center mx-auto border border-[#5B1E2D]/20">
              <AlertTriangle className="w-8 h-8 text-[#D4AF37]" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-serif-title font-bold text-[#5B1E2D]">
                Tamiris Santana • Estúdio
              </h1>
              <p className="text-xs text-[#6E6E6E] font-light leading-relaxed">
                Ocorreu um imprevisto temporário ao carregar este componente. Clique no botão abaixo para restaurar o estado limpo da aplicação.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-stone-100 rounded-xl text-[10px] font-mono text-stone-600 text-left overflow-x-auto max-h-24 border border-stone-200">
                {this.state.error.message || 'Erro de execução de interface'}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 rounded-xl bg-[#5B1E2D] hover:bg-[#3D141E] text-[#D4AF37] font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all border border-[#D4AF37]/50"
            >
              <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
              <span>Recarregar & Restaurar Aplicação</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
