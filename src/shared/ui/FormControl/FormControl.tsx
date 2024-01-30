import React from 'react';
import styles from './FormControl.module.css';

interface Props {
  id?: string;
  label?: React.ReactNode;
  children: React.ReactNode;
  error?: React.ReactNode;
}

export const FormControl: React.FC<Props> = props => {
  return (
    <div>
      {props.label && (
        <label className={styles.label} htmlFor={props.id}>
          {props.label}
        </label>
      )}

      {props.children}

      {props.error && <div className={styles.errorMessage}>{props.error}</div>}
    </div>
  );
};
