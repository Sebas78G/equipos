import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const DocumentConfiguration = ({ 
  checklistItems, 
  onChecklistChange,
  specialInstructions,
  onInstructionsChange,
  documentData,
  onDocumentDataChange 
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  const defaultChecklistItems = [
    { id: 1, name: 'Mouse', quantity: 1, included: true },
    { id: 2, name: 'Teclado', quantity: 1, included: true },
    { id: 3, name: 'Monitor', quantity: 1, included: true },
    { id: 4, name: 'Cable de Poder', quantity: 1, included: true },
    { id: 5, name: 'Cable HDMI/VGA', quantity: 1, included: true },
    { id: 6, name: 'Base/Soporte', quantity: 1, included: false },
    { id: 7, name: 'Audífonos', quantity: 1, included: false },
    { id: 8, name: 'Webcam', quantity: 1, included: false }
  ];

  const handleAddItem = () => {
    if (newItemName?.trim()) {
      const newItem = {
        id: Date.now(),
        name: newItemName?.trim(),
        quantity: newItemQuantity,
        included: true
      };
      onChecklistChange([...checklistItems, newItem]);
      setNewItemName('');
      setNewItemQuantity(1);
    }
  };

  const handleRemoveItem = (itemId) => {
    onChecklistChange(checklistItems?.filter(item => item?.id !== itemId));
  };

  const handleToggleItem = (itemId) => {
    onChecklistChange(
      checklistItems?.map(item =>
        item?.id === itemId ? { ...item, included: !item?.included } : item
      )
    );
  };

  const handleQuantityChange = (itemId, quantity) => {
    onChecklistChange(
      checklistItems?.map(item =>
        item?.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const resetToDefaults = () => {
    onChecklistChange(defaultChecklistItems);
  };

  const templateOptions = [
    {
      name: 'Plantilla PC Escritorio',
      description: 'Incluye mouse, teclado, monitor y cables básicos',
      items: [
        { id: 1, name: 'Mouse', quantity: 1, included: true },
        { id: 2, name: 'Teclado', quantity: 1, included: true },
        { id: 3, name: 'Monitor', quantity: 1, included: true },
        { id: 4, name: 'Cable de Poder', quantity: 1, included: true },
        { id: 5, name: 'Cable HDMI/VGA', quantity: 1, included: true }
      ]
    },
    {
      name: 'Plantilla Portátil',
      description: 'Incluye cargador y mouse básico',
      items: [
        { id: 1, name: 'Cargador Original', quantity: 1, included: true },
        { id: 2, name: 'Mouse', quantity: 1, included: true },
        { id: 3, name: 'Funda/Maletín', quantity: 1, included: false }
      ]
    },
    {
      name: 'Plantilla Tablet',
      description: 'Incluye cargador y accesorios básicos',
      items: [
        { id: 1, name: 'Cargador USB', quantity: 1, included: true },
        { id: 2, name: 'Cable USB', quantity: 1, included: true },
        { id: 3, name: 'Funda Protectora', quantity: 1, included: false }
      ]
    }
  ];

  const applyTemplate = (template) => {
    onChecklistChange(template?.items);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Configuración del Documento</h2>
            <p className="text-sm text-muted-foreground">Personalizar contenido y elementos</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Document Templates */}
        <div className="p-6 border-b border-border">
          <h3 className="text-md font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="FileTemplate" size={16} />
            <span>Plantillas Predefinidas</span>
          </h3>
          <div className="space-y-3">
            {templateOptions?.map((template, index) => (
              <div key={index} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-smooth">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{template?.name}</p>
                    <p className="text-xs text-muted-foreground">{template?.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(template)}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist Configuration */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-semibold text-foreground flex items-center space-x-2">
              <Icon name="CheckSquare" size={16} />
              <span>Lista de Verificación</span>
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
            >
              <Icon name="RotateCcw" size={14} />
              Restablecer
            </Button>
          </div>

          {/* Add New Item */}
          <div className="space-y-3 mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground">Agregar Nuevo Elemento</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Nombre del elemento"
                value={newItemName}
                onChange={(e) => setNewItemName(e?.target?.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Cantidad"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(parseInt(e?.target?.value) || 1)}
                min="1"
                className="w-24"
              />
              <Button
                variant="default"
                size="sm"
                onClick={handleAddItem}
                disabled={!newItemName?.trim()}
              >
                <Icon name="Plus" size={14} />
                Agregar
              </Button>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {checklistItems?.map((item) => (
              <div key={item?.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    checked={item?.included}
                    onChange={() => handleToggleItem(item?.id)}
                  />
                  <span className={`text-sm font-medium ${item?.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item?.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={item?.quantity}
                    onChange={(e) => handleQuantityChange(item?.id, parseInt(e?.target?.value) || 1)}
                    min="1"
                    className="w-16 text-center"
                    disabled={!item?.included}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item?.id)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="p-6 border-b border-border">
          <h3 className="text-md font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="MessageSquare" size={16} />
            <span>Instrucciones Especiales</span>
          </h3>
          <textarea
            value={specialInstructions}
            onChange={(e) => onInstructionsChange(e?.target?.value)}
            placeholder="Agregar notas especiales, condiciones de uso, o instrucciones adicionales..."
            className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Estas instrucciones aparecerán destacadas en el documento final
          </p>
        </div>

        {/* Document Settings */}
        <div className="p-6">
          <h3 className="text-md font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="FileText" size={16} />
            <span>Configuración del Documento</span>
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Responsable de Entrega
                </label>
                <Input
                  type="text"
                  value={documentData?.deliveredBy || 'Departamento de Tecnología'}
                  onChange={(e) => onDocumentDataChange({ ...documentData, deliveredBy: e?.target?.value })}
                  placeholder="Nombre del responsable"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Cargo/Posición
                </label>
                <Input
                  type="text"
                  value={documentData?.position || 'Administrador de TI'}
                  onChange={(e) => onDocumentDataChange({ ...documentData, position: e?.target?.value })}
                  placeholder="Cargo del responsable"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Checkbox
                label="Incluir código QR para verificación"
                checked={documentData?.includeQR || false}
                onChange={(e) => onDocumentDataChange({ ...documentData, includeQR: e?.target?.checked })}
              />
              <Checkbox
                label="Enviar copia al supervisor directo"
                checked={documentData?.sendToSupervisor || false}
                onChange={(e) => onDocumentDataChange({ ...documentData, sendToSupervisor: e?.target?.checked })}
              />
              <Checkbox
                label="Requerir firma digital"
                checked={documentData?.requireDigitalSignature || false}
                onChange={(e) => onDocumentDataChange({ ...documentData, requireDigitalSignature: e?.target?.checked })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentConfiguration;