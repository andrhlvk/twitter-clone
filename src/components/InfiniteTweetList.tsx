type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: {
    id: string;
    image: string | null;
    name: string | null;
  };
};

type Props = {
  isError: boolean;
  isLoading: boolean;
  hasMore?: boolean;
  fetchNewTweets: () => Promise<unknown>;
  tweets?: Tweet[];
};

export const InfiniteTweetList = (props: Props) => {
  const { isLoading, isError, hasMore, fetchNewTweets, tweets } = props;

  if (isLoading) {
    return <h1>loading...</h1>;
  }

  if (isError) {
    return <h1>error</h1>;
  }

  if (tweets == null) {
    return null;
  }

  if (!tweets || tweets.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No Tweets</h2>
    );
  }

  return <ul>{/* react-infinite-scroll-component */}</ul>;
};
