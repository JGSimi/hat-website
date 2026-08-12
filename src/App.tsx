import { useState, useEffect } from 'react';
import { 
  Download, 
  Terminal, 
  Copy, 
  Check, 
  ShieldAlert, 
  Zap, 
  EyeOff, 
  Sparkles, 
  ChevronDown,
  ExternalLink,
  ArrowRight,
  MousePointerClick
} from 'lucide-react';

interface ReleaseInfo {
  tag_name: string;
  macArmUrl: string;
  macIntelUrl: string;
  winUrl: string;
  latestReleasePage: string;
}

const DEFAULT_RELEASES: ReleaseInfo = {
  tag_name: 'v2.0.0',
  macArmUrl: 'https://github.com/JGSimi/Hat-Cross/releases/latest',
  macIntelUrl: 'https://github.com/JGSimi/Hat-Cross/releases/latest',
  winUrl: 'https://github.com/JGSimi/Hat-Cross/releases/latest',
  latestReleasePage: 'https://github.com/JGSimi/Hat-Cross/releases/latest'
};

export default function App() {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [userOS, setUserOS] = useState<'mac-arm' | 'mac-intel' | 'win' | 'other'>('mac-arm');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [releases, setReleases] = useState<ReleaseInfo>(DEFAULT_RELEASES);
  const [activeTab, setActiveTab] = useState<'macos' | 'windows'>('macos');

  useEffect(() => {
    // OS Detection
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('mac')) {
      setUserOS('mac-arm');
      setActiveTab('macos');
    } else if (ua.includes('win')) {
      setUserOS('win');
      setActiveTab('windows');
    }

    // Fetch latest GitHub release download links
    fetch('https://api.github.com/repos/JGSimi/Hat-Cross/releases/latest')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.assets && Array.isArray(data.assets)) {
          let macArm = DEFAULT_RELEASES.macArmUrl;
          let macIntel = DEFAULT_RELEASES.macIntelUrl;
          let win = DEFAULT_RELEASES.winUrl;

          data.assets.forEach((asset: { name: string; browser_download_url: string }) => {
            const name = asset.name.toLowerCase();
            if (name.endsWith('.dmg')) {
              if (name.includes('aarch64') || name.includes('arm64')) {
                macArm = asset.browser_download_url;
              } else if (name.includes('x64') || name.includes('x86_64')) {
                macIntel = asset.browser_download_url;
              }
            } else if (name.endsWith('.exe')) {
              win = asset.browser_download_url;
            }
          });

          setReleases({
            tag_name: data.tag_name || 'v2.0.0',
            macArmUrl: macArm,
            macIntelUrl: macIntel,
            winUrl: win,
            latestReleasePage: data.html_url || DEFAULT_RELEASES.latestReleasePage
          });
        }
      })
      .catch(() => {
        // Fallback to default links
      });
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const getPrimaryDownload = () => {
    switch (userOS) {
      case 'win':
        return {
          label: 'Baixar para Windows (64-bit)',
          sub: `.exe • ${releases.tag_name}`,
          url: releases.winUrl
        };
      case 'mac-intel':
        return {
          label: 'Baixar para macOS (Intel)',
          sub: `.dmg • ${releases.tag_name}`,
          url: releases.macIntelUrl
        };
      case 'mac-arm':
      default:
        return {
          label: 'Baixar para macOS (Apple Silicon M1+)',
          sub: `.dmg • ${releases.tag_name}`,
          url: releases.macArmUrl
        };
    }
  };

  const primaryDownload = getPrimaryDownload();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-neutral-800 selection:text-white">
      {/* Top Notification Bar */}
      <div className="border-b border-neutral-900 bg-neutral-950/80 px-4 py-2 text-center text-xs text-neutral-400 backdrop-blur-md">
        <span>Hat {releases.tag_name} • Assistente de IA Stealth para macOS & Windows</span>
        <a 
          href={releases.latestReleasePage} 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-2 font-medium text-neutral-200 underline underline-offset-4 hover:text-white"
        >
          Ver notas da versão
        </a>
      </div>

      {/* Main Navigation */}
      <header className="mx-auto flex max-w-5xl items-center justify-between border-b border-neutral-900 px-6 py-6">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold tracking-tight text-white font-mono">Hat</span>
          <span className="border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
            STEALTH IA
          </span>
        </div>
        
        <nav className="flex items-center space-x-6 text-sm text-neutral-400">
          <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
          <a href="#instalacao" className="hover:text-white transition-colors">Instalação</a>
          <a href="#precos" className="hover:text-white transition-colors">Planos</a>
          <a 
            href={primaryDownload.url}
            className="inline-flex items-center space-x-1 font-medium text-white border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 transition-colors text-xs"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            <span>Download</span>
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        {/* HERO SECTION */}
        <section className="py-20 border-b border-neutral-900">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs text-neutral-300 font-mono">
              <Sparkles className="h-3.5 w-3.5 text-neutral-400" />
              <span>Nativo • Discreto • Resposta Instantânea</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-none">
              Assistente de IA stealth para provas e questionários.
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 font-light leading-relaxed">
              O Hat roda discretamente na sua barra de menus (macOS) ou bandeja do sistema (Windows). Copie qualquer questão, acione um atalho e veja a resposta surgir instantaneamente em uma janela pop-up discreta (Modo Flash).
            </p>

            {/* DOWNLOAD ACTION BOX */}
            <div className="pt-4 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={primaryDownload.url}
                  className="inline-flex items-center justify-center space-x-2 bg-white text-black font-semibold px-6 py-3.5 hover:bg-neutral-200 transition-colors text-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>{primaryDownload.label}</span>
                </a>

                {/* Platform Selector Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full sm:w-auto inline-flex items-center justify-between space-x-2 border border-neutral-800 bg-neutral-900 px-4 py-3.5 text-xs text-neutral-300 hover:border-neutral-700 transition-colors font-mono"
                  >
                    <span>Mais plataformas</span>
                    <ChevronDown className="h-3.5 w-3.5 ml-2 text-neutral-500" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 border border-neutral-800 bg-neutral-950 p-2 z-50 text-xs shadow-2xl">
                      <a
                        href={releases.macArmUrl}
                        className="block px-3 py-2 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="font-medium">macOS Apple Silicon (M1+)</div>
                        <div className="text-[10px] text-neutral-500 font-mono">Hat_aarch64.dmg</div>
                      </a>
                      <a
                        href={releases.macIntelUrl}
                        className="block px-3 py-2 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="font-medium">macOS Intel</div>
                        <div className="text-[10px] text-neutral-500 font-mono">Hat_x64.dmg</div>
                      </a>
                      <a
                        href={releases.winUrl}
                        className="block px-3 py-2 text-neutral-300 hover:bg-neutral-900 hover:text-white border-t border-neutral-900 mt-1 pt-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="font-medium">Windows 64-bit</div>
                        <div className="text-[10px] text-neutral-500 font-mono">Hat_x64-setup.exe</div>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500 font-mono">
                <span>Versão {releases.tag_name}</span>
                <span>•</span>
                <span>Atualização automática via Minisign</span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="como-funciona" className="py-16 border-b border-neutral-900">
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Como Funciona</h2>
            <p className="text-sm text-neutral-400">Três passos simples para consultar a IA em segundos sem sair da sua tela.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-l-2 border-neutral-800 pl-6 space-y-2">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <MousePointerClick className="h-4 w-4 text-neutral-400" />
                <span>1. Copie a Questão</span>
              </div>
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                Selecione e copie o texto da pergunta ou alternativa para a sua área de transferência (<kbd className="px-1.5 py-0.5 border border-neutral-800 bg-neutral-900 text-xs font-mono text-neutral-200">Cmd/Ctrl + C</kbd>).
              </p>
            </div>

            <div className="border-l-2 border-neutral-800 pl-6 space-y-2">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <Zap className="h-4 w-4 text-neutral-400" />
                <span>2. Acione o Atalho</span>
              </div>
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                Pressione <kbd className="px-1.5 py-0.5 border border-neutral-800 bg-neutral-900 text-xs font-mono text-neutral-200">Cmd/Ctrl + Shift + F</kbd> de qualquer janela ou aplicativo.
              </p>
            </div>

            <div className="border-l-2 border-neutral-800 pl-6 space-y-2">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <EyeOff className="h-4 w-4 text-neutral-400" />
                <span>3. Resposta Discreta (Flash)</span>
              </div>
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                A IA analisa a questão e exibe a resposta conclusiva em um pop-up minimalista no canto da tela, sem abrir navegadores.
              </p>
            </div>
          </div>
        </section>

        {/* INSTALLATION GUIDANCE */}
        <section id="instalacao" className="py-16 border-b border-neutral-900">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Instalação e Primeiro Uso</h2>
            <p className="text-sm text-neutral-400">
              O Hat não possui certificado pago corporativo Apple/Microsoft (app não assinado), por isso o sistema operacional pode exigir uma liberação simples no primeiro início.
            </p>
          </div>

          {/* OS Switcher Tabs */}
          <div className="flex border-b border-neutral-800 mb-8">
            <button
              onClick={() => setActiveTab('macos')}
              className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'macos'
                  ? 'border-white text-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              macOS (Apple Silicon & Intel)
            </button>
            <button
              onClick={() => setActiveTab('windows')}
              className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'windows'
                  ? 'border-white text-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Windows (64-bit)
            </button>
          </div>

          {activeTab === 'macos' ? (
            <div className="space-y-6">
              <ol className="list-decimal list-inside text-sm text-neutral-300 space-y-3 font-light">
                <li>Baixe e abra o arquivo <code className="font-mono text-xs bg-neutral-900 px-1.5 py-0.5 border border-neutral-800">.dmg</code>.</li>
                <li>Arraste o aplicativo **Hat** para a pasta **Aplicativos**.</li>
                <li>
                  Execute o comando abaixo **uma única vez** no Terminal para remover a quarentena do macOS:
                </li>
              </ol>

              {/* Terminal Code Snippet */}
              <div className="border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs text-neutral-200 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-x-auto">
                  <Terminal className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                  <code className="text-emerald-400 select-all">xattr -cr /Applications/Hat.app</code>
                </div>
                <button
                  onClick={() => handleCopy('xattr -cr /Applications/Hat.app')}
                  className="ml-4 inline-flex items-center space-x-1 border border-neutral-800 bg-neutral-900 px-3 py-1 text-[11px] hover:bg-neutral-800 hover:text-white transition-colors flex-shrink-0"
                >
                  {copiedCmd ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400 mr-1" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-neutral-500 bg-neutral-900/40 p-4 border-l-2 border-neutral-700">
                <ShieldAlert className="h-4 w-4 text-neutral-400 inline mr-2" />
                <span>
                  <strong>Por que este passo é necessário?</strong> Ao baixar um app fora da App Store, o macOS bloqueia a execução até a quarentena ser removida via Terminal.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-neutral-300 font-light">
              <ol className="list-decimal list-inside space-y-3">
                <li>Baixe e execute o arquivo <code className="font-mono text-xs bg-neutral-900 px-1.5 py-0.5 border border-neutral-800">Hat_x64-setup.exe</code>.</li>
                <li>
                  Caso a tela do **Windows Defender SmartScreen** apareça:
                </li>
              </ol>
              <div className="border-l-2 border-neutral-700 pl-4 py-2 font-mono text-xs text-neutral-400">
                Clique em <strong className="text-white">"Mais informações"</strong> e depois em <strong className="text-white">"Executar mesmo assim"</strong>.
              </div>
            </div>
          )}
        </section>

        {/* PRICING */}
        <section id="precos" className="py-16 border-b border-neutral-900">
          <div className="max-w-xl space-y-6">
            <div>
              <span className="text-xs font-mono uppercase text-neutral-500 tracking-wider">Plano Único</span>
              <h2 className="text-3xl font-bold tracking-tight text-white mt-1">Acesso Ilimitado</h2>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-extrabold tracking-tight text-white">R$ 30</span>
              <span className="text-neutral-400 text-sm">/ mês</span>
            </div>

            <ul className="space-y-2 text-sm text-neutral-300 font-light">
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Consultas via IA sem limite de uso</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Exibição discreta em pop-up (Flash)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Suporte a macOS (Apple Silicon & Intel) e Windows</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Atualizações automáticas inclusas</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href={primaryDownload.url}
                className="inline-flex items-center space-x-2 bg-white text-black font-semibold px-6 py-3 hover:bg-neutral-200 transition-colors text-sm"
              >
                <span>Baixar o Hat</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mx-auto max-w-5xl px-6 py-12 text-xs text-neutral-500 border-t border-neutral-950 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} Hat • Hospedado via <a href="https://ergon.digital" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white underline underline-offset-4">ergon.digital</a>
        </div>
        
        <div className="flex items-center space-x-6 font-mono">
          <a 
            href="https://github.com/JGSimi/Hat-Cross" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-neutral-300 inline-flex items-center"
          >
            <span>GitHub App</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
          <a 
            href={releases.latestReleasePage} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-neutral-300 inline-flex items-center"
          >
            <span>Releases</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </footer>
    </div>
  );
}
