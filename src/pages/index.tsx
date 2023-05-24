import { type NextPage } from "next";
import { InfiniteTweetList } from "y/components/InfiniteTweetList";
import { NewTweetForm } from "y/components/NewTweetForm";
import { api } from "y/utils/api";

const Home: NextPage = () => {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
      </header>

      <NewTweetForm />
      <RecentTweets />
    </>
  );
};

function RecentTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const flattenedTweets = tweets.data?.pages.flatMap((page) => page.tweets);

  return (
    <InfiniteTweetList
      tweets={flattenedTweets}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

export default Home;
