import './dashboard.module.scss';
import {Statistic, Row, Col, Button, Card, Divider, message, Tabs, Table, Tag, Popconfirm} from 'antd';
import {ArrowUpOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {
    getUserCount,
    getStatistics,
    getUserList,
    getUserRecord,
    getRecordStatics,
    getCommandStatistic
} from "../../api/user";
import {getDate} from "../../utils/upload";

import {Line, Column, WordCloud} from '@ant-design/charts';

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

    // setInterval(() => {
    //     // console.log(formRef)
    //     console.log(111)
    // }, 2000)


    let [userConfig, setUserConfig] = useState({
        pageSize: 20, pageIndex: 1
    });
    let [userList, setUserList] = useState([]);

    let [recordConfig, setRecordConfig] = useState({
        pageSize: 20, pageIndex: 1
    });
    const [record, setRecord] = useState([]);


    const [userCount, setUserCount] = useState([]);

    const [recordCount, setRecordCount] = useState([]);

    const [windCount, setWindCount] = useState([]);


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
        }, {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
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
        // getRecord();
        getWindCount();
        onUseChange(userConfig.pageIndex, userConfig.pageSize);
        onRecordChange(recordConfig.pageIndex, recordConfig.pageSize)
    }, [])

    function refresh() {
        doGet();
        getUser();
        // getRecord();

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

    function tabCallBack(index, item) {
        console.log(index, item);
        if (index === '4') {
            console.log('windCount', windCount);
            // getWindCount();
        }
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
        getUserCount().then(userResult => {
            if (userResult.status === 200) {
                getRecordStatics().then(recordResult => {
                    if (recordResult.status === 200) {
                        setUserCount(userResult.data.concat(recordResult.data));
                    }
                })

            }
        })
    }

    function getRecord() {
        getRecordStatics().then(result => {
            if (result.status === 200) {
                setRecordCount(result.data);
            }
        })
    }

    function getWindCount() {
        getCommandStatistic().then(result => {
            if (result.status === 200) {
                setWindCount(result.data);
            }
        })
    }


    const config = {
        data: userCount,
        height: 400,
        xField: 'create_time',
        yField: 'value',
        isGroup: true,
        seriesField: 'class',
        dodgePadding: 2,
        label: {
            position: 'middle',
            layout: [
                {type: 'interval-adjust-position'},
                {type: 'interval-hide-overlap'},
                {type: 'adjust-color'},
            ],
        },
    };
    const RecordConfig = {
        data: recordCount,
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
        meta: {
            create_time: {alias: '日期'},
            value: {alias: '使用人次'},
        },
    };

    const WindCloudConfig = {
        data: windCount,
        wordField: 'command',
        weightField: 'count',
        colorField: 'command',
        wordStyle: {
            fontFamily: 'Verdana',
            fontSize: [12, 42],
            rotation: 0,
        },
        // color: ['#FF6B3B', '#626681', '#FFC100', '#9FB40F', '#76523B', '#DAD5B5', '#0E8E89', '#E19348', '#F383A2', '#247FEA'],
        // 返回值设置成一个 [0, 1) 区间内的值，
        // 可以让每次渲染的位置相同（前提是每次的宽高一致）。
        random: () => 0.5,
    }


    console.log('config', RecordConfig)

    return (
        <div className="dashboard">
            <Button style={{'marginBottom': '10px'}} type="primary" onClick={refresh}>刷新</Button>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic title="总访问次数" value={statistics.total}/>
                        <Divider/>
                        <span style={{'color': 'grey'}}>当日访问人次</span> <span>{statistics.dayTotal}</span>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="当前在线人数" value={statistics.onlineUser} valueStyle={{color: '#3f8600'}}
                                   prefix={<ArrowUpOutlined/>}/>
                        <Divider/>
                        <span style={{'color': 'grey'}}>用户总人数</span> <span>{statistics.allUser}</span>
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
                {/*<TabPane tab="每日指令统计" key="3">*/}
                {/*    <Line {...RecordConfig} />*/}
                {/*</TabPane>*/}
                <TabPane tab="每日新增用户指令" key="4">
                    <Column {...config} />
                </TabPane>

                <TabPane tab="十日高频关键词" key="5">
                    <WordCloud {...WindCloudConfig} />
                </TabPane>

            </Tabs>
        </div>
    )

}
