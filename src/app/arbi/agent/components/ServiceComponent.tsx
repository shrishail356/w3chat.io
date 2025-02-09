import React from 'react';
import { BatchTransferComponentProps, BatchTransferData, ENSTokenSendData, GetWalletBalancesData, ServiceComponentProps, SwapTwoTokensData, TokenSendData } from '@/types/serviceTypes';
import TokenSendComponent from './ServiceTypes/TokenSendComponent';
import ENSTokenSendComponent from './ServiceTypes/ENSTokenSendComponent';
import SwapTwoTokensComponent from './ServiceTypes/SwapTwoTokensComponent';
import GetWalletBalancesComponent from './ServiceTypes/GetWalletBalancesComponent';
import BatchTransferComponent from './ServiceTypes/BatchTransferComponent';

const ServiceComponent: React.FC<ServiceComponentProps> = (props) => {
  switch (props.serviceType) {
    case 'tokenSend':
      return <TokenSendComponent {...props as ServiceComponentProps<TokenSendData>} />;
    case 'ensTokenSend':
      return <ENSTokenSendComponent {...props as ServiceComponentProps<ENSTokenSendData>} />;
    case 'swapTwoTokens':
      return <SwapTwoTokensComponent {...props as ServiceComponentProps<SwapTwoTokensData>} />;
    case 'getWalletBalances':
      return <GetWalletBalancesComponent {...props as ServiceComponentProps<GetWalletBalancesData>} />;
    case 'batchTransfer':
      return <BatchTransferComponent {...props as ServiceComponentProps<BatchTransferData>} />;
    default:
      return null;
  }
};

export default ServiceComponent;