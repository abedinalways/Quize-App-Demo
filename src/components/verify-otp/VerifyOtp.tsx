'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import VerifyOtpForm from '@/components/auth_components/VerifyOtpForm';
import { useVerifyEmailMutation } from '@/app/redux/api/authApi';

const VerifyOtp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [isLoading, setIsLoading] = useState(false);
  const [verifyEmail] = useVerifyEmailMutation();
  const handleVerifyOtp = async (otp?: string) => {
    if (!otp) return;

    setIsLoading(true);

    try {
      await verifyEmail({
        email,
        token: otp,
      }).unwrap();

      toast.success('OTP Verified!', {
        description: 'You can now reset your password.',
      });

      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error('Invalid OTP', {
        description: error?.data?.message || 'Verification failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 font-[manrope]">
      <Image
        src="/images/TR.png"
        alt="Logo watermark"
        width={500}
        height={500}
        className="absolute top-30 left-20 pointer-events-none opacity-10"
      />

      <div className="text-center mb-8 z-10">
        <h3 className="text-3xl md:text-[48px] font-bold text-[#01281E] leading-[110%]">
          Verify OTP
        </h3>
        <p className="text-sm md:text-[18px] text-[#4B5563] mt-2 leading-[160%]">
          Enter the 6-digit code sent to{' '}
          <span className="font-semibold">{email}</span>
        </p>
      </div>
      
      <VerifyOtpForm onSubmit={handleVerifyOtp} isLoading={isLoading} />
    </div>
  );
};

export default VerifyOtp;
