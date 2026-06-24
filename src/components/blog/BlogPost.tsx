import React, { useEffect } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { BlogPost as BlogPostType } from "../../blogData";

interface Props {
  post: BlogPostType;
}

export default function BlogPost({ post }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [post.slug]);

  const navigateToBlog = () => {
    window.history.pushState(null, "", `/blog`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const navigateToApp = () => {
    window.history.pushState(null, "", `/`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Article Header */}
      <div className="bg-neutral-50 border-b border-neutral-100 pt-16 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={navigateToBlog}
            className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-black transition-colors mb-10"
          >
            <ArrowLeft size={16} /> Back to Blog
          </button>
          
          <div className="flex items-center gap-3 text-sm text-neutral-500 mb-6 font-medium">
            <time>{post.date}</time>
            <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
            <span>{post.readTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight mb-8">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <article className="prose prose-lg prose-neutral max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600">
          <post.content />
        </article>

        {/* CTA Section */}
        <div className="mt-20 bg-neutral-900 rounded-3xl p-10 text-center text-white">
          <Sparkles className="w-10 h-10 mx-auto text-yellow-400 mb-6" />
          <h2 className="text-3xl font-black mb-4">Ready to optimize your documents?</h2>
          <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of users who trust our lightning-fast, secure PDF utility suite. Stop wrestling with files and start getting work done.
          </p>
          <button 
            onClick={navigateToApp}
            className="bg-white text-black font-bold py-4 px-8 rounded-xl hover:scale-105 transition-transform"
          >
            Open Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
