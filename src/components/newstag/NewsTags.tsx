import React from 'react';
import { Tag } from 'antd-mobile';
import { useState } from 'react';
import useStore from '@/zustand/store'; // 这里引入你的zustand store
import {enumMap} from '@/common/news'


const NewsTags: React.FC = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleTagClick = (key: string) => {
    setActiveTag(key);
  };

  return (
    <div className="news-tags">
      {Object.entries(enumMap).map(([key, value]) => (
        <div key={key} className={`news-tag ${activeTag === key ? 'active' : ''}`}>
          <Tag fill='outline' onClick={() => handleTagClick(key)}>
            {value.name}
          </Tag>
        </div>
      ))}
    </div>
  );
};

export default NewsTags;
