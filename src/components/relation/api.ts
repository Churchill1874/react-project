import axios from 'axios';
import { serverTarget } from '@/common/api';

//分页返回数据
interface PageResponseType {
  current?: any | null;
  pages?: any | null;
  records?: RelationType[] | null;
  size?: any | null;
  total?: any | null;
}

export interface RelationType {
  id: string;
  name: string;
  account: string;
  gender: number;
  city: string;
  level: number;
  avatarPath: number;
  createTime: string;
  collected: boolean;
}

//点赞记录响应结构
export interface RelationPageRespType {
  code: number;
  msg: string;
  data: PageResponseType;
}

export interface RelationRespType {
  code: number;
  msg: string;
  data: any;
}

//粉丝分页接口
const FollowersPagePath = '/player/relation/pageTargetPlayerId';
export const Req_FollowersPage = async (param: any): Promise<RelationPageRespType> => {
  return (await axios.post(serverTarget + FollowersPagePath, param)).data;
};

//关注分页接口
const CollectPagePath = '/player/relation/pagePlayerId';
export const Req_CollectPage = async (param: any): Promise<RelationPageRespType> => {
  return (await axios.post(serverTarget + CollectPagePath, param)).data;
};

//删除关系
const DeletePath = '/player/relation/delete';
export const Req_Delete = async (param: any): Promise<RelationRespType> => {
  return (await axios.post(serverTarget + DeletePath, param)).data;
};

//添加关系
const AddPath = '/player/relation/add';
export const Req_Add = async (param: any): Promise<RelationRespType> => {
  return (await axios.post(serverTarget + AddPath, param)).data;
};
