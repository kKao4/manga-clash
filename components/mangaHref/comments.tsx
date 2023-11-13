import { initialMangaState, selectMangaState } from "@/features/mangaHref/MangaSlice";
import { RootState } from "@/store";
import { DiscussionEmbed } from "disqus-react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Title from "../global/title";
import { forwardRef } from "react";

const Comments = forwardRef(function Comments({ mangaState }: { mangaState: typeof initialMangaState[number] }, ref: any) {
  const router = useRouter()
  if (mangaState) {
    return (
      <div ref={ref} className="mb-4">
        <Title content="BÌNH LUẬN" order={false} />
        <div className="mt-8">
          <DiscussionEmbed shortname="manga-clash-disqus-com" config={
            {
              url: process.env.NEXT_PUBLIC_HOST_URL + router.asPath,
              identifier: mangaState.href,
              title: mangaState.name,
            }
          } />
        </div>
      </div>
    )
  }
})

export default Comments