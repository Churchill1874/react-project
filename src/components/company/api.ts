import axios from "axios";
import { serverTarget } from "@/common/api";

export interface CompanyPageReqType{
    pageNum: any;
    pageSize: any;
}

export interface CompanyDetailReqType{
    id: string | null;
}

export interface CompanyResponseType{
    code: any;
    data: CompanyPageResponseType;
    msg: any;
}

export interface CompanyDetailResponseType{
    code: any;
    data: CompanyPageType;
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
    city: any;//所在城市
    companyEventList: CompanyEvent[];
    createName: any;
    createTime: any;
    description: any;
    holiday: any;//休假情况
    name: any;//公司名称
    teamScale: any;//团队规模
    updateTime: any;//最后更新
    salaryRange: any;//薪资范围
    leadershipCharacter: any;//领导性格
    live: any;//居住环境
    officeEnvironment: any;//办公环境
    overtimeCompensation: any;//加班补贴
    bonus: any;//奖金情况
    image?: string;//图片

}

export interface CompanyEvent{
    id: any;
    companyId: any;
    createName: any;
    createTime: any;
    description: any;
    image: any;
    eventDate: any;
}

const CompanyPagePath = '/player/company/queryPage';
export const Request_CompanyPage = async (param: CompanyPageReqType): Promise<CompanyResponseType> =>{
    return (await axios.post(serverTarget + CompanyPagePath, param)).data
}

const CompanyFindPath = '/player/company/findById';
export const Request_CompanyFind = async (param: CompanyDetailReqType): Promise<CompanyDetailResponseType> =>{
    return (await axios.post(serverTarget + CompanyFindPath, param)).data
}
