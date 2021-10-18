import './dashboard.module.scss';
import {Statistic, Row, Col, Button, Card, Divider, message, Tabs, Table, Tag, Popconfirm} from 'antd';
import {ArrowUpOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {getUserCount, getStatistics, getUserList, getUserRecord} from "../../api/user";
import {getDate} from "../../utils/upload";

import {Line} from '@ant-design/charts';

const {Meta} = Card;
const {TabPane} = Tabs;

export default function (props) {


    const [statistics, setStatistics] = useState({
        topMerchant: [
            {}
        ],
        topTag: [
            {}
        ]
    });


    let [userConfig, setUserConfig] = useState({
        pageSize: 20, pageIndex: 1
    });
    let [userList, setUserList] = useState([]);

    let [recordConfig, setRecordConfig] = useState({
        pageSize: 20, pageIndex: 1
    });
    const [record, setRecord] = useState([]);


    const [userCount, setUserCount] = useState([]);


    const userColumns = [
        {
            title: 'Id',
            dataIndex: 'user_id',
            key: 'telegram_id',
        },
        {
            title: '名称',
            dataIndex: 'first_name',
            key: 'telegram_id',
        },
        {
            title: 'telegram_id',
            dataIndex: 'username',
            key: 'telegram_id',
        },
        {
            title: '是否机器人',
            dataIndex: 'is_bot',
            key: 'telegram_id',
            render: (item) => item === 0 ? '否' : '是'
        },
        {
            title: '使用量',
            dataIndex: 'hot',
            key: 'telegram_id',
        },

        {
            title: '最近使用时间',
            dataIndex: 'update_time',
            key: 'telegram_id',
        }
    ];


    const RecordColumns = [
        {
            title: 'record_id',
            dataIndex: 'record_id',
            key: 'record_id',
        },
        {
            title: 'telegram_id',
            dataIndex: 'telegram_id',
            key: 'telegram_id',
        },
        {
            title: '用户名',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: '指令',
            dataIndex: 'command',
            key: 'command',
        },

        {
            title: '发送时间',
            dataIndex: 'update_time',
            key: 'update_time',
        }
    ];


    useEffect(() => {
        doGet();
        getUser();
        onUseChange(userConfig.pageIndex, userConfig.pageSize);
        onRecordChange(recordConfig.pageIndex, recordConfig.pageSize)
    }, [])

    function refresh() {
        doGet();
        getUser();
        onUseChange(userConfig.pageIndex, userConfig.pageSize);
        onRecordChange(recordConfig.pageIndex, recordConfig.pageSize)
    }


    function doGet() {
        getStatistics().then(resp => {
            if (resp.status === 200) {
                setStatistics(resp.data);
                message.info('已更新');
            }
        })

    }

    function tabCallBack() {

    }

    function onUseChange(pageIndex, pageSize) {
        setUserConfig(prevState => ({
            ...prevState,
            pageIndex,
            pageSize
        }))
        getUserList({pageSize, pageIndex}).then(r => {
            if (r.status === 200) {
                setUserList(r);
            }
        })
    }

    function onRecordChange(pageIndex, pageSize) {

        setRecordConfig(prevState => ({
            ...prevState,
            pageIndex,
            pageSize,

        }))
        getUserRecord({pageSize, pageIndex, date: getDate()}).then(r => {
            if (r.status === 200) {
                setRecord(r);
            }
        })
    }

    function getUser() {
        getUserCount().then(result => {
            if (result.status === 200) {
                setUserCount(result.data);
            }
        })
    }


    const config = {
        data: userCount,
        height: 400,
        xField: 'create_time',
        yField: 'value',
        point: {
            size: 5,
            shape: 'diamond',
        },
        label: {
            style: {
                fill: '#aaa',
            },
        },
    };

    console.log('config', config)

    return (
        <div className="dashboard">
            <Button style={{'marginBottom': '10px'}} type="primary" onClick={refresh}>刷新</Button>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic title="总访问次数" value={statistics.total}/>
                        <Divider/>
                        <span style={{'color': 'grey'}}>当日访问次数</span> <span>{statistics.dayTotal}</span>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="当前在线人数" value={statistics.onlineUser} valueStyle={{color: '#3f8600'}}
                                   prefix={<ArrowUpOutlined/>}/>
                        <Divider/>
                        <span style={{'color': 'grey'}}>历史使用人数</span> <span>{statistics.allUser}</span>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="最受欢迎商家" value={statistics?.topMerchant[0].name}/>
                        <Divider/>
                        <span style={{'color': 'grey'}}>总访问次数</span> <span>{statistics?.topMerchant[0].hot}</span>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="最多关键词" value={statistics?.topTag[0].tag_name}/>
                        <Divider/>
                        <span style={{'color': 'grey'}}>总访问次数</span> <span>{statistics?.topTag[0].hot}</span>
                    </Card>
                </Col>
            </Row>
            <Tabs defaultActiveKey="1" onChange={tabCallBack} style={{'marginTop': '20px'}}>
                <TabPane tab="用户列表" key="1">
                    <Table dataSource={userList.data} columns={userColumns} pagination={{
                        position: 'bottomRight',
                        total: userList.total,
                        pageSize: userConfig.pageSize,
                        onChange: (current, size) => onUseChange(current, size)
                    }}/>
                </TabPane>
                <TabPane tab="用户指令" key="2">
                    <Table dataSource={record.data} columns={RecordColumns} pagination={{
                        position: 'bottomRight',
                        total: record.total,
                        pageSize: recordConfig.pageSize,
                        onChange: (current, size) => onRecordChange(current, size)
                    }}/>
                </TabPane>
                <TabPane tab="新增用户统计" key="3">
                    <Line {...config} />
                </TabPane>
            </Tabs>
        </div>
    )

}
