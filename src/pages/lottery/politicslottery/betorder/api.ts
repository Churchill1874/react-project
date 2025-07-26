import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface BetOrderType {
  id: string;
  title: any;
  type: any;
  dealerId: any;
  playerId: any;
  playerName: string;
  playerLevel: string;
  playerAvatar: string;
  chooseNumber: any;
  choose: any;
  odds: any;
  dealerUserId: any;
  dealerUsername: any;
  dealerUserLevel: any;
  betAmount: any;
  amount: any;
  drawTime: any;
  status: number;
  createName: any;
  createTime: any;
}

export interface BetOrderPageReq {
  pageNum: number;
  pageSize: number;
  dealerId?: string;
  type: number;
  playerId?: string;
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

export interface Response {
  code: any;
  data: any;
  msg: any;
}

//分页个人投注记录
const LotteryDealerPlayerPagePath = '/player/betOrder/playerPage';
export const Request_LotteryDealerPlayerPage = async (param: BetOrderPageReq): Promise<BetOrderTypeResp> => {
  return (await axios.post(serverTarget + LotteryDealerPlayerPagePath, param)).data;
};

//分页公共投注记录
const LotteryDealerQueryPagePath = '/player/betOrder/queryPage';
export const Request_LotteryDealerQueryPage = async (param: BetOrderPageReq): Promise<BetOrderTypeResp> => {
  return (await axios.post(serverTarget + LotteryDealerQueryPagePath, param)).data;
};

export interface BetOrderAddReq {
  dealerId: string;
  chooseNumber: number;
  betAmount: string;
}

//投注
const LotteryDealerBetPath = '/player/betOrder/betPolitics';
export const Request_LotteryDealerBet = async (param: BetOrderAddReq): Promise<Response> => {
  return (await axios.post(serverTarget + LotteryDealerBetPath, param)).data;
};
