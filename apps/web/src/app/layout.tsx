import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { ServiceWorkerProvider } from '@/components/ServiceWorkerProvider'
import { UpdateProvider } from '@/components/UpdateProvider'
import { InstallPWA } from '@/components/InstallPWA'
import { ClientOnlyProvider } from '@/components/ClientOnlyProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sistema de Rastreamento Veicular',
  description: 'Sistema completo de rastreamento e monitoramento de veículos em tempo real',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rastreador Veicular',
    startupImage: [
      {
        url: '/icons/icon-512x512.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/icons/icon-512x512.png',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/icons/icon-512x512.png',
        media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)'
      }
    ]
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Rastreador Veicular SuperClaude',
    title: 'Sistema de Rastreamento Veicular',
    description: 'Sistema completo de rastreamento e monitoramento de veículos em tempo real',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Rastreador Veicular'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: 'Sistema de Rastreamento Veicular',
    description: 'Sistema completo de rastreamento e monitoramento de veículos em tempo real',
    images: '/icons/icon-512x512.png'
  },
  icons: {
    icon: [
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' }
    ],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rastreador" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#2563eb" />
      </head>
      <body className={inter.className}>
        <ClientOnlyProvider>
          <ServiceWorkerProvider>
            <UpdateProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <QueryProvider>
                  {children}
                  <InstallPWA />
                  <Toaster position="top-right" />
                </QueryProvider>
              </ThemeProvider>
            </UpdateProvider>
          </ServiceWorkerProvider>
        </ClientOnlyProvider>
      </body>
    </html>
  )
}