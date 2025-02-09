import React from 'react';
import { ServiceComponentProps, TokenSendData } from '@/types/serviceTypes';
import TokenSendComponent from './ServiceTypes/TokenSendComponent';

const ServiceComponent: React.FC<ServiceComponentProps> = (props) => {
  switch (props.serviceType) {
    case 'tokenSend':
      return <TokenSendComponent {...props as ServiceComponentProps<TokenSendData>} />;
    default:
      return null;
  }
};

export default ServiceComponent;