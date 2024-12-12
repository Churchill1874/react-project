import axios from "axios";
import { serverTarget } from "@/common/api";

export interface CompanyPageReqType{
    pageNum: any;
    pageSize: any;
}

export interface CompanyResponseType{
    code: any;
    data: CompanyPageResponseType;
    msg: any;
}

export interface CompanyPageResponseType{
    current: any;
    pages: any;
    records: CompanyPageType[];
    searchCount: any;
    size: any;
    total: any;
}

export interface CompanyPageType{
    id: any;
    city: any;
    companyEventList: CompanyEvent[];
    createName: any;
    createTime: any;
    description: any;
    evaluate: any;
    holiday: any;
    logo: any;
    name: any;
    teamScale: any;
}

export interface CompanyEvent{
    id: any;
    companyId: any;
    createName: any;
    createTime: any;
    description: any;
    encapsulate: any;
    haveDetails: any;
    image: any;
}

const CompanyPagePath = '/player/company/queryPage';
export const Request_CompanyPage = async (param: CompanyPageReqType): Promise<CompanyResponseType> =>{
    return (await axios.post(serverTarget + CompanyPagePath, param)).data
}