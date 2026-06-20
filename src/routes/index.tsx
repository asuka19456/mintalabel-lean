'use client'

import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useServerFn } from '@tanstack/react-start'
import {
  getRequests,
  addRequest,
  updateStatus,
  deleteRequest,
  clearAllRequests,
} from '../server/labels.functions'
import { getMessages, sendMessage, clearAllMessages } from '../server/chat.functions'

export const Route = createFileRoute('/')({
  component: App,
})

// ─── Constants ───────────────────────────────────────────────────────────────

const DEPARTMENT_FACTORY_OPTIONS = [
  'Finishing - Quty 2',
  'Finishing - Quty 1',
  'Sewing - Quty 2',
  'Sewing - Quty 1',
  'Lean Staff',
]

const LINE_OPTIONS = [
  'A1','A2','A3','A4','A5','A6','A7','A8','A9','A10',
  'B1','B2','B3','B4','B5','B6','B7','B8','B9','B10',
  'C1','C2','C3','C4','C5','C6','C7','C8','C9','C10',
  'fauzan',
]

const ARTICLE_NAMES = [
  'ACORN SHPD/BROWN',
  'BARTHOLOMEW BEAR MEDIUM',
  'BENGAL TIGER/STRIPED LORANGE',
  'BLACK BEAR CUB',
  'BLAHAJ N SOFT TOY 55 BABY SHARK',
  'BLAHAJ NNN SOFT TOY 100 SHARK',
  'BLUE WHALE',
  'DJUNGELSKOG SOFT TOY 28 BROWN BEAR',
  'DJUNGELSKOG SOFT TOY BROWN BEAR',
  'FAMNIG HJARTA CUSHION 40X101 RED',
  'FLOWER-SHAPED/WHITE',
  'GOSIG GOLDEN SOFT TOY 40 DOG/GOLDEN RETRIEVER',
  'GOSIG GOLDEN SOFT TOY 70 DOG/GOLDEN RETRIEVER',
  'GOSIG RATTA SOFT TOY 23 GREY/BEIGE',
  'GREJSIMOJS SOFT TOY 100 BEAR/BEIGE',
  'GREJSIMOJS SOFT TOY 38 BEAR/OFF-WHITE',
  'JATTESTOR NNN SOFT TOY ELEPHANT/GREY',
  'JERBOA/BEIGE',
  'KRAMIG PANDA',
  'LEOPARD/PATTERNED WHITE',
  'LIVLIG HUSKY',
  'LYNX/ORANGE BROWN',
  'MINI/ORANGUTAN',
  'MINI/PANDA',
  'ORANGUTAN',
  'PENGUIN-SHAPED BLACK/WHITE',
  'PINK/FLOWER-SHAPED',
  'RED PANDA',
  'RED PANDA/MINI',
  'SANDLOPARE SOFT TOY 20 MEERKAT/BEIGE',
  'SANDLOPARE SOFT TOY 45 GIRAFFE CALF/BROWN',
  'SANDLOPARE SOFT TOY 70 GIRAFFE/BROWN',
  'SANDLOPARE SOFT TOY 8 MEERKAT/MINI BEIGE',
  'SMASLUG SOFT TOY DOG/BROWN',
  'SNAKE/BURMESE PYTHON',
  'SNUTTIG SOFT TOY 29 WHITE POLAR BEAR',
  'SNUTTIG SOFT TOY POLAR BEAR/WHITE',
  'TITTA DJUR FINGER PUPPET MIXED COLOURS 10-P',
  'TITTADJUR DEER',
  'TITTADJUR LION',
  'TITTADJUR PANDA',
  'TITTADJUR TURTLE',
  'TOADSTOOL SHAPED/RED WHITE',
  'TURTLE/GREEN',
  'VINTERFINT 2025 DECO 74 SANTA CLAUS RED',
  'VINTERFINT 2026 DECO 30 SANTA CLAUS RED',
  'VINTERFINT 2026 DECO 30 SANTA CLAUS SITTING/RED',
  'VINTERFINT 2026 DECO 65 SANTA CLAUS BROWN',
  'WHITE/CLOUD-SHAPED',
  'YELLOW/TAXI-SHAPED',
  'test',
]

const DESTINATIONS = ['EU', 'AP', 'NA-', 'ME', 'GB', 'CA', 'US']
const STATUS_OPTIONS = ['wait', 'done']
const STATUS_PASSWORD = 'fauzann'
const CLEAR_PASSWORD = 'fauzann'

type Request = {
  id: number
  departmentFactory: string
  line: string
  articleName: string
  destination: string
  week: string
  status: string
  highlight: string
  createdAt: string | null
}

type ChatMessage = {
  id: number
  departmentFactory: string
  line: string
  message: string
  createdAt: string | null
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (dept: string, line: string) => void }) {
  const [dept, setDept] = useState(() => {
    try {
      const saved = localStorage.getItem('lastDept')
      return saved && DEPARTMENT_FACTORY_OPTIONS.includes(saved) ? saved : DEPARTMENT_FACTORY_OPTIONS[0]
    } catch {
      return DEPARTMENT_FACTORY_OPTIONS[0]
    }
  })
  const [line, setLine] = useState(() => {
    try {
      const saved = localStorage.getItem('lastLine')
      return saved && LINE_OPTIONS.includes(saved) ? saved : LINE_OPTIONS[0]
    } catch {
      return LINE_OPTIONS[0]
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📋</span>
          <h1 className="text-2xl font-bold text-gray-800">Identifikasi Pengguna</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Departemen &amp; Gedung
            </label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DEPARTMENT_FACTORY_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih LINE
            </label>
            <select
              value={line}
              onChange={(e) => setLine(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LINE_OPTIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onLogin(dept, line)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Chat Sidebar ─────────────────────────────────────────────────────────────

function ChatSidebar({
  messages,
  userDept,
  userLine,
  onSend,
}: {
  messages: ChatMessage[]
  userDept: string
  userLine: string
  onSend: (msg: string) => Promise<void>
}) {
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    setSending(true)
    await onSend(input.trim())
    setInput('')
    setSending(false)
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl flex flex-col z-40">
      <div className="px-4 py-3 border-b border-gray-200 bg-blue-600 text-white">
        <h2 className="font-bold text-lg">💬 Group Chat</h2>
        <p className="text-xs opacity-80">Khusus QC + Fauzan</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => {
          const isMe = msg.departmentFactory === userDept && msg.line === userLine
          return (
            <div
              key={msg.id}
              className={`rounded-xl px-3 py-2 text-sm ${isMe ? 'bg-blue-100 ml-6' : 'bg-gray-100 mr-6'}`}
            >
              <p className="font-semibold text-gray-700 text-xs mb-1">
                {msg.departmentFactory} | {msg.line}
              </p>
              <p className="text-gray-800">{msg.message}</p>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-gray-200 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Ketik pesan..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Kirim
        </button>
      </div>
    </div>
  )
}

// ─── Request Row ──────────────────────────────────────────────────────────────

function RequestRow({
  request,
  statusUnlocked,
  onStatusChange,
  onDelete,
}: {
  request: Request
  statusUnlocked: boolean
  onStatusChange: (id: number, status: string) => void
  onDelete: (id: number) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const highlighted = request.highlight === 'YES'

  return (
    <div
      className={`rounded-xl p-4 mb-2 border transition-all ${
        highlighted
          ? 'border-red-400 bg-red-50 shadow-[0_0_15px_rgba(255,0,0,0.3)]'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="grid grid-cols-7 gap-2 items-center text-sm">
        <div className="col-span-2 font-medium text-gray-800">{request.departmentFactory}</div>
        <div className="text-gray-600 font-mono">{request.line}</div>
        <div className="col-span-2 text-gray-800">{request.articleName}</div>
        <div className="text-gray-600">{request.destination}</div>
        <div className="text-gray-600">{request.week}</div>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <select
          value={request.status}
          disabled={!statusUnlocked}
          onChange={(e) => onStatusChange(request.id, e.target.value)}
          className={`border rounded-lg px-2 py-1 text-sm ${
            request.status === 'done'
              ? 'border-green-400 bg-green-50 text-green-700'
              : 'border-yellow-400 bg-yellow-50 text-yellow-700'
          } disabled:opacity-60`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            request.status === 'done'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {request.status === 'done' ? '✓ Done' : '⏳ Waiting'}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-red-500 hover:text-red-700 text-sm border border-red-200 hover:border-red-400 px-3 py-1 rounded-lg transition-colors"
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Yakin hapus?</span>
              <button
                onClick={() => onDelete(request.id)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded transition-colors"
              >
                Ya
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded transition-colors"
              >
                Tidak
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

function App() {
  const [userDept, setUserDept] = useState('')
  const [userLine, setUserLine] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const [requests, setRequests] = useState<Request[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [showChat, setShowChat] = useState(false)
  const [lastSeenMsgId, setLastSeenMsgId] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('lastSeenMsgId') || '0', 10)
    } catch {
      return 0
    }
  })
  const [statusUnlocked, setStatusUnlocked] = useState(false)

  const [articleName, setArticleName] = useState(ARTICLE_NAMES[0])
  const [destination, setDestination] = useState(DESTINATIONS[0])
  const [week, setWeek] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  const [unlockPwd, setUnlockPwd] = useState('')
  const [clearPwd, setClearPwd] = useState('')
  const [unlockError, setUnlockError] = useState('')
  const [clearError, setClearError] = useState('')

  const getRequestsFn = useServerFn(getRequests)
  const addRequestFn = useServerFn(addRequest)
  const updateStatusFn = useServerFn(updateStatus)
  const deleteRequestFn = useServerFn(deleteRequest)
  const clearAllRequestsFn = useServerFn(clearAllRequests)
  const getMessagesFn = useServerFn(getMessages)
  const sendMessageFn = useServerFn(sendMessage)
  const clearAllMessagesFn = useServerFn(clearAllMessages)

  // Restore session from sessionStorage
  useEffect(() => {
    const dept = sessionStorage.getItem('userDept')
    const line = sessionStorage.getItem('userLine')
    if (dept && line) {
      setUserDept(dept)
      setUserLine(line)
      setLoggedIn(true)
    }
    setHydrated(true)
  }, [])

  const fetchData = useCallback(async () => {
    const [reqs, msgs] = await Promise.all([getRequestsFn(), getMessagesFn()])
    setRequests(reqs as Request[])
    setMessages(msgs as ChatMessage[])
  }, [getRequestsFn, getMessagesFn])

  // Auto-refresh every 5 seconds when logged in
  useEffect(() => {
    if (!loggedIn) return
    fetchData()
    const timer = setInterval(fetchData, 5000)
    return () => clearInterval(timer)
  }, [loggedIn, fetchData])

  // Mark messages as seen when chat is open
  useEffect(() => {
    if (showChat && messages.length > 0) {
      const maxId = Math.max(...messages.map((m) => m.id))
      setLastSeenMsgId(maxId)
      try { localStorage.setItem('lastSeenMsgId', String(maxId)) } catch { /* noop */ }
    }
  }, [showChat, messages])

  const unreadCount = messages.filter((m) => m.id > lastSeenMsgId).length

  const handleLogin = (dept: string, line: string) => {
    localStorage.setItem('lastDept', dept)
    localStorage.setItem('lastLine', line)
    sessionStorage.setItem('userDept', dept)
    sessionStorage.setItem('userLine', line)
    setUserDept(dept)
    setUserLine(line)
    setLoggedIn(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('userDept')
    sessionStorage.removeItem('userLine')
    setLoggedIn(false)
    setUserDept('')
    setUserLine('')
    setStatusUnlocked(false)
    setShowChat(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!week.trim()) return
    setSubmitting(true)
    setSubmitMsg('')
    try {
      await addRequestFn({
        data: {
          departmentFactory: userDept,
          line: userLine,
          articleName,
          destination,
          week: week.trim(),
        },
      })
      setWeek('')
      setSubmitMsg('Data berhasil ditambahkan!')
      await fetchData()
    } finally {
      setSubmitting(false)
      setTimeout(() => setSubmitMsg(''), 3000)
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    await updateStatusFn({ data: { id, status } })
    await fetchData()
  }

  const handleDelete = async (id: number) => {
    await deleteRequestFn({ data: { id } })
    await fetchData()
  }

  const handleUnlock = () => {
    if (unlockPwd === STATUS_PASSWORD) {
      setStatusUnlocked(true)
      setUnlockPwd('')
      setUnlockError('')
    } else {
      setUnlockError('Password salah!')
    }
  }

  const handleClear = async () => {
    if (clearPwd === CLEAR_PASSWORD) {
      await Promise.all([clearAllRequestsFn(), clearAllMessagesFn()])
      sessionStorage.removeItem('userDept')
      sessionStorage.removeItem('userLine')
      setLoggedIn(false)
      setUserDept('')
      setUserLine('')
      setStatusUnlocked(false)
      setShowChat(false)
      setClearPwd('')
      setClearError('')
    } else {
      setClearError('Password salah!')
    }
  }

  const handleSendMessage = async (msg: string) => {
    await sendMessageFn({ data: { departmentFactory: userDept, line: userLine, message: msg } })
    await fetchData()
  }

  // Avoid hydration flash
  if (!hydrated) return null

  if (!loggedIn) return <LoginScreen onLogin={handleLogin} />

  return (
    <div className={`min-h-screen bg-gray-50 transition-all ${showChat ? 'pr-80' : ''}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Input New Label</h1>
            <p className="text-sm text-green-600 font-medium">
              {userDept} | {userLine}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              showChat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            💬 Group Chat
            {!showChat && unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Ganti Identitas
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Minta Label Baru</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Nama Artikel
              </label>
              <select
                value={articleName}
                onChange={(e) => setArticleName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ARTICLE_NAMES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Destinasi
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ketik Week</label>
              <input
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                placeholder="Contoh: 2552"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-3 flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting || !week.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                {submitting ? 'Menambahkan...' : 'Minta Label'}
              </button>
              {submitMsg && (
                <span className="text-green-600 text-sm font-medium">✓ {submitMsg}</span>
              )}
            </div>
          </form>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📄 List Minta Label{' '}
            <span className="text-sm font-normal text-gray-500">({requests.length} item)</span>
          </h2>

          {requests.length > 0 && (
            <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 mb-2">
              <div className="col-span-2">Departemen</div>
              <div>Line</div>
              <div className="col-span-2">Artikel</div>
              <div>Dest.</div>
              <div>Week</div>
            </div>
          )}

          {requests.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Belum ada data yang disubmit.</p>
          ) : (
            <div>
              {requests.map((req) => (
                <RequestRow
                  key={req.id}
                  request={req}
                  statusUnlocked={statusUnlocked}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Unlock Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🔒 Unlock Status Editing</h2>
          {statusUnlocked ? (
            <div className="flex items-center gap-2 text-green-600">
              <span className="text-lg">🔓</span>
              <span className="font-medium">Status editing aktif</span>
              <button
                onClick={() => setStatusUnlocked(false)}
                className="ml-4 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Kunci kembali
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="password"
                value={unlockPwd}
                onChange={(e) => setUnlockPwd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="Masukkan password"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUnlock}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Unlock
              </button>
              {unlockError && <span className="text-red-600 text-sm">{unlockError}</span>}
            </div>
          )}
        </div>

        {/* Clear Cache */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
          <h2 className="text-lg font-semibold text-red-700 mb-1">⚠️ Clear Cache</h2>
          <p className="text-sm text-gray-500 mb-4">
            Menghapus semua data label dan chat. Tidak dapat dibatalkan.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="password"
              value={clearPwd}
              onChange={(e) => setClearPwd(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleClear()}
              placeholder="Masukkan password"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Clear Cache
            </button>
            {clearError && <span className="text-red-600 text-sm">{clearError}</span>}
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <ChatSidebar
          messages={messages}
          userDept={userDept}
          userLine={userLine}
          onSend={handleSendMessage}
        />
      )}
    </div>
  )
}
