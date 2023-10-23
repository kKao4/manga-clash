import { selectMangaState } from "@/features/mangaHref/MangaSlice";
import { RootState } from "@/store";
import { DiscussionEmbed } from "disqus-react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function Comments({ mangaId }: { mangaId: string }) {
  const router = useRouter()
  const mangaState = useSelector((state: RootState) => selectMangaState(state, mangaId))
  if (mangaState) {
    return (
      <DiscussionEmbed shortname="manga-clash-disqus-com" config={
        {
          url: process.env.NEXT_PUBLIC_HOST_URL + router.asPath,
          identifier: mangaState.href,
          title: mangaState.name,
        }
      } />
    )
  }
}