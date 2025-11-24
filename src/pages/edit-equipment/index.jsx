import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getDisponibleById } from '../../services/disponiblesService';
import { getAsignacionByEquipoId } from '../../services/asignacionesService';
import MainNavigation from '../../components/ui/MainNavigation';
import WorkflowBreadcrumbs from '../../components/ui/WorkflowBreadcrumbs';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

import { Checkbox } from '../../components/ui/Checkbox';
import Spinner from '../../components/ui/Spinner';

const EditEquipment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const equipmentId = searchParams.get('id');

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!equipmentId) {
      navigate('/main-dashboard');
      return;
    }

    setLoading(true);
    try {
      const equipmentData = await getDisponibleById(equipmentId);
      const assignmentData = await getAsignacionByEquipoId(equipmentId);

      const combinedData = { ...equipmentData };
      if (assignmentData) {
        combinedData.estado = 'Asignado';
        combinedData.nombre_funcionario = assignmentData.nombre_funcionario;
        combinedData.area = assignmentData.area;
        combinedData.correo = assignmentData.correo;
        combinedData.jefe_inmediato = assignmentData.jefe_inmediato;
      }

      setFormData(combinedData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch equipment details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [equipmentId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // The update logic will be more complex and needs to be implemented
    // For now, it just prevents the form from submitting
    alert('Update functionality is not yet fully implemented.');
  };
  
  const accessoryMapping = {
    'base': 'Base',
    'guaya': 'Guaya',
    'mouse': 'Mouse',
    'teclado': 'Teclado',
    'cargador': 'Cargador',
    'cable_red': 'Cable de red',
    'cable_poder': 'Cable de poder',
  };
  
  const accesoriosDisponibles = Object.keys(accessoryMapping);

  const FormSection = ({ title, children, gridCols = 'md:grid-cols-2' }) => (
    <div className="border-t border-border pt-6 mt-6 first:mt-0 first:border-t-0 first:pt-0">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
        {children}
      </div>
    </div>
  );

  if (loading || !formData) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      <div className="pt-16">
        <WorkflowBreadcrumbs />
        <div className="container mx-auto px-4 py-6 space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Editar Equipo</h1>
          
          {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

          <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-lg">

            <FormSection title="Información del Equipo">
              <Input label="Tipo" name="tipo" value={formData.tipo || ''} onChange={handleInputChange} />
              <Input label="Marca CPU" name="marca_cpu" value={formData.marca_cpu || ''} onChange={handleInputChange} />
              <Input label="Referencia CPU" name="referencia_cpu" value={formData.referencia_cpu || ''} onChange={handleInputChange} />
              <Input label="Service Tag CPU" name="service_tag_cpu" value={formData.service_tag_cpu || ''} onChange={handleInputChange} />
              <Input label="Marca Pantalla" name="marca_pantalla" value={formData.marca_pantalla || ''} onChange={handleInputChange} />
              <Input label="Referencia Pantalla" name="referencia_pantalla" value={formData.referencia_pantalla || ''} onChange={handleInputChange} />
              <Input label="Service Tag Pantalla" name="service_tag_pantalla" value={formData.service_tag_pantalla || ''} onChange={handleInputChange} />
            </FormSection>

            <FormSection title="Accesorios">
              {accesoriosDisponibles.map(key => (
                <Checkbox
                  key={key}
                  label={accessoryMapping[key]}
                  name={key}
                  checked={!!formData[key]}
                  onCheckedChange={(c) => handleCheckboxChange(key, c)}
                />
              ))}
            </FormSection>

            {formData.estado === 'Asignado' && (
                <FormSection title="Información de la Asignación">
                    <Input label="Nombre Funcionario" name="nombre_funcionario" value={formData.nombre_funcionario || ''} onChange={handleInputChange} />
                    <Input label="Área" name="area" value={formData.area || ''} onChange={handleInputChange} />
                    <Input label="Correo" name="correo" value={formData.correo || ''} onChange={handleInputChange} type="email" />
                    <Input label="Jefe Inmediato" name="jefe_inmediato" value={formData.jefe_inmediato || ''} onChange={handleInputChange} />
                </FormSection>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => navigate('/main-dashboard')}>Cancelar</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar Cambios'}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEquipment;
