import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import ReactMarkdown from 'react-markdown';

import styles from './index.module.css';


export default  function Chat(props){
  

  return (
    <>
        <div className={`${styles.card} `}>
          <div className={`${styles.question} `}>
            {props.question} 
          </div>
          <div className={`${styles.answer} `}>
            {props.answer}
          </div>
        </div>
        
    </>
  );
}