import { redirect } from 'next/navigation';
import { appRoutes } from '../shared/constants';

export default function Home() {
  redirect(appRoutes.history);
}
