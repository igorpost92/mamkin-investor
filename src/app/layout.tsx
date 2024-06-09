import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mobile-kit/theme/theme.css';
import './globals.css';
import styles from './layout.module.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Header } from '../widgets/app';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mamkin investor',
  description: 'Investment Management App',
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout(props: Props) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className={inter.className}>
        <MantineProvider defaultColorScheme="auto">
          <Header />
          <main className={styles.content}>{props.children}</main>
        </MantineProvider>
      </body>
    </html>
  );
}
