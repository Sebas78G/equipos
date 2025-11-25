
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Icon from 'components/AppIcon';
import { getHojaDeVidaByServiceTag } from 'services/historyService';

// --- Helper function to convert worksheet to styled HTML ---
function sheetToStyledHTML(worksheet) {
    if (!worksheet) return '';

    // The `sheet_to_html` function from xlsx handles merges (`rowspan` and `colspan`)
    // but it doesn't include styling. We will inject styles manually.
    let html = XLSX.utils.sheet_to_html(worksheet);

    // Create a DOM from the HTML string to manipulate it
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const table = doc.querySelector('table');
    if (!table) return html; // Return basic html if something goes wrong

    const merges = worksheet['!merges'] || [];
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    // The sheet object contains cell objects with a style property `s`
    // when read with `cellStyles: true`
    for (let R = range.s.r; R <= range.e.r; ++R) {
        const row = table.rows[R];
        if (!row) continue;
        for (let C = range.s.c; C <= range.e.c; ++C) {
            // Find the corresponding cell in the HTML table.
            // This is tricky because of colspans.
            let htmlCell;
            let colIdx = 0;
            for(let i = 0; i < row.cells.length; i++){
                if(colIdx >= C) break;
                htmlCell = row.cells[i];
                colIdx += htmlCell.colSpan;
            }
            if(colIdx > C) continue; // This cell is spanned over

            htmlCell = Array.from(row.cells).find(cell => cell.cellIndex === C);
            if (!htmlCell) continue;

            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = worksheet[cellAddress];

            if (cell && cell.s) {
                const style = cell.s;
                let cssText = '';
                // Background Color
                if (style.fill && style.fill.fgColor && style.fill.fgColor.rgb) {
                    cssText += `background-color: #${style.fill.fgColor.rgb};`;
                }
                // Font
                if (style.font) {
                    if (style.font.bold) cssText += `font-weight: bold;`;
                    if (style.font.color && style.font.color.rgb) {
                        cssText += `color: #${style.font.color.rgb};`;
                    }
                }
                // Alignment
                if (style.alignment) {
                    if (style.alignment.horizontal) cssText += `text-align: ${style.alignment.horizontal};`;
                    if (style.alignment.vertical) cssText += `vertical-align: ${style.alignment.vertical};`;
                }
                htmlCell.style.cssText = cssText;
            }
        }
    }

    return doc.body.innerHTML;
}


const ExcelViewer = ({ serviceTag, onClose }) => {
    const [htmlContent, setHtmlContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      let isMounted = true;
  
      const fetchAndRenderExcel = async () => {
        if (isMounted) {
            setIsLoading(true);
            setError(null);
            setHtmlContent('');
        }
  
        if (!serviceTag) {
          if (isMounted) { setError('Service Tag no proporcionado.'); setIsLoading(false); } 
          return;
        }
  
        try {
          const response = await getHojaDeVidaByServiceTag(serviceTag);
          const data = new Uint8Array(response);
          // Read the workbook with cellStyles: true to get styling info
          const workbook = XLSX.read(data, { type: 'array', cellStyles: true });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          const styledHtml = sheetToStyledHTML(worksheet);

          if (isMounted) {
            setHtmlContent(styledHtml);
          }
        } catch (err) {
          if (isMounted) { setError(err.message || 'No se pudo cargar o procesar el archivo Hoja de Vida.'); }
        } finally {
          if (isMounted) { setIsLoading(false); }
        }
      };
  
      fetchAndRenderExcel();
  
      return () => { isMounted = false; };
    }, [serviceTag]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <style>
            {`
            .excel-container table { border-collapse: collapse; width: 100%; }
            .excel-container td, .excel-container th { border: 1px solid #ccc; padding: 4px 8px; font-family: Calibri, sans-serif; font-size: 11pt; min-height: 20px; }
            `}
        </style>
      <div className="bg-background rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Visor de Hoja de Vida</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="flex-grow p-4 overflow-auto excel-container">
          {isLoading && <p className="text-center py-12">Cargando archivo...</p>}
          {error && <p className="text-error text-center py-12">{error}</p>}
          {!isLoading && !error && (
            htmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            ) : (
              <p className="text-muted-foreground text-center py-12">No se encontraron datos en el archivo.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelViewer;
