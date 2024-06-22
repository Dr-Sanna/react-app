import React, { useEffect } from 'react';
import CasDetailComponent from './CasDetailComponent';
import { AccordionProvider, useAccordion } from './AccordionContext';

const CasDetailComponentWithReset = (props) => {
  const { resetAccordions } = useAccordion();

  useEffect(() => {
    resetAccordions();
  }, [props.selectedCas, resetAccordions]);

  return <CasDetailComponent {...props} />;
};

const CasDetailComponentWithProvider = (props) => (
  <AccordionProvider>
    <CasDetailComponentWithReset {...props} />
  </AccordionProvider>
);

export default React.memo(CasDetailComponentWithProvider);
