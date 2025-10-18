'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { send } from 'emailjs-com';
import { Eye, EyeOff, TimerReset } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpExpireTime, setOtpExpireTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [isCounting, setIsCounting] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080/api/v1';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Tạo OTP 6 số
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Gửi OTP qua email
  const sendOtpEmail = async (email: string, otpCode: string, name: string) => {
    await send(
      'service_cwwsu5a', // EmailJS service ID
      'template_d3n2lzw', // Template ID
      { to_email: email, to_name: name, otp_code: otpCode },
      'bL7P7RjmPGwn3s-Is' // Public key
    );
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    setOtpExpireTime(Date.now() + 5 * 60 * 1000); // 5 phút
    sessionStorage.setItem('otp', newOtp);
    sessionStorage.setItem('otpExpire', (Date.now() + 5 * 60 * 1000).toString());

    setIsSendingOtp(true);
    try {
      await sendOtpEmail(formData.email, newOtp, formData.name);
      alert('✅ OTP sent to your email!');
      setShowOtpDialog(true);
      startCountdown();
    } catch (error) {
      console.error(error);
      alert('Failed to send OTP. Try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifying(true);

    const storedOtp = sessionStorage.getItem('otp');
    const expire = sessionStorage.getItem('otpExpire');

    if (!storedOtp || !expire) {
      alert('OTP expired or not found. Please resend.');
      setIsVerifying(false);
      return;
    }

    if (Date.now() > parseInt(expire)) {
      alert('⏳ OTP expired! Please resend.');
      setIsVerifying(false);
      return;
    }

    if (otp === storedOtp) {
      try {
        // ✅ Gọi API lưu user vào DB
        const res = await fetch(`${API_ENDPOINT}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || 'Registration failed');
        }

        const data = await res.json();
        const { token, fullName, avatarUrl, role } = data;



        alert('🎉 Account created successfully! You can now log in.');
        router.push('/auth/login');
        sessionStorage.removeItem('otp');
        sessionStorage.removeItem('otpExpire');
      } catch (error: any) {
        alert(error.message || 'Failed to register user.');
      }
    } else {
      alert('❌ Incorrect OTP');
    }

    setIsVerifying(false);
  };


  // Gửi lại OTP
  const handleResendOtp = async () => {
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    sessionStorage.setItem('otp', newOtp);
    sessionStorage.setItem('otpExpire', (Date.now() + 5 * 60 * 1000).toString());

    try {
      await sendOtpEmail(formData.email, newOtp, formData.name);
      alert('📨 OTP resent successfully!');
      startCountdown();
    } catch (err) {
      console.error(err);
      alert('Failed to resend OTP.');
    }
  };

  // Hàm đếm ngược resend
  const startCountdown = () => {
    setCountdown(60);
    setIsCounting(true);
  };

  // Giảm dần thời gian đếm
  useEffect(() => {
    if (!isCounting) return;
    if (countdown === 0) {
      setIsCounting(false);
      return;
    }

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, isCounting]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Cosmic Background */}
      <div className="absolute inset-0 cosmic-grid opacity-20" />
      <div className="absolute top-20 right-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" 
           style={{ animationDelay: '1.5s' }} />
      
      {/* Logo at top */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <Logo size="md" />
      </div>
      
      <Card className="w-full max-w-md relative z-10 backdrop-blur-2xl mt-16">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-3xl font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Create Account
            </span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Join the neural universe - verify your email to start
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <Label>Email</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label>Confirm Password</Label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSendingOtp}>
              {isSendingOtp ? 'Sending OTP...' : 'Create Account'}
            </Button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      {/* 🔐 OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Email Verification</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-3">
            Enter the 6-digit code sent to <strong>{formData.email}</strong>.
          </p>

          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            className="text-center tracking-widest text-lg"
          />

          <Button onClick={handleVerifyOtp} className="w-full mt-3" disabled={isVerifying}>
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </Button>

          {/* Resend section */}
          <div className="text-center mt-3 text-sm text-muted-foreground flex flex-col items-center">
            {isCounting ? (
              <p className="flex items-center gap-1">
                <TimerReset className="h-4 w-4" />
                Resend OTP in {countdown}s
              </p>
            ) : (
              <Button variant="link" onClick={handleResendOtp} className="text-primary">
                Resend OTP
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
