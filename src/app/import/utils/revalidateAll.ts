import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../shared/constants';

export const revalidateAll = () => {
  revalidatePath(appRoutes.assets);
  revalidatePath(appRoutes.brokers);
  revalidatePath(appRoutes.deposits);
  revalidatePath(appRoutes.purchases);
  revalidatePath(appRoutes.dividends);
  revalidatePath(appRoutes.transfers);
  revalidatePath(appRoutes.sells);
  revalidatePath(appRoutes.withdrawals);
};
