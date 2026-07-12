"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { memo } from "react";
import ReactMarkdown, { type Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export type AIResponseProps = HTMLAttributes<HTMLDivElement> & {
  options?: Options;
  children: Options["children"];
};

const components: Options["components"] = {
  ol: ({ children, className, ...props }) => (
    <ol className={cn("ml-4 list-outside list-decimal space-y-1 my-2", className)} {...props}>
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }) => (
    <li className={cn("py-0.5", className)} {...props}>
      {children}
    </li>
  ),
  ul: ({ children, className, ...props }) => (
    <ul className={cn("ml-4 list-outside list-disc space-y-1 my-2", className)} {...props}> {/* FIX: list-disc */}
      {children}
    </ul>
  ),
  strong: ({ children, className, ...props }) => (
    <strong className={cn("font-semibold text-foreground", className)} {...props}>
      {children}
    </strong>
  ),
  a: ({ children, className, ...props }) => (
    <a
      className={cn("font-medium text-primary underline underline-offset-4", className)}
      rel="noreferrer"
      target="_blank"
      {...props}
    >
      {children}
    </a>
  ),
  
  table: ({ children, className, ...props }) => (
    <div className="my-4 w-full overflow-y-auto rounded-lg border border-border">
      <table className={cn("w-full border-collapse text-sm text-left", className)} {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, className, ...props }) => (
    <thead className={cn("bg-muted/60 text-muted-foreground font-medium border-b border-border", className)} {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, className, ...props }) => (
    <tbody className={cn("divide-y divide-border", className)} {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, className, ...props }) => (
    <tr className={cn("transition-colors hover:bg-muted/40", className)} {...props}>
      {children}
    </tr>
  ),
  th: ({ children, className, ...props }) => (
    <th className={cn("px-4 py-2.5 font-semibold text-foreground border-r border-border last:border-r-0", className)} {...props}>
      {children}
    </th>
  ),
  td: ({ children, className, ...props }) => (
    <td className={cn("px-4 py-2 border-r border-border last:border-r-0 align-middle font-normal", className)} {...props}>
      {children}
    </td>
  ),

  h1: ({ children, className, ...props }) => (
    <h1 className={cn("mt-6 mb-2 font-semibold text-3xl tracking-tight text-foreground", className)} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, className, ...props }) => (
    <h2 className={cn("mt-6 mb-2 font-semibold text-2xl tracking-tight text-foreground", className)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }) => (
    <h3 className={cn("mt-4 mb-2 font-semibold text-xl text-foreground", className)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, className, ...props }) => (
    <h4 className={cn("mt-4 mb-1 font-semibold text-lg text-foreground", className)} {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, className, ...props }) => (
    <h5 className={cn("mt-4 mb-1 font-semibold text-base text-foreground", className)} {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, className, ...props }) => (
    <h6 className={cn("mt-4 mb-1 font-semibold text-sm text-foreground", className)} {...props}>
      {children}
    </h6>
  ),
};

export const AIResponse = memo(
  ({ className, options, children, ...props }: AIResponseProps) => (
    <div
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 leading-relaxed",
        className,
      )}
      {...props}
    >
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]} 
      >
        {children}
      </ReactMarkdown>
    </div>
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

AIResponse.displayName = "AIResponse";