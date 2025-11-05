'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, User, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export default function ProfilePage() {
  const { t } = useLanguage()
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({ fullname: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080/api/v1';
  // ✅ Lấy thông tin profile từ backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert(t('profile.loginFirst'));
          return;
        }

        const res = await fetch(`${API_ENDPOINT}/user/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to load profile');
        }

        const data = await res.json();
        setUserData(data);
        setFormData({ fullname: data.fullName, email: data.email });
      } catch (err) {
        console.error(err);
        alert(t('profile.loadError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [t]);

  // ✅ Cập nhật thông tin người dùng
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINT}/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: formData.fullname }),
      });

      if (!res.ok) throw new Error('Update failed');
      alert(t('profile.updateSuccess'));
    } catch (err) {
      console.error(err);
      alert(t('profile.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) return <p className="p-6">{t('profile.loading')}</p>;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
          <p className="text-muted-foreground">
            {t('profile.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{t('profile.overview')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userData?.avatarUrl} alt={userData?.fullName} />
                    <AvatarFallback className="text-2xl">
                      {userData?.fullName?.charAt(0) ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{userData.fullName}</h3>
                  <p className="text-muted-foreground">{userData.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{t('profile.role')}</span>
                  </div>
                  <Badge>{userData.role}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{t('profile.joined')}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('profile.personalInfo')}</CardTitle>
              <CardDescription>
                {t('profile.personalInfoDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">{t('profile.fullName')}</Label>
                    <Input
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      placeholder={t('profile.fullNamePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('profile.email')}</Label>
                    <Input id="email" value={formData.email} disabled />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? t('profile.saving') : t('profile.saveChanges')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
