<!-- Design System -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CodeSense | Semantic Code Search</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&amp;family=JetBrains+Mono:wght@100..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        body {
            font-family: 'Geist', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .bento-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 16px;
        }
        .glow-effect {
            position: relative;
        }
        .glow-effect::after {
            content: '';
            position: absolute;
            inset: -1px;
            background: linear-gradient(45deg, #0058be, transparent, #6cf8bb);
            z-index: -1;
            border-radius: inherit;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .glow-effect:hover::after {
            opacity: 0.15;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary-container": "#a36700",
                        "on-tertiary-fixed-variant": "#653e00",
                        "on-error": "#ffffff",
                        "on-tertiary": "#ffffff",
                        "on-tertiary-fixed": "#2a1700",
                        "tertiary-fixed-dim": "#ffb95f",
                        "tertiary": "#825100",
                        "surface": "#f9f9ff",
                        "on-secondary": "#ffffff",
                        "on-error-container": "#93000a",
                        "surface-container-low": "#f2f3fd",
                        "primary-fixed": "#d8e2ff",
                        "surface-tint": "#005ac2",
                        "primary": "#0058be",
                        "on-primary-fixed-variant": "#004395",
                        "inverse-primary": "#adc6ff",
                        "error": "#ba1a1a",
                        "on-secondary-container": "#00714d",
                        "surface-container-highest": "#e1e2ec",
                        "secondary-container": "#6cf8bb",
                        "surface-bright": "#f9f9ff",
                        "on-primary-fixed": "#001a42",
                        "inverse-surface": "#2e3038",
                        "on-secondary-fixed": "#002113",
                        "primary-fixed-dim": "#adc6ff",
                        "surface-container": "#ecedf7",
                        "on-background": "#191b23",
                        "on-surface": "#191b23",
                        "outline-variant": "#c2c6d6",
                        "on-primary": "#ffffff",
                        "on-tertiary-container": "#fffbff",
                        "secondary-fixed-dim": "#4edea3",
                        "on-surface-variant": "#424754",
                        "secondary-fixed": "#6ffbbe",
                        "tertiary-fixed": "#ffddb8",
                        "secondary": "#006c49",
                        "on-primary-container": "#fefcff",
                        "surface-container-lowest": "#ffffff",
                        "background": "#f9f9ff",
                        "error-container": "#ffdad6",
                        "inverse-on-surface": "#eff0fa",
                        "on-secondary-fixed-variant": "#005236",
                        "surface-container-high": "#e6e7f2",
                        "surface-dim": "#d8d9e3",
                        "surface-variant": "#e1e2ec",
                        "primary-container": "#2170e4",
                        "outline": "#727785"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "xl": "32px",
                        "margin-desktop": "40px",
                        "xs": "4px",
                        "lg": "24px",
                        "md": "16px",
                        "margin-mobile": "16px",
                        "gutter": "16px",
                        "sm": "8px"
                    },
                    "fontFamily": {
                        "body-sm": ["Geist"],
                        "headline-md": ["Geist"],
                        "code-block": ["JetBrains Mono"],
                        "label-caps": ["JetBrains Mono"],
                        "headline-lg": ["Geist"],
                        "body-md": ["Geist"],
                        "headline-lg-mobile": ["Geist"]
                    },
                    "fontSize": {
                        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                        "code-block": ["14px", {"lineHeight": "22px", "fontWeight": "400"}],
                        "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                        "headline-lg": ["30px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-background text-on-surface">
<!-- TopNavBar -->
<header class="bg-surface docked full-width top-0 sticky z-50 border-b border-outline-variant flex justify-between items-center w-full px-margin-desktop h-16">
<div class="flex items-center gap-xl">
<span class="font-headline-md text-headline-md font-bold text-primary">CodeSense</span>
<nav class="hidden md:flex gap-lg items-center h-full">
<a class="font-body-md text-body-md text-primary border-b-2 border-primary h-full flex items-center px-sm transition-all duration-200" href="#">Explore</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-low transition-colors px-sm h-full flex items-center" href="#">Repositories</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-low transition-colors px-sm h-full flex items-center" href="#">Documentation</a>
</nav>
</div>
<div class="flex items-center gap-md">
<div class="hidden lg:flex items-center bg-surface-container rounded-lg px-md py-xs border border-outline-variant">
<span class="material-symbols-outlined text-on-surface-variant text-[20px] mr-sm">search</span>
<input class="bg-transparent border-none focus:ring-0 text-body-sm font-body-sm w-48" placeholder="Search codebase..." type="text"/>
<span class="text-label-caps font-label-caps text-outline bg-surface-container-high px-xs rounded">⌘K</span>
</div>
<button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-sm rounded-full transition-colors" data-icon="notifications">notifications</button>
<button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-sm rounded-full transition-colors" data-icon="settings">settings</button>
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
<img class="w-full h-full object-cover" data-alt="A professional studio portrait of a software engineer in a modern tech office environment. The lighting is soft and natural, emphasizing a clean and professional corporate aesthetic. The background is slightly blurred with hints of high-end computer hardware and a minimalist white desk setup. The overall color palette is composed of cool blues and crisp whites, reflecting a high-utility tech professional identity." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd1izv0dKMHQeoPBZDFF_-6-7g9HfufYm_x5ZVJPgTwYB1Hxt8LxAI9CqZ_nSdPyNQ-tThbphi_lGctksSz4vgD84THZvApf6R1JmSw7ZYqcMx_wYJu8jeywjj4T7UmdyuXkhaPljEx2F1OKx0k-zGhLTUlGNKH46BImbkOd_MDcxQ0HQVqABypJcONLeHLrySotrzM_9m3s9ktEEqUKf9fIhP3m9M2_HLj6frqRaFezZWcPgG1SClibhPBG2Sz424pM8UPXcDlJw"/>
</div>
</div>
</header>
<main class="relative overflow-hidden">
<!-- Atmospheric Background Element -->
<div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none opacity-40">

</div>
<!-- Hero Section -->
<section class="relative px-margin-mobile md:px-margin-desktop pt-24 pb-32 max-w-7xl mx-auto text-center">
<div class="inline-flex items-center gap-sm bg-secondary-container text-on-secondary-container px-md py-xs rounded-full mb-lg animate-fade-in">
<span class="material-symbols-outlined text-[18px]">auto_awesome</span>
<span class="font-label-caps text-label-caps tracking-wider">POWERED BY ADVANCED LLMS</span>
</div>
<h1 class="font-headline-lg text-[48px] md:text-[72px] leading-tight font-extrabold text-on-surface mb-md max-w-4xl mx-auto tracking-tighter">
                Understand Your Code <br/>
<span class="text-primary">with Artificial Intelligence</span>
</h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto mb-xl text-[18px]">
                Semantic Code Search helps you navigate, analyze, and chat with your GitHub repositories using advanced LLMs. Go beyond keyword matching.
            </p>
<div class="flex flex-col sm:flex-row gap-md justify-center items-center">
<button class="bg-primary text-on-primary px-xl py-md rounded-lg font-body-md text-body-md font-semibold hover:bg-primary-container transition-all active:scale-95 shadow-sm">
                    Get Started
                </button>
<button class="border border-outline-variant text-on-surface px-xl py-md rounded-lg font-body-md text-body-md font-semibold hover:bg-surface-container-low transition-all active:scale-95">
                    View Repositories
                </button>
</div>
<!-- Dashboard Preview Mock -->
<div class="mt-xl relative mx-auto max-w-5xl rounded-xl border border-outline-variant bg-surface-container-lowest shadow-2xl p-sm overflow-hidden group">
<div class="bg-surface-container-high rounded-lg p-md aspect-video border border-outline-variant flex flex-col">
<div class="flex items-center gap-sm border-b border-outline-variant pb-md mb-md">
<div class="flex gap-xs">
<div class="w-3 h-3 rounded-full bg-error"></div>
<div class="w-3 h-3 rounded-full bg-tertiary-container"></div>
<div class="w-3 h-3 rounded-full bg-secondary"></div>
</div>
<div class="flex-1 bg-surface rounded-md px-md py-xs text-left text-body-sm text-outline border border-outline-variant">
                            https://codesense.ai/search?q=how+does+auth+middleware+work
                        </div>
</div>
<div class="flex-1 bento-grid overflow-hidden">
<div class="col-span-3 bg-surface rounded-lg p-sm border border-outline-variant flex flex-col gap-sm">
<div class="h-4 bg-surface-container-highest rounded w-3/4"></div>
<div class="h-4 bg-surface-container-highest rounded w-1/2"></div>
<div class="h-32 bg-surface-container-highest rounded mt-auto"></div>
</div>
<div class="col-span-9 bg-inverse-surface rounded-lg p-md flex flex-col gap-sm font-code-block text-code-block text-on-primary">
<div class="flex justify-between items-center opacity-50 mb-sm">
<span>src/middleware/auth.ts</span>
<span class="material-symbols-outlined">content_copy</span>
</div>
<div class="text-[#4edea3]">export const <span class="text-[#adc6ff]">validateSession</span> = (req, res) =&gt; {</div>
<div class="pl-md text-on-primary-container">const token = req.headers['authorization'];</div>
<div class="pl-md text-on-primary-container">if (!token) return res.status(401).send();</div>
<div class="pl-md text-[#ffb95f]">/* AI INSIGHT: This line handles JWT verification */</div>
<div class="pl-md text-on-primary-container">const user = jwt.verify(token, process.env.SECRET);</div>
<div class="text-[#4edea3]">}</div>
</div>
</div>
</div>
</div>
</section>
<!-- Features Grid -->
<section class="bg-surface-container-low py-32 px-margin-mobile md:px-margin-desktop">
<div class="max-w-7xl mx-auto">
<div class="text-left mb-xl">
<h2 class="font-headline-lg text-headline-lg text-on-surface mb-sm">Built for Complexity</h2>
<p class="font-body-md text-body-md text-on-surface-variant max-w-xl">Deep integration with your development workflow, providing clarity where there was once only noise.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
<!-- Feature 1 -->
<div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant glow-effect transition-all duration-300 hover:-translate-y-1">
<div class="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-md">
<span class="material-symbols-outlined text-primary text-[28px]" data-icon="inventory_2">inventory_2</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-sm">📦 Repository Import</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                            One-click synchronization with your GitHub, GitLab, or Bitbucket accounts. We index your entire history for deep context.
                        </p>
</div>
<!-- Feature 2 -->
<div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant glow-effect transition-all duration-300 hover:-translate-y-1">
<div class="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center mb-md">
<span class="material-symbols-outlined text-on-secondary-container text-[28px]" data-icon="search_insights">search_insights</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-sm">🔍 Semantic Search</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                            Search by intent, not just tokens. Find code that "handles payment webhooks" instead of searching for specific variable names.
                        </p>
</div>
<!-- Feature 3 -->
<div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant glow-effect transition-all duration-300 hover:-translate-y-1">
<div class="w-12 h-12 bg-tertiary-fixed rounded-lg flex items-center justify-center mb-md">
<span class="material-symbols-outlined text-tertiary text-[28px]" data-icon="analytics">analytics</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-sm">📊 Code Analysis</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                            Automated dependency mapping and complexity scoring. Identify technical debt and architectural bottlenecks instantly.
                        </p>
</div>
<!-- Feature 4 -->
<div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant glow-effect transition-all duration-300 hover:-translate-y-1">
<div class="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center mb-md">
<span class="material-symbols-outlined text-on-primary text-[28px]" data-icon="chat">chat</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-sm">💬 AI Assistant</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                            Context-aware coding assistant that knows your whole codebase. Ask questions, refactor code, or generate unit tests.
                        </p>
</div>
</div>
</div>
</section>
<!-- Stats / Trust Section -->
<section class="py-24 px-margin-mobile md:px-margin-desktop border-t border-outline-variant">
<div class="max-w-7xl mx-auto flex flex-wrap justify-center gap-xl md:gap-32">
<div class="text-center">
<div class="font-headline-lg text-headline-lg text-primary mb-xs">500M+</div>
<div class="font-label-caps text-label-caps text-outline">LINES INDEXED</div>
</div>
<div class="text-center">
<div class="font-headline-lg text-headline-lg text-primary mb-xs">50k+</div>
<div class="font-label-caps text-label-caps text-outline">DEVELOPERS</div>
</div>
<div class="text-center">
<div class="font-headline-lg text-headline-lg text-primary mb-xs">99.9%</div>
<div class="font-label-caps text-label-caps text-outline">UPTIME</div>
</div>
<div class="text-center">
<div class="font-headline-lg text-headline-lg text-primary mb-xs">150+</div>
<div class="font-label-caps text-label-caps text-outline">LANGUAGES</div>
</div>
</div>
</section>
<!-- CTA Section -->
<section class="py-32 px-margin-mobile md:px-margin-desktop text-center bg-inverse-surface text-on-primary-container overflow-hidden relative">
<!-- Background element -->
<div class="absolute inset-0 opacity-10 mix-blend-overlay">
<div class="w-full h-full bg-cover bg-center" data-alt="A macro photograph of high-end circuit board patterns with gold traces and obsidian-like surfaces. The image is designed to feel high-tech and sophisticated, with a shallow depth of field focusing on the intricate pathways. The color scheme is dark and minimalist, utilizing black and deep charcoal tones to create a premium, corporate tech atmosphere." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqaxykhczc9KWy1cu0zxrI148g8ZHeLJ1EKuOYpFD27N4u_pD2Kvtwsyx3a18g_D-bS7TnaDRSjocJ9IaAGx6ORfwA27gHf078aHwq4A8oBNFuj2Bk6UI4Fv6sk5xLwWDNAjwS_LFkS674_hPa0LFJmFiTnGBB1qRcypklVIRL_6eiyjCf_3U0u2R0ldaLtrfJ_oTs9FwF47UOdVyJ3XZri_MuowZYwyj7t0zg_-AziDzxSZdheuVCUpacdVrgPJirSZjTrqrBCG4')"></div>
</div>
<div class="relative z-10 max-w-3xl mx-auto">
<h2 class="font-headline-lg text-[40px] leading-tight text-white mb-md">Ready to master your codebase?</h2>
<p class="font-body-md text-body-md text-outline-variant mb-xl opacity-80">Join thousands of software architects and engineers who use CodeSense to ship faster and with higher confidence.</p>
<div class="flex flex-col sm:flex-row gap-md justify-center">
<button class="bg-primary-container text-white px-xl py-md rounded-lg font-body-md text-body-md font-semibold hover:bg-primary transition-all shadow-lg">Create Free Account</button>
<button class="border border-outline text-white px-xl py-md rounded-lg font-body-md text-body-md font-semibold hover:bg-surface-container-variant/10 transition-all">Schedule a Demo</button>
</div>
</div>
</section>
</main>
<footer class="bg-surface border-t border-outline-variant py-xl px-margin-mobile md:px-margin-desktop">
<div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-xl">
<div class="col-span-1">
<span class="font-headline-md text-headline-md font-bold text-primary">CodeSense</span>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-md">The next generation of code understanding and search for technical teams.</p>
</div>
<div>
<h4 class="font-label-caps text-label-caps text-on-surface mb-md">PRODUCT</h4>
<ul class="flex flex-col gap-sm font-body-sm text-body-sm text-on-surface-variant">
<li><a class="hover:text-primary transition-colors" href="#">Features</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Enterprise</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Pricing</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Security</a></li>
</ul>
</div>
<div>
<h4 class="font-label-caps text-label-caps text-on-surface mb-md">RESOURCES</h4>
<ul class="flex flex-col gap-sm font-body-sm text-body-sm text-on-surface-variant">
<li><a class="hover:text-primary transition-colors" href="#">Documentation</a></li>
<li><a class="hover:text-primary transition-colors" href="#">API Reference</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Blog</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Community</a></li>
</ul>
</div>
<div>
<h4 class="font-label-caps text-label-caps text-on-surface mb-md">LEGAL</h4>
<ul class="flex flex-col gap-sm font-body-sm text-body-sm text-on-surface-variant">
<li><a class="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Cookie Policy</a></li>
</ul>
</div>
</div>
<div class="max-w-7xl mx-auto mt-xl pt-md border-t border-outline-variant flex justify-between items-center text-body-sm text-outline">
<span>© 2024 CodeSense Inc. All rights reserved.</span>
<div class="flex gap-md">
<span class="material-symbols-outlined cursor-pointer hover:text-primary">language</span>
<span class="material-symbols-outlined cursor-pointer hover:text-primary">terminal</span>
</div>
</div>
</footer>
<script>
        // Micro-interaction for keyboard shortcut display
        document.addEventListener('keydown', (e) => {
            if (e.metaKey && e.key === 'k') {
                e.preventDefault();
                alert('Search modal would open here.');
            }
        });
    </script>
</body></html>

<!-- Home - Semantic Code Search -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CodeSense - Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&amp;family=Geist:wght@400;600;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .bg-pattern {
            background-image: radial-gradient(circle at 2px 2px, rgba(0, 0, 0, 0.05) 1px, transparent 0);
            background-size: 24px 24px;
        }
        .card-shadow {
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
    </style>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "tertiary-container": "#a36700",
                    "on-tertiary-fixed-variant": "#653e00",
                    "on-error": "#ffffff",
                    "on-tertiary": "#ffffff",
                    "on-tertiary-fixed": "#2a1700",
                    "tertiary-fixed-dim": "#ffb95f",
                    "tertiary": "#825100",
                    "surface": "#f9f9ff",
                    "on-secondary": "#ffffff",
                    "on-error-container": "#93000a",
                    "surface-container-low": "#f2f3fd",
                    "primary-fixed": "#d8e2ff",
                    "surface-tint": "#005ac2",
                    "primary": "#0058be",
                    "on-primary-fixed-variant": "#004395",
                    "inverse-primary": "#adc6ff",
                    "error": "#ba1a1a",
                    "on-secondary-container": "#00714d",
                    "surface-container-highest": "#e1e2ec",
                    "secondary-container": "#6cf8bb",
                    "surface-bright": "#f9f9ff",
                    "on-primary-fixed": "#001a42",
                    "inverse-surface": "#2e3038",
                    "on-secondary-fixed": "#002113",
                    "primary-fixed-dim": "#adc6ff",
                    "surface-container": "#ecedf7",
                    "on-background": "#191b23",
                    "on-surface": "#191b23",
                    "outline-variant": "#c2c6d6",
                    "on-primary": "#ffffff",
                    "on-tertiary-container": "#fffbff",
                    "secondary-fixed-dim": "#4edea3",
                    "on-surface-variant": "#424754",
                    "secondary-fixed": "#6ffbbe",
                    "tertiary-fixed": "#ffddb8",
                    "secondary": "#006c49",
                    "on-primary-container": "#fefcff",
                    "secondary-fixed-dim": "#4edea3",
                    "surface-container-lowest": "#ffffff",
                    "background": "#f9f9ff",
                    "error-container": "#ffdad6",
                    "inverse-on-surface": "#eff0fa",
                    "on-secondary-fixed-variant": "#005236",
                    "surface-container-high": "#e6e7f2",
                    "surface-dim": "#d8d9e3",
                    "surface-variant": "#e1e2ec",
                    "primary-container": "#2170e4",
                    "outline": "#727785"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "xl": "32px",
                    "margin-desktop": "40px",
                    "xs": "4px",
                    "lg": "24px",
                    "md": "16px",
                    "margin-mobile": "16px",
                    "gutter": "16px",
                    "sm": "8px"
            },
            "fontFamily": {
                    "body-sm": ["Geist"],
                    "headline-md": ["Geist"],
                    "code-block": ["JetBrains Mono"],
                    "label-caps": ["JetBrains Mono"],
                    "headline-lg": ["Geist"],
                    "body-md": ["Geist"],
                    "headline-lg-mobile": ["Geist"]
            },
            "fontSize": {
                    "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                    "code-block": ["14px", {"lineHeight": "22px", "fontWeight": "400"}],
                    "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                    "headline-lg": ["30px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                    "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
            }
          },
        },
      }
    </script>
</head>
<body class="bg-background text-on-surface font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden">
<!-- TopNavBar -->
<header class="bg-surface docked full-width top-0 sticky z-50 border-b border-outline-variant flat no shadows flex justify-between items-center w-full px-margin-desktop h-16">
<div class="flex items-center gap-xl">
<span class="font-headline-md text-headline-md font-bold text-primary">CodeSense</span>
<nav class="hidden md:flex gap-lg h-full items-center">
<a class="font-body-md text-body-md text-primary border-b-2 border-primary h-full flex items-center px-sm transition-all duration-200" href="#">Dashboard</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-low transition-colors h-full flex items-center px-sm" href="#">Files</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-low transition-colors h-full flex items-center px-sm" href="#">Insights</a>
</nav>
</div>
<div class="flex items-center gap-md">
<div class="relative hidden sm:block">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input class="pl-10 pr-4 py-2 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary w-64 text-body-sm" placeholder="Search code semantics..." type="text"/>
</div>
<button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">notifications</button>
<button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">settings</button>
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant ml-2">
<img class="w-full h-full object-cover" data-alt="A professional headshot of a software engineer in a modern office setting. The lighting is soft and natural, emphasizing a technical minimalist aesthetic. The background features blurred lines of code on a monitor and a clean desk arrangement with high-key neutral colors and blue accents." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRC5xa3HbrTErEB1JHtL6862hj8NMm7TQ55t6KQe6Ah7ccTkYU5YZ6nqlCt0wofQtV8GR8ewLncYETKu7HK1a3JesY9uj5FPJb6JuJYRfkC0vH3mZRhZOzLxhe5VaiNVZ8-G9s3DMKPqRUwZTJir00r7UWc2Hfo2lMY095k9dvV9-gnlkjrE9R2PZ5PbrHy4HqS-nB8sp5E4mrdPeTI6UF9xVK7E7WUth1Y5pfrmICwmkgfNu6XV6syxr6LwSzj_cJ3SmvEKf60jc"/>
</div>
</div>
</header>
<main class="flex min-h-screen">
<!-- SideNavBar -->
<aside class="hidden md:flex flex-col py-md px-md gap-sm fixed left-0 top-16 h-[calc(100vh-64px)] w-[280px] bg-surface-container-lowest border-r border-outline-variant flat no shadows">
<div class="flex items-center gap-sm mb-lg px-xs">
<div class="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
<span class="material-symbols-outlined">data_object</span>
</div>
<div>
<h3 class="font-body-sm text-body-sm font-semibold text-on-surface">Project Alpha</h3>
<p class="font-body-sm text-[12px] text-on-surface-variant">main branch</p>
</div>
</div>
<div class="flex flex-col gap-xs">
<a class="flex items-center gap-md p-md rounded-lg bg-secondary-container text-on-secondary-container font-medium scale-95 active:scale-100 transition-transform" href="#">
<span class="material-symbols-outlined">folder</span>
<span>Files</span>
</a>
<a class="flex items-center gap-md p-md rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors scale-95 active:scale-100 transition-transform" href="#">
<span class="material-symbols-outlined">code</span>
<span>Symbols</span>
</a>
<a class="flex items-center gap-md p-md rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors scale-95 active:scale-100 transition-transform" href="#">
<span class="material-symbols-outlined">search</span>
<span>Search</span>
</a>
<a class="flex items-center gap-md p-md rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors scale-95 active:scale-100 transition-transform" href="#">
<span class="material-symbols-outlined">chat</span>
<span>Chat</span>
</a>
<a class="flex items-center gap-md p-md rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors scale-95 active:scale-100 transition-transform" href="#">
<span class="material-symbols-outlined">analytics</span>
<span>Insights</span>
</a>
</div>
<div class="mt-auto flex flex-col gap-xs border-t border-outline-variant pt-md">
<a class="flex items-center gap-md p-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-body-sm" href="#">
<span class="material-symbols-outlined">description</span>
<span>Docs</span>
</a>
<a class="flex items-center gap-md p-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-body-sm" href="#">
<span class="material-symbols-outlined">help</span>
<span>Support</span>
</a>
</div>
</aside>
<!-- Content Canvas -->
<div class="flex-1 ml-0 md:ml-[280px] p-margin-mobile md:p-margin-desktop bg-pattern">
<!-- Welcome Header -->
<section class="mb-xl">
<h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-xs">Welcome back, Developer</h1>
<p class="font-body-md text-body-md text-on-surface-variant">Manage your connected repositories and system status.</p>
</section>
<!-- 2x2 Bento Grid -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-lg">
<!-- Server Status Card -->
<div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg card-shadow flex flex-col justify-between hover:border-primary transition-all duration-300">
<div>
<div class="flex justify-between items-start mb-md">
<span class="font-label-caps text-label-caps text-on-surface-variant">SYSTEM ARCHITECTURE</span>
<span class="material-symbols-outlined text-on-secondary-container bg-secondary-container/20 p-2 rounded-full">dns</span>
</div>
<h2 class="font-headline-md text-headline-md mb-lg">Server Status</h2>
</div>
<div class="space-y-md">
<div class="flex items-center justify-between p-md bg-surface rounded-lg border border-outline-variant/30">
<span class="text-on-surface-variant font-body-sm">Connected</span>
<span class="flex items-center gap-xs text-on-secondary-container font-semibold font-body-sm">
<span class="material-symbols-outlined text-[18px]">check_circle</span>
                                Verified
                            </span>
</div>
<div class="flex items-center justify-between p-md bg-surface rounded-lg border border-outline-variant/30">
<span class="text-on-surface-variant font-body-sm">Environment</span>
<span class="font-label-caps px-2 py-1 bg-primary-container text-on-primary-fixed rounded">Production</span>
</div>
<div class="flex items-center justify-between p-md bg-surface rounded-lg border border-outline-variant/30">
<span class="text-on-surface-variant font-body-sm">Service</span>
<span class="flex items-center gap-xs text-on-secondary-container font-semibold font-body-sm">
<span class="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                                Online
                            </span>
</div>
</div>
</div>
<!-- Repository Management Card -->
<div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg card-shadow flex flex-col justify-between hover:border-primary transition-all duration-300">
<div>
<div class="flex justify-between items-start mb-md">
<span class="font-label-caps text-label-caps text-on-surface-variant">ACTIVE REPOSITORIES</span>
<span class="material-symbols-outlined text-primary bg-primary-fixed/20 p-2 rounded-full">account_tree</span>
</div>
<h2 class="font-headline-md text-headline-md mb-lg">Repository Management</h2>
</div>
<div class="grid grid-cols-2 gap-md">
<div class="flex flex-col gap-xs p-md bg-surface rounded-lg border border-outline-variant/30 text-center">
<span class="text-headline-lg font-bold text-primary">3</span>
<span class="text-on-surface-variant text-[12px] font-medium uppercase tracking-wider">Active Repos</span>
</div>
<div class="flex flex-col gap-xs p-md bg-surface rounded-lg border border-outline-variant/30 text-center">
<span class="text-headline-lg font-bold text-tertiary">1</span>
<span class="text-on-surface-variant text-[12px] font-medium uppercase tracking-wider">Pending Scan</span>
</div>
</div>
<div class="mt-md bg-inverse-surface rounded-lg p-md">
<div class="flex items-center gap-md">
<div class="flex-1 bg-surface-variant/20 h-1.5 rounded-full overflow-hidden">
<div class="bg-primary w-[75%] h-full rounded-full"></div>
</div>
<span class="text-code-block text-[12px] text-surface">75% Indexing</span>
</div>
</div>
</div>
<!-- Quick Actions Card -->
<div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg card-shadow flex flex-col hover:border-primary transition-all duration-300">
<div class="flex justify-between items-start mb-md">
<span class="font-label-caps text-label-caps text-on-surface-variant">DEVELOPER SHORTCUTS</span>
<span class="material-symbols-outlined text-tertiary bg-tertiary-fixed/20 p-2 rounded-full">bolt</span>
</div>
<h2 class="font-headline-md text-headline-md mb-lg">Quick Actions</h2>
<div class="flex flex-col gap-md flex-1 justify-center">
<button class="w-full flex items-center justify-between p-lg bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-all active:scale-[0.98]">
<span class="flex items-center gap-md">
<span class="material-symbols-outlined">visibility</span>
                                View All Repositories
                            </span>
<span class="material-symbols-outlined">arrow_forward</span>
</button>
<button class="w-full flex items-center justify-between p-lg bg-secondary text-on-secondary rounded-lg font-semibold hover:opacity-90 transition-all active:scale-[0.98]">
<span class="flex items-center gap-md">
<span class="material-symbols-outlined">add_box</span>
                                Add New Repo
                            </span>
<span class="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
<!-- Getting Started Guide Card -->
<div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg card-shadow flex flex-col hover:border-primary transition-all duration-300">
<div class="flex justify-between items-start mb-md">
<span class="font-label-caps text-label-caps text-on-surface-variant">ONBOARDING PATH</span>
<span class="material-symbols-outlined text-on-surface-variant bg-surface-container-highest p-2 rounded-full">school</span>
</div>
<h2 class="font-headline-md text-headline-md mb-lg">Getting Started Guide</h2>
<div class="space-y-xs">
<div class="flex items-start gap-md p-md hover:bg-surface-container rounded-lg transition-colors group cursor-pointer">
<div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">1</div>
<div class="flex-1">
<p class="font-semibold text-body-sm">Connect your Version Control</p>
<p class="text-[12px] text-on-surface-variant">Authorize GitHub or GitLab access.</p>
</div>
</div>
<div class="flex items-start gap-md p-md hover:bg-surface-container rounded-lg transition-colors group cursor-pointer">
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-on-surface-variant shrink-0">2</div>
<div class="flex-1">
<p class="font-semibold text-body-sm">Select Primary Branch</p>
<p class="text-[12px] text-on-surface-variant">Choose main or development for indexing.</p>
</div>
</div>
<div class="flex items-start gap-md p-md hover:bg-surface-container rounded-lg transition-colors group cursor-pointer">
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-on-surface-variant shrink-0">3</div>
<div class="flex-1">
<p class="font-semibold text-body-sm">Run Semantic Analysis</p>
<p class="text-[12px] text-on-surface-variant">Generate embeddings for vector search.</p>
</div>
</div>
<div class="flex items-start gap-md p-md hover:bg-surface-container rounded-lg transition-colors group cursor-pointer">
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-on-surface-variant shrink-0">4</div>
<div class="flex-1">
<p class="font-semibold text-body-sm">Deploy CodeSense API</p>
<p class="text-[12px] text-on-surface-variant">Integrate the search endpoint into your CLI.</p>
</div>
</div>
</div>
</div>
</div>
<!-- Visual Asset Section -->
<section class="mt-xl relative rounded-xl overflow-hidden h-48 border border-outline-variant flex items-center px-lg">
<div class="absolute inset-0 bg-cover bg-center -z-10 opacity-30" data-alt="A clean, wide-angle shot of a high-tech data center interior. Soft blue and teal light pulses from the server racks, creating a futuristic yet professional atmosphere. The floors are polished white and reflective, enhancing the light-mode corporate aesthetic of the overall dashboard." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDS_JwaZog6UqBp_3CaoQA5icNZWK-CE8cNpAGsgOCrYQhprdloP10ceFZADNVI2QhV-ija8SST3uNAqIZSiugStKFMbmaVp5oiKOYqJF2amQ8VAMeYu5_Fjraspn5-cY4x_Kfc7h_nAPujETlcxf67Q093XEoK8rlsdZydeD87T-zqlWhdtmzDeVNldVfcR6gx96YTgFz36niYgUO-eg05CVIds30kfthCTyrt3K-9rBU1mCIoR7NSzrYbzk5ii_BzWY6h0pE5lj0')"></div>
<div class="max-w-md">
<h3 class="font-headline-md text-on-surface mb-xs">Advanced Insights</h3>
<p class="text-body-sm text-on-surface-variant">Our LLM is currently processing 42.1k lines of code across your repositories to optimize search relevance.</p>
</div>
</section>
</div>
</main>
<script>
        // Micro-interaction: Active state logic
        const navItems = document.querySelectorAll('nav a');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                navItems.forEach(i => {
                    i.classList.remove('text-primary', 'border-b-2', 'border-primary');
                    i.classList.add('text-on-surface-variant');
                });
                item.classList.remove('text-on-surface-variant');
                item.classList.add('text-primary', 'border-b-2', 'border-primary');
            });
        });
    </script>
</body></html>

<!-- Dashboard - Semantic Code Search -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CodeSense | Semantic Code Search</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&amp;family=JetBrains+Mono:wght@100..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary-container": "#a36700",
                        "on-tertiary-fixed-variant": "#653e00",
                        "on-error": "#ffffff",
                        "on-tertiary": "#ffffff",
                        "on-tertiary-fixed": "#2a1700",
                        "tertiary-fixed-dim": "#ffb95f",
                        "tertiary": "#825100",
                        "surface": "#f9f9ff",
                        "on-secondary": "#ffffff",
                        "on-error-container": "#93000a",
                        "surface-container-low": "#f2f3fd",
                        "primary-fixed": "#d8e2ff",
                        "surface-tint": "#005ac2",
                        "primary": "#0058be",
                        "on-primary-fixed-variant": "#004395",
                        "inverse-primary": "#adc6ff",
                        "error": "#ba1a1a",
                        "on-secondary-container": "#00714d",
                        "surface-container-highest": "#e1e2ec",
                        "secondary-container": "#6cf8bb",
                        "surface-bright": "#f9f9ff",
                        "on-primary-fixed": "#001a42",
                        "inverse-surface": "#2e3038",
                        "on-secondary-fixed": "#002113",
                        "primary-fixed-dim": "#adc6ff",
                        "surface-container": "#ecedf7",
                        "on-background": "#191b23",
                        "on-surface": "#191b23",
                        "outline-variant": "#c2c6d6",
                        "on-primary": "#ffffff",
                        "on-tertiary-container": "#fffbff",
                        "secondary-fixed-dim": "#4edea3",
                        "on-surface-variant": "#424754",
                        "secondary-fixed": "#6ffbbe",
                        "tertiary-fixed": "#ffddb8",
                        "secondary": "#006c49",
                        "on-primary-container": "#fefcff",
                        "surface-container-lowest": "#ffffff",
                        "background": "#f9f9ff",
                        "error-container": "#ffdad6",
                        "inverse-on-surface": "#eff0fa",
                        "on-secondary-fixed-variant": "#005236",
                        "surface-container-high": "#e6e7f2",
                        "surface-dim": "#d8d9e3",
                        "surface-variant": "#e1e2ec",
                        "primary-container": "#2170e4",
                        "outline": "#727785"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "xl": "32px",
                        "margin-desktop": "40px",
                        "xs": "4px",
                        "lg": "24px",
                        "md": "16px",
                        "margin-mobile": "16px",
                        "gutter": "16px",
                        "sm": "8px"
                    },
                    "fontFamily": {
                        "body-sm": ["Geist"],
                        "headline-md": ["Geist"],
                        "code-block": ["JetBrains Mono"],
                        "label-caps": ["JetBrains Mono"],
                        "headline-lg": ["Geist"],
                        "body-md": ["Geist"],
                        "headline-lg-mobile": ["Geist"]
                    },
                    "fontSize": {
                        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                        "code-block": ["14px", {"lineHeight": "22px", "fontWeight": "400"}],
                        "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                        "headline-lg": ["30px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            vertical-align: middle;
        }
        body {
            background-color: #f9f9ff;
            color: #191b23;
            font-family: 'Geist', sans-serif;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c2c6d6;
            border-radius: 10px;
        }
        .ambient-shadow {
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body class="bg-background min-h-screen">
<!-- TopNavBar Shell -->
<nav class="bg-surface dark:bg-surface-dim text-primary dark:text-primary-fixed-dim docked full-width top-0 sticky z-50 border-b border-outline-variant dark:border-outline flex justify-between items-center w-full px-margin-desktop h-16">
<div class="flex items-center gap-md">
<span class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">CodeSense</span>
<div class="hidden md:flex items-center gap-sm ml-xl font-body-md text-body-md">
<a class="text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors px-sm py-xs rounded cursor-pointer transition-all duration-200" href="#">Dashboard</a>
<a class="text-primary dark:text-primary-fixed-dim border-b-2 border-primary hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors px-sm py-xs cursor-pointer transition-all duration-200" href="#">Repositories</a>
<a class="text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors px-sm py-xs rounded cursor-pointer transition-all duration-200" href="#">Organizations</a>
</div>
</div>
<div class="flex items-center gap-md">
<button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest p-sm rounded-full transition-colors cursor-pointer">notifications</button>
<button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest p-sm rounded-full transition-colors cursor-pointer">settings</button>
<div class="w-8 h-8 rounded-full overflow-hidden bg-outline-variant">
<img alt="User profile photo" class="w-full h-full object-cover" data-alt="A sharp, professional headshot of a software engineer in a modern minimalist workspace. Soft natural lighting from a side window highlights details. The background shows a blurry setup with high-end development gear and a clean desk, reinforcing the theme of high-utility professionalism and systematic work environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqFaPFET_Qv6olyvRw83HVD6BpOVaq7oPLYBOnyppyGFmdtJzKlVilvZUiKRRVmyoH09LAHNsqgLiaFSkKn02O4xhF3vb56qrsEhJMbfBDvYXvyEPFepjtw5WCUlmGZHJOXZ9AdVXwImR8mAFD-s0lgRT0RF2g5VLat7s_k7Z9HleI1bNwWgtSChbGNI-bJI28I_fvZzbuF7ac5F_Yy9-KS3N9KsLLySbVbs-gc1AQNjQLDyFmN-Pr6KfarF0CvU4xasT50jR8W2g"/>
</div>
</div>
</nav>
<div class="flex">
<!-- SideNavBar Shell (Project Specific) -->
<aside class="bg-surface-container-lowest dark:bg-inverse-surface border-r border-outline-variant dark:border-outline fixed left-0 top-16 h-[calc(100vh-64px)] w-[280px] hidden md:flex flex-col py-md px-md gap-sm">
<div class="flex items-center gap-sm mb-lg px-xs">
<div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">code</span>
</div>
<div>
<h3 class="font-headline-md text-headline-md font-bold text-primary">Project Alpha</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">main branch</p>
</div>
</div>
<nav class="flex flex-col gap-xs flex-1 overflow-y-auto custom-scrollbar">
<div class="text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors py-sm px-md rounded-lg flex items-center gap-md cursor-pointer transition-transform scale-95 active:scale-100">
<span class="material-symbols-outlined">folder</span>
<span>Files</span>
</div>
<div class="text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors py-sm px-md rounded-lg flex items-center gap-md cursor-pointer transition-transform scale-95 active:scale-100">
<span class="material-symbols-outlined">code</span>
<span>Symbols</span>
</div>
<div class="bg-secondary-container text-on-secondary-container rounded-lg font-medium font-body-sm text-body-sm py-sm px-md flex items-center gap-md cursor-pointer transition-transform scale-95 active:scale-100">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">search</span>
<span>Search</span>
</div>
<div class="text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors py-sm px-md rounded-lg flex items-center gap-md cursor-pointer transition-transform scale-95 active:scale-100">
<span class="material-symbols-outlined">chat</span>
<span>Chat</span>
</div>
<div class="text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors py-sm px-md rounded-lg flex items-center gap-md cursor-pointer transition-transform scale-95 active:scale-100">
<span class="material-symbols-outlined">analytics</span>
<span>Insights</span>
</div>
</nav>
<div class="pt-md border-t border-outline-variant">
<div class="text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors py-sm px-md rounded-lg flex items-center gap-md cursor-pointer transition-transform scale-95 active:scale-100">
<span class="material-symbols-outlined">description</span>
<span>Docs</span>
</div>
<div class="text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors py-sm px-md rounded-lg flex items-center gap-md cursor-pointer transition-transform scale-95 active:scale-100">
<span class="material-symbols-outlined">help</span>
<span>Support</span>
</div>
</div>
</aside>
<!-- Main Content Area -->
<main class="flex-1 md:ml-[280px] min-h-[calc(100vh-64px)] p-margin-mobile md:p-margin-desktop">
<!-- Breadcrumbs -->
<div class="flex items-center gap-xs font-body-sm text-body-sm text-on-surface-variant mb-xl">
<span class="hover:text-primary cursor-pointer transition-colors">Repositories</span>
<span class="material-symbols-outlined text-[16px]">chevron_right</span>
<span class="hover:text-primary cursor-pointer transition-colors">facebook/react</span>
<span class="material-symbols-outlined text-[16px]">chevron_right</span>
<span class="text-on-surface font-medium">Search</span>
</div>
<!-- Page Header -->
<header class="mb-xl">
<h1 class="font-headline-lg text-headline-lg text-on-surface mb-xs">Semantic Search</h1>
<p class="font-body-md text-body-md text-on-surface-variant">Find logic, components, and functions by intent across the entire codebase.</p>
</header>
<!-- Search Section -->
<section class="max-w-4xl space-y-md">
<div class="relative group">
<div class="absolute inset-y-0 left-md flex items-center pointer-events-none">
<span class="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">search</span>
</div>
<input class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-md pl-12 pr-md font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ambient-shadow" placeholder="Search for 'how do we handle state transitions' or 'useEffect implementation'..." type="text"/>
</div>
<!-- Filters & Suggestions -->
<div class="flex flex-wrap items-center justify-between gap-md">
<div class="flex items-center gap-sm bg-surface-container-low p-xs rounded-lg">
<button class="px-md py-xs bg-white text-on-surface font-label-caps text-label-caps rounded-sm ambient-shadow transition-all">ALL</button>
<button class="px-md py-xs text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps rounded-sm transition-colors">FUNCTIONS</button>
<button class="px-md py-xs text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps rounded-sm transition-colors">CLASSES</button>
<button class="px-md py-xs text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps rounded-sm transition-colors">CONSTANTS</button>
</div>
<div class="flex flex-wrap gap-sm">
<span class="font-body-sm text-body-sm text-on-surface-variant mr-xs self-center">Suggestions:</span>
<button class="bg-secondary-container/20 text-secondary border border-secondary/10 px-sm py-xs rounded-full font-body-sm text-body-sm hover:bg-secondary-container/40 transition-colors">"useEffect implementation"</button>
<button class="bg-secondary-container/20 text-secondary border border-secondary/10 px-sm py-xs rounded-full font-body-sm text-body-sm hover:bg-secondary-container/40 transition-colors">"createRoot"</button>
</div>
</div>
</section>
<!-- Search Results Area -->
<section class="mt-xl max-w-5xl space-y-lg">
<!-- Result Group 1: File Heading -->
<div class="space-y-sm">
<div class="flex items-center gap-sm p-sm bg-surface-container-high rounded-t-lg border-x border-t border-outline-variant">
<span class="material-symbols-outlined text-primary text-[20px]">keyboard_arrow_down</span>
<span class="font-label-caps text-label-caps text-on-surface-variant">packages/react-reconciler/src/ReactFiberHooks.js</span>
</div>
<div class="grid grid-cols-1 gap-sm">
<!-- Result Card 1 -->
<div class="bg-surface-container-lowest border border-outline-variant p-md rounded-lg ambient-shadow hover:border-primary transition-all group cursor-pointer">
<div class="flex justify-between items-start mb-sm">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-tertiary">bolt</span>
<h4 class="font-code-block text-code-block font-semibold text-primary">mountEffect</h4>
<span class="bg-secondary-container text-on-secondary-container px-xs py-[2px] rounded font-label-caps text-[10px]">98% RELEVANCE</span>
</div>
<span class="font-body-sm text-body-sm text-on-surface-variant">Line 1242</span>
</div>
<div class="bg-inverse-surface rounded p-sm font-code-block text-code-block text-[#d1d5db] overflow-x-auto">
<pre><code><span class="text-[#f472b6]">function</span> <span class="text-[#60a5fa]">mountEffect</span>(create, deps) {
  <span class="text-[#4ade80]">return</span> <span class="text-[#60a5fa]">mountEffectImpl</span>(
    <span class="text-[#facc15]">PassiveEffect</span> | <span class="text-[#facc15]">PassiveStaticEffect</span>,
    <span class="text-[#facc15]">HookPassive</span>,
    create,
    deps,
  );
}</code></pre>
</div>
</div>
<!-- Result Card 2 -->
<div class="bg-surface-container-lowest border border-outline-variant p-md rounded-lg ambient-shadow hover:border-primary transition-all group cursor-pointer">
<div class="flex justify-between items-start mb-sm">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-tertiary">bolt</span>
<h4 class="font-code-block text-code-block font-semibold text-primary">updateEffect</h4>
<span class="bg-secondary-container text-on-secondary-container px-xs py-[2px] rounded font-label-caps text-[10px]">94% RELEVANCE</span>
</div>
<span class="font-body-sm text-body-sm text-on-surface-variant">Line 1251</span>
</div>
<div class="bg-inverse-surface rounded p-sm font-code-block text-code-block text-[#d1d5db] overflow-x-auto">
<pre><code><span class="text-[#f472b6]">function</span> <span class="text-[#60a5fa]">updateEffect</span>(create, deps) {
  <span class="text-[#4ade80]">return</span> <span class="text-[#60a5fa]">updateEffectImpl</span>(
    <span class="text-[#facc15]">PassiveEffect</span> | <span class="text-[#facc15]">PassiveStaticEffect</span>,
    <span class="text-[#facc15]">HookPassive</span>,
    create,
    deps,
  );
}</code></pre>
</div>
</div>
</div>
</div>
<!-- Result Group 2: File Heading -->
<div class="space-y-sm">
<div class="flex items-center gap-sm p-sm bg-surface-container-high rounded-t-lg border-x border-t border-outline-variant">
<span class="material-symbols-outlined text-primary text-[20px]">keyboard_arrow_down</span>
<span class="font-label-caps text-label-caps text-on-surface-variant">packages/react-dom/src/client/ReactDOMRoot.js</span>
</div>
<div class="grid grid-cols-1 gap-sm">
<div class="bg-surface-container-lowest border border-outline-variant p-md rounded-lg ambient-shadow hover:border-primary transition-all group cursor-pointer">
<div class="flex justify-between items-start mb-sm">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary">schema</span>
<h4 class="font-code-block text-code-block font-semibold text-primary">createRoot</h4>
<span class="bg-tertiary-fixed text-on-tertiary-fixed px-xs py-[2px] rounded font-label-caps text-[10px]">89% RELEVANCE</span>
</div>
<span class="font-body-sm text-body-sm text-on-surface-variant">Line 156</span>
</div>
<div class="bg-inverse-surface rounded p-sm font-code-block text-code-block text-[#d1d5db] overflow-x-auto">
<pre><code><span class="text-[#4ade80]">export</span> <span class="text-[#f472b6]">function</span> <span class="text-[#60a5fa]">createRoot</span>(container, options) {
  <span class="text-[#4ade80]">if</span> (!<span class="text-[#60a5fa]">isValidContainer</span>(container)) {
    <span class="text-[#4ade80]">throw</span> <span class="text-[#f472b6]">new</span> <span class="text-[#facc15]">Error</span>(<span class="text-[#fb923c]">'createRoot(...): Target container is not a DOM element.'</span>);
  }
  <span class="text-[#71717a]">// ... implementation continues</span>
}</code></pre>
</div>
</div>
</div>
</div>
</section>
</main>
</div>
<!-- Mobile Bottom Navigation Shell -->
<div class="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant h-16 flex items-center justify-around px-md z-50">
<button class="flex flex-col items-center gap-xs text-on-surface-variant">
<span class="material-symbols-outlined">folder</span>
<span class="text-[10px] font-label-caps">FILES</span>
</button>
<button class="flex flex-col items-center gap-xs text-primary">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">search</span>
<span class="text-[10px] font-label-caps">SEARCH</span>
</button>
<button class="flex flex-col items-center gap-xs text-on-surface-variant">
<span class="material-symbols-outlined">chat</span>
<span class="text-[10px] font-label-caps">CHAT</span>
</button>
<button class="flex flex-col items-center gap-xs text-on-surface-variant">
<span class="material-symbols-outlined">settings</span>
<span class="text-[10px] font-label-caps">SETTINGS</span>
</button>
</div>
<script>
        // Simple micro-interaction for active state switching in filters
        document.querySelectorAll('button[class*="font-label-caps"]').forEach(button => {
            button.addEventListener('click', function() {
                // In a real app this would trigger search filtering
                const container = this.parentElement;
                container.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('bg-white', 'text-on-surface', 'ambient-shadow');
                    btn.classList.add('text-on-surface-variant');
                });
                this.classList.add('bg-white', 'text-on-surface', 'ambient-shadow');
                this.classList.remove('text-on-surface-variant');
            });
        });

        // Hover effect for result cards
        document.querySelectorAll('.group.cursor-pointer').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    </script>
</body></html>

<!-- Semantic Search - Semantic Code Search -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Repositories | CodeSense</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&amp;family=Geist:wght@400;600;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "tertiary-container": "#a36700",
                    "on-tertiary-fixed-variant": "#653e00",
                    "on-error": "#ffffff",
                    "on-tertiary": "#ffffff",
                    "on-tertiary-fixed": "#2a1700",
                    "tertiary-fixed-dim": "#ffb95f",
                    "tertiary": "#825100",
                    "surface": "#f9f9ff",
                    "on-secondary": "#ffffff",
                    "on-error-container": "#93000a",
                    "surface-container-low": "#f2f3fd",
                    "primary-fixed": "#d8e2ff",
                    "surface-tint": "#005ac2",
                    "primary": "#0058be",
                    "on-primary-fixed-variant": "#004395",
                    "inverse-primary": "#adc6ff",
                    "error": "#ba1a1a",
                    "on-secondary-container": "#00714d",
                    "surface-container-highest": "#e1e2ec",
                    "secondary-container": "#6cf8bb",
                    "surface-bright": "#f9f9ff",
                    "on-primary-fixed": "#001a42",
                    "inverse-surface": "#2e3038",
                    "on-secondary-fixed": "#002113",
                    "primary-fixed-dim": "#adc6ff",
                    "surface-container": "#ecedf7",
                    "on-background": "#191b23",
                    "on-surface": "#191b23",
                    "outline-variant": "#c2c6d6",
                    "on-primary": "#ffffff",
                    "on-tertiary-container": "#fffbff",
                    "secondary-fixed-dim": "#4edea3",
                    "on-surface-variant": "#424754",
                    "secondary-fixed": "#6ffbbe",
                    "tertiary-fixed": "#ffddb8",
                    "secondary": "#006c49",
                    "on-primary-container": "#fefcff",
                    "secondary-fixed-dim": "#4edea3",
                    "on-surface-variant": "#424754",
                    "secondary-fixed": "#6ffbbe",
                    "tertiary-fixed": "#ffddb8",
                    "secondary": "#006c49",
                    "on-primary-container": "#fefcff",
                    "surface-container-lowest": "#ffffff",
                    "background": "#f9f9ff",
                    "error-container": "#ffdad6",
                    "inverse-on-surface": "#eff0fa",
                    "on-secondary-fixed-variant": "#005236",
                    "surface-container-high": "#e6e7f2",
                    "surface-dim": "#d8d9e3",
                    "surface-variant": "#e1e2ec",
                    "primary-container": "#2170e4",
                    "outline": "#727785"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "xl": "32px",
                    "margin-desktop": "40px",
                    "xs": "4px",
                    "lg": "24px",
                    "md": "16px",
                    "margin-mobile": "16px",
                    "gutter": "16px",
                    "sm": "8px"
            },
            "fontFamily": {
                    "body-sm": ["Geist"],
                    "headline-md": ["Geist"],
                    "code-block": ["JetBrains Mono"],
                    "label-caps": ["JetBrains Mono"],
                    "headline-lg": ["Geist"],
                    "body-md": ["Geist"],
                    "headline-lg-mobile": ["Geist"]
            },
            "fontSize": {
                    "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                    "code-block": ["14px", {"lineHeight": "22px", "fontWeight": "400"}],
                    "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                    "headline-lg": ["30px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                    "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
            }
          },
        },
      }
    </script>
<style>
        body { font-family: 'Geist', sans-serif; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            vertical-align: middle;
        }
        .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    </style>
</head>
<body class="bg-background text-on-surface min-h-screen">
<!-- TopNavBar -->
<header class="bg-surface dark:bg-surface-dim border-b border-outline-variant dark:border-outline docked full-width top-0 sticky z-50 flex justify-between items-center w-full px-margin-desktop h-16">
<div class="flex items-center gap-xl">
<span class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">CodeSense</span>
<nav class="hidden md:flex gap-md h-full">
<a class="text-primary dark:text-primary-fixed-dim border-b-2 border-primary flex items-center h-16 px-sm transition-all duration-200 cursor-pointer" href="#">Files</a>
<a class="text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors flex items-center h-16 px-sm transition-all duration-200 cursor-pointer" href="#">Insights</a>
<a class="text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors flex items-center h-16 px-sm transition-all duration-200 cursor-pointer" href="#">Chat</a>
</nav>
</div>
<div class="flex items-center gap-md">
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
<input class="bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-all w-64 text-body-sm" placeholder="Search repositories..." type="text"/>
</div>
<button class="p-2 rounded-full hover:bg-surface-container-high transition-colors">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="notifications">notifications</span>
</button>
<button class="p-2 rounded-full hover:bg-surface-container-high transition-colors">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="settings">settings</span>
</button>
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant ml-2">
<img class="w-full h-full object-cover" data-alt="A professional headshot of a software architect in a bright, modern studio. The lighting is crisp and high-key, matching a clean developer-centric UI aesthetic. The background is a soft, out-of-focus tech office with cool blue and slate grey tones. The subject is wearing a minimalist dark sweater, looking confidently at the camera." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH_jfbJNCckRCD28sqPTDheFYga_nDJN6_lfBblnsQl9lvz8gWNi-nkMa0Fwb8XgnoIi7tHRUqjmulZ9TMu0CbHxF_BBNXtlatYnakiQF4LcwV3bT_McaIbsMz0uvzWvySIRkQJiMYNk7jS6tsRTs2ovp0e3FIpxnHqqBjdm0csgv9i-K0bBGwUw_s72qkm6rNvgR-FZH-NEK7ZIkTLGYDOlXfxs7_ykZ-G1GQMbjsf6NVrs3bSB6Qd2gkhXudJ5wpIBJ9Bmkhfaw"/>
</div>
</div>
</header>
<main class="max-w-[1440px] mx-auto px-margin-desktop py-xl">
<!-- Breadcrumbs -->
<nav class="flex items-center gap-xs text-on-surface-variant font-body-sm mb-lg">
<a class="hover:text-primary transition-colors" href="#">Organization</a>
<span class="material-symbols-outlined text-[16px]">chevron_right</span>
<span class="text-on-surface font-medium">Repositories</span>
</nav>
<!-- Header Section -->
<div class="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xl">
<div>
<h1 class="font-headline-lg text-headline-lg text-on-surface mb-xs">Repositories</h1>
<p class="text-on-surface-variant font-body-md">Manage and monitor your indexed codebases for semantic search.</p>
</div>
<button class="bg-primary text-on-primary px-lg py-sm rounded-lg font-body-md font-semibold flex items-center gap-sm hover:opacity-90 transition-all shadow-sm active:scale-[0.98]">
<span class="material-symbols-outlined" data-icon="add">add</span>
                Import Repository
            </button>
</div>
<!-- Repository Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
<!-- Repo Card 1: Completed -->
<div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-md hover:border-primary transition-all duration-200 group flex flex-col justify-between" style="box-shadow: 0 1px 3px rgba(0,0,0,0.1)">
<div>
<div class="flex items-start justify-between mb-md">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-[24px]" data-icon="code">code</span>
</div>
<div>
<h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">facebook/react</h3>
<p class="text-body-sm font-label-caps text-outline uppercase">https://github.com/facebook/react</p>
</div>
</div>
<span class="bg-secondary-container/20 text-on-secondary-container px-sm py-1 rounded-full text-xs font-medium flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            Completed
                        </span>
</div>
<div class="flex items-center gap-md text-on-surface-variant text-body-sm mb-lg">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">history</span>
<span>Last scan: 2 hours ago</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">database</span>
<span>14.2 MB indexed</span>
</div>
</div>
</div>
<div class="flex items-center justify-between pt-md border-t border-outline-variant">
<div class="flex gap-sm">
<button class="text-primary font-body-sm font-semibold hover:underline px-2 py-1 rounded transition-colors">View</button>
<button class="text-on-surface-variant font-body-sm font-semibold hover:text-on-surface px-2 py-1 transition-colors">Analyze</button>
</div>
<button class="text-error/70 hover:text-error transition-colors p-1">
<span class="material-symbols-outlined" data-icon="delete">delete</span>
</button>
</div>
</div>
<!-- Repo Card 2: Scanning -->
<div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-md hover:border-primary transition-all duration-200 group flex flex-col justify-between" style="box-shadow: 0 1px 3px rgba(0,0,0,0.1)">
<div>
<div class="flex items-start justify-between mb-md">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-tertiary text-[24px]" data-icon="terminal">terminal</span>
</div>
<div>
<h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">vercel/next.js</h3>
<p class="text-body-sm font-label-caps text-outline uppercase">https://github.com/vercel/next.js</p>
</div>
</div>
<span class="bg-tertiary-container/10 text-tertiary px-sm py-1 rounded-full text-xs font-medium flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                            Scanning
                        </span>
</div>
<div class="mb-lg">
<div class="flex justify-between items-center text-body-sm text-on-surface-variant mb-1">
<span>Processing vectors...</span>
<span>68%</span>
</div>
<div class="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
<div class="bg-tertiary h-full rounded-full transition-all duration-500" style="width: 68%;"></div>
</div>
</div>
</div>
<div class="flex items-center justify-between pt-md border-t border-outline-variant">
<div class="flex gap-sm">
<button class="text-primary font-body-sm font-semibold hover:underline px-2 py-1 rounded transition-colors">View</button>
<button class="text-on-surface-variant font-body-sm font-semibold hover:text-on-surface px-2 py-1 transition-colors">Analyze</button>
</div>
<button class="text-error/70 hover:text-error transition-colors p-1">
<span class="material-symbols-outlined" data-icon="delete">delete</span>
</button>
</div>
</div>
<!-- Repo Card 3: Loading / Skeleton -->
<div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col justify-between" style="box-shadow: 0 1px 3px rgba(0,0,0,0.1)">
<div>
<div class="flex items-start justify-between mb-md">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 skeleton rounded-lg"></div>
<div class="space-y-2">
<div class="h-5 w-32 skeleton rounded"></div>
<div class="h-3 w-48 skeleton rounded"></div>
</div>
</div>
<div class="h-6 w-20 skeleton rounded-full"></div>
</div>
<div class="flex items-center gap-md mb-lg">
<div class="h-4 w-24 skeleton rounded"></div>
<div class="h-4 w-24 skeleton rounded"></div>
</div>
</div>
<div class="flex items-center justify-between pt-md border-t border-outline-variant">
<div class="flex gap-sm">
<div class="h-4 w-12 skeleton rounded"></div>
<div class="h-4 w-16 skeleton rounded"></div>
</div>
<div class="h-6 w-6 skeleton rounded-full"></div>
</div>
</div>
<!-- Repo Card 4: Another Completed -->
<div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-md hover:border-primary transition-all duration-200 group flex flex-col justify-between" style="box-shadow: 0 1px 3px rgba(0,0,0,0.1)">
<div>
<div class="flex items-start justify-between mb-md">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-secondary text-[24px]" data-icon="folder_zip">folder_zip</span>
</div>
<div>
<h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">tailwindlabs/tailwindcss</h3>
<p class="text-body-sm font-label-caps text-outline uppercase">https://github.com/tailwindlabs/tailwindcss</p>
</div>
</div>
<span class="bg-secondary-container/20 text-on-secondary-container px-sm py-1 rounded-full text-xs font-medium flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            Completed
                        </span>
</div>
<div class="flex items-center gap-md text-on-surface-variant text-body-sm mb-lg">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">history</span>
<span>Last scan: Oct 24, 2023</span>
</div>
</div>
</div>
<div class="flex items-center justify-between pt-md border-t border-outline-variant">
<div class="flex gap-sm">
<button class="text-primary font-body-sm font-semibold hover:underline px-2 py-1 rounded transition-colors">View</button>
<button class="text-on-surface-variant font-body-sm font-semibold hover:text-on-surface px-2 py-1 transition-colors">Analyze</button>
</div>
<button class="text-error/70 hover:text-error transition-colors p-1">
<span class="material-symbols-outlined" data-icon="delete">delete</span>
</button>
</div>
</div>
<!-- Repo Card 5: Error State (Extra context) -->
<div class="bg-surface-container-lowest border border-error/30 rounded-lg p-md hover:border-error transition-all duration-200 group flex flex-col justify-between" style="box-shadow: 0 1px 3px rgba(0,0,0,0.1)">
<div>
<div class="flex items-start justify-between mb-md">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 bg-error-container rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-error text-[24px]" data-icon="error">error</span>
</div>
<div>
<h3 class="font-headline-md text-headline-md text-on-surface group-hover:text-error transition-colors">corp/legacy-app</h3>
<p class="text-body-sm font-label-caps text-outline uppercase">internal-gitlab.company.com/legacy-app</p>
</div>
</div>
<span class="bg-error-container text-on-error-container px-sm py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            Failed
                        </span>
</div>
<p class="text-body-sm text-error mb-lg bg-error-container/20 p-2 rounded border border-error/10">Authentication failed. Check access tokens.</p>
</div>
<div class="flex items-center justify-between pt-md border-t border-outline-variant">
<div class="flex gap-sm">
<button class="text-primary font-body-sm font-semibold hover:underline px-2 py-1 rounded transition-colors">Retry</button>
<button class="text-on-surface-variant font-body-sm font-semibold hover:text-on-surface px-2 py-1 transition-colors">Settings</button>
</div>
<button class="text-error/70 hover:text-error transition-colors p-1">
<span class="material-symbols-outlined" data-icon="delete">delete</span>
</button>
</div>
</div>
<!-- Repo Card 6: Empty Placeholder -->
<div class="border-2 border-dashed border-outline-variant rounded-lg p-md flex flex-col items-center justify-center text-center group hover:bg-surface-container transition-all cursor-pointer">
<div class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-sm group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-outline" data-icon="add_circle">add_circle</span>
</div>
<p class="font-headline-md text-on-surface">Add more</p>
<p class="text-body-sm text-on-surface-variant">Click to import via URL</p>
</div>
</div>
<!-- Pagination or Load More (Optional but professional) -->
<div class="mt-xl flex items-center justify-between text-body-sm text-on-surface-variant">
<span>Showing 5 of 12 repositories</span>
<div class="flex gap-sm">
<button class="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-50" disabled="">Previous</button>
<button class="px-3 py-1 bg-surface-container-high border border-primary/20 text-primary rounded font-semibold">1</button>
<button class="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors">2</button>
<button class="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors">Next</button>
</div>
</div>
</main>
<script>
        // Micro-interaction for primary button
        document.querySelector('button.bg-primary').addEventListener('click', function() {
            this.classList.add('scale-95');
            setTimeout(() => this.classList.remove('scale-95'), 100);
            console.log('Open Import Modal');
        });

        // Hover effects for card buttons
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                // Potential ripple or hover logic
            });
        });
    </script>
</body></html>

<!-- Repositories - Semantic Code Search -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CodeSense - Semantic Code Search Chat</title>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&amp;family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          "colors": {
                  "tertiary-container": "#a36700",
                  "on-tertiary-fixed-variant": "#653e00",
                  "on-error": "#ffffff",
                  "on-tertiary": "#ffffff",
                  "on-tertiary-fixed": "#2a1700",
                  "tertiary-fixed-dim": "#ffb95f",
                  "tertiary": "#825100",
                  "surface": "#f9f9ff",
                  "on-secondary": "#ffffff",
                  "on-error-container": "#93000a",
                  "surface-container-low": "#f2f3fd",
                  "primary-fixed": "#d8e2ff",
                  "surface-tint": "#005ac2",
                  "primary": "#0058be",
                  "on-primary-fixed-variant": "#004395",
                  "inverse-primary": "#adc6ff",
                  "error": "#ba1a1a",
                  "on-secondary-container": "#00714d",
                  "surface-container-highest": "#e1e2ec",
                  "secondary-container": "#6cf8bb",
                  "surface-bright": "#f9f9ff",
                  "on-primary-fixed": "#001a42",
                  "inverse-surface": "#2e3038",
                  "on-secondary-fixed": "#002113",
                  "primary-fixed-dim": "#adc6ff",
                  "surface-container": "#ecedf7",
                  "on-background": "#191b23",
                  "on-surface": "#191b23",
                  "outline-variant": "#c2c6d6",
                  "on-primary": "#ffffff",
                  "on-tertiary-container": "#fffbff",
                  "secondary-fixed-dim": "#4edea3",
                  "on-surface-variant": "#424754",
                  "secondary-fixed": "#6ffbbe",
                  "tertiary-fixed": "#ffddb8",
                  "secondary": "#006c49",
                  "on-primary-container": "#fefcff",
                  "secondary-fixed-dim": "#4edea3",
                  "surface-container-lowest": "#ffffff",
                  "background": "#f9f9ff",
                  "error-container": "#ffdad6",
                  "inverse-on-surface": "#eff0fa",
                  "on-secondary-fixed-variant": "#005236",
                  "surface-container-high": "#e6e7f2",
                  "surface-dim": "#d8d9e3",
                  "surface-variant": "#e1e2ec",
                  "primary-container": "#2170e4",
                  "outline": "#727785"
          },
          "borderRadius": {
                  "DEFAULT": "0.25rem",
                  "lg": "0.5rem",
                  "xl": "0.75rem",
                  "full": "9999px"
          },
          "spacing": {
                  "xl": "32px",
                  "margin-desktop": "40px",
                  "xs": "4px",
                  "lg": "24px",
                  "md": "16px",
                  "margin-mobile": "16px",
                  "gutter": "16px",
                  "sm": "8px"
          },
          "fontFamily": {
                  "body-sm": ["Geist"],
                  "headline-md": ["Geist"],
                  "code-block": ["JetBrains Mono"],
                  "label-caps": ["JetBrains Mono"],
                  "headline-lg": ["Geist"],
                  "body-md": ["Geist"],
                  "headline-lg-mobile": ["Geist"]
          },
          "fontSize": {
                  "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                  "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                  "code-block": ["14px", {"lineHeight": "22px", "fontWeight": "400"}],
                  "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                  "headline-lg": ["30px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                  "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                  "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
          }
        },
      },
    }
  </script>
<style>
    body {
      background-color: #f9f9ff;
      color: #191b23;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #c2c6d6;
      border-radius: 10px;
    }
    .chat-bubble-ai {
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
  </style>
</head>
<body class="font-body-md text-body-md overflow-hidden">
<!-- TopNavBar Implementation -->
<header class="bg-surface dark:bg-surface-dim border-b border-outline-variant dark:border-outline sticky top-0 z-50 flex justify-between items-center w-full px-margin-desktop h-16">
<div class="flex items-center gap-lg">
<div class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim cursor-pointer">CodeSense</div>
<div class="hidden md:flex items-center gap-md">
<nav class="flex items-center gap-sm">
<div class="px-md py-xs text-primary dark:text-primary-fixed-dim border-b-2 border-primary cursor-pointer transition-all duration-200">Repositories</div>
<div class="px-md py-xs text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors cursor-pointer transition-all duration-200">Explore</div>
</nav>
</div>
</div>
<div class="flex items-center gap-md">
<div class="flex items-center bg-surface-container-low px-md py-xs rounded-full border border-outline-variant">
<span class="material-symbols-outlined text-outline mr-sm">search</span>
<input class="bg-transparent border-none focus:ring-0 text-body-sm w-48 lg:w-64" placeholder="Global Search..." type="text"/>
</div>
<span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
<span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">settings</span>
<div class="w-8 h-8 rounded-full bg-primary-fixed overflow-hidden border border-outline-variant">
<img class="w-full h-full object-cover" data-alt="A professional headshot of a software engineer with short hair, wearing glasses and a minimalist gray hoodie. The background is a clean, blurred office space with soft lighting and a cool blue and white color palette, reflecting a technical minimalist aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgnW9eOOxVJi6Dn1sKAWledQ4P1PelXI5TGlPX-nIMaAREGRDigqjWZs_oJe8BTfMbmoK1WxTQliqo7NqfBef36_p5xAnNoGY8IwzNQDLYYV9bJ-IxTtM8ahzBabgtg_EECANRpwnjlZX7GoX7bFT7heTC5rJQo6Fk_SIeFAYxRXbV8BD6t10Mtvut5yEJQPLE8s6de0pnhyZCjRkBevRqphQIpiEp28Xa7YDDiCWWFwdcai2d9T1e1P2Blur7Yi8kXDruRdgG1Jc"/>
</div>
</div>
</header>
<div class="flex h-[calc(100vh-64px)] overflow-hidden">
<!-- SideNavBar Implementation -->
<aside class="hidden md:flex flex-col py-md px-md gap-sm bg-surface-container-lowest dark:bg-inverse-surface border-r border-outline-variant dark:border-outline w-[280px] shrink-0">
<div class="flex items-center gap-md p-sm mb-md">
<div class="w-10 h-10 rounded bg-primary text-on-primary flex items-center justify-center">
<span class="material-symbols-outlined">folder</span>
</div>
<div>
<div class="font-body-md font-bold text-on-surface truncate">facebook/react</div>
<div class="font-body-sm text-on-surface-variant">main branch</div>
</div>
</div>
<div class="space-y-xs">
<div class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors cursor-pointer rounded-lg scale-95 active:scale-100">
<span class="material-symbols-outlined">folder</span>
<span class="font-body-sm">Files</span>
</div>
<div class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors cursor-pointer rounded-lg scale-95 active:scale-100">
<span class="material-symbols-outlined">code</span>
<span class="font-body-sm">Symbols</span>
</div>
<div class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors cursor-pointer rounded-lg scale-95 active:scale-100">
<span class="material-symbols-outlined">search</span>
<span class="font-body-sm">Search</span>
</div>
<div class="flex items-center gap-md px-md py-sm bg-secondary-container text-on-secondary-container rounded-lg font-medium cursor-pointer scale-95 active:scale-100">
<span class="material-symbols-outlined">chat</span>
<span class="font-body-sm">Chat</span>
</div>
<div class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors cursor-pointer rounded-lg scale-95 active:scale-100">
<span class="material-symbols-outlined">analytics</span>
<span class="font-body-sm">Insights</span>
</div>
</div>
<div class="mt-auto border-t border-outline-variant pt-md">
<div class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors cursor-pointer rounded-lg">
<span class="material-symbols-outlined">description</span>
<span class="font-body-sm">Docs</span>
</div>
<div class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors cursor-pointer rounded-lg">
<span class="material-symbols-outlined">help</span>
<span class="font-body-sm">Support</span>
</div>
</div>
</aside>
<!-- Main Chat Content -->
<main class="flex-1 flex flex-col relative bg-background">
<!-- Breadcrumb / Header -->
<nav class="h-14 border-b border-outline-variant bg-surface-container-lowest flex items-center px-lg gap-sm shrink-0">
<span class="text-on-surface-variant font-body-sm cursor-pointer hover:text-primary">Repositories</span>
<span class="material-symbols-outlined text-outline-variant text-[16px]">chevron_right</span>
<span class="text-on-surface-variant font-body-sm cursor-pointer hover:text-primary">facebook/react</span>
<span class="material-symbols-outlined text-outline-variant text-[16px]">chevron_right</span>
<span class="text-on-surface font-bold font-body-sm">Chat</span>
</nav>
<!-- Messages Area -->
<div class="flex-1 overflow-y-auto p-lg lg:p-xl custom-scrollbar space-y-xl">
<!-- User Message -->
<div class="flex justify-end">
<div class="max-w-[80%] lg:max-w-[70%] bg-primary-container text-on-primary-container px-lg py-md rounded-xl rounded-tr-none">
<p class="font-body-md">Explain how the reconciliation algorithm works in this repo.</p>
</div>
</div>
<!-- AI Message -->
<div class="flex justify-start gap-md">
<div class="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-on-primary text-[18px]">bolt</span>
</div>
<div class="max-w-[90%] lg:max-w-[80%] bg-surface-container-lowest border border-outline-variant px-lg py-md rounded-xl rounded-tl-none chat-bubble-ai">
<div class="space-y-md">
<p class="font-body-md text-on-surface">React uses a heuristic reconciliation algorithm called **React Fiber**. Instead of a recursive traversal of the tree, Fiber is a work-loop based architecture that allows for pausing, resuming, and prioritizing updates.</p>
<div class="p-sm bg-surface-container rounded border border-outline-variant">
<div class="flex items-center justify-between px-md py-xs border-b border-outline-variant mb-sm">
<span class="font-label-caps text-on-surface-variant">packages/react-reconciler/src/ReactFiberBeginWork.js</span>
<span class="material-symbols-outlined text-on-surface-variant text-[16px] cursor-pointer hover:text-primary">content_copy</span>
</div>
<pre class="font-code-block text-code-block p-md overflow-x-auto bg-[#111827] text-gray-300 rounded"><code>function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  if (current === null) {
    // If this is a fresh mount, we don't need to track deletions.
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    // If this is an update, we reconcile the children.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}</code></pre>
</div>
<p class="font-body-md text-on-surface">The core logic lies in `reconcileChildFibers`, which compares the `current` fiber with the new `nextChildren`. It uses keys to identify matches and minimizes DOM operations by only performing updates where strictly necessary.</p>
</div>
</div>
</div>
<!-- User Message -->
<div class="flex justify-end">
<div class="max-w-[80%] lg:max-w-[70%] bg-primary-container text-on-primary-container px-lg py-md rounded-xl rounded-tr-none">
<p class="font-body-md">Where can I find the implementation of the work loop?</p>
</div>
</div>
</div>
<!-- Input Area -->
<div class="p-lg bg-surface-container-lowest border-t border-outline-variant">
<div class="max-w-4xl mx-auto space-y-md">
<!-- Chips -->
<div class="flex flex-wrap gap-sm">
<button class="bg-secondary-container text-on-secondary-fixed-variant px-md py-xs rounded-full font-body-sm hover:brightness-95 transition-all flex items-center gap-xs">
<span class="material-symbols-outlined text-[16px]">summarize</span>
              Summarize this project
            </button>
<button class="bg-secondary-container text-on-secondary-fixed-variant px-md py-xs rounded-full font-body-sm hover:brightness-95 transition-all flex items-center gap-xs">
<span class="material-symbols-outlined text-[16px]">account_tree</span>
              Find main classes
            </button>
<button class="bg-secondary-container text-on-secondary-fixed-variant px-md py-xs rounded-full font-body-sm hover:brightness-95 transition-all flex items-center gap-xs">
<span class="material-symbols-outlined text-[16px]">history</span>
              Latest changes
            </button>
</div>
<!-- Input Field -->
<div class="relative group">
<textarea class="w-full bg-surface border border-outline-variant rounded-xl p-lg pr-16 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-body-md transition-all custom-scrollbar resize-none" oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"' placeholder="Ask anything about this codebase..." rows="1"></textarea>
<button class="absolute right-md bottom-md w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center hover:bg-primary-container transition-colors shadow-sm">
<span class="material-symbols-outlined">send</span>
</button>
</div>
<div class="text-center">
<span class="text-on-surface-variant font-body-sm text-[12px]">CodeSense AI can make mistakes. Verify important information against the source code.</span>
</div>
</div>
</div>
</main>
</div>
<script>
    // Simple micro-interaction for input auto-height
    const textarea = document.querySelector('textarea');
    textarea.addEventListener('input', function() {
      if (this.value.length > 500) {
        this.style.overflowY = 'auto';
      } else {
        this.style.overflowY = 'hidden';
      }
    });

    // Toggle Sidebar on mobile (Visual Mockup only)
    window.addEventListener('resize', () => {
      const sidebar = document.querySelector('aside');
      if (window.innerWidth < 768) {
        sidebar.classList.add('hidden');
      } else {
        sidebar.classList.remove('hidden');
      }
    });
  </script>
</body></html>