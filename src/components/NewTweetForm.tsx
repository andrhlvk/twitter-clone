import { useSession } from "next-auth/react";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { FormEvent } from "react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import { api } from "y/utils/api";

const updateTextAreaHeight = (textArea?: HTMLTextAreaElement) => {
  if (textArea == null) return;

  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
};

const Form = () => {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaHeight(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaHeight(textAreaRef.current);
  }, [inputValue]);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: () => {
      setInputValue("");
    },
  });

  if (session.status !== "authenticated") return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createTweet.mutate({ content: inputValue });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b px-4 py-2"
    >
      <div className="flex gap-4">
        <ProfileImage src={session.data.user.image} />
        <textarea
          ref={inputRef}
          placeholder="What's happening?"
          style={{ height: 0 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="transition-height flex-grow resize-none overflow-hidden p-4 text-lg outline-none duration-100 ease-in-out"
        ></textarea>
      </div>
      <Button className="self-end">Tweet</Button>
    </form>
  );
};

export const NewTweetForm = () => {
  const session = useSession();

  if (session.status !== "authenticated") return null;

  return <Form />;
};
