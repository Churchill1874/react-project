import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface TiebaType {
  /** 主键ID */
  id: any;
  /** 创建时间 */
  createTime: any;
  /** 创建人 */
  createName: any;
  /** 头像 */
  avatar: any;
  /** 玩家id */
  playerId: any;
  /** 玩家账号 */
  account: any;
  /** 标题 */
  title: any;
  /** 地址 */
  address: any;
  /** 等级 */
  level: any;
  /** 是否置顶 */
  isTop: any;
  /** 是否热门 */
  isHot: any;
  /** 内容 */
  content: any;
  /** 图片1 */
  image1: any;
  /** 图片2 */
  image2: any;
  /** 图片3 */
  image3: any;
  /** 图片4 */
  image4: any;
  /** 图片5 */
  image5: any;
  /** 图片6 */
  image6: any;
  /** 评论数量 */
  commentCount: any;
  /** 展示数量 */
  viewCount: any;
  /** 点赞数量 */
  likesCount: any;
  /** 最后一次评论时间 */
  lastCommentTime: any;
}

export interface PageRequestType {
  pageNum: any;
  pageSize: any;
  title: any;
}

interface PageResponseType {
  current?: any | null;
  pages?: any | null;
  records?: TiebaType[] | null;
  size?: any | null;
  total?: any | null;
}

export interface ResponseType {
  code: any;
  data: PageResponseType;
  msg: any;
}

//新闻分页查询
const TiebaPath = '/player/tieba/page';
export const Request_TiebaPage = async (page: PageRequestType): Promise<ResponseType> => {
  return (await axios.post(serverTarget + TiebaPath, page)).data;
};
