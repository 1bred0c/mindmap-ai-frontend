'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'

export const UploadReceipt = ({ onSuccess, onClose }: { onSuccess?: () => void; onClose?: () => void }) => {
    const [receiptFile, setReceiptFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleUploadReceipt = async () => {
        try {
            if (!receiptFile) {
                alert('Vui lòng chọn ảnh!')
                return
            }
            const userData = localStorage.getItem('user');
            const parsedUser = userData ? JSON.parse(userData) : null;
            const userId = parsedUser?.userId ?? 1;
            if (!userId) {
                alert('Bạn cần đăng nhập trước!')
                return
            }
            setIsUploading(true)

            // 1️⃣ Insert dòng mới -> Supabase tự tạo paymentid
            const { data: inserted, error: insertError } = await supabase
                .from('payments')
                .insert({
                    userid: Number(userId),
                    subscriptionid: null,          // hoặc số thật nếu có
                    amount: 99000,                  // hoặc số thật nếu có
                    status: 'pending',
                    paidat: new Date().toISOString(),
                })
                .select('paymentid')
                .single()

            if (insertError) throw insertError

            const paymentId = inserted.paymentid
            console.log('Tạo record payment mới:', paymentId)

            // 2️⃣ Upload file
            const ext = receiptFile.name.split('.').pop()
            const fileName = `${uuidv4()}.${ext}`
            const filePath = `payments/${paymentId}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('payment_images')
                .upload(filePath, receiptFile, {
                    contentType: receiptFile.type,
                })

            if (uploadError) throw uploadError

            // 3️⃣ Update đường dẫn ảnh vào record vừa tạo
            const { error: updateError } = await supabase
                .from('payments')
                .update({
                    payment_image_url: filePath,
                    paidat: new Date().toISOString()
                })
                .eq('paymentid', paymentId)

            if (updateError) throw updateError

            alert('🎉 Upload hóa đơn thành công!')
            setReceiptFile(null)
            onSuccess?.()
            onClose?.()
        } catch (err) {
            console.error('Upload error:', err)
            alert('Đã xảy ra lỗi khi upload!')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-3">
            <Label htmlFor="receipt">Upload Payment Receipt</Label>
            <Input id="receipt" type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} />
            {receiptFile && (
                <p className="text-sm text-muted-foreground">Selected: {receiptFile.name}</p>
            )}
            <Button onClick={handleUploadReceipt} disabled={!receiptFile || isUploading} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Đang tải...' : 'Upload Receipt'}
            </Button>
        </div>
    )
}
