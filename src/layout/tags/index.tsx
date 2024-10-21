import { basicRoutes } from '@/router';
import type { RouteObject } from '@/router/types';
import { useAppDispatch, useAppSelector } from '@/stores';
import { addVisitedTags, closeAllTags, closeTagByKey, closeTagsByType } from '@/stores/modules/tags';
import { searchRoute } from '@/utils';
import { CloseOutlined, LeftOutlined, RedoOutlined, RightOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import classNames from 'classnames';
import { FC, useEffect, useRef, useState, WheelEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TagItem } from './components';
import styles from './index.module.less';

const TagsLayout: FC = () => {
  const items: MenuProps['items'] = [
    { key: 'left', label: '关闭左侧' },
    { key: 'right', label: '关闭右侧' },
    { key: 'other', label: '关闭其它' },
    { key: 'all', label: '关闭所有' },
  ];

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const visitedTags = useAppSelector((state) => state.tags.visitedTags);

  const tagsMain = useRef<HTMLDivElement>(null);
  const tagsMainCont = useRef<HTMLDivElement>(null);

  const [canMove, setCanMove] = useState(false);
  const [tagsContLeft, setTagsContLeft] = useState(0);
  const [activeTag, setActiveTag] = useState(pathname);

  const initAffixTags = (routes: RouteObject[], basePath: string = '/') => {
    let affixTags: RouteObject[] = [];
    for (const route of routes) {
      if (route.meta?.affix) {
        const fullPath = route.path!.startsWith('/') ? route.path : basePath + route.path;
        affixTags.push({ ...route, path: fullPath });
      }
      if (route.children && route.children.length) {
        affixTags = affixTags.concat(initAffixTags(route.children, route.path));
      }
    }
    return affixTags;
  };

  const moveToActiveTag = (tag: HTMLElement | null) => {
    if (!tag) return;

    const mainContPadding = 4;
    const mainWidth = tagsMain.current?.offsetWidth || 0;
    const mainContWidth = tagsMainCont.current?.offsetWidth || 0;

    let leftOffset: number = 0;

    if (mainContWidth < mainWidth) {
      leftOffset = 0;
    } else if (tag.offsetLeft < -tagsContLeft) {
      leftOffset = -tag.offsetLeft + mainContPadding;
    } else if (tag.offsetLeft > -tagsContLeft && tag.offsetLeft + tag.offsetWidth < -tagsContLeft + mainWidth) {
      leftOffset = Math.min(0, mainWidth - tag.offsetWidth - tag.offsetLeft - mainContPadding);
    } else {
      leftOffset = -(tag.offsetLeft - (mainWidth - mainContPadding - tag.offsetWidth));
    }
    setTagsContLeft(leftOffset);
  };

  useEffect(() => {
    const affixTags = initAffixTags(basicRoutes);
    affixTags.forEach((tag) => dispatch(addVisitedTags(tag)));
    const currRoute = searchRoute(pathname, basicRoutes);
    if (currRoute) {
      dispatch(addVisitedTags(currRoute));
    }
    setActiveTag(pathname);
  }, [pathname, dispatch]);

  useEffect(() => {
    const tagNodeList = tagsMainCont.current?.childNodes as NodeListOf<HTMLElement>;
    const activeTagNode = Array.from(tagNodeList).find((item) => item.dataset.path === activeTag) || null;
    moveToActiveTag(activeTagNode);
  }, [activeTag]);

  useEffect(() => {
    const mainWidth = tagsMain.current?.offsetWidth || 0;
    const mainContWidth = tagsMainCont.current?.offsetWidth || 0;

    setCanMove(mainContWidth > mainWidth);
  }, [visitedTags.length]);

  const handleMove = (offset: number) => {
    let leftOffset: number = 0;
    const mainWidth = tagsMain.current?.offsetWidth || 0;
    const mainContWidth = tagsMainCont.current?.offsetWidth || 0;

    if (offset > 0) {
      leftOffset = Math.min(0, tagsContLeft + offset);
    } else {
      if (mainWidth < mainContWidth) {
        if (tagsContLeft >= -(mainContWidth - mainWidth)) {
          leftOffset = Math.max(tagsContLeft + offset, mainWidth - mainContWidth);
        }
      } else {
        leftOffset = 0;
      }
    }
    setTagsContLeft(leftOffset);
  };

  const handleScroll = (e: WheelEvent) => {
    const distance = e.deltaY ? e.deltaY * 2 : -(e.detail || 0) * 2;
    handleMove(distance);
  };

  const handleCloseTag = (path: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(closeTagByKey(path)).then(({ payload }) => {
      const { tagIndex, tagsList } = payload;
      const tagLen = tagsList.length;

      if (path === activeTag) {
        const currTag = tagIndex < tagLen ? tagsList[tagIndex] : tagsList[tagLen - 1];
        navigate(currTag.fullPath);
      }
    });
  };

  const handleClickTag = (path: string) => {
    setActiveTag(path);
    navigate(path);
  };

  const getKey = () => {
    return Date.now().toString();
  };

  const handleReload = () => {
    const index = visitedTags.findIndex((tab: { fullPath: string }) => tab.fullPath === activeTag);
    if (index >= 0) {
      navigate(activeTag, { replace: true, state: { key: getKey() } });
    }
  };

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'all') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      dispatch(closeAllTags()).then(({ payload }) => {
        const lastTag = payload.slice(-1)[0];
        if (activeTag !== lastTag?.fullPath) {
          navigate(lastTag?.fullPath);
        }
      });
    } else {
      dispatch(closeTagsByType({ type: key, path: activeTag }));
    }
  };

  return (
    <div className={styles['layout_tags']}>
      {canMove && (
        <Button
          className={styles['layout_tags__btn']}
          icon={<LeftOutlined />}
          size="small"
          onClick={() => handleMove(200)}
        />
      )}
      <div ref={tagsMain} className={styles['layout_tags__main']} onWheel={handleScroll}>
        <div ref={tagsMainCont} className={styles['layout_tags__main-cont']} style={{ left: tagsContLeft + 'px' }}>
          {visitedTags.map((item: RouteObject) => {
            return (
              <span key={item.fullPath} data-path={item.fullPath}>
                <TagItem
                  name={item.meta?.title ?? ''}
                  active={activeTag === item.fullPath}
                  fixed={item.meta?.affix}
                  onClick={() => handleClickTag(item.fullPath as string)}
                  closeTag={() => handleCloseTag(item.fullPath as string)}
                />
              </span>
            );
          })}
        </div>
      </div>
      {canMove && (
        <Button
          className={styles['layout_tags__btn']}
          icon={<RightOutlined />}
          size="small"
          disabled={!canMove}
          onClick={() => handleMove(-200)}
        />
      )}
      <Button
        className={classNames(`${styles.layout_tags}__btn`, `${styles.layout_tags}__btn-space`)}
        icon={<RedoOutlined />}
        size="small"
        onClick={() => handleReload()}
      />
      <Dropdown menu={{ items, onClick }} placement="bottomLeft">
        <Button
          className={classNames(styles['layout_tags__btn'], styles['layout_tags__btn-space'])}
          icon={<CloseOutlined />}
          size="small"
        />
      </Dropdown>
    </div>
  );
};

export default TagsLayout;
