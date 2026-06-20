'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ChevronLeft, Camera, Calendar, MapPin, Mail, Phone, Crosshair, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  gender: z.enum(['Male', 'Female', 'Other']),
  dob: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id || user?._id],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/profile');
      return res.data.data || res.data;
    },
    enabled: !!(user?.id || user?._id),
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      gender: 'Male',
      dob: '',
      location: '',
      phone: '',
      profileImage: '',
    }
  });

  const watchUsername = watch('username');
  const watchGender = watch('gender');
  const watchProfileImage = watch('profileImage');
  const watchFirstName = watch('firstName');

  const [usernameStatus, setUsernameStatus] = useState<{available: boolean | null, checking: boolean, suggestions: string[]}>({ available: null, checking: false, suggestions: [] });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (profile || user) {
      const fullName = profile?.name || user?.name || '';
      const nameParts = fullName.split(' ');
      const fName = nameParts[0] || '';
      const lName = nameParts.slice(1).join(' ') || '';

      setValue('firstName', fName);
      setValue('lastName', lName);
      setValue('username', profile?.username || user?.username || '');
      setValue('gender', profile?.gender || 'Male');
      setValue('dob', profile?.dob || '');
      setValue('location', profile?.location || '');
      setValue('phone', profile?.phone || user?.phone || '');
      setValue('profileImage', profile?.profileImage || user?.profileImage || '');
    }
  }, [profile, user, setValue]);



  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const payload: any = {
        name: `${data.firstName} ${data.lastName || ''}`.trim(),
        username: data.username,
        gender: data.gender,
        profileImage: data.profileImage,
        dob: data.dob,
        location: data.location,
      };

      // Only send phone if it has a value, to avoid "phone not allowed to be empty" backend error
      if (data.phone && data.phone.trim() !== '') {
        payload.phone = data.phone;
      }

      const res = await axiosInstance.put('/user/profile', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?._id] });
      router.push('/profile');
    },
    onError: (error: any) => {
      let msg = 'Failed to update profile';
      if (error.response?.data) {
        if (typeof error.response.data.message === 'string') {
          msg = error.response.data.message;
        } else if (error.response.data.error) {
          msg = error.response.data.error;
        } else {
          msg = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        msg = error.message;
      }
      toast.error(msg);
      console.error('Profile update error response:', error.response?.data || error);
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate(data);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('profileImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-[85vh] py-8 lg:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => router.push('/profile')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group w-fit">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back to Dashboard</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-1/4 shrink-0 space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
              <p className="text-white/50 mt-2 text-sm leading-relaxed">
                Manage your account settings, personal details, and preferences to customize your experience.
              </p>
            </div>

            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
              <button className="shrink-0 text-left px-5 py-3.5 rounded-xl bg-blue-600/10 text-blue-500 font-semibold border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all">
                Personal Info
              </button>
              <button onClick={() => router.push('/settings/notifications')} className="shrink-0 text-left px-5 py-3.5 rounded-xl hover:bg-white/5 text-white/60 font-medium transition-colors">
                Notifications
              </button>
              <button onClick={() => router.push('/settings/terms')} className="shrink-0 text-left px-5 py-3.5 rounded-xl hover:bg-white/5 text-white/60 font-medium transition-colors">
                Terms & Support
              </button>
            </nav>
          </div>

          {/* Main Form Area */}
          <div className="w-full lg:w-3/4">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-[#0A0A0A] border border-white/[0.08] rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -mt-20 -mr-20" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/5 relative z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white">Profile Details</h2>
                  <p className="text-sm text-white/40 mt-1">Update your photo and personal information.</p>
                </div>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] shrink-0 flex items-center justify-center gap-2"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>

              <div className="space-y-12 relative z-10">
                
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                  <div className="relative shrink-0">
                    <div className="w-32 h-32 rounded-full bg-slate-900 overflow-hidden flex items-center justify-center border-[6px] border-[#111111] shadow-2xl">
                      {watchProfileImage ? (
                        <img src={watchProfileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-4xl font-bold text-white/30">
                          {watchFirstName ? watchFirstName.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <label htmlFor="profileImageInput" className="absolute bottom-1 right-1 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer border-[3px] border-[#0A0A0A] hover:bg-blue-500 transition-colors shadow-lg hover:scale-105 transform duration-200">
                      <Camera className="w-4 h-4 text-white" />
                    </label>
                    <input id="profileImageInput" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Profile Photo</h3>
                    <p className="text-sm text-white/40 mt-1 mb-4 max-w-sm">We recommend an image of at least 400x400. You can upload a JPG, GIF, or PNG file.</p>
                    <button type="button" className="text-sm text-blue-500 font-medium hover:text-blue-400 transition-colors" onClick={() => document.getElementById('profileImageInput')?.click()}>
                      Upload New Photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* First Name */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold tracking-widest text-white/40 uppercase">First Name</label>
                    <input 
                      {...register('firstName')}
                      type="text" 
                      className={`w-full bg-white/[0.03] border ${errors.firstName ? 'border-red-500/50' : 'border-white/[0.05]'} rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder:text-white/20 hover:bg-white/[0.05]`}
                      placeholder="Enter first name"
                      disabled={updateMutation.isPending}
                    />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold tracking-widest text-white/40 uppercase">Last Name</label>
                    <input 
                      {...register('lastName')}
                      type="text" 
                      className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder:text-white/20 hover:bg-white/[0.05]"
                      placeholder="Enter last name"
                      disabled={updateMutation.isPending}
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2.5 md:col-span-2 opacity-70">
                    <label className="text-xs font-bold tracking-widest text-white/40 uppercase flex justify-between">
                      <span>Username / Nickname</span>
                      <span className="text-blue-400 font-normal normal-case">Cannot be changed</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-5 text-white/30 font-bold">@</span>
                      <input 
                        {...register('username')}
                        type="text" 
                        className="w-full bg-black/20 border border-white/[0.05] rounded-xl pl-12 pr-5 py-4 text-sm text-white/50 cursor-not-allowed focus:outline-none"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold tracking-widest text-white/40 uppercase">Gender</label>
                    <div className="flex bg-white/[0.02] p-1.5 rounded-xl border border-white/[0.05]">
                      {['Male', 'Female', 'Other'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setValue('gender', g as any, { shouldValidate: true })}
                          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                            watchGender === g ? 'bg-[#222222] text-white shadow-md border border-white/10' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
                          }`}
                          disabled={updateMutation.isPending}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold tracking-widest text-white/40 uppercase">Date of Birth</label>
                    <div className="relative flex items-center group">
                      <Calendar className="absolute left-5 w-4 h-4 text-white/30 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        {...register('dob')}
                        type="date" 
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-12 pr-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder:text-white/20 hover:bg-white/[0.05] [color-scheme:dark]"
                        disabled={updateMutation.isPending}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2.5 md:col-span-2">
                    <label className="text-xs font-bold tracking-widest text-white/40 uppercase">Location</label>
                    <div className="relative flex items-center group">
                      <MapPin className="absolute left-5 w-4 h-4 text-white/30 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        {...register('location')}
                        type="text" 
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-12 pr-14 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder:text-white/20 hover:bg-white/[0.05]"
                        placeholder="e.g. Mumbai, India"
                        disabled={updateMutation.isPending}
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          if (navigator.geolocation) {
                            const toastId = toast.loading('Fetching location...');
                            navigator.geolocation.getCurrentPosition(
                              async (position) => {
                                try {
                                  const { latitude, longitude } = position.coords;
                                  // Reverse geocoding using free Nominatim API
                                  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                                  const data = await res.json();
                                  if (data && data.address) {
                                    const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
                                    const country = data.address.country || '';
                                    const locString = [city, country].filter(Boolean).join(', ');
                                    if (locString) {
                                      setValue('location', locString, { shouldValidate: true });
                                      toast.success('Location updated', { id: toastId });
                                    } else {
                                      throw new Error('Location not detailed enough');
                                    }
                                  } else {
                                    throw new Error('Address not found');
                                  }
                                } catch (error) {
                                  toast.error('Failed to resolve location address', { id: toastId });
                                }
                              },
                              (error) => {
                                let msg = 'Location access denied';
                                if (error.code === 2) msg = 'Location unavailable';
                                else if (error.code === 3) msg = 'Location request timed out';
                                toast.error(msg, { id: toastId });
                              },
                              { timeout: 10000, maximumAge: 0 }
                            );
                          } else {
                            toast.error('Geolocation not supported by this browser');
                          }
                        }}
                        className="absolute right-3 p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors group cursor-pointer" 
                        disabled={updateMutation.isPending}
                        title="Use my current location"
                      >
                        <Crosshair className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                    <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-green-500/20">Protected</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 flex items-center justify-between hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white/40 mb-0.5">Email Address</p>
                          <p className="text-sm font-semibold text-white">{profile?.email || user?.email || 'Not provided'}</p>
                        </div>
                      </div>
                      <button type="button" className="text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-wider cursor-pointer">Verify</button>
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 flex items-center justify-between hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white/40 mb-0.5">Phone Number</p>
                          <p className="text-sm font-semibold text-white">{profile?.phone || user?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      <button type="button" className="text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-wider cursor-pointer">Verify</button>
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
