import React from 'react';
import NewsRecord, { NewsRecordType } from '@/components/news/NewsRecord';

interface NewsListProps {
    newsData: NewsRecordType[];
}

const NewsList: React.FC<NewsListProps> = ({ newsData }) => {
    return (
        <div className="outer-container">
            {newsData.map((news, index) => (
                <NewsRecord
                    key={index}
                    title={news.title}
                    images={news.images}
                    likes={news.likes}
                    badCount={news.badCount}
                    comments={news.comments}
                    views={news.views}
                />
            ))}
        </div>
    );
};

export default NewsList;
