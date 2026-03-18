import axios from "axios";
import { serverTarget } from "@/common/api";

export interface ExposurePageReqType{
    pageNum: any;
    pageSize: any;
}

export interface ExposureResponseType{
    code: any;
    data: ExposurePageResponseType;
    msg: any;
}

export interface ExposurePageResponseType{
    current: any;
    pages: any;
    records: ExposureType[];
    searchCount: any;
    size: any;
    total: any;
}

export interface ExposureType {
    id: string; // Long → string（后端用了 ToStringSerializer）
    title: string;
    content: string;
    isTop: boolean;
    image1: string;
    username1: string;
    sound1: string;

    image2: string;
    username2: string;
    sound2: string;

    image3: string;
    username3: string;
    sound3: string;

    image4: string;
    username4: string;
    sound4: string;

    image5: string;
    username5: string;
    sound5: string;

    image6: string;
    username6: string;
    sound6: string;

    viewsCount: number;
    level: string;
    address: string;
    createTime: string;
    createName?: string;
}


export interface ExposureDetailResponseType{
    code: any;
    data: ExposureType;
    msg: any;
}
export interface ExposureDetailReqType{
    id: string | null;
}



const ExposurePagePath = '/player/exposure/queryPage';
export const Request_ExposurePage = async (param: ExposurePageReqType): Promise<ExposureResponseType> =>{
    return (await axios.post(serverTarget + ExposurePagePath, param)).data
}

const ExposureFindPath = '/player/exposure/findById';
export const Request_ExposureFind = async (param: ExposureDetailReqType): Promise<ExposureDetailResponseType> =>{
    return (await axios.post(serverTarget + ExposureFindPath, param)).data
}

