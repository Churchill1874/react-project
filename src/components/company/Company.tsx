import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Card, Divider, PullToRefresh, Space, Tag, InfiniteScroll, Popup, FloatingBubble, ImageViewer, Image, Steps, Ellipsis, Swiper } from 'antd-mobile';
import { MessageFill, LeftOutline, LocationFill } from 'antd-mobile-icons';
import '@/components/company/Company.less'
import {Request_CompanyPage, CompanyResponseType} from '@/components/company/api'
import dayjs from 'dayjs'
import useStore from "@/zustand/store";


const Company: React.FC = () => {
  const { Step } = Steps

  const [visibleCloseRight, setVisibleCloseRight] = useState(false)
  const [visible, setVisible] = useState(false)

  const showPopupInfo = () => {
    console.log(visibleCloseRight)
    setVisibleCloseRight(true)
  }

  const showImage = () => {
    setVisible(prev => !prev);
  }


  return (
    <>
      <div className="card-container" >

        <Card className="company-custom-card">
          <div className="card-content">
            <div className="company-line1">AG集团 IVI公司</div>
            <Divider className='company-divider-line' />

            {'公司图片变量' &&
              <Swiper loop autoplay allowTouchMove>
                {'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZq5wFJ_FtNWQQGdRkmXonQOEuMVpWuWm3w&s,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZq5wFJ_FtNWQQGdRkmXonQOEuMVpWuWm3w&s'.split(',').map((imagePath, index) => (
                  <Swiper.Item className="swiper-item" key={index} >
                    <Image className='company-image-container' fit='contain' src={imagePath} onClick={showImage} />
                  </Swiper.Item>
                ))}
              </Swiper>
            }
            <Divider className='company-divider-line' />
            <div className="text-area">
              <Ellipsis direction='end' rows={3} content='上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接
                  上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接' />
            </div>

            <Divider className='divider-line' />
            <div className="line-group">
              <div className="line">加班调休</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">双休制</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">大公司</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">绩效奖金</div>
            </div>

            <Divider className='divider-line' />
            <div className="line-group">
              <div className="line">30k-50k</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">领导nice</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">单人间</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">办公环境nice</div>
            </div>
            <Divider className='divider-line' />
            <div className="line-group">
              <span><LocationFill className="area" />泰国 菲律宾</span>
            </div>
            <Divider className='divider-line' />

            <span className='company-record-bottom'>
              <span className='last-time'>{/* {dayjs(job.lastTime).format('YYYY-MM-DD HH:mm')} */}最后一次更新时间: 2024-12-01 02:10</span>
              <span className="company-info" onClick={showPopupInfo}> <span className="company-click">点击查看</span> </span>
            </span>

          </div>
        </Card>
        <Card className="company-custom-card">
          <div className="card-content">
            <div className="company-line1">AG集团 IVI公司</div>

            <Divider className='company-divider-line' />

            <div className="text-area">
              <Ellipsis direction='end' rows={3} content='上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接
                  上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接' />
            </div>

            <Divider className='company-divider-line' />

            <div className="line-group">
              <div className="line">加班调休</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">双休制</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">大公司</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">绩效奖金</div>
            </div>

            <Divider className='divider-line' />
            <div className="line-group">
              <div className="line">30k-50k</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">领导nice</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">单人间</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">办公环境nice</div>
            </div>
            <Divider className='divider-line' />
            <div className="line-group">
              <span><LocationFill className="area" />泰国 菲律宾</span>
            </div>
            <Divider className='divider-line' />

            <span className='company-record-bottom'>
              <span className='last-time'>{/* {dayjs(job.lastTime).format('YYYY-MM-DD HH:mm')} */}最后一次更新时间: 2024-12-01 02:10</span>
              <span className="company-info" onClick={showPopupInfo}> <span className="company-click">点击查看</span> </span>
            </span>                    </div>
        </Card>
        <Card className="company-custom-card">
          <div className="card-content">
            <div className="company-line1">AG集团 IVI公司</div>

            <Divider className='company-divider-line' />
            {'公司图片变量' &&
              <Swiper loop autoplay allowTouchMove>
                {'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZq5wFJ_FtNWQQGdRkmXonQOEuMVpWuWm3w&s,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZq5wFJ_FtNWQQGdRkmXonQOEuMVpWuWm3w&s'.split(',').map((imagePath, index) => (
                  <Swiper.Item className="swiper-item" key={index} >
                    <Image className='company-image-container' fit='contain' src={imagePath} onClick={showImage} />
                  </Swiper.Item>
                ))}
              </Swiper>
            }
            <Divider className='company-divider-line' />

            <div className="text-area">
              <Ellipsis direction='end' rows={3} content='上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接
                  上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接' />
            </div>

            <Divider className='divider-line' />

            <div className="line-group">
              <div className="line">加班调休</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">双休制</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">大公司</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">绩效奖金</div>
            </div>

            <Divider className='divider-line' />
            <div className="line-group">
              <div className="line">30k-50k</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">领导nice</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">单人间</div>
              <Divider className='blue-divider-line' direction="vertical" />
              <div className="line">办公环境nice</div>
            </div>
            <Divider className='divider-line' />
            <div className="line-group">
              <span><LocationFill className="area" />泰国 菲律宾</span>
            </div>
            <Divider className='divider-line' />

            <span className='company-record-bottom'>
              <span className='last-time'>{/* {dayjs(job.lastTime).format('YYYY-MM-DD HH:mm')} */}最后一次更新时间: 2024-12-01 02:10</span>
              <span className="company-info" onClick={showPopupInfo}> <span className="company-click">点击查看</span> </span>
            </span>
          </div>
        </Card>

        <Popup className='news-record-popup' bodyStyle={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%' }}
          position='right'
          closeOnSwipe={true}
          closeOnMaskClick
          visible={visibleCloseRight}
          onClose={() => { setVisibleCloseRight(false) }}>

          <div onClick={() => setVisibleCloseRight(false)}><span style={{ paddingRight: '5px', color: 'gray', fontSize: '16px' }} ><LeftOutline fontSize={16} />返回 </span></div>

          <div className="company-info-popup">
            <Card className="company-custom-card">
              <div className="company-line1">AG集团 IVI公司</div>

              <Divider className='company-divider-line' />
              {'公司图片变量' &&
                <Swiper loop autoplay allowTouchMove>
                  {'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZq5wFJ_FtNWQQGdRkmXonQOEuMVpWuWm3w&s,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZq5wFJ_FtNWQQGdRkmXonQOEuMVpWuWm3w&s'.split(',').map((imagePath, index) => (
                    <Swiper.Item className="swiper-item" key={index} >
                      <Image className='company-image-container' fit='contain' src={imagePath} onClick={showImage} />
                    </Swiper.Item>
                  ))}
                </Swiper>
              }
              <Divider className='company-divider-line' />

              <div className="text-area">
                {'上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接上千人公司,主要提供东南亚,行业龙头,主要经营项目为线上游戏源头,对接第三方大厅,和第三方支付项目提供对接'}
              </div>

              <Divider className='company-divider-line' />
              <div className="line-group">
                <div className="line">加班调休</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">双休制</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">大公司</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">绩效奖金</div>
              </div>

              <Divider className='divider-line' />
              <div className="line-group">
                <div className="line">30k-50k</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">领导nice</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">单人间</div>
                <Divider className='blue-divider-line' direction="vertical" />
                <div className="line">办公环境nice</div>
              </div>
              <Divider className='divider-line' />
              <div className="line-group">
                <span><LocationFill className="area" />泰国 菲律宾</span>
              </div>
              <Divider className='divider-line' />

              <span className='last-time'>{/* {dayjs(job.lastTime).format('YYYY-MM-DD HH:mm')} */}最后一次更新时间: 2024-12-01 02:10</span>
            </Card>


            <Steps direction='vertical'>
              <Step
                title='填写机构信息'
                status='finish'
                description='完成时间：2020-12-01 12:30'
              />
              <Step
                title='签约机构'
                status='finish'
                description='完成时间：2020-12-01 12:30'
              />
              <Step
                title='关联服务区'
                status='finish'
                description='完成时间：2020-12-01 12:30'
              />
            </Steps>

          </div>

        </Popup>
      </div>
    </>
  );
}

export default Company;