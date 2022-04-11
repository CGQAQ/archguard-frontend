import React, { useCallback, useEffect, useState } from "react";
import useSystemList from "@/store/global-cache-state/useSystemList";
import { Button, Select, Input, Row, Col, Form, Space } from "antd";
import { storage } from "@/store/storage/sessionStorage";
import { DatePicker } from 'antd';
import { queryCommitByIds, queryCommitByRanges, queryHistory } from "@/api/module/gitFile";
import { useParams } from "umi";
import RelationMap from "@/pages/change/RelationMap";

const { RangePicker } = DatePicker;

const ChangeDetect = () => {
  const [systemInfo] = useSystemList();
  const [isInChanging, setIsInChanging] = useState(false);
  // @ts-ignore
  const [systemId, setSystemId] = useState(useParams().systemId);
  const [timeRange, setTimeRange] = useState({
    startTime: "",
    endTime: ""
  });
  const [commits, setCommits] = useState(null)
  const [relations, setRelations] = useState([])

  // @ts-ignore
  const changeTime = useCallback((date, dateString) => {
    setTimeRange({
      startTime: (date[0].unix() * 1000).toString(),
      endTime: (date[1].unix() * 1000).toString(),
    })
  }, [setTimeRange]);

  const onSystemChange = useCallback((index: number) => {
    setIsInChanging(false)
    let system = systemInfo?.value!.filter((item) => item.id === index)[0]
    if (!!system) {
      storage.setSystemId(system.id);
      storage.setSystemLanguage(system.language);

      setSystemId(system.id)
      queryHistory(String(system.id)).then((res) => {
        setCommits(res as any)
      })

      // todo: is a dirty fix for old code which no fetch system id
      setTimeout(() => {
        setIsInChanging(true)
      }, 50)
    }
  }, [setIsInChanging, setCommits]);

  const queryByTime = useCallback(() => {
    queryCommitByRanges(systemId, timeRange.startTime, timeRange.endTime).then((res) => {
      setCommits(res as any)
    })
  }, [systemId, timeRange, setCommits])

  const queryByCommitId = useCallback((value) => {
    queryCommitByIds(systemId, value.since, value.until).then((res) => {
      setCommits(res as any)
    })
  }, [systemId, setCommits])

  useEffect(() => {
    if (!commits) return;

    let results: any[] = []
    // @ts-ignore
    for (let relation of commits) {
      results = results.concat(JSON.parse(relation.relations))
    }

    console.log(results)
    // @ts-ignore
    setRelations(results)
  }, [commits, setRelations])

  return (
    <div>
      { systemInfo?.value &&
        <>
          <Space direction="vertical" size="middle">

            <Select
              style={ { width: 150, color: "#000" } }
              bordered={ true }
              showArrow={ true }
              placeholder="请选择系统"
              onChange={ (index) => onSystemChange(index) }
            >
              { systemInfo?.value!.map((system, index) => (
                <Select.Option
                  disabled={ system.scanned !== "SCANNED" }
                  value={ system.id }
                  key={ `${ system.systemName }_${ index }` }
                >
                  { system.systemName }
                </Select.Option>
              )) }
            </Select>

            { systemId && <>
              <Space size="middle">
                <RangePicker showTime onChange={ (date, dateString) => changeTime(date, dateString) }/>
                <Button type="primary" onClick={ () => queryByTime() } disabled={ timeRange.startTime === "" }>
                  分析
                </Button>
              </Space>

              <Form name="basic" onFinish={ queryByCommitId } autoComplete="off">
                <Row>
                  <Form.Item label="起始 commit id " name="since">
                    <Input/>
                  </Form.Item>

                  <Form.Item label="结束 commit id " name="until">
                    <Input/>
                  </Form.Item>

                  <Form.Item wrapperCol={ { offset: 8, span: 16 } }>
                    <Button type="primary" htmlType="submit">分析</Button>
                  </Form.Item>
                </Row>
              </Form>

            </>
            }
          </Space>

          <>
            { !!relations && relations.length > 0 && <RelationMap dataSource={ relations }/> }
            { !!commits &&
                // @ts-ignore
                commits.map((commit: any, index) => (
                  <div key={ `${ commit }_${ index }` }>
                    <p> sinceRev: {commit.sinceRev}, untilRev: {commit.untilRev}, Function: {commit.packageName}.{commit.className}</p>
                    {/* "[]".length = 2 */}
                    { commit.relations.length > 2 && <RelationMap dataSource={ JSON.parse(commit.relations) }/> }
                  </div>
                ))
            }
          </>
        </>
      }
    </div>
  )
}

export default ChangeDetect
