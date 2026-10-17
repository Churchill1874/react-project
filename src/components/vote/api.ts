import axios from 'axios';
import { serverTarget } from '@/common/api';

// 投票选项
export interface VoteOptionType {
  id: string;
  voteId: string;
  content: string;
  imagePath?: string;
  sort: number;
  voteCount: number;
}

// 投票
export interface VoteType {
  id: string;
  title: string;
  description?: string;
  coverImagePath?: string;
  multiSelect: boolean;
  deadline: string; // yyyy-MM-dd HH:mm:ss
  voterCount: number;
  viewCount: number;
  commentsCount: number;
  isTop: boolean;
  status: boolean;
  ended: boolean;
  options: VoteOptionType[];
  myOptionIds: string[];
  createTime: string;
}

export interface VotePageReqType {
  pageNum: number;
  pageSize: number;
  ended?: boolean; // true已截止 false进行中 不传全部
}

interface VotePageRespType {
  code: number;
  msg: string;
  data: {
    current?: number;
    pages?: number;
    records?: VoteType[] | null;
    size?: number;
    total?: number;
  };
}

interface VoteRespType {
  code: number;
  msg: string;
  data: VoteType;
}

export interface VoteSubmitReqType {
  voteId: string;
  optionIds: string[];
}

const VotePagePath = '/player/vote/queryPage';
export const VotePage_Request = async (param: VotePageReqType): Promise<VotePageRespType> => {
  return (await axios.post(serverTarget + VotePagePath, param)).data;
};

const VoteFindPath = '/player/vote/find';
export const VoteFind_Request = async (param: { id: string }): Promise<VoteRespType> => {
  return (await axios.post(serverTarget + VoteFindPath, param)).data;
};

const VoteSubmitPath = '/player/vote/submit';
export const VoteSubmit_Request = async (param: VoteSubmitReqType): Promise<VoteRespType> => {
  return (await axios.post(serverTarget + VoteSubmitPath, param)).data;
};

// 百分比：选项票数 / 参与人数，保留1位小数（多选时各项之和可能超过100%）
export const votePercent = (count?: number, voterCount?: number): number => {
  if (!voterCount || !count) return 0;
  return Math.round((count / voterCount) * 1000) / 10;
};

// 剩余时间文案
export const remainText = (deadline?: string): string => {
  if (!deadline) return '';
  const diff = new Date(deadline.replace(/-/g, '/')).getTime() - Date.now();
  if (diff <= 0) return '已截止';
  const day = Math.floor(diff / 86400000);
  const hour = Math.floor((diff % 86400000) / 3600000);
  const minute = Math.floor((diff % 3600000) / 60000);
  if (day > 0) return `剩余 ${day}天${hour}小时`;
  if (hour > 0) return `剩余 ${hour}小时${minute}分`;
  return `剩余 ${Math.max(minute, 1)}分钟`;
};
