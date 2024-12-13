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
    city: any;//所在城市
    companyEventList: CompanyEvent[];
    createName: any;
    createTime: any;
    description: any;
    holiday: any;//休假情况
    name: any;//公司名称
    teamScale: any;//团队规模
    updateTime: any;//最后更新时间
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
    encapsulate: any;
    haveDetails: any;
    image: any;
}

const CompanyPagePath = '/player/company/queryPage';
export const Request_CompanyPage = async (param: CompanyPageReqType): Promise<CompanyResponseType> =>{
    return (await axios.post(serverTarget + CompanyPagePath, param)).data
}