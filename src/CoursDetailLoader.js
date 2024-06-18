import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from './DataContext';
import CoursDetailComponent from './CoursDetailComponent';

const CoursDetailLoader = () => {
  const { cours, isLoading } = useContext(DataContext);
  const { coursId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !cours.find(c => c.id === parseInt(coursId))) {
      navigate('/');
    }
  }, [isLoading, cours, coursId, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const selectedCours = cours.find(c => c.id === parseInt(coursId));
  return <CoursDetailComponent selectedCas={selectedCours} />;
};

export default CoursDetailLoader;
