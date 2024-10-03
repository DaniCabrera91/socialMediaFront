import React, { useState, useEffect } from 'react';
import { Button, Affix } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import './TheFooter.styled.scss'; // Importa el archivo de estilo

function TheFooter() {
  const [visible, setVisible] = useState(false);

  const handleScroll = () => {
    setVisible(window.scrollY > 300);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <a
          href="https://github.com/DaniCabrera91"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <GithubOutlined/>
        
        <p>© 2024 @DaniCabrera91. Todos los derechos reservados.</p>
        </a>
      </div>

      {visible && (
        <Affix style={{ position: 'fixed', bottom: '30px', right: '30px'}}>
          <Button 
            type="primary" 
            shape="circle" 
            icon={<span>↑</span>} 
            size="large" 
            onClick={scrollToTop}
          />
        </Affix>
      )}
    </footer>
  );
}

export default TheFooter;
