import React, { useState, useEffect, useCallback } from 'react';
import { DashboardCardsDefinition } from '../components/DashboardCardsDefinition';
import { useNotification } from '../hooks/useNotification';
import { DashboardCardService } from '../services/dashboardCard.service';
import { DashboardCardDefinition } from '../types/dashboard';
import { Loader } from '../components/ui/Loader';
import { ErrorBoundary } from '../components/ErrorBoundary';

const DashboardCardsDefinitionPage: React.FC = () => {
  const [cards, setCards] = useState<DashboardCardDefinition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();

  const fetchDefinitions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await DashboardCardService.getAllDefinitions();
      setCards(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard card definitions';
      setError(message);
      notify({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchDefinitions();
  }, [fetchDefinitions]);

  const handleCreateCard = async (newCard: Partial<DashboardCardDefinition>) => {
    try {
      const created = await DashboardCardService.createDefinition(newCard);
      setCards((prev) => [...prev, created]);
      notify({ type: 'success', message: 'Card definition created successfully' });
    } catch (err) {
      notify({ type: 'error', message: 'Failed to create card definition' });
    }
  };

  const handleUpdateCard = async (id: string, updates: Partial<DashboardCardDefinition>) => {
    try {
      const updated = await DashboardCardService.updateDefinition(id, updates);
      setCards((prev) => prev.map((card) => (card.id === id ? updated : card)));
      notify({ type: 'success', message: 'Card definition updated successfully' });
    } catch (err) {
      notify({ type: 'error', message: 'Failed to update card definition' });
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await DashboardCardService.deleteDefinition(id);
      setCards((prev) => prev.filter((card) => card.id !== id));
      notify({ type: 'success', message: 'Card definition deleted successfully' });
    } catch (err) {
      notify({ type: 'error', message: 'Failed to delete card definition' });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold text-red-600">Error Loading Data</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={fetchDefinitions}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">D.2.2 Dashboard Cards Definition</h1>
          <p className="mt-2 text-gray-600">
            Configure and manage the visual representations of data metrics for the main dashboard.
          </p>
        </header>

        <DashboardCardsDefinition 
          cards={cards} 
          onCreate={handleCreateCard}
          onUpdate={handleUpdateCard}
          onDelete={handleDeleteCard}
        />
      </div>
    </ErrorBoundary>
  );
};

export default DashboardCardsDefinitionPage;