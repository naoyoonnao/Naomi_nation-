import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnimatedSearchBar.scss';
import searchIcon from '../../assets/SearchIcon.svg';
import { SearchContext } from '../../context/SearchContext';

export default function AnimatedSearchBar({ onSearchToggle = () => {} }) {
  const { setQuery } = useContext(SearchContext);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");

  // Inform parent (Header) when open state changes
  useEffect(() => {
    onSearchToggle(isOpen);
  }, [isOpen, onSearchToggle]);

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
                  value={value}
                  onChange={(e)=>{
                      setValue(e.target.value);
                      setQuery(e.target.value.toLowerCase());
                  }}
                  onBlur={()=>setIsOpen(false)}
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
