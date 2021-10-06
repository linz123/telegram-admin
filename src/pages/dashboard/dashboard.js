import './dashboard.module.scss';
import {Statistic, Row, Col, Button, Card, Divider,message} from 'antd';
import {ArrowUpOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {getStatistics} from "../../api/user";

const {Meta} = Card;

export default function (props) {


    const [statistics, setStatistics] = useState({
        topMerchant: [
            {}
        ],
        topTag: [
            {}
        ]
    });

    useEffect(() => {
        doGet();
    }, [])


    function doGet() {
        getStatistics().then(resp => {
            if (resp.status === 200) {
                setStatistics(resp.data);
                message.info('已更新');
            }
        })
    }


    return (
        <div className="dashboard">
            <Button style={{'marginBottom': '10px'}} type="primary" onClick={doGet}>刷新</Button>
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
            </Row>,
        </div>
    )

}
