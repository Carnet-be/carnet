/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { useLottie } from 'lottie-react';
import React, { type FunctionComponent } from 'react'

type LottieProps={
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animationData:any
}

const Animation:FunctionComponent<LottieProps> = ({animationData}) => {
    const options = {
        animationData,
        loop: true
      };
    
      const { View } = useLottie(options);
    
      return <>{View}</>;
}

export default Animation



