import './globals.css'
import { Inter } from 'next/font/google'
import AuthCheck from '../components/authCheck/authcheck'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GDD Sooder - 1.0',
  description: 'gerenciador de doações e beneficiados',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
        <body className={inter.className}>
          { children }
        </body>
    </html>
  )
}

//</AuthCheck>

// interface Service {
//   username?: string | undefined;
//   password?: string | null;
// }