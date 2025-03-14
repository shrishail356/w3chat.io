// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Coins, Send, Shield, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { TokenSendComponentProps } from '@/types/serviceTypes';
import { ethers } from 'ethers';
import { pushToChatHistory, pushToChatHistoryNoTransaction } from '@/utils/chatHistoryUtils';

// Type for supported token symbols
type TokenSymbol = keyof typeof TOKENS;

interface Token {
  address: string;  // Contract address for ERC20 tokens
  decimals: number;
  symbol: string;
  name: string;
}

export const TOKENS: Record<string, Token> = {
  ETH: {
    address: '',  // Native ETH doesn't need an address
    decimals: 18,
    symbol: 'ETH',
    name: 'Ethereum'
  },
  // Add other ERC20 tokens here
  USDC: {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin'
  },
  // ... other tokens
};

const TokenSendComponent: React.FC<TokenSendComponentProps> = ({ parsedData, onConfirm, onCancel, sessionId }) => {
  const [step, setStep] = useState(1);
  const [, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const isTokenSupported = (token: string): token is TokenSymbol => {
    return token in TOKENS;
  };

  const handleTransaction = async () => {
    setIsLoading(true);
    setStep(2);
    setError(null);
  
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();

      // Validate token support
      if (!isTokenSupported(parsedData.token)) {
        throw new Error(`Token ${parsedData.token} is not supported`);
      }

      let transaction;
      if (parsedData.token === "ETH") {
        // Handle ETH transfer
        transaction = await (await signer).sendTransaction({
          to: parsedData.toAddress,
          value: ethers.parseEther(parsedData.amount?.toString() || "0")
        });
      } else {
        // Handle ERC20 token transfer
        const tokenContract = new ethers.Contract(
          TOKENS[parsedData.token as TokenSymbol].address,
          ['function transfer(address to, uint256 amount)'],
          await signer
        );
        const decimals = TOKENS[parsedData.token as TokenSymbol].decimals;
        const amount = ethers.parseUnits(parsedData.amount?.toString() || "0", decimals);
        
        transaction = await tokenContract.transfer(parsedData.toAddress, amount);
      }

      await pushToChatHistoryNoTransaction(sessionId, '**Yes**');
      
      // Wait for transaction confirmation
      const receipt = await transaction.wait();
      
      setTransactionHash(receipt.transactionHash);
      setStep(3);
      
      await pushToChatHistory(
        sessionId,
        `Transaction successful: Sent ${parsedData.amount} ${parsedData.token}`,
        {
          service_type: 'tokenSend',
          transaction_status: 'success',
          transaction_hash: receipt.transactionHash,
          transaction_details: {
            amount: parsedData.amount,
            token: parsedData.token,
            recipient: parsedData.toAddress,
          }
        }
      );
      onConfirm();
    } catch (err: any) {
      console.error("Transaction error:", err);
      setError(err.message);
      setStep(1);
      await pushToChatHistoryNoTransaction(
        sessionId,
        '**Yes**' 
      )
      await pushToChatHistory(
        sessionId,
        `Transaction failed: ${err.message}`,
        {
          service_type: 'tokenSend',
          transaction_status: 'failed',
          transaction_details: {
            amount: parsedData.amount,
            token: parsedData.token,
            recipient: parsedData.toAddress,
          }
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelSuccess(true);
    setStep(3);
    setTransactionHash(null);
    await pushToChatHistoryNoTransaction(
      sessionId,
      '**No**' 
    )
    // Push cancelled transaction to chat history
    await pushToChatHistory(
      sessionId,
      'Transaction cancelled',
      {
        service_type: 'tokenSend',
        transaction_status: 'cancelled',
        transaction_details: {
          amount: parsedData.amount,
          token: parsedData.token,
          recipient: parsedData.toAddress,
        }
      }
    );
    
    onCancel();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 1500);
  };

  const trimAddress = (address: string, start = 6, end = 4) =>
    `${address.slice(0, start)}...${address.slice(-end)}`;

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Validate token support before rendering
  const tokenValidationError = !isTokenSupported(parsedData.token) 
    ? `Token ${parsedData.token} is not supported`
    : null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-[#0A192F]/90 via-[#112240]/90 to-[#0A192F]/90 border-cyan-500/20 backdrop-blur-xl overflow-hidden max-w-lg mx-auto sm:max-w-sm sm:mx-4">
        <CardContent className="p-6 sm:p-4">
          {/* Progress Bar */}
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#112240] -translate-y-1/2 z-0" />
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  scale: step >= index ? 1.1 : 1,
                  backgroundColor: step >= index ? 'rgb(6, 182, 212)' : 'rgb(12, 45, 72)',
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                  ${step >= index ? 'bg-cyan-500' : 'bg-[#0A192F]'} 
                  ${step >= index ? 'border-2 border-cyan-400' : 'border border-cyan-800'}`}
              >
                {step > index ? (
                  <CheckCircle className="w-5 h-5 text-cyan-100" />
                ) : (
                  <span className="text-cyan-100">{index}</span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Step 1: Review */}
          {step === 1 && (
            <motion.div
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-base font-semibold text-cyan-50 flex items-center gap-2">
                  <Shield className="w-5 h-5 sm:w-4 sm:h-4 text-cyan-400" />
                  Review Transaction
                </h3>
                <span className="text-sm text-cyan-400">Step 1/3</span>
              </div>

              <div className="grid gap-4">
                <div className="bg-[#112240] rounded-lg p-4 hover:bg-[#1A2C4E] transition-colors border border-cyan-900/50">
                  <div className="text-sm text-cyan-300/70">Amount</div>
                  <div className="text-lg font-medium text-cyan-50 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-cyan-400" />
                    {parsedData.amount} {parsedData.token}
                  </div>
                </div>

                <div className="bg-[#112240] rounded-lg p-4 hover:bg-[#1A2C4E] transition-colors border border-cyan-900/50">
                  <div className="text-sm text-cyan-300/70">Recipient</div>
                  <div className="text-lg font-medium text-cyan-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-cyan-400" />
                      <span>{trimAddress(parsedData.toAddress? parsedData.toAddress : "")}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(parsedData.toAddress? parsedData.toAddress : "")}
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-200"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">{copyStatus ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  
                </div>

                {(error || tokenValidationError) && (
                  <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/20">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{error || tokenValidationError}</span>
                    </div>
                  </div>
                )}

                <div className="bg-[#0A192F] rounded-lg p-4 border border-amber-500/20">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Always verify transaction details</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setCancelSuccess(true);
                  setStep(3); 
                  setTransactionHash(null); 
                  handleCancel();
                }}
                className="flex-1 text-cyan-300 hover:text-cyan-100 hover:bg-[#1A2C4E] border border-cyan-800"
              >
                Cancel
              </Button>
                <Button
                  onClick={handleTransaction}
                  disabled={!!tokenValidationError}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-cyan-50 border border-cyan-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Details
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Processing */}
          {step === 2 && (
            <motion.div
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              className="py-8 text-center space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"
              />
              <h3 className="text-xl font-semibold text-cyan-50">Processing Transaction</h3>
              <p className="text-cyan-300/70">Please confirm the transaction in your wallet...</p>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <motion.div
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              className="py-8 text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto border-2 border-cyan-400/30"
              >
                <CheckCircle className="w-10 h-10 text-cyan-400" />
              </motion.div>
              <div className="space-y-2">
              {cancelSuccess ? (
                <>
                  <h3 className="text-xl font-semibold text-cyan-50">Transaction Cancelled</h3>
                  <p className="text-cyan-300/70">No transaction will be performed</p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-cyan-50">Transaction Successful!</h3>
                  <p className="text-cyan-300/70">Your transfer has been confirmed</p>
                  {transactionHash && (
                  <a
                    href={`https://etherscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mt-2"
                  >
                    <span>View on Etherscan</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  )}
                  </>
                )}
              
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TokenSendComponent;

