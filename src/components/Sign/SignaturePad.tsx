"use client";

import { useRef, useState, useEffect } from "react";
import { SigningMethod } from "@/types/document";
import { RotateCcw, Type, Upload, PenTool } from "lucide-react";

interface SignaturePadProps {
  onSign: (signatureData: string, method: SigningMethod) => void;
  isLoading?: boolean;
}

export function SignaturePad({ onSign, isLoading }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [method, setMethod] = useState<SigningMethod>("draw");
  const [typeSignature, setTypeSignature] = useState("");
  const [selectedFont, setSelectedFont] = useState<"formal" | "casual" | "script">("formal");

  const fonts = {
    formal: "Georgia, serif",
    casual: "Verdana, sans-serif",
    script: "cursive",
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || method !== "draw") return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, [method]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (method !== "draw") return;
    setIsDrawing(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || method !== "draw") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleApplySignature = () => {
    if (method === "draw") {
      const canvas = canvasRef.current;
      if (canvas) {
        const signatureData = canvas.toDataURL("image/png");
        onSign(signatureData, "draw");
      }
    } else if (method === "type" && typeSignature) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#000";
          ctx.font = `48px ${fonts[selectedFont]}`;
          ctx.textAlign = "center";
          ctx.fillText(
            typeSignature,
            canvas.width / 2,
            canvas.height / 2 + 15
          );
          const signatureData = canvas.toDataURL("image/png");
          onSign(signatureData, "type");
        }
      }
    }
  };

  const isReadyToSign =
    (method === "draw" && canvasRef.current) ||
    (method === "type" && typeSignature.trim());

  return (
    <div className="space-y-4">
      {/* Method Selection */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setMethod("draw")}
          className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
            method === "draw"
              ? "border-(--primary) bg-(--primary)/10 text-(--primary)"
              : "border-(--border) text-(--secondary) hover:border-(--primary)"
          }`}
        >
          <PenTool className="w-5 h-5" />
          <span className="text-xs font-medium">Draw</span>
        </button>

        <button
          onClick={() => setMethod("image")}
          className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors opacity-50 cursor-not-allowed ${
            method === "image"
              ? "border-(--primary) bg-(--primary)/10"
              : "border-(--border)"
          }`}
          disabled
        >
          <Upload className="w-5 h-5" />
          <span className="text-xs font-medium">Upload</span>
        </button>

        <button
          onClick={() => setMethod("type")}
          className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
            method === "type"
              ? "border-(--primary) bg-(--primary)/10 text-(--primary)"
              : "border-(--border) text-(--secondary) hover:border-(--primary)"
          }`}
        >
          <Type className="w-5 h-5" />
          <span className="text-xs font-medium">Type</span>
        </button>
      </div>

      {/* Draw Method */}
      {method === "draw" && (
        <div className="space-y-3">
          <p className="text-sm text-(--secondary)" style={{ marginTop: '16px', marginBottom: '12px' }}>
            Draw your signature below
          </p>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-48 border-2 border-dashed border-(--border) rounded-lg cursor-crosshair bg-white"
          />
          <button
            onClick={handleClear}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-(--border) rounded-lg hover:bg-(--background) text-(--foreground) text-sm font-medium transition-colors"
            style={{ marginTop: '12px', height: '42px' }}
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        </div>
      )}

      {/* Type Method */}
      {method === "type" && (
        <div className="space-y-4">
          <div style={{ marginTop: '16px' }}>
            <label className="text-sm font-medium text-(--foreground) block" style={{ marginBottom: '10px' }}>
              Your Full Name
            </label>
            <input
              type="text"
              value={typeSignature}
              onChange={(e) => setTypeSignature(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2.5 border border-(--border) rounded-lg bg-(--background) text-(--foreground) placeholder-(--secondary) focus:outline-none focus:ring-2 focus:ring-(--primary)"
              style={{ height: '44px' }}
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <label className="text-sm font-medium text-(--foreground) block" style={{ marginBottom: '10px' }}>
              Font Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(fonts) as Array<keyof typeof fonts>).map((font) => (
                <button
                  key={font}
                  onClick={() => setSelectedFont(font)}
                  className={`p-3 rounded-lg border transition-colors capitalize ${
                    selectedFont === font
                      ? "border-(--primary) bg-(--primary)/10"
                      : "border-(--border) hover:border-(--primary)"
                  }`}
                  style={{ fontFamily: fonts[font], fontSize: "18px" }}
                >
                  {typeSignature || "Abc"}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {typeSignature && (
            <div className="p-4 border border-(--border) rounded-lg bg-(--background)" style={{ marginTop: '20px' }}>
              <p className="text-xs text-(--secondary)" style={{ marginBottom: '12px' }}>Preview:</p>
              <p
                style={{ fontFamily: fonts[selectedFont], fontSize: "48px" }}
                className="text-center text-(--foreground)"
              >
                {typeSignature}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Method */}
      {method === "image" && (
        <div className="p-4 border-2 border-dashed border-(--border) rounded-lg text-center text-(--secondary)">
          <p className="text-sm">Image upload not available in demo</p>
        </div>
      )}

      {/* Apply Button */}
      <button
        onClick={handleApplySignature}
        disabled={!isReadyToSign || isLoading}
        className="w-full px-4 py-3.5 h-12 bg-(--primary) hover:opacity-90 text-white rounded-lg font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-[15px]"
        style={{ marginTop: '20px' }}
      >
        {isLoading ? "Applying..." : "Apply Signature"}
      </button>

      {/* Legal Copy */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg" style={{ marginTop: '16px' }}>
        <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
          By signing, you agree that this signature is legally binding and you are authorized to execute this document.
        </p>
      </div>
    </div>
  );
}
