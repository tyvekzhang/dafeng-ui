import SvgIcon from '@/components/SvgIcon';
import { openWindow } from '@/utils';
import { Tooltip } from 'antd';

export default function GithubLink() {
  function openGithub() {
    openWindow('https://github.com/tyvekzhang/dafeng-ui');
  }

  return (
    <Tooltip title="github" placement="bottom" mouseEnterDelay={0.5}>
      <span className="icon-btn" onClick={openGithub}>
        <SvgIcon name="github" size={20} />
      </span>
    </Tooltip>
  );
}
