import axios from 'axios';
import { serverTarget } from '@/common/api';


export interface ScrollNewsResp {
  code: number;
  msg: string;
  data: string[];
}

export interface OnlineCountResp {
  code: number;
  msg: string;
  data: number;
}

const ScrollNewsPath = '/player/chatRoom/scrollingText';
export const Request_ScrollingText = async (): Promise<ScrollNewsResp> => {
  return (await axios.post(serverTarget + ScrollNewsPath)).data;
};

const OnlineCountPath = '/player/player/onlineCount';
export const Request_OnlineCount = async (): Promise<OnlineCountResp> => {
  return (await axios.post(serverTarget + OnlineCountPath)).data;
};
