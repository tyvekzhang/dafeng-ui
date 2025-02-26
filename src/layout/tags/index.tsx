import { basicRoutes } from "@/router"
import type { RouteObject } from "@/router/types"
import { useAppDispatch, useAppSelector } from "@/stores"
import { addVisitedTags, closeAllTags, closeTagByKey, closeTagsByType } from "@/stores/modules/tags"
import { searchRoute } from "@/utils"
import { type FC, useEffect, useRef, useState, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import TagItem from "./components/TagItem"

const TagsLayout: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const visitedTags = useAppSelector((state) => state.tags.visitedTags)

  const tagsMain = useRef<HTMLDivElement>(null)
  const tagsMainCont = useRef<HTMLDivElement>(null)

  const [tagsContLeft, setTagsContLeft] = useState(0)
  const [activeTag, setActiveTag] = useState(pathname)

  const initAffixTags = useCallback((routes: RouteObject[], basePath = "/") => {
    let affixTags: RouteObject[] = []
    for (const route of routes) {
      if (route.meta?.affix) {
        const fullPath = route.path!.startsWith("/") ? route.path : basePath + route.path
        affixTags.push({ ...route, path: fullPath })
      }
      if (route.children && route.children.length) {
        affixTags = affixTags.concat(initAffixTags(route.children, route.path))
      }
    }
    return affixTags
  }, [])

  const moveToActiveTag = useCallback(
    (tag: HTMLElement | null) => {
      if (!tag) return

      const mainContPadding = 4
      const mainWidth = tagsMain.current?.offsetWidth || 0
      const mainContWidth = tagsMainCont.current?.offsetWidth || 0

      let leftOffset: number

      if (mainContWidth < mainWidth) {
        leftOffset = 0
      } else if (tag.offsetLeft < -tagsContLeft) {
        leftOffset = -tag.offsetLeft + mainContPadding
      } else if (tag.offsetLeft > -tagsContLeft && tag.offsetLeft + tag.offsetWidth < -tagsContLeft + mainWidth) {
        leftOffset = Math.min(0, mainWidth - tag.offsetWidth - tag.offsetLeft - mainContPadding)
      } else {
        leftOffset = -(tag.offsetLeft - (mainWidth - mainContPadding - tag.offsetWidth))
      }
      setTagsContLeft(leftOffset)
    },
    [tagsContLeft],
  )

  useEffect(() => {
    const affixTags = initAffixTags(basicRoutes)
    affixTags.forEach((tag) => dispatch(addVisitedTags(tag)))
    const currRoute = searchRoute(pathname, basicRoutes)
    if (currRoute) {
      dispatch(addVisitedTags(currRoute))
    }
    setActiveTag(pathname)
  }, [pathname, dispatch, initAffixTags])

  useEffect(() => {
    const tagNodeList = tagsMainCont.current?.childNodes as NodeListOf<HTMLElement>
    const activeTagNode = Array.from(tagNodeList).find((item) => item.dataset.path === activeTag) || null
    moveToActiveTag(activeTagNode)
  }, [activeTag, moveToActiveTag])

  const handleCloseTag = useCallback((path: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(closeTagByKey(path)).then((action) => {
      if (action.payload) {
        const { tagIndex, tagsList } = action.payload
        const tagLen = tagsList.length

        if (path === activeTag) {
          const currTag = tagIndex < tagLen ? tagsList[tagIndex] : tagsList[tagLen - 1]
          navigate(currTag.fullPath)
        }
      }
    })
  }, [dispatch, navigate, activeTag])

  const handleClickTag = useCallback((path: string) => {
    setActiveTag(path)
    navigate(path)
  }, [navigate])

  const handleReload = useCallback((fullPath: string) => {
    navigate(fullPath, { replace: true, state: { key: Date.now().toString() } })
  }, [navigate])

  const handleCloseOthers = useCallback((path: string) => {
    dispatch(closeTagsByType({ type: "other", path }))
  }, [dispatch])

  const handleCloseLeft = useCallback((path: string) => {
    dispatch(closeTagsByType({ type: "left", path }))
  }, [dispatch])

  const handleCloseRight = useCallback((path: string) => {
    dispatch(closeTagsByType({ type: "right", path }))
  }, [dispatch])

  const handleCloseAll = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(closeAllTags()).then((action) => {
      if (action.payload) {
        const lastTag = action.payload.slice(-1)[0]
        if (activeTag !== lastTag?.fullPath) {
          navigate(lastTag?.fullPath)
        }
      }
    })
  }, [dispatch, navigate, activeTag])

  const tagItems = visitedTags.map((item: RouteObject, index: number) => (
    <span className={"inline-block h-full"} key={item.fullPath} data-path={item.fullPath}>
      <TagItem
        name={item.meta?.title ?? "默认"}
        fixed={item.meta?.affix}
        active={activeTag === item.fullPath}
        isFirst={index === 0}
        isLast={index === visitedTags.length - 1}
        id={item.fullPath as string}
        onClick={() => handleClickTag(item.fullPath as string)}
        closeTag={() => handleCloseTag(item.fullPath as string)}
        onCloseOthers={() => handleCloseOthers(item.fullPath as string)}
        onCloseLeft={() => handleCloseLeft(item.fullPath as string)}
        onCloseRight={() => handleCloseRight(item.fullPath as string)}
        onCloseAll={handleCloseAll}
        onRefresh={() => handleReload(item.fullPath as string)}
      />
    </span>
  ));

  return (
    <div>
      <div ref={tagsMain}>
        <div ref={tagsMainCont} className="h-8 bg-white border-b pl-4 py-0.5">
          {tagItems}
        </div>
      </div>
    </div>
  )
}

export default TagsLayout
