export interface TransactionInfo {
    service_type: string;
    transaction_status: 'success' | 'failed' | 'cancelled';
    transaction_hash?: string;
    transaction_details: Record<string, any>;  // This makes it flexible for any service type
  }