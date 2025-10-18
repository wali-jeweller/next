"use client";

import { ContentBlock } from "@/db/schema";
import {
  Page,
  Header,
  Section,
  Grid,
  Content,
  CTA,
} from "@/components/web/page-layout";
import { Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ContentPreviewProps = {
  blocks: ContentBlock[];
  title?: string;
};

export function ContentPreview({ blocks }: ContentPreviewProps) {
  if (blocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <div className="text-center space-y-2 text-muted-foreground">
          <Text>No content to preview</Text>
          <Text className="text-sm">Add blocks to see the preview</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-full">
      <Page>
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </Page>
    </div>
  );
}

type BlockRendererProps = {
  block: ContentBlock;
};

function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case "header":
      return (
        <Header
          title={(block.data.title as string) || "Untitled"}
          subtitle={block.data.subtitle as string}
          description={block.data.description as string}
        />
      );

    case "section":
      return (
        <Section
          title={block.data.title as string}
          subtitle={block.data.subtitle as string}
          border={(block.data.border as "top" | "bottom" | "both" | "none") || "top"}
          spacing={(block.data.spacing as "normal" | "tight" | "loose") || "normal"}
        >
          {block.children && block.children.length > 0 ? (
            block.children.map((child) => (
              <BlockRenderer key={child.id} block={child} />
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Section content goes here
            </div>
          )}
        </Section>
      );

    case "grid":
      const items = (block.data.items as string)?.split("\n").filter(Boolean) || [];
      return (
        <Content>
          <Grid
            cols={(block.data.cols as 1 | 2 | 3 | 4 | 5) || 2}
            gap={(block.data.gap as "small" | "medium" | "large" | "none") || "medium"}
          >
            {items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={index}
                  className="p-6 border rounded-lg bg-card text-card-foreground"
                >
                  <Text>{item}</Text>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-muted-foreground text-sm border rounded-lg border-dashed">
                Add items to the grid (one per line)
              </div>
            )}
          </Grid>
        </Content>
      );

    case "text":
      const content = block.data.content as string;
      if (!content) {
        return (
          <Content>
            <div className="py-8 text-center text-muted-foreground text-sm border rounded-lg border-dashed">
              Add text content
            </div>
          </Content>
        );
      }
      return (
        <Content>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {content.split("\n").map((paragraph, index) => (
              <Text key={index} className="mb-4">
                {paragraph}
              </Text>
            ))}
          </div>
        </Content>
      );

    case "cta":
      const hasButton = block.data.buttonText && block.data.buttonLink;
      return (
        <CTA
          title={(block.data.title as string) || "Call to Action"}
          subtitle={block.data.subtitle as string}
          description={block.data.description as string}
        >
          {hasButton && (
            <Link href={block.data.buttonLink as string}>
              <Button size="lg">{block.data.buttonText as string}</Button>
            </Link>
          )}
        </CTA>
      );

    default:
      return (
        <Content>
          <div className="py-8 text-center text-muted-foreground text-sm border rounded-lg border-dashed">
            Unknown block type: {block.type}
          </div>
        </Content>
      );
  }
}
