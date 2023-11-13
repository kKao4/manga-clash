import { ChapterResponse } from "@/type";
import { DiscussionEmbed } from "disqus-react";
import { useRouter } from "next/router";

export default function Comments({ chapter }: { chapter: ChapterResponse }) {
  const router = useRouter()
  return (
    <article className="mt-8 disqus">
      <DiscussionEmbed
        shortname="manga-clash-disqus-com"
        config={
          {
            url: process.env.NEXT_PUBLIC_HOST_URL + router.asPath,
            identifier: chapter.data?.href + "-chapter-" + chapter.data?.chapter.num,
            title: chapter.data?.name + " - Chapter " + chapter.data?.chapter.num,
          }
        }
      />
    </article>
  )
}