import { BasicLayout } from "@/layout";
import { GuardRoute } from "./guardRoute";

export const LayoutGuard = () => {
  return (
    <BasicLayout />
    // <GuardRoute>
    //   <BasicLayout />
    // </GuardRoute>
  );
};
