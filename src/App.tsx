/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Layers, Scissors, FileImage, Trash2, RotateCw, 
  Minimize2, Shield, Gem, HelpCircle, Check, Sparkles, 
  ChevronDown, ChevronRight, Info, Clock, AlertTriangle, 
  ShieldCheck, Heart, ExternalLink, ArrowRight, FileText, 
  Compass, ArrowLeft, RefreshCw
} from "lucide-react";
import { TOOLS } from "./toolsData";
import { ToolDefinition } from "./types";
import ToolWorkspace from "./components/tools/ToolWorkspace";
import PaywallModal from "./components/payment/PaywallModal";

export default function App() {
  // Custom router state
  const [currentSlug, setCurrentSlug] = useState<string>("");
  
  // Paywall states
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [premiumPlanName, setPremiumPlanName] = useState("");

  // FAQ Accordion states
  const [activeFaqIndices, setActiveFaqIndices] = useState<number[]>([]);

  // Monitor path name for dynamic route mapping
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/^\//, "");
      // If valid slug fits, set it, else empty (home screen)
      const exists = TOOLS.some(t => t.slug === path);
      if (exists) {
        setCurrentSlug(path);
      } else {
        setCurrentSlug("");
      }
    };

    // Initial check
    handleLocationChange();

    // Listen to popstate
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  // Update dynamic route slug cleanly without refreshing
  const navigateToSlug = (slug: string) => {
    const targetPath = slug ? `/${slug}` : "/";
    window.history.pushState(null, "", targetPath);
    // Dispatch fake popstate for trigger
    window.dispatchEvent(new PopStateEvent("popstate"));
    // Scroll to workspace on change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // LOCAL STORAGE DAILY ATTEMPTS HANDLER
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const rawUsage = localStorage.getItem("pdf_app_usage");
    
    if (rawUsage) {
      try {
        const parsed = JSON.parse(rawUsage);
        if (parsed.unlocked) {
          setPremiumUnlocked(true);
          setPremiumPlanName(parsed.plan || "Premium Pass");
        }
        
        if (parsed.date === todayStr) {
          setUsageCount(parsed.count || 0);
        } else {
          // New day, reset counter
          const initData = { date: todayStr, count: 0, unlocked: parsed.unlocked, plan: parsed.plan };
          localStorage.setItem("pdf_app_usage", JSON.stringify(initData));
          setUsageCount(0);
        }
      } catch (e) {
        // Corrupt storage reset
        const initData = { date: todayStr, count: 0, unlocked: false };
        localStorage.setItem("pdf_app_usage", JSON.stringify(initData));
      }
    } else {
      const initData = { date: todayStr, count: 0, unlocked: false };
      localStorage.setItem("pdf_app_usage", JSON.stringify(initData));
    }
  }, []);

  // Check and increment attempt logic
  const handleUsageIncrement = (): boolean => {
    if (premiumUnlocked) return true; // unlimited access

    const todayStr = new Date().toISOString().split("T")[0];
    const rawUsage = localStorage.getItem("pdf_app_usage");
    let currentData = { date: todayStr, count: 0, unlocked: false, plan: "" };

    if (rawUsage) {
      try {
        currentData = JSON.parse(rawUsage);
      } catch (e) { }
    }

    // Intercept on 3rd attempt
    if (currentData.count >= 3) {
      setIsPaywallOpen(true);
      return false; // blocked
    }

    // Increment
    const updatedCount = currentData.count + 1;
    currentData.count = updatedCount;
    currentData.date = todayStr;
    localStorage.setItem("pdf_app_usage", JSON.stringify(currentData));
    setUsageCount(updatedCount);

    // If they just reached 3, open modal proactively to upgrade but let the current compilation process completed successfully
    if (updatedCount >= 3) {
      setTimeout(() => {
        setIsPaywallOpen(true);
      }, 800);
    }

    return true; // allowed
  };

  // Callback on successful checkout payment
  const handlePaymentSuccessUnlock = (planId: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const rawUsage = localStorage.getItem("pdf_app_usage");
    let currentData = { date: todayStr, count: 0, unlocked: true, plan: planId };

    if (rawUsage) {
      try {
        currentData = JSON.parse(rawUsage);
      } catch (e) { }
    }

    const planNameLabel = planId === "daily" ? "Daily Pass" : planId === "weekly" ? "Weekly Pass" : "Monthly Pro";
    currentData.unlocked = true;
    currentData.plan = planNameLabel;
    localStorage.setItem("pdf_app_usage", JSON.stringify(currentData));
    
    setPremiumUnlocked(true);
    setPremiumPlanName(planNameLabel);
    setIsPaywallOpen(false);
  };

  // Reset/Revoke Premium license for testing
  const resetPremiumLicenseForDemo = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const initData = { date: todayStr, count: 0, unlocked: false };
    localStorage.setItem("pdf_app_usage", JSON.stringify(initData));
    setPremiumUnlocked(false);
    setPremiumPlanName("");
    setUsageCount(0);
  };

  // Find active tool
  const currentTool = TOOLS.find(t => t.slug === currentSlug);

  const toggleFaq = (idx: number) => {
    setActiveFaqIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans flex flex-col justify-between selection:bg-neutral-900 selection:text-white" id="main_app_canvas">
      
      {/* 1. TOP PREMIUM NAV HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 flex-shrink-0" id="navigation_header_desk">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          
          {/* Logo Interface */}
          <button 
            onClick={() => navigateToSlug("")}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
            id="logo_brand_btn"
          >
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 duration-200">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-neutral-900 block leading-tight">PDFKit India</span>
              <span className="text-[9px] text-neutral-400 font-medium font-mono uppercase block tracking-wider -mt-[1px]">0% Server Compute</span>
            </div>
          </button>

          {/* User limit states / Billing interface */}
          <div className="flex items-center gap-4">
            {premiumUnlocked ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 shadow-2xs font-mono">
                <Sparkles size={12} className="text-emerald-600 animate-pulse" /> {premiumPlanName} Active
              </span>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                  Daily Free Limit Qty: <strong className="text-neutral-700 font-bold">{usageCount}/3</strong>
                </span>
                
                <button
                  onClick={() => setIsPaywallOpen(true)}
                  className="bg-black hover:bg-neutral-800 text-white px-5 py-2 rounded-full text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  id="checkout_nav_trigger"
                >
                  Upgrade to Pro
                </button>
              </div>
            )}

            {/* Hidden admin testing restorer */}
            <button 
              onClick={resetPremiumLicenseForDemo}
              title="Reset Usage limits for testing"
              className="p-1 hover:bg-neutral-100 text-neutral-300 hover:text-red-400 rounded transition"
            >
              <RefreshCw size={11} />
            </button>
          </div>

        </div>
      </header>

      {/* DYNAMIC SCROLLABLE SUB-NAVIGATION STRIP */}
      <div className="sticky top-16 z-30 flex-shrink-0 h-12 bg-white border-b border-neutral-200 overflow-x-auto select-none no-scrollbar" id="sub_navigation_toolbar">
        <div className="max-w-7xl mx-auto px-8 flex h-full items-center gap-8">
          <button 
            onClick={() => navigateToSlug("")} 
            className={`tool-link py-3 cursor-pointer h-full flex items-center border-b-2 border-transparent hover:text-neutral-900 ${!currentSlug ? "tool-active text-neutral-900" : ""}`}
          >
            Dashboard
          </button>
          {TOOLS.map((tool) => {
            const isItemActive = currentSlug === tool.slug;
            return (
              <button
                key={tool.slug}
                onClick={() => navigateToSlug(tool.slug)}
                className={`tool-link py-3 cursor-pointer h-full flex items-center border-b-2 border-transparent hover:text-neutral-900 ${isItemActive ? "tool-active text-neutral-900" : ""}`}
              >
                {tool.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN CORE LAYOUT SYSTEM */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8" id="body_main_content">
        
        {currentTool ? (
          // WORKSPACE VIEW (Active Slugs: e.g. /merge-pdf)
          <div className="space-y-16" id="tool_active_panel">
            
            {/* Quick Breadcrumb trail */}
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <button onClick={() => navigateToSlug("")} className="hover:text-black hover:underline cursor-pointer">
                Tools Dashboard
              </button>
              <ChevronRight size={10} />
              <span className="text-neutral-700 font-bold">{currentTool.name}</span>
            </div>

            {/* TIER 1: CORE WORKSPACE UTILITY BLOCK */}
            <section id="tier_1_workspace_visualizer">
              <ToolWorkspace 
                key={currentTool.slug}
                tool={currentTool}
                usageCount={usageCount}
                incrementUsage={handleUsageIncrement}
                onLimitExceeded={() => setIsPaywallOpen(true)}
              />
            </section>

            {/* TIER 2: 3-STEP INFORMATIONAL GRID */}
            <section className="border-t border-neutral-200/60 pt-16" id="tier_2_step_grid_section">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase block mb-1">Workflow Overview</span>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900">How to process {currentTool.name} in 3 Simple Steps</h3>
                <p className="text-xs text-neutral-500 mt-1">Our client architecture runs cleanly inside your secure sandbox heap without lagging.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {currentTool.steps.map((step, idx) => (
                  <div key={idx} className="glass-panel border-minimal rounded-xl p-4 flex gap-4 items-start">
                    <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-neutral-900">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900 mb-1">{step.title}</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* TIER 3: BOTTOM SEO TEXT & ACCORDION FAQs */}
            <section className="border-t border-neutral-200/60 pt-16 max-w-4xl mx-auto" id="tier_3_seo_and_faqs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* SEO Text Panel */}
                <div>
                  <h4 className="text-xs font-bold font-mono tracking-wider text-neutral-400 uppercase mb-3">Enterprise SEO Index</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed max-w-md font-sans">
                    {currentTool.seoText}
                  </p>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-md mt-4 font-sans">
                    Leveraging powerful browser byte utilities to completely strip server computation overhead. By doing document modifications directly on your device, we retain maximum speed, bypass upload latencies, and minimize server compute expenditures.
                  </p>
                  
                  <div className="mt-6 flex items-center gap-2 text-xs font-mono text-neutral-700">
                    <ShieldCheck size={14} className="text-emerald-500" /> Compliant with local privacy directives.
                  </div>
                </div>

                {/* FAQ Accordion Section */}
                <div>
                  <h4 className="text-xs font-bold font-mono tracking-wider text-neutral-400 uppercase mb-4">Frequently Asked Questions</h4>
                  
                  <div className="space-y-3">
                    {currentTool.faqs.map((faq, idx) => {
                      const isExpanded = activeFaqIndices.includes(idx);
                      return (
                        <div key={idx} className="border border-neutral-200 rounded-lg bg-white overflow-hidden transition-all shadow-3xs">
                          <button
                            onClick={() => toggleFaq(idx)}
                            className="w-full text-left px-4 py-3 flex items-center justify-between text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
                          >
                            <span>{faq.q}</span>
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-3.5 pt-1 text-xs text-neutral-500 leading-relaxed border-t border-neutral-100">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>
            </section>

          </div>
        ) : (
          // DIRECTORY TOOL SELECTION GRID (Home path View)
          <div className="space-y-12" id="home_directory_view">
            
            {/* Dashboard Hero greeting card */}
            <div className="text-center max-w-2xl mx-auto py-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-minimal rounded-full text-xs font-mono text-neutral-600 shadow-3xs mb-4">
                <Compass size={12} className="text-neutral-500" /> Indian Developer Initiative
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
                Zero Compute PDF Workspace
              </h1>
              <p className="text-sm text-neutral-500 mt-2 max-w-lg mx-auto leading-relaxed">
                A super-minimalist private ecosystem editing docs in your system browser memory. Blazing speeds. No server leaks.
              </p>
            </div>

            {/* Dynamic Grid of all 8 core tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="tools_catalog_grid">
              {TOOLS.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => navigateToSlug(item.slug)}
                  className="glass-panel border-minimal p-5 rounded-xl text-left group transition-all duration-200 hover:border-neutral-900 cursor-pointer flex flex-col justify-between h-44"
                  id={`tool_card_${item.slug}`}
                >
                  <div className="w-full">
                    {/* Tool spec icon */}
                    <div className="w-9 h-9 rounded-lg bg-neutral-50 text-neutral-600 border border-neutral-100 flex items-center justify-center mb-3 transition-colors duration-200 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 shrink-0">
                      {item.slug === "merge-pdf" && <Layers size={16} />}
                      {item.slug === "split-pdf" && <Scissors size={16} />}
                      {item.slug === "jpg-to-pdf" && <FileImage size={16} />}
                      {item.slug === "pdf-to-jpg" && <FileText size={16} />}
                      {item.slug === "delete-pdf-pages" && <Trash2 size={16} />}
                      {item.slug === "rotate-pdf" && <RotateCw size={16} />}
                      {item.slug === "compress-pdf" && <Minimize2 size={16} />}
                      {item.slug === "protect-pdf" && <Shield size={16} />}
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 flex items-center justify-between">
                      {item.name}
                      <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </h3>
                    <p className="text-xs text-neutral-500 leading-normal mt-1 block">
                      {item.description}
                    </p>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-neutral-900 font-mono mt-3 self-start">
                    Launch Tool
                  </span>
                </button>
              ))}
            </div>

            {/* Dynamic visual dashboard stats ticker */}
            <div className="max-w-4xl mx-auto glass-panel border-minimal rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div className="flex items-start gap-4">
                <span className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl text-neutral-600 shrink-0">
                  <ShieldCheck size={22} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">100% Client-Side Private Secure Framework</h4>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                    By compiling document updates inside browser heap memory buffers, files never hit remote networks, bypassing cloud breaches.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 shrink-0 border-t sm:border-t-0 sm:border-l border-neutral-200 pt-4 sm:pt-0 sm:pl-6">
                <div>
                  <span className="text-base font-bold text-neutral-900 font-mono block">0 ms</span>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Upload Delay</span>
                </div>
                <div>
                  <span className="text-base font-bold text-neutral-900 font-mono block">₹0</span>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Data Charges</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* 3. UNIVERSAL BOTTOM LANDING FOOTER */}
      <footer className="bg-neutral-900 text-white min-h-[5rem] py-8 sm:py-0 px-8 flex flex-col sm:flex-row items-center justify-between gap-6 flex-shrink-0" id="universal_footer_desk">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black font-bold text-lg leading-none">
              P
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Guest Usage Counter</span>
              <div className="flex gap-1.5 mt-1">
                <div className={`w-2.5 h-2.5 rounded-full ${premiumUnlocked || usageCount < 1 ? "bg-green-500" : "bg-neutral-700"}`}></div>
                <div className={`w-2.5 h-2.5 rounded-full ${premiumUnlocked || usageCount < 2 ? "bg-green-500" : "bg-neutral-700"}`}></div>
                <div className={`w-2.5 h-2.5 rounded-full ${premiumUnlocked || usageCount < 3 ? "bg-green-500" : "bg-neutral-700"}`}></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm text-center sm:text-left leading-normal">
            {premiumUnlocked 
              ? `Pro Platform Access Active (${premiumPlanName}). Unlimited processing enabled.`
              : `${Math.max(0, 3 - usageCount)} task${3 - usageCount === 1 ? "" : "s"} remaining today. Upgrade to unlock unlimited processing.`
            }
          </p>
        </div>

        <div className="flex items-center gap-4">
          {!premiumUnlocked ? (
            <>
              <div className="text-right">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Weekly Pass</p>
                <p className="text-xl font-bold tracking-tight">₹99</p>
              </div>
              <button 
                onClick={() => setIsPaywallOpen(true)}
                className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-neutral-100 transition-colors cursor-pointer shadow-sm"
              >
                Unlock Pro via Razorpay
              </button>
            </>
          ) : (
            <span className="text-xs font-mono text-neutral-400">
              © 2026 PDFKit India platform. Built for Indian remote developers.
            </span>
          )}
        </div>
      </footer>

      {/* RAZORPAY BILLING AND PAYWALL GATEWAY MODAL */}
      <PaywallModal 
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onPaymentSuccess={handlePaymentSuccessUnlock}
        usageLimitReached={usageCount >= 3}
      />

    </div>
  );
}
