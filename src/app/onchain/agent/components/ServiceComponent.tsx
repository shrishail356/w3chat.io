import React from 'react';
import { BatchTransferComponentProps, BatchTransferData, ENSTokenSendData, GetWalletBalancesData, ServiceComponentProps, SwapTwoTokensData, TokenSendData } from '@/types/serviceTypes';
import TokenSendComponent from './ServiceTypes/TokenSendComponent';
import ENSTokenSendComponent from './ServiceTypes/ENSTokenSendComponent';
import BatchTransferComponent from './ServiceTypes/BatchTransferComponent';

const ServiceComponent: React.FC<ServiceComponentProps> = (props) => {
  switch (props.serviceType) {
    case 'tokenSend':
      return <TokenSendComponent {...props as ServiceComponentProps<TokenSendData>} />;
    case 'ensTokenSend':
      return <ENSTokenSendComponent {...props as ServiceComponentProps<ENSTokenSendData>} />;
    case 'batchTransfer':
      return <BatchTransferComponent {...props as ServiceComponentProps<BatchTransferData>} />;
    default:
      return null;
  }
};

export default ServiceComponent;