// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import React, { useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { motion } from 'framer-motion';
// import { 
//   Copy, 
//   Plus, 
//   X 
// } from 'lucide-react';
// import { Connection, PublicKey } from "@solana/web3.js";
// import { useNetwork } from '@/context/NetworkContext';
// import { pushToChatHistory, pushToChatHistoryNoTransaction } from '@/utils/chatHistoryUtils';
// import { getSOLUSDPrice } from '@/utils/priceUtils';

// const GetWalletBalancesComponent: React.FC<{
//   parsedData: { 
//     addresses: string[], 
//     isReadyForTransaction: boolean 
//   }, 
//   onConfirm: () => void, 
//   onCancel: () => void, 
//   sessionId: string
// }> = ({ parsedData, onConfirm, onCancel, sessionId }) => {
//   const [step, setStep] = useState(1);
//   const [addresses, setAddresses] = useState<string[]>(parsedData.addresses);
//   const [addressInput, setAddressInput] = useState('');
//   const [balances, setBalances] = useState<{
//     address: string, 
//     balance: number, 
//     usdBalance?: number
//   }[]>([]);
//   const [, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [copiedAddresses, setCopiedAddresses] = useState<{[key: string]: boolean}>({});

//   const { networkType } = useNetwork();
//   const connection = new Connection(
//     networkType === 'devnet' 
//       ? process.env.NEXT_PUBLIC_DEVNET_RPC_URL || '' 
//       : process.env.NEXT_PUBLIC_MAINNET_RPC_URL || ''
//   );

//   const trimAddress = (address: string) => {
//     return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
//   };

//   const copyToClipboard = (address: string) => {
//     navigator.clipboard.writeText(address);
//     setCopiedAddresses(prev => ({...prev, [address]: true}));
//     setTimeout(() => {
//       setCopiedAddresses(prev => ({...prev, [address]: false}));
//     }, 2000);
//   };

//   const handleAddAddresses = () => {
//     let newAddresses: string[] = [];
//     try {
//       const parsedJson = JSON.parse(addressInput);
//       if (Array.isArray(parsedJson)) {
//         newAddresses = parsedJson.filter((addr): addr is string => 
//           typeof addr === 'string' && addr.trim() !== ''
//         );
//       }
//     } catch {
//       newAddresses = addressInput.split(',')
//         .map(addr => addr.trim())
//         .filter(addr => addr !== '');
//     }

//     const uniqueNewAddresses = newAddresses.filter(
//       addr => !addresses.includes(addr)
//     );
//     setAddresses([...addresses, ...uniqueNewAddresses]);
//     setAddressInput('');
//   };

//   const fetchBalances = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const uniqueAddresses = [...new Set(addresses)];
//       const publicKeys = uniqueAddresses.map(addr => new PublicKey(addr));
//       const accountsInfo = await connection.getMultipleAccountsInfo(publicKeys);
      
//       const solUsdPrice = await getSOLUSDPrice();

//       const balancesData = await Promise.all(
//         accountsInfo.map(async (accountInfo, index) => {
//           const solBalance = accountInfo ? accountInfo.lamports / 1_000_000_000 : 0;
//           const usdBalance = solBalance * solUsdPrice;

//           return {
//             address: uniqueAddresses[index],
//             balance: solBalance,
//             usdBalance: usdBalance
//           };
//         })
//       );

//       setBalances(balancesData);
//       setStep(2);

//       await pushToChatHistory(
//         sessionId,
//         `Fetched balances for ${uniqueAddresses.length} wallet addresses`,
//         {
//           service_type: 'getWalletBalances',
//           transaction_status: 'success',
//           transaction_details: {
//             addresses: uniqueAddresses,
//             balances: balancesData.map(b => ({
//               address: b.address,
//               balance: b.balance,
//               usd_balance: b.usdBalance
//             })),
//             total_sol_balances: balancesData.reduce((sum, b) => sum + b.balance, 0),
//             total_usd_balances: balancesData.reduce((sum, b) => sum + (b.usdBalance || 0), 0)
//           }
//         }
//       );

//       onConfirm();
//     } catch (err: any) {
//       setError(err.message);
//       await pushToChatHistory(
//         sessionId,
//         `Failed to fetch wallet balances: ${err.message}`,
//         {
//           service_type: 'getWalletBalances',
//           transaction_status: 'failed',
//           transaction_details: {
//             addresses: addresses,
//             error: err.message
//           }
//         }
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = async () => {
//     await pushToChatHistoryNoTransaction(sessionId, '**No**');
    
//     await pushToChatHistory(
//       sessionId,
//       'Wallet balance retrieval cancelled',
//       {
//         service_type: 'getWalletBalances',
//         transaction_status: 'cancelled',
//         transaction_details: {
//           addresses: addresses
//         }
//       }
//     );
    
//     setStep(3);
//   };

//   const itemsPerPage = 5;
//   const paginatedBalances = balances.slice(
//     (currentPage - 1) * itemsPerPage, 
//     currentPage * itemsPerPage
//   );

//   const totalPages = Math.ceil(balances.length / itemsPerPage);

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
//       <Card className="bg-gradient-to-br from-[#0A192F]/90 via-[#112240]/90 to-[#0A192F]/90 border-cyan-500/20 backdrop-blur-xl overflow-hidden max-w-lg mx-auto">
//         <CardContent className="p-6">
//           {/* Step 1: Address Input */}
//           {step === 1 && (
//             <motion.div
//               variants={stepVariants}
//               initial="hidden"
//               animate="visible"
//               className="space-y-6"
//             >
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-cyan-50">
//                   Wallet Balances
//                 </h3>
//                 <span className="text-sm text-cyan-400">Step 1/3</span>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex gap-2">
//                   <input 
//                     type="text"
//                     value={addressInput}
//                     onChange={(e) => setAddressInput(e.target.value)}
//                     placeholder="Enter wallet addresses" 
//                     className="flex-1 p-2 bg-[#112240] text-cyan-50 border border-cyan-800 rounded"
//                   />
//                   <Button 
//                     onClick={handleAddAddresses}
//                     className="bg-cyan-600 hover:bg-cyan-500 self-start"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </Button>
//                 </div>

//                 <div className="border border-cyan-800 rounded max-h-40 overflow-y-auto">
//                   {addresses.map((addr, index) => (
//                     <div 
//                       key={index} 
//                       className="p-2 border-b border-cyan-800 last:border-b-0 flex items-center justify-between"
//                     >
//                       <div className="text-lg font-medium text-cyan-50 flex items-center justify-between w-full">
//                         <div className="flex items-center gap-2">
//                           <span>{trimAddress(addr)}</span>
//                         </div>
//                         <button
//                           onClick={() => copyToClipboard(addr)}
//                           className="flex items-center gap-1 text-cyan-400 hover:text-cyan-200"
//                         >
//                           <Copy className="w-4 h-4" />
//                           <span className="text-sm">
//                             {copiedAddresses[addr] ? 'Copied!' : 'Copy'}
//                           </span>
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {error && (
//                   <div className="text-red-400 text-sm">{error}</div>
//                 )}
//               </div>

//               <div className="flex justify-between gap-4">
//                 <Button
//                   variant="ghost"
//                   onClick={handleCancel}
//                   className="flex-1 text-cyan-300 hover:text-cyan-100 hover:bg-[#1A2C4E] border border-cyan-800"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={fetchBalances}
//                   disabled={addresses.length === 0}
//                   className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-cyan-50 border border-cyan-400/20"
//                 >
//                   Get Balances
//                 </Button>
//               </div>
//             </motion.div>
//           )}

//           {/* Step 2: Balances Display */}
//           {step === 2 && (
//             <motion.div
//               variants={stepVariants}
//               initial="hidden"
//               animate="visible"
//               className="space-y-6"
//             >
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold text-cyan-50">
//                   Wallet Balances
//                 </h3>
//                 <span className="text-sm text-cyan-400">Step 2/3</span>
//               </div>

//               <div className="space-y-2">
//                 <div className="border border-cyan-800 rounded">
//                   {paginatedBalances.map((balance, index) => (
//                     <div 
//                       key={index} 
//                       className="p-2 border-b border-cyan-800 last:border-b-0 flex items-center justify-between"
//                     >
//                       <div className="text-lg font-medium text-cyan-50 flex items-center justify-between w-full">
//                         <div className="flex items-center gap-2">
//                           <span>{trimAddress(balance.address)}</span>
//                         </div>
//                         <button
//                           onClick={() => copyToClipboard(balance.address)}
//                           className="flex items-center gap-1 text-cyan-400 hover:text-cyan-200"
//                         >
//                           <Copy className="w-4 h-4" />
//                           <span className="text-sm">
//                             {copiedAddresses[balance.address] ? 'Copied!' : 'Copy'}
//                           </span>
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="border border-cyan-800 rounded mt-2">
//                   {paginatedBalances.map((balance, index) => (
//                     <div 
//                       key={index} 
//                       className="p-2 border-b border-cyan-800 last:border-b-0 grid grid-cols-2 gap-2"
//                     >
//                       <div className="text-right">
//                         <span className="text-cyan-300 text-sm">SOL</span>
//                         <div className="text-cyan-50 font-mono text-right">
//                           {balance.balance.toLocaleString('en-US', {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 4
//                           })}
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <span className="text-cyan-300 text-sm">USD</span>
//                         <div className="text-cyan-50 font-mono text-right">
//                           ${balance.usdBalance?.toLocaleString('en-US', {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2
//                           }) || 'N/A'}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {balances.length > itemsPerPage && (
//                   <div className="flex justify-center items-center space-x-2 mt-4">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                       disabled={currentPage === 1}
//                     >
//                       Previous
//                     </Button>
//                     <span className="text-cyan-50">
//                       Page {currentPage} of {totalPages}
//                     </span>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                       disabled={currentPage === totalPages}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           )}

//           {/* Step 3: Cancelled */}
//           {step === 3 && (
//             <motion.div
//               variants={stepVariants}
//               initial="hidden"
//               animate="visible"
//               className="py-8 text-center space-y-4"
//             >
//               <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto border-2 border-red-400/30">
//                 <X className="w-10 h-10 text-red-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-cyan-50">Wallet Balance Retrieval Cancelled</h3>
//               <p className="text-cyan-300/70">No wallet balance information will be retrieved</p>
//               <Button
//                 onClick={onCancel}
//                 className="bg-cyan-600 hover:bg-cyan-500 text-cyan-50"
//               >
//                 Back to Chat
//               </Button>
//             </motion.div>
//           )}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default GetWalletBalancesComponent;