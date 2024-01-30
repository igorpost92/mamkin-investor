import { capitalize, kebabCase } from 'lodash';

export const regularCase = (name?: string) => {
  if (!name) {
    return '';
  }

  const res = capitalize(kebabCase(name).split('-').join(' '));
  return res;
};
