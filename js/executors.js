// Executor library data. Edit this list to add, remove or update executors -
// the library grid, filters, stats and detail modal are all generated from it.
// NOTE: values below are template placeholders; replace them with real info.
//
// price:     'Free' | 'Paid'
// status:    'working' | 'updating' | 'down'
// keySystem: true if the executor requires a key to use
// invertLogo: true for dark-on-light logos so they sit well on the dark theme
// website/download: leave as '#' until known - the buttons show as unavailable

// Date the list was last reviewed (YYYY-MM-DD), shown in the hero stats.
window.LIBRARY_UPDATED = '2026-10-17';

window.EXECUTORS = [
  {
    id: 'solara',
    name: 'Solara',
    logo: 'executors/solara/solara-logo.webp',
    ui: 'executors/solara/solara-ui.png',
    tagline: 'Clean, themeable editor with a built-in script hub.',
    description: 'Solara focuses on a calm, distraction-free editing experience. It ships with multiple themes, a workspace explorer and tabbed scripts so you can keep everything organised.',
    price: 'Free',
    keySystem: false,
    platforms: ['Windows'],
    status: 'working',
    features: ['Tabbed editor', 'Theme support', 'Workspace explorer', 'Auto-execute folder'],
    website: 'https://getsolara.dev',
    download: 'https://robloxexecutor.dev/solara/download',
    unc: '92%', userCount: '120k+', rating: '4.8 / 5', updated: 'Oct 17, 2026',
    pros: ['Keyless access', 'Clear editor layout', 'Useful workspace tools'],
    cons: ['Windows only', 'Third-party software risk']
  },
  {
    id: 'xeno',
    name: 'Xeno',
    logo: 'executors/xeno/xeno-logo.png',
    ui: 'executors/xeno/xeno-ui.png',
    tagline: 'Minimal executor built for multi-instance setups.',
    description: 'Xeno keeps things small and fast. Attach to several clients at once and manage them from a single compact window.',
    price: 'Free',
    keySystem: false,
    platforms: ['Windows'],
    status: 'working',
    features: ['Multi-instance', 'Lightweight', 'Client manager', 'Quick attach'],
    website: 'https://robloxexecutor.dev/xeno',
    download: 'https://robloxexecutor.dev/xeno/download',
    unc: '88%', userCount: '75k+', rating: '4.5 / 5', updated: 'Oct 17, 2026',
    pros: ['Lightweight', 'Multi-instance support', 'Keyless access'],
    cons: ['Windows only', 'Smaller documentation library']
  },
  {
    id: 'velocity',
    name: 'Velocity',
    logo: 'executors/velocity/velocity-logo.webp',
    ui: 'executors/velocity/velocity-ui.png',
    tagline: 'Fast attach times and a familiar layout.',
    description: 'Velocity is designed around speed: quick injection, a responsive editor and a straightforward layout that feels familiar from the first launch.',
    price: 'Free',
    keySystem: false,
    platforms: ['Windows'],
    status: 'working',
    features: ['Fast injection', 'Script tabs', 'Console output', 'Settings panel'],
    website: 'https://robloxexecutor.dev/velocity',
    download: 'https://robloxexecutor.dev/velocity/download',
    unc: '84%', userCount: '38k+', rating: '4.3 / 5', updated: 'Oct 17, 2026',
    pros: ['Fast attach flow', 'Familiar layout', 'Console output'],
    cons: ['Windows only', 'Updating feature coverage']
  },
  {
    id: 'volcano',
    name: 'Volcano',
    logo: 'executors/volcano/volcano-logo.webp',
    ui: 'executors/volcano/volcano-ui.png',
    tagline: 'Feature-rich executor with a polished interface.',
    description: 'Volcano bundles a wide set of tools into a polished interface, including a script library, saved scripts and a customisable editor.',
    price: 'Paid',
    keySystem: false,
    platforms: ['Windows'],
    status: 'working',
    features: ['Script library', 'Saved scripts', 'Custom editor', 'Priority updates'],
    website: 'https://volcano.wtf',
    download: 'https://robloxexecutor.dev/volcano/download',
    unc: '94%', userCount: '24k+', rating: '4.7 / 5', updated: 'Oct 17, 2026',
    pros: ['Broad feature set', 'Saved scripts', 'Priority updates'],
    cons: ['Paid access', 'Windows only']
  },
  {
    id: 'madium',
    name: 'Madium',
    logo: 'executors/madium/madium-logo.webp',
    ui: 'executors/madium/madium-ui.png',
    tagline: 'Powerful scripting utility with full docs.',
    description: 'Madium pairs a capable runtime with thorough documentation, so you always know which functions are available and how to use them.',
    price: 'Free',
    keySystem: true,
    platforms: ['Windows'],
    status: 'working',
    features: ['Full documentation', 'Wide function support', 'Script editor', 'Regular updates'],
    website: 'https://getmadium.net',
    download: 'https://robloxexecutor.dev/madium/download',
    unc: '90%', userCount: '18k+', rating: '4.4 / 5', updated: 'Oct 17, 2026',
    pros: ['Detailed documentation', 'Wide function support', 'Regular updates'],
    cons: ['Key system', 'Windows only']
  },
  {
    id: 'real',
    name: 'Real',
    logo: 'executors/real/real-logo.webp',
    ui: 'executors/real/real-executor.png',
    tagline: 'Straightforward executor that just runs.',
    description: 'Real keeps the feature list short and the interface simple. Open it, paste a script, run it.',
    price: 'Free',
    keySystem: true,
    platforms: ['Windows'],
    status: 'working',
    features: ['Simple UI', 'Script tabs', 'Low resource usage', 'Quick setup'],
    website: 'https://robloxexecutor.dev/real',
    download: 'https://robloxexecutor.dev/real/download',
    unc: '79%', userCount: '11k+', rating: '4.1 / 5', updated: 'Oct 17, 2026',
    pros: ['Simple setup', 'Low resource use', 'Straightforward UI'],
    cons: ['Key system', 'Smaller feature set']
  }
];


