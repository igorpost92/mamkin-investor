import React from 'react';
import styles from './Header.module.css';
import { appRoutes } from '../../../../shared/constants';
import { AppNavLink } from '../../../../shared/ui';
import { Group } from '@mantine/core';
import ThemeButton from './ThemeButton';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { isUserAuthenticated } from '../../../../helpers/auth';

export const Header: React.FC = async () => {
  const isAuthenticated = await isUserAuthenticated();

  return (
    <header className={styles.header}>
      <Group justify={'space-between'}>
        {/* TODO: empty styles */}
        <h2>
          <Link href={appRoutes.index}>Mamkin investor</Link>
        </h2>
        <Group>
          <ThemeButton />
          {isAuthenticated && <LogoutButton />}
        </Group>
      </Group>
      {isAuthenticated && (
        <nav className={styles.links}>
          <AppNavLink href={appRoutes.history} label={'History'} />
          <AppNavLink href={appRoutes.assets} label={'Assets'} />
          <AppNavLink href={appRoutes.brokers} label={'Brokers'} />
          <AppNavLink href={appRoutes.deposits} label={'Deposits'} />
          <AppNavLink href={appRoutes.purchases} label={'Purchases'} />
          <AppNavLink href={appRoutes.dividends} label={'Dividends'} />
          <AppNavLink href={appRoutes.sells} label={'Sells'} />
          <AppNavLink href={appRoutes.withdrawals} label={'Withdrawals'} />
          <AppNavLink href={appRoutes.splits} label={'Splits'} />
          <AppNavLink href={appRoutes.transfers} label={'Transfers'} />
          <AppNavLink href={appRoutes.portfolio} label={'Portfolio'} />
          <AppNavLink href={appRoutes.sellsStats} label={'Sells stats'} />
          <AppNavLink href={appRoutes.import} label={'Import'} />
        </nav>
      )}
    </header>
  );
};
