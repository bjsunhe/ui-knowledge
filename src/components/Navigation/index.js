import {useState} from 'react'
import {useLocation} from 'react-router-dom'
import { Badge, Menu } from "antd"
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import {NavLink} from "react-router-dom"
import styles from './index.module.css';




function useActive(currentPath, path){
    return currentPath === path ? "ant-menu-item-selected" : ""
}
const Navigation=()=>{
    const pathname=useLocation().pathname
    const isHome = useActive(pathname, "/")
    const isKnowledge = useActive(pathname, "/knowledge")
    // console.log('home',isHome)
    // console.log('knowledge',isKnowledge)
    // className={({isActive})=>isActive?'ant-menu-item-selected':''}
    const items = [
        {
          label: (<NavLink to='/' className={isHome}>Home</NavLink>),
          key: 'home',
          icon: <MailOutlined />,
        },
        {
          label: (<NavLink to='/knowledge' className={isKnowledge}>Knowledge</NavLink>),
          key: 'knowledge',
          icon: <AppstoreOutlined />,
        }
    ];
    const [current, setCurrent] = useState('home');
    const onClick = (e) => {
      setCurrent(e.key);
    };

    return (
        <>
            {/* <Badge count={10} />
            <div className={styles.big}>
                hi
            </div> */}
            {/* <Menu mode="horizontal">
                <Menu.Item>
                    <NavLink to='/'>Home</NavLink>
                </Menu.Item>
                <Menu.Item>
                    <NavLink to='/knowledge'>Knowledge</NavLink>
                </Menu.Item>
                
            </Menu> */}
            <Menu onClick={onClick}   mode="horizontal" items={items} />;
        </>
    )
}

export default Navigation