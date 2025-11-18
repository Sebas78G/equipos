      import React, { useState, useEffect } from 'react';
      import { useNavigate } from 'react-router-dom';
      import { getDashboardData } from 'services/dashboardService';
      import MainNavigation from '../../components/ui/MainNavigation';
      import StatCard from './components/StatCard';
      import FilterButton from './components/FilterButton';
      import EquipmentList from './components/EquipmentList';
      import BarChart from './components/BarChart';
      import PieChart from './components/PieChart';
      import { Total, PC, Portatil, Tablet, Asignados, Disponible, Dañados } from './components/Icons';
      
      const Dashboard = () => {
        const navigate = useNavigate();
        const [isNavCollapsed, setIsNavCollapsed] = useState(false);
        const [dashboardData, setDashboardData] = useState(null);
        const [error, setError] = useState(null);
        const [activeFilter, setActiveFilter] = useState('Todos');
      
        useEffect(() => {
          const fetchData = async () => {
            try {
              const data = await getDashboardData();
              setDashboardData(data);
            } catch (err) {
              setError('No se pudieron cargar los datos del panel. Verifique la conexión con el servidor.');
            }
          };
          fetchData();
        }, []);
      
        const handleFilterClick = (filter) => {
          setActiveFilter(filter);
        };
      
        const getFilteredEquipment = () => {
          if (!dashboardData) return [];
          const { recentActivity } = dashboardData;
        
          switch (activeFilter) {
            case 'Todos':
              return recentActivity;
            case 'PC':
              return recentActivity.filter(e => (e.tipo.toLowerCase() === 'pc' || e.tipo.toLowerCase() === 'escritorio'));
            case 'Portátil':
              return recentActivity.filter(e => e.tipo.toLowerCase() === 'portatil');
            case 'Tablet':
              return recentActivity.filter(e => e.tipo.toLowerCase() === 'tablet');
            case 'Asignados':
              return recentActivity.filter(e => e.status === 'Asignado');
            case 'Disponible':
              return recentActivity.filter(e => e.status === 'Disponible');
            case 'Dañados':
              return recentActivity.filter(e => e.status === 'Dañado');
            default:
              return recentActivity;
          }
        };
      
        const { dashboardCounts, recentActivity } = dashboardData || {};
        const filteredEquipment = getFilteredEquipment();
      
        const chartData = {
          labels: ['Asignados', 'Disponibles', 'Dañados'],
          datasets: [
            {
              label: 'Equipos',
              data: [dashboardCounts?.asignados, dashboardCounts?.disponible, dashboardCounts?.danados],
              backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
          ],
        };
      
        return (
          <div className="min-h-screen bg-background-light">
            <MainNavigation onToggleCollapse={setIsNavCollapsed} />
            <div className={`pt-16 transition-all duration-300 ${isNavCollapsed ? 'pl-20' : 'pl-64'}`}>
              <main className="p-6">
                <h1 className="text-3xl font-bold text-foreground">Panel Principal</h1>
                <p className="text-muted-foreground mb-6">Gestión integral del inventario de equipos - EXPRESO VIAJES Y TURISMO</p>
      
                {error && 
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                  </div>
                }
      
                {dashboardData && (
                  <>
                    <div className="flex space-x-2 mb-6 bg-background p-2 rounded-lg shadow-sm">
                      <FilterButton label="Todos" count={dashboardCounts.total} icon={<Total />} active={activeFilter === 'Todos'} onClick={() => handleFilterClick('Todos')} />
                      <FilterButton label="PC" count={dashboardCounts.pc} icon={<PC />} active={activeFilter === 'PC'} onClick={() => handleFilterClick('PC')} />
                      <FilterButton label="Portátil" count={dashboardCounts.portatil} icon={<Portatil />} active={activeFilter === 'Portátil'} onClick={() => handleFilterClick('Portátil')} />
                      <FilterButton label="Tablet" count={dashboardCounts.tablet} icon={<Tablet />} active={activeFilter === 'Tablet'} onClick={() => handleFilterClick('Tablet')} />
                      <FilterButton label="Asignados" count={dashboardCounts.asignados} icon={<Asignados />} active={activeFilter === 'Asignados'} onClick={() => handleFilterClick('Asignados')} />
                      <FilterButton label="Disponible" count={dashboardCounts.disponible} icon={<Disponible />} active={activeFilter === 'Disponible'} onClick={() => handleFilterClick('Disponible')} />
                      <FilterButton label="Dañados" count={dashboardCounts.danados} icon={<Dañados />} active={activeFilter === 'Dañados'} onClick={() => handleFilterClick('Dañados')} />
                    </div>
      
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <StatCard title="Total" value={dashboardCounts.total} icon={<Total />} />
                      <StatCard title="PCs" value={dashboardCounts.pc} icon={<PC />} />
                      <StatCard title="Portátiles" value={dashboardCounts.portatil} icon={<Portatil />} />
                      <StatCard title="Tablets" value={dashboardCounts.tablet} icon={<Tablet />} />
                    </div>
      
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <EquipmentList equipment={filteredEquipment} title={activeFilter} />
                      </div>
                      <div className="space-y-6">
                        <div className="bg-background p-6 rounded-lg shadow-sm">
                          <h3 className="text-lg font-semibold mb-4">Resumen de Estados</h3>
                          <PieChart data={chartData} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </main>
            </div>
          </div>
        );
      };
      
      export default Dashboard;
      