'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  Card, CardHeader, CardContent, CardTitle, CardDescription
} from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, X, Eye, Users, CreditCard, AlertCircle } from 'lucide-react'

type User = {
  userid: number
  email: string
  fullname: string | null
  avatarurl: string | null
  role?: string | null
  createdat: string
}

type Payment = {
  paymentid: number
  subscriptionid?: number | null
  amount: number | null
  payment_image_url: string | null
  paidat: string | null
  status: string
  users?: {
    userid: number
    fullname: string | null
    email: string
    avatarurl: string | null
  } | null
  userid?: number | null
}

type Subscription = {
  subscriptionid: number
  userid: number
  startdate: string
  enddate: string
  status: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [imgUrls, setImgUrls] = useState<Record<number, string>>({})
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending')
  const [userPage, setUserPage] = useState(1)
  const [paymentPage, setPaymentPage] = useState(1)
  const [activeView, setActiveView] = useState<'users' | 'payments' | null>(null)
  const itemsPerPage = 10

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('users')
      .select(`
        userid,
        fullname,
        email,
        avatarurl,
        role,
        createdat,
        subscriptions (
          status,
          enddate
        )
      `)

    if (error) {
      console.error('Fetch users error:', error)
      return
    }

    const now = new Date()
    const mapped = (data || []).map((u: any) => {
      const activeSub = u.subscriptions?.find(
        (s: any) => s.status === 'active' && new Date(s.enddate) > now
      )
      return {
        ...u,
      }
    })

    setUsers(mapped)
  }, [])

  const buildSignedUrls = async (rows: Payment[]) => {
    const map: Record<number, string> = {}
    await Promise.all(
      rows.map(async (p) => {
        if (p.payment_image_url) {
          const { data, error } = await supabase.storage
            .from('payment_images')
            .createSignedUrl(p.payment_image_url, 3600)
          if (!error && data?.signedUrl) map[p.paymentid] = data.signedUrl
        }
      })
    )
    setImgUrls(map)
  }

  const fetchPayments = useCallback(async (status?: string) => {
    let query = supabase
      .from('payments')
      .select(`
        paymentid,
        userid,
        amount,
        payment_image_url,
        paidat,
        status,
        users (
          userid,
          fullname,
          email,
          avatarurl
        )
      `)
      .order('paidat', { ascending: false })

    if (status && status !== 'all') query = query.eq('status', status)

    const { data, error } = await query

    if (error) {
      console.error('Fetch payments error:', error)
      return
    }

    const transformedData: Payment[] = (data || []).map((item: any) => ({
      paymentid: item.paymentid,
      subscriptionid: item.subscriptionid,
      amount: item.amount,
      payment_image_url: item.payment_image_url,
      paidat: item.paidat,
      status: item.status,
      userid: item.userid,
      users: Array.isArray(item.users) ? item.users[0] : item.users,
    }))

    setPayments(transformedData)
    buildSignedUrls(transformedData)
  }, [])

  const fetchSubscriptions = useCallback(async () => {
    const { data, error } = await supabase.from('subscriptions').select('*')
    if (error) console.error('Fetch subscriptions error:', error)
    setSubscriptions(data || [])
  }, [])

  useEffect(() => {
    fetchUsers()
    fetchPayments(filter)
    fetchSubscriptions()
  }, [filter, fetchUsers, fetchPayments, fetchSubscriptions])

  const updatePaymentStatus = async (
    paymentId: number,
    status: 'verified' | 'rejected'
  ) => {
    try {
      console.log('Approving payment:', paymentId)

      const { data: payment, error: paymentFetchErr } = await supabase
        .from('payments')
        .select('userid')
        .eq('paymentid', paymentId)
        .single()

      if (paymentFetchErr || !payment) {
        console.error('Error fetching payment:', paymentFetchErr)
        alert('Không tìm thấy thông tin người thanh toán!')
        return
      }

      const userId = payment.userid
      console.log('Got userId:', userId)

      const { error: payErr } = await supabase
        .from('payments')
        .update({ status })
        .eq('paymentid', paymentId)

      if (payErr) throw payErr

      if (status === 'verified' && userId) {
        const now = new Date()
        const endDate = new Date()
        endDate.setDate(now.getDate() + 30)

        const { data: newSub, error: subErr } = await supabase
          .from('subscriptions')
          .insert({
            userid: userId,
            startdate: now.toISOString(),
            enddate: endDate.toISOString(),
          })
          .select('subscriptionid')
          .single()

        if (subErr) throw subErr

        await supabase
          .from('payments')
          .update({ subscriptionid: newSub.subscriptionid })
          .eq('paymentid', paymentId)

        await supabase
          .from('users')
          .update({ role: 'premium' })
          .eq('userid', userId)

        alert('Duyệt thành công và tạo gói 30 ngày cho user!')
      } else if (status === 'rejected') {
        alert('Giao dịch bị từ chối.')
      }

      fetchPayments(filter)
      fetchUsers()
      fetchSubscriptions()
    } catch (err) {
      console.error('Error approving:', err)
      alert('Đã xảy ra lỗi khi duyệt thanh toán.')
    }
  }

  return (
    <div className="p-6 space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${activeView === 'users' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setActiveView('users')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Tổng người dùng hệ thống</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
            <p className="text-xs text-muted-foreground">Tổng số gói đã đăng ký</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                subscriptions.filter(
                  (s) => new Date(s.enddate).getTime() > Date.now()
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Gói Premium còn hiệu lực</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${activeView === 'payments' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setActiveView('payments')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter((p) => p.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Chờ admin xác nhận</p>
          </CardContent>
        </Card>
      </div>

      {activeView === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>Users Management</CardTitle>
            <CardDescription>Danh sách người dùng và gói sử dụng hiện tại</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice((userPage - 1) * itemsPerPage, userPage * itemsPerPage).map((u, index) => (
                  <TableRow key={u.userid}>
                    <TableCell className="font-medium text-muted-foreground">
                      {(userPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={u.avatarurl || ''} />
                        <AvatarFallback>{u.fullname?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.fullname || 'No Name'}</span>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === 'admin' ? 'default' : 'outline'}>
                        {u.role || 'user'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(u.createdat).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Không có người dùng nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {users.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(userPage - 1) * itemsPerPage + 1} to {Math.min(userPage * itemsPerPage, users.length)} of {users.length} users
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserPage(p => Math.max(1, p - 1))}
                    disabled={userPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserPage(p => Math.min(Math.ceil(users.length / itemsPerPage), p + 1))}
                    disabled={userPage >= Math.ceil(users.length / itemsPerPage)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeView === 'payments' && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Management</CardTitle>
            <CardDescription>Lọc và xử lý giao dịch thanh toán</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
              <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>Pending</Button>
              <Button variant={filter === 'verified' ? 'default' : 'outline'} onClick={() => setFilter('verified')}>Verified</Button>
              <Button variant={filter === 'rejected' ? 'default' : 'outline'} onClick={() => setFilter('rejected')}>Rejected</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Paid At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice((paymentPage - 1) * itemsPerPage, paymentPage * itemsPerPage).map((p, index) => (
                  <TableRow key={p.paymentid}>
                    <TableCell className="font-medium text-muted-foreground">
                      {(paymentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      {p.users ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={p.users.avatarurl || ''} />
                            <AvatarFallback>{p.users.fullname?.[0] || '?'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{p.users.fullname}</p>
                            <p className="text-sm text-muted-foreground">{p.users.email}</p>
                          </div>
                        </div>
                      ) : (
                        'Unknown user'
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">
                        {p.amount ? `${p.amount.toLocaleString('vi-VN')} VND` : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {p.payment_image_url ? (
                        <a href={imgUrls[p.paymentid]} target="_blank" className="text-blue-600 underline flex items-center gap-1">
                          <Eye className="h-4 w-4" /> View
                        </a>
                      ) : (
                        'No image'
                      )}
                    </TableCell>
                    <TableCell>{p.paidat ? new Date(p.paidat).toLocaleString() : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={
                        p.status === 'pending' ? 'secondary' :
                          p.status === 'verified' ? 'default' : 'destructive'
                      }>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      {p.status === 'pending' ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updatePaymentStatus(p.paymentid, 'verified')}
                          >
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updatePaymentStatus(p.paymentid, 'rejected')}
                          >
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </>
                      ) : p.status === 'verified' ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updatePaymentStatus(p.paymentid, 'rejected')}
                        >
                          <X className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      ) : p.status === 'rejected' ? (
                        <Button
                          size="sm"
                          onClick={() => updatePaymentStatus(p.paymentid, 'verified')}
                        >
                          <Check className="h-4 w-4 mr-1" /> Active
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">No actions</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Không có giao dịch.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {payments.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(paymentPage - 1) * itemsPerPage + 1} to {Math.min(paymentPage * itemsPerPage, payments.length)} of {payments.length} payments
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaymentPage(p => Math.max(1, p - 1))}
                    disabled={paymentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaymentPage(p => Math.min(Math.ceil(payments.length / itemsPerPage), p + 1))}
                    disabled={paymentPage >= Math.ceil(payments.length / itemsPerPage)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
