'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import styles from './AppNavLink.module.css';
import { NavLink as NavLinkLib } from '@mantine/core';
import Link from 'next/link';

interface Props {
  href: string;
  label: string;
  isExact?: boolean;
}

export const AppNavLink: React.FC<Props> = props => {
  const path = usePathname();

  const isActive = props.isExact ? path === props.href : path.startsWith(props.href);

  return (
    <NavLinkLib
      className={styles.wrap}
      href={props.href}
      label={props.label}
      active={isActive}
      component={Link}
    />
  );
};
