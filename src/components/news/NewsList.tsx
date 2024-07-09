import React from 'react';
import {NewsInfoType} from '@/pages/news/api'
import NewsRecord from '@/components/news/NewsRecord';

interface NewsListProps {
    newsData: NewsInfoType[] | null;
}

const NewsList: React.FC<NewsListProps> = ({ newsData }) => {
    return (
        <div className="outer-container">
            {newsData && newsData.map((news, index) => (
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
        </div>
    );
};

export default NewsList;
