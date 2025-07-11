import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface LotteryDealerView {
  id: string;
  title: any;
  betCount: any;

  choose1: any;
  describe1: any;
  odds1: any;
  icon1: any;
  rate1: any;

  choose2: any;
  describe2: any;
  odds2: any;
  icon2: any;
  rate2: any;

  choose3: any;
  describe3: any;
  odds3: any;
  icon3: any;
  rate3: any;

  drawTime: any;

  status: any;
  result: any;
  endTime: any;
  rule: any;
  dealerId: any;
  playerId: any;
  prizePool: any;
  remainingPrizePool: any;
  createTime: any;
  playerName: any;
  playerLevel: any;
  playerAccount: any;
  playerAvatar: any;
}

export interface LotteryDealerPage {
  current: any;
  pages: any;
  records: LotteryDealerView[];
  searchCount: any;
  size: any;
  total: any;
}

export interface LotteryDealerResponse {
  code: any;
  data: LotteryDealerPage;
  msg: any;
}

export interface LotteryDealerReq {
  pageNum: number;
  pageSize: number;
  type: number;
  status: number | null;
}

const LotteryDealerPagePath = '/player/lotteryDealer/queryPage';
export const Request_LotteryDealerPage = async (param: LotteryDealerReq): Promise<LotteryDealerResponse> => {
  return (await axios.post(serverTarget + LotteryDealerPagePath, param)).data;
};
