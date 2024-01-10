// CustomAccordion.js
import React from 'react';

const CustomAccordion = ({ children, ...props }) => {
  // props.disableGutters, props.elevation et props.square peuvent être utilisés ici si nécessaire
  return (
    <details className="details_node_modules-@docusaurus-theme-common-lib-components-Details-styles-module isBrowser_node_modules-@docusaurus-theme-common-lib-components-Details-styles-module alert alert--info details_node_modules-@docusaurus-theme-classic-lib-theme-Details-styles-module" {...props}>
      {children}
    </details>
  );
};

const CustomAccordionSummary = ({ children, expandIcon, ...props }) => {
  // Ici, vous pouvez gérer la logique de l'icône d'expansion si nécessaire
  return (
    <summary {...props}>
      {children}
    </summary>
  );
};

const CustomAccordionDetails = ({ children, ...props }) => {
  return (
    <div className="collapsibleContent_node_modules-@docusaurus-theme-common-lib-components-Details-styles-module" {...props}>
      {children}
    </div>
  );
};

export { CustomAccordion, CustomAccordionSummary, CustomAccordionDetails };

