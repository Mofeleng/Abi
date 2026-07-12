import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { atomFamily } from "jotai-family";
import { CHAT_SESSION_KEY } from "../constants";
import { ChatScreens } from "../types";

export const screenAtom = atom<ChatScreens>("loading");
export const errorMessageAtom = atom<string|null>(null);
export const userIdAtom = atom<string|null>(null);

export const chatSessionAtomFamily = atomFamily((userId: string) => 
    atomWithStorage<string|null>(`${CHAT_SESSION_KEY}_${userId}`, null)
)
export const loadingMessageAtom = atom<string|null>(null);
export const conversationIdAtom = atom<string|null>(null);