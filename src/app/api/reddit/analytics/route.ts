import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { accessToken, username } = await request.json();

    if (!accessToken || !username) {
      return NextResponse.json(
        { error: "Access token and username are required" },
        { status: 400 },
      );
    }

    // Fetch user info from Reddit API
    const userResponse = await fetch("https://oauth.reddit.com/api/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Ocera/1.0.0",
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data from Reddit");
    }

    const userData = await userResponse.json();

    // Fetch user's posts
    const postsResponse = await fetch(
      `https://oauth.reddit.com/user/${username}/submitted?limit=25`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "Ocera/1.0.0",
        },
      },
    );

    let recentPosts = [];
    let totalKarma = userData.link_karma + userData.comment_karma;

    if (postsResponse.ok) {
      const postsData = await postsResponse.json();
      recentPosts = postsData.data.children.map((post: any) => ({
        id: post.data.id,
        title: post.data.title,
        subreddit: `r/${post.data.subreddit}`,
        karma: post.data.score,
        comments: post.data.num_comments,
        status: "published",
        publishedAt: new Date(
          post.data.created_utc * 1000,
        ).toLocaleDateString(),
        url: `https://reddit.com${post.data.permalink}`,
      }));
    }

    // Calculate stats
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const postsThisMonth = recentPosts.filter((post: any) => {
      const postDate = new Date(post.publishedAt);
      return (
        postDate.getMonth() === currentMonth &&
        postDate.getFullYear() === currentYear
      );
    }).length;

    const totalViews = recentPosts.reduce(
      (sum: number, post: any) => sum + post.karma * 10,
      0,
    ); // Estimate views
    const avgKarma =
      recentPosts.length > 0
        ? recentPosts.reduce((sum: number, post: any) => sum + post.karma, 0) /
          recentPosts.length
        : 0;
    const successRate =
      recentPosts.length > 0
        ? (recentPosts.filter((post: any) => post.karma > 10).length /
            recentPosts.length) *
          100
        : 0;
    const engagementRate =
      recentPosts.length > 0
        ? recentPosts.reduce(
            (sum: number, post: any) => sum + post.comments,
            0,
          ) / recentPosts.length
        : 0;

    const stats = {
      postsThisMonth,
      totalKarma,
      scheduledPosts: 0, // This would come from your database
      successRate: Math.round(successRate),
      totalViews,
      engagementRate: Math.round(engagementRate * 10) / 10,
    };

    return NextResponse.json({
      stats,
      recentPosts: recentPosts.slice(0, 10),
      userData: {
        username: userData.name,
        karma: totalKarma,
        created: new Date(userData.created_utc * 1000).toLocaleDateString(),
      },
    });
  } catch (error) {
    console.error("Error fetching Reddit analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch Reddit analytics" },
      { status: 500 },
    );
  }
}
