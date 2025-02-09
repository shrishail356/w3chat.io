import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Coins, Send, Shield, AlertCircle, Copy, ExternalLink, Upload, Plus, Trash2 } from 'lucide-react';
import { BatchTransferComponentProps } from '@/types/serviceTypes';
import { ethers } from 'ethers';
import { abi } from './abi';
import { pushToChatHistory, pushToChatHistoryNoTransaction } from '@/utils/chatHistoryUtils';
import { useNetwork } from '@/context/NetworkContext';
type TransferItem = {
  id: string;
  recipient: string;
  amount: string;
  token: string;
  resolvedAddress: string | null;
};
type TransferInputs = {
    id: string;
    recipient: string;
    amount: string;
    token: string;
    resolvedAddress: string | null;
};

const BATCH_TRANSFER_ADDRESS = '0x19c5C11D24efc8D7528c2E747908dFd6f4b94A42';

const BatchTransferComponent: React.FC<BatchTransferComponentProps> = ({ parsedData, onConfirm, onCancel, sessionId }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [transfers, setTransfers] = useState<TransferInputs[]>(
    parsedData.transfers.map((t, index) => ({
      id: (index + 1).toString(),
      recipient: t.toAddress || '',
      amount: t.amount?.toString() || '',
      token: t.token || 'ETH',
      resolvedAddress: null
    }))
  );
  const { networkType } = useNetwork();
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim()); // Filter out empty lines
      
      // Skip header and process only valid lines
      const newTransfers = lines.slice(1).map((line, index) => {
        const [recipient = '', amount = '', token = ''] = line.split(',').map(val => val?.trim() || '');
        
        // Only create transfer if we have all required fields
        if (recipient && amount && token) {
          return {
            id: (transfers.length + index + 1).toString(),
            recipient,
            amount,
            token,
            resolvedAddress: null
          };
        }
        return null;
      }).filter((transfer): transfer is NonNullable<typeof transfer> => transfer !== null);

      if (newTransfers.length > 0) {
        setTransfers(prevTransfers => [...prevTransfers, ...newTransfers]);
      } else {
        setError('No valid transfers found in CSV. Please check the format.');
      }
    };
    reader.readAsText(file);
  }
};

  const downloadCsvTemplate = () => {
    const template = 'Recipient,Amount,Token\naddress_or_domain,0.0,ETH\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch_transfer_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const addTransfer = () => {
    const newId = (transfers.length + 1).toString();
    setTransfers(prevTransfers => [...prevTransfers, {
      id: newId,
      recipient: "",
      amount: "",
      token: "ETH",
      resolvedAddress: null
    }]);
    console.log("This is the transfers from add transfer", transfers)
  };

  const removeTransfer = (id: string) => {
    if (transfers.length > 1) {
      setTransfers(transfers.filter((t) => t.id !== id));
    }
  };

const handleBatchTransfer = async () => {
  setIsLoading(true);
  setStep(2);
  setError(null);

  const invalidTransfers = transfers.filter(
    t => !t.recipient || !t.amount
  );

  if (invalidTransfers.length > 0) {
    setError("Please fill in all required fields for each transfer");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(BATCH_TRANSFER_ADDRESS, abi, signer);

    const rawRecipients = transfers.map(t => t.recipient);
    const amounts = transfers.map(t => ethers.parseEther(t.amount));

    if (rawRecipients.length === 0 || amounts.length === 0) {
      throw new Error("Recipients and amounts cannot be empty");
    }
    if (rawRecipients.length !== amounts.length) {
      throw new Error("Number of recipients must match number of amounts");
    }

    const totalAmount = amounts.reduce((a, b) => a + b);

    const balance = await provider.getBalance(await signer.getAddress());
    if (balance < totalAmount) {
      throw new Error("Insufficient ETH balance");
    }
    await pushToChatHistoryNoTransaction(sessionId, '**Yes**');

    const tx = await contract.batchTransferNative(rawRecipients, amounts, {
      value: totalAmount,
    });

    // Log the transaction details
    console.log("Transaction details:", tx);

    setError("Transaction pending...");
    const receipt = await tx.wait();

    // Use the transaction hash from the response
    const transactionHash = tx.hash;

    if (receipt.status === 1) {
      setError("Batch transfer successful!");
      setTransfers([]); // Clear transfers after success
      setTransactionHashes([transactionHash]); // Store transaction hash
      setStep(3); // Move to success step

      await pushToChatHistory(
        sessionId,
        `Batch transfer successful: Transaction hash: ${transactionHash}`,
        {
          service_type: 'batchTransfer',
          transaction_status: 'success',
          transaction_hash: transactionHash,
          transaction_details: {
            total_transfers: transfers.length,
            all_transaction_hashes: [transactionHash],
            transfers: transfers.map(t => ({
              recipient: t.recipient,
              amount: t.amount,
              token: t.token
            })),
            network: networkType
            
          },
          
        }
      );
    } else {
      throw new Error("Transaction failed");
    }
  } catch (err) {
    console.error("Transaction error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    setError("Transaction failed: " + errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const handleCancel = async () => {
    setCancelSuccess(true);
    setStep(3);
    await pushToChatHistoryNoTransaction(sessionId, '**No**');
    await pushToChatHistory(
      sessionId,
      'Batch transfer cancelled',
      {
        service_type: 'batchTransfer',
        transaction_status: 'cancelled',
        transaction_details: {
          transfers: transfers.map(t => ({
            recipient: t.recipient,
            amount: t.amount,
            token: t.token
          }))
        }
      }
    );
    onCancel();
  };

  const updateTransfer = (id: string, field: keyof TransferInputs, value: string) => {
    setTransfers(prevTransfers => 
      prevTransfers.map(transfer => 
        transfer.id === id ? { ...transfer, [field]: value } : transfer
      )
    );
  };
  
  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-[#0A192F]/90 via-[#112240]/90 to-[#0A192F]/90 border-cyan-500/20 backdrop-blur-xl overflow-hidden max-w-2xl mx-auto">
        <CardContent className="p-6">
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
                <h3 className="text-lg font-semibold text-cyan-50 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Batch Transfer Details
                </h3>
                <span className="text-sm text-cyan-400">Step 1/3</span>
              </div>

              <div className="space-y-4">
              {transfers.map((transfer, index) => (
                <div key={transfer.id} className="bg-[#112240] rounded-lg p-4 hover:bg-[#1A2C4E] transition-colors border border-cyan-900/50">
                    <div className="flex justify-between items-center mb-2">
                    <span className="text-cyan-300/70">Transfer #{index + 1}</span>
                    {transfers.length > 1 && (
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTransfer(transfer.id)}
                        className="text-red-400 hover:text-red-300"
                        >
                        <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                    </div>
                    <div className="grid gap-4">
                    <div>
                        <label className="text-sm text-cyan-300/70">Recipient</label>
                        <input
                        type="text"
                        value={transfer.recipient}
                        onChange={(e) => updateTransfer(transfer.id, 'recipient', e.target.value)}
                        className="w-full bg-[#0A192F] border border-cyan-800 rounded-md p-2 text-cyan-50 mt-1"
                        placeholder="Address or .sol domain"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="text-sm text-cyan-300/70">Amount</label>
                        <input
                            type="text"
                            value={transfer.amount}
                            onChange={(e) => updateTransfer(transfer.id, 'amount', e.target.value)}
                            className="w-full bg-[#0A192F] border border-cyan-800 rounded-md p-2 text-cyan-50 mt-1"
                            placeholder="0.0"
                        />
                        </div>
                        <div>
                        <label className="text-sm text-cyan-300/70">Token</label>
                        <select
                            value={transfer.token}
                            onChange={(e) => updateTransfer(transfer.id, 'token', e.target.value)}
                            className="w-full bg-[#0A192F] border border-cyan-800 rounded-md p-2 text-cyan-50 mt-1"
                        >
                            <option value="ETH">ETH</option>
                        </select>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={addTransfer}
                  variant="outline"
                  className="flex-1 text-cyan-400 hover:text-cyan-300 border-cyan-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transfer
                </Button>
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Button
                    variant="outline"
                    className="w-full text-cyan-400 hover:text-cyan-300 border-cyan-800"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV
                  </Button>
                </div>
                <Button
                  onClick={downloadCsvTemplate}
                  variant="outline"
                  className="flex-1 text-cyan-400 hover:text-cyan-300 border-cyan-800"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Get Template
                </Button>
              </div>

              {error && (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  className="flex-1 text-cyan-300 hover:text-cyan-100 hover:bg-[#1A2C4E] border border-cyan-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBatchTransfer}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-cyan-50 border border-cyan-400/20"
                >
                  Confirm Transfers
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
              <h3 className="text-xl font-semibold text-cyan-50">Processing Transfers</h3>
              <p className="text-cyan-300/70">Please confirm the transactions in your wallet...</p>
            </motion.div>
          )}

          {/* Step 3: Success/Cancel */}
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
                    <h3 className="text-xl font-semibold text-cyan-50">Transfers Cancelled</h3>
                    <p className="text-cyan-300/70">No transactions will be performed</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-cyan-50">Transfers Successful!</h3>
                    <p className="text-cyan-300/70">All transfers have been confirmed</p>
                    <div className="mt-4 space-y-2">
                      {transactionHashes.map((hash, index) => (
                        <a
                          key={hash}
                          href={networkType === "arbitrum_sepolia" ? `https://sepolia.arbiscan.io/tx/${hash}` : `https://arbiscan.io/tx/${hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 block"
                        >
                          <span>Transfer {index + 1} on Explorer</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
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

export default BatchTransferComponent;