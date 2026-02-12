import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RiceIcon, ScaleIcon } from './Icons';
import { useVerifyNIDMutation, useVerifyNIDWithUploadMutation } from '../store/api/nidApi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onVoteCast: (party: 'rice' | 'scale') => void;
}

const VotingModal: React.FC<Props> = ({ isOpen, onClose, onVoteCast }) => {
  const [step, setStep] = useState<'capture' | 'verifying' | 'select' | 'countdown' | 'success'>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedParty, setSelectedParty] = useState<'rice' | 'scale' | null>(null);
  const [countdown, setCountdown] = useState(30); // 30 seconds countdown
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [useCameraMode, setUseCameraMode] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RTK Query mutations
  const [verifyNID] = useVerifyNIDMutation();
  const [verifyNIDWithUpload] = useVerifyNIDWithUploadMutation();

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'countdown' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (step === 'countdown' && countdown === 0) {
      // Time's up - go back to select
      alert('সময় শেষ! দয়া করে আবার চেষ্টা করুন।');
      setStep('select');
      setCountdown(30);
      setSelectedParty(null);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera error:", err);

      let errorMessage = "ক্যামেরা এক্সেস করা সম্ভব হয়নি। ";

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage += "দয়া করে ব্রাউজার সেটিংস থেকে ক্যামেরা পারমিশন দিন।";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage += "কোন ক্যামেরা খুঁজে পাওয়া যায়নি।";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage += "ক্যামেরা অন্য অ্যাপ্লিকেশন দ্বারা ব্যবহৃত হচ্ছে।";
      } else {
        errorMessage += "ফাইল আপলোড অপশন ব্যবহার করুন।";
      }

      setCameraError(errorMessage);
      setUseCameraMode(false); // Switch to file upload mode
    }
  }, []);

  React.useEffect(() => {
    if (isOpen && step === 'capture' && useCameraMode) {
      startCamera();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, step, useCameraMode, startCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        handleVerifyBase64(dataUrl);
      }
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('দয়া করে একটি ছবি ফাইল নির্বাচন করুন।');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('ফাইল সাইজ ১০ এমবি এর কম হতে হবে।');
      return;
    }

    setStep('verifying');

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('nidImage', file);

      const result = await verifyNIDWithUpload(formData).unwrap();

      if (result.isValid || result.success) {
        setStep('select');
      } else {
        alert("দুঃখিত, আপনার এনআইডি কার্ডটি সঠিকভাবে শনাক্ত করা যায়নি। আবার চেষ্টা করুন।");
        setStep('capture');
      }
    } catch (error) {
      console.error('NID verification failed:', error);
      alert("এনআইডি যাচাই করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      setStep('capture');
    }
  };

  const handleVerifyBase64 = async (imageData: string) => {
    setStep('verifying');

    try {
      const result = await verifyNID({ image: imageData }).unwrap();

      if (result.isValid || result.success) {
        setStep('select');
      } else {
        alert("দুঃখিত, আপনার এনআইডি কার্ডটি সঠিকভাবে শনাক্ত করা যায়নি। আবার চেষ্টা করুন।");
        setStep('capture');
      }
    } catch (error) {
      console.error('NID verification failed:', error);
      alert("এনআইডি যাচাই করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      setStep('capture');
    }
  };

  const handleCandidateSelect = (party: 'rice' | 'scale') => {
    setSelectedParty(party);
    setCountdown(30); // Reset countdown to 30 seconds
    setStep('countdown'); // Move to countdown step
  };

  const handleConfirmVote = () => {
    if (selectedParty) {
      onVoteCast(selectedParty);
      setStep('success');
    }
  };

  const handleCancelVote = () => {
    setStep('select');
    setSelectedParty(null);
    setCountdown(30);
  };

  const handleClose = () => {
    setStep('capture');
    setCapturedImage(null);
    setSelectedParty(null);
    setCountdown(30);
    setCameraError(null);
    setUseCameraMode(true);
    onClose();
  };

  const switchMode = () => {
    setUseCameraMode(!useCameraMode);
    setCameraError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        <button onClick={handleClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 z-10">
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="p-8">
          {step === 'capture' && (
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-800 mb-2">এনআইডি ভেরিফিকেশন</h2>
              <p className="text-slate-500 mb-6 text-sm">
                {useCameraMode
                  ? 'ভোট দেওয়ার জন্য আপনার জাতীয় পরিচয়পত্রটি ক্যামেরার সামনে ধরুন'
                  : 'ভোট দেওয়ার জন্য আপনার জাতীয় পরিচয়পত্রের ছবি আপলোড করুন'
                }
              </p>

              {/* Mode Toggle Buttons */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => switchMode()}
                  className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all ${
                    useCameraMode
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <i className="fas fa-camera mr-2"></i>
                  ক্যামেরা
                </button>
                <button
                  onClick={() => switchMode()}
                  className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all ${
                    !useCameraMode
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <i className="fas fa-upload mr-2"></i>
                  আপলোড
                </button>
              </div>

              {useCameraMode ? (
                // Camera Mode
                <div>
                  {cameraError ? (
                    <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 mb-6">
                      <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                      <p className="text-red-700 text-sm leading-relaxed mb-4">{cameraError}</p>
                      <button
                        onClick={() => setUseCameraMode(false)}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all"
                      >
                        <i className="fas fa-upload mr-2"></i>
                        ফাইল আপলোড করুন
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="relative aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden mb-6 border-4 border-slate-200">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <div className="absolute inset-8 border-2 border-dashed border-green-500 rounded-xl opacity-50 pointer-events-none"></div>
                      </div>
                      <button
                        onClick={capturePhoto}
                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg transition-all transform active:scale-95"
                      >
                        <i className="fas fa-camera mr-2"></i> ছবি তুলুন
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // File Upload Mode
                <div>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden mb-6 border-4 border-dashed border-slate-300 hover:border-green-500 cursor-pointer transition-all group"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <i className="fas fa-cloud-upload-alt text-6xl text-slate-300 group-hover:text-green-500 mb-4 transition-colors"></i>
                      <p className="text-slate-500 font-bold">ক্লিক করে ছবি নির্বাচন করুন</p>
                      <p className="text-slate-400 text-sm mt-2">JPG, PNG, GIF (সর্বোচ্চ ১০এমবি)</p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg transition-all transform active:scale-95"
                  >
                    <i className="fas fa-upload mr-2"></i> ছবি আপলোড করুন
                  </button>
                </div>
              )}

              {/* Camera Permission Instructions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <p className="text-blue-800 text-xs font-bold mb-2">
                  <i className="fas fa-info-circle mr-1"></i> ক্যামেরা পারমিশন দিতে:
                </p>
                <ul className="text-blue-700 text-xs space-y-1 text-left list-disc list-inside">
                  <li>ব্রাউজার এড্রেস বারে 🔒 আইকনে ক্লিক করুন</li>
                  <li>"ক্যামেরা" সেটিংস "অনুমতি দিন" করুন</li>
                  <li>পেজ রিলোড করুন</li>
                </ul>
              </div>
            </div>
          )}

          {step === 'verifying' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">এনআইডি যাচাই করা হচ্ছে...</h2>
              <p className="text-slate-500">আপনার তথ্য পরীক্ষা করা হচ্ছে। দয়া করে অপেক্ষা করুন।</p>
            </div>
          )}

          {step === 'select' && (
            <div className="text-center">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <i className="fas fa-check-circle text-3xl text-green-600"></i>
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-8">পরিচয় নিশ্চিত হয়েছে</h2>

              <p className="text-slate-500 mb-6 font-bold uppercase tracking-widest text-xs">আপনার পছন্দের প্রতীক নির্বাচন করুন</p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleCandidateSelect('rice')}
                  className="p-6 rounded-3xl border-2 border-slate-100 hover:border-green-500 hover:bg-green-50 transition-all flex flex-col items-center group"
                >
                  <RiceIcon className="w-16 h-16 text-slate-400 group-hover:text-green-600 mb-4 transition-colors" />
                  <span className="font-bold text-slate-700">ধানের শীষ</span>
                </button>
                <button
                  onClick={() => handleCandidateSelect('scale')}
                  className="p-6 rounded-3xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center group"
                >
                  <ScaleIcon className="w-16 h-16 text-slate-400 group-hover:text-blue-600 mb-4 transition-colors" />
                  <span className="font-bold text-slate-700">দাঁড়িপাল্লা</span>
                </button>
              </div>
            </div>
          )}

          {step === 'countdown' && (
            <div className="text-center py-8">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - countdown / 30)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-black text-slate-800">{countdown}</span>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-800 mb-2">আপনার ভোট নিশ্চিত করুন</h2>
              <p className="text-slate-500 mb-6">আপনি নির্বাচন করেছেন:</p>

              <div className="inline-block p-6 bg-slate-50 rounded-3xl mb-8">
                {selectedParty === 'rice' ? (
                  <>
                    <RiceIcon className="w-20 h-20 text-green-600 mx-auto mb-3" />
                    <p className="font-black text-xl text-slate-800">ধানের শীষ</p>
                  </>
                ) : (
                  <>
                    <ScaleIcon className="w-20 h-20 text-blue-600 mx-auto mb-3" />
                    <p className="font-black text-xl text-slate-800">দাঁড়িপাল্লা</p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCancelVote}
                  className="py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-2xl transition-all"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  ফিরে যান
                </button>
                <button
                  onClick={handleConfirmVote}
                  className="py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all transform active:scale-95"
                >
                  <i className="fas fa-check mr-2"></i>
                  নিশ্চিত করুন
                </button>
              </div>

              <p className="text-red-600 text-sm font-bold mt-4">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                {countdown} সেকেন্ড বাকি
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200">
                <i className="fas fa-check text-4xl text-white"></i>
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-4">ভোট সফল হয়েছে!</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                আপনার মূল্যবান ভোটটি গ্রহণ করা হয়েছে। দেশের গণতান্ত্রিক প্রক্রিয়ায় অংশগ্রহণের জন্য আপনাকে ধন্যবাদ।
              </p>
              <button
                onClick={handleClose}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
              >
                ফিরে যান
              </button>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default VotingModal;
