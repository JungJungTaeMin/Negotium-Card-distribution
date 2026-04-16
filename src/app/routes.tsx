import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { MobileLayout } from "./components/MobileLayout";
import { MobileHomePage } from "./pages/mobile/MobileHomePage";
import { MobileScanPage } from "./pages/mobile/MobileScanPage";
import { MobileOrganizationPage } from "./pages/mobile/MobileOrganizationPage";
import { MobilePersonDetailPage } from "./pages/mobile/MobilePersonDetailPage";
import { MobileSearchPage } from "./pages/mobile/MobileSearchPage";
import { MobileSettingsPage } from "./pages/mobile/MobileSettingsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/",
    Component: MobileLayout,
    children: [
      { index: true, Component: MobileHomePage },
      { path: "scan", Component: MobileScanPage },
      { path: "organization", Component: MobileOrganizationPage },
      { path: "organization/:companyId", Component: MobileOrganizationPage },
      { path: "persons/:personId", Component: MobilePersonDetailPage },
      { path: "search", Component: MobileSearchPage },
      { path: "settings", Component: MobileSettingsPage },
    ],
  },
]);