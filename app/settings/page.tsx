'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThemeToggle } from '@/components/theme-toggle';
import { Bell, Mail, Shield, Palette, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export default function SettingsPage() {
  const { t } = useLanguage()
  
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
          <p className="text-muted-foreground">
            {t('settings.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>{t('settings.appearance.title')}</span>
              </CardTitle>
              <CardDescription>
                {t('settings.appearance.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('settings.appearance.theme')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.appearance.themeDescription')}
                  </p>
                </div>
                <ThemeToggle />
              </div>
              
              <div className="space-y-2">
                <Label>{t('settings.appearance.language')}</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder={t('settings.appearance.selectLanguage')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>{t('settings.notifications.title')}</span>
              </CardTitle>
              <CardDescription>
                {t('settings.notifications.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('settings.notifications.email')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.notifications.emailDescription')}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('settings.notifications.push')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.notifications.pushDescription')}
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('settings.notifications.marketing')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.notifications.marketingDescription')}
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>{t('settings.privacy.title')}</span>
              </CardTitle>
              <CardDescription>
                {t('settings.privacy.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('settings.privacy.publicProfile')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.privacy.publicProfileDescription')}
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('settings.privacy.twoFactor')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.privacy.twoFactorDescription')}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {t('settings.privacy.enable')}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('settings.privacy.dataExport')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.privacy.dataExportDescription')}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {t('settings.privacy.export')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Workspace */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>{t('settings.workspace.title')}</span>
              </CardTitle>
              <CardDescription>
                {t('settings.workspace.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t('settings.workspace.defaultView')}</Label>
                <Select defaultValue="grid">
                  <SelectTrigger>
                    <SelectValue placeholder={t('settings.workspace.selectDefaultView')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">{t('settings.workspace.gridView')}</SelectItem>
                    <SelectItem value="list">{t('settings.workspace.listView')}</SelectItem>
                    <SelectItem value="kanban">{t('settings.workspace.kanbanView')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('settings.workspace.autoSave')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.workspace.autoSaveDescription')}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('settings.workspace.collaboration')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.workspace.collaborationDescription')}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button>
            {t('settings.saveAll')}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}