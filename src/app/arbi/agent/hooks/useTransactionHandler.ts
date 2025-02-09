import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { Message as ResponseMessage } from '@/types/chat'
import { PassThrough } from 'stream';
interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string | Date;
}

interface TransactionContext {
  amount: number;
  token?: string;
  to_address?: string;
  network: string;
  token_address?: string | null;
}

interface ParsedTransaction {
  recipient: string;
  amount: number;
  isERC20: boolean;
  tokenAddress?: string;
}

interface ChatResponse {
  transaction_context: TransactionContext;
  ai_parsed_transaction: ParsedTransaction;
}

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function decimals() view returns (uint8)"
];

export const useTransactionHandler = (
  onSendMessage: (message: ResponseMessage) => void,
  sessionId: string | null,
  userId: string | undefined,
  botType: string  // Add botType parameter
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const addMessage = useCallback(async (content: string) => {
    const message: ResponseMessage = {
      role: "assistant",
      content: content,
      timestamp: new Date(),
    };
    const API_URL = process.env.NEXT_PUBLIC_CLIENT_URL;
    // Send to UI
    onSendMessage(message);
    
    // Push to Redis via Python backend
    try {
      const response = await fetch(`${API_URL}/push-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          session_id: sessionId,
          content: content,
          bot_type: botType,  
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to push message to Redis');
      }

      const data = await response.json();
      
    } catch (error) {
      console.error('Error pushing message to Redis:', error);
    }
  }, [onSendMessage, sessionId, userId, botType]);

  const handleTransactionResponse = useCallback((response: ChatResponse) => {
    const { transaction_context, ai_parsed_transaction } = response;
    // Case 1: Native ETH Transfer
    if (!ai_parsed_transaction.isERC20) {
      const contextAmount = transaction_context.amount;
      const parsedAmount = ai_parsed_transaction.amount;
      
      if (Math.abs(contextAmount - parsedAmount) < 0.000001) {
        setCurrentTransaction({
          network: transaction_context.network,
          amount: contextAmount,
          recipient: ai_parsed_transaction.recipient,
          isERC20: false
        });
        setIsModalOpen(true);
      } else {
        console.error('Transaction amount mismatch');
        addMessage('❌ Error: Transaction amount mismatch detected');
      }
    }
    // Case 2: Token Transfer
    else {
      setCurrentTransaction({
        network: transaction_context.network,
        amount: ai_parsed_transaction.amount,
        recipient: ai_parsed_transaction.recipient,
        tokenAddress: ai_parsed_transaction.tokenAddress,
        isERC20: true
      });
      setIsModalOpen(true);
    }
  }, [addMessage]);

const handleConfirmTransaction = useCallback(async () => {
  if (!currentTransaction) return;

  // Show initiation message and close modal immediately
  addMessage(`🔄 Initiating transaction on ${currentTransaction.network.toUpperCase()}...`);
  setIsModalOpen(false);
  setCurrentTransaction(null);

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    let tx;
    if (!currentTransaction.isERC20) {
      tx = await signer.sendTransaction({
        to: currentTransaction.recipient,
        value: ethers.parseEther(currentTransaction.amount.toString())
      });
    } else {
      const tokenContract = new ethers.Contract(
        currentTransaction.tokenAddress,
        ERC20_ABI,
        signer
      );
      
      const decimals = await tokenContract.decimals();
      const parsedAmount = ethers.parseUnits(
        currentTransaction.amount.toString(),
        decimals
      );
      
      tx = await tokenContract.transfer(currentTransaction.recipient, parsedAmount);
    }

    setTransactionHash(tx.hash);
    await tx.wait();

    // Immediate completion message
    addMessage(`✅ Transaction Completed\nTransaction Hash: ${tx.hash}`);

    // Detailed success message after a delay
    setTimeout(() => {
      addMessage(`✅ Final Transaction Successful!\n
Network: ${currentTransaction.network.toUpperCase()}\n
Recipient Address: ${currentTransaction.recipient}\n
Amount: ${currentTransaction.amount} ${currentTransaction.isERC20 ? 'Tokens' : 'ETH'}\n
Transaction Hash: ${tx.hash}`);

      // Follow-up message after another delay
      setTimeout(() => {
        addMessage('Would you like to proceed with another transaction? I\'m ready to help you with your next blockchain transfer.');
      }, 1000);
    }, 1000);
    
  } catch (error: any) {
    console.error('Transaction failed:', error);
    addMessage(`❌ Transaction Failed: ${error.message}`);
  }
}, [currentTransaction, addMessage]);

  const handleCancelTransaction = useCallback(() => {
    setIsModalOpen(false);
    addMessage(`❌ Transaction Cancelled\n\nTransaction details for ${currentTransaction?.network.toUpperCase()} transfer have been discarded. Would you like to start a new transaction?`);
    setCurrentTransaction(null);
  }, [currentTransaction, addMessage]);

  return {
    isModalOpen,
    currentTransaction,
    transactionHash,
    handleTransactionResponse,
    handleConfirmTransaction,
    handleCancelTransaction,
    closeModal: () => setIsModalOpen(false)
  };
};