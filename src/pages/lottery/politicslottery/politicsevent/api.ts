import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface PoliticsLotteryType {
  id: any;
  createTime: any;
  createName: any;
  // 选择1
  choose1: any;
  // 描述1
  describe1: any;
  // 图标1
  icon1: any;
  // 选择2
  choose2: any;
  // 描述2
  describe2: any;
  // 图标2
  icon2: any;
  // 选择3
  choose3: any;
  // 描述3
  describe3: any;
  // 图标3
  icon3: any;
  // 标题
  title: any;
  // 规则简介
  rule: any;
  // 结束时间
  endTime: any;
  // 是否开售
  isOnSale: any;
  // 开奖结果
  result: any;
  // 彩票状态
  status: any;
  drawTime: any;
}

export interface PoliticsLotteryListReq {
  pageNum: number;
  pageSize: number;
  type: number | null;
  status?: number | null;
}

export interface PoliticsLotteryPageResp {
  current: any;
  pages: any;
  records: PoliticsLotteryType[] | [];
  searchCount: any;
  size: any;
  total: any;
}

export interface PoliticsLotteryTypeResp {
  code: any;
  data: PoliticsLotteryPageResp;
  msg: any;
}

const PoliticsLotteryListPath = '/player/politicsLottery/queryPage';
export const Request_PoliticsLotteryList = async (param: PoliticsLotteryListReq): Promise<PoliticsLotteryTypeResp> => {
  return (await axios.post(serverTarget + PoliticsLotteryListPath, param)).data;
};
