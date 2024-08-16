import axios from 'axios';
import { serverTarget } from '@/common/api';

export interface JobType {
  ageConditions: string;
  city: string;
  companyEncapsulate: string;
  companyName: string;
  createName: string;
  createTime: string;
  educationConditions: string;
  environment: string;
  holiday: string;
  id: number;
  image: string;
  lastTime: string;
  name: string;
  room: string;
  roomOut: string;
  salaryRange: string;
  skillConditions: string;
  teamScale: string;
  welfare: string;
  contact: string;
  tag: string;
  annualLeave: string;
  project: string;
}

interface PageType{
  current?: any | null;
  pages?: any | null;
  records?: JobType[] | null;
  size? : any | null;
  total? : any | null;
}

interface PageResponseType{
  msg: string;
  code: number;
  data: PageType;
}

export interface PageReqType {
  pageNum: any;
  pageSize: any;
}


const JobPagePath = "/player/job/queryPage";
export const Request_JobPage = async (pageReq: PageReqType): Promise<PageResponseType> => {
  return (await axios.post(serverTarget + JobPagePath, pageReq)).data;
};
