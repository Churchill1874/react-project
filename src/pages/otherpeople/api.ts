import axios from 'axios';
import { serverTarget } from '@/common/api';
import { Response } from '@/pages/personal/api';

export interface PlayerIdReqType {
  id: string;
}

//根据玩家id请求玩家信息
const findPlayerByIdPath = '/player/player/findPlayerById';
export const Request_FindPlayerById = async (param: PlayerIdReqType): Promise<Response> => {
  return (await axios.post(serverTarget + findPlayerByIdPath, param)).data;
};
