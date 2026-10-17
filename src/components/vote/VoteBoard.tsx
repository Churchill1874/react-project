import { useEffect, useMemo, useState } from 'react';
import { Button, Image, ImageViewer, Toast } from 'antd-mobile';
import { CheckCircleFill } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import { VoteType, VoteSubmit_Request, votePercent } from '@/components/vote/api';
import { getImgUrl } from '@/utils/commentUtils';
import useStore from '@/zustand/store';
import '@/components/vote/Vote.less';

type Props = {
  vote: VoteType;
  onVoted: (vote: VoteType) => void; // 投票成功后返回最新数据
};

// 投票选项 + 结果条 + 投票按钮
const VoteBoard: React.FC<Props> = ({ vote, onVoted }) => {
  const navigate = useNavigate();
  const tokenId = useStore((s) => s.tokenId);

  const myIds = useMemo(() => (vote.myOptionIds || []).map(String), [vote.myOptionIds]);
  const [selected, setSelected] = useState<string[]>(myIds);
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();

  useEffect(() => {
    setSelected(myIds);
  }, [myIds]);

  const hasVoted = myIds.length > 0;
  const sameAsMine = selected.length === myIds.length && selected.every((id) => myIds.includes(id));

  // 当前领先的票数，用来高亮第一名
  const maxCount = Math.max(0, ...vote.options.map((o) => o.voteCount || 0));

  const toggle = (optionId: string) => {
    if (vote.ended) return;
    if (vote.multiSelect) {
      setSelected((prev) => (prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]));
    } else {
      setSelected([optionId]);
    }
  };

  const submit = async () => {
    if (!tokenId) {
      Toast.show({ content: '登录后才能投票' });
      navigate('/login');
      return;
    }
    if (selected.length === 0) {
      Toast.show({ content: '请先选择选项' });
      return;
    }
    setSubmitting(true);
    try {
      const resp = await VoteSubmit_Request({ voteId: vote.id, optionIds: selected });
      if (resp.code === 0 && resp.data) {
        Toast.show({ icon: 'success', content: hasVoted ? '改票成功' : '投票成功' });
        onVoted(resp.data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  let buttonText = hasVoted ? '确认改票' : '投 票';
  if (vote.ended) buttonText = '投票已截止';
  else if (hasVoted && sameAsMine) buttonText = '已投票（可重新选择后改票）';

  return (
    <div className="vote-board">
      <div className="vote-board-tip">
        {vote.multiSelect ? '多选' : '单选'}
        {!vote.ended && (hasVoted ? ' · 截止前可以改票' : ' · 选择后点击投票')}
      </div>

      {vote.options.map((option) => {
        const id = String(option.id);
        const isSelected = selected.includes(id);
        const isMine = myIds.includes(id);
        const percent = votePercent(option.voteCount, vote.voterCount);
        const isLeading = maxCount > 0 && option.voteCount === maxCount;

        return (
          <div
            key={id}
            className={`vote-option ${isSelected ? 'selected' : ''} ${vote.ended ? 'disabled' : ''}`}
            onClick={() => toggle(id)}
          >
            {/* 结果进度条（底层） */}
            <div className={`vote-option-bar ${isLeading ? 'leading' : ''}`} style={{ width: `${Math.min(percent, 100)}%` }} />

            <div className="vote-option-inner">
              {option.imagePath && (
                <div
                  className="vote-option-image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage(getImgUrl(option.imagePath));
                  }}
                >
                  <Image src={getImgUrl(option.imagePath)} alt={option.content} fit="cover" width={52} height={52} />
                </div>
              )}

              <div className="vote-option-text">
                <div className="vote-option-content">
                  {option.content}
                  {isMine && <span className="vote-option-mine">我的选择</span>}
                </div>
                <div className="vote-option-stat">
                  {option.voteCount || 0} 票 · {percent}%
                </div>
              </div>

              <div className={`vote-option-check ${vote.multiSelect ? 'square' : ''}`}>
                {isSelected && <CheckCircleFill fontSize={20} color="#1677ff" />}
              </div>
            </div>
          </div>
        );
      })}

      <Button
        block
        color="primary"
        shape="rounded"
        className="vote-submit"
        loading={submitting}
        disabled={vote.ended || selected.length === 0 || (hasVoted && sameAsMine)}
        onClick={submit}
      >
        {buttonText}
      </Button>

      <ImageViewer image={previewImage} visible={!!previewImage} onClose={() => setPreviewImage(undefined)} />
    </div>
  );
};

export default VoteBoard;
