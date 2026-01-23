'use client';

import { Header } from '@/components/layout/header';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const t = useTranslations('common');
  const healthT = useTranslations('health');

  // Example: Health check query using TanStack Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await apiClient.healthCheck();
      return response.data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {t('welcome')}
            </h1>
            <p className="text-lg text-muted-foreground">
              Modern freight management platform for the Middle East
            </p>
          </section>

          {/* Health Check Section */}
          <section className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{healthT('title')}</h2>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                Refresh
              </Button>
            </div>

            {isLoading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{healthT('checking')}</p>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-4">
                <p className="font-medium">{healthT('error')}</p>
                <p className="text-sm mt-1">
                  {error instanceof Error ? error.message : 'Unknown error'}
                </p>
              </div>
            )}

            {data && !error && (
              <div className="bg-green-500/10 text-green-700 dark:text-green-400 rounded-md p-4">
                <p className="font-medium">{healthT('healthy')}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p>Gateway: {data.service || 'N/A'}</p>
                  <p>Version: {data.version || 'N/A'}</p>
                  <p>Status: {data.status || 'N/A'}</p>
                  {data.backend_services && (
                    <div className="mt-2">
                      <p className="font-medium">Backend Services:</p>
                      <ul className="list-disc list-inside ml-4">
                        {Object.entries(data.backend_services).map(([service, status]) => (
                          <li key={service}>
                            {service}: {status as string}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Features Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6 space-y-2">
              <h3 className="text-xl font-semibold">🌍 Multi-Language</h3>
              <p className="text-muted-foreground">
                Full support for English and Arabic with automatic RTL/LTR switching
              </p>
            </div>
            <div className="border rounded-lg p-6 space-y-2">
              <h3 className="text-xl font-semibold">🌙 Dark Mode</h3>
              <p className="text-muted-foreground">
                Beautiful dark mode support with system preference detection
              </p>
            </div>
            <div className="border rounded-lg p-6 space-y-2">
              <h3 className="text-xl font-semibold">📱 PWA Ready</h3>
              <p className="text-muted-foreground">
                Installable as a Progressive Web App on any device
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>HarborX © 2024. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
