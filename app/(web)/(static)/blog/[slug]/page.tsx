import { notFound } from "next/navigation";
import {
  Page,
  Header,
  Content,
  Section,
  Grid,
} from "@/components/web/page-layout";
import { H3, Text, Caption } from "@/components/ui/typography";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const getAllBlogPosts = async () => {
  const posts = [
    {
      id: "1",
      title: "Blog Post 1",
      slug: "blog-post-1",
      createdAt: new Date(),
      excerpt:
        "This is a sample blog post excerpt that provides a brief overview of the content.",
    },
    {
      id: "2",
      title: "Blog Post 2",
      slug: "blog-post-2",
      createdAt: new Date(),
      excerpt:
        "Another sample blog post with interesting content and insights to share.",
    },
    {
      id: "3",
      title: "Blog Post 3",
      slug: "blog-post-3",
      createdAt: new Date(),
      excerpt:
        "Exploring new trends and developments in the world of fashion and jewelry.",
    },
  ];
  return posts;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const posts = await getAllBlogPosts();
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  const recentPosts = posts.filter((recentPost) => recentPost.id !== post.id);

  return (
    <Page>
      <Header
        title={post.title}
        subtitle="Blog Post"
        description={
          post.createdAt &&
          `Published ${formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
          })}`
        }
      />

      <Content maxWidth="4xl">
        <Section spacing="tight">
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </Section>

        {/* Main Content Section */}
        <Section spacing="normal">
          <div className="prose prose-lg max-w-none">
            <Text className="text-lg leading-relaxed">
              This is where the main blog post content would go. The content
              would include paragraphs, headings, images, and other rich media
              elements that make up a complete blog post.
            </Text>

            <Text className="mt-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>

            <Text className="mt-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </Text>
          </div>
        </Section>

        {/* Recent Posts Section */}
        {recentPosts.length > 0 && (
          <Section
            title="Recent Posts"
            subtitle="Continue reading"
            border="top"
            spacing="normal"
          >
            <Grid cols={3} gap="medium">
              {recentPosts.slice(0, 3).map((recentPost) => (
                <Link
                  key={recentPost.id}
                  href={`/blog/${recentPost.slug}`}
                  className="group block"
                >
                  <Card className="h-full hover:border-border transition-colors group-hover:shadow-md">
                    <CardHeader>
                      <H3 className="group-hover:text-foreground transition-colors">
                        {recentPost.title}
                      </H3>
                      <Caption>
                        {recentPost.createdAt &&
                          formatDistanceToNow(new Date(recentPost.createdAt), {
                            addSuffix: true,
                          })}
                      </Caption>
                    </CardHeader>
                    <CardContent>
                      <Text className="text-muted-foreground line-clamp-3 text-sm mb-4">
                        {recentPost.excerpt}
                      </Text>
                      <div className="inline-flex items-center gap-1 text-foreground/70 group-hover:text-foreground transition-colors text-sm">
                        Read more
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Grid>
          </Section>
        )}
      </Content>
    </Page>
  );
}
