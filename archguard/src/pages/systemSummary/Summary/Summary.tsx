import React, { useEffect, useState } from "react";
import styles from "./Summary.less";
import { BaButton } from "@/components/Basic/Button/Button";
import { BaLabel } from "@/components/Basic/Label/Label";
import { BuGrade } from "@/components/Business/Grade/Grade";
import { useOverviewCount } from "@/api/module/codeLine";
import { history } from "umi";
import { storage } from "@/store/storage/sessionStorage";
import useSystemList from "@/store/global-cache-state/useSystemList";
import { queryContainerServices } from "@/api/module/containerService";
import { Table } from 'antd';
import FileChangeSizing from "@/pages/systemSummary/Summary/components/FileChangeSizing";

function Summary() {
  const {data: overviewCount} = useOverviewCount();
  const [services, setServices] = useState([]);

  const [systemList] = useSystemList();
  const [systemName, setSystemName] = useState<string>("");

  const getSystemName = (): string => {
    const list = systemList?.value || [];
    const id = storage.getSystemId();

    return list.find((system) => system.id === parseInt(id))?.systemName || "";
  };

  useEffect(() => {
    setSystemName(getSystemName());
  }, [systemList]);

  useEffect(() => {
    queryContainerServices().then((res) => {
      setServices(res);
    });
  }, []);

  const apiColumns = [
    {title: 'Source Method', dataIndex: 'sourceMethod', key: 'sourceMethod',},
    {title: 'URI', dataIndex: 'targetUrl', key: 'targetUrl',},
    {title: 'HTTP Method', dataIndex: 'targetHttpMethod', key: 'targetHttpMethod',},
  ];

  const lineCountColumns = [
    {title: '语言', dataIndex: 'language', key: 'language',},
    {title: '行数', dataIndex: 'lineCount', key: 'lineCount',},
  ];

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.name}>{systemName}</div>
        </div>
        <BaButton onClick={() => history.push(`/${storage.getSystemId()}/systemEvolving/MeasureIndicators`)}>
          查看指标看板
        </BaButton>
      </div>

      <div className={styles.body}>
        <div className={styles.detail}>
          <div className={styles.overview}>
            <BaLabel value={overviewCount?.repoCount} text="代码仓数"></BaLabel>
            <BaLabel value={overviewCount?.moduleCount} text="模块数"></BaLabel>
            <BaLabel value={overviewCount?.contributorCount} text="代码贡献人数"></BaLabel>
            <BuGrade text="架构质量等级" grade={overviewCount?.qualityLevel}></BuGrade>
          </div>
          <div>
            <Table dataSource={overviewCount?.lineCounts} columns={lineCountColumns}/>
          </div>
        </div>
        <div className={styles.physical}>
          <div className={styles.changes}>
            <h2>提交变更频率</h2>
            <FileChangeSizing />
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.demand}>
          <h2>API 使用清单</h2>
          <Table dataSource={services} columns={apiColumns}/>
        </div>
        <div className={styles.resource}>
          <h2>API 提供清单</h2>
        </div>
      </div>
      <div className={styles.logic}>
        <div className={styles.changes}>
          <h2>模型依赖度清单（FanIn/FanOut）</h2>
        </div>
      </div>
    </div>
  );
}

export default Summary;
