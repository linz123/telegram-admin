import {Breadcrumb, Layout, Menu, Dropdown} from 'antd';
import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
    LoginOutlined
} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import './layout.scss';
import userIcon from '../assets/BiazfanxmamNRoxxVxka.png';
import {getItem, removeItem} from "../utils/storage";
import {Route, useHistory, Switch, Link} from "react-router-dom";
import Merchant from "../pages/merchant/merchant";
import MerClass from "../pages/classes/class";
import Tags from "../pages/tags/tags";
import {observer} from "mobx-react";


const {SubMenu} = Menu;
const {Header, Sider, Content} = Layout;

export default observer(({store, props, history}) => {

    const [collapsed, setCollapsed] = useState(false);
    console.log('layout-store', store, store.user);


    function setUser() {
        const user = getItem('user');
        console.log('user', user);
        if (user) store.user = user
    }

    function handleMenuClick(e) {
        // message.info('Click on menu item.');
        console.log('click', e);
        removeItem('user');
        history.push('/');

    }

    useEffect(() => {
        setUser();
    }, [])

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="3" icon={<LoginOutlined/>}>
                退出登录
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout style={{height: '100%'}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo-wrapper">
                    <div className="logo"/>
                    <div className="logo-txt">Bot Admin</div>
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>

                    {/*<SubMenu key="sub1" icon={<MailOutlined/>} title="Navigation One">*/}
                    {/*    <Menu.Item key="5">Option 5</Menu.Item>*/}
                    {/*    <Menu.Item key="6">Option 6</Menu.Item>*/}
                    {/*    <Menu.Item key="7">Option 7</Menu.Item>*/}
                    {/*    <Menu.Item key="8">Option 8</Menu.Item>*/}
                    {/*</SubMenu>*/}
                    {/*<SubMenu key="sub2" icon={<AppstoreOutlined/>} title="Navigation Two">*/}
                    {/*    <Menu.Item key="9">Option 9</Menu.Item>*/}
                    {/*    <Menu.Item key="10">Option 10</Menu.Item>*/}
                    {/*    <SubMenu key="sub3" title="Submenu">*/}
                    {/*        <Menu.Item key="11">Option 11</Menu.Item>*/}
                    {/*        <Menu.Item key="12">Option 12</Menu.Item>*/}
                    {/*    </SubMenu>*/}
                    {/*</SubMenu>*/}

                    <SubMenu key="sub1" icon={<MailOutlined/>} title="Navigation One">
                        <Menu.Item key="/user/merchant" icon={<PieChartOutlined/>}>
                            <Link to="/user/merchant">Merchant</Link>
                        </Menu.Item>
                        <Menu.Item key="/user/class" icon={<PieChartOutlined/>}>
                            <Link to="/user/class">Class</Link>
                        </Menu.Item>
                        <Menu.Item key="/user/tags" icon={<PieChartOutlined/>}>
                            <Link to="/user/tags">Tags</Link>
                        </Menu.Item>
                    </SubMenu>
                    {/*<Menu.Item key="2" icon={<DesktopOutlined/>}>*/}
                    {/*    Option 2*/}
                    {/*</Menu.Item>*/}
                    {/*<Menu.Item key="3" icon={<ContainerOutlined/>}>*/}
                    {/*    Option*/}
                    {/*</Menu.Item>*/}
                </Menu>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: () => setCollapsed(!collapsed)
                })}
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{padding: 0}}>
                    <div className="layout-side">
                        <div className="item-space">
                            <Dropdown overlay={menu} placement="bottomLeft" arrow>
                                <div className="item-space-item">
                                    <img src={userIcon}
                                         alt=""/>
                                    <span>{store.user ? store.user.username : ''}</span>
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </Header>
                <Breadcrumb style={{margin: '16px'}}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '0 16px 22px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                        <Switch>
                            <Route path="/user/merchant" children={<Merchant/>}/>
                        </Switch>
                        <Switch>
                            <Route path="/user/class" children={<MerClass/>}/>
                        </Switch>
                        <Switch>
                            <Route path="/user/tags" children={<Tags/>}/>
                        </Switch>
                    </div>
                </Content>
            </Layout>
        </Layout>

    )
})
