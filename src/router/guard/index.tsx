import BasicLayout from '@/layout';
import { GuardRoute } from '@/router/guard/guardRoute';

export const LayoutGuard = () => {
  return (
    <GuardRoute>
      <BasicLayout />
    </GuardRoute>
  );
};
