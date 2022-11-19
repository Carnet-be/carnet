'use client'
import { useLottie } from 'lottie-react';
import React, { FunctionComponent } from 'react'

type LottieProps={
    animationData:any
}

const Lottie:FunctionComponent<LottieProps> = ({animationData}) => {
    const options = {
        animationData,
        loop: true
      };
    
      const { View } = useLottie(options);
    
      return <>{View}</>;
}

export default Lottie