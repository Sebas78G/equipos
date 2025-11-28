import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Icon from 'components/AppIcon';
import { getHojaDeVidaByServiceTag } from 'services/historyService';
 
// Office theme colors (default palette)
const THEME_COLORS = {
    "background1": "FFFFFF", "text1": "000000",
    "background2": "E7E6E6", "text2": "44546A",
    "accent1": "5B9BD5", "accent2": "ED7D31",
    "accent3": "A5A5A5", "accent4": "FFC000",
    "accent5": "4472C4", "accent6": "70AD47",
    "hyperlink": "0563C1", "followedHyperlink": "954F72"
};
 
/**
 * Converts various Excel color formats to a standard #RRGGBB hex string.
 * @param {object} colorObj - The color object from the cell style.
 * @returns {string} A CSS-compatible hex color string.
 */
function getHexColor(colorObj) {
    if (!colorObj) return '#000000'; // Default to black
    if (colorObj.rgb) {
        return `#${colorObj.rgb.slice(-6)}`;
    }
    if (colorObj.theme !== undefined) {
        const themeColorName = ["background1", "text1", "background2", "text2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6"][colorObj.theme];
        let hex = THEME_COLORS[themeColorName] || '000000';
        if (colorObj.tint) {
            let lum = parseInt(hex, 16);
            let r = (lum >> 16), g = (lum >> 8) & 0xff, b = lum & 0xff;
            r = Math.round(r * (1.0 + colorObj.tint) + (255 - 255 * (1.0 + colorObj.tint)));
            g = Math.round(g * (1.0 + colorObj.tint) + (255 - 255 * (1.0 + colorObj.tint)));
            b = Math.round(b * (1.0 + colorObj.tint) + (255 - 255 * (1.0 + colorObj.tint)));
            hex = ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
        }
        return `#${hex}`;
    }
    return '#000000';
}
 
 
const ExcelViewer = ({ serviceTag, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [htmlTable, setHtmlTable] = useState('');
 
  useEffect(() => {
    let isMounted = true;
    let objectUrl = null;
 
    const fetchAndRenderExcel = async () => {
      if (!serviceTag) {
        setError("Service Tag no proporcionado.");
        setIsLoading(false);
        return;
      }
 
      try {
        setIsLoading(true);
        const response = await getHojaDeVidaByServiceTag(serviceTag);
 
        const blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
 
        const data = await blob.arrayBuffer();
        const wb = XLSX.read(data, { type: "array", cellStyles: true });
 
        if (isMounted) {
            const sheetName = wb.SheetNames[0];
            const ws = wb.Sheets[sheetName];
           
            const range = XLSX.utils.decode_range(ws['!ref']);
            const merges = ws['!merges'] || [];
            
            // Encontrar la última columna con contenido real
            let lastColWithContent = range.s.c;
            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
                    const cell = ws[cellRef];
                    if (cell && cell.v !== undefined && cell.v !== null && cell.v !== '') {
                        lastColWithContent = Math.max(lastColWithContent, C);
                    }
                }
            }
            
            // Ajustar el rango para excluir columnas vacías al final
            range.e.c = lastColWithContent;
            
            // Identificar filas de separación de secciones (para bordes gruesos)
            const sectionRows = [];
            for (let R = range.s.r; R <= range.e.r; ++R) {
                const firstCellRef = XLSX.utils.encode_cell({ c: range.s.c, r: R });
                const firstCell = ws[firstCellRef];
                if (firstCell && firstCell.v) {
                    const cellValue = String(firstCell.v).toLowerCase();
                    if (cellValue.includes('registro') || cellValue.includes('mantenimiento')) {
                        sectionRows.push(R);
                    }
                }
            }
           
            let html = `<table style="border-collapse: collapse; width: 100%; font-family: Calibri, Arial, sans-serif; font-size: 10pt; background-color: white;">`;
           
            const colWidths = ws['!cols'] ? ws['!cols'].map(col => {
                if (col.wpx) return `${col.wpx}px`;
                if (col.wch) return `${col.wch * 7}px`;
                return 'auto';
            }) : [];
            
            html += '<colgroup>';
            for(let i=0; i <= range.e.c; i++) {
                const width = colWidths[i] || 'auto';
                html += `<col style="width: ${width};" />`;
            }
            html += '</colgroup>';
           
            html += '<tbody>';
           
            // Manually mark cell A1 for logo replacement
            if(ws['A1']) {
                ws['A1'].v = 'LOGO_PLACEHOLDER';
            } else {
                 ws['A1'] = { v: 'LOGO_PLACEHOLDER', t: 's' };
            }
 
            for (let R = range.s.r; R <= range.e.r; ++R) {
                const rowInfo = ws['!rows'] ? ws['!rows'][R] : null;
                let rowHeight = '20px';
                
                if (rowInfo) {
                    if (rowInfo.hpx) {
                        rowHeight = `${rowInfo.hpx}px`;
                    } else if (rowInfo.hpt) {
                        rowHeight = `${rowInfo.hpt * 1.2}px`;
                    }
                } else {
                    // Para las primeras 4 filas (encabezado), usar altura más pequeña
                    if (R <= 3) {
                        rowHeight = '18px';
                    }
                }
                
                // Detectar si es una fila de sección para agregar borde superior grueso
                const isSectionRow = sectionRows.includes(R);
                const rowStyle = isSectionRow ? `height: ${rowHeight}; border-top: 3px solid #000000;` : `height: ${rowHeight};`;
                
                html += `<tr style="${rowStyle}">`;
 
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    let isMerged = false;
                    for (const merge of merges) {
                        if ((R > merge.s.r && R <= merge.e.r && C >= merge.s.c && C <= merge.e.c) || (R >= merge.s.r && R <= merge.e.r && C > merge.s.c && C <= merge.e.c)) {
                            isMerged = true;
                            break;
                        }
                    }
                    if (isMerged) continue;
 
                    let colSpan = 1, rowSpan = 1;
                    for (const merge of merges) {
                        if (merge.s.r === R && merge.s.c === C) {
                            rowSpan = merge.e.r - merge.s.r + 1;
                            colSpan = merge.e.c - merge.s.c + 1;
                            break;
                        }
                    }
                   
                    const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
                    const cell = ws[cellRef];
                    let cellContent = '';
                    
                    // Solo mostrar contenido si la celda tiene valor
                    if (cell && (cell.v !== undefined && cell.v !== null && cell.v !== '')) {
                        cellContent = cell.w || cell.v || '';
                    }
                   
                    let styleStr = 'border: 1px solid #000000; padding: 2px 4px; box-sizing: border-box; overflow: hidden; line-height: 1.2; font-size: 10pt; ';
                    
                    // Agregar borde superior grueso si es fila de sección
                    if (sectionRows.includes(R)) {
                        styleStr = 'border: 1px solid #000000; border-top: 3px solid #000000; padding: 2px 4px; box-sizing: border-box; overflow: hidden; line-height: 1.2; font-size: 10pt; ';
                    }
                    if (cell && cell.s) {
                        const style = cell.s;
                        if(style.font){
                            if(style.font.bold) styleStr += 'font-weight: bold; ';
                            if(style.font.italic) styleStr += 'font-style: italic; ';
                            if(style.font.sz) styleStr += `font-size: ${style.font.sz}pt; `;
                            else styleStr += 'font-size: 10pt; ';
                            if(style.font.name) styleStr += `font-family: "${style.font.name}", Calibri, Arial, sans-serif; `;
                            if(style.font.color) styleStr += `color: ${getHexColor(style.font.color)}; `;
                        } else {
                            styleStr += 'font-size: 10pt; ';
                        }
                        if(style.fill && style.fill.fgColor) {
                            const bgColor = getHexColor(style.fill.fgColor);
                            if(bgColor !== '#000000') {
                                styleStr += `background-color: ${bgColor}; `;
                            } else {
                                styleStr += 'background-color: #ffffff; ';
                            }
                        } else {
                            styleStr += 'background-color: #ffffff; ';
                        }
                        if(style.alignment){
                            if(style.alignment.horizontal) {
                                const align = style.alignment.horizontal === 'center' ? 'center' : 
                                             style.alignment.horizontal === 'right' ? 'right' : 'left';
                                styleStr += `text-align: ${align}; `;
                            }
                            if(style.alignment.vertical) {
                                const valign = style.alignment.vertical === 'center' ? 'middle' : 
                                              style.alignment.vertical === 'bottom' ? 'bottom' : 
                                              style.alignment.vertical === 'top' ? 'top' : 'middle';
                                styleStr += `vertical-align: ${valign}; `;
                            } else {
                                styleStr += 'vertical-align: middle; ';
                            }
                            if(style.alignment.wrapText) styleStr += 'white-space: normal; word-wrap: break-word; ';
                            else styleStr += 'white-space: nowrap; ';
                        } else {
                            styleStr += 'vertical-align: middle; white-space: nowrap; ';
                        }
                        if(style.border){
                            const processBorder = (b) => {
                                if(!b) return '1px solid #000000';
                                const style = b.style === 'medium' ? '2px' : b.style === 'thick' ? '3px' : '1px';
                                return `${style} solid ${getHexColor(b.color)}`;
                            };
                            if(style.border.top) styleStr += `border-top: ${processBorder(style.border.top)}; `;
                            if(style.border.bottom) styleStr += `border-bottom: ${processBorder(style.border.bottom)}; `;
                            if(style.border.left) styleStr += `border-left: ${processBorder(style.border.left)}; `;
                            if(style.border.right) styleStr += `border-right: ${processBorder(style.border.right)}; `;
                        }
                    } else {
                        // Default styling for cells without explicit styles
                        styleStr += 'vertical-align: middle; background-color: #ffffff; font-size: 10pt; white-space: nowrap; ';
                    }
 
                    if (cell && cell.v === 'LOGO_PLACEHOLDER') {
                        colSpan = 2;
                        rowSpan = 4;
                        cellContent = `
                            <div style="display: flex; align-items: center; justify-content: flex-start; padding-left: 8px; height: 100%; width: 100%;">
                                <img
                                    src="/logo-expreso.jpg"
                                    alt="Expreso Logo"
                                    style="height: 60px; width: auto; display: block; object-fit: contain;"
                                />
                            </div>
                        `;

                        styleStr = `
                            border: 1px solid #000000;
                            border-left: 2px solid #000000;
                            padding: 3px;
                            vertical-align: middle;
                            background-color: #ffffff;
                        `;
                    }
 
                    html += `<td colspan="${colSpan}" rowspan="${rowSpan}" style="${styleStr}">${cellContent}</td>`;
                   
                    if (cell && cell.v === 'LOGO_PLACEHOLDER') {
                        // Manually advance column index to skip the now-covered empty column
                        C++;
                    }
                }
                html += '</tr>';
            }
            html += '</tbody></table>';
            setHtmlTable(html);
        }
      } catch (err) {
        console.error("Error loading Excel:", err);
        setError("No se pudo cargar o procesar el archivo Hoja de Vida.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
 
    fetchAndRenderExcel();
 
    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [serviceTag]);
 
  const handleDownload = () => {
    if (fileUrl) {
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = `Hoja_de_Vida_${serviceTag}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Hoja de Vida - {serviceTag}</h2>
          <div className="flex gap-2">
            {fileUrl && (
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Icon name="Download" size={20} /> Descargar Original
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-auto relative" style={{backgroundColor: '#f5f5f5'}}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Cargando archivo Excel...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}
          {!isLoading && !error && (
            <div className="h-full w-full p-3">
              <div 
                className="h-full w-full" 
                style={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  backgroundColor: 'white'
                }}
                dangerouslySetInnerHTML={{ __html: htmlTable }} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default ExcelViewer;