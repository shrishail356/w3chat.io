import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TransactionDetails {
  network: string;
  amount: number;
  recipient: string;
  tokenAddress?: string;
  isERC20: boolean;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: TransactionDetails;
}

const TransactionConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-cyanBlue-50 text-cyanBlue-900 border border-cyanBlue-300 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-cyanBlue-800">
            {transaction.isERC20 ? 'Confirm Token Transfer' : 'Confirm ETH Transfer'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-cyanBlue-600">Network</span>
              <span className="font-medium">{transaction.network}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-cyanBlue-600">Amount</span>
              <span className="font-medium">
                {transaction.amount} {transaction.isERC20 ? 'Tokens' : 'ETH'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-cyanBlue-600">Recipient</span>
              <span className="font-medium text-xs break-all">{transaction.recipient}</span>
            </div>
            {transaction.isERC20 && (
              <div className="flex justify-between">
                <span className="text-sm text-cyanBlue-600">Token Address</span>
                <span className="font-medium text-xs break-all">{transaction.tokenAddress}</span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} className="border-cyanBlue-500 text-cyanBlue-800">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-cyanBlue-500 hover:bg-cyanBlue-600 text-white"
          >
            Confirm Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionConfirmationModal;
