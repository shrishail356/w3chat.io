import { motion } from "framer-motion";
import { CheckCircle, XCircle, ExternalLink, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface TransferDetail {
  recipient: string;
  amount: string;
  token: string;
}

interface BatchTransferResultProps {
  status: "success" | "cancelled" | "failed";
  transactionHash: string | null;
  totalTransfers: number;
  transfers: TransferDetail[];
  network: string;
}

const BatchTransferResult: React.FC<BatchTransferResultProps> = ({
  status,
  transactionHash,
  totalTransfers,
  transfers,
  network,
}) => {
  const [copyStatus, setCopyStatus] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 1500);
  };

  const trimAddress = (address: string, start = 6, end = 4) =>
    `${address.slice(0, start)}...${address.slice(-end)}`;

  const getDisplayAddress = (address: string | undefined) => {
    if (!address) return 'Unknown Address'; // Fallback value
    return address.endsWith('.ens') ? address : trimAddress(address);
  };

  const getExplorerUrl = () => {
    return network === "arbitrum_mainnet"
      ? `https://arbiscan.io/tx/${transactionHash}`
      : `https://sepolia.arbiscan.io/tx/${transactionHash}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-[#0A192F]/90 via-[#112240]/90 to-[#0A192F]/90 border-cyan-500/20 backdrop-blur-xl overflow-hidden max-w-md mx-auto sm:max-w-sm sm:mx-4">
        <CardContent className="p-4">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            className="py-6 text-center space-y-4"
          >
            {/* Status Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                status === "success"
                  ? "bg-cyan-500/20 border-cyan-400/30"
                  : status === "cancelled"
                  ? "bg-amber-500/20 border-amber-400/30"
                  : "bg-red-500/20 border-red-400/30"
              } border-2`}
            >
              {status === "success" ? (
                <CheckCircle className="w-8 h-8 text-cyan-400" />
              ) : status === "cancelled" ? (
                <XCircle className="w-8 h-8 text-amber-400" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400" />
              )}
            </motion.div>

            {/* Status Text */}
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-cyan-50">
                {status === "success"
                  ? "Batch Transfer Successful!"
                  : status === "cancelled"
                  ? "Batch Transfer Cancelled"
                  : "Batch Transfer Failed"}
              </h3>
              <p className="text-sm text-cyan-300/70">
                {status === "success"
                  ? "Your batch transfer has been confirmed."
                  : status === "cancelled"
                  ? "No transaction was performed."
                  : "An error occurred during the batch transfer."}
              </p>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3 text-left text-cyan-50">
              <div className="bg-[#112240] rounded-md p-3 border border-cyan-900/50">
                <p className="text-xs text-cyan-300/70">Total Transfers</p>
                <p className="text-sm font-medium">{totalTransfers}</p>
              </div>

              {transfers.map((transfer, index) => (
                <div key={index} className="bg-[#112240] rounded-md p-3 border border-cyan-900/50">
                  <p className="text-xs text-cyan-300/70">Transfer {index + 1}</p>
                  <p className="text-sm font-medium">
                    {transfer.amount} {transfer.token} to {getDisplayAddress(transfer.recipient)}
                  </p>
                </div>
              ))}

              {transactionHash && (
                <div className="bg-[#112240] rounded-md p-3 border border-cyan-900/50">
                  <p className="text-xs text-cyan-300/70">Transaction Hash</p>
                  <a
                    href={getExplorerUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs"
                  >
                    <span>View on Explorer</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BatchTransferResult; 