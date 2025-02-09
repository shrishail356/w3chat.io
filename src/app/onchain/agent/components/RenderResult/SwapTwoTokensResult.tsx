import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  ArrowDownUp, 
  Copy, 
  RefreshCcw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface SwapTwoTokensResultProps {
  status: "success" | "cancelled" | "failed";
  transactionHash: string | null;
  details: {
    fromToken: string;
    toToken: string;
    amount: number;
    expectedOutput?: number;
  };
  onRetry?: () => void;
}

const SwapTwoTokensResult: React.FC<SwapTwoTokensResultProps> = ({
  status,
  transactionHash,
  details,
  onRetry,
}) => {
  const { fromToken, toToken, amount, expectedOutput } = details;
  const [copyStatus, setCopyStatus] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 1500);
  };

  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          icon: <CheckCircle className="w-8 h-8 text-cyan-400" />,
          bgClass: "bg-cyan-500/20 border-cyan-400/30",
          title: "Swap Successful!",
          subtitle: "Your token swap has been confirmed."
        };
      case "cancelled":
        return {
          icon: <XCircle className="w-8 h-8 text-amber-400" />,
          bgClass: "bg-amber-500/20 border-amber-400/30",
          title: "Swap Cancelled",
          subtitle: "No swap was performed."
        };
      case "failed":
        return {
          icon: <XCircle className="w-8 h-8 text-red-400" />,
          bgClass: "bg-red-500/20 border-red-400/30",
          title: "Swap Failed",
          subtitle: "An error occurred during the swap."
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      className="w-full min-w-[320px]"
    >
      <Card className="w-full min-w-[320px] bg-gradient-to-br from-[#0A192F]/90 via-[#112240]/90 to-[#0A192F]/90 border-cyan-500/20 backdrop-blur-xl overflow-hidden max-w-2xl mx-auto">
        <CardContent className="p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              delay: 0.2 
            }}
            className="py-6 text-center space-y-4"
          >
            {/* Status Icon with Persistent Animation */}
            <motion.div
              key={status} // Add key to prevent disappearance
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 10,
                duration: 0.6
              }}
              className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${statusConfig.bgClass} border-2`}
            >
              {statusConfig.icon}
            </motion.div>

            {/* Status Text with Stagger Animation */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delayChildren: 0.3,
                    staggerChildren: 0.2
                  }
                }
              }}
              className="space-y-1"
            >
              <motion.h3 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="text-lg font-semibold text-cyan-50"
              >
                {statusConfig.title}
              </motion.h3>
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="text-sm text-cyan-300/70"
              >
                {statusConfig.subtitle}
              </motion.p>
            </motion.div>

            {/* Swap Details with Stagger Animation */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: {
                    delayChildren: 0.5,
                    staggerChildren: 0.2
                  }
                }
              }}
              className="space-y-3 text-left text-cyan-50"
            >
              {/* From Token */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="bg-[#112240] rounded-md p-3 border border-cyan-900/50"
              >
                <p className="text-xs text-cyan-300/70">From</p>
                <p className="text-sm font-medium">
                  {amount} {fromToken}
                </p>
              </motion.div>

              {/* Swap Arrow with Bounce */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 10
                }}
                className="flex justify-center"
              >
                <ArrowDownUp className="w-6 h-6 text-cyan-400" />
              </motion.div>

              {/* To Token */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="bg-[#112240] rounded-md p-3 border border-cyan-900/50"
              >
                <p className="text-xs text-cyan-300/70">To (Estimated)</p>
                <p className="text-sm font-medium">
                  {expectedOutput?.toFixed(4) || 'N/A'} {toToken}
                </p>
              </motion.div>

              {/* Transaction Hash */}
              {transactionHash && (
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="bg-[#112240] rounded-md p-3 border border-cyan-900/50 flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs text-cyan-300/70">Transaction Hash</p>
                    <a
                      href={`https://explorer.solana.com/tx/${transactionHash}?cluster=mainnet-beta`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs"
                    >
                      <span>View on Explorer</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  
                  {/* Copy Transaction Hash Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(transactionHash)}
                    className={`text-cyan-400 hover:text-cyan-300 ${
                      copyStatus ? 'text-green-500' : ''
                    }`}
                  >
                    {copyStatus ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Retry Button for Failed or Cancelled Swaps */}
            {(status === "failed" || status === "cancelled") && onRetry && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button 
                  onClick={onRetry} 
                  variant="outline" 
                  className="w-full mt-4 flex items-center justify-center gap-2 text-cyan-400 border-cyan-400/50 hover:bg-cyan-400/10"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Retry Swap
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SwapTwoTokensResult;