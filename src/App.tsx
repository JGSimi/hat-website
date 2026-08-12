import { useState, useEffect } from 'react';
import { InteractiveBackground } from './components/InteractiveBackground';
import { HatLogo } from './components/HatLogo';
import { 
  Download, 
  Terminal, 
  Copy, 
  Check, 
  ShieldAlert, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown,
  ExternalLink,
  ArrowRight,
  MousePointerClick,
  Camera,
  ClipboardCheck,
  X,
  HelpCircle
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
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

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
        // Fallback
      });
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleDownloadClick = (url: string, forceOS?: 'macos' | 'windows') => {
    if (forceOS) {
      setActiveTab(forceOS);
    } else if (userOS === 'win') {
      setActiveTab('windows');
    } else {
      setActiveTab('macos');
    }

    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Open guidance popup
    setDownloadModalOpen(true);
  };

  const scrollToTutorial = () => {
    setDownloadModalOpen(false);
    const element = document.getElementById('instalacao');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getPrimaryDownload = () => {
    switch (userOS) {
      case 'win':
        return {
          label: 'Baixar para Windows (64-bit)',
          sub: `.exe • ${releases.tag_name}`,
          url: releases.winUrl,
          os: 'windows' as const
        };
      case 'mac-intel':
        return {
          label: 'Baixar para macOS (Intel)',
          sub: `.dmg • ${releases.tag_name}`,
          url: releases.macIntelUrl,
          os: 'macos' as const
        };
      case 'mac-arm':
      default:
        return {
          label: 'Baixar para macOS (Apple Silicon M1+)',
          sub: `.dmg • ${releases.tag_name}`,
          url: releases.macArmUrl,
          os: 'macos' as const
        };
    }
  };

  const primaryDownload = getPrimaryDownload();

  return (
    <div className="relative min-h-screen bg-[#121214] text-[#EDF2F4] selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      {/* High Quality Responsive WebP Wallpaper */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105 transform transition-transform duration-1000"
        style={{ backgroundImage: `url('./wallpaper.webp')` }}
      />
      
      {/* Dark overlay for optimal text contrast & legibility */}
      <div className="fixed inset-0 z-0 bg-[#121214]/75 backdrop-blur-[2px] pointer-events-none" />

      {/* Interactive Background Canvas */}
      <InteractiveBackground />

      <div className="relative z-10">
        {/* Top Notification Bar */}
        <div className="bg-neutral-900/40 px-4 py-2.5 text-center text-xs text-neutral-400 backdrop-blur-md">
          <span>Hat {releases.tag_name} • Assistente de IA Nativo para macOS & Windows</span>
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
        <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
          <div className="flex items-center space-x-3">
            <a href="/" aria-label="Hat Home" className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity">
              <HatLogo size={32} className="text-[#EDF2F4]" title="Hat" />
              <span className="text-xl font-bold tracking-tight text-[#EDF2F4] font-mono">Hat</span>
            </a>
          </div>
          
          <nav className="flex items-center space-x-6 text-sm text-neutral-400">
            <a href="#como-funciona" className="hover:text-[#EDF2F4] transition-colors">Como funciona</a>
            <a href="#recursos" className="hover:text-[#EDF2F4] transition-colors">Recursos</a>
            <a href="#instalacao" className="hover:text-[#EDF2F4] transition-colors">Instalação</a>
            <a href="#precos" className="hover:text-[#EDF2F4] transition-colors">Planos</a>
            <button 
              onClick={() => handleDownloadClick(primaryDownload.url, primaryDownload.os)}
              className="inline-flex items-center space-x-1.5 font-medium text-neutral-900 bg-[#EDF2F4] hover:bg-white px-4 py-2 rounded-full transition-all text-xs shadow-sm hover:scale-[1.02]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-6">
          {/* HERO SECTION */}
          <section className="py-20">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center space-x-2 bg-neutral-900/80 px-3.5 py-1.5 rounded-full text-xs text-neutral-300 font-mono">
                <Sparkles className="h-3.5 w-3.5 text-neutral-400" />
                <span>IA Útil de Verdade • Sem Abrir Abas</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#EDF2F4] leading-tight">
                Usar IA nunca foi tão fácil e rápido.
              </h1>

              <p className="text-lg md:text-xl text-neutral-400 font-light leading-relaxed">
                Toda vez você precisava abrir uma nova aba para pesquisar algo no ChatGPT. Com o Hat, é só copiar, pressionar um atalho e pronto: a IA te responde rápido no canto da tela de maneira privada. Isso é IA útil de verdade.
              </p>

              {/* DOWNLOAD ACTION BOX */}
              <div className="pt-4 space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => handleDownloadClick(primaryDownload.url, primaryDownload.os)}
                    className="inline-flex items-center justify-center space-x-2 bg-[#EDF2F4] text-neutral-950 font-semibold px-7 py-4 rounded-full hover:bg-white transition-all text-sm shadow-md hover:scale-[1.01]"
                  >
                    <Download className="h-4 w-4" />
                    <span>{primaryDownload.label}</span>
                  </button>

                  {/* Platform Selector Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full sm:w-auto inline-flex items-center justify-between space-x-2 bg-neutral-900/90 px-5 py-4 rounded-full text-xs text-neutral-300 hover:bg-neutral-800 transition-colors font-mono"
                    >
                      <span>Mais plataformas</span>
                      <ChevronDown className="h-3.5 w-3.5 ml-2 text-neutral-500" />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-900/95 backdrop-blur-xl p-2.5 z-50 text-xs shadow-2xl rounded-2xl">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleDownloadClick(releases.macArmUrl, 'macos');
                          }}
                          className="w-full text-left block px-3 py-2.5 text-neutral-300 hover:bg-neutral-800 rounded-xl hover:text-white transition-colors"
                        >
                          <div className="font-medium">macOS Apple Silicon (M1+)</div>
                          <div className="text-[10px] text-neutral-500 font-mono">Hat_aarch64.dmg</div>
                        </button>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleDownloadClick(releases.macIntelUrl, 'macos');
                          }}
                          className="w-full text-left block px-3 py-2.5 text-neutral-300 hover:bg-neutral-800 rounded-xl hover:text-white transition-colors"
                        >
                          <div className="font-medium">macOS Intel</div>
                          <div className="text-[10px] text-neutral-500 font-mono">Hat_x64.dmg</div>
                        </button>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleDownloadClick(releases.winUrl, 'windows');
                          }}
                          className="w-full text-left block px-3 py-2.5 text-neutral-300 hover:bg-neutral-800 rounded-xl hover:text-white transition-colors mt-1"
                        >
                          <div className="font-medium">Windows 64-bit</div>
                          <div className="text-[10px] text-neutral-500 font-mono">Hat_x64-setup.exe</div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-xs text-neutral-500 font-mono pt-1">
                  <span>Versão {releases.tag_name}</span>
                </div>
              </div>
            </div>
          </section>

          {/* KEY VALUE HIGHLIGHTS */}
          <section id="recursos" className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-900/40 p-8 rounded-3xl space-y-3">
                <div className="flex items-center space-x-3 text-[#EDF2F4] font-semibold">
                  <ClipboardCheck className="h-5 w-5 text-emerald-400" />
                  <span className="text-xl">Resposta Direta no seu Ctrl + V</span>
                </div>
                <p className="text-sm text-neutral-400 font-light leading-relaxed">
                  A IA responde no canto da tela e a resposta fica automaticamente salva na sua área de transferência. Chegou, copiou, colou onde precisar.
                </p>
              </div>

              <div className="bg-neutral-900/40 p-8 rounded-3xl space-y-3">
                <div className="flex items-center space-x-3 text-[#EDF2F4] font-semibold">
                  <Camera className="h-5 w-5 text-blue-400" />
                  <span className="text-xl">Entende Prints de Tela</span>
                </div>
                <p className="text-sm text-neutral-400 font-light leading-relaxed">
                  Não é só texto. Tire um print da tela ou copie uma imagem e acione o atalho: a IA analisa o contexto visual e te dá a resposta exata.
                </p>
              </div>

              <div className="bg-neutral-900/40 p-8 rounded-3xl space-y-3">
                <div className="flex items-center space-x-3 text-[#EDF2F4] font-semibold">
                  <Zap className="h-5 w-5 text-amber-400" />
                  <span className="text-xl">Zero Troca de Abas</span>
                </div>
                <p className="text-sm text-neutral-400 font-light leading-relaxed">
                  Chega de abrir o navegador a todo momento. O Hat fica silencioso na sua barra de menus e responde instantaneamente sem quebrar seu foco.
                </p>
              </div>

              <div className="bg-neutral-900/40 p-8 rounded-3xl space-y-3">
                <div className="flex items-center space-x-3 text-[#EDF2F4] font-semibold">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" />
                  <span className="text-xl">Privacidade Nativa de Desktop</span>
                </div>
                <p className="text-sm text-neutral-400 font-light leading-relaxed">
                  Sem histórico público em abas abertas de navegadores nem extensões invasivas. Suas consultas são privadas e discretas.
                </p>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section id="como-funciona" className="py-20">
            <div className="mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-[#EDF2F4] mb-2">Simples Assim</h2>
              <p className="text-sm text-neutral-400">Três passos para resolver qualquer dúvida em milissegundos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-neutral-900/30 p-6 rounded-3xl space-y-3">
                <div className="flex items-center space-x-2 text-[#EDF2F4] font-semibold">
                  <MousePointerClick className="h-4 w-4 text-neutral-400" />
                  <span>1. Copie o Texto ou Print</span>
                </div>
                <p className="text-sm text-neutral-400 font-light leading-relaxed">
                  Selecione qualquer pergunta ou tire um print da tela (<kbd className="px-2 py-0.5 bg-neutral-800 rounded-md text-xs font-mono text-neutral-200">Cmd/Ctrl + C</kbd>).
                </p>
              </div>

              <div className="bg-neutral-900/30 p-6 rounded-3xl space-y-3">
                <div className="flex items-center space-x-2 text-[#EDF2F4] font-semibold">
                  <Zap className="h-4 w-4 text-neutral-400" />
                  <span>2. Pressione o Atalho</span>
                </div>
                <p className="text-sm text-neutral-400 font-light leading-relaxed">
                  Aperte <kbd className="px-2 py-0.5 bg-neutral-800 rounded-md text-xs font-mono text-neutral-200">Cmd/Ctrl + Shift + F</kbd> de qualquer aplicativo ou documento.
                </p>
              </div>

              <div className="bg-neutral-900/30 p-6 rounded-3xl space-y-3">
                <div className="flex items-center space-x-2 text-[#EDF2F4] font-semibold">
                  <ClipboardCheck className="h-4 w-4 text-emerald-400" />
                  <span>3. Prontinho no seu Ctrl + V</span>
                </div>
                <p className="text-sm text-neutral-400 font-light leading-relaxed">
                  A IA responde no canto da tela e a resposta já fica salva na área de transferência para você colar onde quiser.
                </p>
              </div>
            </div>
          </section>

          {/* INSTALLATION GUIDANCE */}
          <section id="instalacao" className="py-20">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-[#EDF2F4] mb-2">Instalação e Primeiro Uso</h2>
              <p className="text-sm text-neutral-400">
                O Hat é um utilitário nativo não notarizado corporativamente pela Apple/Microsoft (app independente), por isso o sistema operacional pode exigir uma liberação simples no primeiro início.
              </p>
            </div>

            {/* OS Switcher Tabs */}
            <div className="flex space-x-2 mb-8 bg-neutral-900/50 p-1.5 rounded-full w-fit">
              <button
                onClick={() => setActiveTab('macos')}
                className={`py-2 px-5 text-xs font-medium rounded-full transition-all ${
                  activeTab === 'macos'
                    ? 'bg-[#EDF2F4] text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                macOS (Apple Silicon & Intel)
              </button>
              <button
                onClick={() => setActiveTab('windows')}
                className={`py-2 px-5 text-xs font-medium rounded-full transition-all ${
                  activeTab === 'windows'
                    ? 'bg-[#EDF2F4] text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Windows (64-bit)
              </button>
            </div>

            {activeTab === 'macos' ? (
              <div className="space-y-6">
                <ol className="list-decimal list-inside text-sm text-neutral-300 space-y-3 font-light">
                  <li>Baixe e abra o arquivo <code className="font-mono text-xs bg-neutral-900 px-2 py-0.5 rounded-md">.dmg</code>.</li>
                  <li>Arraste o aplicativo **Hat** para a pasta **Aplicativos**.</li>
                  <li>
                    Execute o comando abaixo **uma única vez** no Terminal para liberar a execução no macOS:
                  </li>
                </ol>

                {/* Terminal Code Snippet */}
                <div className="bg-neutral-900/60 p-5 rounded-2xl font-mono text-xs text-neutral-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3 overflow-x-auto">
                    <Terminal className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                    <code className="text-emerald-400 select-all">xattr -cr /Applications/Hat.app</code>
                  </div>
                  <button
                    onClick={() => handleCopy('xattr -cr /Applications/Hat.app')}
                    className="ml-4 inline-flex items-center space-x-1.5 bg-[#EDF2F4] text-neutral-950 font-medium px-4 py-1.5 rounded-full text-[11px] hover:bg-white transition-all flex-shrink-0"
                  >
                    {copiedCmd ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs text-neutral-400 bg-neutral-900/40 p-5 rounded-2xl">
                  <ShieldAlert className="h-4 w-4 text-neutral-400 inline mr-2" />
                  <span>
                    <strong>Por que este passo é necessário?</strong> Ao baixar um app independente fora da App Store, o macOS exige essa liberação via Terminal na primeira execução.
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-neutral-300 font-light">
                <ol className="list-decimal list-inside space-y-3">
                  <li>Baixe e execute o arquivo <code className="font-mono text-xs bg-neutral-900 px-2 py-0.5 rounded-md">Hat_x64-setup.exe</code>.</li>
                  <li>
                    Caso a tela do **Windows Defender SmartScreen** apareça:
                  </li>
                </ol>
                <div className="bg-neutral-900/40 p-4 rounded-2xl font-mono text-xs text-neutral-400">
                  Clique em <strong className="text-white">"Mais informações"</strong> e depois em <strong className="text-white">"Executar mesmo assim"</strong>.
                </div>
              </div>
            )}
          </section>

          {/* PRICING */}
          <section id="precos" className="py-20">
            <div className="max-w-xl space-y-6">
              <div>
                <span className="text-xs font-mono uppercase text-neutral-500 tracking-wider">Plano Único</span>
                <h2 className="text-3xl font-bold tracking-tight text-[#EDF2F4] mt-1">Acesso Ilimitado à IA no Desktop</h2>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-extrabold tracking-tight text-[#EDF2F4]">R$ 30</span>
                <span className="text-neutral-400 text-sm">/ mês</span>
              </div>

              <ul className="space-y-2.5 text-sm text-neutral-300 font-light">
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Consultas ilimitadas via IA com máxima velocidade</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Resposta direta salva no seu Ctrl + V</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Suporte completo a prints de tela e imagens</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Suporte nativo a macOS (Apple Silicon & Intel) e Windows</span>
                </li>
              </ul>

              <div className="pt-3">
                <button
                  onClick={() => handleDownloadClick(primaryDownload.url, primaryDownload.os)}
                  className="inline-flex items-center space-x-2 bg-[#EDF2F4] text-neutral-950 font-semibold px-8 py-3.5 rounded-full hover:bg-white transition-all text-sm shadow-md hover:scale-[1.01]"
                >
                  <span>Baixar o Hat</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* DOWNLOAD GUIDANCE MODAL */}
        {downloadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 p-7 rounded-3xl shadow-2xl space-y-5">
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-3 text-emerald-400">
                <Download className="h-6 w-6" />
                <span className="font-semibold text-lg text-white">Download Iniciado!</span>
              </div>

              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                Se tiver qualquer dificuldade para instalar ou executar o aplicativo no seu sistema:
              </p>

              <div className="pt-2">
                <button
                  onClick={scrollToTutorial}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-[#EDF2F4] text-neutral-950 font-semibold px-6 py-3.5 rounded-full hover:bg-white transition-all text-sm shadow-md"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Se tiver dificuldade para instalar, clique aqui ({activeTab === 'macos' ? 'macOS' : 'Windows'})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="mx-auto max-w-5xl px-6 py-12 text-xs text-neutral-500 flex flex-col md:flex-row items-center justify-between gap-4">
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
    </div>
  );
}
