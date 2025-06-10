import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnimatedSearchBar.scss';
import searchIcon from '../../assets/SearchIcon.svg';

export default function AnimatedSearchBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>

      {!isOpen && (
        <div className="mini-search" onClick={() => setIsOpen(true)}>
          <img src={searchIcon} alt="search icon" className="icon" />
        </div>
      )}

     
      <AnimatePresence>
        {isOpen && (
          <>
           
            <motion.div
              className="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

  
            <motion.div
              layoutId="search-bar"
              className="expanded-search-wrapper"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              initial={{ opacity: 0, scale: 0.9, y: -60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -60 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="expanded-search">
                <input
                  type="text"
                  placeholder="Search..."
                  autoFocus
                  onBlur={() => setIsOpen(false)}
                  autoComplete="off"
                />
                <img src={searchIcon} alt="search icon" className="icon" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
