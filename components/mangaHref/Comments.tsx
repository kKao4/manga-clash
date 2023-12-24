import { initialMangaState } from "@/features/mangaHref/MangaSlice";
import { DiscussionEmbed } from "disqus-react";
import { useRouter } from "next/router";
import Title from "../global/title/Title";
import { ForwardedRef, forwardRef } from "react";

const Comments = forwardRef(function Comments({ mangaState }: { mangaState: typeof initialMangaState[number] }, ref: ForwardedRef<HTMLDivElement>) {
  const router = useRouter()
  if (mangaState) {
    return (
      <div ref={ref} className="mb-4 scroll-mt-4">
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