import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import Razorpay from "razorpay";

// Initialize express app
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5173;

// Lazy Razorpay initialization
let razorpayInstance: any = null;
function getRazorpay(): any {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || !keySecret) {
    return null;
  }
  
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayInstance;
}

// Razorpay API Route to create payment orders
app.post("/api/razorpay/order", async (req, res) => {
  try {
    const { amount, planId } = req.body;
    
    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ error: "Invalid amount provided." });
    }

    const rzp = getRazorpay();
    const mockMode = rzp === null;

    const amountInPaise = amount * 100; // Razorpay expects amount in paise (1 INR = 100 paise)

    if (mockMode) {
      // Return beautiful demo checkout parameters so the user can test their flow in sandbox
      return res.json({
        id: `order_demo_${Math.random().toString(36).substring(2, 11)}`,
        amount: amountInPaise,
        currency: "INR",
        planId: planId,
        isDemo: true,
        message: "Razorpay environment variables (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) not set. Running in Demonstration/Sandbox mode.",
        keyId: "rzp_test_demo_key"
      });
    }

    // Real Razorpay order generation
    const order = await rzp.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${planId}_${Date.now()}`,
      notes: {
        planId: planId,
        planType: planId === "daily" ? "Daily Pass" : planId === "weekly" ? "Weekly Pass" : "Monthly Pro",
      },
    });

    return res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      planId: planId,
      isDemo: false,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    return res.status(500).json({ error: error.message || "Failed to create Razorpay payment order." });
  }
});

// Mock/Sandbox verify-payment endpoint
app.post("/api/razorpay/verify", async (req, res) => {
  const { orderId, paymentId, signature, isDemo } = req.body;
  if (isDemo || !getRazorpay()) {
    // Automatically succeed in sandbox mode
    return res.json({ success: true, message: "Demo transaction verified successfully!" });
  }
  
  // Real verification check
  const crypto = await import("crypto");
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(500).json({ error: "Missing Razorpay configuration." });
  }

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (generatedSignature === signature) {
    return res.json({ success: true });
  } else {
    return res.status(400).json({ error: "Payment verification failed" });
  }
});

// Configure Vite middleware in development or express.static in production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
