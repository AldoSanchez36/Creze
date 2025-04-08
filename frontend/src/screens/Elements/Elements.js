import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../Elements/LanguageContext';
import './Element.css'; // Import the CSS file

export const Elements = () => {
  const { changeLanguage } = useLanguage();
  const [textEn, setTextEn] = useState('Inglés');
  const [textEs, setTextEs] = useState('Español');

  

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    changeLanguage(selectedLanguage);
    
    if (selectedLanguage === 'en') {
      setTextEn('English');
      setTextEs('Spanish');
    } else {
      setTextEn('Inglés');
      setTextEs('Español');
    }
  };

  //const navigate = useNavigate();

  return (
    <div className="elements-container">
      <span class="material-symbols-outlined">
      language
      </span>
      <select className="language-select" onChange={handleLanguageChange}>
        <option value="en">{textEn}</option>
        <option value="es">{textEs}</option>
      </select>
      
    </div>
  );
};

