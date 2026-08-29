// 目标路径: src/components/telegram/api.ts
import axios from 'axios';
import { serverTarget } from '@/common/api';

// 电报列表查询响应
export interface TelegramRespType {
  code: number;
  msg: string;
  data: PageResponseType;
}

// 分页返回数据
interface PageResponseType {
  current?: any | null;
  pages?: any | null;
  records?: TelegramType[] | null;
  size?: any | null;
  total?: any | null;
}

// 电报频道/群组返回类型
export interface TelegramType {
  id: number;
  title: string;
  type: number; // 1-频道 2-群组
  account: string; // Telegram账号，如 @xxxx
  jumpUrl: string; // 跳转链接
  posterImagePath: string; // 海报图（3:1）
  qrImagePath: string | null; // 二维码图片，可为空
  description: string;
  isTop: boolean;
  status: boolean;
  createTime: string;
  createName: string;
}

export interface TelegramPageReqType {
  pageNum: number;
  pageSize: number;
  id?: number;
  title?: string;
  type?: number;
  account?: string;
  isTop?: boolean;
  status?: boolean;
  startTime?: string;
  endTime?: string;
}

export interface TelegramFindReqType {
  id: string;
}

export interface TelegramFindRespType {
  code: number;
  msg: string;
  data: TelegramType;
}

// 分页查询电报频道/群组（列表页）
const TelegramPagePath = '/player/telegram/queryPage';
export const TelegramPage_Request = async (param: TelegramPageReqType): Promise<TelegramRespType> => {
  return (await axios.post(serverTarget + TelegramPagePath, param)).data;
};

// 根据id查询电报频道/群组（详情页）
const TelegramFindPath = '/player/telegram/find';
export const TelegramFind_Requset = async (param: TelegramFindReqType): Promise<TelegramFindRespType> => {
  return (await axios.post(serverTarget + TelegramFindPath, param)).data;
};
