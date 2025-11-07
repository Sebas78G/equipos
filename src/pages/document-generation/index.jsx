import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainNavigation from 'components/ui/MainNavigation';
import WorkflowBreadcrumbs from 'components/ui/WorkflowBreadcrumbs';
import DocumentPreview from './components/DocumentPreview';
import DocumentConfiguration from './components/DocumentConfiguration';
import DocumentStatusTracker from './components/DocumentStatusTracker';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const DocumentGeneration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showStatusTracker, setShowStatusTracker] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  // Add this state for navigation collapse control
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  // Document data from assignment or default
  const [documentData, setDocumentData] = useState(() => {
    const assignmentData = location?.state?.assignmentData;
    return {
      employee: assignmentData?.employee || {
        name: '',
        cedula: '',
        area: '',
        email: ''
      },
      equipment: assignmentData?.equipment || {
        type: '',
        serviceTag: '',
        brand: '',
        status: ''
      },
      deliveredBy: '',
      position: '',
      includeQR: false,
      sendToSupervisor: false,
      requireDigitalSignature: false
    };
  });

  // Checklist items state
  const [checklistItems, setChecklistItems] = useState([]);

  // Special instructions state
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Filter included checklist items for preview
  const includedItems = checklistItems?.filter(item => item?.included);

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    
    // Simulate document generation process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate PDF generation and email sending
      console.log('Generating document with data:', {
        documentData,
        checklistItems: includedItems,
        specialInstructions
      });
      
      setGenerationSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setGenerationSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/main-dashboard');
  };

  const handleNewAssignment = () => {
    navigate('/equipment-assignment');
  };

  useEffect(() => {
    // Set page title
    document.title = 'Generar Documentos - Equipos EVT';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)} />
      <div className="pt-16">
        <WorkflowBreadcrumbs />
        
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Generar Documentos</h1>
                <p className="text-muted-foreground">
                  Crear y personalizar actas de entrega de equipos
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusTracker(true)}
                >
                  <Icon name="Activity" size={16} />
                  Ver Estado
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBackToDashboard}
                >
                  <Icon name="ArrowLeft" size={16} />
                  Volver
                </Button>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {generationSuccess && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <div>
                  <p className="font-medium text-success">¡Documento generado exitosamente!</p>
                  <p className="text-sm text-success/80">
                    El documento ha sido creado y enviado por email a {documentData?.employee?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Document Preview - Takes 2/3 of the space on desktop */}
            <div className="lg:col-span-2">
              <DocumentPreview
                documentData={documentData}
                checklistItems={includedItems}
                specialInstructions={specialInstructions}
                onGenerateDocument={handleGenerateDocument}
              />
            </div>

            {/* Configuration Panel - Takes 1/3 of the space on desktop */}
            <div className="lg:col-span-1">
              <DocumentConfiguration
                checklistItems={checklistItems}
                onChecklistChange={setChecklistItems}
                specialInstructions={specialInstructions}
                onInstructionsChange={setSpecialInstructions}
                documentData={documentData}
                onDocumentDataChange={setDocumentData}
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Info" size={16} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                El documento se enviará automáticamente al email del empleado tras la generación
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleNewAssignment}
                disabled={isGenerating}
              >
                Nueva Asignación
              </Button>
              <Button
                variant="default"
                onClick={handleGenerateDocument}
                disabled={isGenerating}
                className="min-w-[140px]"
              >
                {isGenerating ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Icon name="FileText" size={16} />
                    Generar PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Status Tracker Modal */}
      {showStatusTracker && (
        <DocumentStatusTracker
          onClose={() => setShowStatusTracker(false)}
        />
      )}
    </div>
  );
};

export default DocumentGeneration;