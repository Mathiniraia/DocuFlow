import React from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "../../blogData";

export default function BlogList() {
  const navigateTo = (slug: string) => {
    window.history.pushState(null, "", `/blog/${slug}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="bg-neutral-50 border-b border-neutral-100 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-600 mb-6 shadow-sm">
            <BookOpen size={16} /> Resources & Guides
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-6">
            Trust My PDF Blog
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Tips, tutorials, and deep dives on how to manage, secure, and edit your documents faster.
          </p>
        </div>
      </div>

      {/* Post Grid */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.slug}
              onClick={() => navigateTo(post.slug)}
              className="group cursor-pointer flex flex-col items-start bg-white border border-neutral-200 rounded-2xl p-8 hover:border-black hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4 font-medium">
                <time>{post.date}</time>
                <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-8 flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 mt-auto">
                Read Article
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
