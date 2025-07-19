import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface BetOrderType {}

export interface BetOrderPageReq {
  pageNum: number;
  pageSize: number;
}

export interface BetOrderPageResp {
  current: any;
  pages: any;
  records: BetOrderType[] | [];
  searchCount: any;
  size: any;
  total: any;
}

export interface BetOrderTypeResp {
  code: any;
  data: BetOrderPageResp;
  msg: any;
}

const PoliticsLotteryListPath = '/player/politicsLottery/queryPage';
export const Request_PoliticsLotteryList = async (param: BetOrderPageReq): Promise<BetOrderTypeResp> => {
  return (await axios.post(serverTarget + PoliticsLotteryListPath, param)).data;
};
