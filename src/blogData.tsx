import React from "react";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: () => JSX.Element;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "welcome-to-trust-my-pdf",
    title: "Welcome to Trust My PDF",
    date: "June 24, 2026",
    readTime: "2 min read",
    excerpt: "Why we built the ultimate, lightning-fast PDF utility suite and what it means for your document workflow.",
    content: () => (
      <div className="space-y-6">
        <p>
          Welcome to <strong>Trust My PDF</strong>! We are incredibly excited to launch a brand new utility suite designed from the ground up to solve the most frustrating document management problems.
        </p>
        <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">Why another PDF tool?</h3>
        <p>
          We realized that while there are many PDF tools on the internet, most of them are heavily cluttered with ads, painfully slow, or extremely expensive. We wanted to build something that was blindingly fast, respected your privacy, and offered a beautifully clean interface.
        </p>
        <p>
          With our extensive 12-tool workspace, you can:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Merge & Split:</strong> Reorganize massive documents instantly.</li>
          <li><strong>Compress:</strong> Shrink file sizes dramatically without losing visual quality.</li>
          <li><strong>Protect & Unlock:</strong> Secure your sensitive data or remove annoying legacy passwords.</li>
          <li><strong>Edit & Sign:</strong> Make native modifications directly in the browser.</li>
        </ul>
        <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-4">What's Next?</h3>
        <p>
          We'll be using this blog to share in-depth guides, step-by-step tutorials (like how to remove passwords from bank statements), and updates on new features. Stay tuned!
        </p>
      </div>
    ),
  }
];
