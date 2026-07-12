"use client";
import { ChatView } from "@/modules/chat/ui/views/chat-view";
import { use } from "react";

interface Props {
  searchParams: Promise<{
    user_id: string;
  }>
}

export default function Home({ searchParams }: Props) {
  const { user_id } = use(searchParams);

  return <ChatView user_id={user_id} />
}
