// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import React, { useState, useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { motion } from 'framer-motion';
// import { ArrowDownUp, CheckCircle, Coins, Shield, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
// import { SwapTwoTokensComponentProps } from '@/types/serviceTypes';
// import { Connection, VersionedTransaction } from "@solana/web3.js";
// import { TOKENS, TokenSymbol } from "@/types";
// import { getSwapQuote, getSwapTransaction } from "@/tools/swap";
// import { useNetwork } from '@/context/NetworkContext';
// import { pushToChatHistory, pushToChatHistoryNoTransaction } from '@/utils/chatHistoryUtils';

// const SwapTwoTokensComponent: React.FC<SwapTwoTokensComponentProps> = ({ 
//   parsedData, 
//   onConfirm, 
//   onCancel, 
//   sessionId 
// }) => {
//   const [step, setStep] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [quoteLoading, setQuoteLoading] = useState(false);
//   const [quote, setQuote] = useState<{ expectedOutput: number | null, quote?: any }>({
//     expectedOutput: null
//   });
//   const [transactionHash, setTransactionHash] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [cancelSuccess, setCancelSuccess] = useState(false);
//   const { networkType, isLoading: networkLoading } = useNetwork();
//   const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

//   useEffect(() => {
//     const fetchQuote = async () => {
//       if (!parsedData.fromToken || !parsedData.toToken || !parsedData.amount) return;

//       setQuoteLoading(true);
//       try {
//         const fromTokenInfo = TOKENS[parsedData.fromToken as TokenSymbol];
//         const toTokenInfo = TOKENS[parsedData.toToken as TokenSymbol];

//         const inputDecimals = fromTokenInfo?.decimals || 9;
//         const amount = parsedData.amount * Math.pow(10, inputDecimals);

//         const swapQuote = await getSwapQuote(
//           fromTokenInfo.mint, 
//           toTokenInfo.mint, 
//           amount,
//           300 
//         );

//         const outputDecimals = toTokenInfo?.decimals || 9;
//         setQuote({ 
//           expectedOutput: swapQuote.outAmount / Math.pow(10, outputDecimals),
//           quote: swapQuote 
//         });
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setQuoteLoading(false);
//       }
//     };

//     fetchQuote();
//   }, [parsedData]);

//   const handleSwap = async () => {
//     setIsLoading(true);
//     setStep(2);
//     setError(null);

//     try {
//       if (!window.solana?.publicKey) {
//         throw new Error("Wallet not connected");
//       }

//       if (networkLoading) {
//         throw new Error("Network detection in progress");
//       }

//       if (!quote.quote) {
//         throw new Error("No swap quote available");
//       }

//       await pushToChatHistoryNoTransaction(
//         sessionId,
//         '**Yes**' 
//       );

//       const swapTransaction = await getSwapTransaction(quote.quote, window.solana.publicKey);
//       const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
//       const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

//       const { signature } = await window.solana.signAndSendTransaction(transaction);
//       await connection.confirmTransaction(signature);

//       setTransactionHash(signature);
//       setStep(3);
      
//       await pushToChatHistory(
//         sessionId,
//         `Swap successful: Swapped ${parsedData.amount} ${parsedData.fromToken} to ${parsedData.toToken}`,
//         {
//           service_type: 'swapTwoTokens',
//           transaction_status: 'success',
//           transaction_hash: signature,
//           transaction_details: {
//             fromToken: parsedData.fromToken,
//             toToken: parsedData.toToken,
//             amount: parsedData.amount,
//             expectedOutput: quote.expectedOutput
//           }
//         }
//       );
//       onConfirm();
//     } catch (err: any) {
//       console.error("Swap transaction error:", err);
//       setError(err.message);
//       setStep(1);
      
//       await pushToChatHistoryNoTransaction(
//         sessionId,
//         '**Yes**' 
//       );
      
//       await pushToChatHistory(
//         sessionId,
//         `Swap failed: ${err.message}`,
//         {
//           service_type: 'swapTwoTokens',
//           transaction_status: 'failed',
//           transaction_details: {
//             fromToken: parsedData.fromToken,
//             toToken: parsedData.toToken,
//             amount: parsedData.amount,
//             expectedOutput: quote.expectedOutput
//           }
//         }
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = async () => {
//     setCancelSuccess(true);
//     setStep(3);
//     setTransactionHash(null);
    
//     await pushToChatHistoryNoTransaction(
//       sessionId,
//       '**No**' 
//     );
    
//     await pushToChatHistory(
//       sessionId,
//       'Swap transaction cancelled',
//       {
//         service_type: 'swapTwoTokens',
//         transaction_status: 'cancelled',
//         transaction_details: {
//           fromToken: parsedData.fromToken,
//           toToken: parsedData.toToken,
//           amount: parsedData.amount,
//           expectedOutput: quote.expectedOutput
//         }
//       }
//     );
    
//     onCancel();
//   };

//   const stepVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       className="w-full"
//     >
//       <Card className="bg-gradient-to-br from-[#0A192F]/90 via-[#112240]/90 to-[#0A192F]/90 border-cyan-500/20 backdrop-blur-xl overflow-hidden max-w-lg mx-auto sm:max-w-sm sm:mx-4">
//         <CardContent className="p-6 sm:p-4">
//           {/* Progress Bar */}
//           <div className="flex justify-between mb-8 relative">
//             <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#112240] -translate-y-1/2 z-0" />
//             {[1, 2, 3].map((index) => (
//               <motion.div
//                 key={index}
//                 initial={false}
//                 animate={{
//                   scale: step >= index ? 1.1 : 1,
//                   backgroundColor: step >= index ? 'rgb(6, 182, 212)' : 'rgb(12, 45, 72)',
//                 }}
//                 className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
//                   ${step >= index ? 'bg-cyan-500' : 'bg-[#0A192F]'} 
//                   ${step >= index ? 'border-2 border-cyan-400' : 'border border-cyan-800'}`}
//               >
//                 {step > index ? (
//                   <CheckCircle className="w-5 h-5 text-cyan-100" />
//                 ) : (
//                   <span className="text-cyan-100">{index}</span>
//                 )}
//               </motion.div>
//             ))}
//           </div>

//           {/* Step 1: Review */}
//           {step === 1 && (
//             <motion.div
//               variants={stepVariants}
//               initial="hidden"
//               animate="visible"
//               className="space-y-6"
//             >
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg sm:text-base font-semibold text-cyan-50 flex items-center gap-2">
//                   <Shield className="w-5 h-5 sm:w-4 sm:h-4 text-cyan-400" />
//                   Review Swap Transaction
//                 </h3>
//                 <span className="text-sm text-cyan-400">Step 1/3</span>
//               </div>

//               <div className="grid gap-4">
//                 {/* From Token */}
//                 <div className="bg-[#112240] rounded-lg p-4 hover:bg-[#1A2C4E] transition-colors border border-cyan-900/50">
//                   <div className="text-sm text-cyan-300/70">From</div>
//                   <div className="text-lg font-medium text-cyan-50 flex items-center gap-2">
//                     <Coins className="w-4 h-4 text-cyan-400" />
//                     {parsedData.amount} {parsedData.fromToken}
//                   </div>
//                 </div>

//                 {/* Arrow Down */}
//                 <div className="flex justify-center">
//                   <ArrowDownUp className="w-6 h-6 text-cyan-400" />
//                 </div>

//                 {/* To Token */}
//                 <div className="bg-[#112240] rounded-lg p-4 hover:bg-[#1A2C4E] transition-colors border border-cyan-900/50">
//                   <div className="text-sm text-cyan-300/70">To (Estimated)</div>
//                   <div className="text-lg font-medium text-cyan-50 flex items-center gap-2">
//                     <Coins className="w-4 h-4 text-cyan-400" />
//                     {quoteLoading ? (
//                       <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
//                     ) : (
//                       `${quote.expectedOutput?.toFixed(4) || 'Fetching quote...'} ${parsedData.toToken}`
//                     )}
//                   </div>
//                 </div>

//                 {error && (
//                   <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/20">
//                     <div className="flex items-center gap-2 text-red-400">
//                       <AlertCircle className="w-4 h-4" />
//                       <span className="text-sm">{error}</span>
//                     </div>
//                   </div>
//                 )}

//                 <div className="bg-[#0A192F] rounded-lg p-4 border border-amber-500/20">
//                   <div className="flex items-center gap-2 text-amber-400">
//                     <AlertCircle className="w-4 h-4" />
//                     <span className="text-sm">Swap rates may change during transaction</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
//                 <Button
//                   variant="ghost"
//                   onClick={() => {
//                     setCancelSuccess(true);
//                     setStep(3); 
//                     setTransactionHash(null); 
//                     handleCancel();
//                   }}
//                   className="flex-1 text-cyan-300 hover:text-cyan-100 hover:bg-[#1A2C4E] border border-cyan-800"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleSwap}
//                   disabled={!quote.expectedOutput || isLoading}
//                   className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-cyan-50 border border-cyan-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Confirm Swap
//                 </Button>
//               </div>
//             </motion.div>
//           )}

//           {/* Step 2: Processing */}
//           {step === 2 && (
//             <motion.div
//               variants={stepVariants}
//               initial="hidden"
//               animate="visible"
//               className="py-8 text-center space-y-4"
//             >
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                 className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"
//               />
//               <h3 className="text-xl font-semibold text-cyan-50">Processing Swap</h3>
//               <p className="text-cyan-300/70">Please confirm the transaction in your wallet...</p>
//             </motion.div>
//           )}

//           {/* Step 3: Success/Cancel */}
//           {step === 3 && (
//             <motion.div
//               variants={stepVariants}
//               initial="hidden"
//               animate="visible"
//               className="py-8 text-center space-y-6"
//             >
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto border-2 border-cyan-400/30"
//               >
//                 <CheckCircle className="w-10 h-10 text-cyan-400" />
//               </motion.div>
//               <div className="space-y-2">
//                 {cancelSuccess ? (
//                   <>
//                     <h3 className="text-xl font-semibold text-cyan-50">Swap Cancelled</h3>
//                     <p className="text-cyan-300/70">No swap will be performed</p>
//                   </>
//                 ) : (
//                   <>
//                     <h3 className="text-xl font-semibold text-cyan-50">Swap Successful!</h3>
//                     <p className="text-cyan-300/70">Your token swap has been confirmed</p>
//                     {transactionHash && (
//                       <a
//                         href={`https://explorer.solana.com/tx/${transactionHash}?cluster=${networkType === "devnet" ? "devnet" : "mainnet-beta"}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mt-2"
//                       >
//                         <span>View on Explorer</span>
//                         <ExternalLink className="w-4 h-4" />
//                       </a>
//                     )}
//                   </>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default SwapTwoTokensComponent;