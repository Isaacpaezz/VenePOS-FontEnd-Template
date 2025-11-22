
import React, { useState } from 'react';
import RootLayout from './app/layout';
import AppLayout from './app/components/AppLayout';
import DashboardPage from './app/page';
import ClientsPage from './app/dashboard/clients/page';
import CampaignsPage from './app/dashboard/campaigns/page';
import ImportPage from './app/dashboard/import/page';
import SettingsPage from './app/dashboard/settings/page';
import ProfilePage from './app/dashboard/profile/page';
import ChatwootEmbedPage from './app/integrations/chatwoot-sidebar/page';
import LoginPage from './app/auth/login/page';
import RegisterPage from './app/auth/register/page';
import OnboardingPage from './app/auth/onboarding/page';
import { Route } from './types';

const App: React.FC = () => {
  // Simple client-side router state
  // Para probar el flujo de Auth, cambiar el estado inicial a 'login'
  const [currentRoute, setCurrentRoute] = useState<Route>('login');

  const renderPage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentRoute} />;
      case 'clients':
        return <ClientsPage onNavigate={setCurrentRoute} />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'campaigns-new':
        return <CampaignsPage initialWizardOpen={true} />;
      case 'import':
        return <ImportPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'chatwoot-embed':
        return <ChatwootEmbedPage />;
      case 'login':
        return <LoginPage onNavigate={setCurrentRoute} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentRoute} />;
      case 'onboarding':
        return <OnboardingPage onNavigate={setCurrentRoute} />;
      default:
        return <DashboardPage onNavigate={setCurrentRoute} />;
    }
  };

  // Rutas que no usan el Layout principal (Sidebar/Header)
  const isStandalone = ['chatwoot-embed', 'login', 'register', 'onboarding'].includes(currentRoute);

  return (
    <RootLayout>
      {isStandalone ? (
        renderPage()
      ) : (
        <AppLayout currentRoute={currentRoute} onNavigate={setCurrentRoute}>
          {renderPage()}
        </AppLayout>
      )}
    </RootLayout>
  );
};

export default App;
