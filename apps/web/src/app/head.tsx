export default function Head() {
  return (
    <>
      {/* PWA Meta Tags */}
      <meta name="application-name" content="Rastreador Veicular" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Rastreador" />
      <meta name="description" content="Sistema completo de rastreamento e monitoramento de veículos em tempo real" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#2563eb" />

      {/* Apple Touch Icons */}
      <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />

      {/* Standard Icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#2563eb" />
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* Microsoft */}
      <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
      <meta name="msapplication-TileColor" content="#2563eb" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content="https://yourdomain.com" />
      <meta name="twitter:title" content="Sistema de Rastreamento Veicular" />
      <meta name="twitter:description" content="Sistema completo de rastreamento e monitoramento de veículos em tempo real" />
      <meta name="twitter:image" content="/icons/icon-192x192.png" />
      <meta name="twitter:creator" content="@superclaude" />

      {/* Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Sistema de Rastreamento Veicular" />
      <meta property="og:description" content="Sistema completo de rastreamento e monitoramento de veículos em tempo real" />
      <meta property="og:site_name" content="Rastreador Veicular SuperClaude" />
      <meta property="og:url" content="https://yourdomain.com" />
      <meta property="og:image" content="/icons/icon-512x512.png" />
    </>
  )
}