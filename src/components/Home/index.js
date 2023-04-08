import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import ReactMarkdown from 'react-markdown';
import { Col, Row, Typography, Card, Menu } from "antd"
import { MailOutlined, SettingOutlined, AppstoreOutlined } from '@ant-design/icons';
import Layout from "../Layout"
import InfoCard from '../InfoCard'
import styles from './index.module.css'
const { Title } = Typography
 
function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
}
const items = [
    getItem('Navigation One', 'sub1', <MailOutlined />, [
      getItem('Option 1', '1'),
      getItem('Option 2', '2'),
      getItem('Option 3', '3'),
      getItem('Option 4', '4'),
    ]),
    getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
      getItem('Option 5', '5'),
      getItem('Option 6', '6'),
      getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
    ]),
    getItem('Navigation Three', 'sub4', <SettingOutlined />, [
      getItem('Option 9', '9'),
      getItem('Option 10', '10'),
      getItem('Option 11', '11'),
      getItem('Option 12', '12'),
    ]),
];
  
// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
const Home=()=>{


    const [openKeys, setOpenKeys] = useState(['sub1']);
    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          setOpenKeys(keys);
        } else {
          setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };


    let previousHistory=[]
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [sourceDocs, setSourceDocs] = useState([]);
    const [error, setError] = useState(null);

    const [messageState, setMessageState] = useState({
        messages: [
        
        ],
        history: previousHistory,
        pendingSourceDocs: [],
    });

    const { messages, pending, history, pendingSourceDocs } = messageState;


    async function handleSubmit(e) {
        e.preventDefault();
    
    
        if (!query) {
          alert('请输入问题');
          return;
        }
    
        const question = query.trim();
    
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'userMessage',
              message: question,
            },
          ],
          pending: undefined,
        }));
    
        setQuery('');
        setMessageState((state) => ({ ...state, pending: '' }));
    
        const ctrl = new AbortController();
    
    
        fetchEventSource(`http://${process.env.REACT_APP_BASE_URL}:8090/api/gpt/chat-gpt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question,
                history:[],
            }),
            signal: ctrl.signal,
            onmessage: (event) => {
                if (event.data === '[DONE]') {
                
                    setMessageState((state) => ({
                        history: [...state.history, [question, state.pending ?? '']],
                        messages: [
                        ...state.messages,
                        {
                            type: 'apiMessage',
                            message: state.pending ?? '',
                            sourceDocs: state.pendingSourceDocs,
                        },
                        ],
                        pending: undefined,
                        pendingSourceDocs: undefined,
                    }));

                    setLoading(false);

                    ctrl.abort();

                } else {
                    const data = JSON.parse(event.data);
                    if (data.sourceDocs) {
                        setMessageState((state) => ({
                        ...state,
                        pendingSourceDocs: data.sourceDocs,
                        }));
                    } else {
                        setMessageState((state) => ({
                        ...state,
                        pending: (state.pending ?? '') + data.data,
                        }));
                    }
                }
            },
        });
        
    }
    const handleEnter = useCallback(
        (e) => {
          if (e.key === 'Enter' && query) {
            handleSubmit(e);
          } else if (e.key == 'Enter') {
            e.preventDefault();
          }
        },
        [query],
    );

    const chatMessages = useMemo(() => {
        return [
          ...messages,
          ...(pending
            ? [
                {
                  type: 'apiMessage',
                  message: pending,
                  sourceDocs: pendingSourceDocs,
                },
              ]
            : []),
        ];
      }, [messages, pending, pendingSourceDocs]);

    useEffect(()=>{
        fetch(`http://${process.env.REACT_APP_BASE_URL}:8090/api/gpt/find-gpt`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            
            })
        })
        .then(data=>data.json())
        .then(json=>{
                        
            json.Gpts.forEach(history=>previousHistory.push([history.question,history.response.text]))
            setMessageState({
                ...messageState,
                history:previousHistory
            })
    
            console.log(messageState)
        })
    },[])    
    return (
        <Layout title="knowledge base" subTitle="welcome" >
        
            {/* <Title level={5}>最新上架</Title>
            <Row gutter={[16, 16]}>
                
            </Row>
            <Title level={5}>最受欢迎</Title>
            <Row gutter={[16, 16]}>
                
            </Row> */}
            {/* <Menu
                mode="inline"
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                style={{
                    width: 256,
                }}
                items={items}
            /> */}
           <Card
                title="Default size card"
                extra={<a href="#"></a>}
                style={{
                    width: 300,
                }}
            >
                <p>Card content</p>
            </Card>

            <div className={styles.flex}>
                <h2>BOSCH ATMO 涂层系统</h2>

                <form onSubmit={handleSubmit} className={styles.flex}>
                  <textarea
                    disabled={loading}
                    onKeyDown={handleEnter}
                    autoFocus={false}
                    rows={1}
                    maxLength={512}
                    id="userInput"
                    name="userInput"
                    placeholder={
                      loading
                        ? '等待加载...'
                        : '请输入问题'
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.textarea}
                  />
                  <button
                    type="submit"                    
                    className={styles.button}
                  >
                    提问
                  </button>
                </form>

                {chatMessages
                    .slice(0)
                    .reverse()
                    .map((message, index) => {
                 console.log(chatMessages)
                  return (
                    <>
                      <div key={`chatMessage-${index}`} className={null}>
                        <div className={styles.markdownanswer}>
                          <ReactMarkdown linkTarget="_blank">
                            {message.message}
                          </ReactMarkdown>
                        </div>
                      </div>
                      
                    </>
                  );
                })}
                {messageState.history.map(history=>(
                    <InfoCard question={history[0]} answer={history[1]}/>
                ))}
            </div>        
        </Layout>
    )
}

export default Home