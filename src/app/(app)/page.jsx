import { prisma } from "@/utils/prisma";
import PostCard from "./post-creation/_components/PostCard";

export default async function HomePage() {
  let posts = [];
  try {
    posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        category: true,
        votes: true,
        comments: true,
      },
    });
    posts = posts.map((post) => {
      const postForClient = {
        ...post,
        price: post.price.toString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      };

      if (post.user) {
        postForClient.user = {
          id: post.user.id,
          email: post.user.email,
          name: post.user.name,
          avatarUrl: post.user.avatarUrl,
        };
      } else {
        postForClient.user = null;
      }

      if (post.category) {
        postForClient.category = {
          id: post.category.id,
          name: post.category.name,
          slug: post.category.slug,
        };
      } else {
        postForClient.category = null;
      }

      // Include votes and comments in the client object
      postForClient.votes = post.votes || [];
      postForClient.comments = post.comments || [];

      return postForClient;
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <div className="card min-h-screen flex flex-col justify-center items-center w-full mx-auto">
      {/* <div className="px-16 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Welcome to Think Twice
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-prose">
          Your platform to discuss products before you make a decision to buy or
          skip.
        </p>
        <Button size="lg" asChild>
          <Link href="/post-creation">Create a New Post</Link>
        </Button>
      </div> */}

      <section className="w-full space-y-2 mt-14">
        {posts.length > 0 &&
          posts.map((singlePost) => (
            <PostCard key={singlePost.id} post={singlePost} />
          ))}
        <div className="text-center text-gray-400 mt-8 my-4">
          <p>You've reached the end of the posts</p>
        </div>
      </section>
    </div>
  );
}
