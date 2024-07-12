import { useState, useEffect } from 'react';
import NewsRecord from '@/components/news/NewsRecord';
import { DotLoading, InfiniteScroll } from 'antd-mobile';
import { Request_NewsPage, NewsPageRequestType, NewsInfoType } from '@/pages/news/api';
import useStore from '@/zustand/store'



const NewsScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
        <>
            {hasMore ? (
                <>
                    <div className="dot-loading-custom" >
                        <span >Loading</span>
                        <DotLoading color='#fff'/>
                    </div>
                </>
            ) : (
                <span color='#fff'>--- 我是有底线的 ---</span>
            )}
        </>
    )
}

const NewsList: React.FC<any> = ({ newsTab }) => {
    const [newsType, setNewsType] = useState("1");
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1);//分页号码

    const { newsList, setNewsList,
        sportList, setSportList,
        entertainmentList, setEntertainmentList,
        militaryList, setMilitaryList,
        scienceList, setScienceList,
        favorList, setFavorList,
        netFriendList, setNetFriendList } = useStore();//新闻的全局变量

    // 模拟请求不同类型的新闻数据
    const reqNewsApi = async (categoryEnum: string, page: number) => {
        const pageReq: NewsPageRequestType = { pageNum: page, pageSize: 10, categoryEnum: categoryEnum };
        const newsListResp: NewsInfoType[] = (await Request_NewsPage(pageReq)).data.records || [];

        setHasMore(newsListResp.length > 0)

        //对比查询新闻的类型属于哪个类型数据 并且确认有新的数据返回才修改 全局的数据状态
        if (categoryEnum === '1' && newsListResp.length > 0) {//新闻
            setNewsList((prev: NewsInfoType[]) => [...prev, ...newsListResp]);
        }
        if (categoryEnum === '2' && newsListResp.length > 0) {//体育
            setSportList((prev) => [...prev, ...newsListResp]);
        }
        if (categoryEnum === '3' && newsListResp.length > 0) {//娱乐
            setEntertainmentList((prev) => [...prev, ...newsListResp]);
        }
        if (categoryEnum === '4' && newsListResp.length > 0) {//军事
            setMilitaryList((prev) => [...prev, ...newsListResp]);
        }
        if (categoryEnum === '5' && newsListResp.length > 0) {//科技
            setScienceList((prev) => [...prev, ...newsListResp]);
        }
        if (categoryEnum === '6' && newsListResp.length > 0) {//人情
            setFavorList((prev) => [...prev, ...newsListResp]);
        }
        if (categoryEnum === '7' && newsListResp.length > 0) {//网友
            setNetFriendList((prev) => [...prev, ...newsListResp]);
        }
    };

    //获取当前胶囊新闻类型所用的新闻数据状态
    const capsuleTabData = (): NewsInfoType[] => {
        if (newsTab === '1') {
            console.log(newsList)
            return newsList || [];
        }
        if (newsTab === '2') {
            return sportList || [];
        }
        if (newsTab === '3') {
            return entertainmentList || [];
        }
        if (newsTab === '4') {
            return militaryList || [];
        }
        if (newsTab === '5') {
            return scienceList || [];
        }
        if (newsTab === '6') {
            return favorList || [];
        }
        if (newsTab === '7') {
            return netFriendList || [];
        }
        return [];
    }

    const loadMore = () => {
        setPage((prev) => prev + 1);
        reqNewsApi(newsTab, page + 1);
    }

    
    return (
        <div className="outer-container">
            {capsuleTabData() && capsuleTabData()?.map((news, index) => (
                <NewsRecord
                    key={index}
                    title={news.title}
                    photoPath={news.photoPath}
                    likesCount={news.likesCount}
                    badCount={news.badCount}
                    commentsCount={news.commentsCount}
                    viewCount={news.viewCount}
                    createTime={news.createTime}
                />
            ))}
            <InfiniteScroll loadMore={()=>reqNewsApi(newsTab, page)} hasMore={hasMore}>
                <NewsScrollContent hasMore={hasMore} />
            </InfiniteScroll>
        </div>

    );
};

export default NewsList;
