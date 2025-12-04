import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

function Chatbot({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Auto greeting when chatbot opens
  useEffect(() => {
    if (open) {
      setMessages([
        {
          role: "assistant",
          content: "👋 Welcome to our Crop Disease Detection App! 🌱\nYou can ask me about crop diseases, remedies, available pesticides, or how to scan crops.",
        },
      ]);
    }
  }, [open]);

  // Rule-based response generator
  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes("hello") || msg.includes("hi")) {
      return "Hello! 👋 How can I help you with your crops today?";
    } 
    else if (msg.includes("tomato") && msg.includes("yellow")) {
      return "🍅 Yellow spots on tomato leaves may indicate early blight or nutrient deficiency. Ensure proper spacing and consider using fungicides.";
    } 
    else if (msg.includes("rice") && msg.includes("blast")) {
      return "🌾 Rice blast can be prevented by using resistant varieties, applying balanced fertilizer, and fungicides like tricyclazole.";
    } 
    else if (msg.includes("pesticide") || msg.includes("pesticides")) {
      return "🧴 Some commonly used pesticides are:\n- Neem oil (organic)\n- Chlorpyrifos (for pests)\n- Copper-based fungicides (for fungal infections)\n⚠ Always follow recommended dosage and local guidelines.";
    }
    else if (msg.includes("scan") || msg.includes("predict") || msg.includes("disease detection")) {
      return "📸 To scan and predict crop diseases:\n1. Go to the *Scan/Upload section* in the app.\n2. Upload a clear image of the leaf/crop.\n3. The AI will analyze the image and predict if there’s any disease.\n4. You’ll also receive suggestions for remedies.";
    }
    else if (msg.includes("support") || msg.includes("help")) {
      return "🛠 For support, please check our Help section or contact our team at support@cropapp.com.";
    } 
    else {
      return "🤔 Sorry, I don’t have an answer for that. Please try asking about a specific crop disease, pesticides, or how to use the app.";
    }
  };

  // Send message
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    const botReply = getBotResponse(input);

    setMessages([...newMessages, { role: "assistant", content: botReply }]);
    setInput("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>🌾 AI Crop Assistant</DialogTitle>
      <DialogContent>
        <div style={{ minHeight: "300px", marginBottom: "10px", overflowY: "auto" }}>
          {messages.map((msg, i) => (
            <p key={i} style={{ color: msg.role === "user" ? "green" : "blue" }}>
              <b>{msg.role === "user" ? "You" : "Bot"}:</b> {msg.content}
            </p>
          ))}
        </div>

        <TextField
          fullWidth
          placeholder="Ask me about crop diseases, pesticides, or scanning..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage} sx={{ mt: 1 }} variant="contained">
          Send
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default Chatbot;